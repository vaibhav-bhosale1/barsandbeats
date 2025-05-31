import React from 'react';
import { Zap, Music, Podcast, BarChart, Users, Star, Shield, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

// Enhanced FeatureCard component
const FeatureCard = ({ icon, title, description }) => {
  return (
    <motion.div 
      className="group relative h-full"
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      {/* Animated border gradient */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-500 animate-pulse"></div>
      
      <div className="relative h-full backdrop-blur-sm bg-gray-900/60 border border-white/10 group-hover:border-white/30 p-8 rounded-2xl transition-all duration-300 shadow-xl group-hover:shadow-2xl">
        {/* Icon container with enhanced styling */}
        <div className="mb-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-600/20 to-pink-600/20 border border-purple-500/30 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
            <div className="text-purple-400 group-hover:text-white transition-colors duration-300">
              {icon}
            </div>
          </div>
        </div>
        
        <h3 className="text-xl font-bold mb-4 text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-pink-400 transition-all duration-300">
          {title}
        </h3>
        
        <p className="text-gray-400 group-hover:text-gray-300 leading-relaxed transition-colors duration-300">
          {description}
        </p>
        
        {/* Subtle shine effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 rounded-2xl"></div>
      </div>
    </motion.div>
  );
};

export default function Features() {
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };
  
  const features = [
    {
      icon: <Music size={28} />,
      title: "Fan-Driven Playlists",
      description: "Let your audience vote on which songs to play next, creating an interactive experience they'll love."
    },
    {
      icon: <Zap size={28} />,
      title: "Real-Time Voting",
      description: "See votes come in live during your stream, with automatic updates to keep the music flowing."
    },
    {
      icon: <Users size={28} />,
      title: "Audience Engagement",
      description: "Boost viewer retention by giving fans a direct impact on your stream content."
    },
    {
      icon: <BarChart size={28} />,
      title: "Engagement Analytics",
      description: "Track which songs resonate with your audience to optimize future streams."
    },
    {
      icon: <Podcast size={28} />,
      title: "Multi-Platform Support",
      description: "Works seamlessly with Twitch, YouTube, TikTok and other popular streaming platforms."
    },
    {
      icon: <Star size={28} />,
      title: "Creator Controls",
      description: "Set song restrictions, blacklists, and approval flows to maintain your stream's vibe."
    },
    {
      icon: <Shield size={28} />,
      title: "Copyright Protection",
      description: "Our system helps you avoid copyright strikes with pre-cleared music options."
    },
    {
      icon: <Clock size={28} />,
      title: "Queue Management",
      description: "Smart song queuing ensures smooth transitions between tracks without dead air."
    }
  ];
  
  return (
    <section id="features" className="relative py-24 md:py-32 overflow-hidden bg-gradient-to-b from-gray-900 to-gray-800">
      <div className="container mx-auto px-4">
        <motion.div 
          className="text-center mb-20"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          variants={fadeInUp}
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 leading-tight">
            Everything You Need to{' '}
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 bg-clip-text text-transparent">
              Engage Your Audience
            </span>
          </h2>
          <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            BarsAnsBeats gives you powerful tools to create an interactive music experience that keeps viewers engaged and coming back for more.
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
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
      
      {/* Enhanced Background Elements */}
      <div className="absolute top-1/4 -left-32 w-80 h-80 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full filter blur-3xl animate-pulse"></div>
      <div className="absolute top-3/4 -right-32 w-96 h-96 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full filter blur-3xl animate-pulse" style={{animationDelay: '3s'}}></div>
      <div className="absolute bottom-1/4 left-1/3 w-64 h-64 bg-gradient-to-r from-pink-500/15 to-red-500/15 rounded-full filter blur-3xl animate-pulse" style={{animationDelay: '6s'}}></div>
    </section>
  );
}