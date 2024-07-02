import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Signup from './pages/Signup/Signup';
import Login from './pages/Login/Login';
import Home from './pages/Home/Home';
import LandingPage from './pages/Landing/Landing'
import Archives from './pages/Archives/Archives';
import './App.css'
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/archives" element={<Archives/>}/>
        <Route path="/" element={<LandingPage />} />
      </Routes>
    </Router>
  );
}
export default App;
