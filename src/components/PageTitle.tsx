import React from 'react';

interface PageTitleProps {
  children: React.ReactNode;
}

export const PageTitle: React.FC<PageTitleProps> = ({ children }) => {
  return <h1 className="text-3xl font-semibold mb-8 text-chnebel-black">{children}</h1>;
};

