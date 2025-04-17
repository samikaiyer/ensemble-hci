import React, { useState, useEffect } from "react";
import "./Post.css";
import ScreenHeader from "../components/ScreenHeader";
import Select from "react-select";
import Button from 'react-bootstrap/Button';
import {
  collection,
  getDocs,
  query,
  where,
  doc,
  updateDoc,
  arrayUnion,
  increment
} from 'firebase/firestore';
import { db, auth } from '../firebase';

export default function Post() {
  const [closets, setClosets] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    size: "",
    ownerName: "",
    selectedClosets: [],
    image: null,
    category: "",
  });

  // Load only closets the user is a member of
  useEffect(() => {
    async function fetchClosets() {
      const user = auth.currentUser;
      if (!user) return;
      const q = query(
        collection(db, 'closets'),
        where('members', 'array-contains', user.uid)
      );
      const snap = await getDocs(q);
      const options = snap.docs.map(docSnap => ({
        value: docSnap.id,
        label: docSnap.data().title
      }));
      setClosets(options);
    }
    fetchClosets();
  }, []);

  const handleInputChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleClosetChange = selectedOptions => {
    setFormData({ ...formData, selectedClosets: selectedOptions });
  };

  const handleImageChange = e => {
    setFormData({ ...formData, image: e.target.files[0] });
  };

  const handleCategoryChange = option => {
    setFormData({ ...formData, category: option ? option.value : "" });
  };

  const handleClear = () => {
    setFormData({
      name: "",
      description: "",
      size: "",
      ownerName: "",
      selectedClosets: [],
      image: null,
      category: "",
    });
  };

  const handlePost = () => {
    const { name, description, size, ownerName, selectedClosets, image, category } = formData;
    if (
      !name.trim() ||
      !description.trim() ||
      !size.trim() ||
      !ownerName.trim() ||
      selectedClosets.length === 0 ||
      !image ||
      !category
    ) {
      alert("Please fill out all fields before posting.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = async () => {
      const newItem = {
        id: `item-${Date.now()}`,
        name,
        description,
        size,
        ownerName,
        image: reader.result,
        category
      };

      try {
        for (const sel of selectedClosets) {
          const closetRef = doc(db, 'closets', sel.value);
          await updateDoc(closetRef, {
            items: arrayUnion(newItem),
            num_items: increment(1)
          });
        }
        alert("Item posted successfully!");
        handleClear();
      } catch (error) {
        console.error("Error adding item to closets:", error);
        alert("Failed to post item.");
      }
    };
    reader.readAsDataURL(image);
  };

  const categoryOptions = [
    { value: "Top", label: "Top" },
    { value: "Bottom", label: "Bottom" },
    { value: "Other", label: "Other" },
  ];

  return (
    <div className="postpage">
      <ScreenHeader text="Post an Item" />
      <div className="inputcontainer">
        <div className="individualinputs">
          <p><strong>Name</strong></p>
          <input name="name" value={formData.name} onChange={handleInputChange} />
        </div>
        <div className="individualinputs">
          <p><strong>Description</strong></p>
          <input name="description" value={formData.description} onChange={handleInputChange} />
        </div>
        <div className="individualinputs">
          <p><strong>Size</strong></p>
          <input name="size" value={formData.size} onChange={handleInputChange} />
        </div>
        <div className="individualinputs">
          <p><strong>Owner Name</strong></p>
          <input name="ownerName" value={formData.ownerName} onChange={handleInputChange} />
        </div>
        <div className="individualinputs">
          <p><strong>Upload Image</strong></p>
          <input type="file" accept="image/*" onChange={handleImageChange} />
        </div>
        <div className="individualinputs">
          <p><strong>Choose Closets</strong></p>
          <Select
            isMulti
            options={closets}
            closeMenuOnSelect={false}
            value={formData.selectedClosets}
            onChange={handleClosetChange}
          />
        </div>
        <div className="individualinputs">
          <p><strong>Clothing Category</strong></p>
          <Select
            options={categoryOptions}
            value={categoryOptions.find(opt => opt.value === formData.category) || null}
            onChange={handleCategoryChange}
          />
        </div>
      </div>
      <span className="buttoncontainer">
        <Button variant="light" className="clearbutton" onClick={handleClear}>Clear</Button>
        <Button variant="light" className="postbutton" onClick={handlePost}>Post</Button>
      </span>
    </div>
  );
}
