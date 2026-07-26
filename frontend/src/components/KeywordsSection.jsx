import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, CheckCircle } from 'lucide-react';
import { extractResumeData } from '../utils/resumeParser';

const KeywordsSection = ({ missingKeywords, presentKeywords: apiPresentKeywords, resumeText }) => {
    // Extract present keywords (skills) from resume text as fallback
    const { skills: extractedKeywords } = useMemo(() => extractResumeData(resumeText), [resumeText]);
    const presentKeywords = apiPresentKeywords?.length > 0 ? apiPresentKeywords : extractedKeywords;

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-12">
            {/* Missing Keywords */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-white p-8 rounded-3xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-gray-100 flex flex-col h-full relative overflow-hidden"
            >
                <div className="absolute top-0 right-0 w-32 h-32 bg-red-50 rounded-bl-full opacity-50 -z-0"></div>
                <div className="mb-6 z-10">
                    <h3 className="text-lg font-bold text-gray-900 flex items-center tracking-tight">
                        <div className="bg-red-50 p-2 rounded-xl mr-3 text-red-500">
                            <AlertCircle className="w-5 h-5" strokeWidth={2.5} />
                        </div>
                        Missing Keywords
                    </h3>
                    <p className="text-sm text-gray-500 mt-2 font-medium">Terms critical for ATS that were not found in your resume.</p>
                </div>

                <div className="flex flex-wrap gap-2.5 content-start z-10">
                    {missingKeywords?.length > 0 ? (
                        missingKeywords.map((keyword, index) => (
                            <span
                                key={index}
                                className="bg-white text-gray-700 hover:text-red-700 hover:border-red-200 px-4 py-2 rounded-xl text-sm font-semibold border border-gray-200 shadow-sm transition-colors cursor-default"
                            >
                                {keyword}
                            </span>
                        ))
                    ) : (
                        <div className="w-full bg-green-50/50 border border-green-100 rounded-xl p-4 text-center">
                            <p className="text-green-700 font-semibold text-sm">Perfect! No crucial keywords missing.</p>
                        </div>
                    )}
                </div>
            </motion.div>

            {/* Present Keywords */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: 0.1 }}
                className="bg-white p-8 rounded-3xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-gray-100 flex flex-col h-full relative overflow-hidden"
            >
                <div className="absolute top-0 left-0 w-32 h-32 bg-green-50 rounded-br-full opacity-50 -z-0"></div>
                <div className="mb-6 z-10">
                    <h3 className="text-lg font-bold text-gray-900 flex items-center tracking-tight">
                        <div className="bg-emerald-50 p-2 rounded-xl mr-3 text-emerald-600">
                            <CheckCircle className="w-5 h-5" strokeWidth={2.5} />
                        </div>
                        Optimized Keywords
                    </h3>
                    <p className="text-sm text-gray-500 mt-2 font-medium">Key terms successfully identified by the ATS scanner.</p>
                </div>

                <div className="flex flex-wrap gap-2.5 content-start z-10">
                    {presentKeywords?.length > 0 ? (
                        presentKeywords.map((keyword, index) => (
                            <span
                                key={index}
                                className="bg-slate-50 text-slate-700 hover:text-emerald-700 hover:border-emerald-200 px-4 py-2 rounded-xl text-sm font-semibold border border-slate-200 shadow-sm transition-colors cursor-default"
                            >
                                {keyword}
                            </span>
                        ))
                    ) : (
                        <p className="text-gray-400 italic text-sm font-medium">No significant keywords extracted.</p>
                    )}
                </div>
            </motion.div>
        </div>
    );
};

export default KeywordsSection;
