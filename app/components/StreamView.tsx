"use client"
import React, { useEffect, useState, useRef } from 'react';
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

interface StreamViewProps {
  creatorId?: string;
}

const parseDuration = (duration: string): number => {
  const parts = duration.split(':').map(part => parseInt(part));
  let seconds = 0;
  
  if (parts.length === 1) {
    seconds = parts[0];
  } else if (parts.length === 2) {
    seconds = parts[0] * 60 + parts[1];
  } else if (parts.length === 3) {
    seconds = parts[0] * 3600 + parts[1] * 60 + parts[2];
  }
  
  return seconds;
};

export default function StreamView({
  creatorId
}: StreamViewProps) {
  const [streams, setStreams] = useState<Stream[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [currentVideo, setCurrentVideo] = useState<{
    id: string;
    title: string;
    thumbnail: string;
    duration: string;
    streamId: string;
  } | null>(null);
  const [previewVideo, setPreviewVideo] = useState<null | {
    id: string;
    title: string;
    thumbnail: string;
    duration: string;
  }>(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const [fetchingMetadata, setFetchingMetadata] = useState(false);
  const [addingToQueue, setAddingToQueue] = useState(false);
  
  const playerRef = useRef<any>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const videoEndedRef = useRef(false);
  const streamsRef = useRef<Stream[]>([]);
  const currentVideoRef = useRef(currentVideo);

  // Sync refs with state
  useEffect(() => {
    streamsRef.current = streams;
    currentVideoRef.current = currentVideo;
  }, [streams, currentVideo]);

  const fetchStreams = async () => {
    const url = creatorId 
      ? `/api/streams?creatorId=${creatorId}`
      : '/api/streams';
    
    const res = await fetch(url, {
      credentials: "include",
      headers: { 
        'Cache-Control': 'no-cache',
        'Content-Type': 'application/json'
      }
    });
    
    if (!res.ok) {
      const errorText = await res.text();
      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch (e) {
        throw new Error(`HTTP error ${res.status}: ${errorText}`);
      }
      throw new Error(errorData.message || `API request failed with status ${res.status}`);
    }
    
    const data = await res.json();
    return data.streams;
  };

  const findHighestVotedVideo = (streamList: Stream[]): Stream | null => {
    if (streamList.length === 0) return null;
    
    return streamList.reduce((highest, current) => 
      current.votes > highest.votes ? current : highest, streamList[0]
    );
  };

  const deleteCurrentVideoFromDB = async (streamId: string) => {
    try {
      const response = await fetch(`/api/streams/${streamId}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      if (!response.ok) {
        console.error('Failed to delete stream from database');
      }
    } catch (error) {
      console.error('Error deleting stream:', error);
    }
  };

  const playNextVideo = async () => {
    try {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      
      if (currentVideoRef.current?.streamId) {
        await deleteCurrentVideoFromDB(currentVideoRef.current.streamId);
      }
      
      const freshStreams = await fetchStreams();
      const nextVideo = findHighestVotedVideo(freshStreams);
      
      if (nextVideo) {
        setCurrentVideo({
          id: nextVideo.extractedId,
          title: nextVideo.title,
          thumbnail: nextVideo.thumbnail,
          duration: nextVideo.duration,
          streamId: nextVideo.id
        });
        
        // Filter out the next video from streams
        setStreams(freshStreams.filter((stream:Stream) => stream.id !== nextVideo.id));
        videoEndedRef.current = false;
        preloadNextVideo(nextVideo.id, freshStreams);
      } else {
        setCurrentVideo(null);
        setStreams([]);
      }
    } catch (error) {
      console.error('Failed to play next video:', error);
      setError('Failed to play next video');
    }
  };

  const preloadNextVideo = (excludeStreamId?: string, streamList?: Stream[]) => {
    const availableStreams = streamList || streamsRef.current;
    const filteredStreams = excludeStreamId 
      ? availableStreams.filter(stream => stream.id !== excludeStreamId)
      : availableStreams;
      
    if (filteredStreams.length === 0) return;
    
    const nextVideo = filteredStreams.reduce((highest, current) => 
      current.votes > highest.votes ? current : highest, filteredStreams[0]
    );
    
    if (nextVideo) {
      const preloadIframe = document.createElement('iframe');
      preloadIframe.src = `https://www.youtube.com/embed/${nextVideo.extractedId}?autoplay=0&mute=1`;
      preloadIframe.style.display = 'none';
      preloadIframe.style.position = 'absolute';
      preloadIframe.style.left = '-9999px';
      document.body.appendChild(preloadIframe);
      
      setTimeout(() => {
        if (document.body.contains(preloadIframe)) {
          document.body.removeChild(preloadIframe);
        }
      }, 5000);
    }
  };

  const refreshStreams = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const freshStreams = await fetchStreams();
      
      // Filter out current video if exists
      let filteredStreams = freshStreams;
      if (currentVideoRef.current) {
        filteredStreams = freshStreams.filter(
          (stream:Stream) => stream.id !== currentVideoRef.current?.streamId
        );
      }
      
      setStreams(filteredStreams);
      
      // Only auto-play if no video is currently playing
      if (!currentVideoRef.current && freshStreams.length > 0) {
        const highestVoted = findHighestVotedVideo(freshStreams);
        
        if (highestVoted) {
          setCurrentVideo({
            id: highestVoted.extractedId,
            title: highestVoted.title,
            thumbnail: highestVoted.thumbnail,
            duration: highestVoted.duration,
            streamId: highestVoted.id
          });
          
          // Filter out the new current video
          setStreams(freshStreams.filter((stream:Stream) => stream.id !== highestVoted.id));
          videoEndedRef.current = false;
          preloadNextVideo(highestVoted.id, freshStreams);
        }
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleVideoEnd = () => {
    if (videoEndedRef.current) return;
    videoEndedRef.current = true;
    
    console.log('Video ended, playing next...');
    setTimeout(() => {
      playNextVideo();
    }, 500);
  };

  const setupVideoEndFallback = () => {
    if (!currentVideoRef.current) return;
    
    const duration = parseDuration(currentVideoRef.current.duration);
    if (duration > 0) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      
      timeoutRef.current = setTimeout(() => {
        if (!videoEndedRef.current) {
          console.log('Fallback: Video should have ended by now');
          handleVideoEnd();
        }
      }, (duration + 5) * 1000);
    }
  };

  useEffect(() => {
    refreshStreams();
    const interval = setInterval(refreshStreams, REFRESH_INTERVAL);
    
    return () => {
      clearInterval(interval);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [creatorId]);

  useEffect(() => {
    if (!currentVideo) return;
    
    let checkInterval: NodeJS.Timeout;
    let iframeLoaded = false;
    
    const initIframe = () => {
      try {
        const player = playerRef.current;
        if (player && player.contentWindow && !iframeLoaded) {
          player.contentWindow.postMessage(
            '{"event":"listening","id":"widget","channel":"widget"}',
            'https://www.youtube.com'
          );
          iframeLoaded = true;
          console.log('YouTube iframe initialized');
        }
      } catch (e) {
        console.error('Error initializing iframe:', e);
      }
    };

    const checkVideoState = () => {
      try {
        const player = playerRef.current;
        if (player && player.contentWindow && iframeLoaded) {
          player.contentWindow.postMessage(
            '{"event":"command","func":"getPlayerState","args":""}',
            'https://www.youtube.com'
          );
        }
      } catch (e) {
        console.error('Error checking video state:', e);
      }
    };

    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== 'https://www.youtube.com') return;
      
      try {
        const data = JSON.parse(event.data);
        
        if (data.event === 'onStateChange') {
          console.log('YouTube state change:', data.info);
          if (data.info === 0) {
            console.log('YouTube player state: ended');
            handleVideoEnd();
          }
        }
        
        if (data.info && data.info.playerState === 0) {
          console.log('YouTube player state: ended (direct)');
          handleVideoEnd();
        }
      } catch (e) {}
    };

    const initTimeout = setTimeout(initIframe, 1000);
    const stateCheckTimeout = setTimeout(() => {
      checkInterval = setInterval(checkVideoState, 2000);
    }, 2000);
    
    window.addEventListener('message', handleMessage);
    setupVideoEndFallback();

    return () => {
      if (initTimeout) clearTimeout(initTimeout);
      if (stateCheckTimeout) clearTimeout(stateCheckTimeout);
      if (checkInterval) {
        clearInterval(checkInterval);
      }
      window.removeEventListener('message', handleMessage);
      iframeLoaded = false;
    };
  }, [currentVideo]);

  const extractVideoId = (url: string) => {
    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  const fetchVideoMetadata = async (videoId: string) => {
    try {
      setFetchingMetadata(true);
      
      const response = await fetch(`/api/youtube/metadata?videoId=${videoId}`, {
        credentials: 'include'
      });
      
      if (response.ok) {
        const data = await response.json();
        return {
          id: videoId,
          title: data.title || 'Unknown Title',
          thumbnail: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
          duration: data.duration || '0:00'
        };
      }
      
      const oEmbedResponse = await fetch(
        `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`
      );
      
      if (oEmbedResponse.ok) {
        const oEmbedData = await oEmbedResponse.json();
        return {
          id: videoId,
          title: oEmbedData.title || 'Unknown Title',
          thumbnail: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
          duration: '0:00'
        };
      }
      
      return {
        id: videoId,
        title: 'Unknown Title',
        thumbnail: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
        duration: '0:00'
      };
      
    } catch (error) {
      return {
        id: videoId,
        title: 'Unknown Title',
        thumbnail: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
        duration: '0:00'
      };
    } finally {
      setFetchingMetadata(false);
    }
  };

  const handleUrlChange = async (url: string) => {
    setYoutubeUrl(url);
    const videoId = extractVideoId(url);
    
    if (videoId) {
      setPreviewVideo({
        id: videoId,
        title: 'Loading...',
        thumbnail: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
        duration: '0:00'
      });
      
      const metadata = await fetchVideoMetadata(videoId);
      setPreviewVideo(metadata);
    } else {
      setPreviewVideo(null);
    }
  };

  const addToQueue = async () => {
    if (!previewVideo) return;

    try {
      setAddingToQueue(true);
      setError(null);

      const requestBody = {
        url: youtubeUrl,
        title: previewVideo.title,
        thumbnail: previewVideo.thumbnail,
        duration: previewVideo.duration,
        ...(creatorId && { creatorId })
      };

      const addRes = await fetch('/api/streams', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(requestBody),
        credentials: 'include'
      });
      
      if (!addRes.ok) {
        const errorText = await addRes.text();
        let errorData;
        try {
          errorData = JSON.parse(errorText);
        } catch (e) {
          throw new Error(`Server error: ${errorText}`);
        }
        throw new Error(errorData.message || 'Failed to add song to queue');
      }

      setYoutubeUrl('');
      setPreviewVideo(null);
      await refreshStreams();

    } catch (error: any) {
      setError(error.message || 'Failed to add song to queue');
    } finally {
      setAddingToQueue(false);
    }
  };

  const upvote = async (streamId: string) => {
    try {
      const res = await fetch("/api/streams/upvote", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ streamId }),
        credentials: "include"
      });
      
      if (res.ok) {
        await refreshStreams();
      }
    } catch (error) {
      setError('Failed to upvote. Please try again.');
    }
  };

  const downvote = async (streamId: string) => {
    try {
      const res = await fetch("/api/streams/downvote", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ streamId }),
        credentials: "include"
      });
      
      if (res.ok) {
        await refreshStreams();
      }
    } catch (error) {
      setError('Failed to downvote. Please try again.');
    }
  };

  const shareUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}/creator/${creatorId || 'your-id'}` 
    : '';

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

        {/* Error Display */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 text-sm">Error: {error}</p>
            <button 
              onClick={() => setError(null)}
              className="mt-2 text-red-600 hover:text-red-800 text-sm underline"
            >
              Dismiss
            </button>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-6 lg:items-start">
          {/* Main Video Player */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200 shadow-lg">
              <div className="flex items-center gap-3 mb-4">
                {currentVideo ? (
                  <>
                    <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium text-gray-600">NOW PLAYING</span>
                  </>
                ) : (
                  <span className="text-sm font-medium text-gray-600">NO VIDEO PLAYING</span>
                )}
              </div>
              
              {currentVideo ? (
                <>
                  <div className="aspect-video bg-black rounded-lg overflow-hidden mb-4">
                    <iframe
                      ref={playerRef}
                      width="100%"
                      height="100%"
                      src={`https://www.youtube.com/embed/${currentVideo.id}?autoplay=1&enablejsapi=1&origin=${typeof window !== 'undefined' ? window.location.origin : ''}`}
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
                </>
              ) : (
                <div className="aspect-video flex items-center justify-center bg-gray-100 rounded-lg mb-4">
                  <div className="text-center p-8">
                    <h3 className="text-xl font-medium text-gray-500 mb-2">No Video Playing</h3>
                    <p className="text-gray-400">Add songs to the queue to start playing</p>
                  </div>
                </div>
              )}
            </div>

            {/* Add New Song */}
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200 shadow-lg">
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
                      <h4 className="font-medium">
                        {fetchingMetadata ? (
                          <span className="flex items-center gap-2">
                            <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
                            Loading title...
                          </span>
                        ) : (
                          previewVideo.title
                        )}
                      </h4>
                      <p className="text-sm text-gray-500">{previewVideo.duration}</p>
                    </div>
                    <button
                      onClick={addToQueue}
                      disabled={addingToQueue || fetchingMetadata || previewVideo.title === 'Loading...'}
                      className="px-6 py-2 bg-gradient-to-r from-gray-700 to-gray-600 text-white rounded-lg font-medium hover:from-gray-800 hover:to-gray-700 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    >
                      {addingToQueue ? (
                        <span className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Adding...
                        </span>
                      ) : fetchingMetadata ? 'Loading...' : 'Add to Queue'}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Queue */}
          <div className="lg:col-span-1 lg:h-full">
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200 shadow-lg h-full flex flex-col">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Play className="w-5 h-5" />
                Up Next ({streams.length})
              </h3>
              
              <div className="space-y-3 flex-1 overflow-y-auto">
                {loading ? (
                  <div className="text-center py-8 text-gray-500">
                    <div className="w-8 h-8 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin mx-auto mb-2"></div>
                    <p>Loading streams...</p>
                  </div>
                ) : error ? (
                  <div className="text-center py-8 text-red-500">
                    <p>Error loading queue</p>
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
                  streams
                    .sort((a, b) => b.votes - a.votes) // Sort by votes descending
                    .map((song, index) => (
                    <div key={song.id} className="group relative">
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-all">
                        <div className="text-xs font-bold text-gray-500 w-6">
                          #{index + 1}
                        </div>
                        
                        <img 
                          src={song.thumbnail} 
                          alt={song.title}
                          className="w-12 h-9 object-cover rounded"
                        />
                        
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm truncate">{song.title}</h4>
                          <p className="text-xs text-gray-500">by {song.submittedBy}</p>
                        </div>
                        
                        <div className="flex flex-col items-center gap-1">
                          <button
                            onClick={() => upvote(song.id)}
                            className={`p-1 rounded transition-colors ${
                              song.haveUpvoted 
                                ? 'bg-green-100 text-green-700' 
                                : 'hover:bg-green-100 text-green-600'
                            }`}
                            disabled={song.haveUpvoted}
                          >
                            <ChevronUp className="w-4 h-4 cursor-pointer" />
                          </button>
                          
                          <span className="text-xs font-bold px-2 py-1 bg-gray-200 text-gray-800 rounded">
                            {song.votes}
                          </span>
                          
                          <button
                            onClick={() => downvote(song.id)}
                            className="p-1 hover:bg-red-100 rounded transition-colors"
                          >
                            <ChevronDown className="w-4 h-4 text-red-600 cursor-pointer" />
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

        {/* Share Modal */}
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