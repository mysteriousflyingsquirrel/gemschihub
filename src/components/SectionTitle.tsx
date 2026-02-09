import React from 'react';

interface SectionTitleProps {
  children: React.ReactNode;
}

export const SectionTitle: React.FC<SectionTitleProps> = ({ children }) => (
  <div className="bg-chnebel-red px-5 py-3 rounded-t-lg">
    <h2 className="text-lg font-bold text-white tracking-wide">{children}</h2>
  </div>
);
