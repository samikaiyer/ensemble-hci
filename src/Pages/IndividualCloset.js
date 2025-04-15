import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { Button, Modal } from 'react-bootstrap';
import BottomSheet from '../components/BottomSheet'; // import the component we created
import "./IndividualCloset.css";

function IndividualCloset() {
  const { name } = useParams(); 
  const [closet, setCloset] = useState(null);

  useEffect(() => {
    const storedClosets = JSON.parse(localStorage.getItem('closets')) || [];
    const foundCloset = storedClosets.find(c => c.title === decodeURIComponent(name));
    setCloset(foundCloset);
  }, [name]);

  // load outfits
  const [outfits, setOutfits] = useState(() => {
    const stored = localStorage.getItem('outfits');
    return stored ? JSON.parse(stored) : [];
  });

  // track selected items
  const [selectedItems, setSelectedItems] = useState([]);

  // visibility of the bottom sheet
  const [showSheet, setShowSheet] = useState(false);

  // visibility of the outfit name prompt modal
  const [showNameModal, setShowNameModal] = useState(false);
  const [newOutfitName, setNewOutfitName] = useState('');

  // Add category filter state
  const [categoryFilter, setCategoryFilter] = useState('All');

  // update local storage whenever outfits state changes
  useEffect(() => {
    localStorage.setItem('outfits', JSON.stringify(outfits));
  }, [outfits]);

  // toggle selection on click 
  const toggleSelection = (item) => {
    if (selectedItems.includes(item)) {
      setSelectedItems(selectedItems.filter(i => i !== item));
    } else {
      setSelectedItems([...selectedItems, item]);
    }
  };

  // auto open bottom sheet when at least one item is selected
  useEffect(() => {
    if (selectedItems.length > 0) {
      setShowSheet(true);
    }
  }, [selectedItems]);

  // Handle adding selected items to an existing outfit
  const handleAddToOutfit = (outfitId, items) => {
    const updatedOutfits = outfits.map((outfit) => {
      if (outfit.id === outfitId) {

        const filteredItems = items.filter((item) =>
          !outfit.items.some(
            (existingItem) =>
              (item.id && existingItem.id === item.id) ||
              (!item.id && existingItem.name === item.name)
          )
        );

        // alert if duplicate item in outfit
        if (filteredItems.length === 0) {
          alert("Selected item(s) are already in the outfit");
          return outfit;
        }

        return { ...outfit, items: [...outfit.items, ...filteredItems] };
      }

      return outfit;
    });
    setOutfits(updatedOutfits);
    setSelectedItems([]);
    setShowSheet(false);
  };

  // creating a new outfit -> prompt the user for a name.
  const promptNewOutfitName = () => {
    setShowSheet(false); 
    setShowNameModal(true);
  };

  // Confirm the creation of a new outfit with the entered name
  const handleConfirmCreateOutfit = () => {
    if (!newOutfitName.trim()) {
      alert("Outfit name is required");
      return;
    }
    const newOutfit = {
      id: Date.now(), 
      name: newOutfitName,
      items: selectedItems
    };
    setOutfits([...outfits, newOutfit]);
    setSelectedItems([]);
    setShowNameModal(false);
    setNewOutfitName('');
  };

  if (!closet) {
    return <h2>Closet not found</h2>;
  }

  // Filter items based on category filter
  const filteredItems = categoryFilter === 'All' 
    ? closet.items 
    : closet.items.filter(item => item.category === categoryFilter);

  return (
    <div>
      <header style={{ backgroundColor: "#DF8EC1", height: "250px", textAlign: "center", lineHeight: "50px", paddingTop: "3%" }}>
        <div>
          <h1>{closet.title}</h1>
          <Link to="/post">
            <Button variant="outline-dark">Add New Item</Button>
          </Link>
        </div>
        <div className='infocontainer'>
            <p><strong>Members:</strong> {closet.num_members}</p>
            <p><strong>Items:</strong> {closet.num_items}</p>
        </div>
        <div className='infocontainer'>
            {/* Category Filter Buttons */}
            <Button 
              variant={categoryFilter === 'All' ? 'dark' : 'outline-dark'} 
              size="lg"
              onClick={() => setCategoryFilter('All')}
            >
              All Items
            </Button>
            <Button 
              variant={categoryFilter === 'Top' ? 'dark' : 'outline-dark'} 
              size="lg"
              onClick={() => setCategoryFilter('Top')}
            >
              Tops
            </Button>
            <Button 
              variant={categoryFilter === 'Bottom' ? 'dark' : 'outline-dark'} 
              size="lg"
              onClick={() => setCategoryFilter('Bottom')}
            >
              Bottoms
            </Button>
        </div>
      </header>

      <div className='imagescontainer'>
        {filteredItems.length > 0 ? (
          filteredItems.map((item, index) => (
            <img 
              key={index} 
              src={item.image} 
              alt={item.name} 
              className={`itemImage ${selectedItems.includes(item) ? 'selected' : ''}`} 
              onClick={() => toggleSelection(item)}
            />
          ))
        ) : (
          <p>No items in this category</p>
        )}
      </div>

      {/* bottom sheet for "Add to Outfit" */}
      <BottomSheet
        open={showSheet}
        onClose={() => setShowSheet(false)}
        selectedItems={selectedItems}
        existingOutfits={outfits}
        onAddToOutfit={handleAddToOutfit}
        onCreateOutfit={promptNewOutfitName}
      />

      {/* modal prompting NEW outfit name */}
      <Modal show={showNameModal} onHide={() => { setShowNameModal(false); setNewOutfitName(''); }} centered>
        <Modal.Header closeButton>
          <Modal.Title>Name New Outfit</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <input 
            type="text"
            className="form-control"
            placeholder="Enter outfit name"
            value={newOutfitName}
            onChange={(e) => setNewOutfitName(e.target.value)}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => { setShowNameModal(false); setNewOutfitName(''); }}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleConfirmCreateOutfit} className="pinkButton">
            Create Outfit
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default IndividualCloset;
