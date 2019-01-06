import { NextFunction, Request, Response } from 'express';

export const toLower = (req: Request, res: Response, next: NextFunction) => {
    for (const key in req.query) {
        if (req.query.hasOwnProperty(key)) {
            const lowerKey = key.toLowerCase();
            if (key !== lowerKey) {
                req.query[lowerKey] = req.query.key;
                delete req.query[key];
            }
        }
    }
    next();
};