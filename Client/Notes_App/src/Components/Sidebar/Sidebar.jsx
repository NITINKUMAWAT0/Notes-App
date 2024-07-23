import './Sidebar.scss';
import { NavLink } from 'react-router-dom';
import { FaLightbulb} from 'react-icons/fa'; // Import icons from Font Awesome

const Sidebar = () => {
  return (
    <div className="sidebar">
      <NavLink
        to="/"
        className={({ isActive }) => (isActive ? 'active-link' : '')}
      >
        <FaLightbulb className="icon" />
        Notes
      </NavLink>
    </div>
  );
};

export default Sidebar;
