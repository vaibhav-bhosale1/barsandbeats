"use client"
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, Music, X } from 'lucide-react';
import { signIn, signOut, useSession } from 'next-auth/react';

// ✨ 1. Define the types for the Button's props
interface ButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
  className?: string;
}

// ✨ 2. Apply the types to the Button component
const Button = ({ onClick, children, variant = 'primary', className = '' }: ButtonProps) => {
  const baseClasses = "inline-flex items-center justify-center px-5 py-2 font-semibold transition-colors duration-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-white";
  const variants = {
    primary: "bg-white text-black hover:bg-gray-200",
    secondary: "bg-transparent border border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white"
  };
  return (
    <button onClick={onClick} className={`${baseClasses} ${variants[variant]} ${className}`}>
      {children}
    </button>
  );
};

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { data: session } = useSession();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Features', href: '#features' },
    { name: 'How It Works', href: '#how-it-works' },
  ];

  return (
    <motion.header 
      className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${
        scrolled || isOpen ? 'bg-black border-b border-gray-800' : 'bg-transparent'
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <a href="#" className="flex items-center space-x-2">
            <div className="w-9 h-9 rounded-lg bg-gray-900 flex items-center justify-center">
              <Music size={18} className="text-white" />
            </div>
            <span className="text-xl font-bold text-white">BarsAndBeats</span>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <a key={link.name} href={link.href} className="text-gray-400 hover:text-white transition-colors">
                {link.name}
              </a>
            ))}
          </nav>

          {/* Call to Action Buttons */}
          <div className="hidden md:flex items-center space-x-3">
            {!session?.user ? (
              <>
                <Button variant="secondary" onClick={() => signIn()} className='cursor-pointer'>Log In</Button>
                <Button variant="primary" onClick={() => signIn()} className='cursor-pointer'>Sign Up</Button>
              </>
            ) : (
              <Button variant="secondary" onClick={() => signOut()} className='cursor-pointer'>Sign Out</Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="p-2 text-white focus:outline-none">
              <AnimatePresence mode="wait">
                <motion.div
                  key={isOpen ? 'x' : 'menu'}
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {isOpen ? <X size={24} /> : <Menu size={24} />}
                </motion.div>
              </AnimatePresence>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            className="md:hidden bg-black border-t border-gray-800"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            <div className="container mx-auto px-4 py-6">
              <nav className="flex flex-col space-y-2 mb-6">
                {navLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    className="text-gray-300 hover:text-white transition-colors py-3 text-lg"
                    onClick={() => setIsOpen(false)}
                  >
                    {link.name}
                  </a>
                ))}
              </nav>
              <div className="flex flex-col space-y-3 pt-4 border-t border-gray-800">
                {!session?.user ? (
                  <>
                    <Button variant="secondary" onClick={() => { signIn(); setIsOpen(false); }} className='cursor-pointer'>Log In</Button>
                    <Button variant="primary" onClick={() => { signIn(); setIsOpen(false); }} className='cursor-pointer'>Sign Up</Button>
                  </> 
                ) : (
                  <Button variant="secondary" onClick={() => { signOut(); setIsOpen(false); }} className='cursor-pointer'>Sign Out</Button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}