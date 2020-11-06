import React from 'react';
import Header from './components/header/Header';
import Sidebar from './components/sidebar/Sidebar';

function App() {
  return (
   <div className="sidebar-mini">

      <div className="wrapper">
        <Header/>
        <Sidebar/>
      </div>
    </div>  
  );
}

export default App;
