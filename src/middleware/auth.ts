import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import asyncHandleWrapper from './asyncHandlewrapp';
import User from '../models/User'
import dotenv from 'dotenv'
dotenv.config()

interface jwtPayload {
    id: string
}

declare global {
    namespace Express {
        interface Request {
            user?: typeof User.prototype
        }
    }
}

const protect = asyncHandleWrapper(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    let token: string | undefined;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        res.status(401).json({
            success: false,
            error: "No Authorisation"
        });
        return;
    }
    try {
        const jwt_secret = process.env.JWT_SECRET;

        if (!jwt_secret) {
            throw new Error("JWT is not defined");
        }
        const decoded = jwt.verify(token, jwt_secret) as jwtPayload;

        //Get the user from the Token
        req.user = await User.findById(decoded.id)

        if (!req.user) {
            res.status(404).json({
                success: false,
                error: 'User Not Found'
            });
            return;
        }

        if (!req.user.isEmailVerified) {
            res.status(403).json({
                success: false,
                error: 'Please Verify Your Email To Continue'
            })
            return;
        }

        next();
    } catch (error) {
        res.status(401).json({
            success: false,
            error: 'NO AUTHORISATION TO ACCES THIS ROUTE'
        })
    }
})

export default protect