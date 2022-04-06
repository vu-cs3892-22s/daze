import express from 'express';
import passport from 'passport';
import { Strategy } from 'passport-google-oauth2';
import { queryCreateUser, queryUpdateUser, queryGetUser } from './db';

type User = {
  email?: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
};

passport.serializeUser((user, done) => {
  console.log('serializing user:', user);
  return done(null, user);
});

passport.deserializeUser(async (user: User, done) => {
  try {
    console.log('user:', user);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

const googleStrategy = new Strategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID as string,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    callbackURL: 'http://localhost:8080/auth/google/callback',
    scope: ['profile', 'email'],
    // TODO: fix this ^^
    passReqToCallback: true
  },
  // TODO: fix types
  async function (
    request: unknown,
    accessToken: unknown,
    refreshToken: unknown,
    profile: any,
    done: any
  ) {
    // TODO: check what's actually in the profile
    try {
      let user = await queryGetUser(profile.emails[0].value);
      if (user === undefined) {
        // User not found, create user
        user = await queryCreateUser({
          vanderbiltEmail: profile.emails[0].value,
          firstName: profile.name.givenName,
          lastName: profile.name.familyName,
          phoneNumber: ''
        });
      }
      console.log('hey user:', user);
      done(null, user);
    } catch (err) {
      console.log('yo this failed');
      done(err);
    }
  }
);

passport.use(googleStrategy);

console.log('hey:', process.env.GOOGLE_CLIENT_ID);

export { passport };

// Auth routes
// const logout = (req: express.Request, res: express.Response) => {
//     req.logout();
//     res.redirect('/');
//   }

//   const

//   app.get('/auth/linkedin', passport.authenticate('linkedin', (err, user, info) => {
//     if (err) { return next(err) }
//   }), async (req, res, next) => {
//     // The request will be redirected to LinkedIn for authentication, so this
//     // function will not be called.
//     console.log('auth/linkedin',req)
//     res.redirect('/')
//     next()
//   })

//   app.get('/auth/linkedin/callback', passport.authenticate('linkedin', {
//       successRedirect: '/auth/linkedin/redirect',
//       failureRedirect: '/auth/linkedin'
//     }), async (req, res, next) => {
//         // console.log(req.user.dataValues)
//         res.send(req.user.dataValues)
//   })

//   // Redirect the user back to the app
//   app.get('/auth/linkedin/redirect', async (req, res, next) => {
//   // you can see what you get back from LinkedIn here:
//   console.log(req.user.dataValues)
//   res.redirect(<deep-link-to-react-native-app>)
//   })
