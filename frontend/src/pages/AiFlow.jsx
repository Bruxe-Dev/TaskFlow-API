import React, { useState, useRef, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Zap, Plus, Trash2, MessageSquare, Lightbulb } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

const SUGGESTIONS = [
    'Summarize all overdue tasks for my team',
    'What are the highest priority tasks this week?',
    'Create a sprint plan for next week',
    'Which team members are overloaded with tasks?',
];

const MOCK_RESPONSES = {
    default: "I'm your AI assistant for Taskflow. I can help you manage tasks, summarize projects, prioritize work, and give team insights. What would you like to know?",
    overdue: "Based on your workspace, here are the **overdue tasks**:\n\n1. **Train AI Chatbot Responses** — 2 days overdue (AI Training)\n2. **Prepare AI Sales Report** — 1 day overdue (Reports)\n3. **Dashboard Performance Audit** — 3 days overdue (Engineering)\n\nI'd recommend reassigning or rescheduling tasks 1 and 3 to reduce the backlog.",
    summary: "Here's your **weekly task summary**:\n\n- ✅ **97 tasks completed** (+18% vs last week)\n- 🔄 **38 in progress** across 4 projects\n- ⚠️ **7 overdue** tasks need attention\n- 📅 **24 tasks due this week**\n\n**Top performers:** Maria S. (12 tasks), James K. (9 tasks)\n\n**Bottleneck detected:** Lead Scoring project is 23% behind schedule.",
};

function Message({ msg }) {
    const isUser = msg.role === 'user';
    return (
        <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex gap-2.5 ${isUser ? 'justify-end' : 'justify-start'}`}
        >
            {!isUser && (
                <div className="w-7 h-7 rounded-lg bg-primary/20 flex items-center justify-center shrink-0 mt-0.5">
                    <Zap className="w-3.5 h-3.5 text-primary" />
                </div>
            )}
            <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 ${isUser ? 'bg-primary text-primary-foreground' : 'bg-card border border-border'}`}>
                {isUser ? (
                    <p className="text-sm">{msg.content}</p>
                ) : (
                    <ReactMarkdown className="text-sm prose prose-sm dark:prose-invert max-w-none [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
                        {msg.content}
                    </ReactMarkdown>
                )}
            </div>
        </motion.div>
    );
}

