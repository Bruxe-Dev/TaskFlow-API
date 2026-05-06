// API service layer - connects to your Express backend
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const getToken = () => localStorage.getItem('taskflow_token');

const headers = () => ({
    'Content-Type': 'application/json',
    ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {}),
});

const request = async (method, path, body) => {
    const res = await fetch(`${BASE_URL}${path}`, {
        method,
        headers: headers(),
        ...(body ? { body: JSON.stringify(body) } : {}),
    });
    if (!res.ok) {
        const err = await res.json().catch(() => ({ message: 'Network error' }));
        throw new Error(err.message || 'Request failed');
    }
    return res.json();
};

// Auth
export const auth = {
    register: (data) => request('POST', '/auth/register', data),
    login: (data) => request('POST', '/auth/login', data),
    verifyEmail: (token) => request('GET', `/auth/verify-email/${token}`),
    resendVerification: (data) => request('POST', '/auth/resend-verification', data),
    getMe: () => request('GET', '/auth/me'),
    updateProfile: (data) => request('PUT', '/auth/update-profile', data),
};

// Dashboard
export const dashboard = {
    orgLeader: () => request('GET', '/dashboard/org-leader'),
    fieldAdmin: () => request('GET', '/dashboard/field-admin'),
    teamMember: () => request('GET', '/dashboard/team-member'),
    analytics: () => request('GET', '/dashboard/analytics'),
};

// Projects
export const projects = {
    create: (data) => request('POST', '/projects', data),
    get: (id) => request('GET', `/projects/${id}`),
    update: (id, data) => request('PUT', `/projects/${id}`, data),
    delete: (id) => request('DELETE', `/projects/${id}`),
    updateStatus: (id, data) => request('PATCH', `/projects/${id}/status`, data),
    getTasks: (id) => request('GET', `/projects/${id}/tasks`),
    createTask: (id, data) => request('POST', `/projects/${id}/tasks`, data),
    getStats: (id) => request('GET', `/projects/${id}/stats`),
    byWorkspace: (workspaceId) => request('GET', `/projects/workspace/${workspaceId}`),
};

// Tasks
export const tasks = {
    get: (id) => request('GET', `/tasks/${id}`),
    update: (id, data) => request('PUT', `/tasks/${id}`, data),
    delete: (id) => request('DELETE', `/tasks/${id}`),
    updateStatus: (id, data) => request('PATCH', `/tasks/${id}/status`, data),
    toggleComplete: (id) => request('PATCH', `/tasks/${id}/complete`),
    addAttachment: (id, data) => request('POST', `/tasks/${id}/attachments`, data),
    removeAttachment: (id, attachId) => request('DELETE', `/tasks/${id}/attachments/${attachId}`),
    byProject: (projectId) => request('GET', `/tasks/project/${projectId}`),
    myAssigned: () => request('GET', '/tasks/user/assigned'),
    overdue: () => request('GET', '/tasks/overdue/list'),
    upcoming: () => request('GET', '/tasks/upcoming/week'),
};

// Teams
export const teams = {
    create: (data) => request('POST', '/teams', data),
    get: (id) => request('GET', `/teams/${id}`),
    update: (id, data) => request('PUT', `/teams/${id}`, data),
    delete: (id) => request('DELETE', `/teams/${id}`),
    addMember: (id, data) => request('POST', `/teams/${id}/members`, data),
    removeMember: (id, userId) => request('DELETE', `/teams/${id}/members/${userId}`),
    updateMemberRole: (id, userId, data) => request('PUT', `/teams/${id}/members/${userId}/role`, data),
    changeLeader: (id, data) => request('PUT', `/teams/${id}/leader`, data),
    getWorkspace: (id) => request('GET', `/teams/${id}/workspace`),
    getProjects: (id) => request('GET', `/teams/${id}/projects`),
    getStats: (id) => request('GET', `/teams/${id}/stats`),
};

// Workspace
export const workspace = {
    get: (id) => request('GET', `/workspaces/${id}`),
    update: (id, data) => request('PUT', `/workspaces/${id}`, data),
    getProjects: (id) => request('GET', `/workspaces/${id}/projects`),
    getUpdates: (id) => request('GET', `/workspaces/${id}/updates`),
    postUpdate: (id, data) => request('POST', `/workspaces/${id}/updates`, data),
    getMembers: (id) => request('GET', `/workspaces/${id}/members`),
    updateSettings: (id, data) => request('PUT', `/workspaces/${id}/settings`, data),
};

