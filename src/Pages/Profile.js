import React, { useEffect, useState } from 'react';
import "./Profile.css";
import ScreenHeader from "../components/ScreenHeader";
import 'bootstrap/dist/css/bootstrap.min.css'; 

import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';

const GetUsername = () => {
  const [username, setUsername] = useState('');
  const [displayName, setDisplayName] = useState('');

  useEffect(() => {
    const fetchUsername = async () => {
      const user = auth.currentUser;
      try {
        const userDocRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists) {
          setUsername(userDoc.data().username);
          setDisplayName(userDoc.data().displayName);
          console.log('Found document!');
        } else {
          console.log('No such document!');
        }
      } catch (error) {
        console.error('Error fetching document:', error);
      }
    };

    fetchUsername();
  }, []); // Empty array means it runs once when the component mounts

  return (
    <div className="row">
      <h1>{displayName}</h1>
      <p>@{username}</p>
    </div>
    
  );
};

const logoutUser = async () => {
  try {
    await signOut(auth);
    console.log("User logged out");
  } catch (error) {
    console.error("Error logging out:", error);
  }
};

function Profile() {

  // state for outfits/closets in local storage
  const [outfits, setOutfits] = useState([]);
  const [closets, setClosets] = useState([]);

  useEffect(() => {
    // load outfits/closets from local storage
    const storedOutfits = localStorage.getItem('outfits');
    if (storedOutfits) {
      setOutfits(JSON.parse(storedOutfits));
    }
    const storedClosets = localStorage.getItem('closets');
    if (storedClosets) {
      setClosets(JSON.parse(storedClosets));
    }
  }, []);

  // profile now updates user's number of closets/outfits
  const numClosets = closets.length;
  const numOutfits = outfits.length;

  return (
    <div className="profilepage">
      <ScreenHeader text="Profile" />
      <div className="userInfoContainer">
        <div className="col-5">
          <img src={`${process.env.PUBLIC_URL}/images/jenna_pfp.jpg`} alt="Jenna's profile" className="profilePicture" />
        </div>
        <div className="col-7 profileContainer"> 
            <GetUsername></GetUsername>
            <button onClick={logoutUser} className="logoutButton">Logout</button>
          <div className="row">
            <div className="col-4">
              <p>{numClosets} Closets</p>
            </div>
            <div className="col-4">
              <p>{numOutfits} Outfits</p>
            </div>
          </div>
          </div>
        </div>
        <div className="outfitsContainer">
          <h1>My Outfits</h1>
          {outfits.map((outfit) => (
          <div className="outfitContainer" key={outfit.id}>
            <p>{outfit.name}</p>
            <div className="outfitImages">
              {outfit.items.map((item, index) => (
                <img
                  key={index}
                  src={item.image}
                  alt={item.name}
                  className="itemImage"
                />
              ))}
            </div>
          </div>
        ))}
        </div>
      </div>
      
  );
}

export default Profile;