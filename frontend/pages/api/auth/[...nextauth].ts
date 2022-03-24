import { getLoginSession } from "lib/auth";
import prisma from "lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";
import NextAuth from "next-auth";
import TwitterProvider from "next-auth/providers/twitter";

const auth = (req: NextApiRequest, res: NextApiResponse) =>
  NextAuth(req, res, {
    // https://next-auth.js.org/configuration/providers
    providers: [
      TwitterProvider({
        clientId: process.env.TWITTER_KEY as string,
        clientSecret: process.env.TWITTER_SECRET as string,
        // version: "2.0", // opt-in to Twitter OAuth 2.0
      }),
    ],
    // Database optional. MySQL, Maria DB, Postgres and MongoDB are supported.
    // https://next-auth.js.org/configuration/databases
    //
    // Notes:
    // * You must install an appropriate node_module for your database
    // * The Email provider requires a database (OAuth providers do not)
    // database: process.env.DATABASE_URL,

    // The secret should be set to a reasonably long random string.
    // It is used to sign cookies and to sign and encrypt JSON Web Tokens, unless
    // a separate secret is defined explicitly for encrypting the JWT.
    secret: process.env.TOKEN_SECRET,

    session: {
      // Use JSON Web Tokens for session instead of database sessions.
      // This option can be used with or without a database for users/accounts.
      // Note: `strategy` should be set to 'jwt' if no database is used.
      strategy: "jwt",

      // Seconds - How long until an idle session expires and is no longer valid.
      // maxAge: 30 * 24 * 60 * 60, // 30 days

      // Seconds - Throttle how frequently to write to database to extend a session.
      // Use it to limit write operations. Set to 0 to always update the database.
      // Note: This option is ignored if using JSON Web Tokens
      // updateAge: 24 * 60 * 60, // 24 hours
    },

    // JSON Web tokens are only used for sessions if the `strategy: 'jwt'` session
    // option is set - or by default if no database is specified.
    // https://next-auth.js.org/configuration/options#jwt
    jwt: {
      // A secret to use for key generation (you should set this explicitly)
      secret: process.env.TOKEN_SECRET,
      // Set to true to use encryption (default: false)
      // encryption: true,
      // You can define your own encode/decode functions for signing and encryption
      // if you want to override the default behaviour.
      // encode: async ({ secret, token, maxAge }) => {},
      // decode: async ({ secret, token, maxAge }) => {},
    },

    // You can define custom pages to override the built-in ones. These will be regular Next.js pages
    // so ensure that they are placed outside of the '/api' folder, e.g. signIn: '/auth/mycustom-signin'
    // The routes shown here are the default URLs that will be used when a custom
    // pages is not specified for that route.
    // https://next-auth.js.org/configuration/pages
    pages: {
      // signIn: '/auth/signin',  // Displays signin buttons
      // signOut: '/auth/signout', // Displays form with sign out button
      // error: '/auth/error', // Error code passed in query string as ?error=
      // verifyRequest: '/auth/verify-request', // Used for check email page
      // newUser: null // If set, new users will be directed here on first sign in
    },

    // Callbacks are asynchronous functions you can use to control what happens
    // when an action is performed.
    // https://next-auth.js.org/configuration/callbacks
    callbacks: {
      async signIn({ user, account, profile, email, credentials }) {
        const session = await getLoginSession(req);

        await prisma.user.update({
          where: { email: session.email },
          data: { twitterUsername: (profile as any).screen_name },
        });

        return true;
      },
      // async redirect({ url, baseUrl }) { return baseUrl },
      async jwt({ profile, token, account }) {
        if (profile) {
          token.twitterProfile = profile;
        }
        if (account) {
          token.twitterAccount = account;
        }

        return token;
      },
      async session({ session, token }) {
        if (token.twitterProfile) {
          session.twitterProfile = token.twitterProfile;
        }

        return session;
      },
    },

    // Events are useful for logging
    // https://next-auth.js.org/configuration/events
    events: {},

    // Enable debug messages in the console if you are having problems
    debug: false,
  });

export default auth;
