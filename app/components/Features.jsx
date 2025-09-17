import React from 'react';
import { Zap, Music, Podcast, BarChart, Users, Star, Shield, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

// --- REVISED FeatureCard COMPONENT (Minimal & Clean) ---
const FeatureCard = ({ icon, title, description }) => {
  return (
    <motion.div
      className="h-full bg-gray-900 p-6 rounded-xl border border-gray-800 transition-colors duration-300 hover:bg-gray-800 hover:border-gray-700"
      whileHover={{ y: -6 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
    >
      {/* Icon Container */}
      <div className="mb-5">
        <div className="w-12 h-12 rounded-lg bg-gray-800 flex items-center justify-center">
          <div className="text-white">
            {icon}
          </div>
        </div>
      </div>

      <h3 className="text-lg font-bold mb-2 text-white">
        {title}
      </h3>
      
      <p className="text-gray-400 leading-relaxed">
        {description}
      </p>
    </motion.div>
  );
};

// --- MAIN Features COMPONENT ---
export default function Features() {
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };
  
  const features = [
    {
      icon: <Music size={24} />,
      title: "Fan-Driven Playlists",
      description: "Let your audience vote on songs, creating an interactive experience they'll love."
    },
    {
      icon: <Zap size={24} />,
      title: "Real-Time Voting",
      description: "See votes come in live. Our system automatically updates the queue to keep the music flowing."
    },
    {
      icon: <Users size={24} />,
      title: "Audience Engagement",
      description: "Boost viewer retention by giving fans a direct impact on your stream's content."
    },
    {
      icon: <BarChart size={24} />,
      title: "Engagement Analytics",
      description: "Track which songs resonate with your audience to optimize future streams."
    },
    {
      icon: <Podcast size={24} />,
      title: "Multi-Platform Support",
      description: "Works seamlessly with Twitch, YouTube, and other popular streaming platforms."
    },
    {
      icon: <Star size={24} />,
      title: "Creator Controls",
      description: "Set song restrictions and approval flows to maintain full control of your stream's vibe."
    },
    {
      icon: <Shield size={24} />,
      title: "Copyright Protection",
      description: "Our system helps you avoid copyright strikes with pre-cleared music options."
    },
    {
      icon: <Clock size={24} />,
      title: "Queue Management",
      description: "Smart queuing ensures smooth transitions between tracks without any dead air."
    }
  ];
  
  return (
    <section id="features" className="bg-black py-24 md:py-32">
      <div className="container mx-auto px-4">
        <motion.div 
          className="text-center mb-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.5 }}
          variants={fadeInUp}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-5 text-white">
            Everything You Need to Engage
          </h2>
          <p className="text-lg md:text-xl text-gray-400 max-w-3xl mx-auto">
            BarsAndBeats gives you powerful tools to create an interactive music experience that keeps viewers coming back for more.
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              variants={fadeInUp}
            >
              <FeatureCard 
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}