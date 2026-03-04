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

export interface IUser extends Document {
    username: string;
    email: string;
    password: string;
    role: UserRole;
    organization: Types.ObjectId;
    field: Types.ObjectId;
    teams: Types.ObjectId[];
    permissions: {
        canCreateTeams: boolean;
        canAssignTeams: boolean;
        canReviewSubmissions: boolean;
    };
    isEmailVerified: boolean;
    emailVerificationToken?: string;
    emailVerificationExpire?: Date;
    profilePicture: string;
    createdAt: Date;
    lastActive: Date;

    //Checking Methods
    matchPassword(enteredPassword: string): Promise<boolean>;
    getSignedJwtToken(): string;
    getEmailVerificationToken(): string;
}

export interface IField extends Document {
    name: string;
    description?: string;
    organization: Types.ObjectId;
    admin: Types.ObjectId;
    teams: Types.ObjectId[];
    sharedWithAdmins: Types.ObjectId[];
    color?: string;
    icon?: string;
    createdAt: Date;
}

export interface ITeam extends Document {
    name: string;
    description?: string;
    field: Types.ObjectId;
    organization: Types.ObjectId;
    members: {
        user: Types.ObjectId;
        role: 'leader' | 'member';
        joinedAt: Date
    }[];
    workspace: Types.ObjectId;
    createdAt: Date;
}

export interface IWorkspace extends Document {
    team: Types.ObjectId;
    name: string;
    description?: string;
    project: Types.ObjectId[];
    aiAssistantEnabled: boolean;
    aiConverstaions: Types.ObjectId[];
    settings: {
        allowFileSharing: boolean;
        notifyOnUpdates: boolean;
    };
    createdAt: Date;
}

export interface Iproject extends Document {
    name: string;
    description: string;
    workspace: Types.ObjectId;
    team: Types.ObjectId;
    assignedBy: Types.ObjectId;
    status: ProjectStatus;
    priority: Priority;
    tasks: Types.ObjectId[];
    submissions: Types.ObjectId[];
    progress: number;
    createdAt: Date;
    updatedAt: Date;
}

export interface ITask extends Document {
    name: string;
    desription?: string;
    task: Types.ObjectId;
    assignedTo: Types.ObjectId[];
    assignedBy: Types.ObjectId;
    status: TaskStatus;
    priority: Priority;
    dueDate: Date;
    dependancies: Types.ObjectId[];
    attachments: {
        name: string;
        url: string;
        uploadedAt: Date;
    }[];
    createdAt: Date;
    completedAt: Date;
}

export interface IUpdate extends Document {
    workspace: Types.ObjectId;
    user: Types.ObjectId;
    type: 'progress' | 'comment' | 'milestone' | 'blocker';
    content: string;
    relatedTo?: {
        type: 'project' | 'task';
        id: Types.ObjectId;
    };
    mentions: Types.ObjectId[];
    attachments: {
        url: string;
        name: string;
    }[];
    createdAt: Date;
}

export interface ISubmission extends Document {
    project: Types.ObjectId;
    submittedBy: Types.ObjectId;
    team: Types.ObjectId;
    content: string;
    files?: {
        name: string;
        url: string;
        size: Number;
    }[];
    status: SubmissionStatus;
    reviewedBy?: Types.ObjectId;
    reviewNotes?: string;
    reviewedAt?: Date;
    submittedAt: Date;
}

export interface INotifications extends Document {
    sender: Types.ObjectId;
    reciever: Types.ObjectId;
    type: NotificationType;
    title: string;
    message: string;
    link?: string;
    read: boolean;
    priority: Priority;
    createdAt: Date;
}

export interface IProblemReport extends Document {
    reportedBy: Types.ObjectId;
    team: Types.ObjectId;
    category: ProblemCategory;
    title: string;
    description: string;
    severity: ProblemSeverity;
    status: ProblemStatus;
    assignedTo?: Types.ObjectId;
    resolution?: string;
    attachments: {
        url: string
    }[];
    createdAt: Date;
    resolvedAt?: Date;
}

export interface IAccessRequest extends Document {
    requester: Types.ObjectId;
    targetField: Types.ObjectId;
    targetWorkspace?: Types.ObjectId;
    reason: string;
    status: AccessStatus;
    approvedBy?: Types.ObjectId;
    approvalNotes?: string;
    expiresAt?: Date;
    createdAt: Date;
    processedAt?: Date;
}

export interface IAIConversation extends Document {
    workspace: Types.ObjectId;
    user: Types.ObjectId;
    messages: {
        role: 'user' | 'assistant';
        content: string;
        timestamp: Date;
    }[];
    context?: {
        project?: Types.ObjectId;
        task?: Types.ObjectId;
    };
    createdAt: Date;
    lastMessageAt: Date;
}

export interface AuthRequest extends Request {
    user?: IUser;
}