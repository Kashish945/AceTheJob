import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Loader2, Settings, Star, Zap, Flame, ArrowLeft } from 'lucide-react';
import { FaPython, FaJava, FaReact, FaRobot } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { createInterview } from '../services/api';

const domains = [
    { id: 'python', label: 'Python Developer', icon: FaPython, color: 'text-[#3776AB]', bg: 'bg-[#3776AB]/10', border: 'border-[#3776AB]/30' },
    { id: 'java', label: 'Java Developer', icon: FaJava, color: 'text-[#007396]', bg: 'bg-[#007396]/10', border: 'border-[#007396]/30' },
    { id: 'ml', label: 'Machine Learning', icon: FaRobot, color: 'text-purple-600', bg: 'bg-purple-100', border: 'border-purple-300' },
    { id: 'fullstack', label: 'Full Stack Developer', icon: FaReact, color: 'text-[#61DAFB]', bg: 'bg-[#61DAFB]/10', border: 'border-[#61DAFB]/30' },
    { id: 'custom', label: 'Custom Domain', icon: Settings, color: 'text-gray-600', bg: 'bg-gray-100', border: 'border-gray-300' },
];

const difficulties = [
    { id: 'Beginner', label: 'Beginner', desc: '0-2 years experience', icon: Star, color: 'text-green-500', bg: 'bg-green-50', border: 'border-green-200' },
    { id: 'Intermediate', label: 'Intermediate', desc: '3-5 years experience', icon: Zap, color: 'text-yellow-500', bg: 'bg-yellow-50', border: 'border-yellow-200' },
    { id: 'Advanced', label: 'Advanced', desc: '5+ years experience', icon: Flame, color: 'text-red-500', bg: 'bg-red-50', border: 'border-red-200' },
];

