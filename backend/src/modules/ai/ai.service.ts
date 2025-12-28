import { Injectable, Logger, BadRequestException, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';
import axios from 'axios';

/**
 * AI Service
 * Integrates with Google Gemini API through Antigravity proxy for recommendations, Q&A, and chatbot functionality
 */

export interface ProductRecommendation {
  id: string;
  name: string;
  slug: string;
  price: number;
  image?: string;
  reason: string;
  relevanceScore: number;
}

export interface SearchSuggestion {
  query: string;
  category?: string;
  confidence: number;
}

export interface ChatbotResponse {
  message: string;
  suggestedProducts?: ProductRecommendation[];
  suggestedSearches?: SearchSuggestion[];
  confidence: number;
  conversationContext?: any;
}

export interface AIAnalysis {
  sentiment: 'positive' | 'negative' | 'neutral';
  keywords: string[];
  intent: string;
  confidence: number;
}

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);
  private readonly geminiApiKey: string;
  private readonly geminiModel: string;
  private readonly maxTokens = 1000;

  constructor(
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {
    this.geminiApiKey = this.configService.get<string>('GOOGLE_GEMINI_API_KEY') || '';
    this.geminiModel = this.configService.get<string>('GEMINI_MODEL') || 'gemini-1.5-flash';

    if (!this.geminiApiKey) {
      this.logger.warn('GOOGLE_GEMINI_API_KEY not configured - AI features will be limited');
    } else {
      this.logger.log(`AI Service initialized with standard Gemini API (Model: ${this.geminiModel})`);
    }
  }

  /**
   * Get product recommendations based on user preference
   */
  async getProductRecommendations(
    userId?: string,
    preferences?: {
      category?: string;
      budget?: { min: number; max: number };
      brand?: string;
      searchHistory?: string[];
    },
    limit: number = 5,
  ): Promise<ProductRecommendation[]> {
    try {
      // Build product filter
      const where: any = {
        isDeleted: false,
        isActive: true,
      };

      if (preferences?.category) {
        where.categoryId = preferences.category;
      }

      if (preferences?.budget) {
        where.priceCents = {
          gte: Math.round(preferences.budget.min * 100),
          lte: Math.round(preferences.budget.max * 100),
        };
      }

      if (preferences?.brand) {
        where.brand = preferences.brand;
      }

      // Fetch products
      const products = await this.prisma.products.findMany({
        where,
        select: {
          id: true,
          name: true,
          slug: true,
          priceCents: true,
          imageUrl: true,
          description: true,
          viewCount: true,
          cart_items: { select: { id: true } },
        },
        take: limit * 2, // Fetch extra to filter
      });

      // Score products
      const scoredProducts = products.map(product => ({
        ...product,
        score: this.calculateProductScore(product, preferences?.searchHistory || []),
      }));

      // Sort by score and return top results
      const recommendations = scoredProducts
        .sort((a, b) => b.score - a.score)
        .slice(0, limit)
        .map(product => ({
          id: product.id,
          name: product.name,
          slug: product.slug,
          price: Number(product.priceCents) / 100,
          image: product.imageUrl || undefined,
          reason: this.generateRecommendationReason(product, preferences?.searchHistory || []),
          relevanceScore: product.score,
        }));

      this.logger.log(
        `Generated ${recommendations.length} product recommendations for user ${userId || 'anonymous'}`,
      );
      return recommendations;
    } catch (error) {
      this.logger.error('Error generating product recommendations:', error);
      throw error;
    }
  }

  /**
   * Get AI-powered search suggestions
   */
  async getSearchSuggestions(query: string, limit: number = 5): Promise<SearchSuggestion[]> {
    try {
      if (!query || query.trim().length === 0) {
        return [];
      }

      const normalizedQuery = query.trim().toLowerCase();

      // Try to use AI if available
      if (this.geminiApiKey) {
        try {
          const aiSuggestions = await this.generateAISuggestions(normalizedQuery);
          return aiSuggestions.slice(0, limit);
        } catch (error) {
          this.logger.warn('Failed to generate AI suggestions, falling back to database:', error);
        }
      }

      // Fallback to database-based suggestions
      return await this.generateDatabaseSuggestions(normalizedQuery, limit);
    } catch (error) {
      this.logger.error('Error generating search suggestions:', error);
      return [];
    }
  }

  /**
   * Chatbot response generation
   */
  async chatbot(
    userMessage: string,
    conversationHistory?: Array<{ role: string; content: string }>,
    userId?: string,
  ): Promise<ChatbotResponse> {
    try {
      if (!userMessage || userMessage.trim().length === 0) {
        throw new BadRequestException('Message cannot be empty');
      }

      // SECURITY: Validate input length to prevent DoS attacks
      const MAX_MESSAGE_LENGTH = 5000; // Maximum message length in characters
      if (userMessage.length > MAX_MESSAGE_LENGTH) {
        throw new BadRequestException(
          `Message is too long. Maximum allowed length is ${MAX_MESSAGE_LENGTH} characters.`,
        );
      }

      // SECURITY: Validate conversation history length
      if (conversationHistory && conversationHistory.length > 50) {
        throw new BadRequestException(
          'Conversation history is too long. Maximum allowed is 50 messages.',
        );
      }

      // SECURITY: Validate individual history message lengths
      if (conversationHistory) {
        for (const msg of conversationHistory) {
          if (msg.content && msg.content.length > MAX_MESSAGE_LENGTH) {
            throw new BadRequestException(
              `Conversation history contains a message that is too long. Maximum allowed length is ${MAX_MESSAGE_LENGTH} characters.`,
            );
          }
        }
      }

      // Analyze user message
      const analysis = await this.analyzeMessage(userMessage);

      let response: ChatbotResponse;

      if (this.geminiApiKey) {
        // Use AI-powered response
        response = await this.generateAIChatResponse(userMessage, conversationHistory);
      } else {
        // Use rule-based response
        response = await this.generateRuleBasedChatResponse(userMessage);
      }

      // Add product recommendations based on intent
      if (['product_recommendation', 'shopping', 'question'].includes(analysis.intent)) {
        response.suggestedProducts = await this.getProductRecommendations(userId, undefined, 3);
      }

      // Add search suggestions
      if (analysis.keywords.length > 0) {
        response.suggestedSearches = await this.getSearchSuggestions(analysis.keywords[0], 3);
      }

      this.logger.log(`Chatbot response generated for user ${userId || 'anonymous'}`);
      return response;
    } catch (error) {
      this.logger.error('Error generating chatbot response:', error);
      throw error;
    }
  }

  /**
   * Analyze message sentiment and intent
   */
  async analyzeMessage(message: string): Promise<AIAnalysis> {
    try {
      const lowerMessage = message.toLowerCase();

      // Simple sentiment analysis (in production, use more sophisticated approach)
      let sentiment: 'positive' | 'negative' | 'neutral' = 'neutral';
      if (/(love|great|excellent|perfect|amazing|best)/.test(lowerMessage)) {
        sentiment = 'positive';
      } else if (/(hate|bad|terrible|worst|problem|issue|broken)/.test(lowerMessage)) {
        sentiment = 'negative';
      }

      // Extract keywords
      const keywords = this.extractKeywords(message);

      // Determine intent
      let intent = 'general';
      if (/(recommend|suggestion|suggest|what.*buy|looking for)/.test(lowerMessage)) {
        intent = 'product_recommendation';
      } else if (/(how|what|why|when|where)/.test(lowerMessage)) {
        intent = 'question';
      } else if (/(buy|purchase|order|checkout)/.test(lowerMessage)) {
        intent = 'shopping';
      } else if (/(help|support|issue|problem)/.test(lowerMessage)) {
        intent = 'support';
      }

      return {
        sentiment,
        keywords,
        intent,
        confidence: 0.7, // Simplified confidence score
      };
    } catch (error) {
      this.logger.error('Error analyzing message:', error);
      return {
        sentiment: 'neutral',
        keywords: [],
        intent: 'general',
        confidence: 0,
      };
    }
  }

  /**
   * Generate AI-powered chatbot response using Gemini
   */
  private async generateAIChatResponse(
    userMessage: string,
    conversationHistory?: Array<{ role: string; content: string }>,
  ): Promise<ChatbotResponse> {
    try {
      const systemPrompt = `You are a helpful AI assistant for an audio equipment e-commerce store.
You help customers find products, answer questions about audio equipment, services, and blog articles.
Keep responses concise and friendly. If the user asks about specific products or services,
recommend products from the store when relevant.`;

      const conversationMessages = [...(conversationHistory || []), { role: 'user', content: userMessage }];

      // Google Gemini Format
      // Map roles for Gemini: 'assistant' -> 'model'
      const contents = conversationMessages.map(msg => ({
        role: msg.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: msg.content }]
      }));

      // Add system prompt to the first message if possible, or prepend it
      if (contents.length > 0 && contents[0].role === 'user') {
        contents[0].parts[0].text = `${systemPrompt}\n\n${contents[0].parts[0].text}`;
      }

      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${this.geminiModel}:generateContent`;

      const response = await axios.post(
        `${apiUrl}?key=${this.geminiApiKey}`,
        {
          contents,
          generationConfig: {
            maxOutputTokens: this.maxTokens,
            temperature: 0.7,
          },
        },
        { timeout: 15000 },
      );

      const content = response.data?.candidates?.[0]?.content?.parts?.[0]?.text || 'I could not generate a response.';

      return {
        message: content,
        confidence: 0.8,
        conversationContext: { messageCount: conversationMessages.length },
      };
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        this.logger.error('Gemini API Error:', error.response.data);
        const errorMessage = error.response.data?.error?.message || 'Gemini API failed';
        const statusCode = error.response.status || HttpStatus.INTERNAL_SERVER_ERROR;
        throw new HttpException(errorMessage, statusCode);
      }
      this.logger.error('Error generating AI response:', error);
      throw new HttpException('Failed to generate AI response', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Generate rule-based chatbot response (fallback)
   */
  private async generateRuleBasedChatResponse(userMessage: string): Promise<ChatbotResponse> {
    const lowerMessage = userMessage.toLowerCase();

    let message = '';

    if (/(hello|hi|hey)/.test(lowerMessage)) {
      message = 'Hello! Welcome to our audio equipment store. How can I help you today?';
    } else if (/(recommend|suggestion|what.*buy)/.test(lowerMessage)) {
      message =
        'I can help you find the perfect audio equipment. Could you tell me more about your needs? What type of equipment are you interested in?';
    } else if (/(price|cost|how much)/.test(lowerMessage)) {
      message =
        'Our products range from budget-friendly options to premium equipment. Could you specify what type of product you are looking for?';
    } else if (/(shipping|delivery|when)/.test(lowerMessage)) {
      message =
        'We offer fast shipping for most orders. For specific delivery times, please contact our support team.';
    } else if (/(contact|support|help)/.test(lowerMessage)) {
      message = 'You can reach our support team through our website or email. We are here to help!';
    } else {
      message =
        'Thank you for your message. I can help you find products, answer questions about our services, or assist with your order. What would you like to know?';
    }

    return {
      message,
      confidence: 0.6,
    };
  }

  /**
   * Generate AI suggestions using Gemini
   */
  private async generateAISuggestions(query: string): Promise<SearchSuggestion[]> {
    try {
      const prompt = `Generate 5 search suggestions for the query "${query}" in JSON format.
Return array with objects containing "query" and "confidence" (0-1). Keep suggestions relevant to audio equipment.`;

      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${this.geminiModel}:generateContent`;

      const response = await axios.post(
        `${apiUrl}?key=${this.geminiApiKey}`,
        {
          contents: [
            {
              parts: [
                {
                  text: prompt,
                },
              ],
            },
          ],
          generationConfig: {
            maxOutputTokens: 500,
            temperature: 0.7,
          },
        },
        { timeout: 10000 },
      );

      const content = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!content) {
        return [];
      }

      // Extract JSON from response
      const jsonMatch = content.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        const suggestions = JSON.parse(jsonMatch[0]);
        return Array.isArray(suggestions) ? suggestions.slice(0, 5) : [];
      }

      return [];
    } catch (error) {
      this.logger.error('Error generating AI suggestions:', error);
      return [];
    }
  }

  /**
   * Generate database-based suggestions (fallback)
   */
  private async generateDatabaseSuggestions(
    query: string,
    limit: number,
  ): Promise<SearchSuggestion[]> {
    try {
      // Get products matching query
      const products = await this.prisma.products.findMany({
        where: {
          OR: [
            { name: { contains: query, mode: 'insensitive' } },
            { brand: { contains: query, mode: 'insensitive' } },
          ],
        },
        select: { name: true, brand: true },
        take: limit,
      });

      return products
        .map(product => ({
          query: product.name || query,
          category: product.brand || undefined,
          confidence: 0.7,
        }))
        .slice(0, limit);
    } catch (error) {
      this.logger.error('Error generating database suggestions:', error);
      return [];
    }
  }

  /**
   * Calculate product score for recommendations
   */
  private calculateProductScore(product: any, searchHistory: string[]): number {
    let score = 0;

    // View count score (0-30)
    score += Math.min(30, (product.viewCount || 0) / 10);

    // Review rating score (0-30)
    if (product.reviews && product.reviews.length > 0) {
      const avgRating =
        product.reviews.reduce((sum: number, r: any) => sum + r.rating, 0) / product.reviews.length;
      score += avgRating * 6; // Max 30 points
    }

    // Cart popularity score (0-20)
    score += Math.min(20, (product.cartItems?.length || 0) * 2);

    // Search history match score (0-20)
    if (searchHistory.length > 0) {
      const hasMatch = searchHistory.some(term =>
        product.name.toLowerCase().includes(term.toLowerCase()),
      );
      if (hasMatch) {
        score += 20;
      }
    }

    return score;
  }

  /**
   * Generate recommendation reason
   */
  private generateRecommendationReason(product: any, searchHistory: string[]): string {
    const reasons: string[] = [];

    if (product.viewCount > 100) {
      reasons.push('Popular choice');
    }

    if (product.reviews && product.reviews.length > 0) {
      const avgRating =
        product.reviews.reduce((sum: number, r: any) => sum + r.rating, 0) / product.reviews.length;
      if (avgRating >= 4.5) {
        reasons.push('Highly rated');
      }
    }

    if (product.cartItems && product.cartItems.length > 20) {
      reasons.push('Best seller');
    }

    if (searchHistory.some(term => product.name.toLowerCase().includes(term.toLowerCase()))) {
      reasons.push('Matches your interests');
    }

    return reasons.length > 0 ? reasons.join(', ') : 'Recommended for you';
  }

  /**
   * Extract keywords from text
   */
  private extractKeywords(text: string): string[] {
    // Simple keyword extraction (in production, use NLP library)
    const words = text.toLowerCase().split(/\s+/);
    const stopWords = new Set([
      'the',
      'a',
      'an',
      'and',
      'or',
      'but',
      'in',
      'on',
      'at',
      'to',
      'for',
      'of',
      'is',
      'are',
      'was',
      'were',
    ]);

    return words.filter(word => word.length > 3 && !stopWords.has(word)).slice(0, 5);
  }

  /**
   * Check if Gemini API is available
   */
  isGeminiAvailable(): boolean {
    return !!this.geminiApiKey;
  }
}
