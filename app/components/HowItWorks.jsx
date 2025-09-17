import React from 'react';
import { motion } from 'framer-motion';
import { Users, Music, Smile } from 'lucide-react';

export default function HowItWorks() {
  // Simplified steps data - removed all color/style properties
  const steps = [
    {
      icon: <Music size={32} />,
      title: "Connect Your Stream",
      description: "Link your streaming account to BarsAndBeats with our easy one-click integration.",
      number: "01"
    },
    {
      icon: <Users size={32} />,
      title: "Fans Vote on Songs",
      description: "Share your unique link with viewers so they can vote on what plays next. Democracy in music!",
      number: "02"
    },
    {
      icon: <Smile size={32} />,
      title: "Enjoy the Experience",
      description: "Watch engagement rise as your audience becomes a core part of the streaming experience.",
      number: "03"
    }
  ];

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
  };

  return (
    <section id="how-it-works" className="relative bg-black text-white py-24 md:py-32">
      <div className="container mx-auto px-4">
        {/* Header Section */}
        <motion.div 
          className="text-center mb-20 md:mb-24"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
          variants={fadeInUp}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-5">
            How It Works
          </h2>
          <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto">
            Get started in minutes with a simple three-step process that transforms your stream.
          </p>
        </motion.div>
        
        {/* Steps Timeline Container */}
        <div className="relative max-w-3xl mx-auto">
          {/* The static vertical line for the timeline */}
          <div className="absolute left-1/2 top-12 bottom-12 w-px bg-gray-800 hidden lg:block" />

          <div className="space-y-16 md:space-y-24">
            {steps.map((step, index) => (
              <motion.div 
                key={index}
                className="relative lg:grid lg:grid-cols-2 lg:gap-12 lg:items-center"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.5 }}
                variants={fadeInUp}
              >
                {/* Text Content - alternates left/right on desktop */}
                <div className={`relative text-center lg:text-left ${index % 2 !== 0 ? 'lg:order-2' : ''}`}>
                  <span className="absolute -top-12 lg:top-1/2 lg:-translate-y-1/2 left-1/2 lg:left-auto lg:right-full lg:-translate-x-1/2 lg:mr-12 -translate-x-1/2 text-7xl font-bold text-gray-800 z-0">
                    {step.number}
                  </span>
                  <div className="relative z-10">
                    <h3 className="text-3xl font-bold mb-4">
                      {step.title}
                    </h3>
                    <p className="text-lg text-gray-400">
                      {step.description}
                    </p>
                  </div>
                </div>

                {/* Icon - the "node" on the timeline */}
                <div className={`flex justify-center mt-8 lg:mt-0 ${index % 2 !== 0 ? 'lg:order-1' : ''}`}>
                  <div className="w-24 h-24 bg-gray-900 border-2 border-gray-800 rounded-full flex items-center justify-center">
                    <div className="text-white">
                      {step.icon}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}