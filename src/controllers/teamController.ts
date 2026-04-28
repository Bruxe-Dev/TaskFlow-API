import { Request, Response } from "express";
import { AuthRequest } from "../middleware/auth";
import { UserRole } from "../types";
import { Field, User, Organization, Team } from "../models";
import asyncHandleWrapper from "../middleware/asyncHandlewrapp";

/**
 * @desc Get a specific team
 * @route GET /api/teams/:id
 * @access Private (Field Members only)
 */

export const getTeam = asyncHandleWrapper(async (req: AuthRequest, res: Response) => {
    const team = await Team.findById(req.params.id)
        .populate
})