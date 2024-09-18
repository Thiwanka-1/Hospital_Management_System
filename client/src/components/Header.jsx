import { Link } from "react-router-dom";
import { useSelector } from 'react-redux';
import logo from "./logo.png";

export default function Header() {
  const { currentUser } = useSelector((state) => state.user); // Get currentUser from Redux store

  return (
    <div className='bg-slate-200'>
      <div className="flex justify-between items-center max-w-6xl mx-auto p-3">
        <div className="flex items-center">
          <img src={logo} alt="Destiny Library Logo" className="h-10 mr-2" />
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
          {/* Conditionally render the IDE link based on user authentication */}
          
            <li>
              <Link to='/ide'>IDE</Link>
            </li>
          
          <Link to='/profile'>
            {currentUser ? (
              <img src={currentUser.profilePicture} alt='profile' className='h-7 w-7 rounded-full object-cover' />
            ) : (
              <li>Sign In</li>
            )}
          </Link>
        </ul>
      </div>
    </div>
  );
}
