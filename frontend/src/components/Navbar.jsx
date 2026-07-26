import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Target } from 'lucide-react';

const Navbar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const isScrolled = window.scrollY > 20;
            if (isScrolled !== scrolled) {
                setScrolled(isScrolled);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [scrolled]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userName');
        window.location.href = '/login';
    };

    const scrollToSection = (id) => {
        if (location.pathname !== '/') {
            navigate(`/#${id}`);
        } else {
            const element = document.getElementById(id);
            element?.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <nav className={`fixed w-full top-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/90 shadow-sm backdrop-blur-md py-3' : 'bg-transparent py-5'}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
                <Link to="/" className="text-2xl font-black tracking-tight cursor-pointer text-slate-950 transition-all hover:opacity-90 select-none">
                    Ace<span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">The</span>Job<span className="text-blue-600">.</span>
                </Link>

                <div className="flex space-x-4 items-center">
                    {!token ? (
                        <>
                            <Link to="/login" className="text-sm font-bold text-gray-700 hover:text-blue-600 transition-colors">
                                Log in
                            </Link>
                            <Link to="/registration" className="px-5 py-2 text-sm font-bold rounded-full bg-gray-900 text-white hover:bg-gray-800 transition-colors">
                                Get Started
                            </Link>
                        </>
                    ) : (
                        <>
                            <Link to="/dashboard" className="text-sm font-bold text-gray-700 hover:text-blue-600 transition-colors">
                                Dashboard
                            </Link>
                            <button onClick={handleLogout} className="px-5 py-2 text-sm font-bold rounded-full bg-gray-100 text-red-600 hover:bg-red-50 transition-colors">
                                Logout
                            </button>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
