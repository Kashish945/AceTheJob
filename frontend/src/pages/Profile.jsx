import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mail, GraduationCap, Calendar, ShieldCheck, Edit3, Loader2 } from 'lucide-react';
import { fetchProfile } from '../services/api';

const Profile = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadProfile = async () => {
            try {
                const data = await fetchProfile();
                setUser({
                    name: data.username || "User",
                    id: data._id ? `USR-${data._id.substring(0, 6).toUpperCase()}` : "USR-000000",
                    education: data.education || "",
                    email: data.email || "user@example.com",
                    joinedDate: data.createdAt
                        ? new Date(data.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
                        : "Unknown"
                });
            } catch (err) {
                console.error("Failed to fetch profile", err);
                setError("Failed to load user profile");
            } finally {
                setLoading(false);
            }
        };

        loadProfile();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[80vh]">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
        );
    }

    if (error || !user) {
        return (
            <div className="flex justify-center items-center min-h-[80vh]">
                <div className="text-red-500 bg-red-50 p-4 rounded-xl">{error || "User data not found"}</div>
            </div>
        );
    }

    return (
        <div className="p-4 sm:p-8 max-w-5xl mx-auto flex flex-col justify-center min-h-[80vh]">
            
            <div className="w-full bg-white rounded-[32px] p-8 md:p-14 shadow-[0_4px_24px_rgba(0,0,0,0.02)] border border-gray-100">
                {/* Header */}
                <div className="text-center mb-12">
                    <span className="text-[32px] md:text-[36px] font-black tracking-tight select-none">
                        <span className="text-[#0b1120]">User</span>
                        <span className="text-[#4353ff]">Profile</span>
                        <span className="text-[#2563eb]">.</span>
                    </span>
                </div>

                <div className="flex flex-col md:flex-row gap-12 lg:gap-20 items-stretch max-w-4xl mx-auto">
                    {/* Left Side: Avatar & Boxes */}
                    <div className="w-full md:w-[320px] flex-shrink-0">
                        {/* Avatar Box */}
                        <div className="w-full h-full bg-[#f8f9fa] rounded-2xl relative overflow-hidden shadow-sm">
                            <img 
                                src="/images/profile.png" 
                                alt="Profile Avatar" 
                                className="w-full h-full object-cover object-center"
                            />
                        </div>
                    </div>

                    {/* Right Side: Details */}
                    <div className="flex-1 flex flex-col w-full">
                        <div className="space-y-8 flex-1 flex flex-col justify-between">
                            <div>
                                <h3 className="text-sm font-bold text-gray-500 mb-1">Name:</h3>
                                <p className="text-lg font-bold text-gray-900">{user.name}</p>
                            </div>
                            
                            <div>
                                <h3 className="text-sm font-bold text-gray-500 mb-1">Email:</h3>
                                <p className="text-lg font-bold text-gray-900">{user.email}</p>
                            </div>

                            <div>
                                <h3 className="text-sm font-bold text-gray-500 mb-1">User ID:</h3>
                                <p className="text-lg font-bold text-gray-900">{user.id}</p>
                            </div>

                            <div>
                                <h3 className="text-sm font-bold text-gray-500 mb-1">Education Background:</h3>
                                <p className="text-lg font-bold text-gray-900">{user.education || "Empty space (Click edit to add)"}</p>
                            </div>

                            <div>
                                <h3 className="text-sm font-bold text-gray-500 mb-1">Member Since:</h3>
                                <p className="text-lg font-bold text-gray-900">{user.joinedDate}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
