import {Link} from 'react-router-dom'
import './Start.css';

const Start = () => {
  return (
    <div className="App">
      <nav className="navbar">
        <div className="navbar-left">
          <img src="https://img.icons8.com/material-rounded/48/A259FF/cyber-security.png" alt="Logo" className="logo" />
          <span className="navbar-title">Picture PIN</span>
        </div>
        <div className="navbar-right">
          <Link to={'/Login'}><button className="login-btn">Login</button></Link>
          <Link to={'/Register'}><button className="signup-btn">Sign Up</button></Link>
        </div>
      </nav>

      <main className="main-section">

        <div className="content">
          <h1 className="title">Discover Picture PIN</h1>
          <p className="subtitle">
            A Novel Approach For Security And User Experience Of Graphical Password Authentication.
          </p>
          <Link to={'/Login'}><button className="know-more-btn">
            <i className="fa fa-lock"></i> Know More
          </button>
          </Link>
        </div>
        <div className="image-container">
          <img src="https://i.pinimg.com/736x/67/a1/a1/67a1a1b9b21505a42648010e3669076e.jpg" alt="Security" className="main-image" />
        </div>
      </main>
    </div>
  );
};

export default Start;
