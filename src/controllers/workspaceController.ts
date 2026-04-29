import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import asyncHandlewrapper from '../middleware/asyncHandlewrapp';
import { Workspace, Team, Project, Update, User } from '../models';
import { UserRole } from '../types';

/**
 * @desc Get Workspace details
 * @route GET /api/workspaces/:id
 * @access Private (Only team Members can access this)
 */

export const getWorkspace = asyncHandlewrapper(async (req: AuthRequest, res: Response) => {
    const workspace = await Workspace.findById(req.params.id)
        .populate('team')
        .populate({
            path: 'projects',
            populate: {
                path: 'assignedBy tasks',
                select: 'username title status'
            }
        });

    if (!workspace) {
        res.status(404).json({
            success: false,
            message: "No Worospace found"
        })
    }

    //Check if he is the member of the team

    const team = await Team.findById(workspace?.team)

    if (!team) {
        res.status(404).json({
            succcess: false,
            message: "Field Not Found"
        })
        return;
    }
    const isMember =
        team.members.some(
            (member: any) => member.user.toString() === req.user?.isDirectModified.toString()
        )

    if (!isMember && req.user?.role !== UserRole.ORG_LEADER) {
        res.status(403).json({
            success: false,
            message: "UNAUTHORIZED"
        })
        return;
    }

    res.status(200).json({
        success: true,
        data: workspace
    })
})