// pages/Login/Login.js
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.scss'

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Login successful with', { email, password });
    navigate('/home');
  };

  return (
    <div className='login'>
       <div className="blur1"></div>
         <div className="blur2"></div>
         <div className="blur3"></div>

      <form onSubmit={handleSubmit}>
      <h2>Login</h2>
        <div>
          <label>Email:</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div>
          <label>Password:</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
