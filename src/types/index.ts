import { Document, Types } from 'mongoose';

export enum UserRole {
    ORG_LEADER = 'org_leader',
    FIELD_ADMIN = 'field_admin',
    MEMBER = 'member'
}

export enum ProjectStatus {
    PENDING = 'pending',
    IN_PROGRESS = 'in_progress',
    REVIEW = 'review',
    COMPLETED = 'completed',
    OVERDUE = 'overdue'
}

export enum TaskStatus {
    TODO = 'todo',
    IN_PROGRESS = 'in_progress',
    COMPLETED = 'completed'
}

export enum Priority {
    LOW = 'low',
    medium = 'medium',
    HIGH = 'high',
    URGENT = 'urgent'
}

export enum SubmissionStatus {
    PENDING = 'pending',
    UNDER_REVIEW = 'under-review',
    APPROVED = 'approved',
    REJECTED = 'rejected',
    REVISION_REQUESTED = 'revision-requested'
}

export enum NotificationType {
    TASK_ASSIGNED = 'task_assigned',
    DEADLINE_REMINDER = 'deadline_reminder',
    PROJECT_UPDATE = 'project_update',
    SUBMISSION_REVIEWED = 'submission_reviewed',
    ANNOUNCEMENT = 'announcement',
    ACCESS_GRANTED = 'access_granted',
    ACCESS_DENIED = 'access_denied'
}

export enum ProblemCategory {
    TECHNICAL = 'technical',
    RESOURCE = 'resource',
    COLLABORATION = 'collaboration',
    TIMELINE = 'timeline',
    OTHER = 'other'
}

export enum ProblemSeverity {
    LOW = 'low',
    MEDIUM = 'medium',
    HIGH = 'high',
    URGENT = 'urgent'
}

export enum ProblemStatus {
    OPEN = 'open',
    IN_PROGRESS = 'in_progress',
    RESOLVED = 'resolved',
    CLOSED = 'closed'
}

export enum AccessStatus {
    PENDING = 'pending',
    APPROVED = 'approved',
    DENIED = 'denied'
}

export interface IOrganisation extends Document {
    name: string;
    description?: string;
    industry?: string;
    leader: Types.ObjectId;
    maxAdmins: Number;
    activeAdmins: Number;
    fields: Types.ObjectId[];
    settings: {
        allowCrossFieldAccess: boolean;
        requireAccessRequestApproval: boolean;
        aiEnabled: boolean;
    };
    createdAt: Date;
    updatedAt: Date;
}