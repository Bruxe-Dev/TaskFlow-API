import { AuthRequest } from "../middleware/auth";
import asyncHandleWrapper from "../middleware/asyncHandlewrapp";
import { Organization, User, Field, Team } from "../models";
import { UserRole } from "../types";
import { Request, Response } from "express";

/**
 * @desc get field details
 * @route GET /api/fields/:id
 * @access Private (Field Members only)
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
 * @desc Updating Field Details 
 * @route PUT /api/fields/:id
 * @access Private (Field Admin Only)
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
 * @desc Deleting a Field
 * @route DELETE /api/fields/:id
 * @access Private (Field Admin Only)
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
 * @desc Getting Field Descriptions
 * @route GET /api/fields/:id/teams
 * @access Private (Field Members only)
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

/**
 * @desc Creating a new Field
 * @route POST /api/fields/:id/teams
 * @access Private (Field Admins Only)
 */

export const createTeam = asyncHandleWrapper(async (req: AuthRequest, res: Response) => {
    const { name, description, membersIds } = req.body
    const field = await Field.findById(req.params.id)

    if (!Field) {
        res.status(404).json({
            success: false,
            message: "Field Not Found"
        })
        return;
    }

    if (field?.admin.toString() !== req.user?._id) {
        res.status(403).json({
            success: false,
            message: "UNAUTHORIZED"
        })
        return;
    }

    if (membersIds && membersIds.length > 0) {
        const members = await User.find({ _id: { $in: membersIds } })

        const invalidMembers = members.filter(
            (member) => member.organization?.toString() !== field?.organization.toString()
        );

        if (invalidMembers.length > 0) {
            res.status(400).json({
                success: false,
                error: 'All team members must belong to the same organization'
            });
            return;
        }
    }

    res.status(200).json({
        success: true,
        message: "Team Created Successfully"
    })
})

export const getFieldDashboard = asyncHandleWrapper(async (req: AuthRequest, res: Response) => {
    const field = await Field.findById(req.params.id)
        .populate('admin', 'username email')
        .populate({
            path: 'teams',
            populate: {
                path: 'workspace',
                populate: 'projects'
            }
        });

    if (!field) {
        res.status(404).json({
            success: false,
            error: 'Field not found'
        });
        return;
    }

    if (field.admin.toString() !== req.user?._id.toString()) {
        res.status(403).json({
            success: false,
            error: 'Only the field admin can view the dashboard'
        });
        return;
    }

    // Calculate statistics
    const teamStats = await Promise.all(
        field.teams.map(async (teamId) => {
            const team = await Team.findById(teamId)
                .populate('workspace')
                .populate('members.user', 'username email');

            return {
                teamId: team?._id,
                teamName: team?.name,
                memberCount: team?.members.length || 0,
                workspace: team?.workspace
            };
        })
    );

    res.status(200).json({
        success: true,
        data: {
            field: {
                _id: field._id,
                name: field.name,
                description: field.description,
                admin: field.admin,
                color: field.color,
                icon: field.icon
            },
            stats: {
                totalTeams: field.teams.length,
                totalMembers: teamStats.reduce((sum, team) => sum + team.memberCount, 0)
            },
            teams: teamStats
        }
    });
});

/**
 * @desc    Get field statistics
 * @route   GET /api/fields/:id/stats
 * @access  Private (field admin only)
 */
export const getFieldStats = asyncHandleWrapper(async (req: AuthRequest, res: Response) => {
    const field = await Field.findById(req.params.id);

    if (!field) {
        res.status(404).json({
            success: false,
            error: 'Field not found'
        });
        return;
    }

    // Check if user is the field admin
    if (field.admin.toString() !== req.user?._id.toString()) {
        res.status(403).json({
            success: false,
            error: 'Only the field admin can view statistics'
        });
        return;
    }

    // Count members in this field
    const totalMembers = await User.countDocuments({ field: field._id });

    res.status(200).json({
        success: true,
        data: {
            totalTeams: field.teams.length,
            totalMembers,
            sharedWith: field.sharedWithAdmins.length
        }
    });
});

/**
 * @desc    Share field access with another admin
 * @route   POST /api/fields/:id/share
 * @access  Private (field admin only)
 */
export const shareFieldAccess = asyncHandleWrapper(async (req: AuthRequest, res: Response) => {
    const { adminId } = req.body;

    const field = await Field.findById(req.params.id);

    if (!field) {
        res.status(404).json({
            success: false,
            error: 'Field not found'
        });
        return;
    }

    // Check if user is the field admin
    if (field.admin.toString() !== req.user?._id.toString()) {
        res.status(403).json({
            success: false,
            error: 'Only the field admin can share access'
        });
        return;
    }

    // Verify the admin exists and belongs to same organization
    const adminUser = await User.findById(adminId);

    if (!adminUser) {
        res.status(404).json({
            success: false,
            error: 'Admin user not found'
        });
        return;
    }

    if (adminUser.role !== UserRole.FIELD_ADMIN) {
        res.status(400).json({
            success: false,
            error: 'User must be a field admin'
        });
        return;
    }

    if (adminUser.organization?.toString() !== field.organization.toString()) {
        res.status(400).json({
            success: false,
            error: 'Admin must belong to the same organization'
        });
        return;
    }

    // Check if already shared
    if (field.sharedWithAdmins.includes(adminUser._id)) {
        res.status(400).json({
            success: false,
            error: 'Field is already shared with this admin'
        });
        return;
    }

    // Add admin to shared list
    field.sharedWithAdmins.push(adminUser._id);
    await field.save();

    res.status(200).json({
        success: true,
        message: 'Field access shared successfully',
        data: field
    });
});

/**
 * @desc    Remove shared field access
 * @route   DELETE /api/fields/:id/share/:adminId
 * @access  Private (field admin only)
 */
export const removeFieldAccess = asyncHandleWrapper(async (req: AuthRequest, res: Response) => {
    const field = await Field.findById(req.params.id);

    if (!field) {
        res.status(404).json({
            success: false,
            error: 'Field not found'
        });
        return;
    }

    // Check if user is the field admin
    if (field.admin.toString() !== req.user?._id.toString()) {
        res.status(403).json({
            success: false,
            error: 'Only the field admin can remove access'
        });
        return;
    }

    field.sharedWithAdmins = field.sharedWithAdmins.filter(
        (adminId) => adminId.toString() !== req.params.adminId
    );
    await field.save();

    res.status(200).json({
        success: true,
        message: 'Field access removed successfully',
        data: field
    });
});