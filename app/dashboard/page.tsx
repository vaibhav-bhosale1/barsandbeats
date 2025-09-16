"use client"

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
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
} from "@/components/ui/dialog"
import { toast } from "sonner";

export default function Dashboard() {
  const router = useRouter();
  const [creatorId, setCreatorId] = useState('');

  const handleJoinStream = () => {
    if (creatorId.trim()) {
      router.push(`/creator/${creatorId.trim()}`);
    } else {
      toast.error("Please enter a valid Stream ID.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-zinc-50">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-2">
          🎵 BarsAndBeats
        </h1>
        <p className="text-gray-600 text-lg">Your collaborative music experience starts here.</p>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-6">
        <Dialog>
          <DialogTrigger asChild>
            <Button size="lg" className="w-64">Join a Stream</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Join a Stream</DialogTitle>
              <DialogDescription>
                Paste the Stream ID provided by the creator to join their session.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <Input
                id="creatorId"
                placeholder="Enter Stream ID here..."
                value={creatorId}
                onChange={(e) => setCreatorId(e.target.value)}
                className="col-span-3"
              />
            </div>
            <DialogFooter>
              <Button type="submit" onClick={handleJoinStream}>Join Stream</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Link href="/mystreams" passHref>
          <Button size="lg" variant="outline" className="w-64">Go to My Stream</Button>
        </Link>
      </div>
    </div>
  );
}