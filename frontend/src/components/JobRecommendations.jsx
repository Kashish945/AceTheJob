import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Briefcase, Calendar, ChevronRight } from 'lucide-react';
import { getHistory } from '../services/api';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';

const JobRecommendations = () => {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const data = await getHistory();
                setHistory(data);
            } catch (error) {
                console.error('Failed to fetch history', error);
            } finally {
                setLoading(false);
            }
        };

        fetchHistory();
    }, []);

    if (loading) return <div className="text-center py-8">Loading history...</div>;
    if (!history.length) return null;

    return (
        <div className="mt-12">
            <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-bold text-gray-900 tracking-tight flex items-center">
                    <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">Analysis</span>
                    <span className="ml-2">History & Recommendations</span>
                </h2>
                <div className="hidden md:flex items-center text-sm font-medium text-blue-600 bg-blue-50 px-4 py-1.5 rounded-full cursor-pointer hover:bg-blue-100 transition-colors">
                    View All <ChevronRight className="w-4 h-4 ml-1" />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {history.slice(0, 4).map((item, index) => (
                    <motion.div
                        key={item._id}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.05 }}
                        className="bg-white rounded-2xl shadow-[0_2px_15px_rgb(0,0,0,0.03)] border border-gray-100 p-5 hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:-translate-y-1 transition-all flex flex-col group cursor-pointer relative overflow-hidden"
                    >
                        {/* Status bar */}
                        <div className={`absolute top-0 left-0 w-full h-1 ${(item.matchPercentage || item.atsScore) >= 80 ? 'bg-emerald-500' : 'bg-amber-400'}`} />

                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="font-bold text-gray-900 text-lg group-hover:text-blue-600 transition-colors line-clamp-1">
                                    {item.jobRole}
                                </h3>
                                <span className="flex items-center text-gray-400 text-xs font-semibold mt-1">
                                    <Calendar className="w-3.5 h-3.5 mr-1" strokeWidth={2.5} />
                                    {new Date(item.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                </span>
                            </div>

                            <div className="w-12 h-12 flex-shrink-0 bg-gray-50 rounded-full p-1 border border-gray-100">
                                <CircularProgressbar
                                    value={item.matchPercentage || item.atsScore || 0}
                                    text={`${item.matchPercentage || item.atsScore || 0}`}
                                    styles={buildStyles({
                                        textSize: '28px',
                                        pathColor: (item.matchPercentage || item.atsScore) >= 80 ? '#10b981' : '#fbbf24',
                                        textColor: '#1f2937',
                                        trailColor: 'transparent',
                                    })}
                                />
                            </div>
                        </div>

                        <div className="mt-auto bg-gray-50 p-3 rounded-xl border border-gray-100/80">
                            <p className="text-sm text-gray-600 font-medium line-clamp-2 leading-relaxed">
                                <Briefcase className="w-4 h-4 inline-block mr-1.5 text-gray-400 -mt-0.5" />
                                {item.suggestions?.[0] || 'View full detailed analysis report.'}
                            </p>
                        </div>
                    </motion.div>
                ))}
            </div>

            {history.length > 4 && (
                <div className="mt-6 text-center md:hidden">
                    <button className="text-sm font-semibold text-blue-600 bg-blue-50 px-6 py-2.5 rounded-full w-full">
                        View All History
                    </button>
                </div>
            )}
        </div>
    );
};

export default JobRecommendations;
