import React from "react";

const Footer = () => {
  return (
    <footer className="bg-black w-full p-6 text-center text-sm text-yellow-500">
      <p>&copy; {new Date().getFullYear()} AMS Trade Holding. Todos os direitos reservados.</p>
    </footer>
  );
};

export default Footer;