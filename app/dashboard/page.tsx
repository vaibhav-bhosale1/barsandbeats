"use client"
import React, { useEffect, useState } from 'react';
import { ChevronUp, ChevronDown, Play, Plus, Users, Clock, Share2, Copy, Check } from 'lucide-react';

const REFRESH_INTERVAL = 10 * 1000;

interface Stream {
  id: string;
  title: string;
  thumbnail: string;
  duration: string;
  votes: number;
  submittedBy: string;
  extractedId: string;
  haveUpvoted: boolean;
}

export default function Dashboard() {
  const [streams, setStreams] = useState<Stream[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [currentVideo, setCurrentVideo] = useState({
    id: 'dQw4w9WgXcQ',
    title: 'Rick Astley - Never Gonna Give You Up',
    thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
    duration: '3:33'
  });
  const [previewVideo, setPreviewVideo] = useState<null | {
    id: string;
    title: string;
    thumbnail: string;
    duration: string;
  }>(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const [copied, setCopied] = useState(false);

 

  const refreshStreams = async () => {
    try {
      console.log("[Dashboard] Starting stream refresh...");
      setLoading(true);
      setError(null);
      
      const startTime = performance.now();
      const res = await fetch('/api/streams', {
        credentials: "include",
        headers: { 'Cache-Control': 'no-cache' }
      });
      const fetchTime = performance.now() - startTime;
      
      console.log(`[Dashboard] Fetch completed in ${fetchTime.toFixed(1)}ms, status: ${res.status}`);
      
      if (!res.ok) {
        let errorData = { message: `HTTP error ${res.status}` };
        try {
          errorData = await res.json();
        } catch (e) {
          console.warn("[Dashboard] Failed to parse error response:", e);
        }
        
        console.error("[Dashboard] API Error:", errorData);
        throw new Error(errorData.message || `API request failed with status ${res.status}`);
      }
      
      const data = await res.json();
      console.log("[Dashboard] API Response:", data);
      
      if (!data.streams) {
        throw new Error("Invalid response format - missing streams data");
      }
      
      setStreams(data.streams);
    } catch (error) {
      console.error("[Dashboard] Refresh error:", error);
      setError(error.message);
      
      // Show user-friendly error message
      setError("Not logged in");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshStreams();
    const interval = setInterval(refreshStreams, REFRESH_INTERVAL);
    return () => clearInterval(interval);
  }, []);

  // Extract YouTube video ID from URL
  const extractVideoId = (url: string) => {
    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  // Handle URL input change and generate preview
  const handleUrlChange = (url: string) => {
    setYoutubeUrl(url);
    const videoId = extractVideoId(url);
    if (videoId) {
      setPreviewVideo({
        id: videoId,
        title: 'Loading...',
        thumbnail: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
        duration: '0:00'
      });
    } else {
      setPreviewVideo(null);
    }
  };

  // Add song to queue
  const addToQueue = async () => {
    if (!previewVideo) return;

    try {
      const session = await fetch('/api/auth/session', {
        credentials: 'include'
      }).then(res => res.json());

      if (!session?.user?.email) {
        throw new Error('You need to be logged in to add songs');
      }

      const user = await fetch('/api/user', {
        credentials: 'include'
      }).then(res => res.json());

      if (!user?.id) {
        throw new Error('User not found');
      }

      const res = await fetch('/api/streams', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          creatorId: user.id,
          url: youtubeUrl
        }),
        credentials: 'include'
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to add song');
      }

      setYoutubeUrl('');
      setPreviewVideo(null);
      await refreshStreams();

    } catch (error: any) {
      console.error('Error adding song:', error);
      setError(error.message);
    }
  };

  // Vote functions
  const upvote = async (streamId: string) => {
    try {
      const res = await fetch("/api/streams/upvote", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ streamId }),
        credentials: "include"
      });

      if (!res.ok) {
        throw new Error('Failed to upvote');
      }

      await refreshStreams();
    } catch (error) {
      console.error("Failed to upvote:", error);
      setError('Failed to upvote. Please try again.');
    }
  };

  const downvote = async (streamId: string) => {
    try {
      const res = await fetch("/api/streams/downvote", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ streamId }),
        credentials: "include"
      });

      if (!res.ok) {
        throw new Error('Failed to downvote');
      }

      await refreshStreams();
    } catch (error) {
      console.error("Failed to downvote:", error);
      setError('Failed to downvote. Please try again.');
    }
  };

  // Play next song
  const playNext = (song: Stream) => {
    setCurrentVideo({
      id: song.extractedId,
      title: song.title,
      thumbnail: song.thumbnail,
      duration: song.duration
    });
  };

  // Share functionality
  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
  const shareText = "🎵 Join my music stream! Vote for the next song and help shape our playlist together!";

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };
    return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-50 text-gray-900">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-2">
            🎵 StreamVote Music
          </h1>
          <p className="text-gray-600">Vote for the next song and shape the playlist together!</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Video Player */}
          <div className="lg:col-span-2">
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200 shadow-lg">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-gray-600">NOW PLAYING</span>
              </div>
              
              <div className="aspect-video bg-black rounded-lg overflow-hidden mb-4">
                <iframe
                  width="100%"
                  height="100%"
                  src={`https://www.youtube.com/embed/${currentVideo.id}?autoplay=1`}
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                ></iframe>
              </div>
              
              <h2 className="text-xl font-semibold mb-2">{currentVideo.title}</h2>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {currentVideo.duration}
                </span>
                <span className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  {streams.length} in queue
                </span>
              </div>
            </div>

            {/* Add New Song */}
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200 shadow-lg mt-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Plus className="w-5 h-5" />
                  Submit a Song
                </h3>
                <button
                  onClick={() => setShowShareModal(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-medium hover:from-blue-600 hover:to-blue-700 transition-all transform hover:scale-105 shadow-md text-sm"
                >
                  <Share2 className="w-4 h-4" />
                  Share Stream
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <input
                    type="text"
                    placeholder="Paste YouTube URL here..."
                    value={youtubeUrl}
                    onChange={(e) => handleUrlChange(e.target.value)}
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent transition-all placeholder-gray-400"
                  />
                </div>
                
                {previewVideo && (
                  <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <img 
                      src={previewVideo.thumbnail} 
                      alt="Preview"
                      className="w-20 h-15 object-cover rounded"
                    
                    />
                    <div className="flex-1">
                      <h4 className="font-medium">{previewVideo.title}</h4>
                      <p className="text-sm text-gray-500">{previewVideo.duration}</p>
                    </div>
                    <button
                      onClick={addToQueue}
                      className="px-6 py-2 bg-gradient-to-r from-gray-700 to-gray-600 text-white rounded-lg font-medium hover:from-gray-800 hover:to-gray-700 transition-all transform hover:scale-105"
                    >
                      Add to Queue
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Queue */}
          <div className="lg:col-span-1">
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200 shadow-lg sticky top-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Play className="w-5 h-5" />
                Up Next ({streams.length})
              </h3>
              
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {loading ? (
                  <div className="text-center py-8 text-gray-500">
                    <p>Loading streams...</p>
                  </div>
                ) : error ? (
                  <div className="text-center py-8 text-red-500">
                    <p>Error: {error}</p>
                    <button 
                      onClick={refreshStreams}
                      className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                      Retry
                    </button>
                  </div>
                ) : streams.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <p>No songs in queue</p>
                    <p className="text-sm">Add some music above!</p>
                  </div>
                ) : (
                  streams.map((song, index) => (
                    <div key={song.id} className="group relative">
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-all">
                        <div className="text-xs font-bold text-gray-500 w-6">
                          #{index + 1}
                        </div>
                        
                        <img 
                          src={song.thumbnail} 
                          alt={song.title}
                          className="w-12 h-9 object-cover rounded cursor-pointer"
                          onClick={() => playNext(song)}
                         
                        />
                        
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm truncate">{song.title}</h4>
                          <p className="text-xs text-gray-500">by {song.submittedBy}</p>
                        </div>
                        
                        <div className="flex flex-col items-center gap-1">
                          <button
                            onClick={() => upvote(song.id)} // Now uses the correct database ID
                            className={`p-1 rounded transition-colors ${
                              song.haveUpvoted 
                                ? 'bg-green-100 text-green-700' 
                                : 'hover:bg-green-100 text-green-600'
                            }`}
                            disabled={song.haveUpvoted}
                          >
                            <ChevronUp className="w-4 h-4" />
                          </button>
                          
                          <span className="text-xs font-bold px-2 py-1 bg-gray-200 text-gray-800 rounded">
                            {song.votes}
                          </span>
                          
                          <button
                            onClick={() => downvote(song.id)} // You'll need to implement downvote API
                            className="p-1 hover:bg-red-100 rounded transition-colors"
                          >
                            <ChevronDown className="w-4 h-4 text-red-600" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Share Modal - keeping your existing implementation */}
        {showShareModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Share Your Stream</h3>
                <button
                  onClick={() => setShowShareModal(false)}
                  className="text-gray-400 hover:text-gray-600 text-xl"
                >
                  ×
                </button>
              </div>
              
              <div className="space-y-4">
                <p className="text-gray-600 text-sm">
                  Invite your friends to join the stream and vote for songs together!
                </p>
                
                <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-medium text-gray-700">Stream Link:</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={shareUrl}
                      readOnly
                      className="flex-1 px-3 py-2 text-sm bg-white border border-gray-300 rounded focus:outline-none"
                    />
                    <button
                      onClick={copyToClipboard}
                      className="flex items-center gap-1 px-3 py-2 bg-gray-700 text-white rounded hover:bg-gray-800 transition-colors"
                    >
                      {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      {copied ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                </div>
                
                
                
                <div className="text-center pt-4 border-t border-gray-200">
                  <p className="text-xs text-gray-500">
                    💡 Tip: Copy the link and share it anywhere to invite others!
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}