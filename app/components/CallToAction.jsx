import React from 'react';
import { motion } from 'framer-motion';

// Mock Button component
const Button = ({ variant, size, href, children, className = "" }) => {
  const baseClasses = "inline-flex items-center justify-center font-semibold transition-all duration-300 rounded-full relative overflow-hidden group";
  const variants = {
    primary: "bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white shadow-lg hover:shadow-purple-500/50 hover:shadow-2xl transform hover:scale-105 hover:-translate-y-1",
    secondary: "bg-white/10 backdrop-blur-sm text-white border border-white/20 hover:bg-white/20 hover:border-white/40 hover:shadow-xl transform hover:scale-105"
  };
  const sizes = {
    lg: "px-8 py-4 text-lg"
  };
  
  return (
    <motion.a
      href={href}
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <span className="relative z-10">{children}</span>
      {variant === 'primary' && (
        <div className="absolute inset-0 bg-gradient-to-r from-purple-700 via-pink-700 to-blue-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      )}
    </motion.a>
  );
};

// Mock AudioWave component with enhanced visuals
const AudioWave = () => {
  const bars = Array.from({ length: 12 }, (_, i) => i);
  
  return (
    <div className="flex items-center justify-center space-x-1 h-12">
      {bars.map((bar) => (
        <motion.div
          key={bar}
          className="w-1 bg-gradient-to-t from-purple-500 via-pink-500 to-blue-500 rounded-full"
          style={{
            height: Math.random() * 40 + 10,
          }}
          animate={{
            height: [
              Math.random() * 40 + 10,
              Math.random() * 50 + 15,
              Math.random() * 35 + 8,
              Math.random() * 45 + 12,
            ],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            repeatType: "reverse",
            delay: bar * 0.1,
          }}
        />
      ))}
    </div>
  );
};

export default function CallToAction() {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 overflow-hidden">
      {/* Animated background particles */}
      <div className="absolute inset-0">
        {Array.from({ length: 50 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white/20 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0.2, 0.8, 0.2],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Floating geometric shapes */}
      <motion.div
        className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-3xl backdrop-blur-sm"
        animate={{
          rotate: [0, 360],
          y: [-20, 20, -20],
        }}
        transition={{
          rotate: { duration: 20, repeat: Infinity, ease: "linear" },
          y: { duration: 6, repeat: Infinity, ease: "easeInOut" },
        }}
      />
      
      <motion.div
        className="absolute bottom-32 right-20 w-24 h-24 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full backdrop-blur-sm"
        animate={{
          rotate: [360, 0],
          x: [-15, 15, -15],
        }}
        transition={{
          rotate: { duration: 15, repeat: Infinity, ease: "linear" },
          x: { duration: 4, repeat: Infinity, ease: "easeInOut" },
        }}
      />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          className="max-w-5xl mx-auto relative"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {/* Main card with enhanced glassmorphism */}
          <div className="relative bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-12 md:p-16 text-center overflow-hidden shadow-2xl">
            {/* Animated gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 via-pink-600/20 to-blue-600/20 opacity-60"></div>
            
            {/* Animated border gradient */}
            <div className="absolute inset-0 rounded-3xl p-[1px] bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 opacity-50">
              <div className="w-full h-full bg-slate-900/80 rounded-3xl"></div>
            </div>

            {/* Floating elements inside card */}
            <motion.div
              className="absolute top-8 right-8 w-4 h-4 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full"
              animate={{ 
                scale: [1, 1.5, 1],
                opacity: [0.5, 1, 0.5] 
              }}
              transition={{ 
                duration: 2, 
                repeat: Infinity,
                ease: "easeInOut" 
              }}
            />
            
            <motion.div
              className="absolute bottom-8 left-8 w-3 h-3 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full"
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.4, 0.8, 0.4] 
              }}
              transition={{ 
                duration: 3, 
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1 
              }}
            />

            <div className="relative z-10">
              <motion.h2 
                className="text-5xl md:text-7xl font-bold mb-6 leading-tight"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                Ready to{' '}
                <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent animate-pulse">
                  Transform
                </span>
                <br />Your Streams?
              </motion.h2>
              
              <motion.p 
                className="text-xl md:text-2xl text-white/80 max-w-3xl mx-auto mb-12 leading-relaxed"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                Join the growing community of creators using BarsAnsBeats to boost engagement and create unforgettable streaming experiences.
              </motion.p>
             
              <motion.div 
                className="flex flex-col sm:flex-row justify-center gap-6 mb-12"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                <Button variant="primary" size="lg" href="#signup">
                  🚀 Get Started Free
                </Button>
                <Button variant="secondary" size="lg" href="#demo">
                  🎵 Request a Demo
                </Button>
              </motion.div>
             
              <motion.div 
                className="pt-8"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.8 }}
              >
                <div className="mb-6">
                  <AudioWave />
                </div>
                
                <div className="flex flex-wrap justify-center items-center gap-6 text-white/60 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    No credit card required
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                    Free plan available
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                    Set up in minutes
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
     
      {/* Enhanced background elements */}
          <div className="absolute top-1/4 -left-32 w-80 h-80 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full filter blur-3xl animate-pulse"></div>
      <div className="absolute top-3/4 -right-32 w-96 h-96 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full filter blur-3xl animate-pulse" style={{animationDelay: '3s'}}></div>
      <div className="absolute bottom-1/4 left-1/3 w-64 h-64 bg-gradient-to-r from-pink-500/15 to-red-500/15 rounded-full filter blur-3xl animate-pulse" style={{animationDelay: '6s'}}></div>
    </section>
  );
}