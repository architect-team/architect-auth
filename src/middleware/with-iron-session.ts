import { withIronSession } from 'next-iron-session';

export default (ctx: any) => withIronSession(ctx, {
  cookieName: process.env.SESSION_COOKIE_NAME,
  password: process.env.SIGNING_SECRET,
  cookieOptions: {
    secure: false,
  }
});
