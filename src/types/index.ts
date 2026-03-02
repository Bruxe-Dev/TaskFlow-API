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