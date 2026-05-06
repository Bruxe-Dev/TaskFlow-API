import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, AlertTriangle, FileText, CheckCircle2, Clock, Download } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import TopBar from '@/components/layout/TopBar';

const taskData = [
    { month: 'Jan', completed: 32, created: 40 },
    { month: 'Feb', completed: 45, created: 50 },
    { month: 'Mar', completed: 28, created: 35 },
    { month: 'Apr', completed: 60, created: 65 },
    { month: 'May', completed: 55, created: 58 },
    { month: 'Jun', completed: 70, created: 72 },
];

const pieData = [
    { name: 'Done', value: 181, color: '#10b981' },
    { name: 'In Progress', value: 64, color: '#6366f1' },
    { name: 'To Do', value: 45, color: '#94a3b8' },
    { name: 'Overdue', value: 3, color: '#ef4444' },
];

const reports = [
    { name: 'Weekly Task Summary', date: 'May 1, 2025', type: 'Task', icon: CheckCircle2, color: 'text-emerald-500 bg-emerald-500/10' },
    { name: 'Project Progress Report', date: 'Apr 30, 2025', type: 'Project', icon: BarChart3, color: 'text-blue-500 bg-blue-500/10' },
    { name: 'Overdue Alert Report', date: 'Apr 28, 2025', type: 'Alert', icon: AlertTriangle, color: 'text-red-500 bg-red-500/10' },
    { name: 'Team Performance Q2', date: 'Apr 25, 2025', type: 'Team', icon: TrendingUp, color: 'text-violet-500 bg-violet-500/10' },
];

export default function Reports() {
    const [range, setRange] = useState('month');

    return (
        <div className="flex flex-col h-full overflow-hidden">
            <TopBar title="Reports & Analytics" />
            <div className="flex-1 overflow-y-auto p-6 space-y-6">

                {/* Filters */}
                <div className="flex items-center gap-2">
                    {['week', 'month', 'quarter', 'year'].map(r => (
                        <button key={r} onClick={() => setRange(r)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-colors ${range === r ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-accent hover:text-foreground'}`}>
                            {r}
                        </button>
                    ))}
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                        { label: 'Tasks Completed', value: '181', change: '+18%', icon: CheckCircle2, color: 'text-emerald-500 bg-emerald-500/10' },
                        { label: 'Avg Completion Time', value: '3.2d', change: '-0.5d', icon: Clock, color: 'text-blue-500 bg-blue-500/10' },
                        { label: 'Overdue Tasks', value: '3', change: '-2', icon: AlertTriangle, color: 'text-red-500 bg-red-500/10' },
                        { label: 'Reports Generated', value: '24', change: '+4', icon: FileText, color: 'text-violet-500 bg-violet-500/10' },
                    ].map((s, i) => (
                        <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
                            className="bg-card border border-border rounded-xl p-4">
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-xs text-muted-foreground">{s.label}</span>
                                <div className={`w-8 h-8 ${s.color} rounded-lg flex items-center justify-center`}>
                                    <s.icon className="w-4 h-4" />
                                </div>
                            </div>
                            <div className="text-2xl font-bold text-foreground">{s.value}</div>
                            <div className="text-xs text-emerald-500 mt-1">{s.change} vs last period</div>
                        </motion.div>
                    ))}
                </div>

                <div className="grid lg:grid-cols-3 gap-6">
                    {/* Bar chart */}
                    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                        className="lg:col-span-2 bg-card border border-border rounded-xl p-5">
                        <h3 className="font-semibold text-foreground mb-4">Task Completion Trend</h3>
                        <ResponsiveContainer width="100%" height={200}>
                            <BarChart data={taskData} barGap={4}>
                                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                                <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
                                <YAxis tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
                                <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8, fontSize: 12 }} />
                                <Bar dataKey="completed" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="created" fill="hsl(var(--muted))" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </motion.div>

                    {/* Pie chart */}
                    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
                        className="bg-card border border-border rounded-xl p-5">
                        <h3 className="font-semibold text-foreground mb-4">Task Status</h3>
                        <ResponsiveContainer width="100%" height={160}>
                            <PieChart>
                                <Pie data={pieData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={2} dataKey="value">
                                    {pieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                                </Pie>
                                <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8, fontSize: 12 }} />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="space-y-1 mt-2">
                            {pieData.map(d => (
                                <div key={d.name} className="flex items-center justify-between text-xs">
                                    <div className="flex items-center gap-1.5">
                                        <div className="w-2 h-2 rounded-full" style={{ background: d.color }} />
                                        <span className="text-muted-foreground">{d.name}</span>
                                    </div>
                                    <span className="font-medium text-foreground">{d.value}</span>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>

                {/* Reports list */}
                <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
                    className="bg-card border border-border rounded-xl overflow-hidden">
                    <div className="flex items-center justify-between px-5 py-4 border-b border-border">
                        <h3 className="font-semibold text-foreground">Generated Reports</h3>
                    </div>
                    <div className="divide-y divide-border">
                        {reports.map((r, i) => (
                            <div key={i} className="flex items-center gap-4 px-5 py-3 hover:bg-accent/30 transition-colors group">
                                <div className={`w-9 h-9 rounded-lg ${r.color} flex items-center justify-center shrink-0`}>
                                    <r.icon className="w-4 h-4" />
                                </div>
                                <div className="flex-1">
                                    <div className="text-sm font-medium text-foreground">{r.name}</div>
                                    <div className="text-xs text-muted-foreground">{r.date} · {r.type}</div>
                                </div>
                                <button className="opacity-0 group-hover:opacity-100 flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-all border border-border px-2.5 py-1.5 rounded-lg hover:bg-accent">
                                    <Download className="w-3.5 h-3.5" /> Export
                                </button>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </div>
    );
}