import { SetMetadata } from '@nestjs/common';

// Metadata keys
export const API_VERSION_KEY = 'api_version';
export const API_VERSION_DEPRECATED_KEY = 'api_version_deprecated';
export const API_VERSION_SUNSET_KEY = 'api_version_sunset';

// Decorators for API versioning

/**
 * Specify which API version(s) this endpoint supports
 * @param versions - Array of supported versions (e.g., ['v1', 'v2'])
 */
export const ApiVersions = (...versions: string[]) => SetMetadata(API_VERSION_KEY, versions);

/**
 * Specify the minimum API version required for this endpoint
 * @param version - Minimum version required (e.g., 'v1.1')
 */
export const ApiVersionMin = (version: string) => SetMetadata('api_version_min', version);

/**
 * Specify the maximum API version that supports this endpoint
 * @param version - Maximum version that supports this (e.g., 'v1')
 */
export const ApiVersionMax = (version: string) => SetMetadata('api_version_max', version);

/**
 * Mark an endpoint as deprecated from a specific version
 * @param version - Version from which this endpoint is deprecated
 * @param message - Optional deprecation message
 */
export const ApiVersionDeprecated = (version: string, message?: string) => {
  return (target: any, propertyKey?: string | symbol, descriptor?: PropertyDescriptor) => {
    if (propertyKey && descriptor) {
      SetMetadata(API_VERSION_DEPRECATED_KEY, { version, message })(target, propertyKey as string | symbol, descriptor);

      // Also add the deprecation message to the metadata
      if (message) {
        SetMetadata('api_deprecation_message', message)(target, propertyKey as string | symbol, descriptor);
      }
    }
  };
};

/**
 * Specify when an endpoint will be sunset (removed)
 * @param date - Date when the endpoint will be removed
 * @param version - Version that will sunset this endpoint
 */
export const ApiVersionSunset = (date: Date, version: string) => {
  return (target: any, propertyKey?: string | symbol, descriptor?: PropertyDescriptor) => {
    if (propertyKey && descriptor) {
      SetMetadata(API_VERSION_SUNSET_KEY, { date, version })(target, propertyKey as string | symbol, descriptor);
    }
  };
};

/**
 * Mark an endpoint as experimental (not for production use)
 */
export const ApiVersionExperimental = () => SetMetadata('api_version_experimental', true);

/**
 * Mark an endpoint as requiring authentication from a specific version
 * @param version - Version from which authentication is required
 */
export const ApiVersionRequiresAuth = (version: string) => SetMetadata('api_requires_auth_from', version);

/**
 * Specify breaking changes introduced in a version
 * @param version - Version that introduced breaking changes
 * @param changes - Array of breaking change descriptions
 */
export const ApiVersionBreakingChanges = (version: string, changes: string[]) => {
  return SetMetadata('api_breaking_changes', { version, changes });
};

/**
 * Specify new features introduced in a version
 * @param version - Version that introduced the features
 * @param features - Array of new feature descriptions
 */
export const ApiVersionNewFeatures = (version: string, features: string[]) => {
  return SetMetadata('api_new_features', { version, features });
};

/**
 * Specify the replacement endpoint for deprecated endpoints
 * @param replacementPath - Path to the replacement endpoint
 * @param version - Version where replacement was introduced
 */
export const ApiVersionReplacedBy = (replacementPath: string, version: string) => {
  return SetMetadata('api_replaced_by', { path: replacementPath, version });
};

// Utility functions to get version metadata

export function getApiVersions(target: any, propertyKey?: string | symbol): string[] {
  return propertyKey ? Reflect.getMetadata(API_VERSION_KEY, target, propertyKey as string | symbol) || [] : [];
}

export function getApiVersionMin(target: any, propertyKey?: string | symbol): string | undefined {
  return propertyKey ? Reflect.getMetadata('api_version_min', target, propertyKey as string | symbol) : undefined;
}

export function getApiVersionMax(target: any, propertyKey?: string | symbol): string | undefined {
  return propertyKey ? Reflect.getMetadata('api_version_max', target, propertyKey as string | symbol) : undefined;
}

export function getApiVersionDeprecated(target: any, propertyKey?: string | symbol): { version: string; message?: string } | undefined {
  return propertyKey ? Reflect.getMetadata(API_VERSION_DEPRECATED_KEY, target, propertyKey as string | symbol) : undefined;
}

export function getApiVersionSunset(target: any, propertyKey?: string | symbol): { date: Date; version: string } | undefined {
  return propertyKey ? Reflect.getMetadata(API_VERSION_SUNSET_KEY, target, propertyKey as string | symbol) : undefined;
}

export function isApiVersionExperimental(target: any, propertyKey?: string | symbol): boolean {
  return propertyKey ? Reflect.getMetadata('api_version_experimental', target, propertyKey as string | symbol) || false : false;
}

export function getApiBreakingChanges(target: any, propertyKey?: string | symbol): { version: string; changes: string[] } | undefined {
  return propertyKey ? Reflect.getMetadata('api_breaking_changes', target, propertyKey as string | symbol) : undefined;
}

export function getApiNewFeatures(target: any, propertyKey?: string | symbol): { version: string; features: string[] } | undefined {
  return propertyKey ? Reflect.getMetadata('api_new_features', target, propertyKey as string | symbol) : undefined;
}

export function getApiReplacedBy(target: any, propertyKey?: string | symbol): { path: string; version: string } | undefined {
  return propertyKey ? Reflect.getMetadata('api_replaced_by', target, propertyKey as string | symbol) : undefined;
}
