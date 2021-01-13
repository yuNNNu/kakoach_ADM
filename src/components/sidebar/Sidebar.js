import React from 'react'
import {rutaAPI} from '../../config/Config';


export default function Sidebar()
{
		const dataLogo = async() => {
		/*=============================================
		=            CREAMOS EL DATASET               =
		=============================================*/
		
		const getLogo = await getData();
		console.log(getLogo.data[0].imagen)
		localStorage.setItem("logo",getLogo.data[0].imagen)
			
		

		}

	dataLogo();
	
	return(

		<aside className="main-sidebar sidebar-dark-primary elevation-4 ">

			<a href="#/" className="brand-link">
				<img alt="Ka Koach Logo"
						className="brand-image img-circle elevation-3"
						style={{opacity: 0.8}}
						src= {rutaAPI+"/mostrar-logo/"+localStorage.getItem("logo")}
				/>

				<span className="brand-text font-weight-light">Ka Koach</span>
			</a>

			<div className="sidebar">

			


					
					<div>

						<nav className="mt-2">
							<ul
								className="nav nav-pills nav-sidebar flex-column"
								data-widget="treeview"
								role="menu"
								data-accordion="false"
						>
							<div className="sidenav-menu-heading">Negocio</div>
							<li className="nav-item">
								<a href="/ventas" className="nav-link">
									<i className="nav-icon fas fa-poll"></i>
									<p>Ventas</p>
									

								</a>
							</li>	
							<li className="nav-item">
								<a href="/" className="nav-link">
									<i className="nav-icon fas fa-poll"></i>
									<p>Estadisticas</p>
									

								</a>
							</li>	
						
								<li className="nav-item">

									<a href="/usuarios" className="nav-link">
										<i className="nav-icon fas fa-users"></i>
										<p>
										Usuarios
										</p>

									</a>

								</li>
							<div class="sidenav-menu-heading">General</div>
								<li className="nav-item">

									<a href="/terminos_y_condiciones" className="nav-link">

										<p>
										Terminos y Condiciones
										</p>

									</a>

								</li>
								<li className="nav-item">

									<a href="/logo" className="nav-link">

										<p>
										Gestor Logo
										</p>

									</a>

								</li>

								<li className="nav-item">

									<a href="/footer" className="nav-link">

										<p>
										Gestor Footer
										</p>

									</a>

								</li>

								<li className="nav-item">

									<a href="/redes_sociales" className="nav-link">


										<p>
										Gestor Social Media
										</p>

									</a>

								</li>
									<div className="sidenav-menu-heading">Inicio</div>

								<li className="nav-item">

									<a href="/inicio_slide" className="nav-link">
										
										<p>
										Gestor Imagen Principal
										</p>

									</a>

							</li>
							<li className="nav-item">

									<a href="/descripcion_planes" className="nav-link">
										
										<p>
										Gestor Descripción Planes
										</p>

									</a>

							</li>

								<li className="nav-item">

									<a href="/inicio_plan_personal" className="nav-link">

										<p>
										Gestor Plan Primario
										</p>

									</a>

							    </li>

							    <li className="nav-item">

									<a href="/inicio_planes_estrella" className="nav-link">

										<p>
										Gestor Planes Secundarios
										</p>

									</a>

							    </li>

							    <li className="nav-item">

									<a href="/inicio_benefits" className="nav-link">

										<p>
										Gestor Beneficios
										</p>

									</a>

							    </li>

								<div className="sidenav-menu-heading">Planes</div>

								<li className="nav-item">

									<a href="/planes_slide" className="nav-link">

										<p>
										Gestor Img Principal
										</p>

									</a>

								</li>


								<li className="nav-item">

									<a href="/planes_categoria" className="nav-link">

										<p>
										Gestor Categorías
										</p>

									</a>

								</li>


								<li className="nav-item">

									<a href="/planes" className="nav-link">

										<p>
										Gestor Planes
										</p>

									</a>

								</li>

								<li className="nav-item">

									<a href="/planes_benefits" className="nav-link">

										<p>
										Gestor Beneficios
										</p>

									</a>

								</li>
								<div	div className="sidenav-menu-heading">Sobre mi</div>

								<li className="nav-item">

									<a href="/sobre_mi_slide" className="nav-link">

										<p>
										Gestor Img Principal
										</p>

									</a>

								</li>

								<li className="nav-item">

									<a href="/tarjetas" className="nav-link">

										<p>
										Gestor Tarjetas
										</p>

									</a>

								</li>

							</ul>
						</nav>


					</div>
					
				

			</div> 

		</aside>
	)
}
/*=============================================
=                     GET                     =
=============================================*/
	
const getData = () => {
	const url = `${rutaAPI}/show-data-logo`;
	const params = {
		method: "GET",
		headers: {
			"Content-type": "application/json"
		}
	}

	return fetch(url, params).then(response => {
		return response.json();
	}).then(result => {
		return  result;
	}).then(err => {
		return err;
	})
}