import { Link } from "react-router-dom";
import "./Landing.scss"; // Import the SCSS file for styling

const Landing = () => {
  return (
    <div className="landing-container">
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
      <h1 className="head">simple on the surface</h1>
      <div className="More-Stuff">
        <div className="items">
          <icon />
          <h3>Use it everywhere</h3>
          <p>
            Notes stay updated across all your devices, automatically and in
            real time.
          </p>
        </div>
        <div className="items">
          <icon />
          <h3>Stay organized</h3>
          <p>Add tags to find notes quickly with instant searching.</p>
        </div>
        <div className="items">
          <icon />
          <h3>Go back in time</h3>
          <p>
            Notes are backed up with every change, so you can see what you noted.
          </p>
        </div>
        <div className="items">
          <icon />
          <h3>It’s free</h3>
          <p>Apps, backups, syncing, sharing – it’s all completely free.</p>
        </div>
      </div>
    </div>
  );
};

export default Landing;
