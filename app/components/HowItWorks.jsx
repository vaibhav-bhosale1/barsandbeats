import React from 'react';
import { motion } from 'framer-motion';
import { Users, Music, Smile, ArrowDown, Sparkles, Zap } from 'lucide-react';

export default function HowItWorks() {
  const steps = [
    {
      icon: <Music size={32} />,
      title: "Connect Your Stream",
      description: "Link your streaming account to BarsAnsBeats with our easy one-click integration. Supports all major platforms.",
      color: "from-purple-500 to-blue-600",
      shadowColor: "shadow-purple-500/50",
      accentIcon: <Zap size={16} />,
      number: "01"
    },
    {
      icon: <Users size={32} />,
      title: "Fans Vote on Songs",
      description: "Share your unique BarsAnsBeats link with viewers so they can vote on what plays next. Democracy in music!",
      color: "from-pink-500 to-rose-600",
      shadowColor: "shadow-pink-500/50",
      accentIcon: <Sparkles size={16} />,
      number: "02"
    },
    {
      icon: <Smile size={32} />,
      title: "Enjoy the Experience",
      description: "Watch engagement rise as your audience becomes part of the streaming experience. Pure magic!",
      color: "from-emerald-500 to-teal-600",
      shadowColor: "shadow-emerald-500/50",
      accentIcon: <Sparkles size={16} />,
      number: "03"
    }
  ];

  // Animated connection line component
  const AnimatedLine = ({ index }) => (
    <motion.div
      className="absolute left-1/2 transform -translate-x-1/2 w-1 bg-gradient-to-b from-purple-500/30 via-pink-500/30 to-emerald-500/30 hidden lg:block"
      style={{
        top: `${32 + index * 400}px`,
        height: '300px'
      }}
      initial={{ scaleY: 0, opacity: 0 }}
      whileInView={{ scaleY: 1, opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 1, delay: index * 0.2 }}
    >
      {/* Animated pulse dot */}
      <motion.div
        className="absolute top-0 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full"
        animate={{
          y: [0, 300],
          opacity: [1, 0],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          delay: index * 0.5,
          ease: "easeInOut"
        }}
      />
    </motion.div>
  );

  // Floating particles component
  const FloatingParticles = () => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {Array.from({ length: 20 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-gradient-to-r from-purple-400/30 to-pink-400/30 rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [-20, -100, -20],
            x: [0, Math.random() * 40 - 20, 0],
            opacity: [0.3, 0.8, 0.3],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: 6 + Math.random() * 4,
            repeat: Infinity,
            delay: Math.random() * 3,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );

  return (
    <section id="how-it-works" className="relative min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/30 to-slate-900 overflow-hidden">
      <FloatingParticles />
      
      {/* Background geometric shapes */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute top-20 left-20 w-64 h-64 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-full filter blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
        />
        <motion.div
          className="absolute bottom-32 right-20 w-80 h-80 bg-gradient-to-br from-blue-500/10 to-teal-500/10 rounded-full filter blur-3xl"
          animate={{
            scale: [1, 0.8, 1],
            rotate: [360, 180, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear",
          }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-emerald-500/5 to-blue-500/5 rounded-full filter blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      <div className="relative z-10 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header section */}
          <motion.div 
            className="text-center mb-24"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              className="inline-flex items-center px-4 py-2 bg-white/5 backdrop-blur-sm rounded-full border border-white/10 mb-6"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Sparkles className="w-4 h-4 text-purple-400 mr-2" />
              <span className="text-white/80 text-sm">Simple Process</span>
            </motion.div>
            
            <h2 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              How{' '}
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                BarsAnsBeats
              </span>
              <br />Works
            </h2>
            <p className="text-xl md:text-2xl text-white/70 max-w-3xl mx-auto leading-relaxed">
              Get started in minutes with our simple three-step process that transforms your streaming experience
            </p>
          </motion.div>
          
          {/* Steps container */}
          <div className="relative max-w-6xl mx-auto">
            {/* Animated connection lines */}
            {steps.slice(0, -1).map((_, index) => (
              <AnimatedLine key={index} index={index} />
            ))}
            
            <div className="space-y-32">
              {steps.map((step, index) => (
                <motion.div 
                  key={index}
                  className="relative"
                  initial={{ opacity: 0, y: 60 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.8, delay: index * 0.2 }}
                >
                  <div className={`lg:flex items-center ${index % 2 === 0 ? '' : 'lg:flex-row-reverse'}`}>
                    {/* Content side */}
                    <div className={`lg:w-1/2 ${index % 2 === 0 ? 'lg:pr-16' : 'lg:pl-16'}`}>
                      <motion.div
                        className={`${index % 2 === 0 ? 'lg:text-right' : 'lg:text-left'} text-center lg:text-left`}
                        whileHover={{ x: index % 2 === 0 ? -10 : 10 }}
                        transition={{ duration: 0.3 }}
                      >
                        {/* Step number */}
                        <div className={`inline-flex items-center mb-4 ${index % 2 === 0 ? 'lg:justify-end' : 'lg:justify-start'} justify-center`}>
                          <span className="text-6xl font-bold bg-gradient-to-r from-white/20 to-white/10 bg-clip-text text-transparent mr-4">
                            {step.number}
                          </span>
                          <div className="flex items-center space-x-2">
                            <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${step.color} flex items-center justify-center`}>
                              {step.accentIcon}
                            </div>
                          </div>
                        </div>
                        
                        <h3 className="text-3xl md:text-4xl font-bold mb-6 text-white">
                          {step.title}
                        </h3>
                        <p className="text-xl text-white/70 leading-relaxed max-w-md mx-auto lg:mx-0">
                          {step.description}
                        </p>
                      </motion.div>
                    </div>
                    
                    {/* Icon side */}
                    <div className={`lg:w-1/2 flex ${index % 2 === 0 ? 'lg:justify-end' : 'lg:justify-start'} justify-center mt-12 lg:mt-0`}>
                      <motion.div
                        className="relative group"
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.3 }}
                      >
                        {/* Main icon container */}
                        <div className={`relative w-32 h-32 rounded-3xl bg-gradient-to-br ${step.color} flex items-center justify-center ${step.shadowColor} shadow-2xl`}>
                          <div className="text-white">
                            {step.icon}
                          </div>
                          
                          {/* Animated ring */}
                          <motion.div
                            className={`absolute inset-0 rounded-3xl border-2 border-gradient-to-br ${step.color} opacity-50`}
                            animate={{
                              scale: [1, 1.2, 1],
                              opacity: [0.5, 0.8, 0.5],
                            }}
                            transition={{
                              duration: 2,
                              repeat: Infinity,
                              ease: "easeInOut",
                            }}
                          />
                          
                          {/* Outer glow ring */}
                          <div className={`absolute inset-0 w-40 h-40 -m-4 rounded-full bg-gradient-to-br ${step.color} opacity-20 filter blur-xl group-hover:opacity-30 transition-opacity duration-300`}></div>
                        </div>
                        
                        {/* Floating elements around icon */}
                        <motion.div
                          className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center"
                          animate={{
                            rotate: [0, 360],
                            scale: [1, 1.2, 1],
                          }}
                          transition={{
                            rotate: { duration: 3, repeat: Infinity, ease: "linear" },
                            scale: { duration: 2, repeat: Infinity, ease: "easeInOut" },
                          }}
                        >
                          <Sparkles size={12} className="text-white" />
                        </motion.div>
                      </motion.div>
                    </div>
                  </div>
                  
                  {/* Arrow connector for mobile */}
                  {index < steps.length - 1 && (
                    <motion.div
                      className="flex justify-center mt-16 lg:hidden"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: 0.3 }}
                    >
                      <div className="w-12 h-12 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 flex items-center justify-center">
                        <motion.div
                          animate={{ y: [0, 5, 0] }}
                          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                        >
                          <ArrowDown className="w-6 h-6 text-white/50" />
                        </motion.div>
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
    
  );
}