import React, { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { motion } from 'framer-motion';
import {
    BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer, PieChart, Pie, Cell, Legend
} from 'recharts';
import { TrendingUp, CheckSquare, Users, AlertCircle } from 'lucide-react';

const WEEKLY_DATA = [
    { day: 'Mon', completed: 12, created: 18, overdue: 2 },
    { day: 'Tue', completed: 19, created: 14, overdue: 1 },
    { day: 'Wed', completed: 8, created: 22, overdue: 4 },
    { day: 'Thu', completed: 24, created: 16, overdue: 2 },
    { day: 'Fri', completed: 31, created: 11, overdue: 1 },
    { day: 'Sat', completed: 7, created: 5, overdue: 0 },
    { day: 'Sun', completed: 4, created: 3, overdue: 0 },
];

const MONTHLY = [
    { month: 'Jan', tasks: 145 }, { month: 'Feb', tasks: 162 }, { month: 'Mar', tasks: 178 },
    { month: 'Apr', tasks: 195 }, { month: 'May', tasks: 210 }, { month: 'Jun', tasks: 188 },
];

const STATUS_DIST = [
    { name: 'Completed', value: 97, color: '#22c55e' },
    { name: 'In Progress', value: 38, color: '#6366f1' },
    { name: 'To Do', value: 24, color: '#94a3b8' },
    { name: 'Overdue', value: 7, color: '#ef4444' },
];

const TEAM_PERF = [
    { name: 'AI Engineering', completed: 34, total: 42 },
    { name: 'Marketing AI', completed: 28, total: 35 },
    { name: 'Data Insights', completed: 19, total: 28 },
    { name: 'Growth Team', completed: 16, total: 22 },
];

export default function Analytics() {
    const [period, setPeriod] = useState('week');

    return (
        <DashboardLayout title="Analytics" subtitle="Performance insights">
            {/* Period selector */}
            <div className="flex items-center gap-1 bg-secondary border border-border rounded-lg p-1 w-fit mb-5">
                {['week', 'month', 'quarter'].map(p => (
                    <button
                        key={p}
                        onClick={() => setPeriod(p)}
                        className={`px-3 py-1 rounded-md text-sm font-medium transition-all capitalize ${period === p ? 'bg-card text-foreground shadow-sm border border-border' : 'text-muted-foreground hover:text-foreground'
                            }`}
                    >
                        {p}
                    </button>
                ))}
            </div>

            {/* Top stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
                {[
                    { label: 'Tasks Completed', value: '97', change: '+18%', icon: CheckSquare, color: 'text-green-500 bg-green-500/10' },
                    { label: 'Team Productivity', value: '84%', change: '+5%', icon: TrendingUp, color: 'text-blue-500 bg-blue-500/10' },
                    { label: 'Active Members', value: '24', change: '+2', icon: Users, color: 'text-purple-500 bg-purple-500/10' },
                    { label: 'Overdue Tasks', value: '7', change: '-3', icon: AlertCircle, color: 'text-red-500 bg-red-500/10' },
                ].map((s, i) => (
                    <motion.div
                        key={s.label}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.06 }}
                        className="bg-card border border-border rounded-xl p-4"
                    >
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-2 ${s.color}`}>
                            <s.icon className="w-4 h-4" />
                        </div>
                        <p className="text-2xl font-black text-foreground">{s.value}</p>
                        <p className="text-xs text-muted-foreground">{s.label}</p>
                        <p className="text-[11px] text-green-500 font-medium mt-0.5">{s.change} this {period}</p>
                    </motion.div>
                ))}
            </div>

            <div className="grid lg:grid-cols-3 gap-5 mb-5">
                {/* Weekly tasks chart */}
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="lg:col-span-2 bg-card border border-border rounded-xl p-4"
                >
                    <h3 className="font-semibold text-sm text-foreground mb-4">Task Activity</h3>
                    <ResponsiveContainer width="100%" height={200}>
                        <BarChart data={WEEKLY_DATA}>
                            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                            <XAxis dataKey="day" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
                            <YAxis tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
                            <Tooltip
                                contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px', fontSize: '12px' }}
                                cursor={{ fill: 'hsl(var(--accent))' }}
                            />
                            <Bar dataKey="completed" fill="#6366f1" radius={[3, 3, 0, 0]} name="Completed" />
                            <Bar dataKey="created" fill="#a5b4fc" radius={[3, 3, 0, 0]} name="Created" />
                        </BarChart>
                    </ResponsiveContainer>
                </motion.div>

                {/* Status distribution */}
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25 }}
                    className="bg-card border border-border rounded-xl p-4"
                >
                    <h3 className="font-semibold text-sm text-foreground mb-4">Task Status</h3>
                    <ResponsiveContainer width="100%" height={140}>
                        <PieChart>
                            <Pie data={STATUS_DIST} cx="50%" cy="50%" innerRadius={40} outerRadius={65} paddingAngle={3} dataKey="value">
                                {STATUS_DIST.map((d, i) => <Cell key={i} fill={d.color} />)}
                            </Pie>
                            <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px', fontSize: '12px' }} />
                        </PieChart>
                    </ResponsiveContainer>
                    <div className="space-y-1.5 mt-2">
                        {STATUS_DIST.map(d => (
                            <div key={d.name} className="flex items-center justify-between text-xs">
                                <div className="flex items-center gap-1.5">
                                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: d.color }} />
                                    <span className="text-muted-foreground">{d.name}</span>
                                </div>
                                <span className="font-semibold text-foreground">{d.value}</span>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>

            {/* Team performance */}
            <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-card border border-border rounded-xl p-4"
            >
                <h3 className="font-semibold text-sm text-foreground mb-4">Team Performance</h3>
                <div className="space-y-3">
                    {TEAM_PERF.map((t, i) => (
                        <div key={t.name}>
                            <div className="flex items-center justify-between text-xs mb-1">
                                <span className="font-medium text-foreground">{t.name}</span>
                                <span className="text-muted-foreground">{t.completed}/{t.total} tasks</span>
                            </div>
                            <div className="h-2 bg-secondary rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${(t.completed / t.total) * 100}%` }}
                                    transition={{ delay: 0.4 + i * 0.1, duration: 0.6 }}
                                    className="h-full bg-primary rounded-full"
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </motion.div>
        </DashboardLayout>
    );
}