import express, {
  Express,
  NextFunction,
  Request,
  Response,
  Router,
} from "express";
import cors from "cors";
import AppError from "./utils/AppError";
import { ENV } from "./config/env";
import expressWinston from "express-winston";
import { logger } from "./utils/logger";
import { globalErrorHandler } from "./middlewares/error.middleware";
import { randomUUID } from "node:crypto";
class Server {
  private app: Express;
  private PORT: number = ENV.PORT;
  private ROUTE: string = "/api";
  private HOST: string = ENV.HOST;

  constructor() {
    this.app = express();
    this.middlewares();
    this.routes();
  }

  middlewares() {
    this.app.use(cors());
    this.app.use((_req, res, next) => {
      const requestId = randomUUID();

      res.locals.requestId = requestId;
      res.setHeader("x-request-id", requestId);
      next();
    });
    this.app.use(express.json());
    this.app.use(
      expressWinston.logger({
        winstonInstance: logger,
        meta: true,
        msg: "HTTP {{req.method}} {{req.url}}",
        expressFormat: true,
        colorize: true,
        ignoreRoute: (req) => req.path === "/favicon.ico",
      }),
    );
  }

  routes() {
    const router = Router();
    this.app.use(this.ROUTE, router);

    this.app.use(
      /^\/(?!$).*$/,
      (req: Request, _res: Response, next: NextFunction) => {
        return next(
          new AppError(`can't find ${req.originalUrl} on this server`, 404),
        );
      },
    );
    this.app.use("/", (_req: Request, res: Response) => {
      res.json({
        status: true,
        server: "OK",
      });
    });
    this.app.use(globalErrorHandler);
  }
  listen() {
    this.app.listen(ENV.NODE_ENV === "prod" ? 3000 : this.PORT, () => {
      const server = `http://${this.HOST}:${this.PORT}`;
      console.log(`🚀 Server deployed at: ${server}`);
      console.log(`📝 View docs at: ${server}/api/docs`);
    });
  }
}

export default Server;
