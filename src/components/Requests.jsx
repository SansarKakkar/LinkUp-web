import React from 'react';
import axios from 'axios';
import { BASE_URL } from '../utils/constants';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addRequests, removeRequest } from '../utils/requestSlice';

const Requests = () => {

  const requests = useSelector((store) => store.requests);
  const dispatch = useDispatch();


  const reviewRequests = async (status, _id) => {
  try {
    const res = await axios.post(
      BASE_URL + "/request/review/" + status + "/" + _id,
      {},
      { withCredentials: true }
    );
    dispatch(removeRequest(_id));
  } catch (err) {
    console.log(err.message);
  }
};


  const fetchRequests = async() => {
    try{
      const res = await axios.get(BASE_URL + "/user/requests/received",
        {withCredentials: true},
      );
      dispatch(addRequests(res.data.data));
    }
    catch(err){
      console.log(err.message);
    }
  };


  useEffect(() => {
    fetchRequests();
  }, []);


  if (!requests) return <h1 className='flex justify-center my-10'>Loading...</h1>;
  if (requests.length === 0) return <h1 className='flex justify-center my-10'>No Requests Yet</h1>;

  return (
    <div className="text-center mb-10">
      <h1 className="text-4xl font-extrabold mb-12 bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 
      bg-clip-text text-transparent inline-block">Requests</h1>
      <div className="flex flex-col items-center gap-6">

        {requests.map((request) => {
          const { _id, firstName, lastName, photoUrl, about, age, gender } = request.fromUserId;

          return (
            <div key={_id} className="flex justify-between items-center bg-gray-900 
            border border-white rounded-xl p-5 w-[650px] shadow-md 
            hover:shadow-2xl hover:scale-105 transition-all duration-300 cursor-pointer">
                
              <img src={photoUrl} alt="photo" className="w-20 h-20 rounded-full object-cover"/>
              <div className="ml-6 text-left">

                <h2 className="text-xl font-semibold text-white">{firstName} {lastName}</h2>

                <p className="text-gray-300 mt-2">{about}</p>

                <p className="text-gray-400 text-sm mt-1">{age} • {gender}</p>

              </div>

      <div className="flex gap-3">
        <button className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition" 
        onClick={() => reviewRequests ("rejected", request._id)}>Reject</button>

        <button className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
        onClick={() => reviewRequests ("accepted", request._id)}>Accept</button>
      </div>

        </div>
      );
    })}
      </div>
    </div>
  );
}

export default Requests