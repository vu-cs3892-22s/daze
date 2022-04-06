import express from 'express';
import dotenv from 'dotenv';
import {
  createUser,
  updateUser,
  getUser,
  submitData,
  submitComments,
  getDiningHallInfoSpecific,
  getDiningHallInfo
} from './handlers';
import bodyParser from 'body-parser';
import session from 'express-session';
import cors from 'cors';
import RedisStoreMaker from 'connect-redis';
import cookieParser from 'cookie-parser';
import { passport } from './auth';
import { client } from './init_redis';

// DELETE
import redis from 'redis';
//

dotenv.config({
  path: `${__dirname}/../../.env`
});

const port = process.env.PORT; // Naming convention as per Heroku's requirements
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

const RedisStore = RedisStoreMaker(session);

// app.use(
//   session({
//     secret: 'daze',
//     store: new RedisStore({ client }),
//     resave: false,
//     saveUninitialized: false,
//     cookie: { secure: false }
//   })
// );

app.use(
  session({
    secret: 'cookie_secret',
    name: 'authSession',
    // TODO: maybe no redis
    store: new RedisStore({
      host: '127.0.0.1',
      port: 6379
    }),
    proxy: true,
    resave: true,
    saveUninitialized: true
  })
);

// TODO: lol do the thing
app.use(passport.initialize());
app.use(passport.session());
app.use(cors());

const prefixRoute = (route: string) => `/api/v1/${route}`;

// Users
app.post(prefixRoute('user'), createUser);
app.put(prefixRoute('user'), updateUser);
app.get(prefixRoute('user/:vunet_id'), getUser);

// Data
app.post(prefixRoute('data/lines'), submitData);
app.post(prefixRoute('data/comments'), submitComments);
app.get(
  prefixRoute('dining_halls/:dininghall_name'),
  getDiningHallInfoSpecific
);
app.get(prefixRoute('dining_halls'), getDiningHallInfo);

// Auth routes
app.get('auth/linkedin/logout', function (req, res) {
  req.logout();
  res.redirect('/');
});

app.get(
  '/auth/google',
  passport.authenticate('google', { scope: ['email', 'profile'] })
);

// app.get('/auth/linkedin', passport.authenticate('google', (err, user, info) => {
//   if (err) { return next(err) }
// }), async (req, res, next) => {
//   // The request will be redirected to LinkedIn for authentication, so this
//   // function will not be called.
//   console.log('auth/linkedin',req)
//   res.redirect('/')
//   next()
// })

app.get(
  '/auth/google/callback',
  passport.authenticate('google', {
    successRedirect: '/auth/google/redirect',
    failureRedirect: '/auth/google/failure'
  })
);

app.get('/auth/google/failure', (req, res) => {
  console.log('failure');
});

// app.get('/auth/linkedin/callback', passport.authenticate('linkedin', {
//     successRedirect: '/auth/linkedin/redirect',
//     failureRedirect: '/auth/linkedin'
//   }), async (req, res, next) => {
//       // console.log(req.user.dataValues)
//       res.send(req.user.dataValues)
// })

// Redirect the user back to the app
app.get('/auth/google/redirect', async (req: express.Request, res, next) => {
  // you can see what you get back from LinkedIn here:
  console.log('req user:', req.user);
  console.log('req cookies:', req.cookies);
  console.log('bobobobobobobo');
  // res.send('hi');
  res.redirect(
    `http://localhost:19006/My%20Profile?cookie=${req.cookies.kaas}`
  );
});

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`App running on port ${port}.`);
});
