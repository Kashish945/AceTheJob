import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    UploadCloud,
    Target,
    Bot,
    LineChart,
    FileCheck,
    MessageSquare,
    Crosshair,
    TrendingUp,
    Briefcase
} from 'lucide-react';
import OnboardingIllustration from '../assets/Onboarding-bro.svg';

const Home = () => {

    const steps = [
        {
            number: "01",
            title: "Upload Your Resume",
            description: "Start by uploading your resume to get an instant ATS compatibility score and detailed SWOT analysis.",
            icon: UploadCloud
        },
        {
            number: "02",
            title: "Choose Your Role",
            description: "Select your target position, industry, and experience level for personalized interview preparation.",
            icon: Target
        },
        {
            number: "03",
            title: "Practice with AI",
            description: "Engage in realistic mock interviews with our AI that adapts questions based on your responses.",
            icon: Bot
        },
        {
            number: "04",
            title: "Review & Improve",
            description: "Get detailed feedback, track your progress, and continuously improve your interview skills.",
            icon: LineChart
        }
    ];

    const features = [
        {
            title: "AI Mock Interviews",
            description: "Practice with our AI interviewer that adapts to your experience level and target role.",
            icon: Bot,
            bgColor: "bg-blue-100",
            iconColor: "text-blue-600"
        },
        {
            title: "ATS Resume Scanner",
            description: "Get your resume scored against ATS systems and receive actionable improvement tips.",
            icon: FileCheck,
            bgColor: "bg-purple-100",
            iconColor: "text-purple-600"
        },
        {
            title: "Real-time Feedback",
            description: "Receive instant analysis of your answers with suggestions for improvement.",
            icon: MessageSquare,
            bgColor: "bg-indigo-100",
            iconColor: "text-indigo-600"
        },
        {
            title: "SWOT Analysis",
            description: "Understand your strengths, weaknesses, opportunities, and threats as a candidate.",
            icon: Crosshair,
            bgColor: "bg-pink-100",
            iconColor: "text-pink-600"
        },
        {
            title: "Progress Tracking",
            description: "Monitor your improvement over time with detailed analytics and insights.",
            icon: TrendingUp,
            bgColor: "bg-emerald-100",
            iconColor: "text-emerald-600"
        },
        {
            title: "Industry-Specific",
            description: "Tailored questions for tech, finance, healthcare, and more industries.",
            icon: Briefcase,
            bgColor: "bg-orange-100",
            iconColor: "text-orange-600"
        }
    ];

    return (
        <div className="relative flex flex-col min-h-screen pt-20 overflow-x-hidden">
            {/* Global Ambient Background Video & Gradients Wrapper */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
                <video
                    className="fixed w-full h-full object-cover opacity-[0.16]"
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

            {/* 1. Hero Section */}
            <section id="home" className="relative min-h-[90vh] flex items-center justify-center w-full z-10">

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex flex-col-reverse lg:flex-row items-center justify-between gap-12 lg:gap-8 py-16">

                    {/* Hero Text */}
                    <div className="w-full lg:w-1/2 flex flex-col items-center lg:items-start text-center lg:text-left z-10">

                        <motion.h1
                            className="text-5xl lg:text-6xl xl:text-7xl font-extrabold text-gray-900 tracking-tight mb-6 leading-[1.1]"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                        >
                            Ace the Job <br className="hidden md:block" />
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600">
                                You Deserve.
                            </span>
                        </motion.h1>

                        <motion.p
                            className="text-lg lg:text-xl text-gray-600 mb-10 max-w-2xl leading-relaxed"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                        >
                            Your journey to landing your dream role starts here. Practice with AI-driven mock interviews, beat ATS systems, and unlock your true potential today.
                        </motion.p>

                        <motion.div
                            className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                        >
                            <Link
                                to="/registration"
                                className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-xl shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:-translate-y-1 transition-all flex items-center justify-center gap-2"
                            >
                                Get Started Free <Bot className="w-5 h-5" />
                            </Link>
                        </motion.div>

                        <motion.div
                            className="mt-12 flex items-center gap-4 text-sm text-gray-500 font-medium"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5, delay: 0.5 }}
                        >
                            <div className="flex -space-x-3">
                                {[1, 2, 3, 4].map(i => (
                                    <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-gray-200 flex items-center justify-center text-xs overflow-hidden">
                                        <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i + 10}`} alt="user" />
                                    </div>
                                ))}
                            </div>
                            <p>Joined by 10,000+ top candidates worldwide.</p>
                        </motion.div>
                    </div>

                    {/* Hero Illustration */}
                    <motion.div
                        className="w-full lg:w-1/2 flex items-center justify-center z-10"
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                    >
                        <div className="relative w-full max-w-lg aspect-square flex items-center justify-center">
                            {/* Glowing halo behind illustration to make it feel integrated, not just pasted */}
                            <div className="absolute w-[80%] h-[80%] bg-gradient-to-tr from-blue-400/25 to-purple-400/25 rounded-full blur-3xl pointer-events-none animate-pulse"></div>

                            <img
                                src={OnboardingIllustration}
                                alt="AI Interview Illustration"
                                className="w-full h-full object-contain relative z-10 drop-shadow-xl select-none"
                            />
                        </div>
                    </motion.div>

                </div>
            </section>


            {/* 2. How it Works Section */}
            <section id="working" className="py-24 bg-transparent z-10 relative">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-3xl mx-auto mb-20">
                        <h2 className="text-sm font-bold tracking-wider text-blue-600 uppercase mb-3">Workflow</h2>
                        <h3 className="text-3xl md:text-5xl font-extrabold text-gray-900 tracking-tight mb-6">
                            How it works
                        </h3>
                        <p className="text-xl text-gray-600">
                            Get started in minutes and begin your journey to interview success.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
                        {/* Connecting Line (Desktop) */}
                        <div className="hidden lg:block absolute top-12 left-1/4 right-1/4 h-0.5 bg-gradient-to-r from-blue-100 via-indigo-200 to-purple-100 z-0"></div>

                        {steps.map((step, index) => (
                            <motion.div
                                key={index}
                                className="relative z-10 flex flex-col"
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                            >
                                <div className="mb-6 self-start md:self-center lg:self-start bg-transparent z-10 px-2 lg:px-0 lg:pr-6">
                                    <span className="text-6xl font-black bg-clip-text text-transparent bg-gradient-to-br from-blue-600 to-purple-600 block mb-2 drop-shadow-sm">{step.number}</span>
                                </div>
                                <h4 className="text-xl font-bold text-gray-900 mb-3">{step.title}</h4>
                                <p className="text-gray-600 leading-relaxed font-medium">
                                    {step.description}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>


            {/* 3. Merits / Features Section */}
            <section id="merits" className="py-24 bg-transparent border-t border-slate-100/50 relative overflow-hidden z-10">
                {/* Decorative blob */}
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-96 h-96 bg-purple-200/5 rounded-full blur-3xl -z-10 -mr-48"></div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-3xl mx-auto mb-20">
                        <div className="inline-flex items-center justify-center p-3 bg-white rounded-2xl shadow-sm mb-6 border border-gray-100">
                            <span className="text-sm font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 tracking-wider uppercase">
                                Features
                            </span>
                        </div>
                        <h3 className="text-3xl md:text-5xl font-extrabold text-gray-900 tracking-tight mb-6">
                            Everything you need to succeed
                        </h3>
                        <p className="text-xl text-gray-600">
                            Our comprehensive suite of tools ensures you're prepared for any interview scenario.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {features.map((feature, index) => {
                            const Icon = feature.icon;
                            return (
                                <motion.div
                                    key={index}
                                    className="relative bg-white rounded-[2rem] p-8 shadow-sm hover:shadow-xl hover:shadow-slate-100 hover:-translate-y-1.5 transition-all duration-300 border border-slate-100 group overflow-hidden"
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.4, delay: index * 0.05 }}
                                >
                                    {/* Subtle gradient background halo on hover */}
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-slate-50 to-slate-100/50 rounded-full blur-2xl pointer-events-none group-hover:scale-125 transition-transform duration-500"></div>

                                    {/* High-end Minimalist Icon Container */}
                                    <div className="relative mb-6 w-12 h-12 flex items-center justify-center">
                                        {/* Smooth soft colored background */}
                                        <div className={`absolute inset-0 rounded-2xl ${feature.bgColor} opacity-60 transition-transform duration-300 group-hover:scale-110`} />
                                        
                                        {/* Crisp Icon */}
                                        <Icon className={`relative w-6 h-6 ${feature.iconColor} transition-transform duration-300 group-hover:scale-105`} />
                                    </div>

                                    <h4 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h4>
                                    <p className="text-gray-600 leading-relaxed font-medium">
                                        {feature.description}
                                    </p>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </section>

        </div>
    );
};

export default Home;
