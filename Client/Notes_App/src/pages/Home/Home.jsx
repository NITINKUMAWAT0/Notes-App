import { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./Home.scss";
import { FaTrash } from "react-icons/fa";

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
          setNotes(response.data);
          if (response.data.length > 0) {
            setActiveNoteId(response.data[0].id);
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
        setNotes([...notes, newNote]);
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
      const response = await axios.put(
        `http://localhost:5000/api/notes/${id}`,
        {
          [key]: value,
        }
      );
      if (response.data) {
        const updatedNotes = notes.map((note) =>
          note.id === id ? { ...note, [key]: value } : note
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
              <FaTrash
                className="delete-icon"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteNote(note.id);
                }}
              />
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
              data-id={note.id}
              ref={(el) => (textareaRefs.current[index] = el)}
              className={`input field ${
                note.id === activeNoteId ? "active" : ""
              }`}
              value={note.content}
              onChange={(e) =>
                handleNoteChange(note.id, "content", e.target.value)
              }
              style={{
                display: note.id === activeNoteId ? "block" : "none",
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
