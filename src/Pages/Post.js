import React, { useState, useEffect } from "react";
import "./Post.css";
import ScreenHeader from "../components/ScreenHeader";
import Select from "react-select";
import Button from 'react-bootstrap/Button';

function Post() {
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

  useEffect(() => {
    const storedClosets = JSON.parse(localStorage.getItem("closets")) || [];
    const closetOptions = storedClosets.map((closet) => ({
      value: closet.id,
      label: closet.title,
    }));
    setClosets(closetOptions);
  }, []);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleClosetChange = (selectedOptions) => {
    setFormData({ ...formData, selectedClosets: selectedOptions });
  };

  const handleImageChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };

  const handleCategoryChange = (selectedOption) => {
    setFormData({ ...formData, category: selectedOption ? selectedOption.value : "" });
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
    if (
      !formData.name.trim() ||
      !formData.description.trim() ||
      !formData.size.trim() ||
      !formData.ownerName.trim() ||
      formData.selectedClosets.length === 0 ||
      !formData.image ||
      !formData.category
    ) {
      alert("Please fill out all fields before posting.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const newItem = {
        id: `item-${Date.now()}`,
        name: formData.name,
        description: formData.description,
        size: formData.size,
        ownerName: formData.ownerName,
        image: reader.result, // Base64 image
        category: formData.category,
      };

      const storedClosets = JSON.parse(localStorage.getItem("closets")) || [];
      const updatedClosets = storedClosets.map((closet) => {
        if (formData.selectedClosets.some((selected) => selected.value === closet.id)) {
          return {
            ...closet,
            num_items: closet.num_items + 1,
            items: [...closet.items, newItem],
          };
        }
        return closet;
      });

      localStorage.setItem("closets", JSON.stringify(updatedClosets));

      alert("Item posted successfully!");
      handleClear();
    };

    reader.readAsDataURL(formData.image);
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
            value={categoryOptions.find(option => option.value === formData.category) || null}
            onChange={handleCategoryChange}
          />
        </div>
      </div>
      <span className="buttoncontainer">
        <Button variant="light" className="clearbutton" onClick={handleClear}>
          Clear
        </Button>
        <Button variant="light" className="postbutton" onClick={handlePost}>
          Post
        </Button>
      </span>
    </div>
  );
}

export default Post;
