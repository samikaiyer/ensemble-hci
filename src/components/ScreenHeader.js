import React from 'react';

const ScreenHeader = ({text}) => {
    return (
      <header style={{ backgroundColor: "#DF8EC1", height: "60px", display: "flex", justifyContent: "center",  alignItems: "center", lineHeight: "60px", paddingTop: "2%" }}>
        <h1>{text}</h1>
      </header>
    );
  };
  
  export default ScreenHeader;