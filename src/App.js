import React from 'react';
import Header from './components/header/Header';
import Sidebar from './components/sidebar/Sidebar';
import Administradores from './components/contenido/Administradores';
function App() {
  return (
   <div className="sidebar-mini">

      <div className="wrapper">
        <Header/>
        <Sidebar/>
        <Administradores/>
      </div>
    </div>  
  );
}

export default App;
