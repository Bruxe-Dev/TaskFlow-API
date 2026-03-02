import { Document, Types } from 'mongoose';

export enum userRole {
    ORG_LEADER = 'org_leader',
    FIELD_ADMIN = 'field_admin',
    MEMBER = 'member'
}

export enum projectStatus {
    PENDING = 'pending',
    IN_PROGRESS = 'in_progress',
    REVIEW = 'review',
    COMPLETED = 'completed',
    OVERDUE = 'overdue'
}

export enum taskStatus {
    TODO = 'todo',
    IN_PROGRESS = 'in_progress',
    COMPLETED = 'completed'
}

export enum priority {
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