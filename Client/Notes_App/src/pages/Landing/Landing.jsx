import { Link } from "react-router-dom";
import { AiOutlineTags, AiOutlineHistory, AiOutlineDollarCircle } from 'react-icons/ai'; // Import additional icons as needed
import "./Landing.scss"; // Import the SCSS file for styling
import { IoIosCloudUpload } from 'react-icons/io';

const Landing = () => {
  return (
    <div className="landing-container">
        <div className="blur1"></div>
      <h1>The simplest way to</h1>
      <h1 className="next-line">keep notes</h1>
      <p className="quotation">"All your notes, synced on all your devices."</p>
      <div className="landing-options">
        <Link to="/login" className="landing-button">
          Login
        </Link>
        <Link to="/signup" className="landing-button">
          Signup
        </Link>
      </div>
      <div className="blur2"></div>
      <h1 className="head">simple on the surface</h1>
      <div className="More-Stuff">
        <div className="items">
          <div className="icon-container">
            <IoIosCloudUpload size={24} className="icon-blue" />
          </div>
          <div className="text-container">
            <h3>Use it everywhere</h3>
            <p>
              Notes stay updated across all your devices, automatically and in real time.
            </p>
          </div>
        </div>
        <div className="items">
          <div className="icon-container">
            <AiOutlineTags size={24} className="icon-blue" />
          </div>
          <div className="text-container">
            <h3>Stay organized</h3>
            <p>Add tags to find notes quickly with instant searching.</p>
          </div>
        </div>
        <div className="items">
          <div className="icon-container">
            <AiOutlineHistory size={24} className="icon-blue" />
          </div>
          <div className="text-container">
            <h3>Go back in time</h3>
            <p>
              Notes are backed up with every change, so you can see what you noted.
            </p>
          </div>
        </div>
        <div className="items">
          <div className="icon-container">
            <AiOutlineDollarCircle size={24} className="icon-blue" />
          </div>
          <div className="text-container">
            <h3>It’s free</h3>
            <p>Apps, backups, syncing, sharing – it’s all completely free.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;
