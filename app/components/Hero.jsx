import React from 'react';
import { motion } from 'framer-motion';

// Mock Button component with enhanced styling
const Button = ({ variant, size, children, href, ...props }) => {
  const baseClasses = "inline-flex items-center justify-center font-semibold transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900";
  
  const variants = {
    primary: "bg-gradient-to-r from-purple-600 via-pink-600 to-red-500 hover:from-purple-700 hover:via-pink-700 hover:to-red-600 text-white shadow-2xl hover:shadow-purple-500/50",
    secondary: "bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 hover:border-white/30 shadow-xl hover:shadow-white/20"
  };
  
  const sizes = {
    lg: "px-8 py-4 text-lg rounded-2xl"
  };
  
  return (
    <button 
      className={`${baseClasses} ${variants[variant]} ${sizes[size]}`}
      {...props}
    >
      {children}
    </button>
  );
};

// Enhanced AudioWave component
const AudioWave = () => {
  return (
    <div className="flex items-center justify-center gap-1 py-6">
      {[...Array(24)].map((_, i) => (
        <motion.div
          key={i}
          className="w-1 bg-gradient-to-t from-purple-500 via-pink-400 to-cyan-300 rounded-full shadow-lg"
          animate={{
            height: [8, Math.random() * 40 + 20, 8],
            opacity: [0.4, 1, 0.4]
          }}
          transition={{
            duration: 0.6 + Math.random() * 0.8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.05
          }}
          style={{ height: '8px' }}
        />
      ))}
    </div>
  );
};

export default function Hero() {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  return (
    <section className="relative pt-32 pb-24 md:pt-40 md:pb-32 overflow-hidden bg-gradient-to-br from-gray-900 via-purple-900/20 to-pink-900/20">
      <div className="container mx-auto px-4">
        <motion.div 
          className="max-w-4xl mx-auto text-center"
          variants={container}
          initial="hidden"
          animate="show"
        >
          <motion.div variants={item} className="mb-6 inline-block">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full blur opacity-70 group-hover:opacity-100 transition duration-1000 animate-pulse"></div>
              <span className="relative inline-block px-6 py-3 rounded-full bg-gray-900/80 backdrop-blur-sm text-purple-300 text-sm font-medium border border-purple-700/50 shadow-xl">
                Launching Soon — Join the Waitlist
              </span>
            </div>
          </motion.div>
          
          <motion.h1 variants={item} className="mb-6 font-black text-4xl md:text-6xl lg:text-7xl leading-tight">
            Let Your <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 bg-clip-text text-transparent">Fans Choose</span> What Plays on Your Stream
          </motion.h1>
          
          <motion.p variants={item} className="mb-8 text-lg md:text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Connect with your audience like never before. BarsAnsBeats lets your fans vote for songs to play during your stream, creating a shared experience that keeps them coming back.
          </motion.p>
          
          <motion.div variants={item} className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
            <Button variant="primary" size="lg" href="#signup">
              Get Started Free
            </Button>
            <Button variant="secondary" size="lg" href="#how-it-works">
              See How It Works
            </Button>
          </motion.div>
          
          <motion.div 
            variants={item}
            className="relative mx-auto max-w-3xl"
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 rounded-3xl blur-lg opacity-60 animate-pulse"></div>
            <div className="relative backdrop-blur-xl bg-gray-900/60 border border-white/20 p-8 md:p-10 rounded-3xl overflow-hidden shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center shadow-lg">
                        <span className="text-white font-bold text-lg">TB</span>
                      </div>
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-gray-900 animate-pulse"></div>
                    </div>
                    <div className="text-left">
                      <h4 className="font-semibold text-lg">TechByte</h4>
                      <p className="text-sm text-gray-400">Live Coding Stream</p>
                    </div>
                  </div>
                  <span className="px-4 py-2 rounded-full bg-green-500/20 text-green-400 text-sm font-medium border border-green-500/30">
                    Live Now
                  </span>
                </div>
                
                <h3 className="text-xl font-semibold mb-6 text-center">Current Song Poll</h3>
                
                <div className="space-y-4 mb-8">
                  <motion.div 
                    className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-gray-800/60 to-gray-700/60 border border-white/10 hover:border-purple-500/50 transition-all cursor-pointer group hover:scale-[1.02] shadow-lg"
                    whileHover={{ y: -2 }}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center shadow-lg">
                        <span className="text-white font-bold">1</span>
                      </div>
                      <div>
                        <p className="font-semibold text-lg">Synthwave Overdrive</p>
                        <p className="text-sm text-gray-400">RetroWave Studios</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="h-2 w-28 bg-gray-700 rounded-full overflow-hidden">
                        <motion.div 
                          className="h-full bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: "75%" }}
                          transition={{ duration: 1.5, ease: "easeOut" }}
                        />
                      </div>
                      <span className="text-sm font-semibold min-w-[40px]">75%</span>
                    </div>
                  </motion.div>
                  
                  <motion.div 
                    className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-gray-800/60 to-gray-700/60 border border-white/10 hover:border-purple-500/50 transition-all cursor-pointer group hover:scale-[1.02] shadow-lg"
                    whileHover={{ y: -2 }}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center shadow-lg">
                        <span className="text-white font-bold">2</span>
                      </div>
                      <div>
                        <p className="font-semibold text-lg">Code & Chill</p>
                        <p className="text-sm text-gray-400">Lofi Developers</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="h-2 w-28 bg-gray-700 rounded-full overflow-hidden">
                        <motion.div 
                          className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: "25%" }}
                          transition={{ duration: 1.5, ease: "easeOut" }}
                        />
                      </div>
                      <span className="text-sm font-semibold min-w-[40px]">25%</span>
                    </div>
                  </motion.div>
                </div>
                
                <div className="p-6 rounded-xl bg-gradient-to-r from-purple-900/40 to-pink-900/40 border border-white/10">
                  <AudioWave />
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
      
      {/* Enhanced Background Elements */}
           <div className="absolute top-1/4 -left-32 w-80 h-80 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full filter blur-3xl animate-pulse"></div>
      <div className="absolute top-3/4 -right-32 w-96 h-96 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full filter blur-3xl animate-pulse" style={{animationDelay: '3s'}}></div>
      <div className="absolute bottom-1/4 left-1/3 w-64 h-64 bg-gradient-to-r from-pink-500/15 to-red-500/15 rounded-full filter blur-3xl animate-pulse" style={{animationDelay: '6s'}}></div>
    </section>
  );
}