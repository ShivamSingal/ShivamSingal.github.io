import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="fixed top-0 w-full bg-[#fcf7f2] px-12 py-6">
      <div className="flex justify-end gap-8">
        <Link to="/" className="text-[#e1624d] hover:text-[#d14d38]">
          Home
        </Link>
        <Link to="/about" className="text-[#e1624d] hover:text-[#d14d38]">
          About
        </Link>
        <Link to="/projects" className="text-[#e1624d] hover:text-[#d14d38]">
          Projects
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;
