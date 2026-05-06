import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Zap, Eye, EyeOff, ArrowRight, Loader2 } from 'lucide-react';

export default function Login() {
    const navigate = useNavigate();
    const [form, setForm] = useState({ email: '', password: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        // Simulate login - replace with real API call
        await new Promise(r => setTimeout(r, 1000));
        setLoading(false);
        navigate('/dashboard');
    };

    return (
        <div className="min-h-screen bg-background flex font-inter">
            {/* Left panel - branding */}
            <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-violet-900 via-indigo-900 to-slate-900 relative overflow-hidden">
                <div className="absolute inset-0">
                    <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-violet-500/20 rounded-full blur-3xl animate-pulse-slow" />
                    <div className="absolute bottom-1/3 right-1/4 w-48 h-48 bg-indigo-500/20 rounded-full blur-3xl animate-float" />
                </div>
                <div className="relative z-10 flex flex-col justify-between p-12 w-full">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-violet-500 flex items-center justify-center">
                            <Zap className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-white font-bold text-xl">Taskflow</span>
                    </div>
                    <div>
                        <h2 className="text-4xl font-bold text-white mb-4 leading-tight">
                            Manage smarter,<br />ship faster.
                        </h2>
                        <p className="text-violet-200 text-lg mb-8">Join thousands of teams who trust Taskflow to keep their work organized.</p>
                        <div className="space-y-3">
                            {['AI-powered task prioritization', 'Real-time team collaboration', 'Advanced analytics & reporting'].map(f => (
                                <div key={f} className="flex items-center gap-3 text-violet-100">
                                    <div className="w-5 h-5 rounded-full bg-violet-500/30 flex items-center justify-center">
                                        <div className="w-2 h-2 rounded-full bg-violet-300" />
                                    </div>
                                    <span className="text-sm">{f}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Right panel - form */}
            <div className="flex-1 flex items-center justify-center p-8">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
                    className="w-full max-w-md">
                    {/* Mobile logo */}
                    <div className="flex items-center gap-2 mb-10 lg:hidden">
                        <div className="w-8 h-8 rounded-lg bg-violet-600 flex items-center justify-center">
                            <Zap className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-xl font-bold">Taskflow</span>
                    </div>

                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-foreground mb-2">Welcome back</h1>
                        <p className="text-muted-foreground">Sign in to your Taskflow account</p>
                    </div>

                    {error && (
                        <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-sm">{error}</div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-1.5">Email address</label>
                            <input
                                type="email" required value={form.email}
                                onChange={e => setForm({ ...form, email: e.target.value })}
                                placeholder="you@company.com"
                                className="w-full px-4 py-3 bg-background border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-1.5">Password</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'} required value={form.password}
                                    onChange={e => setForm({ ...form, password: e.target.value })}
                                    placeholder="••••••••"
                                    className="w-full px-4 py-3 bg-background border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-sm pr-10"
                                />
                                <button type="button" onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                            <div className="flex justify-end mt-1.5">
                                <a href="#" className="text-xs text-primary hover:underline">Forgot password?</a>
                            </div>
                        </div>
                        <button type="submit" disabled={loading}
                            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3 px-4 rounded-xl transition-all flex items-center justify-center gap-2 text-sm shadow-md shadow-primary/20 disabled:opacity-70">
                            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><span>Sign in</span> <ArrowRight className="w-4 h-4" /></>}
                        </button>
                    </form>

                    <div className="mt-6 text-center text-sm text-muted-foreground">
                        Don't have an account?{' '}
                        <Link to="/register" className="text-primary font-medium hover:underline">Create one</Link>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}