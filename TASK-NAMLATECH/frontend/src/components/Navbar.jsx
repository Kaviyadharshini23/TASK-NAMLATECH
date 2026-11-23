import { Link } from "react-router-dom";

function Navbar() {
  return (
    <header className="navbar">
      <div className="nav-inner">
        <Link to="/" className="logo" aria-label="HotelHub home">
          <span className="logo-mark" aria-hidden="true">H</span>
          <span>Hotel<span className="logo-accent">Hub</span></span>
        </Link>
        <nav aria-label="Main navigation">
          <Link to="/" className="nav-link nav-explore">Explore stays</Link>
          <Link to="/add" className="button button-primary nav-add">＋ Add a hotel</Link>
        </nav>
      </div>
    </header>
  );
}

export default Navbar;