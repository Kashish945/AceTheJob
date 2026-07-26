import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
    Award, CheckCircle, BarChart3, AlertTriangle, 
    Lightbulb, HelpCircle, ChevronDown, ArrowLeft, Loader2,
    ShieldCheck, ShieldAlert, Monitor, Eye, Users, UserMinus, 
    Smartphone, Clock, BookOpen, AlertCircle, Sparkles, Zap, 
    Check, XCircle, RefreshCw, Activity, Heart, Shield, Star
} from 'lucide-react';
import { getFeedbackHistory, getCheatingReport, getInterviewSummary } from '../services/api';

const InterviewFeedback = () => {
    const { id } = useParams();
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [feedbacks, setFeedbacks] = useState([]);
    const [cheatingReport, setCheatingReport] = useState(null);
    const [summary, setSummary] = useState(null);
    const [expandedItem, setExpandedItem] = useState(0);

    useEffect(() => {
        const fetchFeedback = async () => {
            try {
                const response = await getFeedbackHistory();
                if (response && response.success) {
                    const sessionFeedbacks = response.feedbacks.filter(
                        f => (f.interviewId?._id === id || f.interviewId === id)
                    );
                    setFeedbacks(sessionFeedbacks);
                } else {
                    setError("Could not load feedback history.");
                }

                try {
                    const cheatingRes = await getCheatingReport(id);
                    if (cheatingRes && cheatingRes.success) {
                        setCheatingReport(cheatingRes.report);
                    }
                } catch (err) {
                    console.log("No cheating report found or error fetching:", err);
                }

                try {
                    const summaryRes = await getInterviewSummary(id);
                    if (summaryRes && summaryRes.success) {
                        setSummary(summaryRes.summary);
                    }
                } catch (err) {
                    console.log("No summary found or error fetching:", err);
                }

            } catch (err) {
                console.error("Error fetching feedback:", err);
                setError("Failed to fetch feedback history.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchFeedback();
    }, [id]);

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[70vh] bg-slate-50/50">
                <div className="relative flex items-center justify-center">
                    <Loader2 className="w-16 h-16 text-blue-600 animate-spin mb-4" />
                    <div className="absolute inset-0 w-16 h-16 border-t-2 border-purple-500 rounded-full animate-ping opacity-30"></div>
                </div>
                <h2 className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 mt-4">Compiling AI Evaluation...</h2>
                <p className="text-gray-500 mt-1 max-w-md text-center">We are aggregating behavioral cues, integrity reports, and answer feedback into your premium dashboard.</p>
            </div>
        );
    }

    if (error || feedbacks.length === 0) {
        return (
            <div className="p-8 max-w-4xl mx-auto text-center space-y-6 pt-20">
                <div className="bg-white p-12 rounded-[2rem] shadow-xl border border-red-100 flex flex-col items-center max-w-2xl mx-auto relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-red-50 rounded-full -mr-16 -mt-16 pointer-events-none"></div>
                    <div className="w-16 h-16 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center mb-6">
                        <AlertTriangle size={36} />
                    </div>
                    <h2 className="text-3xl font-black text-slate-900 mb-3">Evaluation Not Found</h2>
                    <p className="text-gray-500 max-w-md">
                        {error || "We couldn't find feedback for this interview session. Make sure you completed the interview questions and saved your responses."}
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 mt-8 w-full sm:w-auto">
                        <Link to="/interview" className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-xl shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 hover:-translate-y-0.5 transition-all text-center">
                            Start New Interview
                        </Link>
                        <Link to="/dashboard" className="px-8 py-4 bg-gray-50 text-gray-700 font-bold border border-gray-200 rounded-xl hover:bg-gray-100 transition text-center">
                            Go to Dashboard
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    // Calculate overall average score
    const totalScore = feedbacks.reduce((acc, curr) => {
        let scoreVal = 0;
        if (typeof curr.score === 'number') {
            scoreVal = curr.score;
        } else if (typeof curr.score === 'string') {
            let matches = curr.score.match(/\d+/);
            if (matches) scoreVal = parseInt(matches[0], 10);
        }
        return acc + scoreVal;
    }, 0);
    
    const averageScore = feedbacks.length > 0 ? Math.round((totalScore / (feedbacks.length * 10)) * 100) : 0;
    const technicalScore = summary?.overallScore || averageScore;
    const integrityScore = cheatingReport?.integrityScore !== undefined ? cheatingReport.integrityScore : 100;
    const confidenceScore = cheatingReport?.confidenceScore !== undefined ? cheatingReport.confidenceScore : 100;
    const riskLevel = cheatingReport?.riskLevel || "Low";

    // Disqualification flags
    const isDisqualified = cheatingReport?.proctoring?.disqualification?.disqualified || 
                           cheatingReport?.finalRecommendation?.toLowerCase().includes("disqualified") ||
                           cheatingReport?.alerts?.length >= 5;
    const disqualificationReason = cheatingReport?.proctoring?.disqualification?.reason || 
                                    "Exceeded maximum allowed proctoring warnings (5 flags triggered).";

    const generateWordingSummary = () => {
        const primaryEmotion = cheatingReport?.primaryEmotion || cheatingReport?.primary_emotion || "Neutral";
        const alertCount = cheatingReport?.warningHistory?.length || cheatingReport?.alerts?.length || 0;
        
        // Extract dominant emotion percentage if available
        let emotionPctText = "";
        if (cheatingReport?.emotionDistribution) {
            const primaryLower = primaryEmotion.toLowerCase();
            const matchingKey = Object.keys(cheatingReport.emotionDistribution).find(
                k => k.toLowerCase() === primaryLower
            );
            if (matchingKey) {
                emotionPctText = ` (${Math.round(cheatingReport.emotionDistribution[matchingKey])}%)`;
            }
        }

        // What Candidate Did text summary
        const facialSummaryText = `Demonstrated a dominant ${primaryEmotion} facial state${emotionPctText}, reflecting performance tension or serious focus.`;
        
        const activities = cheatingReport?.suspiciousActivities || cheatingReport?.suspicious_activities || [];
        const uniqueActs = [...new Set(activities)].map(a => a.split(":")[0]); // get short names
        const flagSummaryText = alertCount > 0 
            ? `Triggered ${alertCount} proctoring warning${alertCount > 1 ? 's' : ''} (${riskLevel} Risk) due to ${uniqueActs.join(" and ") || "suspicious movements"}.`
            : "Maintained absolute integrity with zero proctoring warnings logged (Low Risk).";

        // AI Improvements / Changes You Should Make list:
        const improvements = [
            "Improve Hand Gestures: Use natural open-palm movements to emphasize points. Avoid clenched fists or keeping hands completely static.",
            "Do Not Use Multiple Browsers: Keep all other browser processes (like chrome.exe, msedge.exe) closed. Ensure only the practice tab is running.",
            "Maintain Strict Focus: Avoid gaze redirection or looking away from the camera, which can trigger suspicious activity events.",
            "Avoid Face Touching: Do not touch your face, mouth, or chin during answers as this indicates tension/nervousness."
        ];

        return (
            <div className="space-y-6">
                
                {/* Section 1: What Candidate Did */}
                <div className="space-y-3">
                    <span className="text-[10px] text-blue-600 font-extrabold uppercase tracking-wider block font-mono">
                        1. What the Candidate Did:
                    </span>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Facial Expression Card */}
                        <div className="flex items-center gap-3 p-3.5 bg-white border border-gray-200/60 rounded-2xl shadow-sm">
                            <span className="flex items-center justify-center w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 shrink-0">
                                <Activity className="w-4 h-4" />
                            </span>
                            <div>
                                <span className="text-[9px] font-black uppercase text-slate-400 font-mono tracking-widest block">Facial Composure</span>
                                <p className="text-xs font-bold text-slate-700 mt-0.5 leading-relaxed">
                                    {facialSummaryText}
                                </p>
                            </div>
                        </div>

                        {/* Proctoring Flags Card */}
                        <div className="flex items-center gap-3 p-3.5 bg-white border border-gray-200/60 rounded-2xl shadow-sm">
                            <span className={`flex items-center justify-center w-8 h-8 rounded-xl shrink-0 ${
                                alertCount > 0 ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'
                            }`}>
                                <Shield className="w-4 h-4" />
                            </span>
                            <div>
                                <span className="text-[9px] font-black uppercase text-slate-400 font-mono tracking-widest block">Security Compliance</span>
                                <p className="text-xs font-bold text-slate-700 mt-0.5 leading-relaxed">
                                    {flagSummaryText}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Divider Line */}
                <div className="border-t border-gray-200/60 w-full"></div>

                {/* Section 2: Changes Should I Make */}
                <div className="space-y-3">
                    <span className="text-[10px] text-blue-600 font-extrabold uppercase tracking-wider block font-mono">
                        2. Changes You Should Make to Improve:
                    </span>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {improvements.map((improvement, index) => {
                            const [title, desc] = improvement.split(": ");
                            return (
                                <div 
                                    key={index} 
                                    className="flex items-start gap-3 p-3.5 bg-white border border-gray-200/60 rounded-2xl text-xs shadow-sm transition-all hover:border-blue-100 hover:shadow-md"
                                >
                                    <span className="flex items-center justify-center w-5 h-5 rounded-full bg-blue-50 text-blue-600 text-[10px] font-black shrink-0 mt-0.5 font-mono">
                                        {index + 1}
                                    </span>
                                    <div>
                                        <span className="font-extrabold text-slate-800 block text-xs mb-0.5">{title}</span>
                                        <span className="font-semibold text-slate-500 leading-normal">{desc}</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

            </div>
        );
    };

    const generateEmotionSummary = (primaryEmotion, dbConfidenceScore) => {
        const primary = (primaryEmotion || 'Neutral').toLowerCase();
        let confidenceScore = 85;
        let description = "You maintained a solid, professional composure during the interview. Your facial expressions were stable, representing a focused and clear mindset.";
        let tips = [
            "Maintain natural smiles during introductory questions to build rapport.",
            "Ensure your posture is upright and relaxed to present yourself confidently.",
            "Look directly into the camera lens when presenting key points to simulate true eye contact."
        ];

        if (primary === 'happy' || primary === 'smiling' || primary === 'surprised') {
            confidenceScore = 95;
            description = "Your facial expressions radiated positive energy, warmth, and high confidence! Smiling while discussing your experience is a highly effective way to build immediate rapport with recruiters.";
            tips = [
                "Continue using bright smiles, but ensure they are naturally balanced with periods of calm concentration.",
                "Use expressive hand gestures to emphasize your points.",
                "Your non-verbal engagement is strong; keep replicating this behavior."
            ];
        } else if (primary === 'focused' || primary === 'neutral' || primary === 'calm' || primary === 'focused composure') {
            confidenceScore = 92;
            description = "You demonstrated an exceptionally high degree of professional focus, calm determination, and mental poise. Your expressions were steady and confident throughout the technical questions.";
            tips = [
                "Try incorporating a warm smile at the beginning and end of the session to appear more approachable.",
                "Use purposeful hand movements to add more dynamic interest to your answers.",
                "Your steady eye level reflects strong technical concentration."
            ];
        } else if (primary === 'sad' || primary === 'fear' || primary === 'angry' || primary === 'disgust') {
            confidenceScore = 70;
            description = "Your facial metrics indicated a mild degree of performance tension or serious focus. Being nervous is natural, but maintaining a relaxed, approachable facial posture helps build confidence.";
            tips = [
                "Take deep breaths before answering complex questions to naturally relax your facial muscles.",
                "Practice smiling exercises to make your neutral state look warmer.",
                "Avoid raising your hands or touching your face, as this can signal distress."
            ];
        }

        // Honor the database-backed calculation if it is present
        if (dbConfidenceScore !== undefined && dbConfidenceScore !== null) {
            confidenceScore = dbConfidenceScore;
        }

        return { confidenceScore, description, tips };
    };

    const emotionReport = cheatingReport ? generateEmotionSummary(cheatingReport.primaryEmotion, cheatingReport.confidenceScore) : null;

    // Stamp colors and styles based on final recommendation
    const getRecommendationDetails = () => {
        const rec = (cheatingReport?.finalRecommendation || "").toLowerCase();
        
        if (isDisqualified || rec.includes("disqualified") || rec.includes("fail")) {
            return {
                text: "AUTO-DISQUALIFIED",
                sub: "Interview Terminated due to Security Rules",
                color: "border-red-500 text-red-500 shadow-red-500/10 bg-red-50/50",
                glow: "shadow-[0_0_20px_rgba(239,68,68,0.25)]",
                icon: <XCircle className="w-8 h-8 text-red-500 animate-pulse" />
            };
        } else if (riskLevel === "High" || rec.includes("not recommended")) {
            return {
                text: "NOT RECOMMENDED",
                sub: "Flagged with Severe Proctoring Alerts",
                color: "border-rose-600 text-rose-600 shadow-rose-600/10 bg-rose-50/50",
                glow: "shadow-[0_0_20px_rgba(225,29,72,0.25)]",
                icon: <ShieldAlert className="w-8 h-8 text-rose-600 animate-pulse" />
            };
        } else if (riskLevel === "Medium" || rec.includes("caution")) {
            return {
                text: "RECOMMEND WITH CAUTION",
                sub: "Technical fit adequate; some alerts logged",
                color: "border-amber-500 text-amber-500 shadow-amber-500/10 bg-amber-50/50",
                glow: "shadow-[0_0_20px_rgba(245,158,11,0.25)]",
                icon: <HelpCircle className="w-8 h-8 text-amber-500" />
            };
        } else if (integrityScore >= 85 && technicalScore >= 75) {
            return {
                text: "HIGHLY RECOMMENDED",
                sub: "Outstanding Competence & Integrity",
                color: "border-emerald-500 text-emerald-500 shadow-emerald-500/10 bg-emerald-50/50",
                glow: "shadow-[0_0_20px_rgba(16,185,129,0.25)]",
                icon: <ShieldCheck className="w-8 h-8 text-emerald-500 animate-bounce" />
            };
        } else {
            return {
                text: "RECOMMENDED",
                sub: "Passed technical criteria and integrity check",
                color: "border-blue-500 text-blue-500 shadow-blue-500/10 bg-blue-50/50",
                glow: "shadow-[0_0_20px_rgba(59,130,246,0.25)]",
                icon: <CheckCircle className="w-8 h-8 text-blue-500" />
            };
        }
    };

    const recDetails = getRecommendationDetails();

    // Map warning alert types to colors, badges and icons
    const getAlertMetadata = (type) => {
        const atype = (type || "").toLowerCase();
        if (atype.includes("phone") || atype.includes("device") || atype.includes("calculator") || atype.includes("book")) {
            return {
                color: "bg-red-50 text-red-700 border-red-100",
                badge: "bg-red-600 text-white",
                hsl: "red",
                icon: <Smartphone className="w-4 h-4 text-red-600" />
            };
        } else if (atype.includes("gaze") || atype.includes("away") || atype.includes("look")) {
            return {
                color: "bg-amber-50 text-amber-700 border-amber-100",
                badge: "bg-amber-500 text-white",
                hsl: "amber",
                icon: <Eye className="w-4 h-4 text-amber-600" />
            };
        } else if (atype.includes("screen") || atype.includes("switch") || atype.includes("tab") || atype.includes("blur") || atype.includes("window")) {
            return {
                color: "bg-orange-50 text-orange-700 border-orange-100",
                badge: "bg-orange-500 text-white",
                hsl: "orange",
                icon: <Monitor className="w-4 h-4 text-orange-600" />
            };
        } else if (atype.includes("person") || atype.includes("multiple")) {
            return {
                color: "bg-rose-50 text-rose-700 border-rose-100",
                badge: "bg-rose-600 text-white",
                hsl: "rose",
                icon: <Users className="w-4 h-4 text-rose-600" />
            };
        } else if (atype.includes("absence") || atype.includes("leave")) {
            return {
                color: "bg-red-50 text-red-700 border-red-100",
                badge: "bg-red-600 text-white",
                hsl: "red",
                icon: <UserMinus className="w-4 h-4 text-red-600" />
            };
        } else {
            return {
                color: "bg-purple-50 text-purple-700 border-purple-100",
                badge: "bg-purple-500 text-white",
                hsl: "purple",
                icon: <AlertTriangle className="w-4 h-4 text-purple-600" />
            };
        }
    };

    // Calculate overall rating out of 5 based on weighted metrics
    const overallRating = Math.max(1, Math.min(5, Math.round(((technicalScore * 0.5 + confidenceScore * 0.3 + integrityScore * 0.2) / 20) * 2) / 2));

    const renderStars = (rating) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            if (i <= rating) {
                stars.push(<Star key={i} className="w-9 h-9 fill-amber-400 text-amber-400" />);
            } else if (i - 0.5 === rating) {
                stars.push(
                    <div key={i} className="relative">
                        <Star className="w-9 h-9 text-slate-200" />
                        <div className="absolute inset-0 overflow-hidden w-1/2">
                            <Star className="w-9 h-9 fill-amber-400 text-amber-400" />
                        </div>
                    </div>
                );
            } else {
                stars.push(<Star key={i} className="w-9 h-9 text-slate-200" />);
            }
        }
        return <div className="flex gap-2">{stars}</div>;
    };

    return (
        <div className="min-h-screen bg-gray-50/50 pt-2 md:pt-4 pb-16 px-4 md:px-8 max-w-7xl mx-auto space-y-10">
            
            {/* Header section with modern navigation bar */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-gray-200/60 pb-6">
                <div>
                    <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-950 leading-[1.2] select-none">
                        AI<span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">Performance</span>Report<span className="text-blue-600">.</span>
                    </h1>
                </div>
                <div className="flex gap-3">
                    <Link to="/dashboard" className="flex items-center gap-2 px-5 py-2.5 bg-white text-gray-700 font-bold hover:text-slate-900 hover:bg-gray-50 border border-gray-200/80 rounded-2xl shadow-sm transition-all text-sm">
                        <ArrowLeft size={16} />
                        Dashboard
                    </Link>
                    <Link to="/interview" className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-2xl shadow-md shadow-blue-500/10 hover:shadow-blue-500/20 hover:-translate-y-0.5 transition-all text-sm">
                        <RefreshCw size={16} />
                        New Practice
                    </Link>
                </div>
            </div>

            {/* OVERALL STAR RATING ROW */}
            <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.05 }}
                className="flex flex-col sm:flex-row items-center justify-between p-5 bg-white border border-gray-200/80 rounded-3xl shadow-sm gap-4 px-6 relative overflow-hidden"
            >
                {/* Clean background subtle shapes */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-2xl pointer-events-none"></div>
                
                <div className="flex items-center gap-3.5 z-10">
                    <div className="p-3 bg-amber-50 rounded-2xl border border-amber-100/60 shrink-0">
                        <Star className="w-6 h-6 fill-amber-400 text-amber-400 animate-pulse" />
                    </div>
                    <div>
                    <h3 className="text-xl md:text-2xl font-black text-slate-900 uppercase tracking-wider font-mono">
                        Performance Rating
                    </h3>
                    </div>
                </div>
                <div className="flex items-center gap-3.5 bg-slate-50 border border-gray-200/60 rounded-2xl px-5 py-2.5 shrink-0 z-10">
                    <div className="flex gap-1">{renderStars(overallRating)}</div>
                </div>
            </motion.div>

            {/* CONDITIONAL AUTO-TERMINATED WARNING BANNER */}
            {isDisqualified && (
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="relative overflow-hidden bg-gradient-to-r from-red-950 via-red-900 to-red-950 border border-red-500/30 text-white rounded-[2rem] p-6 md:p-8 shadow-2xl flex flex-col md:flex-row items-center gap-6"
                >
                    <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none animate-pulse"></div>
                    <div className="w-16 h-16 rounded-2xl bg-red-600 flex items-center justify-center shadow-lg border border-red-400/20 shrink-0">
                        <ShieldAlert className="w-10 h-10 text-white animate-bounce" />
                    </div>
                    <div className="space-y-2 flex-1 text-center md:text-left">
                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                            <span className="bg-red-500 text-white text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full tracking-widest animate-pulse font-mono border border-red-400">
                                SECURITY VIOLATION
                            </span>
                            <span className="text-red-300 text-sm font-semibold">AUTOMATIC SESSION STOPPED</span>
                        </div>
                        <h3 className="text-xl md:text-2xl font-black">Proctoring Termination Triggered</h3>
                        <p className="text-red-200/90 text-sm leading-relaxed max-w-3xl">
                            {disqualificationReason} This interview was stopped automatically because our neural network logged 5 independent security warnings. Recruiters will see this status in your final analytics.
                        </p>
                    </div>
                </motion.div>
            )}

            {/* CORE METRICS SUMMARY HERO (Side-by-side Progress Rings & Stamp) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
                
                {/* Visual Circle Progress Gauges Card */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="lg:col-span-12 bg-white rounded-[2.5rem] p-8 shadow-xl relative overflow-hidden border border-gray-200/80 flex flex-col justify-between"
                >
                    {/* Decorative backdrop gradients */}
                    <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl -mr-48 -mt-48 pointer-events-none"></div>
                    <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl -ml-48 -mb-48 pointer-events-none"></div>
                    
                    <div className="relative z-10 flex flex-col md:flex-row items-center justify-around gap-6">
                        
                        {/* Circle 1: Technical Answer Score */}
                        <div className="flex flex-col items-center space-y-4">
                            <div className="relative w-36 h-36">
                                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                                    <circle cx="50" cy="50" r="42" fill="transparent" stroke="rgba(0,0,0,0.04)" strokeWidth="6" />
                                    <motion.circle 
                                        cx="50" cy="50" r="42" fill="transparent" 
                                        stroke="url(#techGrad)" strokeWidth="8" 
                                        strokeDasharray="264" 
                                        initial={{ strokeDashoffset: 264 }}
                                        animate={{ strokeDashoffset: 264 - (264 * (technicalScore / 100)) }}
                                        transition={{ duration: 1.5, ease: "easeOut", delay: 0.1 }}
                                        strokeLinecap="round"
                                        className="drop-shadow-[0_0_8px_rgba(99,102,241,0.2)]"
                                    />
                                    <defs>
                                        <linearGradient id="techGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                                            <stop offset="0%" stopColor="#4F46E5" />
                                            <stop offset="100%" stopColor="#C084FC" />
                                        </linearGradient>
                                    </defs>
                                </svg>
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <motion.span 
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
                                        className="text-3xl font-black text-slate-900 font-mono leading-none"
                                    >
                                        {technicalScore}
                                    </motion.span>
                                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Percent</span>
                                </div>
                            </div>
                            <div className="text-center space-y-1">
                                <h4 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider flex items-center justify-center gap-1.5">
                                    <BarChart3 className="text-indigo-600" size={16} />
                                    Technical Fit
                                </h4>
                                <p className="text-slate-500 text-xs font-semibold">Answer Depth & Clarity</p>
                            </div>
                        </div>

                        {/* Divider Line on Desktop */}
                        <div className="hidden md:block w-px h-32 bg-gray-200/80"></div>

                        {/* Circle 2: Proctoring Integrity Score */}
                        <div className="flex flex-col items-center space-y-4">
                            <div className="relative w-36 h-36">
                                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                                    <circle cx="50" cy="50" r="42" fill="transparent" stroke="rgba(0,0,0,0.04)" strokeWidth="6" />
                                    <motion.circle 
                                        cx="50" cy="50" r="42" fill="transparent" 
                                        stroke="url(#integrityGrad)" strokeWidth="8" 
                                        strokeDasharray="264" 
                                        initial={{ strokeDashoffset: 264 }}
                                        animate={{ strokeDashoffset: 264 - (264 * (((isDisqualified || riskLevel === "High" || integrityScore === 0) ? 100 : integrityScore) / 100)) }}
                                        transition={{ duration: 1.5, ease: "easeOut", delay: 0.1 }}
                                        strokeLinecap="round"
                                        className={
                                            isDisqualified || riskLevel === "High" || integrityScore === 0
                                                ? "drop-shadow-[0_0_8px_rgba(239,68,68,0.35)]"
                                                : riskLevel === "Medium"
                                                    ? "drop-shadow-[0_0_8px_rgba(245,158,11,0.35)]"
                                                    : "drop-shadow-[0_0_8px_rgba(16,185,129,0.35)]"
                                        }
                                    />
                                    <defs>
                                        <linearGradient id="integrityGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                                            {isDisqualified || riskLevel === "High" || integrityScore === 0 ? (
                                                <>
                                                    <stop offset="0%" stopColor="#EF4444" />
                                                    <stop offset="100%" stopColor="#991B1B" />
                                                </>
                                            ) : riskLevel === "Medium" ? (
                                                <>
                                                    <stop offset="0%" stopColor="#F59E0B" />
                                                    <stop offset="100%" stopColor="#B45309" />
                                                </>
                                            ) : (
                                                <>
                                                    <stop offset="0%" stopColor="#10B981" />
                                                    <stop offset="100%" stopColor="#047857" />
                                                </>
                                            )}
                                        </linearGradient>
                                    </defs>
                                </svg>
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <motion.span 
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
                                        className="text-3xl font-black text-slate-900 font-mono leading-none"
                                    >
                                        {cheatingReport?.alerts?.length || cheatingReport?.warningHistory?.length || 0}
                                    </motion.span>
                                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Flags</span>
                                </div>
                            </div>
                            <div className="text-center space-y-1">
                                <h4 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider flex items-center justify-center gap-1.5">
                                    <Shield className={`
                                        ${isDisqualified || riskLevel === "High" ? "text-red-600" : ""}
                                        ${riskLevel === "Medium" ? "text-amber-600" : ""}
                                        ${riskLevel === "Low" && !isDisqualified ? "text-emerald-600" : ""}
                                    `} size={16} />
                                    Proctoring
                                </h4>
                                <p className="text-slate-500 text-xs font-semibold">Security Compliance</p>
                            </div>
                        </div>

                        {/* Divider Line on Desktop */}
                        <div className="hidden md:block w-px h-32 bg-gray-200/80"></div>

                        {/* Circle 3: Behavioral Composure / Confidence Score */}
                        <div className="flex flex-col items-center space-y-4">
                            <div className="relative w-36 h-36">
                                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                                    <circle cx="50" cy="50" r="42" fill="transparent" stroke="rgba(0,0,0,0.04)" strokeWidth="6" />
                                    <motion.circle 
                                        cx="50" cy="50" r="42" fill="transparent" 
                                        stroke="url(#confidenceGrad)" strokeWidth="8" 
                                        strokeDasharray="264" 
                                        initial={{ strokeDashoffset: 264 }}
                                        animate={{ strokeDashoffset: 264 - (264 * (confidenceScore / 100)) }}
                                        transition={{ duration: 1.5, ease: "easeOut", delay: 0.1 }}
                                        strokeLinecap="round"
                                        className="drop-shadow-[0_0_8px_rgba(59,130,246,0.2)]"
                                    />
                                    <defs>
                                        <linearGradient id="confidenceGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                                            <stop offset="0%" stopColor="#3B82F6" />
                                            <stop offset="100%" stopColor="#EC4899" />
                                        </linearGradient>
                                    </defs>
                                </svg>
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <motion.span 
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
                                        className="text-3xl font-black text-slate-900 font-mono leading-none"
                                    >
                                        {confidenceScore}
                                    </motion.span>
                                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Composure</span>
                                </div>
                            </div>
                            <div className="text-center space-y-1">
                                <h4 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider flex items-center justify-center gap-1.5">
                                    <Activity className="text-blue-600" size={16} />
                                    Behavioral
                                </h4>
                                <p className="text-slate-500 text-xs font-semibold">Confidence & Poise</p>
                            </div>
                        </div>

                    </div>

                    {/* Summary text narrative below circles */}
                    <motion.div 
                        initial={{ opacity: 0, y: 15, scale: 0.98 }}
                        whileInView={{ opacity: 1, y: 0, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                        className="relative z-10 mt-8 bg-gradient-to-br from-slate-50 via-blue-50/10 to-slate-50 border border-gray-200/60 rounded-3xl p-5 md:p-6 shadow-inner overflow-hidden"
                    >
                        <span className="text-xs text-blue-600 font-black uppercase tracking-wider block mb-2.5 font-mono">
                            AI Executive Summary
                        </span>
                        {generateWordingSummary()}
                    </motion.div>
                </motion.div>


            </div>




            {/* DETAILED PER-QUESTION FEEDBACK BREAKDOWN */}
            <div className="space-y-6">
                <div className="border-b border-gray-200/60 pb-4">
                    <h2 className="text-2xl md:text-3xl font-black text-slate-900 flex items-center gap-2">
                        <CheckCircle className="text-blue-600" size={28} />
                        Question Breakdown & AI Suggestions
                    </h2>
                </div>
                
                <div className="space-y-4">
                    {feedbacks.map((item, index) => {
                        const scoreNum = typeof item.score === 'string' ? parseInt(item.score) : item.score;
                        const isGoodScore = scoreNum >= 7;
                        
                        return (
                            <motion.div 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.05 * index }}
                                key={item._id || index} 
                                className={`bg-white rounded-3xl overflow-hidden border shadow-sm transition-all duration-300 ${
                                    expandedItem === index ? 'border-blue-300 shadow-md' : 'border-gray-200 hover:border-gray-300'
                                }`}
                            >
                                {/* Question Header Accordion Toggle */}
                                <div 
                                    className="p-6 cursor-pointer flex items-start justify-between bg-white relative overflow-hidden select-none"
                                    onClick={() => setExpandedItem(expandedItem === index ? null : index)}
                                >
                                    {expandedItem === index && (
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50/30 rounded-bl-full pointer-events-none"></div>
                                    )}
                                    <div className="flex-1 pr-6 z-10 space-y-2">
                                        <div className="flex items-center flex-wrap gap-2">
                                            <span className="bg-slate-900 text-white text-[10px] font-black px-3 py-1 rounded-lg uppercase tracking-wider font-mono">
                                                Question {index + 1}
                                            </span>
                                            <span className={`text-[10px] font-black px-3 py-1 rounded-lg uppercase tracking-wider font-mono ${
                                                isGoodScore ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200'
                                            }`}>
                                                Accuracy: {scoreNum}/10
                                            </span>
                                        </div>
                                        <h3 className="text-md md:text-lg font-black text-slate-800 leading-snug">{item.question}</h3>
                                    </div>
                                    <div className={`p-2 rounded-xl z-10 transition-transform duration-300 shrink-0 ${
                                        expandedItem === index ? 'bg-blue-50 text-blue-600 rotate-180' : 'bg-slate-50 text-gray-400'
                                    }`}>
                                        <ChevronDown size={20} />
                                    </div>
                                </div>

                                {/* Accordion Content Panel */}
                                {expandedItem === index && (
                                    <div className="p-6 bg-slate-50/50 border-t border-gray-100 space-y-6">
                                        
                                        {/* User's Answer */}
                                        <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-sm relative overflow-hidden">
                                            <div className="absolute top-0 left-0 w-1.5 h-full bg-blue-500"></div>
                                            <h4 className="flex items-center text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 font-mono">
                                                Your Response
                                            </h4>
                                            <p className="text-gray-800 text-sm leading-relaxed font-semibold italic pl-3">
                                                "{item.userAnswer || "No transcript saved."}"
                                            </p>
                                        </div>

                                        {/* Expected Ideal Response */}
                                        <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-sm relative overflow-hidden">
                                            <div className="absolute top-0 left-0 w-1.5 h-full bg-emerald-500"></div>
                                            <h4 className="flex items-center text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 font-mono">
                                                Reference Perfect Answer
                                            </h4>
                                            <p className="text-slate-700 text-sm leading-relaxed">
                                                {item.correctAnswer}
                                            </p>
                                        </div>

                                        {/* AI Refinements suggestions */}
                                        <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-5 rounded-2xl border border-purple-100 shadow-sm">
                                            <h4 className="flex items-center text-[10px] font-black text-purple-800 uppercase tracking-widest mb-3 font-mono gap-1">
                                                <Lightbulb className="text-amber-500" size={14} />
                                                Constructive AI Advice
                                            </h4>
                                            <div className="text-slate-800 text-sm leading-relaxed font-semibold">
                                                {item.improvements}
                                            </div>
                                        </div>

                                    </div>
                                )}
                            </motion.div>
                        );
                    })}
                </div>
            </div>
            
            {/* CTA action bottom bar */}
            <div className="pt-8 flex flex-col sm:flex-row justify-center items-center gap-4 border-t border-gray-200/60 mt-10">
                <Link 
                    to="/interview"
                    className="w-full sm:w-auto text-center bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-black py-4 px-10 rounded-2xl shadow-xl shadow-blue-500/10 hover:shadow-blue-500/30 hover:-translate-y-1 transition-all text-lg"
                >
                    Practice Again
                </Link>
                <Link 
                    to="/dashboard"
                    className="w-full sm:w-auto text-center bg-white text-gray-800 font-black py-4 px-10 rounded-2xl border border-gray-200 shadow-md hover:bg-gray-50 transition text-lg"
                >
                    View Interview History
                </Link>
            </div>
        </div>
    );
};

export default InterviewFeedback;
