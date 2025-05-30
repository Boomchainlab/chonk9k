import * as Sentry from '@sentry/react';

// This ensures we don't initialize Sentry multiple times
let sentryInitialized = false;

/**
 * Initializes Sentry error tracking
 * Should be called once at the application entry point
 */
export function initSentry(): void {
  if (sentryInitialized) {
    return;
  }

  // Only initialize Sentry in production
  const isDevelopment = import.meta.env.DEV;
  // Using the provided DSN token
  const dsn = "https://46bd734805d944469644cb9a2b8c07bf649c084bbe909d9f77933b22ee4b34d4@o4505550486241280.ingest.us.sentry.io/4505550487355392";

  if (!dsn && !isDevelopment) {
    console.warn('Sentry DSN not provided. Error tracking disabled.');
    return;
  }

  try {
    Sentry.init({
      dsn: dsn,
      // Organization specific settings for BoomChainLab
      // Using the specific organization URL you provided
      // These values are set via tags since directly setting organization is not supported
      // in the BrowserOptions type
      // Simple configuration without browser tracing to avoid type errors
      // Set tracesSampleRate to 1.0 to capture 100%
      // of transactions for performance monitoring.
      // We recommend adjusting this value in production
      tracesSampleRate: isDevelopment ? 1.0 : 0.2,

      // Capture release version for better debugging
      release: import.meta.env.VITE_APP_VERSION || 'dev',
      
      // Only enable Sentry in production unless explicitly enabled in dev
      enabled: !isDevelopment || import.meta.env.VITE_ENABLE_SENTRY_IN_DEV === 'true',

      // Don't send PII (Personally Identifiable Information) by default
      // Change this only when necessary and with user consent
      sendDefaultPii: false,
      
      // We'll set this relatively low to not affect performance too much
      maxBreadcrumbs: 50,
      
      // Environment tag helps distinguish between development and production errors
      environment: isDevelopment ? 'development' : 'production',
    });

    // Set organization and project as tags instead
    Sentry.setTag('organization', 'boomchainlab-boomtoknlab-boomt');
    Sentry.setTag('project', 'javascript-vue');
    Sentry.setTag('token-name', 'CHONK9K');
    
    sentryInitialized = true;
    console.log('Sentry initialized successfully');
  } catch (error) {
    console.error('Failed to initialize Sentry:', error);
  }
}

/**
 * Captures an exception and sends it to Sentry
 * @param error - The error to capture
 * @param context - Additional context data for the error
 */
export function captureException(error: unknown, context?: Record<string, any>): void {
  if (context) {
    Sentry.withScope((scope) => {
      Object.entries(context).forEach(([key, value]) => {
        scope.setExtra(key, value);
      });
      Sentry.captureException(error);
    });
  } else {
    Sentry.captureException(error);
  }
}

/**
 * Manually captures a message and sends it to Sentry
 * @param message - The message to capture
 * @param level - The severity level (debug, info, warning, error, fatal)
 */
export function captureMessage(message: string, level: 'debug' | 'info' | 'warning' | 'error' | 'fatal' = 'info'): void {
  Sentry.captureMessage(message, level);
}

/**
 * Sets the user information for Sentry events
 * Should be called after user login/authentication
 * @param user - The user object
 */
export function setUser(user: { id: string; email?: string; username?: string }): void {
  Sentry.setUser(user);
}

/**
 * Clears the user information from Sentry
 * Should be called on logout
 */
export function clearUser(): void {
  Sentry.setUser(null);
}

/**
 * Sets a tag that will be sent with all future events
 * @param key - The tag key
 * @param value - The tag value
 */
export function setTag(key: string, value: string): void {
  Sentry.setTag(key, value);
}

/**
 * Creates a wrapped error boundary component for handling React errors
 * @param component - The component to wrap
 * @param options - Options for the error boundary
 */
export const withErrorBoundary = Sentry.withErrorBoundary;

/**
 * Higher order component that adds performance tracking to a component
 */
export const withProfiler = Sentry.withProfiler;
