import { Request, response, Response } from "express";
import { AuthRequest } from "../middleware/auth";
import { UserRole } from "../types";
import { Field, User, Organization, Team, Workspace } from "../models";
import asyncHandleWrapper from "../middleware/asyncHandlewrapp";

/**
 * @desc Create a team
 * @route POST /api/teams/:id
 * @access Private (Field Admins only)
 */

export const createTeam = asyncHandleWrapper(async (req: AuthRequest, res: Response) => {
    const { name, description, fieldId, memberIds } = req.body;

    // Verify field exists
    const field = await Field.findById(fieldId);

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
            error: 'Only the field admin can create teams'
        });
        return;
    }

    // Verify all members belong to the same organization
    if (memberIds && memberIds.length > 0) {
        const members = await User.find({ _id: { $in: memberIds } });

        if (members.length !== memberIds.length) {
            res.status(404).json({
                success: false,
                error: 'One or more members not found'
            });
            return;
        }

        const invalidMembers = members.filter(
            (member) => member.organization?.toString() !== field.organization.toString()
        );

        if (invalidMembers.length > 0) {
            res.status(400).json({
                success: false,
                error: 'All team members must belong to the same organization'
            });
            return;
        }
    }

    // Create the team
    const team = await Team.create({
        name,
        description,
        field: fieldId,
        organization: field.organization,
        members: memberIds ? memberIds.map((userId: string, index: number) => ({
            user: userId,
            role: index === 0 ? 'lead' : 'member',  // First member is team lead
            joinedAt: new Date()
        })) : []
    });

    // Create workspace for the team
    const workspace = await Workspace.create({
        team: team._id,
        name: `${name} Workspace`,
        description: `Workspace for ${name} team`,
        aiAssistantEnabled: true,
        settings: {
            allowFileSharing: true,
            notifyOnUpdates: true
        }
    });

    team.workspace = workspace._id;
    await team.save();

    field.teams.push(team._id);
    await field.save();

    if (memberIds && memberIds.length > 0) {
        await User.updateMany(
            { _id: { $in: memberIds } },
            { $push: { teams: team._id } }
        );
    }

    const populatedTeam = await Team.findById(team._id)
        .populate('members.user', 'username email profilePicture')
        .populate('workspace')
        .populate('field', 'name');

    res.status(201).json({
        success: true,
        message: 'Team created successfully',
        data: populatedTeam
    });
});

/**
 * @desc Get team details in the Field
 * @route GET /api/teams/:id
 * @access Private (Team Members + Team Admin + Org Leader)
 */

export const getTeam = asyncHandleWrapper(async (req: AuthRequest, res: Response) => {
    const team = await Team.findById(req.params.id)
        .populate('members.user', 'username email profilePicture role')
        .populate('workspace')
        .populate('field', 'name admin')
        .populate('organization', 'name');


    if (!team) {
        res.status(404).json({
            success: false,
            message: "Team Not Found"
        })
    }

    const isMember = team?.members.some(
        (member: any) => member.user._id.toString() === req.user?._id.toString()
    )
    const field = await Field.findById(team?.field)
    const isFieldAdmin =
        field?.admin.toString() === req.user?._id.toString()
    const isOrgLeader =
        req.user?.role === UserRole.ORG_LEADER

    if (!isMember && !isFieldAdmin && isOrgLeader) {
        res.status(403).json({
            success: false,
            message: "UNAUTHORIZED!"
        })
    }

    res.status(200).json({
        success: true,
        data: team
    })
})

/**
 * @desc Update team (either members or assign new tasks)
 * @route PUT /api/teams/:id
 * @access Private (Only Field Admins can update the Teams)
 */

export const updateTeam = asyncHandleWrapper(async (req: AuthRequest, res: Response) => {
    const { name, description } = req.body;

    const team = await Team.findById(req.params.id).populate('field');

    if (!team) {
        res.status(404).json({
            success: false,
            error: 'Team not found'
        });
        return;
    }

    const field = await Field.findById(team.field);

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
            error: 'Only the field admin can update teams'
        });
        return;
    }

    // Update fields
    if (name) team.name = name;
    if (description) team.description = description;

    await team.save();

    res.status(200).json({
        success: true,
        message: 'Team updated successfully',
        data: team
    });
});