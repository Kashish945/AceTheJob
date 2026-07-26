import React from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { motion } from 'framer-motion';

const ATSScore = ({ score }) => {
    // Determine color based on score
    const getColor = (s) => {
        if (s >= 80) return '#22c55e'; // Green
        if (s >= 60) return '#eab308'; // Yellow
        return '#ef4444'; // Red
    };

    const color = getColor(score);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative overflow-hidden bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 p-6 sm:p-8 md:p-10 rounded-3xl shadow-2xl flex flex-row items-center justify-between"
        >
            {/* Glassmorphic decorative elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-500 opacity-20 rounded-full blur-2xl translate-y-1/3 -translate-x-1/3"></div>

            <div className="flex-1 text-left relative z-10 pr-4 sm:pr-6 md:pr-8">
                <h3 className="text-xs sm:text-sm font-bold text-blue-200 uppercase tracking-[0.1em] sm:tracking-[0.2em] mb-1 sm:mb-2">Analysis Result</h3>
                <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-white mb-2 sm:mb-4 tracking-tight">Total Match Score</h2>
                <p className="text-blue-100/80 font-medium text-xs sm:text-sm md:text-lg max-w-md leading-relaxed hidden sm:block">
                    {score >= 80
                        ? 'Outstanding! Your resume is highly optimized and matches the job requirements perfectly.'
                        : score >= 60
                            ? 'Good effort. Some structural or keyword improvements are needed to pass strict ATS filters.'
                            : 'Needs significant attention. Missing key requirements that will trigger immediate rejection.'}
                </p>
                <p className="text-blue-100/80 font-medium text-xs leading-relaxed sm:hidden">
                    {score >= 80 ? 'Highly optimized!' : score >= 60 ? 'Improvements needed.' : 'Needs attention.'}
                </p>
            </div>

            <div className="relative z-10 w-24 h-24 sm:w-32 sm:h-32 md:w-52 md:h-52 flex-shrink-0 filter drop-shadow-[0_0_15px_rgba(255,255,255,0.1)] p-2 sm:p-3 md:p-4 rounded-full bg-white/5 backdrop-blur-sm border border-white/10">
                <CircularProgressbar
                    value={score}
                    text={`${score}%`}
                    styles={buildStyles({
                        pathColor: color,
                        textColor: '#ffffff',
                        trailColor: 'rgba(255,255,255,0.1)',
                        textSize: '24px',
                        pathTransitionDuration: 1.5,
                        strokeLinecap: 'round'
                    })}
                />
            </div>
        </motion.div>
    );
};

export default ATSScore;
