import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
    Calendar, Briefcase, Loader2, AlertTriangle, PlayCircle,
    Code, Database, Layout, Server, Cloud, Globe
} from 'lucide-react';
import { getInterviewHistory, getFeedbackHistory } from '../services/api';

const ScoreCards = () => {
    const [interviews, setInterviews] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const [interviewRes, feedbackRes] = await Promise.all([
                    getInterviewHistory(),
                    getFeedbackHistory()
                ]);

                if (interviewRes && interviewRes.success && feedbackRes && feedbackRes.success) {
                    // Extract a set of interview IDs that have associated feedback
                    const validInterviewIds = new Set(
                        feedbackRes.feedbacks.map(f => f.interviewId?._id || f.interviewId)
                    );

                    // Only keep interviews that are in the valid set
                    const completedInterviews = interviewRes.interviews.filter(inv => validInterviewIds.has(inv._id));
                    setInterviews(completedInterviews);
                } else {
                    setError("Could not load score cards.");
                }
            } catch (err) {
                console.error("Error fetching history:", err);
                setError("Failed to fetch score cards.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchHistory();
    }, []);

    const getJobIcon = (role) => {
        const r = (role || '').toLowerCase();
        if (r.includes('frontend') || r.includes('react') || r.includes('ui')) return <Layout size={24} />;
        if (r.includes('backend') || r.includes('node') || r.includes('python')) return <Server size={24} />;
        if (r.includes('data') || r.includes('sql') || r.includes('database')) return <Database size={24} />;
        if (r.includes('cloud') || r.includes('aws') || r.includes('azure')) return <Cloud size={24} />;
        if (r.includes('web') || r.includes('fullstack')) return <Globe size={24} />;
        return <Code size={24} />;
    };

    const getJobColor = (role) => {
        const r = (role || '').toLowerCase();
        if (r.includes('react') || r.includes('frontend') || r.includes('ui')) return 'text-cyan-500 bg-cyan-500/10 border-cyan-200 shadow-cyan-500/20';
        if (r.includes('python')) return 'text-amber-500 bg-amber-500/10 border-amber-200 shadow-amber-500/20';
        if (r.includes('node') || r.includes('backend')) return 'text-emerald-500 bg-emerald-500/10 border-emerald-200 shadow-emerald-500/20';
        if (r.includes('data') || r.includes('sql') || r.includes('database')) return 'text-fuchsia-500 bg-fuchsia-500/10 border-fuchsia-200 shadow-fuchsia-500/20';
        return 'text-blue-500 bg-blue-500/10 border-blue-200 shadow-blue-500/20';
    };

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <Loader2 className="w-12 h-12 text-blue-500 animate-spin mb-4" />
                <h2 className="text-xl font-bold text-gray-700">Loading your score cards...</h2>
            </div>
        );
    }

    return (
        <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-10 min-h-screen">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                <div>
                    <h1 className="text-4xl md:text-5xl font-black tracking-tighter">
                        <span className="text-[#0f172a]">Score</span>
                        <span className="text-[#4361ee]">Cards</span>
                        <span className="text-[#3b82f6]">.</span>
                    </h1>
                </div>
            </div>

            {error && (
                <div className="bg-red-500/10 text-red-600 p-4 rounded-2xl border border-red-500/20 flex items-center backdrop-blur-md">
                    <AlertTriangle className="mr-3" />
                    {error}
                </div>
            )}

            {!error && interviews.length === 0 ? (
                <div className="bg-white/40 backdrop-blur-xl p-12 rounded-[2rem] border border-white/60 text-center shadow-[0_8px_32px_rgba(0,0,0,0.04)]">
                    <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-inner">
                        <Briefcase className="text-blue-600" size={48} />
                    </div>
                    <h2 className="text-3xl font-extrabold text-gray-800 mb-3">No Score Cards Yet</h2>
                    <p className="text-gray-500 mb-8 max-w-md mx-auto">You haven't completed any mock interviews yet. Start your first session to receive detailed performance analytics.</p>
                    <Link to="/interview" className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl font-bold hover:shadow-xl hover:shadow-blue-500/30 transition-all duration-300 transform hover:-translate-y-1 inline-block">
                        Start an Interview
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {interviews.map((interview, index) => {
                        const iconColorClass = getJobColor(interview.jobRole);
                        return (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                key={interview._id}
                                className="bg-white/60 backdrop-blur-xl rounded-[2rem] p-6 shadow-[0_8px_32px_rgba(0,0,0,0.04)] border border-white/80 hover:border-blue-300/50 hover:shadow-2xl transition-all duration-500 group flex flex-col h-full relative overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-blue-500/5 to-transparent rounded-bl-full pointer-events-none transition-all duration-700 group-hover:scale-150 group-hover:bg-blue-500/10"></div>
                                
                                <div className="flex-1 z-10">
                                    <div className="flex items-start justify-between mb-6">
                                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border shadow-sm transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3 ${iconColorClass}`}>
                                            {getJobIcon(interview.jobRole)}
                                        </div>
                                        <span className="text-[10px] font-bold text-gray-500 bg-white/80 border border-gray-100 px-3 py-1.5 rounded-full flex items-center shadow-sm backdrop-blur-sm">
                                            <Calendar size={10} className="mr-1.5" />
                                            {new Date(interview.createdAt).toLocaleDateString(undefined, {
                                                month: 'short', day: 'numeric', year: 'numeric'
                                            })}
                                        </span>
                                    </div>
                                    <h3 className="text-xl font-extrabold text-gray-900 mb-2 leading-tight">
                                        {interview.jobRole}
                                    </h3>
                                    <div className="inline-block px-3 py-1 bg-gray-100/80 rounded-lg text-xs font-bold text-gray-600 mb-4 border border-gray-200/50 backdrop-blur-sm">
                                        {interview.experience} Exp.
                                    </div>
                                </div>
                                
                                <div className="mt-6 z-10">
                                    <Link
                                        to={`/interview/${interview._id}/feedback`}
                                        className="flex items-center justify-center w-full py-3.5 bg-gradient-to-r from-gray-50 to-white text-gray-700 border border-gray-200/60 font-bold rounded-xl group-hover:from-blue-600 group-hover:to-purple-600 group-hover:text-white group-hover:border-transparent group-hover:shadow-lg group-hover:shadow-blue-500/25 transition-all duration-300"
                                    >
                                        <PlayCircle size={20} className="mr-2" />
                                        View Score Card
                                    </Link>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default ScoreCards;
