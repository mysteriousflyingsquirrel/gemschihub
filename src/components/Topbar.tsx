import React from 'react';

interface TopbarProps {
  isMenuOpen: boolean;
  onMenuToggle: () => void;
}

const HamburgerIcon: React.FC<{ isOpen: boolean }> = ({ isOpen }) => (
  <svg
    className="w-6 h-6"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    {isOpen ? (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M6 18L18 6M6 6l12 12"
      />
    ) : (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M4 6h16M4 12h16M4 18h16"
      />
    )}
  </svg>
);

export const Topbar: React.FC<TopbarProps> = ({ isMenuOpen, onMenuToggle }) => {
  return (
    <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-gradient-to-r from-chnebel-red to-[#c4161e] shadow-lg z-50 flex items-center px-4">
      <button
        onClick={onMenuToggle}
        className="text-white p-2 rounded-lg hover:bg-white/20 transition-all duration-200 active:scale-95"
        aria-label="Toggle menu"
      >
        <HamburgerIcon isOpen={isMenuOpen} />
      </button>
    </div>
  );
};
