import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import { IUser, UserRole } from '../types';
import { totalmem } from 'node:os';

export interface AuthRequest extends Request {
    user?: IUser
}

export const protect = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    let token: string | undefined;

    const authHeader = req.headers.authorization || req.headers.Authorization;

    if (authHeader && typeof authHeader === 'string' && authHeader.startsWith('Bearer')) {
        token = authHeader.split(' ')[1]
    }

    if (!token) {
        res.status(401).json({
            success: false,
            message: "Not Authorised to acces this route"
        })
        return;
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string }

        const user = await User.findById(decoded.id)

        if (!user) {
            res.status(404).json({
                success: false,
                message: "User Doesn't exist"
            })
            return;
        }
    } catch (error) {

    }
}