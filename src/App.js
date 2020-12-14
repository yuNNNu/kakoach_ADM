import React from 'react';
import {BrowserRouter, Switch, Route} from 'react-router-dom';
import jwtDecode from 'jwt-decode';
import './App.css';
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

// componenetes nuevos 
// PAGINA GENERAL
import PlanPersonal from './components/contenido/inicio/plan-personal/Plan-personal'
import FooterClient from './components/contenido/general/footer/Footer'
import SocialMedia from './components/contenido/general/social-media/SocialMedia'


// PAGINA INICIO
import Benefits from './components/contenido/inicio/benefits/Benefit'
import ImgPrincipal from './components/contenido/inicio/img-principal/ImgPrincipal'
import Logo from './components/contenido/general/logo/Logo'

// PAGINA PLANES
import SlidePlanes from './components/contenido/planes/slide_principal/slide_principal';
import Category from './components/contenido/planes/category/Category';
import Planes from './components/contenido/planes/planes/Planes';
import BenefitsPlan from './components/contenido/planes/benefits/BenefitsPlan';
// PAGINA SOBRE MI
import SlideSobreMi  from './components/contenido/sobre-mi/slide-sobre-mi/Slide_principal_sobre_mi';



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
            <Route exact path="/usuarios" component={Usuarios} />
            <Route exact path="/inicio_benefits" component={Benefits} />
            <Route exact path="/inicio_slide" component={ImgPrincipal} />
            <Route exact path="/inicio_plan_personal" component={PlanPersonal} />
            <Route exact path="/logo" component={Logo} />
            <Route exact path="/footer" component={FooterClient} />
            <Route exact path="/redes_sociales" component={SocialMedia} />
            <Route exact path="/planes_slide" component={SlidePlanes} />
            <Route exact path="/planes_categoria" component={Category} />
            <Route exact path="/planes" component={Planes} />
            <Route exact path="/planes_benefits" component={BenefitsPlan} />
            <Route exact path="/sobre_mi_slide" component={SlideSobreMi}/>
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