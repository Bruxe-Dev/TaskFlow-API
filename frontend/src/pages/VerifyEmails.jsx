import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Zap, Mail, CheckCircle, ArrowRight } from 'lucide-react';

export default function VerifyEmail() {
    const [resent, setResent] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleResend = async () => {
        setLoading(true);
        await new Promise(r => setTimeout(r, 800));
        setResent(true);
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-background font-inter flex items-center justify-center px-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="w-full max-w-md text-center"
            >
                <Link to="/" className="flex items-center gap-2 justify-center mb-8">
                    <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                        <Zap className="w-4 h-4 text-primary-foreground" />
                    </div>
                    <span className="font-bold text-foreground text-lg">Taskflow</span>
                </Link>

                <div className="bg-card border border-border rounded-2xl p-8">
                    <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-5">
                        <Mail className="w-7 h-7 text-primary" />
                    </div>

                    <h1 className="text-2xl font-black text-foreground mb-2">Check your email</h1>
                    <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
                        We sent a verification link to your email address. Click the link to activate your account and get started.
                    </p>

                    {resent ? (
                        <div className="flex items-center justify-center gap-2 text-sm text-green-500 bg-green-500/10 rounded-lg px-4 py-2.5 mb-4">
                            <CheckCircle className="w-4 h-4" />
                            Verification email resent!
                        </div>
                    ) : (
                        <button
                            onClick={handleResend}
                            disabled={loading}
                            className="w-full bg-secondary hover:bg-accent border border-border text-foreground font-medium py-2.5 rounded-lg text-sm transition-colors disabled:opacity-60 mb-4"
                        >
                            {loading ? 'Sending...' : "Didn't receive it? Resend"}
                        </button>
                    )}

                    <Link
                        to="/login"
                        className="flex items-center justify-center gap-2 text-sm text-primary font-semibold hover:underline"
                    >
                        Back to sign in <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                </div>
            </motion.div>
        </div>
    );
}