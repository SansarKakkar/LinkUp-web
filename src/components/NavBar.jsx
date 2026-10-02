import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { BASE_URL } from '../utils/constants';
import axios from "axios";
import { removeUser } from '../utils/userSlice';

const Navbar = () => {
  const user = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post(BASE_URL + "/logout", {}, { withCredentials: true });
      dispatch(removeUser());
      return navigate("/login");
    } catch (err) {
      console.log(err.message);
    }
  };

  return (
    <div className="navbar bg-[#0b1120]/95 backdrop-blur-md text-slate-100 border-b border-slate-800/80 px-6 py-2.5 sticky top-0 z-50">
      <div className="navbar-start">
        <Link to="/" className="btn btn-ghost text-2xl font-black tracking-tight p-0 hover:bg-transparent flex items-center gap-0.5">
          <span className="text-white">Pair</span>
          <span className="text-pink-500 font-extrabold ml-1">Up</span>
        </Link>
      </div>

      {user && (
        <div className="navbar-end flex items-center gap-3">
          <p className="font-medium text-sm text-slate-300 mr-1 hidden sm:block">
            Welcome, <span className="font-semibold text-white">{user.firstName}</span>
          </p>

          <div className="dropdown dropdown-end flex">
            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar ring-2 ring-pink-500/40 hover:ring-pink-500 transition-all">
              <div className="w-10 rounded-full">
                <img alt="User photo" src={user.photoUrl || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80"} />
              </div>
            </div>

            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-[#131d2e] border border-slate-700/60 rounded-2xl z-50 mt-3 w-52 p-2 shadow-2xl text-slate-200">
              <li>
                <Link to='/profile' className="justify-between hover:bg-slate-700/60 rounded-xl">
                  Profile
                </Link>
              </li>
              <li>
                <Link to="/connections" className="hover:bg-slate-700/60 rounded-xl">Connections</Link>
              </li>
              <li>
                <Link to="/requests" className="hover:bg-slate-700/60 rounded-xl">Requests</Link>
              </li>
              <li>
                <a onClick={handleLogout} className="text-rose-400 hover:bg-rose-500/10 rounded-xl">Logout</a>
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
