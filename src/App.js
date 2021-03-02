import React from 'react';
import {BrowserRouter, Switch, Route, Link} from 'react-router-dom';
import jwtDecode from 'jwt-decode';
import './App.css';
// Componente Login
import Login from './components/contenido/login/Login';

// Componentes fijos
import Header from './components/header/Header';
import Sidebar from './components/sidebar/Sidebar';



// Componentes Dinamicos



import Usuarios from './components/contenido/usuarios/Usuarios';
import Error404 from './components/contenido/error404/Error404';

// PAGINA GENERAL
import Terminos from './components/contenido/general/terminos-y-condiciones/Terminos'
import PlanPersonal from './components/contenido/inicio/plan-personal/Plan-personal'
import FooterClient from './components/contenido/general/footer/Footer'
import SocialMedia from './components/contenido/general/social-media/SocialMedia'


// PAGINA INICIO
import Benefits from './components/contenido/inicio/benefits/Benefit'
import ImgPrincipal from './components/contenido/inicio/img-principal/ImgPrincipal'
import Logo from './components/contenido/general/logo/Logo'
import PlanesEstrellas from './components/contenido/inicio/planes-estrellas/Planes-estrellas';
import DescripcionPlanes from './components/contenido/inicio/descripcion-planes/DescripcionPlanes';

// PAGINA PLANES
import SlidePlanes from './components/contenido/planes/slide_principal/slide_principal';
import Category from './components/contenido/planes/category/Category';
import Planes from './components/contenido/planes/planes/Planes';
import BenefitsPlan from './components/contenido/planes/benefits/BenefitsPlan';
// PAGINA SOBRE MI
import SlideSobreMi  from './components/contenido/sobre-mi/slide-sobre-mi/Slide_principal_sobre_mi';
import Tarjetas from './components/contenido/sobre-mi/tarjetas/Tarjetas'
// VENTAS
import Estadisticas from './components/contenido/ventas/Estadisticas'

import Ventas from './components/contenido/ventas/Ventas.controlador'


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
        <BrowserRouter basename={'/admin'}>

        	<Switch>
        	
        	
            <Link to={`${ process.env.PUBLIC_URL }/`} component={Estadisticas} />
            <Link  to={`${process.env.PUBLIC_URL}/ventas`} component={Ventas} />
            <Link  to={`${process.env.PUBLIC_URL}/usuarios`} component={Usuarios} />
            <Link  to={`${process.env.PUBLIC_URL}/inicio_benefits`}  component={Benefits} />
            <Link  to={`${process.env.PUBLIC_URL}/inicio_slide`}  component={ImgPrincipal} />
            <Link to={`${ process.env.PUBLIC_URL }/inicio_plan_personal`} component={PlanPersonal} />
            
            <Link  to={`${process.env.PUBLIC_URL}/inicio_planes_estrella`}  component={PlanesEstrellas} />
            <Link  to={`${process.env.PUBLIC_URL}/logo`}  component={Logo} />
            <Link  to={`${process.env.PUBLIC_URL}/footer`}  component={FooterClient} />
            <Link  to={`${process.env.PUBLIC_URL}/redes_sociales`}  component={SocialMedia} />
            <Link  to={`${process.env.PUBLIC_URL}/planes_slide`}  component={SlidePlanes} />
            <Link  to={`${process.env.PUBLIC_URL}/planes_categoria`}  component={Category} />
            <Link  to={`${process.env.PUBLIC_URL}/planes`} component={Planes} />
            <Link  to={`${process.env.PUBLIC_URL}/planes_benefits`}  component={BenefitsPlan} />
            <Link  to={`${process.env.PUBLIC_URL}/sobre_mi_slide`}  component={SlideSobreMi} />
            <Link  to={`${process.env.PUBLIC_URL}/tarjetas`}  component={Tarjetas} />
            <Link  to={`${process.env.PUBLIC_URL}/descripcion_planes`}  component={DescripcionPlanes} />
            <Link  to={`${process.env.PUBLIC_URL}/terminos_y_condiciones`}  component={Terminos} />
        		<Link component={Error404}/>
        	</Switch>

        </BrowserRouter>
    
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
  
  const now = (Date.now() + seconds) / 1000
  if (now > exp)
  {
    localStorage.clear();
  }
  return exp > now;
  

}