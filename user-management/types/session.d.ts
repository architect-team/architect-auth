declare module 'http' {
  interface IncomingMessage {
    session: CookieSessionInterfaces.CookieSessionObject;
  }
}
