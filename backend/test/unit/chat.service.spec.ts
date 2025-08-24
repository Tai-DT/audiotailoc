import { Test, TestingModule } from '@nestjs/testing';
import { ChatService } from '../../src/modules/chat/chat.service';
import { AiService } from '../../src/modules/ai/ai.service';
import { CacheService } from '../../src/modules/cache/cache.service';
import { PrismaService } from '../../src/prisma/prisma.service';

describe('ChatService', () => {
  let service: ChatService;
  let aiService: AiService;
  let cacheService: CacheService;
  let prismaService: PrismaService;

  const mockAiService = {
    chat: jest.fn(),
  };

  const mockCacheService = {
    get: jest.fn(),
    set: jest.fn(),
  };

  const mockPrismaService = {
    chatSession: {
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      count: jest.fn(),
      findMany: jest.fn(),
    },
    chatMessage: {
      create: jest.fn(),
    },
    $transaction: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChatService,
        {
          provide: AiService,
          useValue: mockAiService,
        },
        {
          provide: CacheService,
          useValue: mockCacheService,
        },
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<ChatService>(ChatService);
    aiService = module.get<AiService>(AiService);
    cacheService = module.get<CacheService>(CacheService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('listSessions', () => {
    it('should list chat sessions with pagination', async () => {
      const params = {
        status: 'OPEN' as const,
        page: 1,
        pageSize: 20,
      };

      const mockSessions = [
        {
          id: 'session_1',
          status: 'OPEN',
          userId: 'user_1',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      mockPrismaService.$transaction.mockResolvedValue([1, mockSessions]);

      const result = await service.listSessions(params);

      expect(mockPrismaService.$transaction).toHaveBeenCalled();
      expect(result).toEqual({
        total: 1,
        page: 1,
        pageSize: 20,
        items: mockSessions,
      });
    });

    it('should handle empty status filter', async () => {
      const params = {
        page: 1,
        pageSize: 20,
      };

      mockPrismaService.$transaction.mockResolvedValue([0, []]);

      const result = await service.listSessions(params);

      expect(mockPrismaService.$transaction).toHaveBeenCalled();
      expect(result.items).toEqual([]);
    });
  });

  describe('getSession', () => {
    it('should get session with messages', async () => {
      const sessionId = 'session_1';
      const mockSession = {
        id: sessionId,
        status: 'OPEN',
        userId: 'user_1',
        messages: [
          {
            id: 'msg_1',
            role: 'USER',
            text: 'Hello',
            createdAt: new Date(),
          },
        ],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.chatSession.findUnique.mockResolvedValue(mockSession);

      const result = await service.getSession(sessionId);

      expect(mockPrismaService.chatSession.findUnique).toHaveBeenCalledWith({
        where: { id: sessionId },
        include: { messages: { orderBy: { createdAt: 'asc' } } },
      });
      expect(result).toEqual(mockSession);
    });

    it('should throw NotFoundException if session not found', async () => {
      const sessionId = 'nonexistent_session';

      mockPrismaService.chatSession.findUnique.mockResolvedValue(null);

      await expect(service.getSession(sessionId)).rejects.toThrow('Không tìm thấy phiên chat');
    });
  });

  describe('postMessage', () => {
    it('should post user message and generate AI response', async () => {
      const sessionId = 'session_1';
      const role = 'USER' as const;
      const text = 'Hello, I need help';

      const mockSession = {
        id: sessionId,
        status: 'OPEN',
        userId: 'user_1',
        messages: [],
      };

      const mockMessage = {
        id: 'msg_1',
        sessionId,
        role,
        text,
        createdAt: new Date(),
      };

      const mockAiResponse = {
        response: 'Hello! How can I help you today?',
      };

      mockPrismaService.chatSession.findUnique.mockResolvedValue(mockSession);
      mockPrismaService.chatMessage.create.mockResolvedValue(mockMessage);
      mockAiService.chat.mockResolvedValue(mockAiResponse);

      const result = await service.postMessage(sessionId, role, text);

      expect(mockPrismaService.chatMessage.create).toHaveBeenCalledWith({
        data: { sessionId, role, text },
      });
      expect(mockAiService.chat).toHaveBeenCalledWith({
        sessionId,
        userId: mockSession.userId,
        message: text,
      });
      expect(result).toEqual(mockMessage);
    });

    it('should handle AI service failure gracefully', async () => {
      const sessionId = 'session_1';
      const role = 'USER' as const;
      const text = 'Hello';

      const mockSession = {
        id: sessionId,
        status: 'OPEN',
        userId: 'user_1',
        messages: [],
      };

      const mockMessage = {
        id: 'msg_1',
        sessionId,
        role,
        text,
        createdAt: new Date(),
      };

      mockPrismaService.chatSession.findUnique.mockResolvedValue(mockSession);
      mockPrismaService.chatMessage.create.mockResolvedValue(mockMessage);
      mockAiService.chat.mockRejectedValue(new Error('AI service unavailable'));

      const result = await service.postMessage(sessionId, role, text);

      expect(result).toEqual(mockMessage);
      // Should still create fallback AI message
      expect(mockPrismaService.chatMessage.create).toHaveBeenCalledTimes(2);
    });

    it('should not generate AI response for non-user messages', async () => {
      const sessionId = 'session_1';
      const role = 'STAFF' as const;
      const text = 'Staff response';

      const mockSession = {
        id: sessionId,
        status: 'OPEN',
        userId: 'user_1',
        messages: [],
      };

      const mockMessage = {
        id: 'msg_1',
        sessionId,
        role,
        text,
        createdAt: new Date(),
      };

      mockPrismaService.chatSession.findUnique.mockResolvedValue(mockSession);
      mockPrismaService.chatMessage.create.mockResolvedValue(mockMessage);

      const result = await service.postMessage(sessionId, role, text);

      expect(mockAiService.chat).not.toHaveBeenCalled();
      expect(result).toEqual(mockMessage);
    });
  });

  describe('escalate', () => {
    it('should escalate session successfully', async () => {
      const sessionId = 'session_1';
      const mockSession = {
        id: sessionId,
        status: 'OPEN',
        userId: 'user_1',
        messages: [],
      };

      const mockUpdatedSession = {
        ...mockSession,
        status: 'ESCALATED',
      };

      mockPrismaService.chatSession.findUnique.mockResolvedValue(mockSession);
      mockPrismaService.chatSession.update.mockResolvedValue(mockUpdatedSession);

      const result = await service.escalate(sessionId);

      expect(mockPrismaService.chatSession.update).toHaveBeenCalledWith({
        where: { id: sessionId },
        data: { status: 'ESCALATED' },
      });
      expect(result).toEqual(mockUpdatedSession);
    });
  });

  describe('closeSession', () => {
    it('should close session successfully', async () => {
      const sessionId = 'session_1';
      const mockSession = {
        id: sessionId,
        status: 'OPEN',
        userId: 'user_1',
        messages: [],
      };

      const mockUpdatedSession = {
        ...mockSession,
        status: 'CLOSED',
      };

      mockPrismaService.chatSession.findUnique.mockResolvedValue(mockSession);
      mockPrismaService.chatSession.update.mockResolvedValue(mockUpdatedSession);

      const result = await service.closeSession(sessionId);

      expect(mockPrismaService.chatSession.update).toHaveBeenCalledWith({
        where: { id: sessionId },
        data: { status: 'CLOSED' },
      });
      expect(result).toEqual(mockUpdatedSession);
    });
  });

  describe('getSessionAnalytics', () => {
    it('should calculate session analytics correctly', async () => {
      const sessionId = 'session_1';
      const mockSession = {
        id: sessionId,
        status: 'OPEN',
        userId: 'user_1',
        messages: [
          {
            id: 'msg_1',
            role: 'USER',
            text: 'Hello',
            createdAt: new Date('2024-01-01T10:00:00Z'),
          },
          {
            id: 'msg_2',
            role: 'ASSISTANT',
            text: 'Hi there!',
            createdAt: new Date('2024-01-01T10:00:05Z'),
          },
          {
            id: 'msg_3',
            role: 'STAFF',
            text: 'How can I help?',
            createdAt: new Date('2024-01-01T10:00:10Z'),
          },
        ],
        createdAt: new Date('2024-01-01T10:00:00Z'),
        updatedAt: new Date('2024-01-01T10:30:00Z'),
      };

      mockPrismaService.chatSession.findUnique.mockResolvedValue(mockSession);

      const result = await service.getSessionAnalytics(sessionId);

      expect(result).toEqual({
        sessionId,
        totalMessages: 3,
        userMessages: 1,
        assistantMessages: 1,
        staffMessages: 1,
        averageResponseTime: 5000, // 5 seconds
        sessionDuration: 1800000, // 30 minutes
        status: 'OPEN',
      });
    });
  });

  describe('getChatStats', () => {
    it('should return chat statistics with caching', async () => {
      const mockStats = {
        totalSessions: 100,
        openSessions: 15,
        escalatedSessions: 5,
        closedSessions: 80,
        escalationRate: 5.0,
        resolutionRate: 80.0,
      };

      mockCacheService.get.mockResolvedValue(mockStats);

      const result = await service.getChatStats();

      expect(mockCacheService.get).toHaveBeenCalledWith('chat:stats');
      expect(result).toEqual(mockStats);
    });

    it('should calculate stats when cache miss', async () => {
      mockCacheService.get.mockResolvedValue(null);
      mockPrismaService.chatSession.count
        .mockResolvedValueOnce(100) // total
        .mockResolvedValueOnce(15) // open
        .mockResolvedValueOnce(5) // escalated
        .mockResolvedValueOnce(80); // closed

      const result = await service.getChatStats();

      expect(mockCacheService.set).toHaveBeenCalledWith('chat:stats', expect.any(Object), {
        ttl: 300,
      });
      expect(result).toEqual({
        totalSessions: 100,
        openSessions: 15,
        escalatedSessions: 5,
        closedSessions: 80,
        escalationRate: 5.0,
        resolutionRate: 80.0,
      });
    });
  });
});
