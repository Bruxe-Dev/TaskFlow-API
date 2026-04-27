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

export const createOrganization = asyncHandleWrapper(async (req: AuthRequest, res: Response) => {
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

    res.status(200).json({
        success: true,
        message: "Organization Successfully created. You are now the owner of the Organization",
        data: organization
    })
})

/**
 * @desc 
 * @access
 * @route
 */

export const getOrganization = asyncHandleWrapper(async (req: AuthRequest, res: Response) => {
    const organization = await Organization.findById(req.params.id)
        .populate('leader', 'username email')
        .populate('fields');

    if (!organization) {
        res.status(404).json({
            success: false,
            message: "No Organisation found"
        })
        return;
    }

    if (organization.leader.toString() !== req.user?._id.toString()) {
        res.status(403).json({
            success: false,
            message: "Unauthorized, Please contact Organization Owner"
        })
    }

    res.status(200).json({
        success: true,
        data: organization
    })
})