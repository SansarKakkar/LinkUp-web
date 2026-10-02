import axios from 'axios';
import React from 'react';
import { BASE_URL } from '../utils/constants';
import { removeUserFeed } from '../utils/feedSlice';
import { useDispatch } from 'react-redux';

const UserCard = ({ user }) => {
  const dispatch = useDispatch();
  if (!user) return null;

  const { _id, firstName, lastName, about, photoUrl, age, gender } = user;

  const handleSendRequest = async (status, userId) => {
    try {
      await axios.post(
        BASE_URL + "/Request/send/" + status + "/" + userId,
        {},
        { withCredentials: true }
      );
      dispatch(removeUserFeed(userId));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="card w-96 max-w-sm sm:max-w-md bg-[#0a0f1d] border border-slate-800 shadow-2xl shadow-black/70 rounded-3xl overflow-hidden backdrop-blur-sm transition-all duration-300 hover:border-pink-500/30 hover:shadow-pink-500/10">
      <figure className="relative h-80 w-full overflow-hidden bg-slate-950">
        <img
          src={photoUrl || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=800&q=80"}
          alt={firstName}
          className="w-full h-full object-cover object-top transition-transform duration-500 hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f1d] via-transparent to-transparent opacity-95" />
      </figure>

      <div className="card-body p-6 text-center -mt-2 bg-[#0a0f1d] rounded-b-3xl">
        <h2 className="text-2xl font-bold text-white tracking-wide">
          {firstName} {lastName}
        </h2>

        {(age || gender) && (
          <div className="flex justify-center my-1.5">
            <span className="px-3.5 py-1 rounded-full text-xs font-semibold bg-pink-500/15 text-pink-400 border border-pink-500/30">
              {age ? `${age} yrs` : ""} {age && gender ? "•" : ""} {gender || ""}
            </span>
          </div>
        )}

        {about && (
          <p className="text-slate-400 text-sm mt-1 line-clamp-3 leading-relaxed px-2 font-normal">
            {about}
          </p>
        )}

        <div className="card-actions justify-center gap-4 mt-6">
          <button
            className="btn btn-outline border-slate-700 text-slate-300 hover:bg-slate-800 hover:border-slate-600 rounded-full px-8 h-12 min-h-[48px] font-semibold transition-all hover:scale-105 active:scale-95 shadow-md"
            onClick={() => handleSendRequest("ignored", _id)}
          >
            Ignore
          </button>
          <button
            className="btn bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white border-none rounded-full px-8 h-12 min-h-[48px] font-bold shadow-lg shadow-pink-500/30 transition-all hover:scale-105 active:scale-95"
            onClick={() => handleSendRequest("interested", _id)}
          >
            Interested
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserCard;
