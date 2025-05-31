"use client"
import { motion } from 'framer-motion';

export default function AudioWave() {
  return (
    <div className="audio-wave mx-auto">
      <motion.span
        animate={{ height: ["20%", "100%", "20%"] }}
        transition={{ 
          duration: 1.5, 
          repeat: Infinity,
          ease: "easeInOut"
        }}
      ></motion.span>
      <motion.span
        animate={{ height: ["20%", "100%", "20%"] }}
        transition={{ 
          duration: 1.5, 
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.2
        }}
      ></motion.span>
      <motion.span
        animate={{ height: ["20%", "100%", "20%"] }}
        transition={{ 
          duration: 1.5, 
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.4
        }}
      ></motion.span>
      <motion.span
        animate={{ height: ["20%", "100%", "20%"] }}
        transition={{ 
          duration: 1.5, 
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.6
        }}
      ></motion.span>
      <motion.span
        animate={{ height: ["20%", "100%", "20%"] }}
        transition={{ 
          duration: 1.5, 
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.8
        }}
      ></motion.span>
    </div>
  );
}