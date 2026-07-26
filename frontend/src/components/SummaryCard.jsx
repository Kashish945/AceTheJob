import React from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, CheckCircle } from 'lucide-react';

const SummaryCard = ({ suggestions, missingKeywords }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Suggestions / Summary */}
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                className="bg-white p-6 rounded-2xl shadow-lg border border-indigo-50"
            >
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                    <CheckCircle className="w-5 h-5 text-indigo-600 mr-2" />
                    Improvement Suggestions
                </h3>
                <ul className="space-y-3">
                    {suggestions?.map((item, index) => (
                        <li key={index} className="flex items-start text-gray-600 text-sm">
                            <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full mt-1.5 mr-2 flex-shrink-0" />
                            {item}
                        </li>
                    )) || <p className="text-gray-500 italic">No suggestions available.</p>}
                </ul>
            </motion.div>

            {/* Missing Keywords */}
            <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                className="bg-white p-6 rounded-2xl shadow-lg border border-red-50"
            >
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                    <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
                    Missing Keywords
                </h3>
                <div className="flex flex-wrap gap-2">
                    {missingKeywords?.map((keyword, index) => (
                        <span
                            key={index}
                            className="bg-red-50 text-red-700 px-3 py-1 rounded-full text-sm font-medium border border-red-100"
                        >
                            {keyword}
                        </span>
                    )) || <p className="text-gray-500 italic">No missing keywords detected.</p>}
                </div>
            </motion.div>
        </div>
    );
};

export default SummaryCard;
