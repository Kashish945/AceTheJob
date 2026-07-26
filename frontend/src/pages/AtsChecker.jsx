import { AnimatePresence, motion } from 'framer-motion';
import React, { useState } from 'react';
import UploadSection from '../components/UploadSection';
import ATSScore from '../components/ATSScore';
import KeywordsSection from '../components/KeywordsSection';
import SkillsEducation from '../components/SkillsEducation';
import SWOTAnalysis from '../components/SWOTAnalysis';
import JobRecommendations from '../components/JobRecommendations';
import { analyzeResume } from '../services/api';
import { extractText } from '../utils/textExtractor';

const AtsChecker = () => {
    const [analysisResult, setAnalysisResult] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isUploaded, setIsUploaded] = useState(false);

    const handleAnalyze = async ({ file, jobRole, jobDescription }) => {
        setIsLoading(true);
        setAnalysisResult(null);
        try {
            const text = await extractText(file);
            const data = await analyzeResume({
                resumeText: text,
                jobRole,
                jobDescription,
            });
            setAnalysisResult(data);
            setIsUploaded(true);
        } catch (error) {
            console.error('Analysis failed:', error);
            alert('Analysis failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen font-sans pb-8">
            <main className="w-full xl:max-w-[90rem] 2xl:max-w-full mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 pt-6">

                {isUploaded && (
                    <div className="flex justify-end mb-4">
                        <button
                            onClick={() => { setIsUploaded(false); setAnalysisResult(null); }}
                            className="text-sm font-medium text-blue-600 hover:text-blue-800 bg-blue-50 px-4 py-2 rounded-lg"
                        >
                            Analyze Another Resume
                        </button>
                    </div>
                )}

                <AnimatePresence mode="wait">
                    {!isUploaded ? (
                        <div className="flex justify-center min-h-[calc(100vh-120px)] pt-6 md:pt-10">
                            <motion.div
                                key="upload"
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.3 }}
                                className="bg-white p-8 md:p-12 rounded-3xl shadow-[0_4px_24px_rgba(0,0,0,0.03)] border border-gray-100 w-full max-w-5xl mx-auto h-fit"
                            >
                                <UploadSection onAnalyze={handleAnalyze} isLoading={isLoading} />
                            </motion.div>
                        </div>
                    ) : (
                        <motion.div
                            key="atschecker"
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="space-y-8"
                        >
                            {/* 1. ATS Score Section - Full Width/Centered */}
                            <div className="w-full">
                                <ATSScore score={analysisResult.atsScore || 0} />
                            </div>

                            {/* 2. Keywords Section */}
                            <KeywordsSection
                                missingKeywords={analysisResult.missingKeywords}
                                presentKeywords={analysisResult.presentKeywords}
                                resumeText={analysisResult.resumeText}
                            />

                            {/* 3. Education & Skills Section */}
                            <SkillsEducation 
                                education={analysisResult.education}
                                skills={analysisResult.skills}
                                resumeText={analysisResult.resumeText} 
                            />

                            {/* 4. SWOT Analysis Section */}
                            <SWOTAnalysis swot={analysisResult.swot} />

                            {/* 5. Analysis History & Recommendations */}
                            <JobRecommendations />
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>
        </div>
    );
};

export default AtsChecker;
