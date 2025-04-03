import React from "react";
import Card from 'react-bootstrap/Card';
import ScreenHeader from "../components/ScreenHeader";
import closetsData from "../closets.json";
import { useNavigate } from "react-router-dom";

function Closets() {
  const navigate = useNavigate();

  return (
    <div className="closetspage">
      <ScreenHeader text="Closets" />
      <div>
      {closetsData.closets.map((closet) => (
        <ClosetCard
          title={closet.title}
          members={closet.num_members}
          items={closet.num_items}
          status={closet.status}
          onClick={() => navigate(`/closet/${encodeURIComponent(closet.title)}`)}
        />
      ))}
      </div>
    </div>
  );
}

const ClosetCard = ({ title, members, items, status, onClick}) => {
  return (
    <Card style={{ margin: '10px' }} onClick={onClick}>
      <Card.Body className="closetcard">
        <Card.Title>{title}, {status}</Card.Title>
        <Card.Text>{members} members </Card.Text>
        <Card.Text>{items} items </Card.Text>
      </Card.Body>
    </Card>
  )
}
export default Closets;
