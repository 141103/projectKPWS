import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, ChevronLeft, Sun, Moon } from "lucide-react";

const navItems = [
    { id: 'beranda',      label: 'Beranda',      href: '/#beranda' },
    { id: 'warta-jemaat', label: 'Warta Jemaat', href: '/#warta-jemaat' },
    { id: 'renungan',     label: 'Renungan',     href: '/#renungan' },
    { id: 'layanan',      label: 'Layanan',      href: '/#layanan' },
    { id: 'jadwal',       label: 'Jadwal',       href: '/#jadwal' },
    { id: 'galeri',       label: 'Galeri',       href: '/#galeri' },
    { id: 'kontak',       label: 'Kontak',       href: '/#kontak' },
];

export default function NavbarProfile({ isDarkMode, toggleDarkMode, logoGkjUrl }) {
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();

    return (
        <nav className="fixed top-0 left-0 w-full bg-[#1a2744] dark:bg-[#0a0e1a] shadow-lg z-50 transition-colors duration-500">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center h-16">

                    {/* Logo + Nama */}
                    <div className="flex-shrink-0">
                        <Link
                            to="/"
                            className="flex items-center gap-2 text-white font-bold tracking-wide"
                        >
                            <img
                                src={logoGkjUrl}
                                alt="Logo GKJ Wates Selatan"
                                className="w-9 h-9 rounded-full border border-blue-300 shadow-sm object-cover"
                            />
                            <span className="hidden sm:block uppercase tracking-widest text-sm font-semibold">
                                GKJ WATES SELATAN
                            </span>
                        </Link>
                    </div>

                    {/* Desktop: Nav Items + Dark Mode */}
                    <div className="hidden md:flex flex-1 items-center justify-between ml-8">

                        {/* Nav Items */}
                        <div className="flex items-center space-x-1">
                            {navItems.map(item => (
                                <Link
                                    key={item.id}
                                    to={item.href}
                                    className="px-3 py-1.5 text-sm font-medium rounded text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-200"
                                >
                                    {item.label}
                                </Link>
                            ))}
                        </div>

                        {/* Dark Mode Toggle */}
                        <div className="flex items-center gap-2 ml-4">
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
                            <span className="text-gray-300 dark:text-gray-200 text-sm select-none">
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
                            <Moon className={`transition-all duration-300 ${
                                isDarkMode ? 'w-4 h-4 text-yellow-400' : 'w-3 h-3 text-gray-500'
                            }`} />
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
                <div className="md:hidden bg-[#1a2744] dark:bg-[#0a0e1a] border-t border-white/10">
                    <div className="px-3 pt-2 pb-3 space-y-1">
                        {/* Tombol Kembali di mobile */}
                        <button
                            onClick={() => { navigate(-1); setIsOpen(false); }}
                            className="flex items-center gap-1 w-full px-3 py-2 rounded text-sm font-medium text-blue-300 hover:text-white hover:bg-white/10 transition-colors"
                        >
                            <ChevronLeft className="w-4 h-4" />
                            Kembali
                        </button>

                        {navItems.map(item => (
                            <Link
                                key={item.id}
                                to={item.href}
                                onClick={() => setIsOpen(false)}
                                className="block px-3 py-2 rounded text-sm font-medium text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
                            >
                                {item.label}
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </nav>
    );
}
