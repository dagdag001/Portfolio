import React from "react";

const Layout = ({ children }) => {
  return (
    <div className="relative min-h-screen bg-black text-white flex justify-center">
      {/* Background effect */}
      <div className="fixed inset-0 -z-10 bg-black bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.1),transparent_70%)]"></div>

      {/* Centered container */}
      <main className="w-full max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
};

export default Layout;
