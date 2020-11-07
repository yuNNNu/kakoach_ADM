import React from 'react';
import {BrowserRouter, Switch, Route} from 'react-router-dom';
import jwtDecode from 'jwt-decode';

// Componente Login
import Login from './components/contenido/login/Login';

// Componentes fijos
import Header from './components/header/Header';
import Sidebar from './components/sidebar/Sidebar';
import Footer from './components/footer/Footer';


// Componentes Dinamicos
import Administradores from './components/contenido/administradores/Administradores';
import Slide from './components/contenido/slide/Slide';
import Galeria from './components/contenido/galeria/Galeria';
import Articulos from './components/contenido/articulos/Articulos';
import Usuarios from './components/contenido/usuarios/Usuarios';
import Error404 from './components/contenido/error404/Error404';

export default function App() {

  const auth = getAccessToken();

  if(!auth){
    return(
      <Login/>
    );
  }

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


const getAccessToken = () => {
  const accessToken = localStorage.getItem("ACCESS_TOKEN")
  const id = localStorage.getItem("ID")
  const user = localStorage.getItem("USUARIO")

  if(!accessToken || accessToken === null
    || !id || id === null ||
    !user || user === null )
  return false;

  const metaToken = jwtDecode(accessToken);
  console.log("metaToken", metaToken);

  if(!metaToken.data){
    return false; 
  }

  if(tokenExpira(accessToken, metaToken) || metaToken.data._id !== id || metaToken.user !== user){
    return true;
  }else{
    return false;
  }
}

/*=============================================
=            FUNCION PARA VERIFICAR EXPIRACION DE TOKEN            =
=============================================*/

const tokenExpira = (accessToken, metaToken) => {

  const seconds = 60;
  const{ exp } = metaToken;
  const now = (Date.now()+seconds)/1000
  return exp < now ;

}