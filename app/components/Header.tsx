"use client"
import { Button } from '@/components/ui/button'
import { Menu, Music, X } from 'lucide-react'
import { signIn, signOut, useSession } from 'next-auth/react'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion';


export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { data: session } = useSession()

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
    { name: 'Creators', href: '#creators' },
    { name: 'Testimonials', href: '#testimonials' },
    { name: 'Pricing', href: '#pricing' },
  ];

  return (
    <motion.header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-dark-300/80 backdrop-blur-md shadow-lg' : 'bg-transparent'
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <motion.div 
            className="flex items-center space-x-2"
            whileHover={{ scale: 1.05 }}
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary-500 to-accent-500 flex items-center justify-center">
              <Music size={16} className="text-white" />
            </div>
            <span className="text-xl font-bold">BarsAnsBeats</span>
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-white/80 hover:text-white transition-colors"
              >
                {link.name}
              </a>
            ))}
          </nav>

          {/* Call to Action Buttons */}
          <div className="hidden md:flex items-center space-x-4">
             {!session?.user && ( // show Signin if user is NOT logged in
              <>
              <Button  className="cursor-pointer"onClick={()=>{signIn()}}>Log In</Button>
                    <Button className="cursor-pointer"onClick={()=>{signIn()}}>Sign Up</Button>
              </> 
        )}
        {session?.user && ( // show Signout if user IS logged in
          <Button onClick={() => signOut()}>Signout</Button>
        )}
             
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-white focus:outline-none"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
        
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <motion.div 
          className="md:hidden bg-dark-300/95 backdrop-blur-md"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="container mx-auto px-4 py-4">
            <nav className="flex flex-col space-y-4 py-4">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="text-white/80 hover:text-white transition-colors py-2"
                  onClick={() => setIsOpen(false)}
                >
                  {link.name}
                </a>
              ))}
            </nav>
            <div className="flex flex-col space-y-3 pt-4 pb-6">
               {!session?.user && ( // show Signin if user is NOT logged in
              <>
              <Button  className="cursor-pointer"onClick={()=>{signIn()}}>Log In</Button>
                    <Button className="cursor-pointer"onClick={()=>{signIn()}}>Sign Up</Button>
              </> 
              )}
              {session?.user && ( // show Signout if user IS logged in
                <Button onClick={() => signOut()}>Signout</Button>
               )}
            </div>
          </div>
        </motion.div>
      )}
    </motion.header>
  );
}