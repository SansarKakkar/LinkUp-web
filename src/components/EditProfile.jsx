import React from 'react'
import { useState } from 'react';
import UserCard from './UserCard';
import axios from "axios";
import { BASE_URL } from '../utils/constants';
import { useDispatch } from 'react-redux';
import { addUser } from '../utils/userSlice';


const EditProfile = ({ user }) => {

    if (!user) {
    return (
      <div className="flex justify-center mt-20 text-white text-xl">
        Loading Profile...
      </div>
    );
  }

    const [firstName, setFirstName] = useState(user.firstName);
    const [lastName, setLastName] = useState(user.lastName);
    const [age, setAge] = useState(user.age);
    const [gender, setGender] = useState(user.gender);
    const [about, setAbout] = useState(user.about);
    const [photoUrl, setPhotoUrl] = useState(user.photoUrl);
    const [error, setError] = useState("");
    const dispatch = useDispatch();
    const [showToast, setshowToast] = useState(false);

    const saveProfile = async() => {
        setError("");
        try{
            const res = await axios.patch(
                BASE_URL + "/profile/edit", 
                {firstName, 
                lastName, 
                photoUrl, 
                age, 
                gender, 
                about },
                {withCredentials: true},
            );
            dispatch(addUser(res?.data?.data));
            setshowToast(true);

            setTimeout(() => {
                setshowToast(false);
            }, 3000);
        }
        catch(err){
            setError(err?.response?.data);
        }
    };

  return (
    <>
    <div className='flex justify-center my-10'>
    <div className="flex justify-center mx-10">
      <div className="card card-border bg-base-300 w-96">
        <div className="card-body">
          <h4 className="card-title text-2xl bold flex justify-center">Edit Profile</h4>

          <div>
            <fieldset className="fieldset">
              <legend className="fieldset-legend">First Name: </legend>
              <input
                type="text"
                value={firstName}
                className="input"
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Type here"
              />
            </fieldset>

            <fieldset className="fieldset">
              <legend className="fieldset-legend">Last Name: </legend>
              <input
                type="text"
                value={lastName}
                className="input"
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Type here"
              />
            </fieldset>

            <fieldset className="fieldset">
                <legend className="fieldset-legend">About: </legend>
                <textarea
                className="textarea textarea-bordered"
                value={about}
                onChange={(e) => setAbout(e.target.value)}
                placeholder="Tell something about yourself"
                ></textarea>
            </fieldset>


            <fieldset className="fieldset">
                <legend className="fieldset-legend">Gender:</legend>
                <select
                className="select select-bordered"
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
                </select>
            </fieldset>


            <fieldset className="fieldset">
              <legend className="fieldset-legend">Age: </legend>
              <input
                type="number"
                value={age}
                className="input"
                onChange={(e) => setAge(e.target.value)}
            />
            </fieldset>


            <fieldset className="fieldset">
              <legend className="fieldset-legend">Photo: </legend>
              <input
                type="text"
                value={photoUrl}
                className="input"
                onChange={(e) => setPhotoUrl(e.target.value)}
                placeholder="Type here"
              />
            </fieldset>


          </div>


          <p className='text-red-500'>{ error }</p>
          <div className="card-actions justify-center">
            <button className="btn btn-primary" onClick={ saveProfile }>Save Profile</button>
          </div>

        </div>
      </div>
    </div>

    <UserCard user = {{firstName, lastName, photoUrl, age, gender, about }}/>
    </div>

    {showToast && <div className="toast toast-top toast-center">
        <div className="alert alert-success">
            <span>Profile saved successfully</span>
        </div>
    </div>}

    </>
  )
}

export default EditProfile