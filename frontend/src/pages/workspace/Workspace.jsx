import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, MessageSquare, Users, FolderOpen, Settings, Send, ThumbsUp } from 'lucide-react';
import TopBar from '@/components/layout/TopBar';

const updates = [
    { id: 1, author: 'Alex J', avatar: 'A', time: '2 hours ago', content: 'Finished the initial design for the AI Lead Scoring dashboard. Ready for review! 🚀', likes: 3, comments: 2 },
    { id: 2, author: 'Sarah K', avatar: 'S', time: '5 hours ago', content: 'The chatbot training dataset is ready. We can start the fine-tuning process tomorrow.', likes: 5, comments: 4 },
    { id: 3, author: 'Mike R', avatar: 'M', time: '1 day ago', content: 'Sprint retrospective notes are in the shared folder. Key wins: completed lead scoring model, reduced API latency by 30%.', likes: 8, comments: 1 },
];

const members = [
    { name: 'Alex Johnson', role: 'Team Leader', status: 'online' },
    { name: 'Sarah Kim', role: 'Developer', status: 'online' },
    { name: 'Mike Roberts', role: 'Designer', status: 'away' },
    { name: 'Emma Liu', role: 'Analyst', status: 'offline' },
    { name: 'Jordan Park', role: 'Developer', status: 'online' },
];

const statusColor = { online: 'bg-emerald-400', away: 'bg-amber-400', offline: 'bg-muted-foreground/30' };

export default function Workspace() {
    const [postInput, setPostInput] = useState('');
    const [likedPosts, setLikedPosts] = useState([]);

    const toggleLike = (id) => {
        setLikedPosts(prev => prev.includes(id) ? prev.filter(l => l !== id) : [...prev, id]);
    };

    return (
        <div className="flex flex-col h-full overflow-hidden">
            <TopBar title="Workspace" />
            <div className="flex-1 overflow-y-auto p-6">
                <div className="max-w-5xl mx-auto grid lg:grid-cols-3 gap-6">
                    {/* Updates feed */}
                    <div className="lg:col-span-2 space-y-4">
                        {/* Post input */}
                        <div className="bg-card border border-border rounded-xl p-4">
                            <div className="flex items-start gap-3">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-400 to-indigo-500 flex items-center justify-center text-white text-sm font-bold shrink-0">A</div>
                                <div className="flex-1">
                                    <textarea value={postInput} onChange={e => setPostInput(e.target.value)}
                                        placeholder="Share an update with your team..."
                                        rows={2}
                                        className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none resize-none"
                                    />
                                    <div className="flex justify-end mt-2">
                                        <button disabled={!postInput.trim()}
                                            className="flex items-center gap-1.5 bg-primary text-primary-foreground text-xs font-medium px-3 py-1.5 rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-40">
                                            <Send className="w-3.5 h-3.5" /> Post
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Updates */}
                        <h3 className="font-semibold text-foreground text-sm px-1">Recent Updates</h3>
                        {updates.map((update, i) => (
                            <motion.div key={update.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
                                className="bg-card border border-border rounded-xl p-4">
                                <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-400 to-indigo-500 flex items-center justify-center text-white text-sm font-bold shrink-0">
                                        {update.avatar}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-sm font-semibold text-foreground">{update.author}</span>
                                            <span className="text-xs text-muted-foreground">{update.time}</span>
                                        </div>
                                        <p className="text-sm text-foreground/80 leading-relaxed">{update.content}</p>
                                        <div className="flex items-center gap-4 mt-3">
                                            <button onClick={() => toggleLike(update.id)}
                                                className={`flex items-center gap-1.5 text-xs transition-colors ${likedPosts.includes(update.id) ? 'text-primary font-medium' : 'text-muted-foreground hover:text-foreground'}`}>
                                                <ThumbsUp className="w-3.5 h-3.5" />
                                                {update.likes + (likedPosts.includes(update.id) ? 1 : 0)}
                                            </button>
                                            <button className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
                                                <MessageSquare className="w-3.5 h-3.5" />
                                                {update.comments} replies
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-4">
                        {/* Members */}
                        <div className="bg-card border border-border rounded-xl overflow-hidden">
                            <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                                <h3 className="font-semibold text-foreground text-sm flex items-center gap-2">
                                    <Users className="w-4 h-4 text-muted-foreground" /> Members
                                </h3>
                                <button className="p-1 hover:bg-accent rounded-md text-muted-foreground">
                                    <Plus className="w-3.5 h-3.5" />
                                </button>
                            </div>
                            <div className="p-3 space-y-2">
                                {members.map((m, i) => (
                                    <div key={i} className="flex items-center gap-2.5">
                                        <div className="relative">
                                            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-400 to-indigo-500 flex items-center justify-center text-white text-xs font-bold">
                                                {m.name[0]}
                                            </div>
                                            <div className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-card ${statusColor[m.status]}`} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="text-xs font-medium text-foreground truncate">{m.name}</div>
                                            <div className="text-xs text-muted-foreground">{m.role}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Workspace settings */}
                        <div className="bg-card border border-border rounded-xl p-4">
                            <h3 className="font-semibold text-foreground text-sm flex items-center gap-2 mb-3">
                                <Settings className="w-4 h-4 text-muted-foreground" /> Quick Actions
                            </h3>
                            <div className="space-y-2">
                                {[
                                    { label: 'Invite member', icon: Users },
                                    { label: 'New project', icon: FolderOpen },
                                    { label: 'Workspace settings', icon: Settings },
                                ].map((a, i) => (
                                    <button key={i} className="w-full flex items-center gap-2.5 text-sm text-muted-foreground hover:text-foreground hover:bg-accent px-3 py-2 rounded-lg transition-colors text-left">
                                        <a.icon className="w-4 h-4" />
                                        {a.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}