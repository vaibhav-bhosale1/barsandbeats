"use client";
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

interface StreamViewProps {
  creatorId?: string;
}

export default function StreamView({
  creatorId
}: StreamViewProps) {
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
  const [fetchingMetadata, setFetchingMetadata] = useState(false);
  const [addingToQueue, setAddingToQueue] = useState(false);

  const refreshStreams = async () => {
    try {
      console.log("[StreamView] Starting stream refresh...");
      console.log("[StreamView] CreatorId:", creatorId);
      setLoading(true);
      setError(null);
      
      const startTime = performance.now();
      
      const url = creatorId 
        ? `/api/streams?creatorId=${creatorId}`
        : '/api/streams';
      
      console.log("[StreamView] Fetching from URL:", url);
      
      const res = await fetch(url, {
        credentials: "include",
        headers: { 
          'Cache-Control': 'no-cache',
          'Content-Type': 'application/json'
        }
      });
      
      const fetchTime = performance.now() - startTime;
      console.log(`[StreamView] Fetch completed in ${fetchTime.toFixed(1)}ms, status: ${res.status}`);
      
      if (!res.ok) {
        const errorText = await res.text();
        console.error("[StreamView] Error response:", errorText);
        
        if (errorText.includes('<!DOCTYPE') || errorText.includes('<html')) {
          throw new Error(`Server returned HTML instead of JSON. Status: ${res.status}`);
        }
        
        let errorData;
        try {
          errorData = JSON.parse(errorText);
        } catch (e) {
          throw new Error(`HTTP error ${res.status}: ${errorText}`);
        }
        
        throw new Error(errorData.message || `API request failed with status ${res.status}`);
      }
      
      const data = await res.json();
      console.log("[StreamView] API Response:", data);
      
      if (!data.streams) {
        throw new Error("Invalid response format - missing streams data");
      }
      
      setStreams(data.streams);
      console.log("[StreamView] Successfully loaded", data.streams.length, "streams");
    } catch (error) {
      console.error("[StreamView] Refresh error:", error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshStreams();
    const interval = setInterval(refreshStreams, REFRESH_INTERVAL);
    return () => clearInterval(interval);
  }, [creatorId]);

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
      console.error('Error fetching video metadata:', error);
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
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
        credentials: 'include'
      });
      
      if (!addRes.ok) {
        const errorText = await addRes.text();
        
        if (errorText.includes('<!DOCTYPE') || errorText.includes('<html')) {
          throw new Error('Server error: Please check API endpoint');
        }
        
        let errorData;
        try {
          errorData = JSON.parse(errorText);
        } catch (e) {
          throw new Error(`Server error: ${errorText}`);
        }
        
        throw new Error(errorData.message || 'Failed to add song to queue');
      }

      alert(`"${previewVideo.title}" has been added to the queue!`);
      setYoutubeUrl('');
      setPreviewVideo(null);
      await refreshStreams();

    } catch (error: any) {
      console.error('Error adding song:', error);
      setError(error.message || 'Failed to add song to queue');
    } finally {
      setAddingToQueue(false);
    }
  };

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

  const playNext = (song: Stream) => {
    setCurrentVideo({
      id: song.extractedId,
      title: song.title,
      thumbnail: song.thumbnail,
      duration: song.duration
    });
  };

  const shareUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}/creator/${creatorId || 'your-id'}` 
    : '';
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
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-8">
            <div className="bg-gray-800 rounded-xl p-6">
              <h2 className="text-2xl font-bold mb-4">Now Playing</h2>
              <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden">
                <img
                  src={currentVideo.thumbnail}
                  alt={currentVideo.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="mt-4">
                <h3 className="text-xl font-bold">{currentVideo.title}</h3>
                <div className="flex items-center mt-2 text-gray-400">
                  <Clock className="h-4 w-4 mr-1" />
                  <span>{currentVideo.duration}</span>
                </div>
              </div>
            </div>

            <div className="bg-gray-800 rounded-xl p-6">
              <h2 className="text-2xl font-bold mb-4">Add to Queue</h2>
              <div className="space-y-4">
                <div>
                  <label htmlFor="youtubeUrl" className="block text-sm font-medium text-gray-300 mb-1">
                    YouTube URL
                  </label>
                  <input
                    type="text"
                    id="youtubeUrl"
                    value={youtubeUrl}
                    onChange={(e) => handleUrlChange(e.target.value)}
                    placeholder="https://www.youtube.com/watch?v=..."
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                {previewVideo && (
                  <div className="bg-gray-700 rounded-lg p-4">
                    <div className="flex">
                      <img
                        src={previewVideo.thumbnail}
                        alt={previewVideo.title}
                        className="w-16 h-12 object-cover rounded"
                      />
                      <div className="ml-3">
                        <h3 className="font-medium">{previewVideo.title}</h3>
                        <div className="flex items-center text-sm text-gray-400">
                          <Clock className="h-3 w-3 mr-1" />
                          <span>{previewVideo.duration}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <button
                  onClick={addToQueue}
                  disabled={!previewVideo || addingToQueue}
                  className={`w-full py-3 px-4 rounded-lg font-medium ${
                    previewVideo && !addingToQueue
                      ? 'bg-blue-600 hover:bg-blue-700 text-white'
                      : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                  } transition-colors`}
                >
                  {addingToQueue ? 'Adding...' : 'Add to Queue'}
                </button>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-8">
            <div className="bg-gray-800 rounded-xl p-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Queue</h2>
                <button
                  onClick={() => setShowShareModal(true)}
                  className="flex items-center bg-blue-600 hover:bg-blue-700 py-2 px-4 rounded-lg transition-colors"
                >
                  <Share2 className="h-5 w-5 mr-2" />
                  Share
                </button>
              </div>
            </div>

            <div className="bg-gray-800 rounded-xl p-6">
              <div className="space-y-4">
                {loading ? (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                    <p className="mt-4">Loading queue...</p>
                  </div>
                ) : error ? (
                  <div className="bg-red-900/20 border border-red-700 rounded-lg p-4">
                    <p className="text-red-500">Error: {error}</p>
                    <button
                      onClick={refreshStreams}
                      className="mt-2 px-4 py-2 bg-red-700 rounded-lg hover:bg-red-600 transition-colors"
                    >
                      Retry
                    </button>
                  </div>
                ) : streams.length === 0 ? (
                  <div className="text-center py-12">
                    <Users className="h-12 w-12 mx-auto text-gray-500" />
                    <h3 className="mt-4 text-xl font-medium text-gray-300">Queue is empty</h3>
                    <p className="mt-2 text-gray-500">Add songs using the form on the left</p>
                  </div>
                ) : (
                  streams.map((stream) => (
                    <div
                      key={stream.id}
                      className="flex items-center justify-between bg-gray-700 rounded-lg p-4 hover:bg-gray-600 transition-colors"
                    >
                      <div className="flex items-center">
                        <img
                          src={stream.thumbnail}
                          alt={stream.title}
                          className="w-16 h-12 object-cover rounded"
                        />
                        <div className="ml-4">
                          <h3 className="font-medium">{stream.title}</h3>
                          <div className="flex items-center text-sm text-gray-400">
                            <Users className="h-3 w-3 mr-1" />
                            <span>{stream.submittedBy}</span>
                            <span className="mx-2">•</span>
                            <Clock className="h-3 w-3 mr-1" />
                            <span>{stream.duration}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center">
                          <button
                            onClick={() => upvote(stream.id)}
                            className={`p-1 rounded-full ${
                              stream.haveUpvoted
                                ? 'text-blue-500'
                                : 'text-gray-400 hover:text-blue-500'
                            }`}
                          >
                            <ChevronUp className="h-5 w-5" />
                          </button>
                          <span className="mx-1 min-w-[20px] text-center">{stream.votes}</span>
                          <button
                            onClick={() => downvote(stream.id)}
                            className="p-1 rounded-full text-gray-400 hover:text-red-500"
                          >
                            <ChevronDown className="h-5 w-5" />
                          </button>
                        </div>
                        <button
                          onClick={() => playNext(stream)}
                          className="p-2 rounded-full bg-green-600 hover:bg-green-500 text-white"
                        >
                          <Play className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {showShareModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-xl p-6 max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4">Share this Stream</h2>
            <p className="text-gray-400 mb-4">
              Share the link below to invite others to your stream. They can add songs and vote!
            </p>
            
            <div className="flex mb-4">
              <input
                type="text"
                readOnly
                value={shareUrl}
                className="flex-1 px-4 py-2 bg-gray-700 border border-gray-600 rounded-l-lg focus:outline-none"
              />
              <button
                onClick={copyToClipboard}
                className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-r-lg flex items-center"
              >
                {copied ? (
                  <>
                    <Check className="h-5 w-5 mr-2" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="h-5 w-5 mr-2" />
                    Copy
                  </>
                )}
              </button>
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowShareModal(false)}
                className="px-4 py-2 border border-gray-600 rounded-lg hover:bg-gray-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}