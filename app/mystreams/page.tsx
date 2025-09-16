"use client"
import React, { useEffect, useState } from 'react';
import StreamView from '../components/StreamView';

export default function MyStreams() {
  const [creatorId, setCreatorId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch('/api/user/me');
        if (!res.ok) {
          throw new Error('Failed to fetch user data');
        }
        const user = await res.json();
        setCreatorId(user.id);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-16 h-16 border-4 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen text-red-500">
        <p>Error: {error}</p>
      </div>
    );
  }

  if (!creatorId) {
    return (
        <div className="flex items-center justify-center min-h-screen text-gray-500">
            <p>Could not load your dashboard. Please try logging in again.</p>
        </div>
    )
  }

  return <StreamView creatorId={creatorId} isCreator={true} />;
}