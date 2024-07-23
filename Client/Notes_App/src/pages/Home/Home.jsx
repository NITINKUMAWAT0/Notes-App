import { useState, useEffect } from "react";
import axios from "axios";
import "./Home.scss";
import { FaTrashAlt } from "react-icons/fa";
import { AiOutlinePushpin, AiOutlineInfoCircle } from "react-icons/ai";
import TextEditor from "../../Components/Editor/TextEditor";

const Home = () => {
  const [notes, setNotes] = useState([]);
  const [activeNoteId, setActiveNoteId] = useState(null);
  const [noteDetails, setNoteDetails] = useState(null);
  const [hoveredNoteId, setHoveredNoteId] = useState(null);

  // Fetch notes from backend on component mount
  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/notes");
        if (response.data) {
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

  // Fetch note details for hover card
  const fetchNoteDetails = async (id) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/notes/${id}`);
      if (response.data) {
        setNoteDetails(response.data);
      } else {
        console.error("Empty response data received.");
      }
    } catch (error) {
      console.error("Error fetching note details:", error.message);
    }
  };

  // Function to create a new note
  const handleCreateNote = async () => {
    try {
      const response = await axios.post("http://localhost:5000/api/notes", {
        title: "",
        content: "",
      });
      if (response.data) {
        const newNote = response.data;
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
  const handleNoteChange = async (id, content, field = "content") => {
    try {
      const updateData = field === "content" ? { content } : { title: content };
      const response = await axios.patch(
        `http://localhost:5000/api/notes/${id}`,
        updateData
      );
      if (response.data) {
        const updatedNotes = notes.map((note) =>
          note.id === id ? { ...note, [field]: content } : note
        );
        setNotes(updatedNotes);
      } else {
        console.error("Empty response data received.");
      }
    } catch (error) {
      console.error(`Error updating note ${field}:`, error.message);
    }
  };

  // Function to handle note deletion
  const handleDeleteNote = async (id) => {
    try {
      const response = await axios.delete(
        `http://localhost:5000/api/notes/${id}`
      );
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
      const response = await axios.patch(
        `http://localhost:5000/api/notes/${id}`,
        {
          pinned: !isPinned,
        }
      );
      if (response.data) {
        const updatedNotes = notes.map((note) =>
          note.id === id ? { ...note, pinned: !isPinned } : note
        );
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
    fetchNoteDetails(id); // Fetch note details when note is clicked
  };

  return (
    <div className="home">
      <div className="notes">
        <div className="text-area">
          <div className="button">
            <button onClick={handleCreateNote}>
              Create a note...
            </button>
          </div>
          {notes.map((note) => (
            <div
              key={note.id}
              className={`note ${note.id === activeNoteId ? "active" : ""}`}
              style={{ display: note.id === activeNoteId ? "block" : "none" }}
            >
              <input
                type="text"
                placeholder="title"
                value={note.title || ""}
                onChange={(e) =>
                  handleNoteChange(note.id, e.target.value, "title")
                }
                className="title-input"
                data-id={note.id}
              />
              {note.id === activeNoteId && (
                <TextEditor
                  value={note.content || ""}
                  onChange={(content) => handleNoteChange(note.id, content)}
                  className="text-editor"
                />
              )}
            </div>
          ))}
        </div>

        <div className="AllTexts">
          <ul>
            {notes.map((note) => (
              <li
                key={note.id}
                onClick={() => handleNoteClick(note.id)}
                className={note.id === activeNoteId ? "active" : ""}
                data-id={note.id}
                onMouseEnter={() => {
                  setHoveredNoteId(note.id);
                  fetchNoteDetails(note.id); // Fetch details on hover
                }}
                onMouseLeave={() => setHoveredNoteId(null)}
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
                  className={`pin-icon ${note.pinned ? "pinned" : ""}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePinNote(note.id, note.pinned);
                  }}
                />
                <AiOutlineInfoCircle
                  size={20}
                  className="info"
                />
                {hoveredNoteId === note.id && noteDetails && (
                  <div className="hover-card">
                    <p><strong>Created At:</strong> {new Date(noteDetails.created_at).toLocaleString()}</p>
                    <p><strong>Last Updated:</strong> {new Date(noteDetails.updated_at).toLocaleString()}</p>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Home;
