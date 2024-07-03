import { Link } from "react-router-dom"

export default function Header() {
  return (
    <div className='bg-slate-200'>
        <div className="flex justify-between items-center max-w-6xl mx-auto p-3">
            <Link to='/'>
            <h1 className='font-bold'>Destiny Library</h1>
            </Link>
            <ul className='flex gap-4'>
                <Link to = '/'>
                    <li>Home</li>
                </Link>
                <Link to='/about'>
                    <li>About Us</li>
                </Link>
                <Link to='/membership'>
                    <li>Memberships</li>
                </Link>
                <Link to='/contact'>
                    <li>Contact Us</li>
                </Link>
                <Link to='/sign-in'>
                    <li>Sign In</li>
                </Link>
                
                
                
                
               
            </ul>
        </div>

    </div>
  )
}
