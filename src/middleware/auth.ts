import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import { IUser, UserRole } from '../types';

export interface AuthRequest extends Request {
    user?: IUser;
}

export const protect = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    let token: string | undefined;

    const authHeader = req.headers.authorization || req.headers.Authorization;

    if (authHeader && typeof authHeader === 'string' && authHeader.startsWith('Bearer')) {
        token = authHeader.split(' ')[1];
    }

    if (!token) {
        res.status(401).json({
            success: false,
            error: "Not authorized to access this route"  // Changed 'message' to 'error' for consistency
        });
        return;
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string };

        const user = await User.findById(decoded.id);

        if (!user) {
            res.status(401).json({  // Changed to 401 instead of 404
                success: false,
                error: "User no longer exists"
            });
            return;
        }

        if (!user.isEmailVerified) {
            res.status(403).json({
                success: false,
                error: "Please verify your email to access this resource"
            });
            return;
        }

        // ⭐ THIS IS WHAT YOU WERE MISSING ⭐
        // Attach user to request object so routes can access it
        req.user = user;

        // Call next() to pass control to the next middleware/route handler
        next();

    } catch (error) {
        // Handle JWT errors (invalid token, expired token, etc.)
        res.status(401).json({
            success: false,
            error: 'Not authorized to access this route'
        });
        return;
    }
};

/**
 * Authorize roles - Restrict access to specific user roles
 * Usage: authorize(UserRole.ORG_LEADER, UserRole.FIELD_ADMIN)
 */
export const authorize = (...roles: UserRole[]) => {
    return (req: AuthRequest, res: Response, next: NextFunction): void => {
        if (!req.user) {
            res.status(401).json({
                success: false,
                error: 'Not authenticated'
            });
            return;
        }

        if (!roles.includes(req.user.role)) {
            res.status(403).json({
                success: false,
                error: `User role '${req.user.role}' is not authorized to access this route`
            });
            return;
        }

        next();
    };
};

/**
 * Check if user belongs to organization
 */
export const checkOrganization = (orgIdParam: string = 'id') => {
    return async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
        if (!req.user) {
            res.status(401).json({
                success: false,
                error: 'Not authenticated'
            });
            return;
        }

        const requestedOrgId = req.params[orgIdParam];

        if (!req.user.organization) {
            res.status(403).json({
                success: false,
                error: 'You are not part of any organization'
            });
            return;
        }

        if (req.user.organization.toString() !== requestedOrgId) {
            res.status(403).json({
                success: false,
                error: 'You do not have access to this organization'
            });
            return;
        }

        next();
    };
};

/**
 * Check if user is organization leader
 */
export const isOrgLeader = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    if (!req.user) {
        res.status(401).json({
            success: false,
            error: 'Not authenticated'
        });
        return;
    }

    if (req.user.role !== UserRole.ORG_LEADER) {
        res.status(403).json({
            success: false,
            error: 'Only organization leaders can perform this action'
        });
        return;
    }

    next();
};


export const isFieldAdmin = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    if (!req.user) {
        res.status(401).json({
            success: false,
            error: 'Not authenticated'
        });
        return;
    }

    if (req.user.role !== UserRole.FIELD_ADMIN) {
        res.status(403).json({
            success: false,
            error: 'Only field admins can perform this action'
        });
        return;
    }

    next();
};