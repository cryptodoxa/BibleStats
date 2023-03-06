import '../css/App.css';
import React from 'react';
import { Outlet, Link, useLocation} from 'react-router-dom';


const App = () => {
  const location = useLocation();
  if (location.pathname == "/"){
    window.location.replace("/concordance/search");
  }

  const locations = [
    "/concordance/search",
    "/about",
    "/roadmap"
  ];
  
  return (
    <div className="App">
      <div className="title">Nifty Bible Stats</div>
      <div className="navbar">
        <Link to="/concordance/search">Concordance</Link>
        <Link to="/about">About</Link>
        <Link to="/roadmap">Roadmap</Link>
      </div>
      <div className="main-container">
        <Outlet />
      </div>
    </div>
  );
}



export default App;