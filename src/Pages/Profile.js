import React, { useEffect, useState } from 'react';
import './Profile.css';
import ScreenHeader from '../components/ScreenHeader';
import 'bootstrap/dist/css/bootstrap.min.css';

import { db } from '../firebase';
import { doc, getDoc, collection, query, where, onSnapshot } from 'firebase/firestore';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';

const GetUsername = () => {
  const [username, setUsername] = useState('');
  const [displayName, setDisplayName] = useState('');

  useEffect(() => {
    const fetchUsername = async () => {
      const user = auth.currentUser;
      if (!user) return;
      try {
        const userDocRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          setUsername(userDoc.data().username);
          setDisplayName(userDoc.data().displayName);
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };
    fetchUsername();
  }, []);

  return (
    <div className="row">
      <h1 className="username">{displayName}</h1>
      <p className="username">@{username}</p>
    </div>
  );
};

const logoutUser = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Error logging out:', error);
  }
};

export default function Profile() {
  const user = auth.currentUser;
  const [closets, setClosets] = useState([]);
  const [outfits, setOutfits] = useState([]);

  // Subscribe to closets where user is a member
  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, 'closets'), where('members', 'array-contains', user.uid));
    const unsubscribe = onSnapshot(q, snapshot => {
      const list = snapshot.docs.map(docSnap => ({ id: docSnap.id, title: docSnap.data().title }));
      setClosets(list);
    });
    return unsubscribe;
  }, [user]);

  // Subscribe to user-specific outfits across all closets
  useEffect(() => {
    if (!user) return;
    const unsubscribes = closets.map(closet => {
      const outfitsCol = collection(db, 'closets', closet.id, 'userOutfits', user.uid, 'outfits');
      return onSnapshot(outfitsCol, snapshot => {
        setOutfits(prev => {
          // remove existing outfits for this closet
          const others = prev.filter(o => o.closetId !== closet.id);
          const newOutfits = snapshot.docs.map(docSnap => ({
            id: docSnap.id,
            closetId: closet.id,
            ...docSnap.data()
          }));
          return [...others, ...newOutfits];
        });
      });
    });
    return () => unsubscribes.forEach(unsub => unsub());
  }, [closets, user]);

  const numClosets = closets.length;
  const numOutfits = outfits.length;

  return (
    <div className="profilepage">
      <ScreenHeader text="Profile" />
      <div className="userInfoContainer row">
        <div className="col-5">
          <img
            src={`${process.env.PUBLIC_URL}/images/general_pfp.jpg`}
            alt="Profile"
            className="profilePicture"
          />
        </div>
        <div className="col-7 profileContainer">
          <GetUsername />
          
          <div className="row statsRow">
            <div className="col-6"><p>{numClosets} Closets</p></div>
            <div className="col-6"><p>{numOutfits} Outfits</p></div>
          </div>

          <button onClick={logoutUser} className="logoutButton">Logout</button>

        </div>
      </div>
      <div className="outfitsContainer">
        <h1>My Outfits</h1>
        {outfits.map(outfit => (
          <div className="outfitContainer" key={outfit.id}>
            <p>{outfit.name}</p>
            <div className="outfitImages">
              {outfit.items.map(item => (
                <img
                  key={item.id}
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
