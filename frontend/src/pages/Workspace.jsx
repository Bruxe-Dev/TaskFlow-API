import React, { useState, useRef, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Users, Briefcase, CheckSquare, MessageSquare,
    Plus, Settings, Send, Hash, Lock, Smile
} from 'lucide-react';

const MEMBERS = [
    { name: 'Alex Johnson', role: 'Org Leader', color: '#6366f1', status: 'online' },
    { name: 'Maria Santos', role: 'Field Admin', color: '#8b5cf6', status: 'online' },
    { name: 'James Kim', role: 'Team Member', color: '#ec4899', status: 'away' },
    { name: 'Priya Nair', role: 'Team Member', color: '#14b8a6', status: 'offline' },
    { name: 'Chris Davis', role: 'Field Admin', color: '#ef4444', status: 'online' },
];

const CHANNELS = [
    { id: 'general', name: 'general', unread: 2 },
    { id: 'engineering', name: 'engineering', unread: 0 },
    { id: 'design', name: 'design', unread: 1 },
    { id: 'random', name: 'random', unread: 0 },
];

const INITIAL_MESSAGES = {
    general: [
        { id: 1, author: 'Maria Santos', color: '#8b5cf6', text: 'Sprint 3 planning is done! Tasks have been distributed. Please review your assignments 🎉', time: '10:32 AM' },
        { id: 2, author: 'Alex Johnson', color: '#6366f1', text: 'Great work team. Q2 goals are also updated in the workspace.', time: '10:45 AM' },
        { id: 3, author: 'Priya Nair', color: '#14b8a6', text: "Slack integration is live now — you'll get task notifications there too 🔔", time: '11:02 AM' },
    ],
    engineering: [
        { id: 1, author: 'James Kim', color: '#ec4899', text: 'Just pushed the new AI scoring model. Ready for review.', time: 'Yesterday' },
        { id: 2, author: 'Chris Davis', color: '#ef4444', text: 'On it, will review by EOD.', time: 'Yesterday' },
    ],
    design: [
        { id: 1, author: 'Maria Santos', color: '#8b5cf6', text: 'New Figma designs are shared. Check the link in the doc.', time: '2 days ago' },
    ],
    random: [
        { id: 1, author: 'Alex Johnson', color: '#6366f1', text: 'Anyone up for a team lunch Friday?', time: '3 days ago' },
        { id: 2, author: 'Priya Nair', color: '#14b8a6', text: 'Count me in! 🙌', time: '3 days ago' },
    ],
};

const TABS = ['Overview', 'Chat', 'Members'];

const statusDot = (status) => {
    if (status === 'online') return 'bg-green-500';
    if (status === 'away') return 'bg-yellow-500';
    return 'bg-gray-400';
};

