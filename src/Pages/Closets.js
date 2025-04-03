import React, { useState } from "react";
import Card from "react-bootstrap/Card";
import { Button, Modal, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import closetsData from "../closets.json";
import "./Closets.css"; 

function Closets() {
  const navigate = useNavigate();
  const [showCreate, setShowCreate] = useState(false);
  const [showJoin, setShowJoin] = useState(false);
  const [closetName, setClosetName] = useState("");
  const [joinCode, setJoinCode] = useState("");

  const handleCloseCreate = () => {
    setShowCreate(false);
    setClosetName("");
  };

  const handleCloseJoin = () => {
    setShowJoin(false);
    setJoinCode("");
  };

  return (
    <div className="closetspage">
      <header className="header">
        <h1 className="header-title">Closets</h1>
        <div className="button-container">
          <Button variant="outline-dark" onClick={() => setShowJoin(true)}>
            Join
          </Button>
          <Button variant="outline-dark" onClick={() => setShowCreate(true)}>
            Create
          </Button>
        </div>
      </header>

      <div>
        {closetsData.closets.map((closet) => (
          <ClosetCard
            key={closet.title}
            title={closet.title}
            members={closet.num_members}
            items={closet.num_items}
            status={closet.status}
            onClick={() => navigate(`/closet/${encodeURIComponent(closet.title)}`)}
          />
        ))}
      </div>

      <Modal show={showCreate} onHide={handleCloseCreate} centered>
        <Modal.Header closeButton>
          <Modal.Title>Create New Closet</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Closet Name</Form.Label>
              <Form.Control
                type="text"
                className="modal-input"
                placeholder="Enter closet name"
                value={closetName}
                onChange={(e) => setClosetName(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="primary"
            disabled={!closetName.trim()}
            onClick={() => {
              console.log("Closet Created:", closetName);
              handleCloseCreate();
            }}
          >
            Submit
          </Button>
        </Modal.Footer>
      </Modal>


      <Modal show={showJoin} onHide={handleCloseJoin} centered>
        <Modal.Header closeButton>
          <Modal.Title>Join Closet</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Enter Join Code</Form.Label>
              <Form.Control
                type="text"
                className="modal-input"
                placeholder="Enter join code"
                value={joinCode}
                onChange={(e) => setJoinCode(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="primary"
            disabled={!joinCode.trim()}
            onClick={() => {
              console.log("Joined Closet with code:", joinCode);
              handleCloseJoin();
            }}
          >
            Submit
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

const ClosetCard = ({ title, members, items, status, onClick }) => {
  return (
    <Card className="closet-card" onClick={onClick}>
      <Card.Body>
        <Card.Title>
          {title}, {status}
        </Card.Title>
        <Card.Text>{members} members</Card.Text>
        <Card.Text>{items} items</Card.Text>
      </Card.Body>
    </Card>
  );
};

export default Closets;
