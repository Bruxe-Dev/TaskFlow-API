import { useEffect, useRef, useState } from 'react';

const featureContent = {
  overview: {
    kicker: 'AI priorities',
    title: 'Turn scattered work into one calm operating rhythm.',
    description:
      'TaskFlow captures projects, tasks, updates, submissions, and problem reports in a single system so every team member knows what matters next without chasing context.',
    bullets: [
      'Daily execution visibility across projects and teams.',
      'Fast approvals and cleaner reporting loops.',
      'AI suggestions grounded in live workspace context.'
    ],
    cards: [
      {
        type: 'large',
        label: 'Auto summary',
        title: 'Meeting notes become next steps instantly',
        copy: 'Updates, mentions, and project milestones stay aligned without manual cleanup.'
      },
      {
        label: 'Sync',
        title: '1 workspace',
        copy: 'Projects, tasks, and updates stay connected.'
      },
      {
        variant: 'dark',
        label: 'Pulse',
        title: 'AI ready',
        copy: 'Summaries, suggestions, and next-action prompts.'
      }
    ]
  },
  workflow: {
    kicker: 'Live workflow',
    title: 'Give every team a dashboard that feels alive, not administrative.',
    description:
      'From the first task to the final submission review, motion stays visible. Teams can spot blockers, overdue items, and approvals before momentum breaks.',
    bullets: [
      'Project and task surfaces designed like a modern command center.',
      'Notifications, reports, and team updates aligned in one timeline.',
      'Responsive behavior that still feels premium on smaller screens.'
    ],
    cards: [
      {
        type: 'large',
        label: 'Board view',
        title: 'Workload lanes update in real time',
        copy: 'Upcoming tasks, overdue signals, and ownership stay visually obvious for the whole team.'
      },
      {
        label: 'Review',
        title: 'Submissions',
        copy: 'Approvals and revision requests stay easy to track.'
      },
      {
        variant: 'dark',
        label: 'Escalation',
        title: 'Reports',
        copy: 'Issues move from report to resolution with clean status changes.'
      }
    ]
  },
  control: {
    kicker: 'Executive control',
    title: 'From team member to org leader, the interface adapts to the level of responsibility.',
    description:
      'The frontend is prepared to switch context based on authenticated roles so the same design system can represent personal work, field oversight, and organization-wide visibility.',
    bullets: [
      'Role-aware dashboard sync from your TaskFlow backend.',
      'Beautiful light and dark modes for presentation and focus.',
      'A consistent visual language from landing page to workspace.'
    ],
    cards: [
      {
        type: 'large',
        label: 'Control room',
        title: 'Leaders get signal, not noise',
        copy: 'High-level stats, team performance, and recent activity surface first so decisions stay fast.'
      },
      {
        label: 'Overview',
        title: 'Executive stats',
        copy: 'Members, fields, teams, and projects stay visible.'
      },
      {
        variant: 'dark',
        label: 'Confidence',
        title: 'Live API',
        copy: 'The UI can hydrate directly from your existing routes.'
      }
    ]
  }
};

const demoWorkspace = {
  sourceLabel: 'Demo Mode',
  sessionTitle: 'Preview workspace loaded',
  sessionSubtitle: 'Connect a real TaskFlow account to pull role-aware data from your backend.',
  workspaceTitle: 'Product launch command center',
  statusSignal: 'Light mode experience',
  projectSourceLabel: 'Preview data',
  taskSummaryLabel: 'Auto-grouped by status',
  aiSourceLabel: 'Generated from preview context',
  metrics: [
    { label: 'Active projects', value: '12', detail: 'Across design, dev, and review' },
    { label: 'Assigned tasks', value: '28', detail: '8 due in the next 7 days' },
    { label: 'Pending reviews', value: '07', detail: 'Submissions and approval notes' },
    { label: 'Resolved issues', value: '19', detail: 'Fast report-to-resolution loop' }
  ],
  lanes: [
    {
      title: 'To do',
      count: 4,
      items: [
        {
          title: 'Finalize client review packet',
          meta: 'Due today',
          note: 'Submission evidence and sign-off checklist.'
        },
        {
          title: 'Prepare field update digest',
          meta: 'Org sync',
          note: 'Summarize blockers and upcoming approvals.'
        }
      ]
    },
    {
      title: 'In progress',
      count: 3,
      items: [
        {
          title: 'Dashboard animation polish',
          meta: 'Design system',
          note: 'Refining subtle motion and card choreography.'
        },
        {
          title: 'AI summary validation',
          meta: 'Workspace update',
          note: 'Check generated next-step prompts against live context.'
        }
      ]
    },
    {
      title: 'Completed',
      count: 5,
      items: [
        {
          title: 'Task status API wiring',
          meta: 'Complete',
          note: 'Task updates and completion toggles connected.'
        },
        {
          title: 'Swagger experience pass',
          meta: 'Complete',
          note: 'Frontend links now match the backend API docs.'
        }
      ]
    }
  ],
  projects: [
    {
      title: 'Client portal revamp',
      progress: 78,
      description: 'Landing refresh, task routing, and approval flow clean-up.',
      tags: ['In progress', 'Design + Dev']
    },
    {
      title: 'Enterprise rollout board',
      progress: 52,
      description: 'Field dashboards, team performance, and notification tuning.',
      tags: ['Review', 'Leadership']
    },
    {
      title: 'AI assist layer',
      progress: 64,
      description: 'Workspace suggestions and prompt-to-action improvements.',
      tags: ['AI', 'Workflow']
    }
  ],
  activity: [
    {
      title: 'Notification pulse',
      description: 'Three new announcements are queued for the next team sync.',
      meta: ['Announcements', '3 unread']
    },
    {
      title: 'Submission spotlight',
      description: 'Launch package is waiting for final review notes from the field admin.',
      meta: ['Submissions', 'Pending']
    },
    {
      title: 'Problem report calm-down',
      description: 'Staging issue marked as resolved after deployment checklist update.',
      meta: ['Reports', 'Resolved']
    }
  ],
  brief: {
    title: 'AI briefing for the next two hours',
    description: 'Focus the team on high-confidence movement with minimal context switching.',
    steps: [
      {
        title: 'Clear review bottlenecks',
        copy: 'Resolve pending approvals first so downstream work can continue without extra waiting.'
      },
      {
        title: 'Push visible updates',
        copy: 'Post one clean workspace update after each milestone so the team stops relying on chat fragments.'
      },
      {
        title: 'Use reports as signal',
        copy: 'Treat new problem reports like operating system alerts and keep the resolution trail crisp.'
      }
    ]
  },
  aiTarget: null
};

