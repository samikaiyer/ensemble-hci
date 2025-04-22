import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { Button, Modal } from 'react-bootstrap';
import BottomSheet from '../components/BottomSheet';
import {
  doc,
  onSnapshot,
  collection,
  setDoc,
  updateDoc,
  arrayUnion
} from 'firebase/firestore';
import { db, auth } from '../firebase';
import './IndividualCloset.css';

export default function IndividualCloset() {
  const { id } = useParams();             // closet document ID
  const user = auth.currentUser;

  // Closet data
  const [closet, setCloset] = useState();

  // User-specific outfits stored in Firestore
  const [outfits, setOutfits] = useState([]);

  // UI state
  const [selectedItems, setSelectedItems] = useState([]);
  const [showSheet, setShowSheet] = useState(false);
  const [showNameModal, setShowNameModal] = useState(false);
  const [newOutfitName, setNewOutfitName] = useState('');
  const [showItemModal, setShowItemModal] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [categoryFilter, setCategoryFilter] = useState('All');

  // subscribe to closet
  useEffect(() => {
    if (!id) return;
    const ref = doc(db, 'closets', id);
    const unsub = onSnapshot(ref, snap => {
      if (snap.exists()) setCloset({ id: snap.id, ...snap.data() });
      else setCloset(null);
    });
    return unsub;
  }, [id]);

  // subscribe to user outfits
  useEffect(() => {
    if (!id || !user) return;
    const outfitsCol = collection(db, 'closets', id, 'userOutfits', user.uid, 'outfits');
    const unsub = onSnapshot(outfitsCol, snapshot => {
      const list = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      setOutfits(list);
    });
    return unsub;
  }, [id, user]);

  // open bottom sheet when items selected
  useEffect(() => {
    setShowSheet(selectedItems.length > 0);
  }, [selectedItems]);

  const toggleSelection = item => {
    setSelectedItems(prev =>
      prev.some(i => i.id === item.id)
        ? prev.filter(i => i.id !== item.id)
        : [...prev, item]
    );
  };

  // Create a new outfit 
  const handleConfirmCreateOutfit = async () => {
    if (!newOutfitName.trim()) return alert('Outfit name is required');
    const outfitId = `outfit-${Date.now()}`;
    const outfitRef = doc(db, 'closets', id, 'userOutfits', user.uid, 'outfits', outfitId);
    const newOutfit = { name: newOutfitName, items: selectedItems };
    await setDoc(outfitRef, newOutfit);
    setNewOutfitName('');
    setSelectedItems([]);
    setShowNameModal(false);
  };

  // add to existing outfit
  const handleAddToOutfit = async outfitId => {
    const filtered = selectedItems.filter(item =>
      !outfits.find(o => o.id === outfitId).items.some(i => i.id === item.id)
    );
    if (filtered.length === 0) {
      alert('Selected item(s) already in outfit');
      return;
    }
    const outfitRef = doc(db, 'closets', id, 'userOutfits', user.uid, 'outfits', outfitId);
    
    for (let item of filtered) {
      await updateDoc(outfitRef, { items: arrayUnion(item) });
    }
    setSelectedItems([]);
    setShowSheet(false);
  };

  if (closet === undefined) return <h2>Loading...</h2>;
  if (closet === null) return <h2>Closet not found</h2>;

  // Filter items by category
  const filteredItems =
    categoryFilter === 'All'
      ? closet.items || []
      : (closet.items || []).filter(i => i.category === categoryFilter);

  return (
    <div>
      <header style={{ backgroundColor: '#DF8EC1', height: '250px', textAlign: 'center', lineHeight: '50px', paddingTop: '3%' }}>
        <h1>{closet.title}</h1>
        <Link to="/post">
          <Button variant="outline-dark">Add New Item</Button>
        </Link>
        <div className='infocontainer'>
          <p><strong>Members:</strong> {Array.isArray(closet.members) ? closet.members.length : 0}</p>
          <p><strong>Items:</strong> {Array.isArray(closet.items) ? closet.items.length : 0}</p>
        </div>
        <div className='infocontainer'>
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
        {filteredItems.length > 0 ? filteredItems.map(item => (
          <div key={item.id} className='itemCard'>
            <img
              src={item.image}
              alt={item.name}
              className={`itemImage ${selectedItems.some(i => i.id === item.id) ? 'selected' : ''}`}
              onClick={() => toggleSelection(item)}
            />
            <Button variant='light' size='sm' className='detailsButton' onClick={() => { setCurrentItem(item); setShowItemModal(true); }}>
              See Details
            </Button>
          </div>
        )) : <p>No items in this category</p>}
      </div>

      <BottomSheet
        open={showSheet}
        onClose={() => setShowSheet(false)}
        selectedItems={selectedItems}
        existingOutfits={outfits}
        onAddToOutfit={handleAddToOutfit}
        onCreateOutfit={() => { setShowSheet(false); setShowNameModal(true); }}
      />

      {/* New Outfit Modal */}
      <Modal show={showNameModal} onHide={() => setShowNameModal(false)} centered>
        <Modal.Header closeButton><Modal.Title>Name New Outfit</Modal.Title></Modal.Header>
        <Modal.Body>
          <input type='text' className='form-control' placeholder='Enter outfit name'
            value={newOutfitName} onChange={e => setNewOutfitName(e.target.value)} />
        </Modal.Body>
        <Modal.Footer>
          <Button variant='secondary' onClick={() => setShowNameModal(false)}>Cancel</Button>
          <Button variant='primary' className='pinkButton' onClick={handleConfirmCreateOutfit}>Create Outfit</Button>
        </Modal.Footer>
      </Modal>

      {/* Item Details Modal */}
      <Modal show={showItemModal} onHide={() => setShowItemModal(false)} centered>
        <Modal.Header closeButton><Modal.Title>{currentItem?.name}</Modal.Title></Modal.Header>
        <Modal.Body>
          <img src={currentItem?.image} alt={currentItem?.name} style={{ width: '100%', borderRadius: 8, marginBottom: 10 }} />
          <p><strong>Category:</strong> {currentItem?.category}</p>
          <p><strong>Description:</strong> {currentItem?.description || 'No description available.'}</p>
          <p><strong>Size:</strong> {currentItem?.size}</p>
          <p><strong>Owner Name:</strong> {currentItem?.ownerName}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant='secondary' onClick={() => setShowItemModal(false)}>Close</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
