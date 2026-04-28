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
    const { name, description, fieldId, teamLeaderId, memberIds } = req.body;

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

    // Verify team leader exists and belongs to organization
    if (!teamLeaderId) {
        res.status(400).json({
            success: false,
            error: 'Team leader is required'
        });
        return;
    }

    const teamLeader = await User.findById(teamLeaderId);

    if (!teamLeader) {
        res.status(404).json({
            success: false,
            error: 'Team leader not found'
        });
        return;
    }

    if (teamLeader.organization?.toString() !== field.organization.toString()) {
        res.status(400).json({
            success: false,
            error: 'Team leader must belong to the same organization'
        });
        return;
    }

    // Verify all members belong to the same organization
    let allMemberIds = [teamLeaderId];  // Include team leader in members
    if (memberIds && memberIds.length > 0) {
        allMemberIds = [...allMemberIds, ...memberIds];
    }

    // Remove duplicates
    allMemberIds = [...new Set(allMemberIds)];

    const members = await User.find({ _id: { $in: allMemberIds } });

    if (members.length !== allMemberIds.length) {
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

    // Create the team
    const team = await Team.create({
        name,
        description,
        field: fieldId,
        organization: field.organization,
        teamLeader: teamLeaderId,  // 
        members: allMemberIds.map((userId: string) => ({
            user: userId,
            role: userId === teamLeaderId ? 'lead' : 'member',  // Leader gets 'lead' role
            joinedAt: new Date()
        }))
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

    // Update team with workspace reference
    team.workspace = workspace._id;
    await team.save();

    // Update field with new team
    field.teams.push(team._id);
    await field.save();

    // Update users to add team reference
    await User.updateMany(
        { _id: { $in: allMemberIds } },
        { $push: { teams: team._id } }
    );

    // Populate the response
    const populatedTeam = await Team.findById(team._id)
        .populate('teamLeader', 'username email profilePicture')
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
export const deleteTeam = asyncHandleWrapper(async (req: AuthRequest, res: Response) => {
    const team = await Team.findById(req.params.id);

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
            error: 'Only the field admin can delete teams'
        });
        return;
    }

    // Remove team from field
    field.teams = field.teams.filter(
        (teamId) => teamId.toString() !== team._id.toString()
    );
    await field.save();

    // Remove team from users
    await User.updateMany(
        { teams: team._id },
        { $pull: { teams: team._id } }
    );

    // Delete associated workspace
    if (team.workspace) {
        await Workspace.findByIdAndDelete(team.workspace);
    }

    // Delete the team
    await team.deleteOne();

    res.status(200).json({
        success: true,
        message: 'Team deleted successfully'
    });
});

/**
 * @desc    Add member to team
 * @route   POST /api/teams/:id/members
 * @access  Private (field admin only)
 */
export const addTeamMember = asyncHandleWrapper(async (req: AuthRequest, res: Response) => {
    const { userId, role } = req.body;

    const team = await Team.findById(req.params.id);

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
            error: 'Only the field admin can add team members'
        });
        return;
    }

    // Verify user exists
    const user = await User.findById(userId);

    if (!user) {
        res.status(404).json({
            success: false,
            error: 'User not found'
        });
        return;
    }

    // Check if user belongs to same organization
    if (user.organization?.toString() !== team.organization.toString()) {
        res.status(400).json({
            success: false,
            error: 'User must belong to the same organization'
        });
        return;
    }

    // Check if user is already a member
    const isMember = team.members.some(
        (member: any) => member.user.toString() === userId
    );

    if (isMember) {
        res.status(400).json({
            success: false,
            error: 'User is already a member of this team'
        });
        return;
    }

    // Add member to team
    team.members.push({
        user: userId,
        role: role || 'member',
        joinedAt: new Date()
    });
    await team.save();

    // Add team to user
    await User.findByIdAndUpdate(userId, {
        $push: { teams: team._id }
    });

    // Populate and return
    const updatedTeam = await Team.findById(team._id)
        .populate('members.user', 'username email profilePicture');

    res.status(200).json({
        success: true,
        message: 'Member added successfully',
        data: updatedTeam
    });
});

/**
 * @desc    Remove member from team
 * @route   DELETE /api/teams/:id/members/:userId
 * @access  Private (field admin only)
 */
export const removeTeamMember = asyncHandleWrapper(async (req: AuthRequest, res: Response) => {
    const team = await Team.findById(req.params.id);

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
            error: 'Only the field admin can remove team members'
        });
        return;
    }

    // Remove member from team
    team.members = team.members.filter(
        (member: any) => member.user.toString() !== req.params.userId
    );
    await team.save();

    // Remove team from user
    await User.findByIdAndUpdate(req.params.userId, {
        $pull: { teams: team._id }
    });

    res.status(200).json({
        success: true,
        message: 'Member removed successfully',
        data: team
    });
});

/**
 * @desc    Update member role in team
 * @route   PUT /api/teams/:id/members/:userId/role
 * @access  Private (field admin only)
 */
export const updateMemberRole = asyncHandleWrapper(async (req: AuthRequest, res: Response) => {
    const { role } = req.body;

    if (!['lead', 'member'].includes(role)) {
        res.status(400).json({
            success: false,
            error: 'Invalid role. Must be "lead" or "member"'
        });
        return;
    }

    const team = await Team.findById(req.params.id);

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
            error: 'Only the field admin can update member roles'
        });
        return;
    }

    // Find and update member
    const member = team.members.find(
        (m: any) => m.user.toString() === req.params.userId
    );

    if (!member) {
        res.status(404).json({
            success: false,
            error: 'Member not found in team'
        });
        return;
    }

    (member as any).role = role;
    await team.save();

    res.status(200).json({
        success: true,
        message: 'Member role updated successfully',
        data: team
    });
});

