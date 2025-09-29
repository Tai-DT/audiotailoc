import { AdminController } from '../modules/admin/admin.controller';

describe('AdminController bulk user actions', () => {
  const prismaMock = {
    users: {
      updateMany: jest.fn(async () => ({ count: 1 })),
      deleteMany: jest.fn(async () => ({ count: 1 })),
    },
    product: {
      deleteMany: jest.fn(),
      updateMany: jest.fn(),
    },
    order: {
      deleteMany: jest.fn(),
      updateMany: jest.fn(),
    },
    inventory: {
      count: jest.fn(),
    },
  } as unknown as any;

  const loggingMock = {
    logUserActivity: jest.fn(),
    error: jest.fn(),
  } as any;

  const activityMock = {
    getActivityLogs: jest.fn(),
    cleanupOldLogs: jest.fn(),
  } as any;

  const controller = new AdminController(prismaMock, {} as any, loggingMock, activityMock);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should deactivate users by setting role to DISABLED', async () => {
    await controller.performBulkAction({ action: 'deactivate', ids: ['u1'], type: 'users' });
    expect(prismaMock.users.updateMany).toHaveBeenCalledWith({
      where: { id: { in: ['u1'] } },
      data: { role: 'DISABLED' },
    });
  });

  it('should activate users by restoring role to USER', async () => {
    await controller.performBulkAction({ action: 'activate', ids: ['u1'], type: 'users' });
    expect(prismaMock.users.updateMany).toHaveBeenCalledWith({
      where: { id: { in: ['u1'] } },
      data: { role: 'USER' },
    });
  });
});
