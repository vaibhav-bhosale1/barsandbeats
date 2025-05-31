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
        { name: "Integrations", href: "#integrations" },
        { name: "Changelog", href: "#changelog" }
      ]
    },
    {
      title: "Resources",
      links: [
        { name: "Documentation", href: "#docs" },
        { name: "Tutorials", href: "#tutorials" },
        { name: "Blog", href: "#blog" },
        { name: "Support", href: "#support" }
      ]
    },
    {
      title: "Company",
      links: [
        { name: "About", href: "#about" },
        { name: "Careers", href: "#careers" },
        { name: "Contact", href: "#contact" },
        { name: "Privacy", href: "#privacy" }
      ]
    }
  ];
  
  const socialLinks = [
    { icon: <Twitter size={20} />, href: "#twitter", color: "hover:bg-blue-500" },
    { icon: <Instagram size={20} />, href: "#instagram", color: "hover:bg-gradient-to-br hover:from-purple-500 hover:to-pink-500" },
    { icon: <Youtube size={20} />, href: "#youtube", color: "hover:bg-red-500" },
    { icon: <Github size={20} />, href: "#github", color: "hover:bg-gray-600" },
    { icon: <Linkedin size={20} />, href: "#linkedin", color: "hover:bg-blue-600" }
  ];
  
  // Floating musical notes animation
  const FloatingNotes = () => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {Array.from({ length: 15 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute text-white/5 text-4xl font-bold"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [-20, -100, -20],
            opacity: [0.1, 0.3, 0.1],
            rotate: [0, 360],
          }}
          transition={{
            duration: 8 + Math.random() * 4,
            repeat: Infinity,
            delay: Math.random() * 5,
            ease: "easeInOut",
          }}
        >
          ♪
        </motion.div>
      ))}
    </div>
  );
  
  return (
    <footer className="relative bg-gradient-to-br from-slate-900 via-purple-900/50 to-slate-900 overflow-hidden">
      <FloatingNotes />
      
      {/* Animated background shapes */}
      <div className="absolute top-0 left-0 w-full h-full">
        <motion.div
          className="absolute top-20 left-10 w-64 h-64 bg-purple-500/10 rounded-full filter blur-3xl"
          animate={{
            x: [0, 50, 0],
            y: [0, -30, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-20 right-20 w-80 h-80 bg-pink-500/10 rounded-full filter blur-3xl"
          animate={{
            x: [0, -40, 0],
            y: [0, 20, 0],
            scale: [1, 0.8, 1],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
        />
      </div>

      <div className="relative z-10 pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Main footer content */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
            {/* Brand section */}
            <motion.div 
              className="lg:col-span-2"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center space-x-3 mb-6">
                <motion.div 
                  className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 via-pink-500 to-blue-500 flex items-center justify-center shadow-lg"
                  whileHover={{ 
                    scale: 1.1,
                    rotate: 360,
                  }}
                  transition={{ duration: 0.6 }}
                >
                  <Music size={20} className="text-white" />
                </motion.div>
                <span className="text-2xl font-bold bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
                  BarsAnsBeats
                </span>
              </div>
              
              <p className="text-white/70 mb-8 max-w-md text-lg leading-relaxed">
                Elevate your streaming experience by letting your fans choose the soundtrack. Boost engagement, retention, and create memorable moments.
              </p>
              
              {/* Enhanced social links */}
              <div className="flex space-x-3">
                {socialLinks.map((link, index) => (
                  <motion.a
                    key={index}
                    href={link.href}
                    className={`relative w-12 h-12 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 flex items-center justify-center text-white/70 transition-all duration-300 ${link.color} hover:text-white hover:border-white/30 hover:shadow-lg overflow-hidden group`}
                    whileHover={{ 
                      scale: 1.1,
                      y: -5,
                    }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                  >
                    <div className="relative z-10">
                      {link.icon}
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-600"></div>
                  </motion.a>
                ))}
              </div>
            </motion.div>
            
            {/* Footer links */}
            {footerLinks.map((column, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: (index + 1) * 0.1 }}
              >
                <h4 className="font-bold text-xl mb-6 text-white bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
                  {column.title}
                </h4>
                <ul className="space-y-4">
                  {column.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <motion.a 
                        href={link.href}
                        className="text-white/70 hover:text-white transition-all duration-300 text-base relative group inline-block"
                        whileHover={{ x: 5 }}
                      >
                        {link.name}
                        <span className="absolute bottom-0 left-0 w-0 h-px bg-gradient-to-r from-purple-400 to-pink-400 group-hover:w-full transition-all duration-300"></span>
                      </motion.a>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
          
          {/* Bottom section with enhanced styling */}
          <motion.div 
            className="pt-8 border-t border-gradient-to-r from-transparent via-white/20 to-transparent"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="relative">
              {/* Animated gradient line */}
              <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent"></div>
              
              <div className="flex flex-col md:flex-row justify-between items-center pt-8">
                <motion.p 
                  className="text-white/50 text-sm mb-4 md:mb-0 flex items-center"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                >
                  <span className="mr-2">©</span>
                  <span>{new Date().getFullYear()}</span>
                  <span className="mx-2 text-purple-400">•</span>
                  <span className="font-semibold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                    BarsAnsBeats
                  </span>
                  <span className="ml-2">All rights reserved.</span>
                </motion.p>
                
                <motion.div 
                  className="flex space-x-8"
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                >
                  {[
                    { name: "Terms of Service", href: "#terms" },
                    { name: "Privacy Policy", href: "#privacy" },
                    { name: "Cookie Policy", href: "#cookies" }
                  ].map((link, index) => (
                    <motion.a 
                      key={index}
                      href={link.href} 
                      className="text-white/50 hover:text-white text-sm transition-all duration-300 relative group"
                      whileHover={{ y: -2 }}
                    >
                      {link.name}
                      <span className="absolute bottom-0 left-0 w-0 h-px bg-gradient-to-r from-purple-400 to-pink-400 group-hover:w-full transition-all duration-300"></span>
                    </motion.a>
                  ))}
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* Bottom gradient glow */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500/50 via-pink-500/50 to-blue-500/50"></div>
    </footer>
  );
}