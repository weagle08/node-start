import { Logger } from 'bunyan-log';
import { ErrorRequestHandler, NextFunction, Request, Response} from 'express';

let log: Logger = null;

export class ErrorMiddleware {
    public static inject() { return [Logger]; }

    constructor(logger: Logger) {
        log = logger;
    }

    public log(error: Error, req: Request, res: Response, next: NextFunction) {
        try {
            (log as any).fatal(error, 'internal server error');
        } catch (ex) {
            // tslint:disable-next-line:no-console
            console.error(error);
        }

        return res.status(500).json({success: false, error: error.message });
    }
}