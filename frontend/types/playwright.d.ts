declare module '@playwright/test' {
  import { Page } from 'playwright';

  export interface DeviceDescriptor {
    viewport: {
      width: number;
      height: number;
    };
    userAgent: string;
    deviceScaleFactor: number;
    isMobile: boolean;
    hasTouch: boolean;
    defaultBrowserType: string;
  }

  export const devices: {
    'Desktop Chrome': DeviceDescriptor;
    'Desktop Firefox': DeviceDescriptor;
    'Desktop Safari': DeviceDescriptor;
    'Desktop Edge': DeviceDescriptor;
    [key: string]: DeviceDescriptor;
  };

  export interface TestConfig {
    testDir?: string;
    timeout?: number;
    fullyParallel?: boolean;
    forbidOnly?: boolean;
    retries?: number;
    workers?: number;
    reporter?: string | string[];
    expect?: {
      timeout?: number;
    };
    use?: {
      baseURL?: string;
      browserName?: 'chromium' | 'firefox' | 'webkit';
      headless?: boolean;
      viewport?: {
        width: number;
        height: number;
      };
      trace?: 'on' | 'off' | 'on-first-retry' | 'retain-on-failure';
      screenshot?: 'on' | 'off' | 'only-on-failure';
      video?: 'on' | 'off' | 'retain-on-failure' | 'on-first-retry';
    };
    projects?: Array<{
      name: string;
      use?: {
        baseURL?: string;
        browserName?: 'chromium' | 'firefox' | 'webkit';
      } & Partial<DeviceDescriptor>;
    }>;
  }

  export function test(name: string, fn: (args: { page: Page }) => Promise<void>): void;
  export function expect(value: unknown): {
    toBe(value: unknown): void;
    toEqual(value: unknown): void;
    toContain(value: unknown): void;
    toBeTruthy(): void;
    toBeFalsy(): void;
    toBeNull(): void;
    toBeDefined(): void;
    toBeUndefined(): void;
  };

  export function defineConfig(config: TestConfig): TestConfig;
}
