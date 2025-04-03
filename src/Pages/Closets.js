import React, { useState } from "react";
import Card from "react-bootstrap/Card";
import { Button, Modal, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import closetsData from "../closets.json";

function Closets() {
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const [closetName, setClosetName] = useState("");

  const handleClose = () => {
    setShow(false);
    setClosetName(""); // Reset input on close
  };

  const handleShow = () => setShow(true);

  return (
    <div className="closetspage">
      <header
        style={{
          backgroundColor: "#DF8EC1",
          height: "60px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          position: "relative",
        }}
      >
        <h1 style={{ margin: 0, textAlign: "center", flexGrow: 1 }}>Closets</h1>
        <Button
          variant="outline-dark"
          onClick={handleShow}
          style={{
            width: "30px",
            height: "30px",
            borderRadius: "50%",
            position: "absolute",
            right: "20px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          +
        </Button>
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

      {/* Modal */}
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Create New Closet</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Closet Name</Form.Label>
              <Form.Control
                type="text"
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
              handleClose();
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
    <Card style={{ margin: "10px" }} onClick={onClick}>
      <Card.Body className="closetcard">
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
