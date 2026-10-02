import React, { useEffect, useState } from 'react';
import axios from "axios";
import { BASE_URL } from '../utils/constants';
import { addFeed } from '../utils/feedSlice';
import { useDispatch, useSelector } from 'react-redux';
import UserCard from './UserCard';

const Feed = () => {
  const feed = useSelector((store) => store.feed);
  const dispatch = useDispatch();
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const getFeed = async () => {
    if (loading || !hasMore) return;
    try {
      setLoading(true);
      const res = await axios.get(BASE_URL + "/feed", {
        withCredentials: true,
      });

      if (res.data && res.data.length > 0) {
        dispatch(addFeed(res.data));
      } else {
        setHasMore(false);
        if (!feed) dispatch(addFeed([]));
      }
    } catch (err) {
      console.log(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    if (!feed) {
      getFeed();
    }
  }, []);

  // When feed runs out of cards (0 cards left), automatically fetch next batch
  useEffect(() => {
    if (feed && feed.length === 0 && hasMore && !loading) {
      getFeed();
    }
  }, [feed, hasMore, loading]);

  if (!feed || (loading && feed.length === 0)) {
    return (
      <div className="flex flex-col items-center justify-center my-20 gap-3">
        <span className="loading loading-spinner loading-lg text-pink-500"></span>
        <p className="text-slate-400 text-sm">Loading more profiles...</p>
      </div>
    );
  }

  if (feed.length === 0 && !hasMore) {
    return (
      <div className="flex flex-col items-center justify-center my-20 p-8 text-center bg-[#131d2e] border border-slate-800 rounded-3xl shadow-xl max-w-sm mx-auto">
        <span className="text-5xl mb-3">🎉</span>
        <h2 className="text-xl font-bold text-white mb-1">All Caught Up!</h2>
        <p className="text-slate-400 text-sm">No new profiles available right now. Check back later!</p>
      </div>
    );
  }

  return (
    <div className='flex justify-center my-8'>
      {feed[0] && <UserCard user={feed[0]} />}
    </div>
  );
};

export default Feed;