export default function AIFlow() {
    const [conversations, setConversations] = useState([
        { id: 1, title: 'Task prioritization', messages: [{ role: 'assistant', content: MOCK_RESPONSES.default }] },
    ]);
    const [activeConv, setActiveConv] = useState(1);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const bottomRef = useRef(null);

    const current = conversations.find(c => c.id === activeConv);

    const sendMessage = async (text) => {
        const msg = text || input;
        if (!msg.trim()) return;
        setInput('');

        const userMsg = { role: 'user', content: msg };
        setConversations(prev => prev.map(c => c.id === activeConv ? { ...c, messages: [...c.messages, userMsg] } : c));
        setLoading(true);

        await new Promise(r => setTimeout(r, 900));

        const lower = msg.toLowerCase();
        const response = lower.includes('overdue') ? MOCK_RESPONSES.overdue
            : lower.includes('summary') || lower.includes('week') ? MOCK_RESPONSES.summary
                : `I understand you're asking about "${msg}". Let me analyze your workspace data...\n\nBased on current task data, I recommend focusing on the **Lead Scoring** and **Task Automate** projects which have the most pending items. Would you like me to create a prioritized action list?`;

        const aiMsg = { role: 'assistant', content: response };
        setConversations(prev => prev.map(c => c.id === activeConv ? { ...c, messages: [...c.messages, aiMsg] } : c));
        setLoading(false);
    };

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [current?.messages, loading]);

    const newConversation = () => {
        const id = Date.now();
        setConversations(prev => [...prev, {
            id,
            title: 'New conversation',
            messages: [{ role: 'assistant', content: MOCK_RESPONSES.default }]
        }]);
        setActiveConv(id);
    };

    return (
        <DashboardLayout title="AI Flow" subtitle="Your AI workspace assistant">
            <div className="flex gap-4 h-[calc(100vh-10rem)]">
                {/* Conversation list */}
                <div className="w-48 shrink-0 hidden md:flex flex-col gap-1">
                    <button
                        onClick={newConversation}
                        className="flex items-center gap-1.5 text-xs font-semibold text-primary hover:bg-primary/10 px-3 py-2 rounded-lg transition-colors w-full"
                    >
                        <Plus className="w-3.5 h-3.5" />
                        New chat
                    </button>
                    {conversations.map(c => (
                        <button
                            key={c.id}
                            onClick={() => setActiveConv(c.id)}
                            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-colors text-left group ${activeConv === c.id ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                                }`}
                        >
                            <MessageSquare className="w-3.5 h-3.5 shrink-0" />
                            <span className="truncate flex-1">{c.title}</span>
                            <button
                                onClick={e => { e.stopPropagation(); setConversations(prev => prev.filter(x => x.id !== c.id)); if (activeConv === c.id) setActiveConv(conversations[0]?.id); }}
                                className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
                            >
                                <Trash2 className="w-3 h-3" />
                            </button>
                        </button>
                    ))}
                </div>

                {/* Chat area */}
                <div className="flex-1 flex flex-col bg-card border border-border rounded-xl overflow-hidden">
                    {/* Header */}
                    <div className="flex items-center gap-2 px-4 py-3 border-b border-border shrink-0">
                        <div className="w-6 h-6 rounded-md bg-primary/20 flex items-center justify-center">
                            <Zap className="w-3.5 h-3.5 text-primary" />
                        </div>
                        <span className="font-semibold text-sm text-foreground">Taskflow AI</span>
                        <span className="text-[10px] bg-green-500/20 text-green-500 px-1.5 py-0.5 rounded-full font-semibold">Online</span>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-3">
                        {current?.messages.map((msg, i) => <Message key={i} msg={msg} />)}

                        {loading && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="flex gap-2.5"
                            >
                                <div className="w-7 h-7 rounded-lg bg-primary/20 flex items-center justify-center">
                                    <Zap className="w-3.5 h-3.5 text-primary" />
                                </div>
                                <div className="bg-card border border-border rounded-2xl px-4 py-3 flex items-center gap-1">
                                    {[0, 1, 2].map(i => (
                                        <div key={i} className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: `${i * 150}ms` }} />
                                    ))}
                                </div>
                            </motion.div>
                        )}
                        <div ref={bottomRef} />
                    </div>

                    {/* Suggestions */}
                    {current?.messages.length === 1 && (
                        <div className="px-4 pb-3">
                            <div className="flex items-center gap-1 mb-2">
                                <Lightbulb className="w-3 h-3 text-muted-foreground" />
                                <span className="text-[11px] text-muted-foreground">Try asking:</span>
                            </div>
                            <div className="flex flex-wrap gap-1.5">
                                {SUGGESTIONS.map(s => (
                                    <button
                                        key={s}
                                        onClick={() => sendMessage(s)}
                                        className="text-[11px] bg-secondary hover:bg-accent border border-border px-2.5 py-1 rounded-lg text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        {s}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Input */}
                    <div className="px-4 pb-4 shrink-0">
                        <div className="flex items-center gap-2 bg-secondary border border-border rounded-xl px-3 py-2.5">
                            <input
                                type="text"
                                value={input}
                                onChange={e => setInput(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage()}
                                placeholder="Ask AI anything about your tasks..."
                                className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
                            />
                            <button
                                onClick={() => sendMessage()}
                                disabled={!input.trim() || loading}
                                className="w-7 h-7 bg-primary rounded-lg flex items-center justify-center hover:bg-primary/90 transition-colors disabled:opacity-40 shrink-0"
                            >
                                <Send className="w-3.5 h-3.5 text-primary-foreground" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}