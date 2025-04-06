import React from 'react';
import './BottomSheet.css';

function BottomSheet({
    open,
    onClose,
    selectedItems,
    existingOutfits,
    onAddToOutfit,
    onCreateOutfit
  }) {
    if (!open) return null;

    return (
        <div className="bottomSheet">
        <div className="bottomSheetHeader">

          {/* handle/button at the top */}
          <div className="handle" />
          <button className="closeBtn" onClick={onClose}>×</button>
        </div>
        <div className="bottomSheetContent">
          <h3 className="sheetTitle">Add to Outfit +</h3>
  
          <p className="selectedCount">
            {selectedItems.length} item{selectedItems.length !== 1 ? 's' : ''} selected
          </p>
  
          <div className="outfitList">
            {existingOutfits.map((outfit) => (
              <div
                key={outfit.id}
                className="outfitCard"
                onClick={() => onAddToOutfit(outfit.id, selectedItems)}
              >
                <p className="outfitName">{outfit.name}</p>
                <div className="outfitImages">
                  {outfit.items.slice(0, 3).map((item, index) => (
                    <img
                      key={index}
                      src={item.image}
                      alt={item.name}
                      className="outfitItemImage"
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
  
          <button className="createOutfitBtn" onClick={onCreateOutfit}>
            Create New Outfit
          </button>
        </div>
      </div>
    );
  }
  
  export default BottomSheet;