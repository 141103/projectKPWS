import logoGKJ from "../assets/logoGKJ.png";

export default function NavbarProfile() {
  return (
    <nav
      className="fixed top-0 left-0 w-full z-50
                 bg-white dark:bg-gray-900
                 border-b border-gray-200 dark:border-gray-700"
    >
      <div className="mx-auto max-w-6xl h-16 px-6 flex items-center gap-3">
        
        {/* Logo */}
        <img
          src={logoGKJ}
          alt="Logo GKJ"
          className="h-10 w-auto"
        />

        {/* Nama Gereja */}
        <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          GKJ Wates Selatan
        </span>
      </div>
    </nav>
  );
}
