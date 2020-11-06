import React from 'react';
import Header from './components/header/Header';
import Sidebar from './components/sidebar/Sidebar';
import Administradores from './components/contenido/Administradores';
import Footer from './components/footer/Footer';
function App() {
  return (
   <div className="sidebar-mini">

      <div className="wrapper">
        <Header/>
        <Sidebar/>
        <Administradores/>
        <Footer/>
      </div>
    </div>  
  );
}

export default App;
