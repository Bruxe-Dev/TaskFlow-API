import { NextFunction, Request, Response, RequestHandler } from "express";

const asyncHandleWrapper = (fn: RequestHandler) => (req: Request, res: Response, next: NextFunction): void => {
    Promise.resolve(fn(req, res, next)).catch(next)
};

export default asyncHandleWrapper