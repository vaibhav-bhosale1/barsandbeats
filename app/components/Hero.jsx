"use client";
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

// --- Icon Components ---
const ChevronUpIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="m18 15-6-6-6 6" />
  </svg>
);
const ChevronDownIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="m6 9 6 6 6-6" />
  </svg>
);
const MusicNoteIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 18V5l12-2v13" />
    <circle cx="6" cy="18" r="3" />
    <circle cx="18" cy="16" r="3" />
  </svg>
);

// --- Button Component ---
const Button = ({ variant, size, children, href, ...props }) => {
  const baseClasses = "inline-flex items-center justify-center font-semibold transition-colors duration-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-white";
  const variants = {
    primary: "bg-white text-black hover:bg-gray-200",
    secondary: "bg-transparent border border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white"
  };
  const sizes = { lg: "px-6 py-3 text-base" };
  const Component = href ? 'a' : 'button';
  return (
    <Component href={href} className={`${baseClasses} ${variants[variant]} ${sizes[size]}`} {...props}>
      {children}
    </Component>
  );
};

// --- QueueItem Component (Final Fix) ---
const QueueItem = ({ item, onUpvote }) => {
  const { rank, title, addedBy, votes, thumbnailUrl } = item;
  return (
    <div className="group flex items-center gap-4 px-3 py-3 rounded-lg transition-all duration-200 hover:bg-gray-800/50">
      <span className="text-base font-bold text-gray-500 w-6 text-center transition-colors group-hover:text-white">{rank}</span>
      <div className="w-12 h-12 bg-gray-800 rounded-md flex-shrink-0 flex items-center justify-center">
        {thumbnailUrl ? (
          <img src={thumbnailUrl} alt={title} className="w-full h-full object-cover rounded-md" />
        ) : (
          <MusicNoteIcon className="text-gray-600" />
        )}
      </div>

      {/* FINAL FIX: This container needs both min-w-0 AND overflow-hidden */}
      <div className="flex-grow text-left min-w-0 overflow-hidden">
        <p className="font-semibold text-white truncate">{title}</p>
        <p className="text-sm text-gray-400 truncate">Added by {addedBy}</p>
      </div>

      <div className="w-24 flex items-center justify-end flex-shrink-0">
        <span className="text-gray-400 font-semibold group-hover:hidden">
          {votes} votes
        </span>
        <div className="hidden items-center gap-1 text-white group-hover:flex">
          <button onClick={onUpvote} className="p-1.5 rounded-full hover:bg-gray-700">
            <ChevronUpIcon />
          </button>
          <button className="p-1.5 rounded-full hover:bg-gray-700">
            <ChevronDownIcon />
          </button>
        </div>
      </div>
    </div>
  );
};

// --- Main Hero Component ---
export default function Hero() {
  const initialQueue = [
    { id: 1, title: "TMKOC - Title Track", addedBy: "Vaibhav", votes: 12 },
    { id: 2, title: "Another Song Title", addedBy: "Alex", votes: 8 },
    { id: 3, title: "Minimalist's Anthem", addedBy: "Jane", votes: 5 },
  ];
  const [queue, setQueue] = useState(initialQueue);
  const handleUpvote = (id) => {
    const newQueue = queue.map(item =>
      item.id === id ? { ...item, votes: item.votes + 1 } : item
    );
    newQueue.sort((a, b) => b.votes - a.votes);
    const rankedQueue = newQueue.map((item, index) => ({ ...item, rank: index + 1 }));
    setQueue(rankedQueue);
  };
  const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } };
  const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } } };

  return (
    <section className="bg-black text-white pt-32 pb-24 md:pt-40 md:pb-32">
      <div className="container mx-auto px-4">
        <motion.div className="max-w-4xl mx-auto text-center" variants={container} initial="hidden" animate="show">
          <motion.h1 variants={item} className="mb-6 font-bold text-4xl md:text-6xl leading-tight">
            The Ultimate Music Queue for Your Stream
          </motion.h1>
          <motion.p variants={item} className="mb-8 text-lg md:text-xl text-gray-400 max-w-2xl mx-auto">
            Let your audience vote for the next song and shape the playlist together. Create a truly interactive and shared experience.
          </motion.p>
          <motion.div variants={item} className="flex flex-col sm:flex-row justify-center gap-4 mb-16">
            <Link href="/dashboard" passHref>
              <Button variant="primary" size="lg">Get Started Free</Button>
            </Link>
            <Button variant="secondary" size="lg" href="#how-it-works">See How It Works</Button>
          </motion.div>
          <motion.div variants={item} className="relative mx-auto max-w-5xl border border-gray-800 bg-[#121212] rounded-xl p-4 md:p-6 shadow-2xl shadow-gray-900/50">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <div className="aspect-video bg-black rounded-lg mb-4 overflow-hidden">
                  <img src="/f1.png" alt="Featured stream content" className="w-full h-full object-cover" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-left truncate">Lose My Mind (feat. Doja Cat)</h3>
                  <p className="text-gray-400 text-left">Don Toliver</p>
                </div>
              </div>
              <div className="flex flex-col min-w-0">
                <h4 className="text-xs font-medium tracking-widest text-gray-500 uppercase mb-3 text-left">UP NEXT</h4>
                <div className="flex flex-col">
                  {queue.map((queueItem, index) => (
                    <React.Fragment key={queueItem.id}>
                      <motion.div layout transition={{ duration: 0.5, type: 'spring' }}>
                        <QueueItem
                          item={queueItem}
                          onUpvote={() => handleUpvote(queueItem.id)}
                        />
                      </motion.div>
                      {index < queue.length - 1 && <hr className="border-gray-800 my-1"/>}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}