import { Logger } from 'bunyan-log';
import { NextFunction, Request, Response } from 'express';

let log: Logger = null;

export class RequestLogger {
    public static inject() { return [Logger]; }

    constructor(logger: Logger) {
        log = logger;
    }

    public log(req: Request, res: Request, next: NextFunction) {
        const time = process.hrtime();
        res.on('finish', () => {
            const timeDiff = process.hrtime(time);
            let totalTimeDiffMs = timeDiff[0] * 1000;
            totalTimeDiffMs += timeDiff[1] / 1000000;

            (log as any).debug({
                url: req.originalUrl,
                delay: totalTimeDiffMs,
                origin: req.connection.remoteAddress
            }, `request from: ${req.connection.remoteAddress}`);
        });
        next();
    }

    public unhandled(req: Request, res: Response) {
        (log as any).debug({
            url: req.originalUrl,
            origin: req.connection.remoteAddress
        }, `invalid request from: ${req.connection.remoteAddress}`);
        res.status(404).json({ success: false, error: 'resource not found' });
    }
}

export const headersToLower = (req: Request, res: Response, next: NextFunction) => {
    for (const header in req.headers) {
        if (req.headers.hasOwnProperty(header)) {
            const lowerHeader = header.toLowerCase();
            if (header !== lowerHeader) {
                req.headers[lowerHeader] = req.headers[header];
                delete req.headers[header];
            }
        }
    }
    next();
};

export const remoteAddressAppender = (req: Request, res: Response, next: NextFunction) => {
    try {
        (req as any).requestor = req.ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    } catch (ex) {
        // do nothing, unable to get ip
    }
    next();
};