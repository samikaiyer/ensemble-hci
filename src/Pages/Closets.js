import React, { useState, useEffect } from "react";
import Card from "react-bootstrap/Card";
import { Button, Modal, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  arrayUnion,
  arrayRemove
} from "firebase/firestore";
import { db, auth } from "../firebase";
import "./Closets.css";

export default function Closets() {
  const navigate = useNavigate();
  const user = auth.currentUser;
  const [closets, setClosets] = useState([]);
  const [showCreate, setShowCreate] = useState(false);
  const [showJoin, setShowJoin] = useState(false);
  const [closetName, setClosetName] = useState("");
  const [joinCode, setJoinCode] = useState("");

  useEffect(() => {
    if (!user) return;
    const q = query(
      collection(db, "closets"),
      where("members", "array-contains", user.uid)
    );
    const unsubscribe = onSnapshot(q, snapshot => {
      const data = snapshot.docs.map(docSnap => {
        const d = docSnap.data();
        return {
          id: docSnap.id,
          title: d.title,
          members: d.members || [],
          items: d.items || []
        };
      });
      setClosets(data);
    });
    return unsubscribe;
  }, [user]);

  const generateClosetId = () => `closet-${Date.now()}`;

  const handleCloseCreate = () => {
    setShowCreate(false);
    setClosetName("");
  };

  const handleCloseJoin = () => {
    setShowJoin(false);
    setJoinCode("");
  };

  // Create a new closet in Firestore
  const handleCreateCloset = async () => {
    const id = generateClosetId();
    const ref = doc(db, "closets", id);
    await setDoc(ref, {
      title: closetName,
      members: [user.uid],
      items: []
    });
    handleCloseCreate();
  };

  // Join an existing closet
  const handleJoinCloset = async () => {
    const ref = doc(db, "closets", joinCode.trim());
    const snap = await getDoc(ref);
    if (!snap.exists()) {
      alert("Closet not found");
    } else {
      await updateDoc(ref, {
        members: arrayUnion(user.uid)
      });
      handleCloseJoin();
    }
  };

  // Leave closet 
  const handleLeaveCloset = async (closetId) => {
    const ref = doc(db, "closets", closetId);
    await updateDoc(ref, {
      members: arrayRemove(user.uid),
    });
  };

  const handleClosetClick = closet => {
    navigate(`/closet/${closet.id}`);
  };

  return (
    <div className="closetspage">
      <header className="header">
        <h1 className="header-title">Closets</h1>
        <div className="button-container">
          <Button variant="outline-dark" size="sm" onClick={() => setShowCreate(true)}>
            Create
          </Button>
          <Button variant="outline-dark" size="sm" onClick={() => setShowJoin(true)}>
            Join
          </Button>
        </div>
      </header>

      <div className="closet-list">
        {closets.map(closet => (
          <ClosetCard
            key={closet.id}
            title={closet.title}
            code={closet.id}
            members={closet.members.length}
            items={closet.items.length}
            onClick={() => handleClosetClick(closet)}
            onLeave={() => handleLeaveCloset(closet.id)}
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
                onChange={e => setClosetName(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" disabled={!closetName.trim()} onClick={handleCreateCloset}>
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
                onChange={e => setJoinCode(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" disabled={!joinCode.trim()} onClick={handleJoinCloset}>
            Submit
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

function ClosetCard({ title, members, items, code, onClick, onLeave }) {
  return (
    <Card className="closet-card">
      <Card.Body>
        <div onClick={onClick}>
          <div className="titlerow">
            <Card.Title>{title}</Card.Title>
            <Button variant="outline-danger" size="sm" onClick={(e) => {
              e.stopPropagation();
              onLeave();
            }}>
              Leave
            </Button>
          </div>
          <Card.Text>Code: {code}</Card.Text>
          <Card.Text>{members} members</Card.Text>
          <Card.Text>{items} items</Card.Text>
        </div>
        
      </Card.Body>
    </Card>
  );
}
