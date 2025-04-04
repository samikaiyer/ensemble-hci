import React, { useState, useEffect } from "react";
import Card from "react-bootstrap/Card";
import { Button, Modal, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "./Closets.css";

function Closets() {
  const navigate = useNavigate();
  const [closets, setClosets] = useState([]); 
  const [showCreate, setShowCreate] = useState(false);
  const [showJoin, setShowJoin] = useState(false);
  const [closetName, setClosetName] = useState("");
  const [joinCode, setJoinCode] = useState("");

  useEffect(() => {
    const storedClosets = JSON.parse(localStorage.getItem("closets"));
    if (storedClosets) {
      setClosets(storedClosets);
    }
  }, []);

  useEffect(() => {
    if (closets.length > 0) {
      localStorage.setItem("closets", JSON.stringify(closets));
    }
  }, [closets]);

  const generateClosetId = () => {
    return `closet-${Date.now()}`;
  };

  const handleCloseCreate = () => {
    setShowCreate(false);
    setClosetName("");
  };

  const handleCloseJoin = () => {
    setShowJoin(false);
    setJoinCode("");
  };

  const handleCreateCloset = () => {
    const newCloset = {
      id: generateClosetId(),
      title: closetName,
      num_members: 1,
      num_items: 0,
      items: []
    };

    setClosets((prevClosets) => [...prevClosets, newCloset]);
    handleCloseCreate();
  };

   const handleClosetClick = (closet) => {
    navigate(`/closet/${encodeURIComponent(closet.title)}`, {
      state: { closets: closets }
    });
  };

  const clearClosets = () => {
    setClosets([]); 
  };

  return (
    <div className="closetspage">
      <header className="header">
        <h1 className="header-title">Closets</h1>
        <div className="button-container">
          <Button variant="outline-dark" size="sm" onClick={() => setShowCreate(true)}>Create</Button>
          <Button variant="outline-dark" size="sm" onClick={() => setShowJoin(true)}>Join</Button>
        </div>
      </header>

      <div>
        {closets.map((closet) => (
          <ClosetCard
            key={closet.id}
            title={closet.title}
            code={closet.id}
            members={closet.num_members}
            items={closet.num_items}
            onClick={() => handleClosetClick(closet)}
          />
        ))}
      </div>

      {/* Create Closet Modal */}
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
            onClick={handleCreateCloset}
          >
            Submit
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Join Closet Modal */}
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

const ClosetCard = ({ title, members, items, code, onClick }) => {
  return (
    <Card className="closet-card" onClick={onClick}>
      <Card.Body>
        <Card.Title>{title}</Card.Title>
        <Card.Text>Code: {code}</Card.Text>
        <Card.Text>{members} members</Card.Text>
        <Card.Text>{items} items</Card.Text>
      </Card.Body>
    </Card>
  );
};

export default Closets;
