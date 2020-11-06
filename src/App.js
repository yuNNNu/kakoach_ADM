import React from 'react';
import {BrowserRouter, Switch, Route} from 'react-router-dom'
import Header from './components/header/Header';
import Sidebar from './components/sidebar/Sidebar';
import Footer from './components/footer/Footer';

import Administradores from './components/contenido/administradores/Administradores';
import Slide from './components/contenido/slide/Slide';
import Galeria from './components/contenido/galeria/Galeria';
import Articulos from './components/contenido/articulos/Articulos';
import Usuarios from './components/contenido/usuarios/Usuarios';
import Error404 from './components/contenido/error404/Error404';

function App() {
  return (
   <div className="sidebar-mini">

      <div className="wrapper">
        <Header/>
        <Sidebar/>
        <BrowserRouter>

        	<Switch>
        		<Route exact path="/" component={Administradores}/>
        		<Route exact path="/slide" component={Slide}/>
        		<Route exact path="/galeria" component={Galeria}/>
        		<Route exact path="/articulos" component={Articulos}/>
        		<Route exact path="/usuarios" component={Usuarios}/>
        		<Route component={Error404}/>
        	</Switch>

        </BrowserRouter>
        <Footer/>
      </div>
    </div>  
  );
}

export default App;
