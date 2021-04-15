import cookieSession from 'cookie-session';

export default cookieSession({
  name: process.env.SESSION_COOKIE_NAME,
  keys: [process.env.SIGNING_SECRET],
});
