import React from 'react';
import { motion } from 'framer-motion';

const SWOTAnalysis = ({ swot }) => {
    const categories = [
        { title: 'Strengths', data: swot?.strengths, color: 'bg-green-50 text-green-800 border-green-200', titleColor: 'text-green-700' },
        { title: 'Weaknesses', data: swot?.weaknesses, color: 'bg-red-50 text-red-800 border-red-200', titleColor: 'text-red-700' },
        { title: 'Opportunities', data: swot?.opportunities, color: 'bg-blue-50 text-blue-800 border-blue-200', titleColor: 'text-blue-700' },
        { title: 'Threats', data: swot?.threats, color: 'bg-orange-50 text-orange-800 border-orange-200', titleColor: 'text-orange-700' },
    ];

    return (
        <div className="mt-12">
            <h2 className="text-xl font-bold text-gray-900 mb-6 tracking-tight flex items-center">
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">SWOT</span>
                <span className="ml-2">Analysis Snapshot</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {categories.map((cat, index) => (
                    <motion.div
                        key={cat.title}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-white p-6 rounded-2xl shadow-[0_2px_15px_rgb(0,0,0,0.03)] border border-gray-100 h-full flex flex-col group relative overflow-hidden transition-all hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:-translate-y-1"
                    >
                        {/* Subtle colored accent edge */}
                        <div className={`absolute top-0 left-0 w-1 h-full ${cat.color.split(' ')[0]} opacity-80`} />

                        <div className="flex items-center mb-4">
                            <h3 className={`text-sm font-bold uppercase tracking-widest ${cat.titleColor}`}>
                                {cat.title}
                            </h3>
                            <div className={`ml-3 flex-1 h-px ${cat.color.split(' ')[0].replace('bg-', 'bg-')}/20`} />
                        </div>

                        <ul className="space-y-3 flex-1">
                            {cat.data?.slice(0, 5).map((item, idx) => (
                                <li key={idx} className="flex items-start">
                                    <span className={`min-w-1.5 h-1.5 rounded-full mt-2 mr-3 ${cat.color.split(' ')[0].replace('bg-', 'bg-')}`} />
                                    <span className="text-sm font-medium text-gray-600 leading-relaxed">{item}</span>
                                </li>
                            )) || <div className="p-3 bg-gray-50 rounded-lg"><p className="text-sm text-gray-500 font-medium">None identified.</p></div>}

                            {cat.data?.length > 5 && (
                                <li className="text-xs font-semibold text-gray-400 mt-2 pl-4">
                                    + {cat.data.length - 5} additional points
                                </li>
                            )}
                        </ul>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default SWOTAnalysis;
