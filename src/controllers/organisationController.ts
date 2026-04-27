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

/**
 * @desc 
 * @access
 * @route
 */

export const updateOrganization = asyncHandleWrapper(async (req: AuthRequest, res: Response) => {
    const { name, description, industry } = req.body;

    const organization = await Organization.findById(req.params.id)

    if (!organization) {
        res.status(404).json({
            success: false,
            message: "Organization Not Found"
        })
        return;
    }

    if (organization?.leader.toString() !== req.user?._id.toString()) {
        res.status(403).json({
            success: false,
            message: "UNAUTHORIZED, Please contact the Organization owner"
        })
        return;
    }

    if (name) organization.name = name;
    if (description) organization.description = description;
    if (industry) organization.industry = industry;

    await organization?.save()

    res.status(200).json({
        success: true,
        message: "Organization Updated Successfully",
        data: organization
    })
})

/**
 * @access
 * @desc 
 * @route
 */

export const deleteOrganization = asyncHandleWrapper(async (req: AuthRequest, res: Response) => {
    const organization = await Organization.findById(req.params.id);

    if (!organization) {
        res.status(404).json({
            success: false,
            message: "Organization Not Found"
        })
        return;
    }

    if (organization.leader.toString() !== req.user?._id.toString()) {
        res.status(403).json({
            success: false,
            message: "UNAUTHORIZED"
        })
        return;
    }

    // TODO: In production, I will:
    // 1. Archive instead of delete
    // 2. Transfer ownership
    // 3. Delete all related data (fields, teams, etc.)

    await organization.deleteOne();

    await User.updateMany(
        { organization: organization._id },
        { $unset: { organization: 1 }, role: UserRole.MEMBER }
    );

    res.status(200).json({
        success: true,
        message: "Organization deleted Successfully"
    })
})

/**
 * @desc
 * @route
 * @access
 */

export const getOrganizationDashboard = asyncHandleWrapper(async (req: AuthRequest, res: Response) => {
    const organization = await Organization.findById(req.params.id)
        .populate({
            path: 'fields',
            populate: {
                path: 'admin teams',
                select: 'username email name'
            }
        });

    if (!organization) {
        res.status(404).json({
            success: false,
            message: "Organization Not Found"
        })
        return;
    }

    const totalMembers = await User.countDocuments({ organization: organization._id })
    const fieldStats = await Promise.all(
        organization.fields.map(async (fieldId) => {
            const field = await Field.findById(fieldId)
                .populate('admin', 'username email')
                .populate('teams');

            return {
                fieldId: field?._id,
                fieldName: field?.name,
                admin: field?.admin,
                teamCount: field?.teams.length || 0
            };
        })
    );

    res.status(200).json({
        success: true,
        data: {
            organization: {
                _id: organization._id,
                name: organization.name,
                description: organization.description,
                industry: organization.industry,
                leader: organization.leader
            },
            stats: {
                totalMembers,
                totalFields: organization.fields.length,
                activeAdmins: organization.activeAdmins,
                maxAdmins: organization.maxAdmins
            },
            fields: fieldStats
        }
    });
});

/**
 * @desc
 * @route
 * @access
 */

export const getOrganizationFields = asyncHandleWrapper(async (req: AuthRequest, res: Response) => {
    const organization = await Organization.findById(req.params.id)
        .populate({
            path: 'fields',
            populate: {
                path: 'admin teams',
                select: 'username email name'
            }
        });

    if (!organization) {
        res.status(404).json({
            success: false,
            message: "Organization Not Found"
        })
        return;
    }

    res.status(200).json({
        success: true,
        count: organization.fields.length,
        data: organization.fields
    })
})

/**
 * @desc
 * @access
 * @route
 */

export const createField = asyncHandleWrapper(async (req: AuthRequest, res: Response) => {
    const { name, description, adminId, color, icon } = req.body;

    const organization = await Organization.findById(req.params.id)

    if (!organization) {
        res.status(404).json({
            success: false,
            message: "Organization Not Found"
        })
        return;
    }

    if (organization.activeAdmins >= organization.maxAdmins) {
        res.status(400).json({
            success: false,
            message: "Maximun Fields Reached"
        })
        return;
    }

    const admin = await User.findById(adminId);

    if (!admin) {
        res.status(404).json({
            success: false,
            error: 'Admin user not found'
        });
        return;
    }

    if (admin.organization?.toString() !== organization._id.toString()) {
        res.status(400).json({
            success: false,
            error: 'Admin must be a member of this organization'
        });
        return;
    }

    const field = await Field.create({
        name,
        description,
        organization: organization._id,
        admin: adminId,
        color,
        icon
    });

    organization.fields.push(field._id);
    organization.activeAdmins += 1;
    await organization.save();

    await User.findByIdAndUpdate(adminId, {
        role: UserRole.FIELD_ADMIN,
        field: field._id,
        permissions: {
            canCreateTeams: true,
            canAssignTasks: true,
            canReviewSubmissions: true
        }
    });

    res.status(201).json({
        success: true,
        message: 'Field created successfully',
        data: field
    });
});