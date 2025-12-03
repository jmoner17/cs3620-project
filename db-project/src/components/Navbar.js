import { useState, useEffect } from "react";
import Link from 'next/link';
import PropTypes from 'prop-types';
import { usePathname } from 'next/navigation';

const NavLink = ({ href, onClick, active, children }) => {
  return (
    <Link
      href={href}
      passHref
      prefetch={false}
      onClick={onClick}
      className={`${active
          ? "text-light-text dark:text-dark-light-text"
          : "text-text-color dark:text-dark-text-color hover:text-light-text dark:hover:text-dark-light-text"
        } link no-underline font-bold`}
    >
      {children}
    </Link>
  );
};

NavLink.propTypes = {
  href: PropTypes.string.isRequired,
  onClick: PropTypes.func,
  active: PropTypes.bool,
  children: PropTypes.node.isRequired,
};

const Logo = ({ href, onClick, children }) => {
  return (
    <Link
      href={href}
      passHref
      prefetch={false}
      onClick={onClick}
      className="z-50 text-text-color dark:text-dark-text-color font-bold text-xl mx-auto lg:mx-0 hover:text-light-text dark:hover:text-dark-light-text"
    >
      {children}
    </Link>
  );
};

Logo.propTypes = {
  href: PropTypes.string.isRequired,
  onClick: PropTypes.func,
  children: PropTypes.node.isRequired,
};

const CartLink = ({ href, onClick }) => {
  return (
    <Link
      href={href}
      passHref
      prefetch={false}
      onClick={onClick}
      className="lg:ml-12 flex font-bold text-text-color dark:text-dark-text-color hover:text-light-text dark:hover:text-dark-light-text"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 576 512"
        width="24"
        height="24"
        fill="currentColor"
        className="mr-1"
      >
        {/* Shopping Cart SVG Path */}
        <path d="M0 24C0 10.7 10.7 0 24 0H69.5c22 0 41.5 12.8 50.6 32h411c26.3 0 45.5 25 38.6 50.4l-41 152.3c-8.5 31.4-37 53.3-69.5 53.3H170.7l5.4 28.5c2.2 11.3 12.1 19.5 23.6 19.5H488c13.3 0 24 10.7 24 24s-10.7 24-24 24H199.7c-34.6 0-64.3-24.6-70.7-58.5L77.4 54.5c-.7-3.8-4-6.5-7.9-6.5H24C10.7 48 0 37.3 0 24zM128 464a48 48 0 1 1 96 0 48 48 0 1 1 -96 0zm336-48a48 48 0 1 1 0 96 48 48 0 1 1 0-96z" />
      </svg>
      0
    </Link>
  );
};

CartLink.propTypes = {
  href: PropTypes.string.isRequired,
  onClick: PropTypes.func,
};

const Navbar = () => {
  const [scrollDirection, setScrollDirection] = useState("up");
  const pathname = usePathname();

  useEffect(() => {
    let lastScrollY = window.pageYOffset;
    const handleScroll = () => {
      const currentScrollY = window.pageYOffset;
      if (currentScrollY > lastScrollY) {
        setScrollDirection("down");
      } else {
        setScrollDirection("up");
      }
      lastScrollY = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const scrollThreshold = 50;
    const handleScroll = () => {
      setIsScrolled(window.pageYOffset > scrollThreshold);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  if (isOpen === true && scrollDirection === "down") setScrollDirection("up");

  const navLinks = (
    <ul className="text-center lg:space-x-8 lg:space-y-0 lg:flex space-y-6">
      <li>
        <NavLink
          href="/home"
          active={pathname === "/home"}
          onClick={() => setIsOpen(false)}
        >
          HOME
        </NavLink>
      </li>
      <li>
        <NavLink
          href="/devices"
          active={pathname === "/devices"}
          onClick={() => setIsOpen(false)}
        >
          DEVICES
        </NavLink>
      </li>
      <li>
        <NavLink
          href="/metrics"
          active={pathname === "/metrics"}
          onClick={() => setIsOpen(false)}
        >
          METRICS
        </NavLink>
      </li>
    </ul>
  );

  return (
    <nav
      className={`
        ${isOpen ? "fixed top-0 left-0 h-screen w-full bg-primary dark:bg-dark-primary transition-all duration-300" : "sticky top-0 left-0 w-full"} 
        ${isScrolled && scrollDirection === "down" && !isOpen ? "opacity-0 z--50 pointer-events-none transition-all duration-500" : ""}
        py-4 px-6 z-20
      `}
    >
      {/* Background pseudo-element */}
      {isScrolled && !isOpen && (
        <div
          className="absolute inset-0 bg-primary dark:bg-dark-primary opacity-20 dark:opacity-20"
        />
      )}

      <div className={`${isOpen ? 'flex flex-col items-center justify-between' : ''} container mx-auto h-full`}>
        <div className="flex justify-between items-center w-full">
          {/* Hamburger menu */}
          <div className="z-20 lg:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="focus:outline-none"
            >
              <svg
                className="w-6 h-6 text-text-color dark:text-dark-text-color"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isOpen ? (
                  <path d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>

          {/* Logo */}
          <Logo href="/home" onClick={() => setIsOpen(false)}>
            BetterHealth
          </Logo>

          <div className="flex items-center">
            <div className="lg:flex items-center hidden">
              {/* Nav items */}
              <div className="lg:flex space-x-8">
                {navLinks}
              </div>
            </div>
          </div>
        </div>
        {/* Mobile menu */}
        {isOpen && (
          <div className="bg-light-bg dark:bg-dark-bg h-full flex flex-col items-center justify-between">
            <div />
            <div className="lg:hidden text-xl flex flex-col items-center justify-center px-6 py-4 space-y-6">
              {navLinks}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;