import React from "react";
import "./Profile.css";
import ScreenHeader from "../components/ScreenHeader";
import 'bootstrap/dist/css/bootstrap.min.css'; 

function Profile() {
  return (
    <div className="profilepage">
      <ScreenHeader text="Profile" />
      <div className="userInfoContainer">
        <div className="col-5">
          <img src={`${process.env.PUBLIC_URL}/images/jenna_pfp.jpg`} alt="Jenna's profile" className="profilePicture" />
        </div>
        <div className="col-7 profileContainer"> 
          <div className="row">
            <h1>Jenna Doe</h1>
            <p>@jennadoe123</p>
          </div>
          <div className="row">
            <div className="col-4">
              <p>3 Closets</p>
            </div>
            <div className="col-4">
              <p>1 Outfit</p>
            </div>
          </div>
          </div>
        </div>
        <div className="outfitsContainer">
          <h1>My Outfits</h1>
        </div>
        <div className="outfitContainer">
          <p>Career Fair</p>
          <div>
          <img src={`${process.env.PUBLIC_URL}/images/items/button_up.jpg`} alt="white button-up shirt" className="itemImage"></img>
          <img src={`${process.env.PUBLIC_URL}/images/items/slacks.jpg`} alt="black dress pants" className="itemImage"></img>
          <img src={`${process.env.PUBLIC_URL}/images/items/blazer.jpg`} alt="black buttoned blazer" className="itemImage"></img>
          <img src={`${process.env.PUBLIC_URL}/images/items/heels.jpg`} alt="black heels" className="itemImage"></img>
          </div>
              
          </div>
      
        

      </div>
      
  );
}

export default Profile;


// div className="row userInfoContainer">
//         <div className="col-5"> {/* column for pfp */}
//             <img src={`${process.env.PUBLIC_URL}/images/jenna_pfp.jpg`} alt="Jenna's profile" className="profilePicture" />
//         </div>
//         <div className="col-7"> {/* column for user info */}
//             <div className="row">
//                 <h1>Jenna Doe</h1>
//                 <p>@jennadoe123</p>
//             </div>
//             <div className="row">
//                 <div className="col-4">
//                     <p>3 Closets</p>
//                 </div>
//                 <div className="col-4">
//                     <p>1 Outfit</p>
//                 </div>
//             </div>
            
//         </div>
//       </div>

//       <div className="row outfitsContainer">
//           <div className="row">
//               <h1>My Outfits</h1>
//           </div>
//           <div className="row outfitContainer">
//               <p>Career Fair</p>
//               <div className="row">
//                   <div className="col-3">
//                       <img src={`${process.env.PUBLIC_URL}/images/items/button_up.jpg`} alt="white button-up shirt" className="itemImage"></img>
//                   </div>
//                   <div className="col-3">
//                       <img src={`${process.env.PUBLIC_URL}/images/items/slacks.jpg`} alt="black dress pants" className="itemImage"></img>
//                   </div>
//                   <div className="col-3">
//                       <img src={`${process.env.PUBLIC_URL}/images/items/blazer.jpg`} alt="black buttoned blazer" className="itemImage"></img>
//                   </div>
//                   <div className="col-3">
//                       <img src={`${process.env.PUBLIC_URL}/images/items/heels.jpg`} alt="black heels" className="itemImage"></img>
//                   </div>
//               </div>
//           </div>
          
//       </div>