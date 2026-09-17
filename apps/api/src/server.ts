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
import patientRouter from "./modules/patients/patient.routes";
import prescriptionRouter from "./modules/prescriptions/prescription.routes";
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
    if (ENV.NODE_ENV === "dev") {
      this.app.use(cors());
    } else {
      this.app.use(cors({ origin: ENV.CORS_ORIGIN }));
    }

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

    router.use("/patients", patientRouter);
    router.use("/prescriptions", prescriptionRouter);

    this.app.get("/health", (_req: Request, res: Response) => {
      res.status(200).json({ status: "ok" });
    });

    this.app.use(
      this.ROUTE,
      (req: Request, _res: Response, next: NextFunction) => {
        return next(
          new AppError(`can't find ${req.originalUrl} on this server`, 404),
        );
      },
    );

    this.app.get("/", (_req: Request, res: Response) => {
      res.json({
        status: true,
        server: "OK",
      });
    });

    this.app.use((req: Request, _res: Response, next: NextFunction) => {
      next(new AppError(`can't find ${req.originalUrl} on this server`, 404));
    });
    this.app.use(globalErrorHandler);
  }
  listen() {
    this.app.listen(this.PORT, this.HOST, () => {
      const server = `http://${this.HOST}:${this.PORT}`;
      console.log(`🚀 Server deployed at: ${server}`);
      console.log(`📝 View docs at: ${server}/api/docs`);
    });
  }
}

export default Server;
