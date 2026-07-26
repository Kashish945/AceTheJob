import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../services/api';
import { Loader2, Mail, Lock } from 'lucide-react';

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await login(formData.email, formData.password);
            window.location.href = '/dashboard';
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative min-h-screen w-full flex items-center justify-center p-4 pt-20 overflow-hidden">
            {/* Ambient Background Video Wrapper */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <video
                    className="w-full h-full object-cover opacity-[0.2]"
                    src="/images/first.mp4"
                    autoPlay
                    loop
                    muted
                    playsInline
                />
                <div className="absolute inset-0 bg-slate-50/80 backdrop-blur-[2px]"></div>
            </div>

            <div className="max-w-5xl w-full bg-white/90 backdrop-blur-xl rounded-[2rem] flex flex-col md:flex-row relative shadow-[0_8px_40px_rgba(0,0,0,0.08)] min-h-[600px] overflow-hidden border border-white z-10">
                
                {/* Background Illustration covering the left side */}
                <div className="absolute inset-0 pointer-events-none flex items-center justify-start p-8 opacity-90">
                    <img 
                        src="/images/auth_illustration.png" 
                        alt="Illustration" 
                        className="max-w-[55%] max-h-full object-contain object-left-bottom mix-blend-multiply" 
                    />
                </div>

                {/* Form Side (Right Aligned) */}
                <div className="w-full md:w-1/2 md:ml-auto p-4 sm:p-8 flex items-center justify-center relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                        className="w-full max-w-[380px] bg-white rounded-[2rem] shadow-[0_8px_30px_rgba(0,0,0,0.06)] p-8 sm:p-10 border border-gray-50"
                    >
                        <div className="mb-8">
                            <h2 className="text-3xl font-bold text-gray-900 mb-2 leading-tight">
                                Lets<br/>Start Learning
                            </h2>
                            <p className="text-gray-500 text-sm font-medium">
                                Please login to continue
                            </p>
                        </div>

                        {error && (
                            <div className="bg-red-50 text-red-600 p-3 rounded-xl mb-6 text-sm text-center font-medium">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="email"
                                    required
                                    className="w-full pl-12 pr-4 py-3.5 bg-[#F8F9FA] border border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all outline-none text-gray-700 text-sm font-medium placeholder-gray-400"
                                    placeholder="Your Email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>

                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="password"
                                    required
                                    className="w-full pl-12 pr-4 py-3.5 bg-[#F8F9FA] border border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all outline-none text-gray-700 text-sm font-medium placeholder-gray-400"
                                    placeholder="Your Password"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3.5 rounded-2xl font-bold transition-colors flex justify-center items-center mt-2 disabled:opacity-70 shadow-md shadow-blue-500/20"
                            >
                                {loading ? <Loader2 className="animate-spin w-5 h-5" /> : 'Login'}
                            </button>
                        </form>

                        <div className="mt-8 text-center">
                            <p className="text-gray-500 text-xs font-semibold">
                                Don't Have An Account?{' '}
                                <Link to="/registration" className="text-gray-900 font-bold hover:underline">
                                    Sign Up
                                </Link>
                            </p>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default Login;
