import React from "react";
import { socials } from "../constants";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-gray-300 py-10 mt-auto">
      <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center gap-6 px-4">
        {/* Brand Name and Rights */}
        <p className="text-sm sm:text-base text-center sm:text-left">
          © {new Date().getFullYear()}{" "}
          <span className="font-semibold text-white">HitchPath</span>. All rights reserved.
        </p>

        {/* Social Icons */}
        <ul className="flex gap-4">
          {socials.map((item) => (
            <li key={item.id}>
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-center w-12 h-12 rounded-full bg-gray-700 transition-all hover:bg-purple-600 shadow-md"
              >
                <img
                  src={item.iconUrl}
                  alt={item.title}
                  className="w-6 h-6 transition-transform group-hover:scale-110"
                />
              </a>
            </li>
          ))}
        </ul>
      </div>

      {/* Footer Divider */}
      <div className="mt-8 border-t border-gray-700"></div>

      {/* Additional Footer Text */}
      <div className="mt-4 text-sm text-center">
        Designed with ❤️ by the HitchHub Team.
      </div>
    </footer>
  );
};

export default Footer;
