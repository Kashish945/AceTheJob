import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, Code } from 'lucide-react';
import { extractResumeData } from '../utils/resumeParser';

const SkillsEducation = ({ education: apiEducation, skills: apiSkills, resumeText }) => {
    // Use shared extraction logic as fallback
    const extractedData = useMemo(() => extractResumeData(resumeText), [resumeText]);
    
    const finalEducation = apiEducation?.length > 0 ? apiEducation : extractedData.education;
    const finalSkills = apiSkills?.length > 0 ? apiSkills : extractedData.skills;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            {/* Education - Left */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="bg-white p-8 rounded-3xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-gray-100 flex flex-col h-full relative overflow-hidden"
            >
                <div className="absolute top-0 right-0 w-32 h-32 bg-purple-50 rounded-bl-full opacity-50 -z-0"></div>
                <div className="mb-6 z-10">
                    <h3 className="text-lg font-bold text-gray-900 flex items-center tracking-tight">
                        <div className="bg-purple-100 p-2 rounded-xl mr-3 text-purple-600">
                            <GraduationCap className="w-5 h-5" strokeWidth={2.5} />
                        </div>
                        Education Background
                    </h3>
                </div>
                <div className="space-y-4 z-10">
                    {finalEducation.length > 0 ? (
                        finalEducation.map((edu, index) => (
                            <div
                                key={index}
                                className="relative pl-5 py-2 group"
                            >
                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-gray-100 rounded-full group-hover:bg-purple-400 transition-colors" />
                                <div className="absolute -left-[3px] top-4 w-2.5 h-2.5 rounded-full bg-white border-2 border-purple-400 shadow-[0_0_8px_rgba(168,85,247,0.4)] opacity-0 group-hover:opacity-100 transition-opacity" />
                                <p className="text-sm font-semibold text-gray-700 leading-relaxed">{edu}</p>
                            </div>
                        ))
                    ) : (
                        <div className="bg-gray-50 border border-gray-100 rounded-xl p-4">
                            <p className="text-gray-500 text-sm font-medium">Could not extract education automatically.</p>
                        </div>
                    )}
                </div>
            </motion.div>

            {/* Skills - Right */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="bg-white p-8 rounded-3xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-gray-100 flex flex-col h-full relative overflow-hidden"
            >
                <div className="absolute top-0 left-0 w-32 h-32 bg-blue-50 rounded-br-full opacity-50 -z-0"></div>
                <div className="mb-6 z-10">
                    <h3 className="text-lg font-bold text-gray-900 flex items-center tracking-tight">
                        <div className="bg-blue-100 p-2 rounded-xl mr-3 text-blue-600">
                            <Code className="w-5 h-5" strokeWidth={2.5} />
                        </div>
                        Technical Skills
                    </h3>
                </div>
                <div className="flex flex-wrap gap-2.5 content-start z-10">
                    {finalSkills.length > 0 ? (
                        finalSkills.map((skill, index) => (
                            <span
                                key={index}
                                className="bg-white border border-gray-200 text-gray-700 hover:text-blue-700 hover:border-blue-300 hover:bg-blue-50/50 px-4 py-1.5 rounded-full text-sm font-semibold shadow-[0_2px_10px_rgb(0,0,0,0.02)] transition-all cursor-default"
                            >
                                {skill}
                            </span>
                        ))
                    ) : (
                        <div className="w-full bg-gray-50 border border-gray-100 rounded-xl p-4">
                            <p className="text-gray-500 text-sm font-medium">Could not extract skills automatically.</p>
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    );
};

export default SkillsEducation;
