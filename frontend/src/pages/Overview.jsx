import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Flame, Star, Clock, FileText, Video, Activity, TrendingUp, Loader2, Target } from 'lucide-react';
import { motion } from 'framer-motion';
import { getUserStats } from '../services/api';

const containerVariants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.05
        }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { 
        opacity: 1, 
        y: 0, 
        transition: { 
            type: "spring", 
            stiffness: 100, 
            damping: 15 
        } 
    }
};

const MOTIVATIONAL_QUOTES = [
    "Believe you can and you're halfway there. Let's make today count!",
    "Preparation is the key to unlocking your dream role. You've got this!",
    "Every practice session brings you one step closer to success.",
    "Your dedication today builds the career of your dreams tomorrow.",
    "Confidence comes from preparation. Let's sharpen your skills!",
    "Success is where preparation and opportunity meet. Keep growing!",
    "Consistency is the secret to outstanding interview performance.",
    "Focus on progress, not perfection. Every question you answer builds mastery."
];

const Overview = () => {
    const userName = localStorage.getItem('userName') || "User";
    const token = localStorage.getItem('token');
    const navigate = useNavigate();

    const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);

    useEffect(() => {
        // Seed index on mount
        setCurrentQuoteIndex(Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length));

        const interval = setInterval(() => {
            setCurrentQuoteIndex((prevIndex) => {
                let nextIndex = prevIndex;
                while (nextIndex === prevIndex && MOTIVATIONAL_QUOTES.length > 1) {
                    nextIndex = Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length);
                }
                return nextIndex;
            });
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await getUserStats();
                setStats(response.data);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching stats:", err);
                setError("Failed to load dashboard data. Please try again later.");
                setLoading(false);
            }
        };

        if (token) {
            fetchStats();
        } else {
            setLoading(false);
        }
    }, [token]);

    const iconMap = {
        Video: Video,
        FileText: FileText
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="flex flex-col items-center space-y-4">
                    <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                    <p className="text-slate-500 font-medium">Gathering your progress...</p>
                </div>
            </div>
        );
    }

    const displayStats = stats || {
        activityScore: 0,
        streak: 0,
        questionsAttempted: 0,
        graphData: [
            { day: 'Mon', count: 0 },
            { day: 'Tue', count: 0 },
            { day: 'Wed', count: 0 },
            { day: 'Thu', count: 0 },
            { day: 'Fri', count: 0 },
            { day: 'Sat', count: 0 },
            { day: 'Sun', count: 0 }
        ],
        recentActivities: []
    };

    // Show up to 5 recent activities
    const displayActivities = displayStats.recentActivities.slice(0, 5);

    return (
        <div className="relative min-h-full overflow-hidden">
            {/* Global Ambient Background Video & Gradients Wrapper */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
                <video
                    className="absolute w-full h-full object-cover opacity-[0.15]"
                    src="/images/first.mp4"
                    autoPlay
                    loop
                    muted
                    playsInline
                />
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50/20 via-slate-50/80 to-purple-50/20 backdrop-blur-[1px]"></div>
                <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-400/10 rounded-full blur-3xl -mr-96 -mt-48"></div>
                <div className="absolute top-[40%] left-0 w-[600px] h-[600px] bg-purple-400/10 rounded-full blur-3xl -ml-48"></div>
                <div className="absolute bottom-0 right-0 w-[700px] h-[700px] bg-indigo-400/10 rounded-full blur-3xl -mr-96"></div>
            </div>

            <motion.div 
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="relative z-10 p-8 max-w-7xl mx-auto space-y-8"
            >
            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm mb-4">
                    {error}
                </div>
            )}

            {/* 1. Welcome Card (Elegant Blue Gradient, Side-by-Side Layout) */}
            <motion.div 
                variants={itemVariants}
                className="w-full bg-gradient-to-r from-[#1e3a8a] to-[#3b82f6] rounded-2xl p-8 md:p-10 text-white flex flex-col md:flex-row items-center justify-between relative overflow-hidden shadow-lg shadow-blue-500/10"
            >
                {/* Decorative background shapes */}
                <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 rounded-full bg-white opacity-5"></div>
                <div className="absolute bottom-0 left-0 -ml-10 -mb-10 w-32 h-32 rounded-full bg-white opacity-10"></div>
                
                <div className="z-10 text-center md:text-left flex flex-col items-center md:items-start max-w-lg mb-6 md:mb-0">
                    <span className="text-2xl md:text-3xl font-black text-white uppercase tracking-wider block mb-1.5 font-mono">
                        Welcome back!
                    </span>
                    <h2 className="text-4xl md:text-5xl font-black mb-3.5 tracking-tight">
                        {userName}
                    </h2>
                    <motion.p 
                        key={currentQuoteIndex}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        transition={{ duration: 0.5, ease: "easeInOut" }}
                        className="text-blue-100 text-sm md:text-base font-medium max-w-md leading-relaxed min-h-[48px]"
                    >
                        {MOTIVATIONAL_QUOTES[currentQuoteIndex]}
                    </motion.p>
                </div>
                
                <div className="z-10 w-48 md:w-64 lg:w-72 flex-shrink-0 relative">
                    <motion.img 
                        initial={{ opacity: 0, scale: 0.9, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                        src="/images/Welcome-cuate.svg" 
                        alt="Welcome Illustration" 
                        className="w-full h-auto object-contain drop-shadow-2xl hover:scale-105 transition-transform duration-500"
                    />
                </div>
            </motion.div>

            {/* 2. Three Cards Row (Activity Score, Streak, Questions Attempted) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Card 1: Activity Percentage */}
                <motion.div 
                    variants={itemVariants}
                    whileHover={{ y: -5, shadow: "0 10px 25px -5px rgba(59, 130, 246, 0.1), 0 8px 10px -6px rgba(59, 130, 246, 0.1)" }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className="bg-white rounded-2xl p-6 border border-gray-200 flex flex-col justify-between items-center text-center shadow-sm"
                >
                    <div className="w-full flex justify-end">
                        <div className="text-blue-600">
                            <TrendingUp size={20} />
                        </div>
                    </div>
                    <div className="relative w-28 h-28 flex items-center justify-center mt-2">
                        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                            <path
                                className="text-slate-100"
                                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="3"
                                strokeDasharray="100, 100"
                            />
                            <motion.path
                                className="text-blue-600"
                                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="3"
                                strokeDasharray="100"
                                initial={{ strokeDashoffset: 100 }}
                                animate={{ strokeDashoffset: 100 - displayStats.activityScore }}
                                transition={{ duration: 1.5, ease: "easeOut", delay: 0.3 }}
                            />
                        </svg>
                        <div className="absolute flex flex-col items-center justify-center">
                            <motion.span 
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.5, delay: 0.6 }}
                                className="text-2xl font-bold text-slate-900"
                            >
                                {displayStats.activityScore}%
                            </motion.span>
                        </div>
                    </div>
                    <p className="text-slate-500 font-medium mt-4 text-xs uppercase tracking-wider">Activity Score</p>
                </motion.div>

                {/* Card 2: User Streak */}
                <motion.div 
                    variants={itemVariants}
                    whileHover={{ y: -5, shadow: "0 10px 25px -5px rgba(245, 158, 11, 0.1), 0 8px 10px -6px rgba(245, 158, 11, 0.1)" }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className="bg-white rounded-2xl p-6 border border-gray-200 flex flex-col justify-center items-center text-center shadow-sm"
                >
                    <motion.div 
                        whileHover={{ rotate: 15 }}
                        className="bg-slate-50 p-4 rounded-full text-slate-900 mb-4"
                    >
                        <Flame size={32} />
                    </motion.div>
                    <h3 className="text-4xl font-bold text-slate-900 tracking-tight">{displayStats.streak}</h3>
                    <p className="text-slate-500 font-medium mt-2 text-xs uppercase tracking-wider">Day Streak</p>
                </motion.div>

                {/* Card 3: Questions Attempted */}
                <motion.div 
                    variants={itemVariants}
                    whileHover={{ y: -5, shadow: "0 10px 25px -5px rgba(99, 102, 241, 0.1), 0 8px 10px -6px rgba(99, 102, 241, 0.1)" }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className="bg-white rounded-2xl p-6 border border-gray-200 flex flex-col justify-center items-center text-center shadow-sm"
                >
                    <motion.div 
                        whileHover={{ scale: 1.1 }}
                        className="bg-slate-50 p-4 rounded-full text-slate-900 mb-4"
                    >
                        <Target size={32} />
                    </motion.div>
                    <h3 className="text-4xl font-bold text-slate-900 tracking-tight">{displayStats.questionsAttempted || 0}</h3>
                    <p className="text-slate-500 font-medium mt-2 text-xs uppercase tracking-wider">Questions Attempted</p>
                </motion.div>
            </div>

            {/* 3. Progress Graph (Full Width / Center row) */}
            <motion.div 
                variants={itemVariants}
                className="w-full bg-white rounded-2xl p-6 border border-gray-200 flex flex-col shadow-sm"
            >
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-base font-bold text-slate-900 flex items-center">
                        <Activity className="text-blue-600 mr-2" size={18} />
                        Preparation Progress
                    </h2>
                </div>

                <div className="flex items-end justify-between gap-4 mt-6 h-[160px] px-2 sm:px-8">
                    {displayStats.graphData.map((data, i) => (
                        <div key={i} className="flex flex-col items-center justify-end h-full w-full group cursor-pointer relative">
                            {/* Tooltip */}
                            <div className="absolute -top-6 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-800 text-white text-xs py-1 px-2 rounded whitespace-nowrap z-10 pointer-events-none">
                                {data.count} pts
                            </div>
                            
                            {/* Bar container - Explicit 120px height guarantees percentage works perfectly */}
                            <div className="w-full h-[120px] flex items-end justify-center">
                                <motion.div
                                    initial={{ height: 0 }}
                                    animate={{ height: `${Math.min(Math.max(data.count, 5), 100)}%` }}
                                    transition={{ duration: 1.0, ease: "easeOut", delay: i * 0.08 }}
                                    className={`w-full max-w-[40px] rounded-t-md ${i === 6 ? 'bg-blue-600' : 'bg-slate-200 group-hover:bg-blue-300 transition-colors'}`}
                                ></motion.div>
                            </div>
                            
                            <span className={`text-xs font-medium mt-2 h-[20px] flex items-center ${i === 6 ? 'text-blue-600' : 'text-slate-500'}`}>
                                {data.day}
                            </span>
                        </div>
                    ))}
                </div>
            </motion.div>

            {/* 4. Recent Activity Section */}
            <motion.div 
                variants={itemVariants}
                className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm"
            >
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-base font-bold text-slate-900 flex items-center">
                        <Clock className="text-blue-600 mr-2" size={18} />
                        Recent Activity
                    </h2>
                    <button 
                        onClick={() => navigate('/scorecards')}
                        className="text-sm font-medium text-blue-600 hover:underline cursor-pointer"
                    >
                        View All
                    </button>
                </div>

                <div className="space-y-3">
                    {displayActivities.map((activity) => {
                        const Icon = iconMap[activity.icon] || FileText;
                        const dateObj = new Date(activity.date);
                        const displayDate = dateObj.toLocaleDateString() === new Date().toLocaleDateString()
                            ? `Today, ${dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
                            : dateObj.toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });

                        return (
                            <motion.div 
                                key={activity.id} 
                                onClick={() => navigate(`/interview/${activity.id}/feedback`)}
                                whileHover={{ scale: 1.01, x: 5 }}
                                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl hover:bg-slate-50/80 border border-transparent hover:border-gray-100 transition-colors cursor-pointer bg-white"
                            >
                                <div className="flex items-center space-x-4 mb-4 sm:mb-0">
                                    <div className="bg-slate-100 text-slate-600 p-3 rounded-lg">
                                        <Icon size={20} />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-slate-900 text-sm">{activity.title}</p>
                                        <p className="text-xs font-medium text-slate-500 mt-0.5">{activity.role}</p>
                                    </div>
                                </div>
                                <div className="flex items-center sm:block pl-14 sm:pl-0">
                                    <div className="text-xs font-medium text-slate-500">
                                        {displayDate}
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                {displayActivities.length === 0 && (
                    <div className="text-center py-10">
                        <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-3">
                            <Activity className="text-slate-300" size={20} />
                        </div>
                        <h3 className="text-slate-600 font-medium text-sm">No recent activities</h3>
                        <p className="text-slate-400 text-xs mt-1">Start by checking your ATS score or scheduling an interview.</p>
                    </div>
                )}
            </motion.div>
        </motion.div>
    </div>
);
};

export default Overview;
