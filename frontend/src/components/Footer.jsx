import React from 'react';
import { motion } from 'framer-motion';
import { Globe, Phone, MapPin, Linkedin, Twitter, Github, Instagram } from 'lucide-react';

const Footer = () => {
    return (
        <footer id="contact" className="bg-gradient-to-br from-gray-900 via-gray-800 to-indigo-950 text-white pt-16 pb-8 border-t border-gray-800 relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl -mr-48 -mt-48 pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl -ml-48 -mb-48 pointer-events-none"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-12">

                    {/* Brand Section */}
                    <div className="space-y-4">
                        <span className="text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400">
                            AceTheJob
                        </span>
                        <p className="text-gray-400 leading-relaxed text-sm mt-4 max-w-xs">
                            Empowering job seekers with AI-driven mock interviews, ATS resume analysis, and actionable insights to land their dream roles.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-lg font-semibold text-white mb-6">Quick Links</h3>
                        <ul className="space-y-3">
                            {['Home', 'How it Works', 'Merits', 'Team'].map((link) => (
                                <li key={link}>
                                    <a
                                        href={`#${link.toLowerCase().replace(/\s+/g, '-')}`}
                                        className="text-gray-400 hover:text-blue-400 transition-colors duration-300 text-sm flex items-center group cursor-pointer"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            const id = link.toLowerCase().replace(/\s+/g, '-');
                                            const element = document.getElementById(id === 'how-it-works' ? 'working' : id === 'team' ? 'contact' : id);
                                            element?.scrollIntoView({ behavior: 'smooth' });
                                        }}
                                    >
                                        <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                                        {link}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Team Members */}
                    <div>
                        <h3 className="text-lg font-semibold text-white mb-6">Team Members</h3>
                        <ul className="space-y-3">
                            {[
                                "Kashish Pimpalshende",
                                "Sanju Mandal",
                                "Gayatri Chippawar",
                                "Disha Sakarkar",
                                "Treksha Pachdhare"
                            ].map((name) => (
                                <li key={name} className="text-gray-400 text-sm font-semibold hover:text-blue-400 transition-colors cursor-default">
                                    {name}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h3 className="text-lg font-semibold text-white mb-6">Contact Us</h3>
                        <ul className="space-y-4">
                            <li className="flex items-start text-gray-400 text-sm group">
                                <Globe className="w-5 h-5 mr-3 text-blue-400 group-hover:text-blue-300 transition-colors mt-0.5 flex-shrink-0" />
                                <div>
                                    <span className="block font-medium text-gray-300 mb-1">Website</span>
                                    <a href="http://www.gcoec.ac.in" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors">www.gcoec.ac.in</a>
                                </div>
                            </li>
                            <li className="flex items-start text-gray-400 text-sm group">
                                <Phone className="w-5 h-5 mr-3 text-purple-400 group-hover:text-purple-300 transition-colors mt-0.5 flex-shrink-0" />
                                <div>
                                    <span className="block font-medium text-gray-300 mb-1">Phone</span>
                                    <a href="tel:0717222702" className="hover:text-purple-400 transition-colors">07172-22702</a>
                                </div>
                            </li>
                            <li className="flex items-start text-gray-400 text-sm group">
                                <MapPin className="w-5 h-5 mr-3 text-indigo-400 group-hover:text-indigo-300 transition-colors mt-0.5 flex-shrink-0" />
                                <div>
                                    <span className="block font-medium text-gray-300 mb-1">Location</span>
                                    <span className="leading-relaxed">Government College of Engineering, Chandrapur</span>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 text-sm text-gray-500">
                    <p>&copy; {new Date().getFullYear()} AceTheJob. All rights reserved.</p>
                    <div className="flex space-x-6">
                        <a href="#" className="hover:text-gray-300 transition-colors">Privacy Policy</a>
                        <a href="#" className="hover:text-gray-300 transition-colors">Terms of Service</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
