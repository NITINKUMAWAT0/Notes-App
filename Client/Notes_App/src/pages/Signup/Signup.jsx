import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Signup.scss';
const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle signup logic here
    console.log('Signup successful with', { email, password });
    navigate('/login');
  };

  return (
    <div className='signup-page'>
         <div className="blur1"></div>
         <div className="blur2"></div>
         <div className="blur3"></div>
      <form onSubmit={handleSubmit}>
      <h2>Signup</h2>
        <div>
          <label>Email:</label>
          <input type="email" placeholder='Email' value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div>
          <label>Password:</label>
          <input type="password" placeholder='Password' value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <button type="submit">Signup</button>
      </form>
    </div>
  );
};

export default Signup;
