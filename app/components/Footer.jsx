import React from 'react';
import { Music, Twitter, Instagram, Youtube, Github, Linkedin } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Footer() {
  const footerLinks = [
    {
      title: "Product",
      links: [
        { name: "Features", href: "#features" },
        { name: "Pricing", href: "#pricing" },
        { name: "Creator Showcase", href: "#creators" },
        { name: "How It Works", href: "#how-it-works" }
      ]
    },
    {
      title: "Resources",
      links: [
        { name: "Documentation", href: "#" },
        { name: "Blog", href: "#" },
        { name: "Support", href: "#" }
      ]
    },
    {
      title: "Company",
      links: [
        { name: "About", href: "#" },
        { name: "Contact", href: "#" },
        { name: "Privacy Policy", href: "#" }
      ]
    }
  ];
  
  const socialLinks = [
    { icon: <Twitter size={20} />, href: "#" },
    { icon: <Instagram size={20} />, href: "#" },
    { icon: <Youtube size={20} />, href: "#" },
    { icon: <Github size={20} />, href: "#" },
    { icon: <Linkedin size={20} />, href: "#" }
  ];

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
  };
  
  return (
    <footer className="bg-black text-white">
      <div className="container mx-auto px-4 py-16">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeIn}
        >
          {/* Main footer content grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-12">
            
            {/* Brand section */}
            <div className="lg:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-gray-900 flex items-center justify-center">
                  <Music size={20} className="text-white" />
                </div>
                <span className="text-xl font-bold">BarsAndBeats</span>
              </div>
              <p className="text-gray-400 max-w-xs leading-relaxed">
                Elevate your stream by letting your fans choose the soundtrack.
              </p>
            </div>
            
            {/* Footer links */}
            {footerLinks.map((column) => (
              <div key={column.title}>
                <h4 className="font-semibold text-sm tracking-wider uppercase text-gray-400 mb-4">
                  {column.title}
                </h4>
                <ul className="space-y-3">
                  {column.links.map((link) => (
                    <li key={link.name}>
                      <a href={link.href} className="text-gray-300 hover:text-white transition-colors duration-200">
                        {link.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Bottom section with copyright and social links */}
          <div className="pt-8 border-t border-gray-800 flex flex-col sm:flex-row justify-between items-center">
            <p className="text-gray-500 text-sm mb-4 sm:mb-0">
              &copy; {new Date().getFullYear()} BarsAndBeats. All rights reserved.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.href}
                  className="text-gray-500 hover:text-white transition-colors duration-200"
                >
                  {link.icon}
                </a>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}