// Notifications
export const notifications = {
    getAll: () => request('GET', '/notifications'),
    unreadCount: () => request('GET', '/notifications/unread-count'),
    get: (id) => request('GET', `/notifications/${id}`),
    markRead: (id) => request('PATCH', `/notifications/${id}/read`),
    markAllRead: () => request('PATCH', '/notifications/read-all'),
    delete: (id) => request('DELETE', `/notifications/${id}`),
    clearAll: () => request('DELETE', '/notifications/clear-all'),
    broadcast: (data) => request('POST', '/notifications/broadcast', data),
};

// Organizations
export const organizations = {
    create: (data) => request('POST', '/organizations', data),
    get: (id) => request('GET', `/organizations/${id}`),
    update: (id, data) => request('PUT', `/organizations/${id}`, data),
};

// Fields
export const fields = {
    get: (id) => request('GET', `/fields/${id}`),
    update: (id, data) => request('PUT', `/fields/${id}`, data),
    delete: (id) => request('DELETE', `/fields/${id}`),
    getTeams: (id) => request('GET', `/fields/${id}/teams`),
    createTeam: (id, data) => request('POST', `/fields/${id}/teams`, data),
    getDashboard: (id) => request('GET', `/fields/${id}/dashboard`),
    getStats: (id) => request('GET', `/fields/${id}/stats`),
    shareAccess: (id, data) => request('POST', `/fields/${id}/share`, data),
    removeAccess: (id, adminId) => request('DELETE', `/fields/${id}/share/${adminId}`),
};

// Problem Reports
export const problemReports = {
    create: (data) => request('POST', '/problem-reports', data),
    getAll: () => request('GET', '/problem-reports'),
    myReports: () => request('GET', '/problem-reports/my-reports'),
    assignedToMe: () => request('GET', '/problem-reports/assigned-to-me'),
    get: (id) => request('GET', `/problem-reports/${id}`),
    update: (id, data) => request('PUT', `/problem-reports/${id}`, data),
    delete: (id) => request('DELETE', `/problem-reports/${id}`),
    assign: (id, data) => request('PATCH', `/problem-reports/${id}/assign`, data),
    updateStatus: (id, data) => request('PATCH', `/problem-reports/${id}/status`, data),
    resolve: (id, data) => request('POST', `/problem-reports/${id}/resolve`, data),
};

// Access Requests
export const accessRequests = {
    create: (data) => request('POST', '/access-requests', data),
    getAll: () => request('GET', '/access-requests'),
    myRequests: () => request('GET', '/access-requests/my-requests'),
    pending: () => request('GET', '/access-requests/pending'),
    get: (id) => request('GET', `/access-requests/${id}`),
    update: (id, data) => request('PUT', `/access-requests/${id}`, data),
    cancel: (id) => request('DELETE', `/access-requests/${id}`),
    approve: (id) => request('POST', `/access-requests/${id}/approve`),
    deny: (id) => request('POST', `/access-requests/${id}/deny`),
};

// Submissions
export const submissions = {
    create: (data) => request('POST', '/submissions', data),
    getPending: () => request('GET', '/submissions/pending'),
    get: (id) => request('GET', `/submissions/${id}`),
    review: (id, data) => request('POST', `/submissions/${id}/review`, data),
};

// AI
export const ai = {
    chat: (data) => request('POST', '/ai/chat', data),
    getConversations: (workspaceId) => request('GET', `/ai/conversations/${workspaceId}`),
    getConversation: (id) => request('GET', `/ai/conversations/${id}`),
    deleteConversation: (id) => request('DELETE', `/ai/conversations/${id}`),
    continueConversation: (id, data) => request('POST', `/ai/conversations/${id}/continue`, data),
    taskSuggestions: (taskId) => request('GET', `/ai/suggestions/task/${taskId}`),
    projectSuggestions: (projectId) => request('GET', `/ai/suggestions/project/${projectId}`),
};