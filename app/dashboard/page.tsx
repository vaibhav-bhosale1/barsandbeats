"use client"

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, Variants } from 'framer-motion';
import { Music, LogIn, LayoutDashboard, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";

// Define a type for the loading state to avoid using strings
type LoadingState = 'joinDialog' | 'myStream' | null;

export default function Dashboard() {
  const router = useRouter();
  const [creatorId, setCreatorId] = useState('');
  const [loadingButton, setLoadingButton] = useState<LoadingState>(null);

  // ✨ FIX: Add type for the form event
  const handleJoinStream = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (loadingButton) return;

    if (creatorId.trim()) {
      setLoadingButton('joinDialog');
      router.push(`/creator/${creatorId.trim()}`);
    } else {
      toast.error("Please enter a valid Stream ID.");
    }
  };
  
  const handleMyStreamClick = () => {
    if (loadingButton) return;
    setLoadingButton('myStream');
  };

  // ✨ FIX: Ensure the variants object matches Framer Motion's expected types
  const containerVariants: Variants = {
    hidden: { opacity: 0, scale: 0.98 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };
  
  const primaryButtonStyles = "bg-white text-black hover:bg-gray-200 h-14 w-full text-base sm:w-64 font-semibold disabled:opacity-70";
  const secondaryButtonStyles = "bg-gray-900/50 border border-gray-800 text-gray-300 hover:bg-gray-800 hover:border-gray-700 h-14 w-full text-base sm:w-64 font-semibold disabled:opacity-70";

  return (
    <div 
      className="flex items-center justify-center min-h-screen p-4 bg-black text-white"
      style={{
        backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)',
        backgroundSize: '30px 30px',
      }}
    >
      <motion.div
        className="w-full max-w-2xl relative"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div 
          className="bg-[#121212] border border-gray-800 rounded-2xl shadow-2xl shadow-gray-900/50 p-8 sm:p-12 text-center"
          style={{
            background: 'radial-gradient(circle at 50% 50%, rgba(38, 38, 38, 0.5) 0%, #121212 70%)',
          }}
        >
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-12 h-12 rounded-lg bg-gray-900/80 border border-gray-800 flex items-center justify-center">
              <Music size={24} className="text-white" />
            </div>
            <h1 className="text-4xl font-bold">BarsAndBeats</h1>
          </div>
          <p className="text-gray-400 text-lg mb-10">
            The stage is set. Where are you heading?
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Dialog>
              <DialogTrigger asChild>
                <Button className={`${primaryButtonStyles} flex gap-2`} disabled={loadingButton !== null}>
                  <LogIn size={18} /> Join a Stream
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px] bg-[#121212] border-gray-800 text-white">
                <DialogHeader>
                  <DialogTitle className="text-white">Join a Stream</DialogTitle>
                  <DialogDescription className="text-gray-400">
                    Paste the Stream ID provided by the creator to join their session.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleJoinStream}>
                  <div className="grid gap-4 py-4">
                    <Input
                      id="creatorId"
                      placeholder="Enter Stream ID here..."
                      value={creatorId}
                      onChange={(e) => setCreatorId(e.target.value)}
                      className="bg-gray-900 border-gray-700 text-white focus:ring-white"
                    />
                  </div>
                  <DialogFooter>
                    <Button type="submit" className={primaryButtonStyles} disabled={loadingButton !== null}>
                      {loadingButton === 'joinDialog' ? (
                        <Loader2 size={20} className="animate-spin" />
                      ) : (
                        'Join Stream'
                      )}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>

            <Link href="/mystreams" passHref onClick={handleMyStreamClick}>
              <Button variant="outline" className={`${secondaryButtonStyles} flex gap-2`} disabled={loadingButton !== null}>
                {loadingButton === 'myStream' ? (
                  <Loader2 size={20} className="animate-spin" />
                ) : (
                  <>
                    <LayoutDashboard size={18} /> My Stream
                  </>
                )}
              </Button>
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}