import { AuthRequest } from "../middleware/auth";
import asyncHandleWrapper from "../middleware/asyncHandlewrapp";
import { Organization, User, Field, Team } from "../models";
import { UserRole } from "../types";
import { Request, Response } from "express";

/**
 * @desc
 * @route
 * @access
 */

export const getField = asyncHandleWrapper(async (req: AuthRequest, res: Response) => {
    const field = await Field.findById(req.params.id)
        .populate('admin', 'username email')
        .populate('organization', 'name description')
        .populate({
            path: 'teams',
            populate: {
                path: 'members.user',
                select: 'username email'
            }
        })
        .populate('sharedWithAdmins', 'username email');

    if (!field) {
        res.status(404).json({
            success: false,
            message: "Field not found"
        })
        return;
    }

    const hasAccess =
        req.user?.role === UserRole.ORG_LEADER ||
        field.admin.toString() === req.user?._id.toString() ||
        field.sharedWithAdmins.some((admin: any) => admin._id.toString() === req.user?._id.toString()) ||
        req.user?.field?.toString() === field._id.toString()

    if (!hasAccess) {
        res.status(403).json({
            success: false,
            message: "UNAUTHORIZED"
        })
        return;
    }

    res.status(200).json({
        success: true,
        data: field
    })
})

/**
 * @desc    
 * @route
 * @access
 */

export const updateField = asyncHandleWrapper(async (req: AuthRequest, res: Response) => {
    const { name, description, color, icon } = req.body

    const field = await Field.findById(req.params.id)

    if (!field) {
        res.status(404).json({
            success: false,
            message: "No Field Found"
        })
        return;
    }

    const isAdmin =
        field.admin.toString() === req.user?._id.toString();

    if (!isAdmin) {
        res.status(403).json({
            success: false,
            message: "UNAUTHORIZED"
        })
        return;
    }

    if (name) field.name = name;
    if (description) field.description = description;
    if (color) field.color = color;
    if (icon) field.icon = icon;

    await field.save();

    res.status(200).json({
        success: true,
        message: "Field updated Successfully",
        data: field
    })
})

/**
 * @desc 
 * @route
 * @access
 */

export const deleteField = asyncHandleWrapper(async (req: AuthRequest, res: Response) => {
    const field = await Field.findById(req.params.id);

    if (!field) {
        res.status(404).json({
            success: false,
            error: 'Field not found'
        });
        return;
    }

    const organization = await Organization.findById(field.organization);

    if (!organization) {
        res.status(404).json({
            success: false,
            error: 'Organization not found'
        });
        return;
    }

    if (organization.leader.toString() !== req.user?._id.toString()) {
        res.status(403).json({
            success: false,
            error: 'Only the organization leader can delete fields'
        });
        return;
    }

    organization.fields = organization.fields.filter(
        (fieldId) => fieldId.toString() !== field._id.toString()
    );
    organization.activeAdmins -= 1;
    await organization.save();

    // Update field admin user
    await User.findByIdAndUpdate(field.admin, {
        role: UserRole.MEMBER,
        $unset: { field: 1 },
        permissions: {
            canCreateTeams: false,
            canAssignTasks: false,
            canReviewSubmissions: false
        }
    });

    await field.deleteOne();

    res.status(200).json({
        success: true,
        message: 'Field deleted successfully'
    });
});

/**
 * @desc 
 * @route
 * @access
 */

export const getFieldTeams = asyncHandleWrapper(async (req: AuthRequest, res: Response) => {
    const field = await Field.findById(req.params.id)
        .populate({
            path: 'teams',
            populate: [
                {
                    path: 'members.user',
                    select: 'username email profilePicture'
                },
                {
                    path: 'workspace',
                    select: 'name description'
                }
            ]
        });

    if (!field) {
        res.status(404).json({
            success: false,
            message: "Field Not Found"
        })
        return;
    }

    res.status(200).json({
        success: true,
        count: field.teams.length,
        data: field.teams
    })
})