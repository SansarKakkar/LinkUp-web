// import axios from 'axios';
// import React, { useEffect } from 'react';
// import { BASE_URL } from '../utils/constants';
// import { useDispatch, useSelector } from 'react-redux';
// import { addConnections } from '../utils/connectionSlice';
// const Connections = () => {
//   const connections = useSelector((store) => store.connections);
//   const dispatch = useDispatch();

//   const fetchConnections = async () => {
// try{ 
//     const res= await axios.get(BASE_URL+"/user/connections",{withCredentials:true}); 
//     dispatch(addConnections(res.data.data)); 
// } 
// catch(err){ 

// }
//   };

//   useEffect(() => {
//     fetchConnections();
//   }, []);

//   if (!connections) return;

//   if (connections.length === 0)
//     return <h1>No Connections Found</h1>;

//   return (
//     <div className="text-center my-10">
//       <h1 className="text-bold text-3xl">Connections</h1>

//       {connections.map((connection) => {
//         const { firstName, lastName, photoUrl, age, gender, about } =
//           connection;

//         return (
//           <div className="flex m-4 p-4 rounded-lg bg-base-300 w-1/2 mx-auto">
//             <div>
//               <img
//                 alt="photo"
//                 className="w-20 h-20 rounded-full"
//                 src={photoUrl}
//               />
//             </div>

//             <div className="text-left mx-4">
//               <h2 className="font-bold text-xl">
//                 {firstName + " " + lastName}
//               </h2>

//               {age && gender && (
//                 <p>{age + ", " + gender}</p>
//               )}

//               <p>{about}</p>
//             </div>
//           </div>
//         );
//       })}
//     </div>
//   );
// };

// export default Connections;
import React, { useEffect } from 'react';
import axios from "axios";
import { BASE_URL } from '../utils/constants';
import { useDispatch, useSelector } from 'react-redux';
import { addConnections } from '../utils/connectionSlice';
import { Link } from "react-router-dom";
const Connections = () => {
    const connections = useSelector((store) => store.connections);
    const dispatch = useDispatch();

    const fetchConnections = async () => {
        try {
            const res = await axios.get(BASE_URL + "/user/connections", {
                withCredentials: true,
            });
            dispatch(addConnections(res.data.data));
        } catch (err) {
            console.log(err.message);
        }
    };

    useEffect(() => {
        fetchConnections();
    }, []);

    if (!connections) return <h1>Loading...</h1>;
    if (connections.length === 0) return <h1>No Connections Found!</h1>;

    return (
        <div className="text-center mb-10">
            <h1 className="text-4xl font-extrabold mb-12 bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 
            bg-clip-text text-transparent inline-block">Connections</h1>

            <div className="flex flex-col items-center gap-6">
                {connections.map(({firstName, lastName, photoUrl, about, age, gender, _id}, index) => (
                    <div key={index} className="flex items-center bg-gray-900 border border-white rounded-xl p-5 w-[650px] 
                    shadow-md hover:shadow-2xl hover:scale-105 transition-all duration-300 cursor-pointer">

                        <img src={photoUrl} alt="photo" className="w-20 h-20 rounded-full object-cover" />

                        <div className="ml-6 text-left">
                            <h2 className="text-xl font-semibold">
                                {firstName} {lastName}
                            </h2>

                            <p className="text-white 700 mt-2">
                                {about}
                            </p>

                            <p className="text-white text-sm mt-1">
                                {age} • {gender}
                            </p>
        
                        </div>
                         <Link to={"/chat/" + _id}>
                            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                                Chat
                            </button>
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Connections;