import express from 'express';
import routes from './routes';
import dotenv from "dotenv";
import cors from "cors";
import session from 'express-session';

const app = express();

dotenv.config({
  path: ".env"
});

app.use(
  session({
    secret: process.env.SESSION_SECRET || "secret",
    resave: false,
    saveUninitialized: false
  })
);

app.use(
  cors({
    credentials: true,
    origin: (origin, callback) => {
      if (process.env.NODE_ENV === "production") {
        if (origin === process.env.FRONTEND_URL) {
          return callback(null, true);
        } else {
          return callback(new Error("Not allowed by CORS"));
        }
      } else {
        return callback(null, true);
      }
    }
  })
);

app.use(express.json());

app.use(routes);

export default app;