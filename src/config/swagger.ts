const ref = (name: string): any => ({ $ref: `#/components/schemas/${name}` });

const jsonContent = (schema: any): any => ({
    'application/json': { schema }
});

const successSchema = (options: {
    data?: any;
    message?: string;
    count?: number;
    unreadCount?: number;
    modifiedCount?: number;
    deletedCount?: number;
    recipientCount?: number;
    token?: boolean;
    extra?: Record<string, any>;
} = {}): any => ({
    type: 'object',
    properties: {
        success: { type: 'boolean', example: true },
        ...(options.message ? { message: { type: 'string', example: options.message } } : {}),
        ...(options.token ? { token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' } } : {}),
        ...(typeof options.count === 'number' ? { count: { type: 'integer', example: options.count } } : {}),
        ...(typeof options.unreadCount === 'number' ? { unreadCount: { type: 'integer', example: options.unreadCount } } : {}),
        ...(typeof options.modifiedCount === 'number' ? { modifiedCount: { type: 'integer', example: options.modifiedCount } } : {}),
        ...(typeof options.deletedCount === 'number' ? { deletedCount: { type: 'integer', example: options.deletedCount } } : {}),
        ...(typeof options.recipientCount === 'number' ? { recipientCount: { type: 'integer', example: options.recipientCount } } : {}),
        ...(options.data ? { data: options.data } : {}),
        ...(options.extra || {})
    }
});

const response = (description: string, schema: any): any => ({
    description,
    content: jsonContent(schema)
});

const successResponse = (
    description: string,
    options: Parameters<typeof successSchema>[0] = {}
): any => response(description, successSchema(options));

const errorResponse = (description: string, example: string): any =>
    response(description, {
        allOf: [
            ref('ErrorResponse'),
            {
                type: 'object',
                properties: {
                    error: { type: 'string', example }
                }
            }
        ]
    });

const requestBody = (schemaName: string, description?: string): any => ({
    required: true,
    ...(description ? { description } : {}),
    content: jsonContent(ref(schemaName))
});

const bearerSecurity = [{ bearerAuth: [] }];

const unauthorized = errorResponse('Unauthorized', 'Not authorized to access this route');
const forbidden = errorResponse('Forbidden', 'You do not have permission to perform this action');
const notFound = errorResponse('Resource not found', 'Resource not found');
const badRequest = errorResponse('Bad request', 'Invalid request payload');
const serverError = errorResponse('Server error', 'Server Error');

const protectedErrors = {
    401: unauthorized,
    403: forbidden,
    500: serverError
};

const protectedCrudErrors = {
    ...protectedErrors,
    404: notFound
};

const swaggerSpec = {
    openapi: '3.0.3',
    info: {
        title: 'TaskFlow System API',
        version: '1.0.0',
        description: 'Complete Swagger documentation for the TaskFlow backend, including authentication, organization hierarchy, workspaces, projects, tasks, submissions, notifications, reports, access requests, AI assistant workflows, and dashboards.'
    },
    servers: [
        {
            url: 'http://localhost:5000',
            description: 'Local development server'
        }
    ],
    tags: [
        { name: 'System', description: 'Service metadata and health checks' },
        { name: 'Auth', description: 'Registration, login, profile, and email verification' },
        { name: 'Organizations', description: 'Organization ownership and membership endpoints' },
        { name: 'Fields', description: 'Field administration and cross-field access' },
        { name: 'Teams', description: 'Team management, members, and leadership' },
        { name: 'Workspaces', description: 'Team workspace details, updates, and settings' },
        { name: 'Projects', description: 'Project lifecycle and project-scoped tasks' },
        { name: 'Tasks', description: 'Task execution, status, and attachments' },
        { name: 'Submissions', description: 'Project submission and review flows' },
        { name: 'Notifications', description: 'Personal and broadcast notifications' },
        { name: 'Reports', description: 'Problem reporting and resolution tracking' },
        { name: 'Access Requests', description: 'Cross-field or workspace access approvals' },
        { name: 'AI', description: 'AI assistant chat and suggestions' },
        { name: 'Dashboard', description: 'Role-specific dashboard and analytics endpoints' }
    ],
    components: {
        securitySchemes: {
            bearerAuth: {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT'
            }
        },
        schemas: {
            ErrorResponse: {
                type: 'object',
                properties: {
                    success: { type: 'boolean', example: false },
                    error: { type: 'string', example: 'Something went wrong' }
                }
            },
            ObjectId: {
                type: 'string',
                example: '6638d5c1a2b4c6d8e0f12345'
            },
            UserRole: {
                type: 'string',
                enum: ['org_leader', 'field_admin', 'team_leader', 'member']
            },
            ProjectStatus: {
                type: 'string',
                enum: ['pending', 'in_progress', 'review', 'completed', 'overdue']
            },
            TaskStatus: {
                type: 'string',
                enum: ['todo', 'in_progress', 'completed']
            },
            Priority: {
                type: 'string',
                enum: ['low', 'medium', 'high', 'urgent']
            },
            SubmissionStatus: {
                type: 'string',
                enum: ['pending', 'under-review', 'approved', 'rejected', 'revision-requested']
            },
            NotificationType: {
                type: 'string',
                enum: ['task_assigned', 'deadline_reminder', 'project_update', 'submission_reviewed', 'announcement', 'access_granted', 'access_denied']
            },
            ProblemCategory: {
                type: 'string',
                enum: ['technical', 'resource', 'collaboration', 'timeline', 'other']
            },
            ProblemSeverity: {
                type: 'string',
                enum: ['low', 'medium', 'high', 'urgent']
            },
            ProblemStatus: {
                type: 'string',
                enum: ['open', 'in_progress', 'resolved', 'closed']
            },
            AccessStatus: {
                type: 'string',
                enum: ['pending', 'approved', 'denied']
            },
            UserPermissions: {
                type: 'object',
                properties: {
                    canCreateTeams: { type: 'boolean', example: false },
                    canAssignTasks: { type: 'boolean', example: false },
                    canReviewSubmissions: { type: 'boolean', example: false }
                }
            },
            UserSummary: {
                type: 'object',
                properties: {
                    _id: ref('ObjectId'),
                    username: { type: 'string', example: 'jane.doe' },
                    email: { type: 'string', format: 'email', example: 'jane@example.com' },
                    avatar: { type: 'string', example: 'https://api.dicebear.com/7.x/initials/svg?seed=Jane' },
                    role: ref('UserRole')
                }
            },
            User: {
                allOf: [
                    ref('UserSummary'),
                    {
                        type: 'object',
                        properties: {
                            organization: {
                                oneOf: [ref('ObjectId'), ref('OrganizationSummary')]
                            },
                            field: {
                                oneOf: [ref('ObjectId'), ref('FieldSummary')]
                            },
                            teams: {
                                type: 'array',
                                items: {
                                    oneOf: [ref('ObjectId'), ref('TeamSummary')]
                                }
                            },
                            permissions: ref('UserPermissions'),
                            isEmailVerified: { type: 'boolean', example: true },
                            createdAt: { type: 'string', format: 'date-time' },
                            lastActive: { type: 'string', format: 'date-time' }
                        }
                    }
                ]
            },
            AuthUserData: {
                type: 'object',
                properties: {
                    id: ref('ObjectId'),
                    username: { type: 'string', example: 'jane.doe' },
                    email: { type: 'string', format: 'email', example: 'jane@example.com' },
                    isEmailVerified: { type: 'boolean', example: true }
                }
            },
            OrganizationSummary: {
                type: 'object',
                properties: {
                    _id: ref('ObjectId'),
                    name: { type: 'string', example: 'TaskFlow Labs' },
                    description: { type: 'string', example: 'Internal delivery organization' },
                    industry: { type: 'string', example: 'Software' }
                }
            },
            Organization: {
                allOf: [
                    ref('OrganizationSummary'),
                    {
                        type: 'object',
                        properties: {
                            leader: {
                                oneOf: [ref('ObjectId'), ref('UserSummary')]
                            },
                            maxAdmins: { type: 'integer', example: 6 },
                            activeAdmins: { type: 'integer', example: 2 },
                            fields: {
                                type: 'array',
                                items: {
                                    oneOf: [ref('ObjectId'), ref('FieldSummary')]
                                }
                            },
                            createdAt: { type: 'string', format: 'date-time' },
                            updatedAt: { type: 'string', format: 'date-time' }
                        }
                    }
                ]
            },
            FieldSummary: {
                type: 'object',
                properties: {
                    _id: ref('ObjectId'),
                    name: { type: 'string', example: 'Backend Engineering' },
                    description: { type: 'string', example: 'API and services team' },
                    color: { type: 'string', example: '#3B82F6' },
                    icon: { type: 'string', example: 'folder' }
                }
            },
            Field: {
                allOf: [
                    ref('FieldSummary'),
                    {
                        type: 'object',
                        properties: {
                            organization: {
                                oneOf: [ref('ObjectId'), ref('OrganizationSummary')]
                            },
                            admin: {
                                oneOf: [ref('ObjectId'), ref('UserSummary')]
                            },
                            teams: {
                                type: 'array',
                                items: {
                                    oneOf: [ref('ObjectId'), ref('TeamSummary')]
                                }
                            },
                            sharedWithAdmins: {
                                type: 'array',
                                items: {
                                    oneOf: [ref('ObjectId'), ref('UserSummary')]
                                }
                            },
                            createdAt: { type: 'string', format: 'date-time' }
                        }
                    }
                ]
            },
            TeamMember: {
                type: 'object',
                properties: {
                    user: {
                        oneOf: [ref('ObjectId'), ref('UserSummary')]
                    },
                    role: {
                        type: 'string',
                        enum: ['lead', 'member']
                    },
                    joinedAt: { type: 'string', format: 'date-time' }
                }
            },
            TeamSummary: {
                type: 'object',
                properties: {
                    _id: ref('ObjectId'),
                    name: { type: 'string', example: 'Platform Team' },
                    description: { type: 'string', example: 'Owns the shared backend services' }
                }
            },
            Team: {
                allOf: [
                    ref('TeamSummary'),
                    {
                        type: 'object',
                        properties: {
                            field: {
                                oneOf: [ref('ObjectId'), ref('FieldSummary')]
                            },
                            organization: {
                                oneOf: [ref('ObjectId'), ref('OrganizationSummary')]
                            },
                            teamLeader: {
                                oneOf: [ref('ObjectId'), ref('UserSummary')]
                            },
                            members: {
                                type: 'array',
                                items: ref('TeamMember')
                            },
                            workspace: {
                                oneOf: [ref('ObjectId'), ref('WorkspaceSummary')]
                            },
                            createdAt: { type: 'string', format: 'date-time' }
                        }
                    }
                ]
            },
            WorkspaceSettings: {
                type: 'object',
                properties: {
                    allowFileSharing: { type: 'boolean', example: true },
                    notifyOnUpdates: { type: 'boolean', example: true }
                }
            },
            WorkspaceSummary: {
                type: 'object',
                properties: {
                    _id: ref('ObjectId'),
                    name: { type: 'string', example: 'Platform Team Workspace' },
                    description: { type: 'string', example: 'Workspace for the platform team' }
                }
            },
            Workspace: {
                allOf: [
                    ref('WorkspaceSummary'),
                    {
                        type: 'object',
                        properties: {
                            team: {
                                oneOf: [ref('ObjectId'), ref('TeamSummary')]
                            },
                            projects: {
                                type: 'array',
                                items: {
                                    oneOf: [ref('ObjectId'), ref('ProjectSummary')]
                                }
                            },
                            aiAssistantEnabled: { type: 'boolean', example: true },
                            aiConversations: {
                                type: 'array',
                                items: {
                                    oneOf: [ref('ObjectId'), ref('AIConversationSummary')]
                                }
                            },
                            settings: ref('WorkspaceSettings'),
                            createdAt: { type: 'string', format: 'date-time' }
                        }
                    }
                ]
            },
            ProjectSummary: {
                type: 'object',
                properties: {
                    _id: ref('ObjectId'),
                    name: { type: 'string', example: 'Client Portal Revamp' },
                    description: { type: 'string', example: 'Build the next version of the client portal' },
                    status: ref('ProjectStatus'),
                    priority: ref('Priority'),
                    progress: { type: 'number', example: 45 }
                }
            },
            Project: {
                allOf: [
                    ref('ProjectSummary'),
                    {
                        type: 'object',
                        properties: {
                            workspace: {
                                oneOf: [ref('ObjectId'), ref('WorkspaceSummary')]
                            },
                            team: {
                                oneOf: [ref('ObjectId'), ref('TeamSummary')]
                            },
                            assignedBy: {
                                oneOf: [ref('ObjectId'), ref('UserSummary')]
                            },
                            deadline: { type: 'string', format: 'date-time' },
                            tasks: {
                                type: 'array',
                                items: {
                                    oneOf: [ref('ObjectId'), ref('TaskSummary')]
                                }
                            },
                            submissions: {
                                type: 'array',
                                items: {
                                    oneOf: [ref('ObjectId'), ref('Submission')]
                                }
                            },
                            createdAt: { type: 'string', format: 'date-time' },
                            updatedAt: { type: 'string', format: 'date-time' }
                        }
                    }
                ]
            },
            TaskAttachment: {
                type: 'object',
                properties: {
                    _id: ref('ObjectId'),
                    name: { type: 'string', example: 'design-notes.pdf' },
                    url: { type: 'string', example: 'https://files.example.com/design-notes.pdf' },
                    uploadedAt: { type: 'string', format: 'date-time' }
                }
            },
            TaskSummary: {
                type: 'object',
                properties: {
                    _id: ref('ObjectId'),
                    name: { type: 'string', example: 'Implement JWT refresh flow' },
                    description: { type: 'string', example: 'Add refresh token support to auth layer' },
                    status: ref('TaskStatus'),
                    priority: ref('Priority')
                }
            },
            Task: {
                allOf: [
                    ref('TaskSummary'),
                    {
                        type: 'object',
                        properties: {
                            project: {
                                oneOf: [ref('ObjectId'), ref('ProjectSummary')]
                            },
                            assignedTo: {
                                type: 'array',
                                items: {
                                    oneOf: [ref('ObjectId'), ref('UserSummary')]
                                }
                            },
                            assignedBy: {
                                oneOf: [ref('ObjectId'), ref('UserSummary')]
                            },
                            dueDate: { type: 'string', format: 'date-time' },
                            dependencies: {
                                type: 'array',
                                items: {
                                    oneOf: [ref('ObjectId'), ref('TaskSummary')]
                                }
                            },
                            attachments: {
                                type: 'array',
                                items: ref('TaskAttachment')
                            },
                            completed: { type: 'boolean', example: false },
                            completedAt: { type: 'string', format: 'date-time', nullable: true },
                            createdAt: { type: 'string', format: 'date-time' }
                        }
                    }
                ]
            },
            WorkspaceUpdate: {
                type: 'object',
                properties: {
                    _id: ref('ObjectId'),
                    workspace: {
                        oneOf: [ref('ObjectId'), ref('WorkspaceSummary')]
                    },
                    user: {
                        oneOf: [ref('ObjectId'), ref('UserSummary')]
                    },
                    type: {
                        type: 'string',
                        enum: ['progress', 'comment', 'milestone', 'blocker']
                    },
                    content: { type: 'string', example: 'Completed API validation pass.' },
                    relatedTo: {
                        type: 'object',
                        properties: {
                            type: { type: 'string', enum: ['project', 'task'] },
                            id: ref('ObjectId')
                        }
                    },
                    mentions: {
                        type: 'array',
                        items: {
                            oneOf: [ref('ObjectId'), ref('UserSummary')]
                        }
                    },
                    attachments: {
                        type: 'array',
                        items: {
                            type: 'object',
                            properties: {
                                url: { type: 'string', example: 'https://files.example.com/update.txt' },
                                name: { type: 'string', example: 'update.txt' }
                            }
                        }
                    },
                    createdAt: { type: 'string', format: 'date-time' }
                }
            },
            SubmissionFile: {
                type: 'object',
                properties: {
                    name: { type: 'string', example: 'release-notes.pdf' },
                    url: { type: 'string', example: 'https://files.example.com/release-notes.pdf' },
                    size: { type: 'number', example: 234523 }
                }
            },
            Submission: {
                type: 'object',
                properties: {
                    _id: ref('ObjectId'),
                    project: {
                        oneOf: [ref('ObjectId'), ref('ProjectSummary')]
                    },
                    submittedBy: {
                        oneOf: [ref('ObjectId'), ref('UserSummary')]
                    },
                    team: {
                        oneOf: [ref('ObjectId'), ref('TeamSummary')]
                    },
                    content: { type: 'string', example: 'Project delivered with final QA evidence attached.' },
                    files: {
                        type: 'array',
                        items: ref('SubmissionFile')
                    },
                    status: ref('SubmissionStatus'),
                    reviewedBy: {
                        oneOf: [ref('ObjectId'), ref('UserSummary')],
                        nullable: true
                    },
                    reviewNotes: { type: 'string', nullable: true },
                    reviewedAt: { type: 'string', format: 'date-time', nullable: true },
                    submittedAt: { type: 'string', format: 'date-time' }
                }
            },
            Notification: {
                type: 'object',
                properties: {
                    _id: ref('ObjectId'),
                    reciever: {
                        oneOf: [ref('ObjectId'), ref('UserSummary')]
                    },
                    sender: {
                        oneOf: [ref('ObjectId'), ref('UserSummary')],
                        nullable: true
                    },
                    type: ref('NotificationType'),
                    title: { type: 'string', example: 'New Task Assigned' },
                    message: { type: 'string', example: 'You have been assigned a new task.' },
                    link: { type: 'string', example: '/projects/123/tasks/456' },
                    read: { type: 'boolean', example: false },
                    priority: ref('Priority'),
                    createdAt: { type: 'string', format: 'date-time' }
                }
            },
            ProblemReport: {
                type: 'object',
                properties: {
                    _id: ref('ObjectId'),
                    reportedBy: {
                        oneOf: [ref('ObjectId'), ref('UserSummary')]
                    },
                    team: {
                        oneOf: [ref('ObjectId'), ref('TeamSummary')]
                    },
                    category: ref('ProblemCategory'),
                    title: { type: 'string', example: 'Deployment blocked in staging' },
                    description: { type: 'string', example: 'The release pipeline is failing at database migration.' },
                    severity: ref('ProblemSeverity'),
                    status: ref('ProblemStatus'),
                    assignedTo: {
                        oneOf: [ref('ObjectId'), ref('UserSummary')],
                        nullable: true
                    },
                    resolution: { type: 'string', nullable: true },
                    attachments: {
                        type: 'array',
                        items: {
                            type: 'object',
                            properties: {
                                url: { type: 'string', example: 'https://files.example.com/error-log.txt' }
                            }
                        }
                    },
                    createdAt: { type: 'string', format: 'date-time' },
                    resolvedAt: { type: 'string', format: 'date-time', nullable: true }
                }
            },
            AccessRequest: {
                type: 'object',
                properties: {
                    _id: ref('ObjectId'),
                    requester: {
                        oneOf: [ref('ObjectId'), ref('UserSummary')]
                    },
                    targetField: {
                        oneOf: [ref('ObjectId'), ref('FieldSummary')]
                    },
                    targetWorkspace: {
                        oneOf: [ref('ObjectId'), ref('WorkspaceSummary')],
                        nullable: true
                    },
                    reason: { type: 'string', example: 'I need temporary access to support the release cutover work.' },
                    status: ref('AccessStatus'),
                    approvedBy: {
                        oneOf: [ref('ObjectId'), ref('UserSummary')],
                        nullable: true
                    },
                    approvalNotes: { type: 'string', nullable: true },
                    expiresAt: { type: 'string', format: 'date-time', nullable: true },
                    createdAt: { type: 'string', format: 'date-time' },
                    processedAt: { type: 'string', format: 'date-time', nullable: true }
                }
            },
            AIConversationSummary: {
                type: 'object',
                properties: {
                    _id: ref('ObjectId'),
                    workspace: {
                        oneOf: [ref('ObjectId'), ref('WorkspaceSummary')]
                    },
                    user: {
                        oneOf: [ref('ObjectId'), ref('UserSummary')]
                    },
                    createdAt: { type: 'string', format: 'date-time' },
                    lastMessageAt: { type: 'string', format: 'date-time' }
                }
            },
            AIConversation: {
                allOf: [
                    ref('AIConversationSummary'),
                    {
                        type: 'object',
                        properties: {
                            messages: {
                                type: 'array',
                                items: {
                                    type: 'object',
                                    properties: {
                                        role: {
                                            type: 'string',
                                            enum: ['user', 'assistant']
                                        },
                                        content: { type: 'string', example: 'Break down this project into milestones.' },
                                        timestamp: { type: 'string', format: 'date-time' }
                                    }
                                }
                            },
                            context: {
                                type: 'object',
                                properties: {
                                    project: {
                                        oneOf: [ref('ObjectId'), ref('ProjectSummary')],
                                        nullable: true
                                    },
                                    task: {
                                        oneOf: [ref('ObjectId'), ref('TaskSummary')],
                                        nullable: true
                                    }
                                }
                            }
                        }
                    }
                ]
            },
            RegisterRequest: {
                type: 'object',
                required: ['username', 'email', 'password'],
                properties: {
                    username: { type: 'string', example: 'jane.doe' },
                    email: { type: 'string', format: 'email', example: 'jane@example.com' },
                    password: { type: 'string', format: 'password', example: 'secret123' }
                }
            },
            LoginRequest: {
                type: 'object',
                required: ['email', 'password'],
                properties: {
                    email: { type: 'string', format: 'email', example: 'jane@example.com' },
                    password: { type: 'string', format: 'password', example: 'secret123' }
                }
            },
            ResendVerificationRequest: {
                type: 'object',
                required: ['email'],
                properties: {
                    email: { type: 'string', format: 'email', example: 'jane@example.com' }
                }
            },
            UpdateProfileRequest: {
                type: 'object',
                properties: {
                    username: { type: 'string', example: 'jane.doe' },
                    avatar: { type: 'string', example: 'https://api.dicebear.com/7.x/initials/svg?seed=Jane' }
                }
            },
            OrganizationCreateRequest: {
                type: 'object',
                required: ['name'],
                properties: {
                    name: { type: 'string', example: 'TaskFlow Labs' },
                    description: { type: 'string', example: 'Internal delivery organization' },
                    industry: { type: 'string', example: 'Software' }
                }
            },
            OrganizationUpdateRequest: {
                type: 'object',
                properties: {
                    name: { type: 'string', example: 'TaskFlow Labs' },
                    description: { type: 'string', example: 'Updated organization description' },
                    industry: { type: 'string', example: 'Technology' }
                }
            },
            FieldUpdateRequest: {
                type: 'object',
                properties: {
                    name: { type: 'string', example: 'Backend Engineering' },
                    description: { type: 'string', example: 'API and services team' },
                    color: { type: 'string', example: '#3B82F6' },
                    icon: { type: 'string', example: 'folder' }
                }
            },
            FieldTeamRequest: {
                type: 'object',
                required: ['name'],
                properties: {
                    name: { type: 'string', example: 'Platform Team' },
                    description: { type: 'string', example: 'Shared services team' },
                    membersIds: {
                        type: 'array',
                        items: ref('ObjectId')
                    }
                }
            },
            ShareFieldAccessRequest: {
                type: 'object',
                required: ['adminId'],
                properties: {
                    adminId: ref('ObjectId')
                }
            },
            TeamCreateRequest: {
                type: 'object',
                required: ['name', 'fieldId', 'teamLeaderId'],
                properties: {
                    name: { type: 'string', example: 'Platform Team' },
                    description: { type: 'string', example: 'Owns internal platform services' },
                    fieldId: ref('ObjectId'),
                    teamLeaderId: ref('ObjectId'),
                    memberIds: {
                        type: 'array',
                        items: ref('ObjectId')
                    }
                }
            },
            TeamUpdateRequest: {
                type: 'object',
                properties: {
                    name: { type: 'string', example: 'Platform Team' },
                    description: { type: 'string', example: 'Updated team description' }
                }
            },
            TeamMemberAddRequest: {
                type: 'object',
                required: ['userId'],
                properties: {
                    userId: ref('ObjectId'),
                    role: {
                        type: 'string',
                        enum: ['lead', 'member'],
                        example: 'member'
                    }
                }
            },
            TeamMemberRoleRequest: {
                type: 'object',
                required: ['role'],
                properties: {
                    role: {
                        type: 'string',
                        enum: ['lead', 'member'],
                        example: 'lead'
                    }
                }
            },
            ChangeTeamLeaderRequest: {
                type: 'object',
                required: ['newLeaderId'],
                properties: {
                    newLeaderId: ref('ObjectId')
                }
            },
            WorkspaceUpdateRequest: {
                type: 'object',
                properties: {
                    name: { type: 'string', example: 'Platform Team Workspace' },
                    description: { type: 'string', example: 'Workspace for the platform squad' },
                    aiAssistantEnabled: { type: 'boolean', example: true },
                    settings: ref('WorkspaceSettings')
                }
            },
            WorkspaceUpdatePostRequest: {
                type: 'object',
                required: ['content'],
                properties: {
                    type: {
                        type: 'string',
                        enum: ['progress', 'comment', 'milestone', 'blocker'],
                        example: 'progress'
                    },
                    content: { type: 'string', example: 'Finished the API integration testing.' },
                    relatedTo: {
                        type: 'object',
                        properties: {
                            type: { type: 'string', enum: ['project', 'task'] },
                            id: ref('ObjectId')
                        }
                    },
                    mentions: {
                        type: 'array',
                        items: ref('ObjectId')
                    },
                    attachments: {
                        type: 'array',
                        items: {
                            type: 'object',
                            properties: {
                                url: { type: 'string', example: 'https://files.example.com/screenshot.png' },
                                name: { type: 'string', example: 'screenshot.png' }
                            }
                        }
                    }
                }
            },
            WorkspaceSettingsUpdateRequest: {
                type: 'object',
                properties: {
                    allowFileSharing: { type: 'boolean', example: true },
                    notifyOnUpdates: { type: 'boolean', example: true },
                    aiAssistantEnabled: { type: 'boolean', example: true }
                }
            },
            ProjectCreateRequest: {
                type: 'object',
                required: ['name', 'workspaceId', 'teamId'],
                properties: {
                    name: { type: 'string', example: 'Client Portal Revamp' },
                    description: { type: 'string', example: 'Build the next version of the client portal' },
                    workspaceId: ref('ObjectId'),
                    teamId: ref('ObjectId'),
                    priority: ref('Priority'),
                    deadline: { type: 'string', format: 'date-time' }
                }
            },
            ProjectUpdateRequest: {
                type: 'object',
                properties: {
                    name: { type: 'string', example: 'Client Portal Revamp' },
                    description: { type: 'string', example: 'Updated project scope' },
                    priority: ref('Priority'),
                    deadline: { type: 'string', format: 'date-time' },
                    status: ref('ProjectStatus')
                }
            },
            ProjectStatusUpdateRequest: {
                type: 'object',
                required: ['status'],
                properties: {
                    status: ref('ProjectStatus')
                }
            },
            ProjectTaskCreateRequest: {
                type: 'object',
                required: ['name'],
                properties: {
                    name: { type: 'string', example: 'Implement OAuth callback handler' },
                    description: { type: 'string', example: 'Handle provider callback and persist session' },
                    assignedTo: {
                        type: 'array',
                        items: ref('ObjectId')
                    },
                    priority: ref('Priority'),
                    dueDate: { type: 'string', format: 'date-time' },
                    dependencies: {
                        type: 'array',
                        items: ref('ObjectId')
                    }
                }
            },
            TaskUpdateRequest: {
                type: 'object',
                properties: {
                    title: { type: 'string', example: 'Implement OAuth callback handler' },
                    description: { type: 'string', example: 'Update callback logic and error handling' },
                    priority: ref('Priority'),
                    dueDate: { type: 'string', format: 'date-time' },
                    status: ref('TaskStatus')
                }
            },
            TaskStatusUpdateRequest: {
                type: 'object',
                required: ['status'],
                properties: {
                    status: ref('TaskStatus')
                }
            },
            TaskAttachmentRequest: {
                type: 'object',
                required: ['name', 'url'],
                properties: {
                    name: { type: 'string', example: 'api-contract.pdf' },
                    url: { type: 'string', example: 'https://files.example.com/api-contract.pdf' }
                }
            },
            SubmissionCreateRequest: {
                type: 'object',
                required: ['projectId', 'content'],
                properties: {
                    projectId: ref('ObjectId'),
                    content: { type: 'string', example: 'Final project submission with links and evidence.' },
                    files: {
                        type: 'array',
                        items: ref('SubmissionFile')
                    }
                }
            },
            SubmissionReviewRequest: {
                type: 'object',
                required: ['status'],
                properties: {
                    status: {
                        type: 'string',
                        enum: ['approved', 'rejected', 'revision-requested']
                    },
                    reviewNotes: { type: 'string', example: 'Please tighten the deployment rollback notes.' }
                }
            },
            BroadcastNotificationRequest: {
                type: 'object',
                required: ['title', 'message', 'targetType'],
                properties: {
                    title: { type: 'string', example: 'Maintenance Window' },
                    message: { type: 'string', example: 'Deployment freeze starts at 18:00 UTC.' },
                    targetType: {
                        type: 'string',
                        enum: ['team', 'field', 'organization']
                    },
                    targetId: ref('ObjectId'),
                    priority: ref('Priority')
                }
            },
            ProblemReportCreateRequest: {
                type: 'object',
                required: ['teamId', 'category', 'title', 'description'],
                properties: {
                    teamId: ref('ObjectId'),
                    category: ref('ProblemCategory'),
                    title: { type: 'string', example: 'Deployment blocked in staging' },
                    description: { type: 'string', example: 'The release pipeline is failing at database migration.' },
                    severity: ref('ProblemSeverity'),
                    attachments: {
                        type: 'array',
                        items: {
                            type: 'object',
                            properties: {
                                url: { type: 'string', example: 'https://files.example.com/log.txt' }
                            }
                        }
                    }
                }
            },
            ProblemReportUpdateRequest: {
                type: 'object',
                properties: {
                    title: { type: 'string', example: 'Updated report title' },
                    description: { type: 'string', example: 'Updated issue description' },
                    severity: ref('ProblemSeverity'),
                    category: ref('ProblemCategory')
                }
            },
            ProblemAssignRequest: {
                type: 'object',
                properties: {
                    adminId: ref('ObjectId')
                }
            },
            ProblemStatusUpdateRequest: {
                type: 'object',
                required: ['status'],
                properties: {
                    status: ref('ProblemStatus')
                }
            },
            ProblemResolveRequest: {
                type: 'object',
                required: ['resolution'],
                properties: {
                    resolution: { type: 'string', example: 'Re-ran the migration with corrected permissions.' }
                }
            },
            AccessRequestCreateRequest: {
                type: 'object',
                required: ['targetFieldId', 'reason'],
                properties: {
                    targetFieldId: ref('ObjectId'),
                    targetWorkspaceId: ref('ObjectId'),
                    reason: { type: 'string', minLength: 20, example: 'I need temporary access to assist with shared release work.' }
                }
            },
            AccessRequestUpdateRequest: {
                type: 'object',
                properties: {
                    reason: { type: 'string', minLength: 20, example: 'Updated justification for cross-field access.' }
                }
            },
            AccessRequestApproveRequest: {
                type: 'object',
                properties: {
                    approvalNotes: { type: 'string', example: 'Approved for release support.' },
                    expiresInDays: { type: 'integer', example: 7 }
                }
            },
            AccessRequestDenyRequest: {
                type: 'object',
                properties: {
                    approvalNotes: { type: 'string', example: 'This request is not needed for the current sprint.' }
                }
            },
            AIChatRequest: {
                type: 'object',
                required: ['workspaceId', 'message'],
                properties: {
                    workspaceId: ref('ObjectId'),
                    message: { type: 'string', example: 'Break down this project into the next 3 milestones.' },
                    conversationId: ref('ObjectId'),
                    projectId: ref('ObjectId'),
                    taskId: ref('ObjectId')
                }
            },
            AIContinueConversationRequest: {
                type: 'object',
                required: ['message'],
                properties: {
                    message: { type: 'string', example: 'Give me a shorter action plan.' }
                }
            }
        }
    },
    paths: {
        '/': {
            get: {
                tags: ['System'],
                summary: 'Get API metadata',
                responses: {
                    200: successResponse('Service metadata', {
                        data: {
                            type: 'object',
                            properties: {
                                message: { type: 'string', example: 'TaskFlow Enterprise API' },
                                version: { type: 'string', example: '1.0.0' },
                                status: { type: 'string', example: 'Running' }
                            }
                        }
                    })
                }
            }
        },
        '/health': {
            get: {
                tags: ['System'],
                summary: 'Health check',
                responses: {
                    200: successResponse('Service health', {
                        data: {
                            type: 'object',
                            properties: {
                                status: { type: 'string', example: 'OK' },
                                environment: { type: 'string', example: 'development' },
                                timestamp: { type: 'string', format: 'date-time' }
                            }
                        }
                    })
                }
            }
        },
        '/api/auth/register': {
            post: {
                tags: ['Auth'],
                summary: 'Register a new user',
                requestBody: requestBody('RegisterRequest'),
                responses: {
                    201: successResponse('Registration created', {
                        message: 'Registration initiated. Please check your email to verify your account within 10 minutes.',
                        data: {
                            type: 'object',
                            properties: {
                                username: { type: 'string', example: 'jane.doe' },
                                email: { type: 'string', format: 'email', example: 'jane@example.com' }
                            }
                        }
                    }),
                    400: errorResponse('Registration validation failed', 'User with this email already exists'),
                    500: errorResponse('Email delivery failed', 'Email could not be sent. Please try again.')
                }
            }
        },
        '/api/auth/verify-email/{token}': {
            get: {
                tags: ['Auth'],
                summary: 'Verify email address',
                parameters: [
                    {
                        name: 'token',
                        in: 'path',
                        required: true,
                        schema: { type: 'string' }
                    }
                ],
                responses: {
                    200: successResponse('Email verified successfully', {
                        message: 'Email verified successfully! Your account has been created and you are now logged in.',
                        token: true,
                        data: ref('AuthUserData')
                    }),
                    400: errorResponse('Invalid verification token', 'Invalid or expired verification token. Please register again.'),
                    500: serverError
                }
            }
        },
        '/api/auth/login': {
            post: {
                tags: ['Auth'],
                summary: 'Login with email and password',
                requestBody: requestBody('LoginRequest'),
                responses: {
                    200: successResponse('Login successful', {
                        token: true,
                        data: ref('AuthUserData')
                    }),
                    400: errorResponse('Missing credentials', 'Please provide email and password'),
                    401: errorResponse('Invalid credentials', 'Invalid credentials'),
                    500: serverError
                }
            }
        },
        '/api/auth/resend-verification': {
            post: {
                tags: ['Auth'],
                summary: 'Resend verification email',
                requestBody: requestBody('ResendVerificationRequest'),
                responses: {
                    200: successResponse('Verification email sent', {
                        message: 'Verification email sent'
                    }),
                    404: errorResponse('Pending registration not found', 'No pending registration found with that email'),
                    500: serverError
                }
            }
        },
        '/api/auth/update-profile': {
            put: {
                tags: ['Auth'],
                summary: 'Update the current user profile',
                security: bearerSecurity,
                requestBody: requestBody('UpdateProfileRequest'),
                responses: {
                    200: successResponse('Profile updated successfully', {
                        message: 'Profile updated successfully',
                        data: ref('User')
                    }),
                    404: errorResponse('User not found', 'User not found'),
                    ...protectedErrors
                }
            }
        },
        '/api/auth/me': {
            get: {
                tags: ['Auth'],
                summary: 'Get the current authenticated user',
                security: bearerSecurity,
                responses: {
                    200: successResponse('Current user retrieved', {
                        data: ref('User')
                    }),
                    ...protectedErrors
                }
            }
        },
        '/api/organizations': {
            post: {
                tags: ['Organizations'],
                summary: 'Create an organization',
                security: bearerSecurity,
                requestBody: requestBody('OrganizationCreateRequest'),
                responses: {
                    200: successResponse('Organization created', {
                        message: 'Organization Successfully created. You are now the owner of the Organization',
                        data: ref('Organization')
                    }),
                    400: errorResponse('Organization creation failed', 'You are already enrolled in this Organization! Leave you current Organization first'),
                    ...protectedErrors
                }
            }
        },
        '/api/organizations/{id}': {
            get: {
                tags: ['Organizations'],
                summary: 'Get organization details',
                security: bearerSecurity,
                parameters: [{ name: 'id', in: 'path', required: true, schema: ref('ObjectId') }],
                responses: {
                    200: successResponse('Organization retrieved', {
                        data: ref('Organization')
                    }),
                    ...protectedCrudErrors
                }
            },
            put: {
                tags: ['Organizations'],
                summary: 'Update organization details',
                security: bearerSecurity,
                parameters: [{ name: 'id', in: 'path', required: true, schema: ref('ObjectId') }],
                requestBody: requestBody('OrganizationUpdateRequest'),
                responses: {
                    200: successResponse('Organization updated', {
                        message: 'Organization Updated Successfully',
                        data: ref('Organization')
                    }),
                    ...protectedCrudErrors
                }
            }
        },
        '/api/fields/{id}': {
            get: {
                tags: ['Fields'],
                summary: 'Get field details',
                security: bearerSecurity,
                parameters: [{ name: 'id', in: 'path', required: true, schema: ref('ObjectId') }],
                responses: {
                    200: successResponse('Field retrieved', {
                        data: ref('Field')
                    }),
                    ...protectedCrudErrors
                }
            },
            put: {
                tags: ['Fields'],
                summary: 'Update field details',
                security: bearerSecurity,
                parameters: [{ name: 'id', in: 'path', required: true, schema: ref('ObjectId') }],
                requestBody: requestBody('FieldUpdateRequest'),
                responses: {
                    200: successResponse('Field updated', {
                        message: 'Field updated Successfully',
                        data: ref('Field')
                    }),
                    ...protectedCrudErrors
                }
            },
            delete: {
                tags: ['Fields'],
                summary: 'Delete a field',
                security: bearerSecurity,
                parameters: [{ name: 'id', in: 'path', required: true, schema: ref('ObjectId') }],
                responses: {
                    200: successResponse('Field deleted', {
                        message: 'Field deleted successfully'
                    }),
                    ...protectedCrudErrors
                }
            }
        },
        '/api/fields/{id}/teams': {
            get: {
                tags: ['Fields'],
                summary: 'Get teams in a field',
                security: bearerSecurity,
                parameters: [{ name: 'id', in: 'path', required: true, schema: ref('ObjectId') }],
                responses: {
                    200: successResponse('Field teams retrieved', {
                        count: 2,
                        data: {
                            type: 'array',
                            items: ref('Team')
                        }
                    }),
                    ...protectedCrudErrors
                }
            },
            post: {
                tags: ['Fields'],
                summary: 'Create a field-scoped team draft',
                description: 'This route currently validates access and member organization consistency, then returns a success message without returning a created team resource.',
                security: bearerSecurity,
                parameters: [{ name: 'id', in: 'path', required: true, schema: ref('ObjectId') }],
                requestBody: requestBody('FieldTeamRequest'),
                responses: {
                    200: successResponse('Field team flow completed', {
                        message: 'Team Created Successfully'
                    }),
                    400: badRequest,
                    ...protectedCrudErrors
                }
            }
        },
        '/api/fields/{id}/dashboard': {
            get: {
                tags: ['Fields'],
                summary: 'Get field dashboard',
                security: bearerSecurity,
                parameters: [{ name: 'id', in: 'path', required: true, schema: ref('ObjectId') }],
                responses: {
                    200: successResponse('Field dashboard retrieved', {
                        data: {
                            type: 'object',
                            properties: {
                                field: ref('FieldSummary'),
                                stats: {
                                    type: 'object',
                                    properties: {
                                        totalTeams: { type: 'integer', example: 3 },
                                        totalMembers: { type: 'integer', example: 18 }
                                    }
                                },
                                teams: {
                                    type: 'array',
                                    items: {
                                        type: 'object',
                                        properties: {
                                            teamId: ref('ObjectId'),
                                            teamName: { type: 'string', example: 'Platform Team' },
                                            memberCount: { type: 'integer', example: 6 },
                                            workspace: ref('Workspace')
                                        }
                                    }
                                }
                            }
                        }
                    }),
                    ...protectedCrudErrors
                }
            }
        },
        '/api/fields/{id}/stats': {
            get: {
                tags: ['Fields'],
                summary: 'Get field statistics',
                security: bearerSecurity,
                parameters: [{ name: 'id', in: 'path', required: true, schema: ref('ObjectId') }],
                responses: {
                    200: successResponse('Field stats retrieved', {
                        data: {
                            type: 'object',
                            properties: {
                                totalTeams: { type: 'integer', example: 3 },
                                totalMembers: { type: 'integer', example: 18 },
                                sharedWith: { type: 'integer', example: 1 }
                            }
                        }
                    }),
                    ...protectedCrudErrors
                }
            }
        },
        '/api/fields/{id}/share': {
            post: {
                tags: ['Fields'],
                summary: 'Share field access with another admin',
                security: bearerSecurity,
                parameters: [{ name: 'id', in: 'path', required: true, schema: ref('ObjectId') }],
                requestBody: requestBody('ShareFieldAccessRequest'),
                responses: {
                    200: successResponse('Field access shared', {
                        message: 'Field access shared successfully',
                        data: ref('Field')
                    }),
                    400: badRequest,
                    ...protectedCrudErrors
                }
            }
        },
        '/api/fields/{id}/share/{adminId}': {
            delete: {
                tags: ['Fields'],
                summary: 'Remove shared field access',
                security: bearerSecurity,
                parameters: [
                    { name: 'id', in: 'path', required: true, schema: ref('ObjectId') },
                    { name: 'adminId', in: 'path', required: true, schema: ref('ObjectId') }
                ],
                responses: {
                    200: successResponse('Field access removed', {
                        message: 'Field access removed successfully',
                        data: ref('Field')
                    }),
                    ...protectedCrudErrors
                }
            }
        },
        '/api/teams': {
            post: {
                tags: ['Teams'],
                summary: 'Create a team',
                security: bearerSecurity,
                requestBody: requestBody('TeamCreateRequest'),
                responses: {
                    201: successResponse('Team created', {
                        message: 'Team created successfully',
                        data: ref('Team')
                    }),
                    400: badRequest,
                    ...protectedCrudErrors
                }
            }
        },
        '/api/teams/{id}': {
            get: {
                tags: ['Teams'],
                summary: 'Get team details',
                security: bearerSecurity,
                parameters: [{ name: 'id', in: 'path', required: true, schema: ref('ObjectId') }],
                responses: {
                    200: successResponse('Team retrieved', {
                        data: ref('Team')
                    }),
                    ...protectedCrudErrors
                }
            },
            put: {
                tags: ['Teams'],
                summary: 'Update a team',
                security: bearerSecurity,
                parameters: [{ name: 'id', in: 'path', required: true, schema: ref('ObjectId') }],
                requestBody: requestBody('TeamUpdateRequest'),
                responses: {
                    200: successResponse('Team updated', {
                        message: 'Team updated successfully',
                        data: ref('Team')
                    }),
                    ...protectedCrudErrors
                }
            },
            delete: {
                tags: ['Teams'],
                summary: 'Delete a team',
                security: bearerSecurity,
                parameters: [{ name: 'id', in: 'path', required: true, schema: ref('ObjectId') }],
                responses: {
                    200: successResponse('Team deleted', {
                        message: 'Team deleted successfully'
                    }),
                    ...protectedCrudErrors
                }
            }
        },
        '/api/teams/{id}/leader': {
            put: {
                tags: ['Teams'],
                summary: 'Change team leader',
                security: bearerSecurity,
                parameters: [{ name: 'id', in: 'path', required: true, schema: ref('ObjectId') }],
                requestBody: requestBody('ChangeTeamLeaderRequest'),
                responses: {
                    200: successResponse('Team leader changed', {
                        message: 'Team leader changed successfully',
                        data: ref('Team')
                    }),
                    ...protectedCrudErrors
                }
            }
        },
        '/api/teams/{id}/members': {
            post: {
                tags: ['Teams'],
                summary: 'Add a member to a team',
                security: bearerSecurity,
                parameters: [{ name: 'id', in: 'path', required: true, schema: ref('ObjectId') }],
                requestBody: requestBody('TeamMemberAddRequest'),
                responses: {
                    200: successResponse('Team member added', {
                        message: 'Member added successfully',
                        data: ref('Team')
                    }),
                    400: badRequest,
                    ...protectedCrudErrors
                }
            }
        },
        '/api/teams/{id}/members/{userId}': {
            delete: {
                tags: ['Teams'],
                summary: 'Remove a member from a team',
                security: bearerSecurity,
                parameters: [
                    { name: 'id', in: 'path', required: true, schema: ref('ObjectId') },
                    { name: 'userId', in: 'path', required: true, schema: ref('ObjectId') }
                ],
                responses: {
                    200: successResponse('Team member removed', {
                        message: 'Member removed successfully',
                        data: ref('Team')
                    }),
                    ...protectedCrudErrors
                }
            }
        },
        '/api/teams/{id}/members/{userId}/role': {
            put: {
                tags: ['Teams'],
                summary: 'Update a team member role',
                security: bearerSecurity,
                parameters: [
                    { name: 'id', in: 'path', required: true, schema: ref('ObjectId') },
                    { name: 'userId', in: 'path', required: true, schema: ref('ObjectId') }
                ],
                requestBody: requestBody('TeamMemberRoleRequest'),
                responses: {
                    200: successResponse('Team member role updated', {
                        message: 'Member role updated successfully',
                        data: ref('Team')
                    }),
                    400: badRequest,
                    ...protectedCrudErrors
                }
            }
        },
        '/api/teams/{id}/workspace': {
            get: {
                tags: ['Teams'],
                summary: 'Get the team workspace',
                security: bearerSecurity,
                parameters: [{ name: 'id', in: 'path', required: true, schema: ref('ObjectId') }],
                responses: {
                    200: successResponse('Team workspace retrieved', {
                        data: ref('Workspace')
                    }),
                    ...protectedCrudErrors
                }
            }
        },
        '/api/teams/{id}/projects': {
            get: {
                tags: ['Teams'],
                summary: 'Get projects assigned to a team',
                security: bearerSecurity,
                parameters: [{ name: 'id', in: 'path', required: true, schema: ref('ObjectId') }],
                responses: {
                    200: successResponse('Team projects retrieved', {
                        count: 2,
                        data: {
                            type: 'array',
                            items: ref('Project')
                        }
                    }),
                    ...protectedCrudErrors
                }
            }
        },
        '/api/teams/{id}/stats': {
            get: {
                tags: ['Teams'],
                summary: 'Get team statistics',
                security: bearerSecurity,
                parameters: [{ name: 'id', in: 'path', required: true, schema: ref('ObjectId') }],
                responses: {
                    200: successResponse('Team stats retrieved', {
                        data: {
                            type: 'object',
                            properties: {
                                memberCount: { type: 'integer', example: 6 },
                                teamLeads: { type: 'integer', example: 1 },
                                regularMembers: { type: 'integer', example: 5 }
                            }
                        }
                    }),
                    ...protectedCrudErrors
                }
            }
        },
        '/api/workspaces/{id}': {
            get: {
                tags: ['Workspaces'],
                summary: 'Get workspace details',
                security: bearerSecurity,
                parameters: [{ name: 'id', in: 'path', required: true, schema: ref('ObjectId') }],
                responses: {
                    200: successResponse('Workspace retrieved', {
                        data: ref('Workspace')
                    }),
                    ...protectedCrudErrors
                }
            },
            put: {
                tags: ['Workspaces'],
                summary: 'Update workspace details',
                security: bearerSecurity,
                parameters: [{ name: 'id', in: 'path', required: true, schema: ref('ObjectId') }],
                requestBody: requestBody('WorkspaceUpdateRequest'),
                responses: {
                    200: successResponse('Workspace updated', {
                        message: 'Workspace updated successfully',
                        data: ref('Workspace')
                    }),
                    ...protectedCrudErrors
                }
            }
        },
        '/api/workspaces/{id}/projects': {
            get: {
                tags: ['Workspaces'],
                summary: 'Get projects in a workspace',
                security: bearerSecurity,
                parameters: [{ name: 'id', in: 'path', required: true, schema: ref('ObjectId') }],
                responses: {
                    200: successResponse('Workspace projects retrieved', {
                        count: 2,
                        data: {
                            type: 'array',
                            items: ref('Project')
                        }
                    }),
                    ...protectedCrudErrors
                }
            }
        },
        '/api/workspaces/{id}/updates': {
            get: {
                tags: ['Workspaces'],
                summary: 'Get recent workspace updates',
                security: bearerSecurity,
                parameters: [{ name: 'id', in: 'path', required: true, schema: ref('ObjectId') }],
                responses: {
                    200: successResponse('Workspace updates retrieved', {
                        count: 3,
                        data: {
                            type: 'array',
                            items: ref('WorkspaceUpdate')
                        }
                    }),
                    ...protectedCrudErrors
                }
            },
            post: {
                tags: ['Workspaces'],
                summary: 'Post a workspace update',
                security: bearerSecurity,
                parameters: [{ name: 'id', in: 'path', required: true, schema: ref('ObjectId') }],
                requestBody: requestBody('WorkspaceUpdatePostRequest'),
                responses: {
                    201: successResponse('Workspace update created', {
                        message: 'Update posted successfully',
                        data: ref('WorkspaceUpdate')
                    }),
                    400: errorResponse('Missing update content', 'Update content is required'),
                    ...protectedCrudErrors
                }
            }
        },
        '/api/workspaces/{id}/members': {
            get: {
                tags: ['Workspaces'],
                summary: 'Get workspace members',
                security: bearerSecurity,
                parameters: [{ name: 'id', in: 'path', required: true, schema: ref('ObjectId') }],
                responses: {
                    200: successResponse('Workspace members retrieved', {
                        data: {
                            type: 'object',
                            properties: {
                                teamLeader: ref('UserSummary'),
                                members: {
                                    type: 'array',
                                    items: ref('TeamMember')
                                },
                                totalMembers: { type: 'integer', example: 6 }
                            }
                        }
                    }),
                    ...protectedCrudErrors
                }
            }
        },
        '/api/workspaces/{id}/settings': {
            put: {
                tags: ['Workspaces'],
                summary: 'Update workspace settings',
                security: bearerSecurity,
                parameters: [{ name: 'id', in: 'path', required: true, schema: ref('ObjectId') }],
                requestBody: requestBody('WorkspaceSettingsUpdateRequest'),
                responses: {
                    200: successResponse('Workspace settings updated', {
                        message: 'Workspace settings updated successfully',
                        data: ref('Workspace')
                    }),
                    ...protectedCrudErrors
                }
            }
        },
        '/api/projects': {
            post: {
                tags: ['Projects'],
                summary: 'Create a project',
                security: bearerSecurity,
                requestBody: requestBody('ProjectCreateRequest'),
                responses: {
                    201: successResponse('Project created', {
                        message: 'Project created and assigned successfully',
                        data: ref('Project')
                    }),
                    400: errorResponse('Missing required fields', 'Name, workspace, and team are required'),
                    ...protectedCrudErrors
                }
            }
        },
        '/api/projects/{id}': {
            get: {
                tags: ['Projects'],
                summary: 'Get project details',
                security: bearerSecurity,
                parameters: [{ name: 'id', in: 'path', required: true, schema: ref('ObjectId') }],
                responses: {
                    200: successResponse('Project retrieved', {
                        data: ref('Project')
                    }),
                    ...protectedCrudErrors
                }
            },
            put: {
                tags: ['Projects'],
                summary: 'Update a project',
                security: bearerSecurity,
                parameters: [{ name: 'id', in: 'path', required: true, schema: ref('ObjectId') }],
                requestBody: requestBody('ProjectUpdateRequest'),
                responses: {
                    200: successResponse('Project updated', {
                        message: 'Project updated successfully',
                        data: ref('Project')
                    }),
                    ...protectedCrudErrors
                }
            },
            delete: {
                tags: ['Projects'],
                summary: 'Delete a project',
                security: bearerSecurity,
                parameters: [{ name: 'id', in: 'path', required: true, schema: ref('ObjectId') }],
                responses: {
                    200: successResponse('Project deleted', {
                        message: 'Project deleted successfully'
                    }),
                    ...protectedCrudErrors
                }
            }
        },
        '/api/projects/{id}/status': {
            patch: {
                tags: ['Projects'],
                summary: 'Update project status',
                security: bearerSecurity,
                parameters: [{ name: 'id', in: 'path', required: true, schema: ref('ObjectId') }],
                requestBody: requestBody('ProjectStatusUpdateRequest'),
                responses: {
                    200: successResponse('Project status updated', {
                        message: 'Project status updated successfully',
                        data: ref('Project')
                    }),
                    400: errorResponse('Invalid project status', 'Invalid status value'),
                    ...protectedCrudErrors
                }
            }
        },
        '/api/projects/{id}/tasks': {
            get: {
                tags: ['Projects'],
                summary: 'Get tasks in a project',
                security: bearerSecurity,
                parameters: [{ name: 'id', in: 'path', required: true, schema: ref('ObjectId') }],
                responses: {
                    200: successResponse('Project tasks retrieved', {
                        count: 4,
                        data: {
                            type: 'array',
                            items: ref('Task')
                        }
                    }),
                    ...protectedCrudErrors
                }
            },
            post: {
                tags: ['Projects'],
                summary: 'Create a task inside a project',
                security: bearerSecurity,
                parameters: [{ name: 'id', in: 'path', required: true, schema: ref('ObjectId') }],
                requestBody: requestBody('ProjectTaskCreateRequest'),
                responses: {
                    201: successResponse('Project task created', {
                        message: 'Task created successfully',
                        data: ref('Task')
                    }),
                    400: errorResponse('Invalid task payload', 'Task title is required'),
                    ...protectedCrudErrors
                }
            }
        },
        '/api/projects/{id}/stats': {
            get: {
                tags: ['Projects'],
                summary: 'Get project statistics',
                security: bearerSecurity,
                parameters: [{ name: 'id', in: 'path', required: true, schema: ref('ObjectId') }],
                responses: {
                    200: successResponse('Project stats retrieved', {
                        data: {
                            type: 'object',
                            properties: {
                                project: {
                                    type: 'object',
                                    properties: {
                                        title: { type: 'string', example: 'Client Portal Revamp' },
                                        status: ref('ProjectStatus'),
                                        priority: ref('Priority'),
                                        deadline: { type: 'string', format: 'date-time' }
                                    }
                                },
                                tasks: {
                                    type: 'object',
                                    properties: {
                                        total: { type: 'integer', example: 12 },
                                        completed: { type: 'integer', example: 5 },
                                        inProgress: { type: 'integer', example: 4 },
                                        todo: { type: 'integer', example: 3 },
                                        overdue: { type: 'integer', example: 1 }
                                    }
                                },
                                progress: { type: 'string', example: '42%' }
                            }
                        }
                    }),
                    ...protectedCrudErrors
                }
            }
        },
        '/api/projects/workspace/{workspaceId}': {
            get: {
                tags: ['Projects'],
                summary: 'Get projects by workspace',
                security: bearerSecurity,
                parameters: [{ name: 'workspaceId', in: 'path', required: true, schema: ref('ObjectId') }],
                responses: {
                    200: successResponse('Projects by workspace retrieved', {
                        count: 2,
                        data: {
                            type: 'array',
                            items: ref('Project')
                        }
                    }),
                    ...protectedCrudErrors
                }
            }
        },
        '/api/tasks/{id}': {
            get: {
                tags: ['Tasks'],
                summary: 'Get task details',
                security: bearerSecurity,
                parameters: [{ name: 'id', in: 'path', required: true, schema: ref('ObjectId') }],
                responses: {
                    200: successResponse('Task retrieved', {
                        data: ref('Task')
                    }),
                    ...protectedCrudErrors
                }
            },
            put: {
                tags: ['Tasks'],
                summary: 'Update a task',
                security: bearerSecurity,
                parameters: [{ name: 'id', in: 'path', required: true, schema: ref('ObjectId') }],
                requestBody: requestBody('TaskUpdateRequest'),
                responses: {
                    200: successResponse('Task updated', {
                        message: 'Task updated successfully',
                        data: ref('Task')
                    }),
                    ...protectedCrudErrors
                }
            },
            delete: {
                tags: ['Tasks'],
                summary: 'Delete a task',
                security: bearerSecurity,
                parameters: [{ name: 'id', in: 'path', required: true, schema: ref('ObjectId') }],
                responses: {
                    200: successResponse('Task deleted', {
                        message: 'Task deleted successfully'
                    }),
                    ...protectedCrudErrors
                }
            }
        },
        '/api/tasks/{id}/status': {
            patch: {
                tags: ['Tasks'],
                summary: 'Update task status',
                security: bearerSecurity,
                parameters: [{ name: 'id', in: 'path', required: true, schema: ref('ObjectId') }],
                requestBody: requestBody('TaskStatusUpdateRequest'),
                responses: {
                    200: successResponse('Task status updated', {
                        message: 'Task status updated successfully',
                        data: ref('Task')
                    }),
                    400: errorResponse('Invalid task status', 'Invalid status value'),
                    ...protectedCrudErrors
                }
            }
        },
        '/api/tasks/{id}/complete': {
            patch: {
                tags: ['Tasks'],
                summary: 'Toggle task completion',
                security: bearerSecurity,
                parameters: [{ name: 'id', in: 'path', required: true, schema: ref('ObjectId') }],
                responses: {
                    200: successResponse('Task completion toggled', {
                        message: 'Task marked as completed',
                        data: ref('Task')
                    }),
                    ...protectedCrudErrors
                }
            }
        },
        '/api/tasks/{id}/attachments': {
            post: {
                tags: ['Tasks'],
                summary: 'Add an attachment to a task',
                security: bearerSecurity,
                parameters: [{ name: 'id', in: 'path', required: true, schema: ref('ObjectId') }],
                requestBody: requestBody('TaskAttachmentRequest'),
                responses: {
                    200: successResponse('Task attachment added', {
                        message: 'Attachment added successfully',
                        data: ref('Task')
                    }),
                    400: errorResponse('Invalid attachment payload', 'Attachment name and URL are required'),
                    ...protectedCrudErrors
                }
            }
        },
        '/api/tasks/{id}/attachments/{attachmentId}': {
            delete: {
                tags: ['Tasks'],
                summary: 'Remove a task attachment',
                security: bearerSecurity,
                parameters: [
                    { name: 'id', in: 'path', required: true, schema: ref('ObjectId') },
                    { name: 'attachmentId', in: 'path', required: true, schema: ref('ObjectId') }
                ],
                responses: {
                    200: successResponse('Task attachment removed', {
                        message: 'Attachment removed successfully',
                        data: ref('Task')
                    }),
                    ...protectedCrudErrors
                }
            }
        },
        '/api/tasks/project/{projectId}': {
            get: {
                tags: ['Tasks'],
                summary: 'Get tasks by project',
                security: bearerSecurity,
                parameters: [{ name: 'projectId', in: 'path', required: true, schema: ref('ObjectId') }],
                responses: {
                    200: successResponse('Tasks by project retrieved', {
                        count: 4,
                        data: {
                            type: 'array',
                            items: ref('Task')
                        }
                    }),
                    ...protectedCrudErrors
                }
            }
        },
        '/api/tasks/user/assigned': {
            get: {
                tags: ['Tasks'],
                summary: 'Get tasks assigned to the current user',
                security: bearerSecurity,
                responses: {
                    200: successResponse('Assigned tasks retrieved', {
                        count: 3,
                        data: {
                            type: 'array',
                            items: ref('Task')
                        }
                    }),
                    ...protectedErrors
                }
            }
        },
        '/api/tasks/overdue/list': {
            get: {
                tags: ['Tasks'],
                summary: 'Get overdue tasks visible to the current user',
                security: bearerSecurity,
                responses: {
                    200: successResponse('Overdue tasks retrieved', {
                        count: 2,
                        data: {
                            type: 'array',
                            items: ref('Task')
                        }
                    }),
                    ...protectedErrors
                }
            }
        },
        '/api/tasks/upcoming/week': {
            get: {
                tags: ['Tasks'],
                summary: 'Get upcoming tasks due within 7 days',
                security: bearerSecurity,
                responses: {
                    200: successResponse('Upcoming tasks retrieved', {
                        count: 2,
                        data: {
                            type: 'array',
                            items: ref('Task')
                        }
                    }),
                    ...protectedErrors
                }
            }
        },
        '/api/submissions': {
            post: {
                tags: ['Submissions'],
                summary: 'Create a project submission',
                security: bearerSecurity,
                requestBody: requestBody('SubmissionCreateRequest'),
                responses: {
                    201: successResponse('Submission created', {
                        message: 'Project submitted successfully',
                        data: ref('Submission')
                    }),
                    400: errorResponse('Invalid submission payload', 'Project and content are required'),
                    ...protectedCrudErrors
                }
            }
        },
        '/api/submissions/pending': {
            get: {
                tags: ['Submissions'],
                summary: 'Get pending submissions',
                security: bearerSecurity,
                responses: {
                    200: successResponse('Pending submissions retrieved', {
                        count: 2,
                        data: {
                            type: 'array',
                            items: ref('Submission')
                        }
                    }),
                    ...protectedErrors
                }
            }
        },
        '/api/submissions/{id}': {
            get: {
                tags: ['Submissions'],
                summary: 'Get submission details',
                security: bearerSecurity,
                parameters: [{ name: 'id', in: 'path', required: true, schema: ref('ObjectId') }],
                responses: {
                    200: successResponse('Submission retrieved', {
                        data: ref('Submission')
                    }),
                    ...protectedCrudErrors
                }
            }
        },
        '/api/submissions/{id}/review': {
            post: {
                tags: ['Submissions'],
                summary: 'Review a submission',
                security: bearerSecurity,
                parameters: [{ name: 'id', in: 'path', required: true, schema: ref('ObjectId') }],
                requestBody: requestBody('SubmissionReviewRequest'),
                responses: {
                    200: successResponse('Submission reviewed', {
                        message: 'Submission reviewed successfully',
                        data: ref('Submission')
                    }),
                    400: errorResponse('Invalid review status', 'Valid review status is required'),
                    ...protectedCrudErrors
                }
            }
        },
        '/api/notifications': {
            get: {
                tags: ['Notifications'],
                summary: 'Get notifications for the current user',
                security: bearerSecurity,
                parameters: [
                    {
                        name: 'unreadOnly',
                        in: 'query',
                        schema: { type: 'boolean' },
                        description: 'Filter to unread notifications only'
                    },
                    {
                        name: 'limit',
                        in: 'query',
                        schema: { type: 'integer', default: 50 },
                        description: 'Maximum number of notifications to return'
                    }
                ],
                responses: {
                    200: successResponse('Notifications retrieved', {
                        count: 10,
                        unreadCount: 3,
                        data: {
                            type: 'array',
                            items: ref('Notification')
                        }
                    }),
                    ...protectedErrors
                }
            }
        },
        '/api/notifications/unread-count': {
            get: {
                tags: ['Notifications'],
                summary: 'Get unread notification count',
                security: bearerSecurity,
                responses: {
                    200: successResponse('Unread count retrieved', {
                        count: 3
                    }),
                    ...protectedErrors
                }
            }
        },
        '/api/notifications/{id}': {
            get: {
                tags: ['Notifications'],
                summary: 'Get a single notification',
                security: bearerSecurity,
                parameters: [{ name: 'id', in: 'path', required: true, schema: ref('ObjectId') }],
                responses: {
                    200: successResponse('Notification retrieved', {
                        data: ref('Notification')
                    }),
                    ...protectedCrudErrors
                }
            },
            delete: {
                tags: ['Notifications'],
                summary: 'Delete a notification',
                security: bearerSecurity,
                parameters: [{ name: 'id', in: 'path', required: true, schema: ref('ObjectId') }],
                responses: {
                    200: successResponse('Notification deleted', {
                        message: 'Notification deleted successfully'
                    }),
                    ...protectedCrudErrors
                }
            }
        },
        '/api/notifications/{id}/read': {
            patch: {
                tags: ['Notifications'],
                summary: 'Mark a notification as read',
                security: bearerSecurity,
                parameters: [{ name: 'id', in: 'path', required: true, schema: ref('ObjectId') }],
                responses: {
                    200: successResponse('Notification marked as read', {
                        message: 'Notification marked as read',
                        data: ref('Notification')
                    }),
                    ...protectedCrudErrors
                }
            }
        },
        '/api/notifications/read-all': {
            patch: {
                tags: ['Notifications'],
                summary: 'Mark all notifications as read',
                security: bearerSecurity,
                responses: {
                    200: successResponse('Notifications marked as read', {
                        message: 'Marked 3 notifications as read',
                        modifiedCount: 3
                    }),
                    ...protectedErrors
                }
            }
        },
        '/api/notifications/clear-all': {
            delete: {
                tags: ['Notifications'],
                summary: 'Clear all notifications',
                security: bearerSecurity,
                responses: {
                    200: successResponse('Notifications cleared', {
                        message: 'Cleared 10 notifications',
                        deletedCount: 10
                    }),
                    ...protectedErrors
                }
            }
        },
        '/api/notifications/broadcast': {
            post: {
                tags: ['Notifications'],
                summary: 'Broadcast a notification',
                security: bearerSecurity,
                requestBody: requestBody('BroadcastNotificationRequest'),
                responses: {
                    201: successResponse('Broadcast sent', {
                        message: 'Broadcast sent to 12 users',
                        recipientCount: 12
                    }),
                    400: errorResponse('Invalid broadcast payload', 'Title, message, and target type are required'),
                    ...protectedCrudErrors
                }
            }
        },
        '/api/reports': {
            post: {
                tags: ['Reports'],
                summary: 'Create a problem report',
                security: bearerSecurity,
                requestBody: requestBody('ProblemReportCreateRequest'),
                responses: {
                    201: successResponse('Problem report created', {
                        message: 'Problem report created successfully',
                        data: ref('ProblemReport')
                    }),
                    400: errorResponse('Invalid report payload', 'Team, category, title, and description are required'),
                    ...protectedCrudErrors
                }
            },
            get: {
                tags: ['Reports'],
                summary: 'Get problem reports',
                security: bearerSecurity,
                parameters: [
                    { name: 'status', in: 'query', schema: ref('ProblemStatus') },
                    { name: 'severity', in: 'query', schema: ref('ProblemSeverity') },
                    { name: 'category', in: 'query', schema: ref('ProblemCategory') }
                ],
                responses: {
                    200: successResponse('Problem reports retrieved', {
                        count: 4,
                        data: {
                            type: 'array',
                            items: ref('ProblemReport')
                        }
                    }),
                    ...protectedErrors
                }
            }
        },
        '/api/reports/my-reports': {
            get: {
                tags: ['Reports'],
                summary: 'Get reports created by the current user',
                security: bearerSecurity,
                responses: {
                    200: successResponse('User reports retrieved', {
                        count: 2,
                        data: {
                            type: 'array',
                            items: ref('ProblemReport')
                        }
                    }),
                    ...protectedErrors
                }
            }
        },
        '/api/reports/assigned-to-me': {
            get: {
                tags: ['Reports'],
                summary: 'Get reports assigned to the current admin',
                security: bearerSecurity,
                responses: {
                    200: successResponse('Assigned reports retrieved', {
                        count: 2,
                        data: {
                            type: 'array',
                            items: ref('ProblemReport')
                        }
                    }),
                    ...protectedErrors
                }
            }
        },
        '/api/reports/{id}': {
            get: {
                tags: ['Reports'],
                summary: 'Get a single problem report',
                security: bearerSecurity,
                parameters: [{ name: 'id', in: 'path', required: true, schema: ref('ObjectId') }],
                responses: {
                    200: successResponse('Problem report retrieved', {
                        data: ref('ProblemReport')
                    }),
                    ...protectedCrudErrors
                }
            },
            put: {
                tags: ['Reports'],
                summary: 'Update a problem report',
                security: bearerSecurity,
                parameters: [{ name: 'id', in: 'path', required: true, schema: ref('ObjectId') }],
                requestBody: requestBody('ProblemReportUpdateRequest'),
                responses: {
                    200: successResponse('Problem report updated', {
                        message: 'Report updated successfully',
                        data: ref('ProblemReport')
                    }),
                    ...protectedCrudErrors
                }
            },
            delete: {
                tags: ['Reports'],
                summary: 'Delete a problem report',
                security: bearerSecurity,
                parameters: [{ name: 'id', in: 'path', required: true, schema: ref('ObjectId') }],
                responses: {
                    200: successResponse('Problem report deleted', {
                        message: 'Report deleted successfully'
                    }),
                    ...protectedCrudErrors
                }
            }
        },
        '/api/reports/{id}/assign': {
            patch: {
                tags: ['Reports'],
                summary: 'Assign a report to an admin',
                security: bearerSecurity,
                parameters: [{ name: 'id', in: 'path', required: true, schema: ref('ObjectId') }],
                requestBody: requestBody('ProblemAssignRequest'),
                responses: {
                    200: successResponse('Problem report assigned', {
                        message: 'Report assigned successfully',
                        data: ref('ProblemReport')
                    }),
                    ...protectedCrudErrors
                }
            }
        },
        '/api/reports/{id}/status': {
            patch: {
                tags: ['Reports'],
                summary: 'Update report status',
                security: bearerSecurity,
                parameters: [{ name: 'id', in: 'path', required: true, schema: ref('ObjectId') }],
                requestBody: requestBody('ProblemStatusUpdateRequest'),
                responses: {
                    200: successResponse('Problem report status updated', {
                        message: 'Report status updated successfully',
                        data: ref('ProblemReport')
                    }),
                    400: errorResponse('Invalid report status', 'Valid status is required'),
                    ...protectedCrudErrors
                }
            }
        },
        '/api/reports/{id}/resolve': {
            post: {
                tags: ['Reports'],
                summary: 'Resolve a problem report',
                security: bearerSecurity,
                parameters: [{ name: 'id', in: 'path', required: true, schema: ref('ObjectId') }],
                requestBody: requestBody('ProblemResolveRequest'),
                responses: {
                    200: successResponse('Problem report resolved', {
                        message: 'Report resolved successfully',
                        data: ref('ProblemReport')
                    }),
                    400: errorResponse('Missing resolution details', 'Resolution notes are required'),
                    ...protectedCrudErrors
                }
            }
        },
        '/api/access-requests': {
            post: {
                tags: ['Access Requests'],
                summary: 'Create an access request',
                security: bearerSecurity,
                requestBody: requestBody('AccessRequestCreateRequest'),
                responses: {
                    201: successResponse('Access request created', {
                        message: 'Access request submitted successfully',
                        data: ref('AccessRequest')
                    }),
                    400: errorResponse('Invalid access request payload', 'Target field and reason are required'),
                    ...protectedCrudErrors
                }
            },
            get: {
                tags: ['Access Requests'],
                summary: 'Get access requests',
                security: bearerSecurity,
                parameters: [
                    { name: 'status', in: 'query', schema: ref('AccessStatus') }
                ],
                responses: {
                    200: successResponse('Access requests retrieved', {
                        count: 2,
                        data: {
                            type: 'array',
                            items: ref('AccessRequest')
                        }
                    }),
                    ...protectedErrors
                }
            }
        },
        '/api/access-requests/my-requests': {
            get: {
                tags: ['Access Requests'],
                summary: 'Get current user access requests',
                security: bearerSecurity,
                responses: {
                    200: successResponse('Current user access requests retrieved', {
                        count: 2,
                        data: {
                            type: 'array',
                            items: ref('AccessRequest')
                        }
                    }),
                    ...protectedErrors
                }
            }
        },
        '/api/access-requests/pending': {
            get: {
                tags: ['Access Requests'],
                summary: 'Get pending access requests',
                security: bearerSecurity,
                responses: {
                    200: successResponse('Pending access requests retrieved', {
                        count: 2,
                        data: {
                            type: 'array',
                            items: ref('AccessRequest')
                        }
                    }),
                    ...protectedErrors
                }
            }
        },
        '/api/access-requests/{id}': {
            get: {
                tags: ['Access Requests'],
                summary: 'Get a single access request',
                security: bearerSecurity,
                parameters: [{ name: 'id', in: 'path', required: true, schema: ref('ObjectId') }],
                responses: {
                    200: successResponse('Access request retrieved', {
                        data: ref('AccessRequest')
                    }),
                    ...protectedCrudErrors
                }
            },
            put: {
                tags: ['Access Requests'],
                summary: 'Update a pending access request',
                security: bearerSecurity,
                parameters: [{ name: 'id', in: 'path', required: true, schema: ref('ObjectId') }],
                requestBody: requestBody('AccessRequestUpdateRequest'),
                responses: {
                    200: successResponse('Access request updated', {
                        message: 'Access request updated successfully',
                        data: ref('AccessRequest')
                    }),
                    400: errorResponse('Invalid access request state', 'Only pending requests can be updated'),
                    ...protectedCrudErrors
                }
            },
            delete: {
                tags: ['Access Requests'],
                summary: 'Cancel an access request',
                security: bearerSecurity,
                parameters: [{ name: 'id', in: 'path', required: true, schema: ref('ObjectId') }],
                responses: {
                    200: successResponse('Access request cancelled', {
                        message: 'Access request cancelled successfully'
                    }),
                    ...protectedCrudErrors
                }
            }
        },
        '/api/access-requests/{id}/approve': {
            post: {
                tags: ['Access Requests'],
                summary: 'Approve an access request',
                security: bearerSecurity,
                parameters: [{ name: 'id', in: 'path', required: true, schema: ref('ObjectId') }],
                requestBody: requestBody('AccessRequestApproveRequest'),
                responses: {
                    200: successResponse('Access request approved', {
                        message: 'Access request approved successfully',
                        data: ref('AccessRequest')
                    }),
                    ...protectedCrudErrors
                }
            }
        },
        '/api/access-requests/{id}/deny': {
            post: {
                tags: ['Access Requests'],
                summary: 'Deny an access request',
                security: bearerSecurity,
                parameters: [{ name: 'id', in: 'path', required: true, schema: ref('ObjectId') }],
                requestBody: requestBody('AccessRequestDenyRequest'),
                responses: {
                    200: successResponse('Access request denied', {
                        message: 'Access request denied',
                        data: ref('AccessRequest')
                    }),
                    ...protectedCrudErrors
                }
            }
        },
        '/api/ai/chat': {
            post: {
                tags: ['AI'],
                summary: 'Send a message to the AI assistant',
                security: bearerSecurity,
                requestBody: requestBody('AIChatRequest'),
                responses: {
                    200: successResponse('AI response generated', {
                        data: {
                            type: 'object',
                            properties: {
                                conversationId: ref('ObjectId'),
                                message: { type: 'string', example: 'Here is a concise milestone breakdown for your project...' },
                                timestamp: { type: 'string', format: 'date-time' }
                            }
                        }
                    }),
                    400: errorResponse('Missing AI chat payload', 'Workspace and message are required'),
                    ...protectedCrudErrors
                }
            }
        },
        '/api/ai/conversations/{workspaceId}': {
            get: {
                tags: ['AI'],
                summary: 'Get AI conversations for a workspace',
                security: bearerSecurity,
                parameters: [{ name: 'workspaceId', in: 'path', required: true, schema: ref('ObjectId') }],
                responses: {
                    200: successResponse('Workspace AI conversations retrieved', {
                        count: 3,
                        data: {
                            type: 'array',
                            items: ref('AIConversation')
                        }
                    }),
                    ...protectedCrudErrors
                }
            }
        },
        '/api/ai/conversation/{id}': {
            get: {
                tags: ['AI'],
                summary: 'Get a single AI conversation',
                security: bearerSecurity,
                parameters: [{ name: 'id', in: 'path', required: true, schema: ref('ObjectId') }],
                responses: {
                    200: successResponse('AI conversation retrieved', {
                        data: ref('AIConversation')
                    }),
                    ...protectedCrudErrors
                }
            }
        },
        '/api/ai/conversations/{id}': {
            delete: {
                tags: ['AI'],
                summary: 'Delete an AI conversation',
                security: bearerSecurity,
                parameters: [{ name: 'id', in: 'path', required: true, schema: ref('ObjectId') }],
                responses: {
                    200: successResponse('AI conversation deleted', {
                        message: 'Conversation deleted successfully'
                    }),
                    ...protectedCrudErrors
                }
            }
        },
        '/api/ai/conversations/{id}/continue': {
            post: {
                tags: ['AI'],
                summary: 'Continue an AI conversation',
                security: bearerSecurity,
                parameters: [{ name: 'id', in: 'path', required: true, schema: ref('ObjectId') }],
                requestBody: requestBody('AIContinueConversationRequest'),
                responses: {
                    200: successResponse('AI conversation continued', {
                        data: {
                            type: 'object',
                            properties: {
                                conversationId: ref('ObjectId'),
                                message: { type: 'string', example: 'Here is a shorter action plan...' },
                                timestamp: { type: 'string', format: 'date-time' }
                            }
                        }
                    }),
                    400: errorResponse('Missing AI continuation message', 'Message is required'),
                    ...protectedCrudErrors
                }
            }
        },
        '/api/ai/suggestions/task/{taskId}': {
            get: {
                tags: ['AI'],
                summary: 'Get AI suggestions for a task',
                security: bearerSecurity,
                parameters: [{ name: 'taskId', in: 'path', required: true, schema: ref('ObjectId') }],
                responses: {
                    200: successResponse('Task suggestions generated', {
                        data: {
                            type: 'object',
                            properties: {
                                task: {
                                    type: 'object',
                                    properties: {
                                        title: { type: 'string', example: 'Implement JWT refresh flow' },
                                        status: ref('TaskStatus')
                                    }
                                },
                                suggestions: { type: 'string', example: '1. Split the work into token issuing and rotation...' }
                            }
                        }
                    }),
                    ...protectedCrudErrors
                }
            }
        },
        '/api/ai/suggestions/project/{projectId}': {
            get: {
                tags: ['AI'],
                summary: 'Get AI suggestions for a project',
                security: bearerSecurity,
                parameters: [{ name: 'projectId', in: 'path', required: true, schema: ref('ObjectId') }],
                responses: {
                    200: successResponse('Project suggestions generated', {
                        data: {
                            type: 'object',
                            properties: {
                                project: {
                                    type: 'object',
                                    properties: {
                                        title: { type: 'string', example: 'Client Portal Revamp' },
                                        status: ref('ProjectStatus'),
                                        progress: { type: 'number', example: 45 }
                                    }
                                },
                                suggestions: { type: 'string', example: '1. Re-prioritize the overdue task chain before the next release.' }
                            }
                        }
                    }),
                    ...protectedCrudErrors
                }
            }
        },
        '/api/dashboard/org-leader': {
            get: {
                tags: ['Dashboard'],
                summary: 'Get organization leader dashboard',
                security: bearerSecurity,
                responses: {
                    200: successResponse('Organization leader dashboard retrieved', {
                        data: {
                            type: 'object',
                            properties: {
                                organization: ref('OrganizationSummary'),
                                overview: {
                                    type: 'object',
                                    properties: {
                                        totalMembers: { type: 'integer', example: 42 },
                                        totalFields: { type: 'integer', example: 4 },
                                        totalTeams: { type: 'integer', example: 9 },
                                        totalProjects: { type: 'integer', example: 16 }
                                    }
                                },
                                fields: {
                                    type: 'array',
                                    items: {
                                        type: 'object',
                                        properties: {
                                            field: ref('FieldSummary'),
                                            stats: {
                                                type: 'object',
                                                properties: {
                                                    teams: { type: 'integer', example: 3 },
                                                    projects: { type: 'integer', example: 5 },
                                                    activeProjects: { type: 'integer', example: 2 }
                                                }
                                            }
                                        }
                                    }
                                },
                                recentActivity: {
                                    type: 'array',
                                    items: ref('Project')
                                }
                            }
                        }
                    }),
                    ...protectedErrors
                }
            }
        },
        '/api/dashboard/field-admin': {
            get: {
                tags: ['Dashboard'],
                summary: 'Get field admin dashboard',
                security: bearerSecurity,
                responses: {
                    200: successResponse('Field admin dashboard retrieved', {
                        data: {
                            type: 'object',
                            properties: {
                                field: ref('FieldSummary'),
                                overview: {
                                    type: 'object',
                                    properties: {
                                        totalTeams: { type: 'integer', example: 3 },
                                        totalProjects: { type: 'integer', example: 8 },
                                        activeProjects: { type: 'integer', example: 4 },
                                        completedProjects: { type: 'integer', example: 2 },
                                        totalTasks: { type: 'integer', example: 28 },
                                        completedTasks: { type: 'integer', example: 14 },
                                        overdueTasks: { type: 'integer', example: 3 }
                                    }
                                },
                                teamPerformance: {
                                    type: 'array',
                                    items: {
                                        type: 'object',
                                        properties: {
                                            team: ref('TeamSummary'),
                                            stats: {
                                                type: 'object',
                                                properties: {
                                                    projects: { type: 'integer', example: 3 },
                                                    tasks: { type: 'integer', example: 12 },
                                                    completedTasks: { type: 'integer', example: 7 },
                                                    progress: { type: 'string', example: '58%' }
                                                }
                                            }
                                        }
                                    }
                                },
                                pendingSubmissions: {
                                    type: 'array',
                                    items: ref('Submission')
                                },
                                openReports: {
                                    type: 'array',
                                    items: ref('ProblemReport')
                                }
                            }
                        }
                    }),
                    ...protectedErrors
                }
            }
        },
        '/api/dashboard/team-member': {
            get: {
                tags: ['Dashboard'],
                summary: 'Get team member dashboard',
                security: bearerSecurity,
                responses: {
                    200: successResponse('Team member dashboard retrieved', {
                        data: {
                            type: 'object',
                            properties: {
                                user: {
                                    type: 'object',
                                    properties: {
                                        username: { type: 'string', example: 'jane.doe' },
                                        email: { type: 'string', format: 'email', example: 'jane@example.com' },
                                        teams: {
                                            type: 'array',
                                            items: ref('Team')
                                        }
                                    }
                                },
                                taskSummary: {
                                    type: 'object',
                                    properties: {
                                        total: { type: 'integer', example: 8 },
                                        completed: { type: 'integer', example: 3 },
                                        inProgress: { type: 'integer', example: 2 },
                                        todo: { type: 'integer', example: 3 },
                                        overdue: { type: 'integer', example: 1 }
                                    }
                                },
                                overdueTasks: {
                                    type: 'array',
                                    items: ref('Task')
                                },
                                upcomingTasks: {
                                    type: 'array',
                                    items: ref('Task')
                                },
                                recentProjects: {
                                    type: 'array',
                                    items: ref('Project')
                                }
                            }
                        }
                    }),
                    ...protectedErrors
                }
            }
        },
        '/api/dashboard/analytics': {
            get: {
                tags: ['Dashboard'],
                summary: 'Get task analytics',
                security: bearerSecurity,
                parameters: [
                    {
                        name: 'startDate',
                        in: 'query',
                        schema: { type: 'string', format: 'date-time' }
                    },
                    {
                        name: 'endDate',
                        in: 'query',
                        schema: { type: 'string', format: 'date-time' }
                    },
                    {
                        name: 'teamId',
                        in: 'query',
                        schema: ref('ObjectId')
                    },
                    {
                        name: 'projectId',
                        in: 'query',
                        schema: ref('ObjectId')
                    }
                ],
                responses: {
                    200: successResponse('Analytics retrieved', {
                        data: {
                            type: 'object',
                            properties: {
                                totalTasks: { type: 'integer', example: 20 },
                                completedTasks: { type: 'integer', example: 8 },
                                avgCompletionTime: { type: 'string', example: '4 days' },
                                tasksByStatus: {
                                    type: 'object',
                                    properties: {
                                        todo: { type: 'integer', example: 5 },
                                        inProgress: { type: 'integer', example: 7 },
                                        completed: { type: 'integer', example: 8 }
                                    }
                                },
                                tasksByPriority: {
                                    type: 'object',
                                    properties: {
                                        low: { type: 'integer', example: 3 },
                                        medium: { type: 'integer', example: 8 },
                                        high: { type: 'integer', example: 6 },
                                        urgent: { type: 'integer', example: 3 }
                                    }
                                }
                            }
                        }
                    }),
                    ...protectedErrors
                }
            }
        }
    }
};

export default swaggerSpec;
