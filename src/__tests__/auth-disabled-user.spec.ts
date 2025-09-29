import * as bcrypt from 'bcryptjs';
import { AuthService } from '../modules/auth/auth.service';

const createAuthService = (user: any) => {
  const usersMock = {
    findByEmail: jest.fn().mockResolvedValue(user),
    updatePassword: jest.fn(),
  } as any;

  const configMock = {
    get: jest.fn().mockImplementation((key: string) => {
      if (key === 'JWT_ACCESS_SECRET') return 'access-secret';
      if (key === 'JWT_REFRESH_SECRET') return 'refresh-secret';
      if (key === 'NODE_ENV') return 'test';
      return undefined;
    }),
  } as any;

  const securityMock = {
    isAccountLocked: jest.fn().mockReturnValue(false),
    getRemainingLockoutTime: jest.fn(),
    recordLoginAttempt: jest.fn(),
  } as any;

  return {
    service: new AuthService(usersMock, configMock, securityMock),
    usersMock,
    securityMock,
  };
};

describe('AuthService login disabled user', () => {
  it('should prevent login when user role is DISABLED', async () => {
    const hashed = await bcrypt.hash('password123', 10);
    const { service, securityMock } = createAuthService({
      id: 'user-1',
      email: 'disabled@example.com',
      password: hashed,
      role: 'DISABLED',
    });

    await expect(
      service.login({ email: 'disabled@example.com', password: 'password123' })
    ).rejects.toThrow('Account disabled');

    expect(securityMock.recordLoginAttempt).toHaveBeenCalledWith('disabled@example.com', false);
  });
});
