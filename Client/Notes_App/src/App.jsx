
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home/Home';
import Navbar from './Components/Navbar/Navbar';
import Sidebar from './Components/Sidebar/Sidebar'; // Import the Sidebar component

import './App.css';

function App() {
  return (
    <Router>
      <Navbar />
      <div className="app-layout">
        <Sidebar /> {/* Add Sidebar here */}
        <div className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
