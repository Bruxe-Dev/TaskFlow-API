import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Bell, Shield, Palette, Globe, CreditCard, Save, Sun, Moon } from 'lucide-react';
import TopBar from '@/components/layout/TopBar';
import { useApp } from '@/context/AppContext';
import { useTheme } from '@/context/ThemeContext';

const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'billing', label: 'Billing', icon: CreditCard },
];

export default function Settings() {
    const [activeTab, setActiveTab] = useState('profile');
    const { user } = useApp();
    const { isDark, toggleTheme } = useTheme();
    const [profile, setProfile] = useState({ name: user?.name || '', email: user?.email || '', bio: '' });
    const [saved, setSaved] = useState(false);

    const handleSave = () => {
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    return (
        <div className="flex flex-col h-full overflow-hidden">
            <TopBar title="Settings" />
            <div className="flex-1 overflow-y-auto p-6">
                <div className="max-w-4xl mx-auto">
                    <div className="flex gap-6">
                        {/* Tab nav */}
                        <div className="w-48 shrink-0">
                            <nav className="space-y-1">
                                {tabs.map(tab => (
                                    <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors text-left ${activeTab === tab.id ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-accent hover:text-foreground'}`}>
                                        <tab.icon className="w-4 h-4" />
                                        {tab.label}
                                    </button>
                                ))}
                            </nav>
                        </div>

                        {/* Content */}
                        <div className="flex-1">
                            <motion.div key={activeTab} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.2 }}>
                                {activeTab === 'profile' && (
                                    <div className="bg-card border border-border rounded-xl p-6 space-y-5">
                                        <h3 className="font-semibold text-foreground text-lg">Profile Settings</h3>
                                        <div className="flex items-center gap-4">
                                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-400 to-indigo-500 flex items-center justify-center text-white text-2xl font-bold">
                                                {profile.name[0] || 'U'}
                                            </div>
                                            <button className="text-sm text-primary hover:underline">Change avatar</button>
                                        </div>
                                        <div className="grid gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-foreground mb-1.5">Full name</label>
                                                <input value={profile.name} onChange={e => setProfile({ ...profile, name: e.target.value })}
                                                    className="w-full px-4 py-3 bg-background border border-border rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm" />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-foreground mb-1.5">Email address</label>
                                                <input value={profile.email} onChange={e => setProfile({ ...profile, email: e.target.value })}
                                                    className="w-full px-4 py-3 bg-background border border-border rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm" />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-foreground mb-1.5">Bio</label>
                                                <textarea value={profile.bio} onChange={e => setProfile({ ...profile, bio: e.target.value })}
                                                    rows={3} placeholder="Tell your team about yourself..."
                                                    className="w-full px-4 py-3 bg-background border border-border rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm resize-none" />
                                            </div>
                                        </div>
                                        <button onClick={handleSave} className="flex items-center gap-2 bg-primary text-primary-foreground text-sm font-medium px-5 py-2.5 rounded-xl hover:bg-primary/90 transition-colors">
                                            <Save className="w-4 h-4" />
                                            {saved ? 'Saved!' : 'Save changes'}
                                        </button>
                                    </div>
                                )}

                                {activeTab === 'appearance' && (
                                    <div className="bg-card border border-border rounded-xl p-6 space-y-5">
                                        <h3 className="font-semibold text-foreground text-lg">Appearance</h3>
                                        <div>
                                            <label className="block text-sm font-medium text-foreground mb-3">Theme</label>
                                            <div className="grid grid-cols-2 gap-3">
                                                {[
                                                    { key: 'light', icon: Sun, label: 'Light' },
                                                    { key: 'dark', icon: Moon, label: 'Dark' },
                                                ].map(t => (
                                                    <button key={t.key} onClick={() => !isDark !== (t.key === 'light') && toggleTheme()}
                                                        className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${(!isDark && t.key === 'light') || (isDark && t.key === 'dark') ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/30'}`}>
                                                        <t.icon className={`w-5 h-5 ${(!isDark && t.key === 'light') || (isDark && t.key === 'dark') ? 'text-primary' : 'text-muted-foreground'}`} />
                                                        <span className={`text-sm font-medium ${(!isDark && t.key === 'light') || (isDark && t.key === 'dark') ? 'text-foreground' : 'text-muted-foreground'}`}>{t.label}</span>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'notifications' && (
                                    <div className="bg-card border border-border rounded-xl p-6 space-y-5">
                                        <h3 className="font-semibold text-foreground text-lg">Notification Preferences</h3>
                                        <div className="space-y-4">
                                            {[
                                                { label: 'Task assignments', desc: 'When a task is assigned to you' },
                                                { label: 'Task comments', desc: 'When someone comments on your tasks' },
                                                { label: 'Due date reminders', desc: '24 hours before a task is due' },
                                                { label: 'Project updates', desc: 'When a project status changes' },
                                                { label: 'Team mentions', desc: 'When you are mentioned by teammates' },
                                                { label: 'AI suggestions', desc: 'Daily AI-powered task priorities' },
                                            ].map((n, i) => (
                                                <div key={i} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                                                    <div>
                                                        <div className="text-sm font-medium text-foreground">{n.label}</div>
                                                        <div className="text-xs text-muted-foreground">{n.desc}</div>
                                                    </div>
                                                    <button className="w-10 h-5 bg-primary rounded-full relative transition-colors">
                                                        <div className="absolute top-0.5 right-0.5 w-4 h-4 bg-white rounded-full shadow-sm" />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'security' && (
                                    <div className="bg-card border border-border rounded-xl p-6 space-y-5">
                                        <h3 className="font-semibold text-foreground text-lg">Security</h3>
                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-sm font-medium text-foreground mb-1.5">Current password</label>
                                                <input type="password" placeholder="••••••••"
                                                    className="w-full px-4 py-3 bg-background border border-border rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm" />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-foreground mb-1.5">New password</label>
                                                <input type="password" placeholder="Min. 8 characters"
                                                    className="w-full px-4 py-3 bg-background border border-border rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm" />
                                            </div>
                                            <button className="flex items-center gap-2 bg-primary text-primary-foreground text-sm font-medium px-5 py-2.5 rounded-xl hover:bg-primary/90 transition-colors">
                                                Update password
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'billing' && (
                                    <div className="bg-card border border-border rounded-xl p-6 space-y-5">
                                        <h3 className="font-semibold text-foreground text-lg">Billing & Plan</h3>
                                        <div className="bg-primary/5 border border-primary/20 rounded-xl p-5">
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="font-semibold text-foreground">Free Plan</span>
                                                <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full font-medium">Current</span>
                                            </div>
                                            <p className="text-sm text-muted-foreground mb-4">Up to 5 projects, 10 team members, 1GB storage.</p>
                                            <button className="bg-primary text-primary-foreground text-sm font-medium px-5 py-2.5 rounded-xl hover:bg-primary/90 transition-colors">
                                                Upgrade to Premium →
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}