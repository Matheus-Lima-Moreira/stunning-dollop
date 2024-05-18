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
    origin: process.env.FRONTEND_URL
  })
);

app.use(express.json());

app.use(routes);

export default app;