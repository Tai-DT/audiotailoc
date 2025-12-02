import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  UseGuards,
  Req,
  Logger,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiQuery,
  ApiBody,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AiService, ChatbotResponse, ProductRecommendation, SearchSuggestion } from './ai.service';
import { AdminGuard } from '../auth/admin.guard';

/**
 * AI Controller
 * Handles AI-powered features like recommendations, Q&A, and chatbot
 */

@ApiTags('AI')
@Controller('api/v1/ai')
export class AiController {
  private readonly logger = new Logger(AiController.name);

  constructor(private readonly aiService: AiService) {}

  /**
   * Get product recommendations
   * GET /api/v1/ai/recommendations
   */
  @Get('recommendations')
  @ApiOperation({
    summary: 'Get AI product recommendations',
    description: 'Get personalized product recommendations based on user preferences',
  })
  @ApiQuery({ name: 'category', description: 'Category filter', type: String, required: false })
  @ApiQuery({ name: 'minBudget', description: 'Minimum budget', type: Number, required: false })
  @ApiQuery({ name: 'maxBudget', description: 'Maximum budget', type: Number, required: false })
  @ApiQuery({ name: 'brand', description: 'Brand filter', type: String, required: false })
  @ApiQuery({ name: 'limit', description: 'Number of recommendations', type: Number, required: false, example: 5 })
  @ApiResponse({ status: 200, description: 'Product recommendations' })
  async getRecommendations(
    @Query('category') category?: string,
    @Query('minBudget') minBudget?: string,
    @Query('maxBudget') maxBudget?: string,
    @Query('brand') brand?: string,
    @Query('limit') limit?: string,
    @Req() req?: any,
  ): Promise<{ success: boolean; data: ProductRecommendation[] }> {
    try {
      const limitNum = limit ? Math.min(20, parseInt(limit)) : 5;
      const userId = req?.users?.sub || undefined;

      const preferences = {
        category,
        brand,
        budget:
          minBudget || maxBudget
            ? {
                min: minBudget ? parseFloat(minBudget) : 0,
                max: maxBudget ? parseFloat(maxBudget) : 999999,
              }
            : undefined,
      };

      const recommendations = await this.aiService.getProductRecommendations(
        userId,
        preferences,
        limitNum,
      );

      return { success: true, data: recommendations };
    } catch (error) {
      this.logger.error('Error getting recommendations:', error);
      throw new HttpException('Failed to get recommendations', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Get search suggestions
   * GET /api/v1/ai/suggestions
   */
  @Get('suggestions')
  @ApiOperation({
    summary: 'Get AI search suggestions',
    description: 'Get autocomplete search suggestions based on partial query',
  })
  @ApiQuery({ name: 'q', description: 'Search query', type: String, required: true })
  @ApiQuery({ name: 'limit', description: 'Number of suggestions', type: Number, required: false, example: 5 })
  @ApiResponse({ status: 200, description: 'Search suggestions' })
  async getSearchSuggestions(
    @Query('q') query: string,
    @Query('limit') limit?: string,
  ): Promise<{ success: boolean; data: SearchSuggestion[] }> {
    try {
      if (!query || query.trim().length === 0) {
        return { success: true, data: [] };
      }

      const limitNum = limit ? Math.min(20, parseInt(limit)) : 5;
      const suggestions = await this.aiService.getSearchSuggestions(query, limitNum);

      return { success: true, data: suggestions };
    } catch (error) {
      this.logger.error('Error getting search suggestions:', error);
      throw new HttpException('Failed to get suggestions', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Chatbot endpoint
   * POST /api/v1/ai/chat
   */
  @Post('chat')
  @ApiOperation({
    summary: 'AI Chatbot',
    description: 'Get AI-powered chatbot responses with product recommendations',
  })
  @ApiBody({
    description: 'Chat message',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', description: 'User message' },
        conversationHistory: {
          type: 'array',
          description: 'Conversation history',
          items: {
            type: 'object',
            properties: {
              role: { type: 'string', enum: ['user', 'assistant'] },
              content: { type: 'string' },
            },
          },
        },
      },
      required: ['message'],
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Chatbot response',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
        data: {
          type: 'object',
          properties: {
            message: { type: 'string' },
            suggestedProducts: { type: 'array' },
            suggestedSearches: { type: 'array' },
            confidence: { type: 'number' },
          },
        },
      },
    },
  })
  async chat(
    @Body()
    body: {
      message: string;
      conversationHistory?: Array<{ role: string; content: string }>;
    },
    @Req() req?: any,
  ): Promise<{ success: boolean; data: ChatbotResponse }> {
    try {
      if (!body.message || body.message.trim().length === 0) {
        throw new HttpException('Message cannot be empty', HttpStatus.BAD_REQUEST);
      }

      const userId = req?.users?.sub || undefined;
      const response = await this.aiService.chatbot(
        body.message,
        body.conversationHistory,
        userId,
      );

      return { success: true, data: response };
    } catch (error) {
      this.logger.error('Chatbot error:', error);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Chatbot request failed', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Analyze user message
   * POST /api/v1/ai/analyze
   */
  @Post('analyze')
  @ApiBearerAuth()
  @UseGuards(AdminGuard)
  @ApiOperation({
    summary: 'Analyze user message',
    description: 'Analyze sentiment, keywords, and intent of user message',
  })
  @ApiBody({
    description: 'Message to analyze',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string' },
      },
      required: ['message'],
    },
  })
  @ApiResponse({ status: 200, description: 'Analysis results' })
  async analyzeMessage(
    @Body() body: { message: string },
  ) {
    try {
      if (!body.message) {
        throw new HttpException('Message is required', HttpStatus.BAD_REQUEST);
      }

      const analysis = await this.aiService.analyzeMessage(body.message);
      return { success: true, data: analysis };
    } catch (error) {
      this.logger.error('Error analyzing message:', error);
      throw new HttpException('Analysis failed', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Check AI service status
   * GET /api/v1/ai/status
   */
  @Get('status')
  @ApiOperation({
    summary: 'AI Service Status',
    description: 'Check if AI features are available and configured',
  })
  @ApiResponse({ status: 200, description: 'Service status' })
  getStatus() {
    return {
      success: true,
      data: {
        geminiAvailable: this.aiService.isGeminiAvailable(),
        timestamp: new Date().toISOString(),
      },
    };
  }

  /**
   * Advanced recommendation endpoint
   * POST /api/v1/ai/recommendations/advanced
   */
  @Post('recommendations/advanced')
  @ApiBearerAuth()
  @UseGuards(AdminGuard)
  @ApiOperation({
    summary: 'Advanced product recommendations',
    description: 'Get recommendations with advanced filtering criteria',
  })
  @ApiBody({
    description: 'Recommendation filters',
    schema: {
      type: 'object',
      properties: {
        category: { type: 'string' },
        minBudget: { type: 'number' },
        maxBudget: { type: 'number' },
        brand: { type: 'string' },
        searchHistory: { type: 'array', items: { type: 'string' } },
        limit: { type: 'number' },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Advanced recommendations' })
  async getAdvancedRecommendations(
    @Body()
    filters: {
      category?: string;
      minBudget?: number;
      maxBudget?: number;
      brand?: string;
      searchHistory?: string[];
      limit?: number;
    },
    @Req() req?: any,
  ) {
    try {
      const userId = req?.users?.sub || undefined;
      const limitNum = Math.min(20, filters.limit || 5);

      const preferences = {
        category: filters.category,
        brand: filters.brand,
        budget:
          filters.minBudget || filters.maxBudget
            ? {
                min: filters.minBudget || 0,
                max: filters.maxBudget || 999999,
              }
            : undefined,
        searchHistory: filters.searchHistory,
      };

      const recommendations = await this.aiService.getProductRecommendations(
        userId,
        preferences,
        limitNum,
      );

      return { success: true, data: recommendations };
    } catch (error) {
      this.logger.error('Error getting advanced recommendations:', error);
      throw new HttpException(
        'Failed to get recommendations',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Multi-turn conversation endpoint
   * POST /api/v1/ai/conversation
   */
  @Post('conversation')
  @ApiOperation({
    summary: 'Multi-turn conversation',
    description: 'Continue a multi-turn conversation with the AI assistant',
  })
  @ApiBody({
    description: 'Conversation request',
    schema: {
      type: 'object',
      properties: {
        conversationId: { type: 'string' },
        message: { type: 'string' },
        history: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              role: { type: 'string' },
              content: { type: 'string' },
            },
          },
        },
      },
      required: ['message'],
    },
  })
  @ApiResponse({ status: 200, description: 'Conversation response' })
  async conversation(
    @Body()
    body: {
      conversationId?: string;
      message: string;
      history?: Array<{ role: string; content: string }>;
    },
    @Req() req?: any,
  ) {
    try {
      const userId = req?.users?.sub || undefined;

      const response = await this.aiService.chatbot(
        body.message,
        body.history,
        userId,
      );

      return {
        success: true,
        data: {
          conversationId: body.conversationId,
          ...response,
        },
      };
    } catch (error) {
      this.logger.error('Conversation error:', error);
      throw new HttpException('Conversation failed', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
