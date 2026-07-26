import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { register, verifyOtp } from '../services/api';
import { Loader2, Mail, Lock, User, GraduationCap, ShieldCheck, ArrowRight } from 'lucide-react';

const Register = () => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({ name: '', email: '', password: '', education: '' });
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const otpRefs = useRef([]);

    const handleRegisterSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const res = await register(formData.name, formData.email, formData.password, formData.education);
            if (res.requiresOtp) {
                setStep(2);
            } else {
                window.location.href = '/login';
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    const handleOtpChange = (index, value) => {
        if (isNaN(value)) return;
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        // Auto-focus next input
        if (value !== '' && index < 5) {
            otpRefs.current[index + 1]?.focus();
        }
    };

    const handleOtpKeyDown = (index, e) => {
        if (e.key === 'Backspace' && otp[index] === '' && index > 0) {
            otpRefs.current[index - 1]?.focus();
        }
    };

    const handleVerifySubmit = async (e) => {
        e.preventDefault();
        const otpString = otp.join('');
        if (otpString.length < 6) {
            setError('Please enter all 6 digits.');
            return;
        }
        setError('');
        setLoading(true);
        try {
            await verifyOtp(formData.email, otpString);
            window.location.href = '/dashboard';
        } catch (err) {
            setError(err.response?.data?.message || 'Verification failed. Please check your OTP.');
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
                <div className="absolute inset-0 pointer-events-none flex items-center justify-start p-8 opacity-90 transition-all duration-700">
                    {step === 1 ? (
                        <img 
                            src="/images/auth_illustration.png" 
                            alt="Illustration" 
                            className="max-w-[55%] max-h-full object-contain object-left-bottom mix-blend-multiply" 
                        />
                    ) : (
                        <img 
                            src="/images/mailman.png" 
                            alt="Verify Mail" 
                            className="max-w-[55%] max-h-full object-contain object-center mix-blend-multiply opacity-80 pl-10" 
                        />
                    )}
                </div>

                {/* Form Side (Right Aligned) */}
                <div className="w-full md:w-1/2 md:ml-auto p-4 sm:p-8 flex items-center justify-center relative z-10">
                    <AnimatePresence mode="wait">
                        {step === 1 && (
                            <motion.div
                                key="register-form"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.4 }}
                                className="w-full max-w-[380px] bg-white rounded-[2rem] shadow-[0_8px_30px_rgba(0,0,0,0.06)] p-8 sm:p-10 border border-gray-50"
                            >
                                <div className="mb-6">
                                    <h2 className="text-3xl font-bold text-gray-900 mb-2 leading-tight">
                                        Lets<br/>Start Learning
                                    </h2>
                                    <p className="text-gray-500 text-sm font-medium">
                                        Please sign up to continue
                                    </p>
                                </div>

                                {error && (
                                    <div className="bg-red-50 text-red-600 p-3 rounded-xl mb-4 text-sm text-center font-medium">
                                        {error}
                                    </div>
                                )}

                                <form onSubmit={handleRegisterSubmit} className="space-y-3">
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <User className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            type="text"
                                            required
                                            className="w-full pl-12 pr-4 py-3 bg-[#F8F9FA] border border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all outline-none text-gray-700 text-sm font-medium placeholder-gray-400"
                                            placeholder="Your Full Name"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        />
                                    </div>

                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <Mail className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            type="email"
                                            required
                                            className="w-full pl-12 pr-4 py-3 bg-[#F8F9FA] border border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all outline-none text-gray-700 text-sm font-medium placeholder-gray-400"
                                            placeholder="Your Email"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        />
                                    </div>

                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <GraduationCap className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            type="text"
                                            placeholder="Education (e.g., BSc CS)"
                                            className="w-full pl-12 pr-4 py-3 bg-[#F8F9FA] border border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all outline-none text-gray-700 text-sm font-medium placeholder-gray-400"
                                            value={formData.education}
                                            onChange={(e) => setFormData({ ...formData, education: e.target.value })}
                                        />
                                    </div>

                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <Lock className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            type="password"
                                            required
                                            className="w-full pl-12 pr-4 py-3 bg-[#F8F9FA] border border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all outline-none text-gray-700 text-sm font-medium placeholder-gray-400"
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
                                        {loading ? <Loader2 className="animate-spin w-5 h-5" /> : 'Sign Up'}
                                    </button>
                                </form>

                                <div className="mt-6 text-center">
                                    <p className="text-gray-500 text-xs font-semibold">
                                        Already Have An Account?{' '}
                                        <Link to="/login" className="text-gray-900 font-bold hover:underline">
                                            Login
                                        </Link>
                                    </p>
                                </div>
                            </motion.div>
                        )}

                        {step === 2 && (
                            <motion.div
                                key="otp-form"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.4 }}
                                className="w-full max-w-[380px] bg-white rounded-[2rem] shadow-[0_8px_30px_rgba(0,0,0,0.06)] p-8 sm:p-10 border border-gray-50 flex flex-col items-center"
                            >
                                <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-6 shadow-inner">
                                    <ShieldCheck className="w-8 h-8 text-blue-600" />
                                </div>
                                <div className="mb-8 text-center">
                                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                                        Check Your Mail
                                    </h2>
                                    <p className="text-gray-500 text-sm font-medium leading-relaxed">
                                        We've sent a 6-digit verification code to <br/>
                                        <span className="font-bold text-gray-800">{formData.email}</span>
                                    </p>
                                </div>

                                {error && (
                                    <div className="bg-red-50 text-red-600 w-full p-3 rounded-xl mb-6 text-sm text-center font-medium">
                                        {error}
                                    </div>
                                )}

                                <form onSubmit={handleVerifySubmit} className="w-full space-y-8">
                                    <div className="flex justify-between gap-2">
                                        {otp.map((digit, idx) => (
                                            <input
                                                key={idx}
                                                ref={el => otpRefs.current[idx] = el}
                                                type="text"
                                                maxLength={1}
                                                value={digit}
                                                onChange={(e) => handleOtpChange(idx, e.target.value)}
                                                onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                                                className="w-12 h-14 text-center text-xl font-black bg-[#F8F9FA] border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:bg-white focus:border-transparent transition-all outline-none text-gray-800 shadow-sm"
                                            />
                                        ))}
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={loading || otp.join('').length < 6}
                                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3.5 rounded-2xl font-bold transition-all flex justify-center items-center group disabled:opacity-50 shadow-md shadow-blue-500/20"
                                    >
                                        {loading ? (
                                            <Loader2 className="animate-spin w-5 h-5" />
                                        ) : (
                                            <>
                                                Verify Account
                                                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                            </>
                                        )}
                                    </button>
                                </form>

                                <div className="mt-8 text-center">
                                    <p className="text-gray-500 text-xs font-semibold">
                                        Didn't receive the email?{' '}
                                        <button 
                                            onClick={handleRegisterSubmit} 
                                            disabled={loading}
                                            className="text-blue-600 font-bold hover:underline ml-1"
                                        >
                                            Resend OTP
                                        </button>
                                    </p>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default Register;