const MockInterview = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    
    // Progressive Form State
    const [step, setStep] = useState(1);
    const [selectedDomainId, setSelectedDomainId] = useState('');
    const [customDomain, setCustomDomain] = useState('');
    const [experience, setExperience] = useState('');
    const [jobDescription, setJobDescription] = useState('');

    const handleDomainSelect = (id) => {
        setSelectedDomainId(id);
        if (id !== 'custom') {
            setStep(2);
        }
    };

    const handleCustomDomainNext = () => {
        if (customDomain.trim()) {
            setStep(2);
        }
    };

    const handleDifficultySelect = (level) => {
        setExperience(level);
        setStep(3);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const finalDomain = selectedDomainId === 'custom' 
            ? customDomain.trim() 
            : domains.find(d => d.id === selectedDomainId)?.label;

        if (!finalDomain || !experience) {
            setError("Please complete all required steps.");
            return;
        }

        setIsLoading(true);
        setError(null);
        try {
            const response = await createInterview(
                finalDomain,
                jobDescription,
                experience
            );
            
            if (response.success && response.interview) {
                navigate(`/interview/${response.interview._id}`, {
                    state: { interview: response.interview }
                });
            } else {
                setError("Failed to create interview. Please try again.");
                setIsLoading(false);
            }
        } catch (err) {
            console.error("Error creating interview:", err);
            setError(err.response?.data?.message || "An error occurred while generating questions.");
            setIsLoading(false);
        }
    };

    return (
        <div className="px-4 sm:px-8 pt-4 pb-8 max-w-2xl mx-auto h-full flex flex-col justify-center">
            {/* AceTheJob style Heading */}
            <header className="mb-6 text-center">
                <span className="text-[32px] md:text-[36px] font-black tracking-tight select-none">
                    <span className="text-[#0b1120]">Mock</span>
                    <span className="text-[#4353ff]">Interview</span>
                    <span className="text-[#2563eb]">.</span>
                </span>
            </header>

            <form onSubmit={handleSubmit} className="relative z-10 w-full">
                {error && (
                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-xl text-sm mb-6 text-center font-medium">
                        {error}
                    </motion.div>
                )}

                <AnimatePresence mode="wait">
                    {/* Step 1: Domain Selection */}
                    {step === 1 && (
                        <motion.div
                            key="step1"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            className="bg-white rounded-3xl p-6 md:p-8 shadow-[0_4px_24px_rgba(0,0,0,0.02)] border border-gray-100"
                        >
                            <h2 className="text-lg font-bold text-gray-800 mb-6 flex items-center">
                                <span className="bg-blue-100 text-blue-600 w-8 h-8 rounded-full flex items-center justify-center mr-3 text-sm">1</span>
                                Select Domain
                            </h2>
                            
                            <div className="flex flex-col gap-3">
                                {domains.map(d => (
                                    <button 
                                        key={d.id} 
                                        type="button" 
                                        onClick={() => handleDomainSelect(d.id)} 
                                        className={`p-4 rounded-xl border-2 flex items-center transition-all ${selectedDomainId === d.id ? `${d.border} ${d.bg} shadow-sm ring-2 ring-blue-500/20` : 'border-gray-100 hover:border-gray-300 hover:bg-gray-50'}`}
                                    >
                                        <div className={`w-12 h-12 rounded-xl ${d.bg} flex items-center justify-center mr-4`}>
                                            <d.icon className={d.color} size={24} />
                                        </div>
                                        <h3 className={`font-bold text-lg ${selectedDomainId === d.id ? 'text-gray-900' : 'text-gray-700'}`}>{d.label}</h3>
                                    </button>
                                ))}
                            </div>

                            <AnimatePresence>
                                {selectedDomainId === 'custom' && (
                                    <motion.div 
                                        initial={{ opacity: 0, height: 0 }} 
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="mt-4 overflow-hidden"
                                    >
                                        <div className="flex flex-col sm:flex-row gap-3 pt-2">
                                            <input 
                                                type="text" 
                                                placeholder="Enter your custom domain or role..." 
                                                className="flex-1 px-4 py-3.5 rounded-xl border-2 border-gray-200 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-medium text-gray-800"
                                                value={customDomain}
                                                onChange={e => setCustomDomain(e.target.value)}
                                                onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleCustomDomainNext())}
                                            />
                                            <button 
                                                type="button"
                                                disabled={!customDomain.trim()}
                                                onClick={handleCustomDomainNext}
                                                className="px-8 py-3.5 bg-gray-900 text-white font-bold rounded-xl disabled:opacity-50 hover:bg-gray-800 transition-colors"
                                            >
                                                Next
                                            </button>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    )}

                    {/* Step 2: Difficulty Selection */}
                    {step === 2 && (
                        <motion.div
                            key="step2"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            className="bg-white rounded-3xl p-6 md:p-8 shadow-[0_4px_24px_rgba(0,0,0,0.02)] border border-gray-100"
                        >
                            <div className="flex items-center mb-6">
                                <button type="button" onClick={() => setStep(1)} className="p-2 mr-3 rounded-full hover:bg-gray-100 text-gray-500 transition-colors">
                                    <ArrowLeft size={20} />
                                </button>
                                <h2 className="text-lg font-bold text-gray-800 flex items-center">
                                    <span className="bg-indigo-100 text-indigo-600 w-8 h-8 rounded-full flex items-center justify-center mr-3 text-sm">2</span>
                                    Select Experience Level
                                </h2>
                            </div>
                            
                            <div className="flex flex-col gap-3">
                                {difficulties.map(d => (
                                    <button 
                                        key={d.id} 
                                        type="button" 
                                        onClick={() => handleDifficultySelect(d.id)} 
                                        className={`p-4 rounded-xl border-2 flex items-center transition-all ${experience === d.id ? `${d.border} ${d.bg} shadow-sm ring-2 ring-indigo-500/20` : 'border-gray-100 hover:border-gray-300 hover:bg-gray-50'}`}
                                    >
                                        <div className={`w-12 h-12 rounded-xl ${d.bg} flex items-center justify-center mr-4`}>
                                            <d.icon className={d.color} size={20} />
                                        </div>
                                        <div className="text-left flex-1">
                                            <h3 className={`font-bold text-base ${experience === d.id ? 'text-gray-900' : 'text-gray-700'}`}>{d.label}</h3>
                                            <p className="text-sm text-gray-500 mt-0.5 font-medium">{d.desc}</p>
                                        </div>
                                        {experience === d.id && <div className="w-3 h-3 rounded-full bg-indigo-500 ml-2"></div>}
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* Step 3: Job Description & Submit */}
                    {step === 3 && (
                        <motion.div
                            key="step3"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            className="bg-white rounded-3xl p-6 md:p-8 shadow-[0_4px_24px_rgba(0,0,0,0.02)] border border-gray-100"
                        >
                            <div className="flex items-center mb-6">
                                <button type="button" onClick={() => setStep(2)} className="p-2 mr-3 rounded-full hover:bg-gray-100 text-gray-500 transition-colors">
                                    <ArrowLeft size={20} />
                                </button>
                                <h2 className="text-lg font-bold text-gray-800 flex items-center">
                                    <span className="bg-purple-100 text-purple-600 w-8 h-8 rounded-full flex items-center justify-center mr-3 text-sm">3</span>
                                    Final Details
                                </h2>
                            </div>
                            
                            <div className="mb-8">
                                <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center">
                                    <FileText size={16} className="mr-2 text-indigo-500" />
                                    Job Description (Optional)
                                </label>
                                <textarea
                                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none bg-gray-50 resize-y text-sm font-medium text-gray-800 placeholder:text-gray-400"
                                    rows="6"
                                    placeholder="Paste the job description here to tailor your mock interview questions specifically to the role..."
                                    value={jobDescription}
                                    onChange={(e) => setJobDescription(e.target.value)}
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-4 px-8 rounded-xl hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-300 transform hover:-translate-y-0.5 disabled:opacity-70 disabled:transform-none flex items-center justify-center space-x-2"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="animate-spin" size={20} />
                                        <span>Generating Questions...</span>
                                    </>
                                ) : (
                                    <span>Start Interview Session</span>
                                )}
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </form>
        </div>
    );
};

export default MockInterview;
