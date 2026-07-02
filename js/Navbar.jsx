function Navbar() {
  const [menuOpen, setMenuOpen] = React.useState(false);
  const links = [
    { label: "Home",    href: "#home"    },
    { label: "Profile", href: "#profile" },
    { label: "Reviews", href: "#reviews" },
    { label: "Gallery", href: "#gallery" },
    { label: "Contact", href: "#contact" }
  ];

  return (
    <nav className="fixed left-0 right-0 top-4 z-50 px-5 md:px-8 lg:px-16" aria-label="Main navigation">
      <div className="relative flex items-center justify-between">
        <a href="#home" aria-label="Snapmark Media home" className="liquid-glass flex h-12 w-12 items-center justify-center rounded-full">
          <img
            src="assets/snapmark-logo.png"
            alt="SnapMark Media"
            style={{
              width: 36,
              height: 36,
              objectFit: "contain",
              borderRadius: "50%",
            }}
          />
        </a>

        <div class="liquid-glass hidden items-center rounded-full p-1.5 md:flex absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2">
          {links.map((link) => (
            <a key={link.label} href={link.href} class="whitespace-nowrap px-4 py-2 font-body text-sm font-medium text-white/90 hover:text-white transition-colors duration-200">
              {link.label}
            </a>
          ))}
        </div>

        <button
          type="button"
          aria-label="Toggle navigation menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(!menuOpen)}
          className="liquid-glass flex h-12 w-12 flex-col items-center justify-center gap-1.5 rounded-full text-white md:hidden"
        >
          <span className="h-px w-4 bg-white" />
          <span className="h-px w-4 bg-white" />
        </button>

        <a href="#contact" class="hidden md:flex items-center gap-1.5 whitespace-nowrap rounded-full bg-white px-5 py-2.5 font-body text-sm font-medium text-black hover:bg-white/90 transition-all duration-200">
          Start a Project <ArrowUpRight class="h-4 w-4" />
        </a>
      </div>

      {menuOpen && (
        <div className="liquid-glass ml-auto mt-3 flex w-52 flex-col rounded-[1.25rem] p-2 md:hidden">
          {links.map((link) => (
            <a key={link.label} href={link.href} onClick={() => setMenuOpen(false)} className="rounded-full px-4 py-2.5 font-body text-sm font-medium text-white/90">
              {link.label}
            </a>
          ))}
        </div>
      )}
    </nav>
  );
}

window.Navbar = Navbar;