/**
 * @desc    Get team workspace
 * @route   GET /api/teams/:id/workspace
 * @access  Private (team members only)
 */
export const getTeamWorkspace = asyncHandleWrapper(async (req: AuthRequest, res: Response) => {
    const team = await Team.findById(req.params.id)
        .populate({
            path: 'workspace',
            populate: {
                path: 'projects',
                populate: 'tasks'
            }
        });

    if (!team) {
        res.status(404).json({
            success: false,
            error: 'Team not found'
        });
        return;
    }

    // Check if user is a team member
    const isMember = team.members.some(
        (member: any) => member.user.toString() === req.user?._id.toString()
    );

    if (!isMember) {
        res.status(403).json({
            success: false,
            error: 'Only team members can access the workspace'
        });
        return;
    }

    res.status(200).json({
        success: true,
        data: team.workspace
    });
});

/**
 * @desc    Get team projects
 * @route   GET /api/teams/:id/projects
 * @access  Private (team members + field admin)
 */
export const getTeamProjects = asyncHandleWrapper(async (req: AuthRequest, res: Response) => {
    const team = await Team.findById(req.params.id);

    if (!team) {
        res.status(404).json({
            success: false,
            error: 'Team not found'
        });
        return;
    }

    // Check access
    const isMember = team.members.some(
        (member: any) => member.user.toString() === req.user?._id.toString()
    );

    const field = await Field.findById(team.field);
    const isFieldAdmin = field?.admin.toString() === req.user?._id.toString();

    if (!isMember && !isFieldAdmin) {
        res.status(403).json({
            success: false,
            error: 'You do not have access to this team'
        });
        return;
    }

    const workspace = await Workspace.findById(team.workspace)
        .populate({
            path: 'projects',
            populate: 'assignedBy tasks'
        });

    res.status(200).json({
        success: true,
        count: workspace?.projects.length || 0,
        data: workspace?.projects || []
    });
});

/**
 * @desc    Get team statistics
 * @route   GET /api/teams/:id/stats
 * @access  Private (team members + field admin)
 */
export const getTeamStats = asyncHandleWrapper(async (req: AuthRequest, res: Response) => {
    const team = await Team.findById(req.params.id)
        .populate('workspace');

    if (!team) {
        res.status(404).json({
            success: false,
            error: 'Team not found'
        });
        return;
    }

    // Check access
    const isMember = team.members.some(
        (member: any) => member.user.toString() === req.user?._id.toString()
    );

    const field = await Field.findById(team.field);
    const isFieldAdmin = field?.admin.toString() === req.user?._id.toString();

    if (!isMember && !isFieldAdmin) {
        res.status(403).json({
            success: false,
            error: 'You do not have access to this team'
        });
        return;
    }

    // TODO: Add project and task stats once those models are integrated

    res.status(200).json({
        success: true,
        data: {
            memberCount: team.members.length,
            teamLeads: team.members.filter((m: any) => m.role === 'lead').length,
            regularMembers: team.members.filter((m: any) => m.role === 'member').length
        }
    });
});

/**
 * @desc    Change team leader
 * @route   PUT /api/teams/:id/leader
 * @access  Private (field admin only)
 */
export const changeTeamLeader = asyncHandleWrapper(async (req: AuthRequest, res: Response) => {
    const { newLeaderId } = req.body;

    if (!newLeaderId) {
        res.status(400).json({
            success: false,
            error: 'New leader ID is required'
        });
        return;
    }

    const team = await Team.findById(req.params.id);

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
            error: 'Only the field admin can change team leader'
        });
        return;
    }

    // Verify new leader exists
    const newLeader = await User.findById(newLeaderId);

    if (!newLeader) {
        res.status(404).json({
            success: false,
            error: 'New leader not found'
        });
        return;
    }

    // Check if new leader belongs to same organization
    if (newLeader.organization?.toString() !== team.organization.toString()) {
        res.status(400).json({
            success: false,
            error: 'New leader must belong to the same organization'
        });
        return;
    }

    // Check if new leader is a team member
    const isMember = team.members.some(
        (member: any) => member.user.toString() === newLeaderId
    );

    if (!isMember) {
        res.status(400).json({
            success: false,
            error: 'New leader must be a team member. Add them to the team first.'
        });
        return;
    }

    // Store old leader ID
    const oldLeaderId = team.teamLeader.toString();

    // Update team leader
    team.teamLeader = newLeader._id;

    // Update member roles
    team.members = team.members.map((member: any) => {
        if (member.user.toString() === newLeaderId) {
            // New leader gets 'lead' role
            member.role = 'lead';
        } else if (member.user.toString() === oldLeaderId) {
            // Old leader becomes regular member
            member.role = 'member';
        }
        return member;
    });

    await team.save();

    const updatedTeam = await Team.findById(team._id)
        .populate('teamLeader', 'username email profilePicture')
        .populate('members.user', 'username email profilePicture');

    res.status(200).json({
        success: true,
        message: 'Team leader changed successfully',
        data: updatedTeam
    });
});