export default function Workspace() {
    const [tab, setTab] = useState('Overview');
    const [activeChannel, setActiveChannel] = useState('general');
    const [messages, setMessages] = useState(INITIAL_MESSAGES);
    const [input, setInput] = useState('');
    const bottomRef = useRef(null);

    const sendMessage = () => {
        if (!input.trim()) return;
        setMessages(prev => ({
            ...prev,
            [activeChannel]: [
                ...prev[activeChannel],
                { id: Date.now(), author: 'Alex Johnson', color: '#6366f1', text: input.trim(), time: 'Just now' }
            ]
        }));
        setInput('');
    };

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, activeChannel]);

    return (
        <DashboardLayout title="Workspace" subtitle="AI Engineering">
            {/* Tab bar */}
            <div className="flex items-center gap-1 mb-6 bg-secondary border border-border rounded-xl p-1 w-fit">
                {TABS.map(t => (
                    <button
                        key={t}
                        onClick={() => setTab(t)}
                        className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${tab === t
                                ? 'bg-card text-foreground shadow-sm border border-border'
                                : 'text-muted-foreground hover:text-foreground'
                            }`}
                    >
                        {t}
                    </button>
                ))}
            </div>

            <AnimatePresence mode="wait">
                {/* ── OVERVIEW ── */}
                {tab === 'Overview' && (
                    <motion.div
                        key="overview"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.2 }}
                        className="space-y-5"
                    >
                        {/* Workspace info */}
                        <div className="bg-card border border-border rounded-xl p-6">
                            <div className="flex items-start justify-between mb-5">
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <h2 className="text-lg font-bold text-foreground">AI Engineering Workspace</h2>
                                        <Lock className="w-3.5 h-3.5 text-muted-foreground" />
                                    </div>
                                    <p className="text-sm text-muted-foreground max-w-md">
                                        A flexible space for the AI Engineering team to collaborate, track projects, and stay in sync.
                                    </p>
                                </div>
                                <button className="p-1.5 rounded-lg hover:bg-accent text-muted-foreground transition-colors">
                                    <Settings className="w-4 h-4" />
                                </button>
                            </div>
                            <div className="grid grid-cols-3 gap-3">
                                {[
                                    { label: 'Projects', value: '8', icon: Briefcase, color: 'text-blue-500 bg-blue-500/10' },
                                    { label: 'Tasks', value: '142', icon: CheckSquare, color: 'text-green-500 bg-green-500/10' },
                                    { label: 'Members', value: '24', icon: Users, color: 'text-purple-500 bg-purple-500/10' },
                                ].map(stat => (
                                    <div key={stat.label} className="bg-secondary rounded-xl p-4 text-center">
                                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center mx-auto mb-2 ${stat.color}`}>
                                            <stat.icon className="w-4 h-4" />
                                        </div>
                                        <p className="text-2xl font-black text-foreground">{stat.value}</p>
                                        <p className="text-xs text-muted-foreground mt-0.5">{stat.label}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Quick actions */}
                        <div className="grid sm:grid-cols-3 gap-3">
                            {[
                                { label: 'Go to Chat', icon: MessageSquare, desc: 'Chat with your team in real-time', action: () => setTab('Chat') },
                                { label: 'View Members', icon: Users, desc: "See who's in this workspace", action: () => setTab('Members') },
                                { label: 'New Project', icon: Plus, desc: 'Start a new project here', action: () => { } },
                            ].map(a => (
                                <button
                                    key={a.label}
                                    onClick={a.action}
                                    className="flex items-start gap-3 p-4 bg-card border border-border rounded-xl hover:bg-accent/40 transition-colors text-left group"
                                >
                                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                                        <a.icon className="w-4 h-4 text-primary" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-foreground">{a.label}</p>
                                        <p className="text-xs text-muted-foreground mt-0.5">{a.desc}</p>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* ── CHAT ── */}
                {tab === 'Chat' && (
                    <motion.div
                        key="chat"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.2 }}
                        className="flex gap-4 h-[calc(100vh-13rem)]"
                    >
                        {/* Channel list */}
                        <div className="w-44 shrink-0 flex flex-col gap-1 hidden sm:flex">
                            <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider px-2 mb-1">Channels</p>
                            {CHANNELS.map(ch => (
                                <button
                                    key={ch.id}
                                    onClick={() => setActiveChannel(ch.id)}
                                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors text-left ${activeChannel === ch.id
                                            ? 'bg-primary/10 text-primary font-semibold'
                                            : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                                        }`}
                                >
                                    <Hash className="w-3.5 h-3.5 shrink-0" />
                                    <span className="flex-1 truncate">{ch.name}</span>
                                    {ch.unread > 0 && (
                                        <span className="w-4 h-4 bg-primary text-primary-foreground text-[9px] font-bold rounded-full flex items-center justify-center">
                                            {ch.unread}
                                        </span>
                                    )}
                                </button>
                            ))}
                        </div>

                        {/* Chat window */}
                        <div className="flex-1 flex flex-col bg-card border border-border rounded-xl overflow-hidden">
                            {/* Header */}
                            <div className="flex items-center gap-2 px-4 py-3 border-b border-border shrink-0">
                                <Hash className="w-4 h-4 text-muted-foreground" />
                                <span className="font-semibold text-sm text-foreground">{activeChannel}</span>
                            </div>

                            {/* Messages */}
                            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                                {messages[activeChannel].map((msg, i) => {
                                    const prevMsg = messages[activeChannel][i - 1];
                                    const grouped = prevMsg && prevMsg.author === msg.author;
                                    return (
                                        <div key={msg.id} className={`flex gap-3 ${grouped ? 'mt-1' : 'mt-4'}`}>
                                            {!grouped ? (
                                                <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0 mt-0.5" style={{ backgroundColor: msg.color }}>
                                                    {msg.author[0]}
                                                </div>
                                            ) : (
                                                <div className="w-8 shrink-0" />
                                            )}
                                            <div className="flex-1 min-w-0">
                                                {!grouped && (
                                                    <div className="flex items-baseline gap-2 mb-0.5">
                                                        <span className="text-sm font-semibold text-foreground">{msg.author}</span>
                                                        <span className="text-[10px] text-muted-foreground">{msg.time}</span>
                                                    </div>
                                                )}
                                                <p className="text-sm text-foreground/90 leading-relaxed">{msg.text}</p>
                                            </div>
                                        </div>
                                    );
                                })}
                                <div ref={bottomRef} />
                            </div>

                            {/* Input */}
                            <div className="px-4 pb-4 pt-2 shrink-0 border-t border-border">
                                <div className="flex items-center gap-2 bg-secondary rounded-xl px-3 py-2.5 border border-border focus-within:border-primary/50 transition-colors">
                                    <input
                                        type="text"
                                        value={input}
                                        onChange={e => setInput(e.target.value)}
                                        onKeyDown={e => e.key === 'Enter' && sendMessage()}
                                        placeholder={`Message #${activeChannel}`}
                                        className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
                                    />
                                    <button
                                        onClick={sendMessage}
                                        disabled={!input.trim()}
                                        className="w-7 h-7 bg-primary rounded-lg flex items-center justify-center hover:bg-primary/90 transition-colors disabled:opacity-30 shrink-0"
                                    >
                                        <Send className="w-3.5 h-3.5 text-primary-foreground" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* ── MEMBERS ── */}
                {tab === 'Members' && (
                    <motion.div
                        key="members"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.2 }}
                    >
                        <div className="flex items-center justify-between mb-4">
                            <p className="text-sm text-muted-foreground">{MEMBERS.length} members</p>
                            <button className="flex items-center gap-1.5 bg-primary text-primary-foreground text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-primary/90 transition-colors">
                                <Plus className="w-3.5 h-3.5" />
                                Invite
                            </button>
                        </div>
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                            {MEMBERS.map((m, i) => (
                                <motion.div
                                    key={m.name}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                    className="flex items-center gap-3 p-4 bg-card border border-border rounded-xl hover:bg-accent/30 transition-colors"
                                >
                                    <div className="relative shrink-0">
                                        <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white" style={{ backgroundColor: m.color }}>
                                            {m.name[0]}
                                        </div>
                                        <div className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-card ${statusDot(m.status)}`} />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="text-sm font-semibold text-foreground truncate">{m.name}</p>
                                        <p className="text-xs text-muted-foreground">{m.role}</p>
                                    </div>
                                    <span className={`text-[10px] font-medium capitalize ${m.status === 'online' ? 'text-green-500' : m.status === 'away' ? 'text-yellow-500' : 'text-muted-foreground'
                                        }`}>
                                        {m.status}
                                    </span>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </DashboardLayout>
    );
}