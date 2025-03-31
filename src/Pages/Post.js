import React from "react";
import "./Post.css"
import ScreenHeader from "../components/ScreenHeader";
import Select from "react-select";
import Button from 'react-bootstrap/Button';

function Post() {
  const closets = [
    { value: "option1", label: "Roomies Closet" },
    { value: "option2", label: "Jenna's Closet" },
    { value: "option3", label: "My Creation" }
  ];

  return (
    <div className="postpage">
      <ScreenHeader text="Post an Item" />
      <div className="inputcontainer">
        <div className="individualinputs">
          <p>Name</p>
          <input></input>
        </div>
        <div className="individualinputs">
          <p>Description</p>
          <input></input>
        </div>
        <div className="individualinputs">
          <p>Size</p>
          <input></input>
        </div>
        <div className="individualinputs">
          <p>Owner Name</p>
          <input></input>
        </div> 
        <div className="individualinputs">
          <p>Choose Closets</p>
          <Select isMulti options={closets} closeMenuOnSelect={false}> </Select>
        </div>
      </div>
      <span className="buttoncontainer">
        <Button variant="light" className="clearbutton">Clear</Button>
        <Button variant="light" className="postbutton">Post</Button>
      </span>
    </div>
  );
}

export default Post;
