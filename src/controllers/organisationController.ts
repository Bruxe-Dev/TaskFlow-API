import { Response } from "express";
import { UserRole } from "../types";
import { Organization, User, Field } from "../models";
import { AuthRequest } from "../middleware/auth";
import asyncHandleWrapper from "../middleware/asyncHandlewrapp";
import { Auth } from "mongodb";

/**
 * @desc
 * @access
 * @route
 */

export const getOrganisation = asyncHandleWrapper(async (req: AuthRequest, res: Response) => {
    const { name, description, industry } = req.body;

    if (req.user?.organization) {
        res.status(400).json({
            success: false,
            message: "You are already enrolled in this Organization! Leave you current Organization first"
        })
        return;
    }

    const organization = await Organization.create({
        name,
        description,
        industry,
        leader: req.user?._id,
        maxAdmins: 6,
        activeAdmins: 0
    })

    await User.findByIdAndUpdate(req.user?._id, {
        role: UserRole.ORG_LEADER,
        organization: organization._id
    })
})