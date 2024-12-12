import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { useUser } from "../contexts/UserContexts";
import PlaceholderImg from "../assets/imgs/7084233.jpg";
import Logo from "../assets/imgs/ticket-booth-logo.png";
interface NavbarProps {
  handleBtnPress: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ handleBtnPress }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen((prevIsOpen) => !prevIsOpen);
  };

  const { user, setUser } = useUser();

  return (
    <nav className="bg-white border border-b-1">
      <div className="px-12 w-full border  flex justify-between items-center">
        <div className="flex-row flex items-center gap-6">
          <button
            onClick={() => setUser(null)}
            className="text-xl font-bold mb-1 "
          >
            <NavLink to="/">
              <img
                src={Logo}
                alt="logo"
                className="logo-class"
                style={{ width: "100px", height: "auto" }}
              />
            </NavLink>
          </button>

          <button
            className="text-2xl md:hidden"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            ☰
          </button>

          <ul
            className={`${
              isOpen ? "block" : "hidden"
            } md:flex md:items-center md:space-x-3 mt-4 md:mt-0`}
          >
            <li>
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `block px-3 py-2   ${
                    isActive
                      ? " border-b-2 border-b-blue-600 text-black"
                      : "hover:bg-blue-700 hover:text-white rounded-md"
                  }`
                }
              >
                Home
              </NavLink>
            </li>
          </ul>
        </div>
        {user?.role === "ADMIN" && (
          <button
            onClick={handleBtnPress}
            className="bg-blue-600 p-2 rounded-md text-white"
          >
            <p className="text-sm text-white">Add Event</p>
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
