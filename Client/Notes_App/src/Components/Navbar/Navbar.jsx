import Logo from '../../Noteslogo.png';
import './Navbar.scss';
import { FiGrid, FiSettings } from 'react-icons/fi'; 
import { AiOutlineUser } from 'react-icons/ai'; // Import the outline user icon

const Navbar = () => {
  return (
    <div>
      <div className='navbar'>
        <img src={Logo} alt="Logo" className='logo' />
        <div className='icon'>
        <FiGrid size={28} title="Large Grid"  className='icons'/>
        <FiSettings size={28} className='icons'/>
        <AiOutlineUser size={28} className="icons" />  
        </div>
       

      </div>
      <hr  className='Hr'/>
    </div>
  );
};

export default Navbar;
