import React from 'react';
import { motion } from 'framer-motion';

// --- REVISED Button Component (Minimal & Clean) ---
const Button = ({ href, variant, children }) => {
  const baseClasses = "inline-flex items-center justify-center px-8 py-3 font-semibold transition-colors duration-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-white";
  const variants = {
    primary: "bg-white text-black hover:bg-gray-200",
    secondary: "bg-transparent border border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white"
  };

  return (
    <a href={href} className={`${baseClasses} ${variants[variant]}`}>
      {children}
    </a>
  );
};

// --- REVISED AudioWave Component (Grayscale) ---
const AudioWave = () => {
  const bars = Array.from({ length: 24 });
  return (
    <div className="flex items-end justify-center space-x-1 h-10">
      {bars.map((_, i) => (
        <motion.div
          key={i}
          className="w-1 bg-gray-700 rounded-full"
          animate={{
            height: ["4px", "24px", "8px", "40px", "12px", "4px"],
            opacity: [0.5, 1, 0.7, 1, 0.5, 0.5],
          }}
          transition={{
            duration: 1.5 + Math.random(),
            repeat: Infinity,
            repeatType: "reverse",
            delay: i * 0.1,
            ease: "easeInOut"
          }}
        />
      ))}
    </div>
  );
};

// --- MAIN CallToAction Component ---
export default function CallToAction() {
  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
  };
  
  return (
    <section className="bg-black text-white py-24 md:py-32">
      <div className="container mx-auto px-4">
        <motion.div
          className="max-w-3xl mx-auto text-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
          variants={fadeInUp}
        >
          <div className="mb-8">
            <AudioWave />
          </div>

          <h2 className="text-4xl md:text-5xl font-bold mb-5">
            Ready to Transform Your Streams?
          </h2>

          <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-10">
            Join the growing community of creators using BarsAndBeats to boost engagement and create unforgettable streaming experiences.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-8">
            <Button variant="primary" href="/dashboard">
              Get Started Free
            </Button>
            <Button variant="secondary" href="#demo">
              Request a Demo
            </Button>
          </div>
          
          <div className="flex flex-wrap justify-center items-center gap-x-6 gap-y-2 text-gray-500 text-sm">
            <span>No credit card required</span>
            <span className="hidden md:inline">•</span>
            <span>Free plan available</span>
            <span className="hidden md:inline">•</span>
            <span>Set up in minutes</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}