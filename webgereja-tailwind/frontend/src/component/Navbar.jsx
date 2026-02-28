import React, { useState } from 'react';
import { Link } from "react-router-dom";
import { Menu, X, Sun, Moon } from 'lucide-react';

// Fallback Logo URL
const LOGO_GKJ_URL = 'https://sinodegkj.or.id/wp-content/uploads/2023/01/arti-makna-lmbang-gereja-kristen-jawa-gkj.png';

// Fungsi helper untuk smooth scroll
const scrollToSection = (id, setActiveSection) => {
    const element = document.getElementById(id);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        if (setActiveSection) {
            setTimeout(() => setActiveSection(id), 100);
        }
    }
};

const Navbar = ({ activeSection, setActiveSection, isDarkMode, toggleDarkMode, logoGkjUrl }) => {
    const navItems = [
        { id: 'beranda', label: 'Beranda', isRoute: false },
        { id: 'warta-jemaat', label: 'Warta Jemaat', isRoute: false },
        { id: 'renungan', label: 'Renungan', isRoute: false },
        { id: 'layanan', label: 'Layanan', isRoute: false },
        { id: 'jadwal', label: 'Jadwal', isRoute: false },
        { id: 'galeri', label: 'Galeri', isRoute: false },
        { id: 'kontak', label: 'Kontak', isRoute: false },
        { id: 'profile', label: 'Profil Gereja', isRoute: true }
    ];
    const [isOpen, setIsOpen] = useState(false);

    const handleScroll = (id) => {
        // setActiveSection might not be available on all pages
        const setActive = setActiveSection || (() => {});
        scrollToSection(id, setActive);
        setIsOpen(false);
    };

    // On pages other than the main one, the links should probably navigate and then scroll.
    // This is a complex problem for a simple navbar. For now, we assume that if it's not a route, it's a scroll link on the current page.
    // A better implementation would use a global state (like Redux or Context) to know which page we are on.

    return (
        <nav className="fixed top-0 left-0 w-full bg-white dark:bg-gray-800 shadow-lg z-50 transition-colors duration-500">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo/Title */}
                    <div className="flex-shrink-0">
                        <Link to="/" className="text-xl font-bold text-slate-800 dark:text-gray-100 flex items-center transition-colors duration-500">
                            <img
                                src={logoGkjUrl || LOGO_GKJ_URL}
                                alt="Logo GKJ Wates Selatan"
                                className="w-8 h-8 mr-2 rounded-full border border-blue-200"
                            />
                            GKJ WATES SELATAN
                        </Link>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center space-x-4">
                        {/* Dark Mode Toggle */}
                        <button
                            onClick={toggleDarkMode}
                            className="p-2 rounded-full text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-300"
                            aria-label="Toggle Dark Mode"
                        >
                            {isDarkMode ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
                        </button>

                        {navItems.map(item => (
                            item.isRoute ? (
                                <Link
                                    key={item.id}
                                    to={`/${item.id}`}
                                    className={`px-3 py-2 text-base font-medium rounded-md transition-colors ${
                                        // Highlight if it's the active section
                                        activeSection === item.id
                                            ? 'bg-blue-600 text-white shadow-md'
                                            : 'text-slate-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-blue-600'}`
                                    }
                                >
                                    {item.label}
                                </Link>
                            ) : (
                                <a
                                    key={item.id}
                                    href={`#${item.id}`}
                                    onClick={(e) => { e.preventDefault(); handleScroll(item.id); }}
                                    className={`px-3 py-2 text-base font-medium rounded-md transition-colors ${
                                        activeSection === item.id
                                            ? 'bg-blue-600 text-white shadow-md'
                                            : 'text-slate-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-blue-600'}`
                                    }
                                >
                                    {item.label}
                                </a>
                            )
                        ))}
                    </div>

                    {/* Mobile Menu Button & Dark Mode Toggle */}
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={toggleDarkMode}
                            className="p-2 rounded-full text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-300 mr-2"
                            aria-label="Toggle Dark Mode"
                        >
                            {isDarkMode ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
                        </button>

                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 transition-colors duration-300"
                            aria-expanded={isOpen}
                        >
                            <span className="sr-only">Buka menu utama</span>
                            {isOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu Panel */}
            <div className={`md:hidden ${isOpen ? 'block' : 'hidden'} absolute top-16 w-full bg-white dark:bg-gray-800 shadow-xl transition-colors duration-500`}>
                <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                    {navItems.map(item => (
                        item.isRoute ? (
                            <Link
                                key={item.id}
                                to={`/${item.id}`}
                                onClick={() => setIsOpen(false)}
                                className="block px-3 py-2 rounded-md text-base font-medium transition-colors text-slate-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-blue-600"
                            >
                                {item.label}
                            </Link>
                        ) : (
                            <a
                                key={item.id}
                                href={`#${item.id}`}
                                onClick={(e) => {
                                    e.preventDefault();
                                    handleScroll(item.id);
                                }}
                                className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                                    activeSection === item.id
                                        ? 'bg-blue-600 text-white'
                                        : 'text-slate-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-blue-600'}`
                                }
                            >
                                {item.label}
                            </a>
                        )
                    ))}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
