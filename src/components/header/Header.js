import React from 'react'
 export default function Header(){

 	/*=============================================
 	=            CIERRE DE SESION            =
 	=============================================*/
 	
 	const cerrarSesion = () => {
		
		localStorage.removeItem("ACCESS_TOKEN");  		
  		localStorage.removeItem("ID");
  		localStorage.removeItem("USUARIO");

 	}

 	return(
 		<nav className="main-header navbar navbar-expand navbar-white navbar-light">
 			<ul className="navbar-nav">
 				<li className="nav-item">
 					<a href="#/"
 						className="nav-link"
 						data-widget="pushmenu">
 						<i className="fas fa-bars"></i>
 					</a>
 				</li>
 			</ul>

 			<ul className="navbar ml-auto">
 				<li className="nav-item">
 					<a href="/" onClick={() => {cerrarSesion()}}
 						className="nav-link">
 						<i className="fas fa-sign-out-alt"></i>
 					</a>
 				</li>
 			</ul>
 		</nav>
 	);

 }