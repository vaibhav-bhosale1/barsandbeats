"use client"
import { motion } from 'framer-motion';

export default function FeatureCard({ icon, title, description }) {
  return (
    <motion.div 
      className="glass p-6 rounded-xl h-full"
      whileHover={{ y: -5, boxShadow: '0 10px 30px -10px rgba(139, 92, 246, 0.2)' }}
      transition={{ duration: 0.3 }}
    >
      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-500/20 to-primary-500/10 flex items-center justify-center mb-4 text-primary-400">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-3">{title}</h3>
      <p className="text-white/70">{description}</p>
    </motion.div>
  );
}