function cloneWorkspace(workspace) {
  return JSON.parse(JSON.stringify(workspace));
}

function loadStoredSession() {
  try {
    const raw = window.localStorage.getItem('taskflowFrontendSession');
    return raw ? JSON.parse(raw) : { token: '', apiBase: '' };
  } catch (error) {
    return { token: '', apiBase: '' };
  }
}

function defaultTheme() {
  const savedTheme = window.localStorage.getItem('taskflowTheme');

  if (savedTheme) {
    return savedTheme;
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function defaultApiBaseFromLocation() {
  if (window.location.protocol.startsWith('http')) {
    return `${window.location.origin}/api`;
  }

  return 'http://localhost:5000/api';
}

function formatDate(input) {
  if (!input) {
    return 'No due date';
  }

  const value = new Date(input);

  if (Number.isNaN(value.getTime())) {
    return 'No due date';
  }

  return value.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

function normalizeTitle(item) {
  if (!item) {
    return 'Untitled';
  }

  return item.name || item.title || 'Untitled';
}

function normalizeStatus(status) {
  if (status === 'in_progress') {
    return 'In progress';
  }

  if (status === 'completed') {
    return 'Completed';
  }

  if (status === 'review') {
    return 'In review';
  }

  return 'To do';
}

function buildLanesFromTasks(tasks) {
  const seed = {
    todo: { title: 'To do', count: 0, items: [] },
    in_progress: { title: 'In progress', count: 0, items: [] },
    completed: { title: 'Completed', count: 0, items: [] }
  };

  tasks.forEach((task) => {
    const key = task.status || 'todo';
    const lane = seed[key] || seed.todo;

    lane.count += 1;
    lane.items.push({
      title: normalizeTitle(task),
      meta: task.priority ? `${task.priority} priority` : normalizeStatus(task.status),
      note: task.description || `Due ${formatDate(task.dueDate)}`
    });
  });

  return Object.values(seed).map((lane) => ({
    ...lane,
    items: lane.items.slice(0, 4)
  }));
}

function createProjectTags(project) {
  const tags = [];

  if (project.status) {
    tags.push(normalizeStatus(project.status));
  }

  if (project.priority) {
    tags.push(`${project.priority} priority`);
  }

  if (project.deadline) {
    tags.push(formatDate(project.deadline));
  }

  return tags.length ? tags : ['Active'];
}

function parseAIText(text) {
  return text
    .split('\n')
    .map((line) => line.replace(/^[\-\d\.\s]+/, '').trim())
    .filter(Boolean)
    .slice(0, 4)
    .map((line, index) => ({
      title: `Action ${index + 1}`,
      copy: line
    }));
}

function buildMemberWorkspace(me, dashboard, extras) {
  const dashboardData = dashboard?.data || {};
  const tasks = extras.assigned?.data || [];
  const overdue = extras.overdue?.data || [];
  const upcoming = extras.upcoming?.data || [];
  const notifications = extras.notifications?.data || [];
  const projects = dashboardData.recentProjects || [];

  return {
    sourceLabel: 'Live Member View',
    sessionTitle: `Connected as ${me.username}`,
    sessionSubtitle: 'Dashboard data is syncing from the team-member TaskFlow routes.',
    workspaceTitle: `${dashboardData.user?.username || me.username}'s workspace`,
    statusSignal: 'Live member dashboard',
    projectSourceLabel: 'Recent projects',
    taskSummaryLabel: `${tasks.length} assigned tasks pulled live`,
    aiSourceLabel: 'Will query live project or task suggestions',
    metrics: [
      {
        label: 'Assigned tasks',
        value: String(dashboardData.taskSummary?.total ?? tasks.length),
        detail: `${dashboardData.taskSummary?.inProgress ?? 0} in progress`
      },
      {
        label: 'Overdue',
        value: String(dashboardData.taskSummary?.overdue ?? overdue.length),
        detail: 'Needs attention first'
      },
      {
        label: 'Upcoming',
        value: String(upcoming.length),
        detail: 'Due in the next 7 days'
      },
      {
        label: 'Recent projects',
        value: String(projects.length),
        detail: 'From your active teams'
      }
    ],
    lanes: buildLanesFromTasks(tasks.length ? tasks : [...overdue, ...upcoming]),
    projects: (projects.length ? projects : demoWorkspace.projects).slice(0, 3).map((project) => ({
      title: normalizeTitle(project),
      progress: project.progress || 0,
      description: project.description || 'Live project from your dashboard.',
      tags: createProjectTags(project)
    })),
    activity: (notifications.length ? notifications : demoWorkspace.activity).slice(0, 4).map((notification) => ({
      title: notification.title || notification.type || 'Notification',
      description:
        notification.message || notification.description || 'Live signal from your TaskFlow account.',
      meta: [notification.priority || 'Live', notification.read ? 'Read' : 'Unread']
    })),
    brief: demoWorkspace.brief,
    aiTarget: {
      projectId: projects[0]?._id || null,
      taskId: tasks[0]?._id || null
    }
  };
}

function buildFieldAdminWorkspace(me, dashboard, extras) {
  const dashboardData = dashboard?.data || {};
  const tasks = extras.assigned?.data || [];
  const notifications = extras.notifications?.data || [];
  const openReports = dashboardData.openReports || [];
  const pendingSubmissions = dashboardData.pendingSubmissions || [];

  return {
    sourceLabel: 'Live Field Admin View',
    sessionTitle: `Connected as ${me.username}`,
    sessionSubtitle:
      'Field admin metrics, open reports, and pending submissions are now feeding this view.',
    workspaceTitle: `${dashboardData.field?.name || 'Field'} command board`,
    statusSignal: 'Live field admin dashboard',
    projectSourceLabel: 'Field-level spotlight',
    taskSummaryLabel: `${tasks.length} directly assigned tasks`,
    aiSourceLabel: 'Live AI brief from field context',
    metrics: [
      {
        label: 'Teams',
        value: String(dashboardData.overview?.totalTeams ?? 0),
        detail: 'Across your field'
      },
      {
        label: 'Projects',
        value: String(dashboardData.overview?.totalProjects ?? 0),
        detail: `${dashboardData.overview?.activeProjects ?? 0} active now`
      },
      {
        label: 'Tasks complete',
        value: String(dashboardData.overview?.completedTasks ?? 0),
        detail: `${dashboardData.overview?.overdueTasks ?? 0} overdue`
      },
      {
        label: 'Open reports',
        value: String(openReports.length),
        detail: `${pendingSubmissions.length} submissions waiting`
      }
    ],
    lanes: buildLanesFromTasks(
      tasks.length
        ? tasks
        : demoWorkspace.lanes.flatMap((lane) =>
            lane.items.map((item) => ({
              name: item.title,
              description: item.note,
              status:
                lane.title === 'Completed'
                  ? 'completed'
                  : lane.title === 'In progress'
                    ? 'in_progress'
                    : 'todo',
              priority: item.meta
            }))
          )
    ),
    projects: (dashboardData.teamPerformance || []).slice(0, 3).map((team) => ({
      title: team.team?.name || 'Team',
      progress: Number.parseInt(team.stats?.progress || '0', 10) || 0,
      description: `${team.stats?.projects ?? 0} projects and ${team.stats?.tasks ?? 0} tasks in flow.`,
      tags: ['Team performance', `${team.stats?.completedTasks ?? 0} completed`]
    })),
    activity: [
      ...openReports.slice(0, 2).map((report) => ({
        title: report.title || 'Open report',
        description: report.description || 'Problem report awaiting action.',
        meta: [report.status || 'Open', report.severity || 'Priority']
      })),
      ...pendingSubmissions.slice(0, 2).map((submission) => ({
        title: normalizeTitle(submission.project) || 'Submission review',
        description: submission.content || 'A submission is waiting for review.',
        meta: [submission.status || 'Pending', submission.team?.name || 'Team']
      })),
      ...notifications.slice(0, 2).map((notification) => ({
        title: notification.title || 'Notification',
        description: notification.message || 'Live update from your field.',
        meta: [notification.priority || 'Live']
      }))
    ].slice(0, 4),
    brief: demoWorkspace.brief,
    aiTarget: {
      projectId: pendingSubmissions[0]?.project?._id || null,
      taskId: tasks[0]?._id || null
    }
  };
}

function buildOrgLeaderWorkspace(me, dashboard, extras) {
  const dashboardData = dashboard?.data || {};
  const projects = dashboardData.recentActivity || [];
  const notifications = extras.notifications?.data || [];

  return {
    sourceLabel: 'Live Org Leader View',
    sessionTitle: `Connected as ${me.username}`,
    sessionSubtitle:
      'Organization metrics and recent activity are now powering this executive overview.',
    workspaceTitle: `${dashboardData.organization?.name || 'Organization'} overview`,
    statusSignal: 'Live organization dashboard',
    projectSourceLabel: 'Recent organization activity',
    taskSummaryLabel: 'Executive signal board',
    aiSourceLabel: 'Live AI brief from organization context',
    metrics: [
      {
        label: 'Members',
        value: String(dashboardData.overview?.totalMembers ?? 0),
        detail: 'Across the organization'
      },
      {
        label: 'Fields',
        value: String(dashboardData.overview?.totalFields ?? 0),
        detail: 'Operating groups'
      },
      {
        label: 'Teams',
        value: String(dashboardData.overview?.totalTeams ?? 0),
        detail: 'Execution pods'
      },
      {
        label: 'Projects',
        value: String(dashboardData.overview?.totalProjects ?? 0),
        detail: 'Tracked through TaskFlow'
      }
    ],
    lanes: [
      {
        title: 'Watching',
        count: dashboardData.fields?.length || 0,
        items: (dashboardData.fields || []).slice(0, 4).map((field) => ({
          title: field.field?.name || 'Field',
          meta: `${field.stats?.teams ?? 0} teams`,
          note: `${field.stats?.projects ?? 0} projects, ${field.stats?.activeProjects ?? 0} active`
        }))
      },
      {
        title: 'Recent activity',
        count: projects.length,
        items: projects.slice(0, 4).map((project) => ({
          title: normalizeTitle(project),
          meta: normalizeStatus(project.status),
          note: project.description || 'Recent project activity from your organization.'
        }))
      },
      {
        title: 'Signals',
        count: notifications.length,
        items: notifications.slice(0, 4).map((notification) => ({
          title: notification.title || 'Notification',
          meta: notification.priority || 'Live',
          note: notification.message || 'Recent notification activity.'
        }))
      }
    ],
    projects: (projects.length ? projects : demoWorkspace.projects).slice(0, 3).map((project) => ({
      title: normalizeTitle(project),
      progress: project.progress || 0,
      description: project.description || 'Recent project activity from the organization.',
      tags: createProjectTags(project)
    })),
    activity: notifications
      .slice(0, 4)
      .map((notification) => ({
        title: notification.title || 'Announcement',
        description: notification.message || 'Live organization signal.',
        meta: [notification.priority || 'Live']
      }))
      .concat(demoWorkspace.activity)
      .slice(0, 4),
    brief: demoWorkspace.brief,
    aiTarget: {
      projectId: projects[0]?._id || null,
      taskId: null
    }
  };
}

function FeaturePreview({ cards }) {
  return (
    <div className="feature-preview">
      <div className="preview-card preview-card-large">
        <span className="preview-label">{cards[0].label}</span>
        <strong>{cards[0].title}</strong>
        <p>{cards[0].copy}</p>
      </div>

      <div className="preview-grid">
        {cards.slice(1).map((card) => (
          <div
            className={`preview-card${card.variant === 'dark' ? ' dark' : ''}`}
            key={card.title}
          >
            <span className="preview-label">{card.label}</span>
            <strong>{card.title}</strong>
            <p>{card.copy}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function App() {
  const heroRef = useRef(null);
  const [theme, setTheme] = useState(defaultTheme);
  const [featureTab, setFeatureTab] = useState('overview');
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [authNotice, setAuthNotice] = useState({
    tone: 'neutral',
    text: 'Use demo mode if you just want to feel the interface first.'
  });
  const [apiBase, setApiBase] = useState(() => {
    const stored = loadStoredSession();
    return stored.apiBase || defaultApiBaseFromLocation();
  });
  const [session, setSession] = useState(loadStoredSession);
  const [workspace, setWorkspace] = useState(cloneWorkspace(demoWorkspace));
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [registerForm, setRegisterForm] = useState({
    username: '',
    email: '',
    password: ''
  });

  const activeFeature = featureContent[featureTab];

  useEffect(() => {
    document.body.dataset.theme = theme;
    window.localStorage.setItem('taskflowTheme', theme);
  }, [theme]);

  useEffect(() => {
    if (session.token || session.apiBase) {
      window.localStorage.setItem('taskflowFrontendSession', JSON.stringify(session));
    } else {
      window.localStorage.removeItem('taskflowFrontendSession');
    }
  }, [session]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
          }
        });
      },
      { threshold: 0.12 }
    );

    document.querySelectorAll('.reveal').forEach((node) => observer.observe(node));

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const heroNode = heroRef.current;

    if (!heroNode) {
      return undefined;
    }

    const handleMove = (event) => {
      const rect = heroNode.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;

      heroNode.style.transform = `perspective(1200px) rotateX(${(-y * 5).toFixed(2)}deg) rotateY(${(
        x * 6
      ).toFixed(2)}deg)`;
    };

    const handleLeave = () => {
      heroNode.style.transform = 'perspective(1200px) rotateX(0deg) rotateY(0deg)';
    };

    heroNode.addEventListener('pointermove', handleMove);
    heroNode.addEventListener('pointerleave', handleLeave);

    return () => {
      heroNode.removeEventListener('pointermove', handleMove);
      heroNode.removeEventListener('pointerleave', handleLeave);
    };
  }, []);

  async function apiRequest(path, options = {}, sessionOverride = session) {
    const resolvedApiBase = (sessionOverride.apiBase || apiBase || defaultApiBaseFromLocation()).replace(
      /\/$/,
      ''
    );
    const headers = new Headers(options.headers || {});
    headers.set('Content-Type', 'application/json');

    if (sessionOverride.token) {
      headers.set('Authorization', `Bearer ${sessionOverride.token}`);
    }

    const response = await fetch(`${resolvedApiBase}${path}`, {
      ...options,
      headers
    });

    const payload = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(payload.error || payload.message || 'Request failed');
    }

    return payload;
  }

  async function safeApiRequest(path, options = {}, sessionOverride = session) {
    try {
      return await apiRequest(path, options, sessionOverride);
    } catch (error) {
      return null;
    }
  }

  async function hydrateAIBrief(workspaceModel, sessionOverride = session) {
    if (!sessionOverride.token || !workspaceModel.aiTarget) {
      return;
    }

    const { projectId, taskId } = workspaceModel.aiTarget;
    const response = projectId
      ? await safeApiRequest(`/ai/suggestions/project/${projectId}`, {}, sessionOverride)
      : taskId
        ? await safeApiRequest(`/ai/suggestions/task/${taskId}`, {}, sessionOverride)
        : null;

    if (!response?.data?.suggestions) {
      return;
    }

    setWorkspace((current) => ({
      ...current,
      brief: {
        title: response.data.project?.title || response.data.task?.title || 'Live AI brief',
        description: 'These suggestions were generated from your connected TaskFlow backend.',
        steps: parseAIText(response.data.suggestions)
      },
      aiSourceLabel: 'Generated from live AI endpoint'
    }));
  }

  async function fetchLiveWorkspace(sessionOverride = session) {
    const meResponse = await apiRequest('/auth/me', {}, sessionOverride);
    const me = meResponse.data;
    const role = me.role;

    const dashboardPath =
      role === 'org_leader'
        ? '/dashboard/org-leader'
        : role === 'field_admin'
          ? '/dashboard/field-admin'
          : '/dashboard/team-member';

    const [dashboard, assigned, overdue, upcoming, notifications] = await Promise.all([
      safeApiRequest(dashboardPath, {}, sessionOverride),
      safeApiRequest('/tasks/user/assigned', {}, sessionOverride),
      safeApiRequest('/tasks/overdue/list', {}, sessionOverride),
      safeApiRequest('/tasks/upcoming/week', {}, sessionOverride),
      safeApiRequest('/notifications?limit=4', {}, sessionOverride)
    ]);

    const extras = { assigned, overdue, upcoming, notifications };

    if (role === 'org_leader') {
      return buildOrgLeaderWorkspace(me, dashboard, extras);
    }

    if (role === 'field_admin') {
      return buildFieldAdminWorkspace(me, dashboard, extras);
    }

    return buildMemberWorkspace(me, dashboard, extras);
  }

  useEffect(() => {
    let cancelled = false;

    async function loadWorkspace() {
      if (!session.token) {
        setWorkspace(cloneWorkspace(demoWorkspace));
        return;
      }

      setWorkspace((current) => ({
        ...current,
        sourceLabel: 'Syncing...',
        sessionTitle: 'Connecting to TaskFlow',
        sessionSubtitle: 'Pulling your dashboard and workspace data now.'
      }));

      try {
        const workspaceModel = await fetchLiveWorkspace(session);

        if (cancelled) {
          return;
        }

        setWorkspace(workspaceModel);
        setAuthNotice({
          tone: 'success',
          text: 'Live TaskFlow workspace connected successfully.'
        });
        await hydrateAIBrief(workspaceModel, session);
      } catch (error) {
        if (cancelled) {
          return;
        }

        setSession((current) => ({ ...current, token: '' }));
        setWorkspace(cloneWorkspace(demoWorkspace));
        setAuthNotice({
          tone: 'error',
          text: `Live connection failed: ${error.message}`
        });
      }
    }

    loadWorkspace();

    return () => {
      cancelled = true;
    };
  }, [session.token, session.apiBase]);

  async function handleLogin(event) {
    event.preventDefault();

    const sessionOverride = {
      token: '',
      apiBase: apiBase.trim() || defaultApiBaseFromLocation()
    };

    setAuthNotice({ tone: 'neutral', text: 'Signing in to TaskFlow...' });

    try {
      const response = await apiRequest(
        '/auth/login',
        {
          method: 'POST',
          body: JSON.stringify(loginForm)
        },
        sessionOverride
      );

      setSession({
        token: response.token,
        apiBase: sessionOverride.apiBase
      });
      setAuthOpen(false);
    } catch (error) {
      setAuthNotice({ tone: 'error', text: error.message });
    }
  }

  async function handleRegister(event) {
    event.preventDefault();

    const sessionOverride = {
      token: '',
      apiBase: apiBase.trim() || defaultApiBaseFromLocation()
    };

    setAuthNotice({ tone: 'neutral', text: 'Creating your account...' });

    try {
      const response = await apiRequest(
        '/auth/register',
        {
          method: 'POST',
          body: JSON.stringify(registerForm)
        },
        sessionOverride
      );

      setSession((current) => ({
        ...current,
        apiBase: sessionOverride.apiBase
      }));
      setAuthNotice({
        tone: 'success',
        text:
          response.message || 'Registration sent. Check your email for verification.'
      });
    } catch (error) {
      setAuthNotice({ tone: 'error', text: error.message });
    }
  }

  async function refreshAI() {
    if (!session.token) {
      setWorkspace((current) => ({
        ...current,
        brief: demoWorkspace.brief,
        aiSourceLabel: 'Generated from preview context'
      }));
      return;
    }

    setWorkspace((current) => ({
      ...current,
      aiSourceLabel: 'Refreshing from live AI endpoint...'
    }));
    await hydrateAIBrief(workspace, session);
  }

  function enterDemoMode() {
    setSession((current) => ({
      ...current,
      token: ''
    }));
    setWorkspace(cloneWorkspace(demoWorkspace));
    setAuthOpen(false);
    setAuthNotice({
      tone: 'neutral',
      text: 'Demo mode loaded. Connect a backend session whenever you are ready.'
    });
  }

  const displayStatusSignal =
    workspace.sourceLabel === 'Demo Mode'
      ? theme === 'dark'
        ? 'Dark mode experience'
        : 'Light mode experience'
      : workspace.statusSignal;

  const themeToggleLabel = theme === 'dark' ? 'Use Light Mode' : 'Use Dark Mode';

  return (
    <div className="app-root">
      <div className="page-noise"></div>
      <div className="page-glow page-glow-left"></div>
      <div className="page-glow page-glow-right"></div>

      <header className="site-header">
        <a className="brand" href="#top" aria-label="TaskFlow home">
          <span className="brand-mark">TF</span>
          <span className="brand-copy">
            <strong>TaskFlow</strong>
            <span>AI work orchestration</span>
          </span>
        </a>

        <nav className="site-nav">
          <a href="#features">Features</a>
          <a href="#workspace">Workspace</a>
          <a href="#dark-mode">Dark Mode</a>
          <a href="#connect">Connect</a>
        </nav>

        <div className="site-actions">
          <button
            className="ghost-button"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            type="button"
          >
            {themeToggleLabel}
          </button>
          <button className="primary-button" onClick={() => setAuthOpen(true)} type="button">
            Connect Backend
          </button>
        </div>
      </header>

      <main id="top">
        <section className="hero section">
          <div className="hero-copy reveal">
            <div className="eyebrow-pill">Powered by live TaskFlow APIs and adaptive AI workflows</div>
            <h1>
              Everything your team needs to <span>stay in motion</span>.
            </h1>
            <p>
              Run projects, tasks, updates, problem reporting, submissions, and AI-assisted planning
              from one focused system designed to feel sharp, modern, and genuinely enjoyable to use.
            </p>

            <div className="hero-actions">
              <a className="primary-button" href="#workspace">
                Open Live Preview
              </a>
              <button className="secondary-button" onClick={() => setAuthOpen(true)} type="button">
                Sign In to Backend
              </button>
            </div>

            <div className="hero-proof">
              <div>
                <strong>14+</strong>
                <span>connected workflow surfaces</span>
              </div>
              <div>
                <strong>Dark + Light</strong>
                <span>premium mood with seamless theme switching</span>
              </div>
              <div>
                <strong>Real API Ready</strong>
                <span>hooks directly into your TaskFlow backend</span>
              </div>
            </div>
          </div>

          <div className="hero-visual reveal" id="heroVisual" ref={heroRef}>
            <div className="hero-panel hero-panel-sidebar">
              <div className="panel-top">
                <span className="panel-dot"></span>
                <span className="panel-line"></span>
              </div>
              <div className="mini-brand">
                <span className="mini-mark">TF</span>
                <span>TaskFlow Orbit</span>
              </div>
              <div className="mini-nav">
                <span className="active">Overview</span>
                <span>Projects</span>
                <span>Tasks</span>
                <span>AI Flow</span>
                <span>Reports</span>
              </div>
              <div className="mini-upgrade">
                <strong>Execution pulse</strong>
                <p>Live dashboards, approvals, and task motion in one view.</p>
              </div>
            </div>

            <div className="hero-panel hero-panel-main">
              <div className="preview-heading">
                <div>
                  <small>TaskFlow Command Center</small>
                  <h2>Design sprint delivery</h2>
                </div>
                <div className="avatar-stack">
                  <span>NA</span>
                  <span>KO</span>
                  <span>EM</span>
                  <span>+4</span>
                </div>
              </div>

              <div className="metric-strip">
                <article>
                  <span>Active projects</span>
                  <strong>12</strong>
                  <em>+3 this week</em>
                </article>
                <article>
                  <span>Review queue</span>
                  <strong>07</strong>
                  <em>2 urgent</em>
                </article>
                <article>
                  <span>AI actions saved</span>
                  <strong>18h</strong>
                  <em>per team cycle</em>
                </article>
              </div>

              <div className="board-preview">
                <div className="board-column">
                  <div className="column-head">
                    <strong>To do</strong>
                    <span>05</span>
                  </div>
                  <div className="task-card lavender">
                    <strong>Map release dependencies</strong>
                    <p>AI pulls blockers from reports and flags owners.</p>
                  </div>
                  <div className="task-card">
                    <strong>Client review package</strong>
                    <p>Submission notes, timeline, and assets ready.</p>
                  </div>
                </div>

                <div className="board-column active-column">
                  <div className="column-head">
                    <strong>In progress</strong>
                    <span>03</span>
                  </div>
                  <div className="task-card white-card">
                    <strong>Design QA sweep</strong>
                    <p>Auto-summarized comments and tracked approvals.</p>
                    <div className="task-progress">
                      <span></span>
                    </div>
                  </div>
                  <div className="task-card dark-card">
                    <strong>AI briefing pulse</strong>
                    <p>Smart updates transformed into daily action notes.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="hero-floating hero-floating-a">AI summary ready</div>
            <div className="hero-floating hero-floating-b">9 tasks synced</div>
            <div className="hero-floating hero-floating-c">2 reports escalated</div>
          </div>
        </section>

        <section className="trust-bar section reveal">
          <span>
            Used for projects, approvals, problem escalation, task delivery, and AI planning flows.
          </span>
          <div className="trust-marquee">
            <span>Projects</span>
            <span>Tasks</span>
            <span>Reports</span>
            <span>Submissions</span>
            <span>Notifications</span>
            <span>AI Assistant</span>
            <span>Workspaces</span>
          </div>
        </section>

        <section className="features section" id="features">
          <div className="section-heading reveal">
            <span className="eyebrow-pill">Why teams choose TaskFlow</span>
            <h2>
              Structured like an enterprise system. Designed like a product people actually want to
              use.
            </h2>
            <p>
              The visual direction pulls from your references: bright, airy command surfaces in light
              mode, and a dramatic neon-powered dark mode for focus-heavy sessions.
            </p>
          </div>

          <div className="feature-tabs reveal">
            <div className="tab-list" role="tablist" aria-label="Feature highlights">
              {Object.entries(featureContent).map(([key, content]) => (
                <button
                  className={`tab-button${featureTab === key ? ' active' : ''}`}
                  key={key}
                  onClick={() => setFeatureTab(key)}
                  type="button"
                >
                  {content.kicker}
                </button>
              ))}
            </div>

            <div className="feature-panel">
              <div className="feature-copy">
                <span className="feature-kicker">{activeFeature.kicker}</span>
                <h3>{activeFeature.title}</h3>
                <p>{activeFeature.description}</p>
                <ul className="feature-list">
                  {activeFeature.bullets.map((bullet) => (
                    <li key={bullet}>{bullet}</li>
                  ))}
                </ul>
              </div>

              <FeaturePreview cards={activeFeature.cards} />
            </div>
          </div>
        </section>

        <section className="workspace section" id="workspace">
          <div className="section-heading reveal">
            <span className="eyebrow-pill">Interactive workspace</span>
            <h2>A standalone React frontend that can run in demo mode or sync live with your backend.</h2>
            <p>
              Sign in with your existing TaskFlow API, or explore the polished demo state while your
              backend keeps running.
            </p>
          </div>

          <div className="workspace-shell reveal">
            <aside className="workspace-sidebar">
              <div className="workspace-sidebar-top">
                <div className="workspace-logo">
                  <span>TF</span>
                  <div>
                    <strong>TaskFlow</strong>
                    <small>{workspace.sourceLabel}</small>
                  </div>
                </div>
                <button className="sidebar-connect" onClick={() => setAuthOpen(true)} type="button">
                  Connect Live Data
                </button>
              </div>

              <nav className="workspace-nav">
                {['Overview', 'Projects', 'Tasks', 'Reports', 'AI Flow', 'Notifications'].map(
                  (label, index) => (
                    <button
                      className={`nav-chip${index === 0 ? ' active' : ''}`}
                      key={label}
                      type="button"
                    >
                      {label}
                    </button>
                  )
                )}
              </nav>

              <div className="workspace-status-card">
                <span className="status-label">Session</span>
                <strong>{workspace.sessionTitle}</strong>
                <p>{workspace.sessionSubtitle}</p>
              </div>
            </aside>

            <div className="workspace-main">
              <div className="workspace-topbar">
                <div>
                  <span className="eyebrow-pill compact">Live execution board</span>
                  <h3>{workspace.workspaceTitle}</h3>
                </div>
                <div className="workspace-top-actions">
                  <span className="top-signal">{displayStatusSignal}</span>
                  <button className="ghost-button compact" onClick={refreshAI} type="button">
                    Refresh AI Brief
                  </button>
                </div>
              </div>

              <section className="overview-grid">
                {workspace.metrics.map((metric) => (
                  <article className="stat-card" key={metric.label}>
                    <small>{metric.label}</small>
                    <strong>{metric.value}</strong>
                    <small>{metric.detail}</small>
                  </article>
                ))}
              </section>

              <section className="workspace-panels">
                <article className="panel panel-board">
                  <div className="panel-head">
                    <div>
                      <small>Task motion</small>
                      <h4>Current workload</h4>
                    </div>
                    <span>{workspace.taskSummaryLabel}</span>
                  </div>

                  <div className="task-columns">
                    {workspace.lanes.map((lane) => (
                      <div className="task-lane" key={lane.title}>
                        <div className="lane-head">
                          <strong>{lane.title}</strong>
                          <span className="lane-pill">{lane.count}</span>
                        </div>

                        <div className="lane-list">
                          {lane.items.length ? (
                            lane.items.map((item) => (
                              <article className="lane-card" key={`${lane.title}-${item.title}`}>
                                <strong>{item.title}</strong>
                                <p>{item.note}</p>
                                <div className="lane-card-footer">
                                  <span className="brief-chip">{item.meta}</span>
                                </div>
                              </article>
                            ))
                          ) : (
                            <article className="lane-card">
                              <strong>No items</strong>
                              <p>This lane is clear for now.</p>
                            </article>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </article>

                <article className="panel panel-projects">
                  <div className="panel-head">
                    <div>
                      <small>Project spotlight</small>
                      <h4>Priority initiatives</h4>
                    </div>
                    <span>{workspace.projectSourceLabel}</span>
                  </div>

                  <div className="spotlight-list">
                    {workspace.projects.map((project) => (
                      <article className="spotlight-card" key={project.title}>
                        <strong>{project.title}</strong>
                        <p>{project.description}</p>
                        <div className="spotlight-progress">
                          <span style={{ width: `${project.progress || 0}%` }}></span>
                        </div>
                        <div className="spotlight-meta">
                          {project.tags.map((tag) => (
                            <span key={`${project.title}-${tag}`}>{tag}</span>
                          ))}
                        </div>
                      </article>
                    ))}
                  </div>
                </article>
              </section>

              <section className="workspace-panels secondary">
                <article className="panel panel-activity">
                  <div className="panel-head">
                    <div>
                      <small>Signal center</small>
                      <h4>Notifications and updates</h4>
                    </div>
                  </div>

                  <div className="activity-list">
                    {workspace.activity.map((entry) => (
                      <article className="activity-card" key={entry.title}>
                        <strong>{entry.title}</strong>
                        <p>{entry.description}</p>
                        <div className="activity-meta">
                          {entry.meta.map((tag) => (
                            <span key={`${entry.title}-${tag}`}>{tag}</span>
                          ))}
                        </div>
                      </article>
                    ))}
                  </div>
                </article>

                <article className="panel panel-ai">
                  <div className="panel-head">
                    <div>
                      <small>AI companion</small>
                      <h4>Suggested next moves</h4>
                    </div>
                    <span>{workspace.aiSourceLabel}</span>
                  </div>

                  <div className="ai-brief">
                    <div className="brief-header">
                      <strong>{workspace.brief.title}</strong>
                      <p>{workspace.brief.description}</p>
                    </div>

                    <ul className="brief-list">
                      {workspace.brief.steps.map((step) => (
                        <li key={step.title}>
                          <strong>{step.title}</strong>
                          <p>{step.copy}</p>
                        </li>
                      ))}
                    </ul>
                  </div>
                </article>
              </section>
            </div>
          </div>
        </section>

        <section className="dark-mode section" id="dark-mode">
          <div className="dark-stage reveal">
            <div className="dark-stage-copy">
              <span className="eyebrow-pill dark-pill">Dark mode preview</span>
              <h2>Organize smarter, work faster, and keep the interface magnetic after hours.</h2>
              <p>
                When teams shift into focus mode, TaskFlow swaps the bright productivity feel for a
                deeper cinematic workspace with neon accents, aurora lines, glass panels, and
                low-glare contrast.
              </p>
              <button
                className="primary-button dark-action"
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                type="button"
              >
                {theme === 'dark' ? 'Return to Light Mode' : 'Enable Dark Mode'}
              </button>
            </div>

            <div className="dark-stage-visual">
              <div className="neon-line"></div>
              <div className="dark-orb"></div>
              <div className="dark-card dark-card-main">
                <small>You shared, we listened.</small>
                <strong>Enhance dashboard functionality</strong>
                <div className="dark-tags">
                  <span>In progress</span>
                  <span>Today</span>
                  <span>Aug 03</span>
                </div>
              </div>
              <div className="dark-bubble bubble-left">Pending</div>
              <div className="dark-bubble bubble-right">Confirmed</div>
              <div className="dark-bubble bubble-bottom">AI briefing ready</div>
            </div>
          </div>
        </section>

        <section className="connect section" id="connect">
          <div className="connect-card reveal">
            <div>
              <span className="eyebrow-pill">Ready to use</span>
              <h2>Frontend and backend now speak the same language.</h2>
              <p>
                The frontend lives in a separate React folder, supports light and dark experiences,
                and is prepared to authenticate against your TaskFlow API routes.
              </p>
            </div>
            <div className="connect-actions">
              <button className="primary-button" onClick={() => setAuthOpen(true)} type="button">
                Connect Your Account
              </button>
              <a className="secondary-button" href="/api-docs" rel="noreferrer" target="_blank">
                Open API Docs
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <span>TaskFlow React frontend built to match your backend architecture.</span>
        <span>
          Open <strong>/app</strong> for the experience and <strong>/api-docs</strong> for the
          backend reference.
        </span>
      </footer>

      {authOpen ? (
        <div className="auth-modal">
          <button
            aria-label="Close dialog"
            className="auth-backdrop"
            onClick={() => setAuthOpen(false)}
            type="button"
          ></button>
          <div
            aria-labelledby="authTitle"
            aria-modal="true"
            className="auth-dialog"
            role="dialog"
          >
            <div className="auth-dialog-head">
              <div>
                <span className="eyebrow-pill compact">Connect TaskFlow API</span>
                <h3 id="authTitle">Sign in or register</h3>
              </div>
              <button className="close-button" onClick={() => setAuthOpen(false)} type="button">
                Close
              </button>
            </div>

            <label className="field-label" htmlFor="apiBaseInput">
              API base URL
            </label>
            <input
              className="text-input"
              id="apiBaseInput"
              onChange={(event) => setApiBase(event.target.value)}
              placeholder="http://localhost:5000/api"
              type="text"
              value={apiBase}
            />

            <div className="auth-tabs">
              <button
                className={`auth-tab${authMode === 'login' ? ' active' : ''}`}
                onClick={() => setAuthMode('login')}
                type="button"
              >
                Login
              </button>
              <button
                className={`auth-tab${authMode === 'register' ? ' active' : ''}`}
                onClick={() => setAuthMode('register')}
                type="button"
              >
                Register
              </button>
            </div>

            {authMode === 'login' ? (
              <form className="auth-form active" onSubmit={handleLogin}>
                <label className="field-label" htmlFor="loginEmail">
                  Email
                </label>
                <input
                  className="text-input"
                  id="loginEmail"
                  onChange={(event) =>
                    setLoginForm((current) => ({ ...current, email: event.target.value }))
                  }
                  required
                  type="email"
                  value={loginForm.email}
                />

                <label className="field-label" htmlFor="loginPassword">
                  Password
                </label>
                <input
                  className="text-input"
                  id="loginPassword"
                  onChange={(event) =>
                    setLoginForm((current) => ({ ...current, password: event.target.value }))
                  }
                  required
                  type="password"
                  value={loginForm.password}
                />

                <button className="primary-button full-width" type="submit">
                  Login to TaskFlow
                </button>
              </form>
            ) : (
              <form className="auth-form active" onSubmit={handleRegister}>
                <label className="field-label" htmlFor="registerUsername">
                  Username
                </label>
                <input
                  className="text-input"
                  id="registerUsername"
                  onChange={(event) =>
                    setRegisterForm((current) => ({ ...current, username: event.target.value }))
                  }
                  required
                  type="text"
                  value={registerForm.username}
                />

                <label className="field-label" htmlFor="registerEmail">
                  Email
                </label>
                <input
                  className="text-input"
                  id="registerEmail"
                  onChange={(event) =>
                    setRegisterForm((current) => ({ ...current, email: event.target.value }))
                  }
                  required
                  type="email"
                  value={registerForm.email}
                />

                <label className="field-label" htmlFor="registerPassword">
                  Password
                </label>
                <input
                  className="text-input"
                  id="registerPassword"
                  onChange={(event) =>
                    setRegisterForm((current) => ({ ...current, password: event.target.value }))
                  }
                  required
                  type="password"
                  value={registerForm.password}
                />

                <button className="primary-button full-width" type="submit">
                  Create account
                </button>
              </form>
            )}

            <div className={`auth-message ${authNotice.tone}`}>{authNotice.text}</div>
            <button className="ghost-button full-width" onClick={enterDemoMode} type="button">
              Continue in Demo Mode
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default App;
