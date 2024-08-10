import { Link } from "react-router-dom";
import logo from "./logo.png"; // Replace with your logo file path

export default function Header() {
  return (
    <div className='bg-slate-200'>
      <div className="flex justify-between items-center max-w-6xl mx-auto p-3">
        <div className="flex items-center">
          <img src={logo} alt="Destiny Library Logo" className="h-10 mr-2" /> {/* Adjust height and margin as needed */}
          <Link to='/'>
            <h1 className='font-bold text-xl'>EduCode</h1>
          </Link>
        </div>
        <ul className='flex gap-4'>
          <li>
            <Link to='/'>Home</Link>
          </li>
          <li>
            <Link to='/about'>About Us</Link>
          </li>
          <li>
            <Link to='/membership'>Memberships</Link>
          </li>
          <li>
            <Link to='/contact'>Contact Us</Link>
          </li>
          <li>
            <Link to='/sign-in'>Sign In</Link>
          </li>     
        </ul>
      </div>
    </div>
  );
}
