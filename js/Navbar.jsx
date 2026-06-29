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
      <div className="flex items-center justify-between">
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

        <div className="liquid-glass hidden items-center rounded-full p-1.5 md:flex">
          {links.map((link) => (
            <a key={link.label} href={link.href} className="whitespace-nowrap px-3 py-2 font-body text-sm font-medium text-white/90">
              {link.label}
            </a>
          ))}
          <a href="#contact" className="ml-1 flex items-center gap-1.5 whitespace-nowrap rounded-full bg-white px-4 py-2 font-body text-sm font-medium text-black">
            Start a Project <ArrowUpRight className="h-4 w-4" />
          </a>
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

        <div className="hidden h-12 w-12 md:block" aria-hidden="true" />
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
