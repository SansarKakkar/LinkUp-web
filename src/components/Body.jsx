import { Outlet, useNavigate } from 'react-router-dom';
import axios from "axios";
import NavBar from "./navbar";
import Footer from "./Footer";
import { BASE_URL } from '../utils/constants';
import { useDispatch, useSelector } from 'react-redux';
import { addUser } from '../utils/userSlice';
import { useEffect } from 'react';

const Body = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userData = useSelector((store) => store.user);

  const fetchUser = async () => {
    if (userData) return;
    try {
      const res = await axios.get(BASE_URL + "/profile", { withCredentials: true });
      dispatch(addUser(res.data));
    } catch (err) {
      if (err.status === 401 || (err.response && err.response.status === 401)) {
        navigate("/login");
      }
      console.error(err);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#111827] text-slate-100">
      <NavBar />
      <main className="flex-1 flex flex-col justify-center items-center pb-28 pt-8">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Body;
