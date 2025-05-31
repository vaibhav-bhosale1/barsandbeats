import React, { useState } from 'react';
import { motion } from 'framer-motion';

export default function CreatorShowcase() {
  const [activeCreator, setActiveCreator] = useState(0);
  
  const creators = [
    {
      name: "MusicMaven",
      avatar: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      category: "Music Producer",
      followers: "124K",
      testimonial: "BarsAndBeats helped me boost my viewer retention by 40%. My fans love being able to influence what I play during production sessions!",
      stats: {
        engagement: "+43%",
        retention: "+40%",
        followers: "+15K"
      }
    },
    {
      name: "GameMaster",
      avatar: "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      category: "Gaming Streamer",
      followers: "89K",
      testimonial: "My community loves picking the soundtrack while I play. It's created this awesome shared experience that keeps them coming back every stream.",
      stats: {
        engagement: "+51%",
        retention: "+37%",
        followers: "+12K"
      }
    },
    {
      name: "ArtistAlley",
      avatar: "https://images.pexels.com/photos/1858175/pexels-photo-1858175.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      category: "Digital Artist",
      followers: "76K",
      testimonial: "Having my audience choose the music while I draw has been a game-changer. They feel like they're part of the creative process now.",
      stats: {
        engagement: "+38%",
        retention: "+45%",
        followers: "+9K"
      }
    }
  ];
  
  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.6 } }
  };
  
  return (
    <section id="creators" className="relative py-24 md:py-32 overflow-hidden bg-gradient-to-b from-gray-800 to-gray-900">
      <div className="container mx-auto px-4">
        <motion.div 
          className="text-center mb-20"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeIn}
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 leading-tight">
            Success Stories from{' '}
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 bg-clip-text text-transparent">
              Real Creators
            </span>
          </h2>
          <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            See how streamers across different niches are engaging their audiences with BarsAnsBeats
          </p>
        </motion.div>
        
        <div className="max-w-6xl mx-auto">
          {/* Creator Selection */}
          <div className="flex justify-center mb-12 space-x-6">
            {creators.map((creator, index) => (
              <motion.button
                key={index}
                className={`group relative rounded-2xl overflow-hidden transition-all duration-300 ${
                  activeCreator === index 
                    ? 'w-20 h-20 scale-110' 
                    : 'w-16 h-16 opacity-60 hover:opacity-100 hover:scale-105'
                }`}
                onClick={() => setActiveCreator(index)}
                whileHover={{ scale: activeCreator === index ? 1.1 : 1.05 }}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeIn}
                transition={{ delay: index * 0.1 }}
              >
                {/* Animated border for active creator */}
                {activeCreator === index && (
                  <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 rounded-2xl blur opacity-75 animate-pulse"></div>
                )}
                
                <div className={`relative w-full h-full rounded-2xl overflow-hidden border-2 transition-all duration-300 ${
                  activeCreator === index 
                    ? 'border-purple-500 shadow-2xl shadow-purple-500/50' 
                    : 'border-white/20 hover:border-white/40'
                }`}>
                  <img 
                    src={creator.avatar} 
                    alt={creator.name} 
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                </div>
              </motion.button>
            ))}
          </div>
          
          {/* Creator Showcase Card */}
          <motion.div 
            className="relative max-w-5xl mx-auto"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            key={activeCreator}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Animated background glow */}
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 rounded-3xl blur-xl opacity-50 animate-pulse"></div>
            
            <div className="relative backdrop-blur-xl bg-gray-900/70 border border-white/20 p-10 md:p-12 rounded-3xl overflow-hidden shadow-2xl">
              {/* Background gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-pink-500/5 to-red-500/10"></div>
              
              <div className="relative z-10">
                <div className="flex flex-col lg:flex-row gap-10">
                  {/* Creator Profile */}
                  <div className="lg:w-1/3 flex flex-col items-center text-center">
                    <div className="relative mb-6">
                      <div className="absolute -inset-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full blur opacity-50 animate-pulse"></div>
                      <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-white/20 shadow-2xl">
                        <img 
                          src={creators[activeCreator].avatar} 
                          alt={creators[activeCreator].name} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                    
                    <h4 className="text-2xl font-bold mb-2 text-white">
                      {creators[activeCreator].name}
                    </h4>
                    <p className="text-purple-300 text-lg mb-6 font-medium">
                      {creators[activeCreator].category}
                    </p>
                    
                    <div className="px-6 py-3 rounded-2xl bg-gradient-to-r from-purple-600/30 to-pink-600/30 border border-purple-500/30 backdrop-blur-sm">
                      <span className="text-white font-semibold">
                        {creators[activeCreator].followers} Followers
                      </span>
                    </div>
                  </div>
                  
                  {/* Testimonial & Stats */}
                  <div className="lg:w-2/3">
                    <div className="mb-8">
                      <blockquote className="text-xl md:text-2xl italic text-gray-200 leading-relaxed relative">
                        <span className="text-4xl text-purple-400 absolute -top-2 -left-2">"</span>
                        <span className="relative z-10">
                          {creators[activeCreator].testimonial}
                        </span>
                        <span className="text-4xl text-purple-400 absolute -bottom-4 -right-2">"</span>
                      </blockquote>
                    </div>
                    
                    {/* Stats Grid */}
                    <div className="grid grid-cols-3 gap-4">
                      {Object.entries(creators[activeCreator].stats).map(([key, value], index) => (
                        <motion.div
                          key={key}
                          className="group relative"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <div className="absolute -inset-0.5 bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl blur opacity-0 group-hover:opacity-75 transition duration-300"></div>
                          <div className="relative backdrop-blur-sm bg-gray-800/60 border border-white/10 group-hover:border-green-500/50 p-6 rounded-2xl text-center transition-all duration-300 hover:scale-105">
                            <p className="text-gray-400 text-sm mb-2 capitalize font-medium">
                              {key === 'followers' ? 'New Followers' : key}
                            </p>
                            <p className="text-2xl font-bold text-green-400 group-hover:text-white transition-colors duration-300">
                              {value}
                            </p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* Enhanced Background Elements */}
           <div className="absolute top-1/4 -left-32 w-80 h-80 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full filter blur-3xl animate-pulse"></div>
      <div className="absolute top-3/4 -right-32 w-96 h-96 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full filter blur-3xl animate-pulse" style={{animationDelay: '3s'}}></div>
      <div className="absolute bottom-1/4 left-1/3 w-64 h-64 bg-gradient-to-r from-pink-500/15 to-red-500/15 rounded-full filter blur-3xl animate-pulse" style={{animationDelay: '6s'}}></div>
    </section>
  );
}