import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, FileText, X, Loader2 } from 'lucide-react';
import siteStatsImg from '../assets/Site Stats-amico-new.svg';

const UploadSection = ({ onAnalyze, isLoading }) => {
    const [file, setFile] = useState(null);
    const [jobRole, setJobRole] = useState('');
    const [jobDescription, setJobDescription] = useState('');

    const onDrop = useCallback((acceptedFiles) => {
        if (acceptedFiles?.length) {
            setFile(acceptedFiles[0]);
        }
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'application/pdf': ['.pdf'],
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
            'text/plain': ['.txt'],
        },
        multiple: false,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (file && jobRole) {
            onAnalyze({ file, jobRole, jobDescription });
        }
    };

    const removeFile = (e) => {
        e.stopPropagation();
        setFile(null);
    };

    return (
        <div className="flex flex-col md:flex-row items-center justify-center min-h-[30vh] md:min-h-[50vh] pt-2 gap-6 md:gap-12 max-w-5xl mx-auto w-full px-4">
            {/* Upload Box (Left Side) */}
            <motion.div
                initial={{ opacity: 0, x: -20, scale: 0.95 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                className="w-full max-w-lg bg-white rounded-xl shadow-xl overflow-hidden border border-gray-100 flex-1"
            >
                <div className="p-8">
                    <div className="text-center mb-6">
                        <span className="text-[32px] md:text-[36px] font-black tracking-tight select-none">
                            <span className="text-[#0b1120]">Resume</span>
                            <span className="text-[#4353ff]">Analyzer</span>
                            <span className="text-[#2563eb]">.</span>
                        </span>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4"> {/* Reduced spacing */}
                        {/* Drag & Drop Area - Reduced Height */}
                        <div
                            {...getRootProps()}
                            className={`relative border-2 border-dashed rounded-lg p-6 transition-colors cursor-pointer min-h-[160px] flex flex-col items-center justify-center ${isDragActive
                                ? 'border-blue-500 bg-blue-50'
                                : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
                                }`}
                        >
                            <input {...getInputProps()} />
                            {!file ? (
                                <div className="flex flex-col items-center justify-center text-center space-y-2">
                                    <div className="p-2 bg-blue-100 rounded-full">
                                        <Upload className="w-5 h-5 text-blue-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-700">
                                            {isDragActive ? 'Drop here' : 'Click/Drag Resume'}
                                        </p>
                                        <p className="text-xs text-gray-400">PDF, DOCX, TXT</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex items-center space-x-2 w-full justify-center">
                                    <div className="p-2 bg-green-100 rounded-full">
                                        <FileText className="w-5 h-5 text-green-600" />
                                    </div>
                                    <span className="text-sm font-medium text-gray-700 truncate max-w-[200px]">
                                        {file.name}
                                    </span>
                                    <button
                                        type="button"
                                        onClick={removeFile}
                                        className="p-1 hover:bg-red-100/50 rounded-full text-gray-400 hover:text-red-500 transition-colors"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Inputs - reduced height */}
                        <div className="grid grid-cols-1 gap-3">
                            <div>
                                <input
                                    type="text"
                                    required
                                    value={jobRole}
                                    onChange={(e) => setJobRole(e.target.value)}
                                    placeholder="Target Job Role (e.g. Developer)"
                                    className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-gray-400"
                                />
                            </div>
                            <div>
                                <textarea
                                    value={jobDescription}
                                    onChange={(e) => setJobDescription(e.target.value)}
                                    placeholder="Job Description (Optional)"
                                    rows={2} // Reduced rows
                                    className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none placeholder:text-gray-400"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={!file || !jobRole || isLoading}
                            className={`w-full py-2.5 rounded-lg font-semibold text-white shadow-md transition-all text-sm ${!file || !jobRole || isLoading
                                ? 'bg-gray-400 cursor-not-allowed'
                                : 'bg-blue-600 hover:bg-blue-700 hover:shadow-lg active:scale-[0.99]'
                                }`}
                        >
                            {isLoading ? (
                                <div className="flex items-center justify-center space-x-2">
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    <span>Analyzing...</span>
                                </div>
                            ) : (
                                'Analyze Resume'
                            )}
                        </button>
                    </form>
                </div>
            </motion.div>

            {/* Illustration (Right Side) */}
            <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="hidden md:flex flex-1 justify-center items-center"
            >
                <img src={siteStatsImg} alt="Site Stats Illustration" className="w-full max-w-[320px] drop-shadow-xl" />
            </motion.div>
        </div>
    );
};

export default UploadSection;
