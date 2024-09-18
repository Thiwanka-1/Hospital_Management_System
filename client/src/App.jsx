import { BrowserRouter, Routes, Route} from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Profile from './pages/Profile';
import Header from './components/Header';
import PrivateRoute from './components/PrivateRoute';
import ProjectEditor from './components/ProjectEditor';
import ProjectList from './components/ProjectList';
import IDELayout from './components/IDELayout';


export default function App() {
  return <BrowserRouter>
  <Header />
    <Routes>
      <Route path = "/" element = {<Home />} />
      <Route path = "/about" element = {<About />} />
      <Route path = "/sign-in" element = {<SignIn />} />
      <Route path = "/sign-up" element = {<SignUp />} />
      <Route element={<PrivateRoute />}>
        <Route path = "/profile" element = {<Profile />} />
        <Route path="/ide" element={<IDELayout />} />              
        <Route path="/projects" element={<ProjectList />} />      
        <Route path="/editor/:id" element={<ProjectEditor />} /> 
      </Route>
    </Routes>
  
  </BrowserRouter>
    
}
