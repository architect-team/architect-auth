declare module 'http' {
  interface IncomingMessage {
    session: CookieSessionInterfaces.CookieSessionObject;
    body?: Record<string, unknown>;
  }
}
