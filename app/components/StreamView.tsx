"use client"
import React, { useEffect, useState, useRef } from 'react';
import { ChevronUp, ChevronDown, Play, Plus, Users, Clock, Share2, Copy, Check, SkipForward } from 'lucide-react';
import Pusher from 'pusher-js';
import YouTube from 'react-youtube';
import { toast } from "sonner";

// Interface for a stream/song in the queue
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

// Props for the StreamView component
interface StreamViewProps {
  creatorId: string;
  isCreator: boolean;
}

export default function StreamView({ creatorId, isCreator }: StreamViewProps) {
  // --- STATE MANAGEMENT ---
  const [streams, setStreams] = useState<Stream[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [currentVideo, setCurrentVideo] = useState<any>(null);
  const [previewVideo, setPreviewVideo] = useState<any>(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const [fetchingMetadata, setFetchingMetadata] = useState(false);
  const [addingToQueue, setAddingToQueue] = useState(false);
  
  const playerRef = useRef<any>(null);
  const playerStateIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const currentVideoRef = useRef(currentVideo);

  useEffect(() => {
    currentVideoRef.current = currentVideo;
  }, [currentVideo]);


  // --- CORE REAL-TIME SYNCHRONIZATION LOGIC ---

  const fetchCurrentState = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/streams/current?creatorId=${creatorId}`);
      if (!res.ok) throw new Error("Failed to fetch current stream state");
      
      const data = await res.json();

      if (data.currentVideo) {
        if (!currentVideoRef.current || currentVideoRef.current.id !== data.currentVideo.id) {
          setCurrentVideo(data.currentVideo);
        }
        
        setTimeout(() => {
          if (playerRef.current) {
            playerRef.current.seekTo(data.timestamp, true);
            if (data.isPlaying) playerRef.current.playVideo();
            else playerRef.current.pauseVideo();
          }
        }, 1500);

      } else {
        setCurrentVideo(null);
      }
    } catch (err) {
      setError("Could not load the current video. The stream might be offline.");
    } finally {
      setLoading(false);
    }
  };

  const refreshStreams = async () => {
    try {
      const freshStreams = await fetchStreams();
      setStreams(freshStreams);

       if (isCreator && !currentVideoRef.current && freshStreams.length > 0) {
        playNextVideo();
      }
    } catch (error: any) {
      setError(error.message);
    }
  };

  useEffect(() => {
    fetchCurrentState();
    refreshStreams();

    const pusherClient = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
    });
    const channel = pusherClient.subscribe(`stream-${creatorId}`);

    channel.bind('playlist-updated', refreshStreams);
    channel.bind('new-video-playing', fetchCurrentState);

    if (!isCreator) {
      channel.bind('playback-update', (data: { isPlaying: boolean; currentTime: number }) => {
        if (playerRef.current && typeof playerRef.current.getCurrentTime === 'function') {
          const timeDifference = Math.abs(playerRef.current.getCurrentTime() - data.currentTime);
          if (timeDifference > 2) playerRef.current.seekTo(data.currentTime, true);
          const playerState = playerRef.current.getPlayerState();
          if (data.isPlaying && playerState !== 1) playerRef.current.playVideo();
          else if (!data.isPlaying && playerState !== 2) playerRef.current.pauseVideo();
        }
      });
    }

    return () => pusherClient.unsubscribe(`stream-${creatorId}`);
  }, [creatorId, isCreator]);

  useEffect(() => {
    if (isCreator && currentVideo) {
      playerStateIntervalRef.current = setInterval(() => {
        if (playerRef.current && typeof playerRef.current.getPlayerState === 'function') {
          const playerState = playerRef.current.getPlayerState();
          const currentTime = playerRef.current.getCurrentTime();
          if (playerState === 1 || playerState === 2) {
            fetch('/api/streams/playback', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ creatorId, isPlaying: playerState === 1, currentTime }),
            });
          }
        }
      }, 1000);
    }
    return () => { if (playerStateIntervalRef.current) clearInterval(playerStateIntervalRef.current) };
  }, [isCreator, currentVideo, creatorId]);


  // --- PLAYER & PLAYLIST HANDLERS ---

  const onPlayerReady = (event: any) => {
    playerRef.current = event.target;
    if (!isCreator) playerRef.current.mute();
  };

  const onPlayerStateChange = (event: any) => {
    if (isCreator && event.data === 0) { // 0 = Ended
      playNextVideo();
    }
  };

  const playNextVideo = async () => {
    if (!isCreator) return;
    // Just tell the backend to handle it.
    await fetch('/api/streams/play-next', { method: 'POST' });
  };
  
  const fetchStreams = async (): Promise<Stream[]> => {
    const res = await fetch(`/api/streams?creatorId=${creatorId}`);
    if (!res.ok) throw new Error("Failed to fetch stream queue");
    const data = await res.json();
    return data.streams;
  };


  // --- UI ACTION HANDLERS (Add, Vote, etc.) ---

  const extractVideoId = (url: string) => {
    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    return url.match(regex)?.[1] || null;
  };

  const fetchVideoMetadata = async (videoId: string) => {
    setFetchingMetadata(true);
    try {
      const response = await fetch(`/api/youtube/metadata?videoId=${videoId}`);
      if (!response.ok) throw new Error("Metadata fetch failed");
      const data = await response.json();
      return { id: videoId, title: data.title, thumbnail: data.thumbnail, duration: data.duration };
    } catch (error) {
      return { id: videoId, title: 'Could not fetch title', thumbnail: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`, duration: 'N/A' };
    } finally {
      setFetchingMetadata(false);
    }
  };
  
  const handleUrlChange = async (url: string) => {
    setYoutubeUrl(url);
    const videoId = extractVideoId(url);
    if (videoId) {
      setPreviewVideo({ id: videoId, title: 'Loading...', thumbnail: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`, duration: '...' });
      const metadata = await fetchVideoMetadata(videoId);
      setPreviewVideo(metadata);
    } else {
      setPreviewVideo(null);
    }
  };

  const addToQueue = async () => {
    if (!previewVideo) return;
    setAddingToQueue(true);
    try {
      const res = await fetch('/api/streams', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          url: youtubeUrl,
          title: previewVideo.title,
          thumbnail: previewVideo.thumbnail,
          duration: previewVideo.duration, // Pass the duration
          creatorId 
        }),
      });
      if (!res.ok) {
        throw new Error(await res.json().then(d => d.message))
        
      }
      toast.success(`"${previewVideo.title}" was added to the queue!`);
      setYoutubeUrl('');
      setPreviewVideo(null);
    } catch (err: any) {
      setError(err.message);
      toast.error(err.message || "Failed to add song.");
    } finally {
      setAddingToQueue(false);
    }
  };

  const vote = async (streamId: string, type: 'upvote' | 'downvote') => {
    const originalStreams = [...streams];
     let votedSongTitle = '';
    // 1. Update the UI immediately (Optimistic Update)
    setStreams(currentStreams =>
      currentStreams.map(stream => {
        if (stream.id === streamId) {
           votedSongTitle = stream.title;
          const voteChange = type === 'upvote' ? 1 : -1;
          const alreadyVoted = stream.haveUpvoted;

          // Prevent invalid actions (e.g., upvoting twice, downvoting when not upvoted)
          if ((type === 'upvote' && alreadyVoted) || (type === 'downvote' && !alreadyVoted)) {
            return stream;
          }

          return {
            ...stream,
            votes: stream.votes + voteChange,
            haveUpvoted: type === 'upvote',
          };
        }
        return stream;
      }).sort((a, b) => b.votes - a.votes) // Re-sort immediately
    );

    if (votedSongTitle) {
      const message = type === 'upvote' 
        ? `Upvoted "${votedSongTitle}"` 
        : `Removed upvote for "${votedSongTitle}"`;
      toast.info(message);
    }

    // 2. Send the request to the server in the background
    try {
      const res = await fetch(`/api/streams/${type}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ streamId }),
      });

      if (!res.ok) {
        // 3. If the server fails, revert the change and show an error
        throw new Error(`Failed to ${type}`);
      }
      // On success, the backend's Pusher event will sync all other clients.
    } catch (error) {
      setError(`Failed to ${type}. Reverting change.`);
      toast.error(`Your ${type} failed. Please try again.`);
      setStreams(originalStreams); // Revert to the original state on failure
    }
  };

  const shareUrl = typeof window !== 'undefined' ? `${window.location.origin}/creator/${creatorId}` : '';
  const copyToClipboard = async () => {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-50 text-gray-900">
        <div className="container mx-auto px-4 py-6">
            <div className="text-center mb-8">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-2">🎵 BarsAndBeats</h1>
                <p className="text-gray-600">Vote for the next song and shape the playlist together!</p>
            </div>

            {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-700 text-sm">Error: {error}</p>
                    <button onClick={() => setError(null)} className="mt-2 text-red-600 hover:text-red-800 text-sm underline">Dismiss</button>
                </div>
            )}

            <div className="grid lg:grid-cols-3 gap-6 lg:items-start">
                <div className="lg:col-span-2 flex flex-col gap-6">
                    <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200 shadow-lg">
                        <div className="flex items-center gap-3 mb-4">
                            {currentVideo ? (<><div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div><span className="text-sm font-medium text-gray-600">NOW PLAYING</span></>) : (<span className="text-sm font-medium text-gray-600">NO VIDEO PLAYING</span>)}
                        </div>
                        <div className="aspect-video bg-black rounded-lg overflow-hidden mb-4">
                            {currentVideo ? (
                                <YouTube
                                    key={currentVideo.id}
                                    videoId={currentVideo.id}
                                    onReady={onPlayerReady}
                                    onStateChange={onPlayerStateChange}
                                    opts={{
                                        width: '100%',
                                        height: '100%',
                                        playerVars: { autoplay: 1, controls: isCreator ? 1 : 0, iv_load_policy: 3, modestbranding: 1 }
                                    }}
                                    className="w-full h-full"
                                />
                            ) : (
                                <div className="flex items-center justify-center h-full">
                                    <div className="text-center p-8">
                                        <h3 className="text-xl font-medium text-gray-500 mb-2">No Video Playing</h3>
                                        <p className="text-gray-400">{isCreator ? "The queue is empty. Add a song to start playing!" : "The stream is currently offline."}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                        {currentVideo && (<h2 className="text-xl font-semibold mb-2">{currentVideo.title}</h2>)}
                         {currentVideo && (
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1"><Clock className="w-4 h-4" />{currentVideo.duration}</span>
                        <span className="flex items-center gap-1"><Users className="w-4 h-4" />{streams.filter(s => s.id !== currentVideo.streamId).length} in queue</span>
                      </div>
                    )}
                    </div>

                    <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200 shadow-lg">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold flex items-center gap-2"><Plus className="w-5 h-5" />Submit a Song</h3>
                            <button onClick={() => setShowShareModal(true)} className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-medium hover:from-blue-600 hover:to-blue-700 transition-all transform hover:scale-105 shadow-md text-sm"><Share2 className="w-4 h-4" />Share Stream</button>
                        </div>
                        <div className="space-y-4">
                            <div><input type="text" placeholder="Paste YouTube URL here..." value={youtubeUrl} onChange={(e) => handleUrlChange(e.target.value)} className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent transition-all placeholder-gray-400" /></div>
                            {previewVideo && (
                              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                                <img src={previewVideo.thumbnail} alt="Preview" className="w-20 h-15 object-cover rounded" />
                                <div className="flex-1">
                                  <h4 className="font-medium">{fetchingMetadata ? 'Loading...' : previewVideo.title}</h4>
                                  <p className="text-sm text-gray-500">{previewVideo.duration}</p>
                                </div>
                                <button onClick={addToQueue} disabled={addingToQueue || fetchingMetadata} className="px-6 py-2 bg-gradient-to-r from-gray-700 to-gray-600 text-white rounded-lg font-medium hover:from-gray-800 hover:to-gray-700 transition-all disabled:opacity-50">{addingToQueue ? 'Adding...' : 'Add to Queue'}</button>
                              </div>
                            )}
                        </div>
                    </div>
                   
                </div>

                <div className="lg:col-span-1">
                    <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200 shadow-lg h-full flex flex-col">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold flex items-center gap-2"><Play className="w-5 h-5" />Up Next ({streams.filter(stream => stream.id !== currentVideo?.streamId).length})</h3>
                              {isCreator && streams.filter(stream => stream.id !== currentVideo?.streamId).length > 0 && (
                                <button
                                  onClick={playNextVideo}
                                  className="flex items-center gap-2 px-3 py-1 bg-gray-700 text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"
                                  title="Force play next song"
                                >
                                  <SkipForward className="w-4 h-4" />
                                  Play Next
                                </button>
                              )}
                        </div>
                        <div className="space-y-3 flex-1 overflow-y-auto">
                            {loading && streams.length === 0 ? (
                              <div className="text-center py-8 text-gray-500">Loading queue...</div>
                            ) : streams.filter(stream => stream.id !== currentVideo?.streamId).length === 0 ? (
                              <div className="text-center py-8 text-gray-500">No songs in queue.</div>
                            ) : (
                              streams
                                .filter(stream => stream.id !== currentVideo?.streamId)
                                .map((song, index) => ( // Note: Sorting is now done inside the vote function
                                  <div key={song.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                                    <div className="text-xs font-bold text-gray-500 w-6">#{index + 1}</div>
                                    <img src={song.thumbnail} alt={song.title} className="w-12 h-9 object-cover rounded" />
                                    <div className="flex-1 min-w-0">
                                      <h4 className="font-medium text-sm truncate">{song.title}</h4>
                                      <p className="text-xs text-gray-500">by {song.submittedBy}</p>
                                    </div>
                                    <div className="flex flex-col items-center gap-1">
                                      <button onClick={() => vote(song.id, 'upvote')} disabled={song.haveUpvoted} className="p-1 rounded disabled:opacity-50 text-green-600 hover:bg-green-100"><ChevronUp className="w-4 h-4" /></button>
                                      <span className="text-xs font-bold">{song.votes}</span>
                                      <button onClick={() => vote(song.id, 'downvote')} disabled={!song.haveUpvoted} className="p-1 rounded disabled:opacity-50 text-red-600 hover:bg-red-100"><ChevronDown className="w-4 h-4" /></button>
                                    </div>
                                  </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>

        {showShareModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Share Your Stream</h3>
                <button onClick={() => setShowShareModal(false)} className="text-gray-400 hover:text-gray-600 text-xl">×</button>
              </div>
              <div className="space-y-4">
                <p className="text-gray-600 text-sm">Invite your friends to join the stream and vote for songs together!</p>
                <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-center gap-2 mb-2"><span className="text-sm font-medium text-gray-700">Stream Link:</span></div>
                  <div className="flex items-center gap-2">
                    <input type="text" value={shareUrl} readOnly className="flex-1 px-3 py-2 text-sm bg-white border border-gray-300 rounded focus:outline-none" />
                    <button onClick={copyToClipboard} className="flex items-center gap-1 px-3 py-2 bg-gray-700 text-white rounded hover:bg-gray-800 transition-colors">{copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}{copied ? 'Copied!' : 'Copy'}</button>
                  </div>
                </div>
                <div className="text-center pt-4 border-t border-gray-200"><p className="text-xs text-gray-500">💡 Tip: Copy the link and share it anywhere to invite others!</p></div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}