import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, Sun, Moon } from 'lucide-react';

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
        { id: 'beranda',      label: 'Beranda',      isRoute: false },
        { id: 'profile', label: 'Profil Gereja', isRoute: true },
        { id: 'warta-jemaat', label: 'Warta Jemaat', isRoute: false },
        { id: 'renungan',     label: 'Renungan',     isRoute: false },
        { id: 'layanan',      label: 'Layanan',      isRoute: false },
        { id: 'jadwal',       label: 'Jadwal',       isRoute: false },
        { id: 'galeri',       label: 'Galeri',       isRoute: false },
        { id: 'kontak',       label: 'Kontak',       isRoute: false },
    ];

    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

   const handleScroll = (id) => {
    setIsOpen(false);

    if (location.pathname !== "/") {
    navigate("/", {
        state: {
            targetSection: id,
        },
    });
    return;
}

    scrollToSection(id, setActiveSection);
};

    return (
        <nav
                className={`
                    fixed
                    top-0
                    left-0
                    w-full
                    shadow-sm
                    z-50
                    transition-all
                    duration-500
                    ${
                        isDarkMode
                            ? "bg-[#0a0e1a] border-b border-slate-700"
                            : "bg-white border-b border-slate-200"
                    }
                `}
            >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center h-16">

                    {/* Logo + Nama Gereja */}
                    <div className="flex-shrink-0">
                        <Link
                            to="/"
                            className={`
                            flex
                            items-center
                            gap-2
                            font-bold
                            tracking-wide
                            text-sm
                            sm:text-base
                            ${isDarkMode ? "text-white" : "text-slate-800"}
                            `}
                        >
                            <img
                                src={logoGkjUrl}
                                alt="Logo GKJ Wates Selatan"
                                className="w-9 h-9 rounded-full border-2 border-blue-300 shadow-sm object-contain bg-white p-0.5"
                            />
                            <span
                                className={`
                                hidden
                                sm:block
                                uppercase
                                tracking-widest
                                text-sm
                                font-semibold
                                ${isDarkMode ? "text-white" : "text-slate-800"}
                                `}
                            >
                                GKJ WATES SELATAN
                            </span>
                        </Link>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex flex-1 items-center justify-between ml-20">

                        {/* Nav Items */}
                        <div className="flex items-center space-x-1">
                            {navItems.map(item => (
                            item.isRoute ? (
                                <Link
                                    key={item.id}
                                    to="/profile"
                                    className={`px-3 py-1.5 text-sm font-medium rounded-full transition-all duration-200 ${
                                        location.pathname === "/profile"
                                            ? "bg-blue-500 text-white"
                                            : "text-slate-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-slate-700 hover:text-blue-600 dark:hover:text-white"
                                    }`}
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
                                    className={`px-3 py-1.5 text-sm font-medium rounded-full transition-all duration-200 ${
                                        activeSection === item.id
                                            ? "bg-blue-500 text-white"
                                            : "text-slate-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-slate-700 hover:text-blue-600 dark:hover:text-white"
                                    }`}
                                >
                                    {item.label}
                                </a>
                            )
                        ))}
                        </div>

                        {/* Dark Mode Toggle */}
                        <div className="flex items-center gap-2 ml-4">
                            {/* Border hanya di sekitar ikon */}
                            <button
                                onClick={toggleDarkMode}
                                title={isDarkMode ? "Ubah ke Light Mode" : "Ubah ke Dark Mode"}
                                aria-label="Toggle Dark Mode"
                                className="flex items-center gap-1.5 px-2.5 py-1
                                           border border-gray-500 dark:border-gray-400
                                           rounded-full focus:outline-none
                                           hover:border-gray-300 transition-colors duration-300"
                            >
                                <Moon className={`transition-all duration-300 ${
                                    isDarkMode ? 'w-5 h-5 text-yellow-400' : 'w-3.5 h-3.5 text-gray-500'
                                }`} />
                                <Sun className={`transition-all duration-300 ${
                                    !isDarkMode ? 'w-5 h-5 text-yellow-400' : 'w-3.5 h-3.5 text-gray-500'
                                }`} />
                            </button>
                            {/* Teks di luar border */}
                            <span className="text-slate-700 dark:text-gray-300 text-sm font-medium select-none">
                                {isDarkMode ? 'Dark Mode' : 'Light Mode'}
                            </span>
                        </div>
                    </div>

                    {/* Mobile: Dark Mode + Hamburger */}
                    <div className="md:hidden flex items-center ml-auto gap-2">
                        <button
                            onClick={toggleDarkMode}
                            aria-label="Toggle Dark Mode"
                            className="flex items-center gap-1.5 px-2.5 py-1
                                       border border-gray-500 rounded-full
                                       focus:outline-none hover:border-gray-300 transition-colors duration-300"
                        >
                            {/* Moon kiri */}
                            <Moon className={`transition-all duration-300 ${
                                isDarkMode ? 'w-4 h-4 text-yellow-400' : 'w-3 h-3 text-gray-500'
                            }`} />
                            {/* Sun kanan */}
                            <Sun className={`transition-all duration-300 ${
                                !isDarkMode ? 'w-4 h-4 text-yellow-400' : 'w-3 h-3 text-gray-500'
                            }`} />
                        </button>

                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="p-2 rounded-md text-gray-300 hover:text-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 transition-colors duration-200"
                            aria-expanded={isOpen}
                        >
                            <span className="sr-only">Buka menu utama</span>
                            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu Panel */}
            {isOpen && (
                <div
                      className="
                          md:hidden
                          bg-white
                          dark:bg-[#0a0e1a]
                          border-t
                          border-slate-200
                          dark:border-slate-700
                      "
                  >
                    <div className="px-3 pt-2 pb-3 space-y-1">
                        {navItems.map(item => (
                          item.isRoute ? (
                              <Link
                                  key={item.id}
                                  to="/profile"
                                  onClick={() => setIsOpen(false)}
                                  className="block px-3 py-2 rounded-full text-sm font-medium text-slate-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-slate-700 hover:text-blue-600 dark:hover:text-white transition-colors"
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
                                  className={`block px-3 py-2 rounded-full text-sm font-medium transition-colors ${
                                      activeSection === item.id
                                          ? "bg-blue-500 text-white"
                                          : "text-slate-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-slate-700 hover:text-blue-600 dark:hover:text-white"
                                  }`}
                              >
                                  {item.label}
                              </a>
                          )
                      ))}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
