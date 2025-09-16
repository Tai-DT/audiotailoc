import { PrismaClient } from '@prisma/client';

// Global test setup
beforeAll(async () => {
  // Setup test database or mock services
  process.env.NODE_ENV = 'test';
  process.env.DATABASE_URL = process.env.TEST_DATABASE_URL || 'file:./test.db';
});

afterAll(async () => {
  // Cleanup after all tests
});

// Mock external services for testing
jest.mock('nodemailer', () => ({
  createTransporter: jest.fn(() => ({
    sendMail: jest.fn().mockResolvedValue({ messageId: 'test-message-id' }),
  })),
}));

// Mock Socket.IO for testing
jest.mock('socket.io', () => ({
  Server: jest.fn(() => ({
    emit: jest.fn(),
    to: jest.fn(() => ({
      emit: jest.fn(),
    })),
    on: jest.fn(),
  })),
}));

// Mock file upload services
jest.mock('@aws-sdk/client-s3', () => ({
  S3Client: jest.fn(() => ({
    send: jest.fn().mockResolvedValue({}),
  })),
  PutObjectCommand: jest.fn(),
  DeleteObjectCommand: jest.fn(),
}));

// Increase timeout for integration tests
jest.setTimeout(30000);
