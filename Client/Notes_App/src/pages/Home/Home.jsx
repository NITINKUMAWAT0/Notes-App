import { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./Home.scss";
import { FaTrashAlt } from 'react-icons/fa';
import { AiOutlinePushpin, AiOutlineInfoCircle } from 'react-icons/ai';

const Home = () => {
  const [notes, setNotes] = useState([]);
  const [activeNoteId, setActiveNoteId] = useState(null);
  const textareaRefs = useRef([]);
  const titleRefs = useRef([]);

  // Fetch notes from backend on component mount
  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/notes");
        if (response.data) {
          // Sort notes by pinned status (pinned notes first)
          const sortedNotes = response.data.sort((a, b) => b.pinned - a.pinned);
          setNotes(sortedNotes);
          if (sortedNotes.length > 0) {
            setActiveNoteId(sortedNotes[0].id);
          }
        } else {
          console.error("Empty response data received.");
        }
      } catch (error) {
        console.error("Error fetching notes:", error.message);
      }
    };
    fetchNotes();
  }, []);

  // Function to create a new note
  const handleCreateNote = async () => {
    try {
      const response = await axios.post("http://localhost:5000/api/notes", {
        title: "",
        content: "",
      });
      if (response.data) {
        const newNote = response.data;
        // Add new note to the beginning of the array (pinned notes first)
        setNotes([newNote, ...notes]);
        setActiveNoteId(newNote.id);
      } else {
        console.error("Empty response data received.");
      }
    } catch (error) {
      console.error("Error creating note:", error.message);
    }
  };

  // Function to handle note updates
  const handleNoteChange = async (id, key, value) => {
    try {
      const updatedValue = value; // Ensure no trimming is done here
      const response = await axios.patch(
        `http://localhost:5000/api/notes/${id}`,
        {
          [key]: updatedValue,
        }
      );
      if (response.data) {
        // Update notes array with the updated note object
        const updatedNotes = notes.map((note) =>
          note.id === id ? { ...note, [key]: updatedValue } : note
        );
        setNotes(updatedNotes);
      } else {
        console.error("Empty response data received.");
      }
    } catch (error) {
      console.error(`Error updating note ${key}:`, error.message);
    }
  };
  

  // Function to handle note deletion
  const handleDeleteNote = async (id) => {
    try {
      const response = await axios.delete(`http://localhost:5000/api/notes/${id}`);
      if (response.data && response.status === 200) {
        const updatedNotes = notes.filter((note) => note.id !== id);
        setNotes(updatedNotes);
        if (updatedNotes.length > 0) {
          setActiveNoteId(updatedNotes[0].id);
        } else {
          setActiveNoteId(null);
        }
      } else {
        console.error("Invalid response received.");
      }
    } catch (error) {
      console.error("Error deleting note:", error.message);
    }
  };

  // Function to handle note pinning
  const handlePinNote = async (id, isPinned) => {
    try {
      const response = await axios.patch(`http://localhost:5000/api/notes/${id}`, {
        pinned: !isPinned,
      });
      if (response.data) {
        const updatedNotes = notes.map((note) =>
          note.id === id ? { ...note, pinned: !isPinned } : note
        );
        // Sort notes to keep pinned notes at the top
        updatedNotes.sort((a, b) => b.pinned - a.pinned);
        setNotes(updatedNotes);
      } else {
        console.error("Empty response data received.");
      }
    } catch (error) {
      console.error("Error pinning note:", error.message);
    }
  };

  // Function to handle click on a note to make it active
  const handleNoteClick = (id) => {
    setActiveNoteId(id);
  };

  return (
    <div className="home">
      {/* Sidebar with create button and list of notes */}
      <div className="sidebar">
        <button onClick={handleCreateNote}>Create</button>
        <ul>
          {notes.map((note) => (
            <li
              key={note.id}
              onClick={() => handleNoteClick(note.id)}
              className={note.id === activeNoteId ? "active" : ""}
              data-id={note.id}
            >
              <span>{note.title || "New Note"}</span>
              <FaTrashAlt
                className="delete-icon"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteNote(note.id);
                }}
              />
              <AiOutlinePushpin
                size={20}
                className={`pin-icon ${note.pinned ? 'pinned' : ''}`}
                onClick={(e) => {
                  e.stopPropagation();
                  handlePinNote(note.id, note.pinned);
                }}
              />
              <AiOutlineInfoCircle size={20} className="info"/>
            </li>
          ))}
        </ul>
      </div>

      {/* Display area for notes */}
      <div className="notes">
        {notes.map((note, index) => (
          <div
            key={note.id}
            className={`note ${note.id === activeNoteId ? "active" : ""}`}
            style={{ display: note.id === activeNoteId ? "block" : "none" }}
          >
            <input
              type="text"
              placeholder="Title"
              value={note.title}
              onChange={(e) =>
                handleNoteChange(note.id, "title", e.target.value)
              }
              className="title-input"
              ref={(el) => (titleRefs.current[index] = el)}
              data-id={note.id}
            />
            <textarea
              placeholder="Text"
              value={note.content}
              onChange={(e) =>
                handleNoteChange(note.id, "content", e.target.value)
              }
              className={`input field ${
                note.id === activeNoteId ? "active" : ""
              }`}
              style={{
                display: note.id === activeNoteId ? "block" : "none",
              }}
              ref={(el) => (textareaRefs.current[index] = el)}
              data-id={note.id}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
