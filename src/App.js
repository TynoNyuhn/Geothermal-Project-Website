import logo from './logo.svg';
import './App.css';
import { Route, Link, BrowserRouter as Router, Routes } from "react-router-dom";
import SignInSide from './pages/SignInSide';
import SignUp from './pages/SignUp';
import Datamap from './pages/Datamap';
import Dashboard from './pages/Dashboard';
import Admin from './pages/Admin';

function App() {
  return (
    <>
    <Router>
      <Routes>
        <Route path="/" element={<SignInSide />}/>
        <Route path="/login" element={<SignInSide />}/>
        <Route path="/register" element={<SignUp />}/>
        <Route path="/map" element={<Dashboard />}/>
        <Route path="/admin" element={<Admin />}/>
        {/* <Route path="/test" element={<Datamap />}/> */}
      </Routes>
    </Router>
    </>
  );
}

export default App;
