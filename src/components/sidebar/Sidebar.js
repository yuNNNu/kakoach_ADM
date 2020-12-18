import React from 'react'
import Logo from './AdminLTELogo.png';
import Photo from './user.jpg';

export default function Sidebar(){

	const usuario = localStorage.getItem("USUARIO");
	return(

		<aside className="main-sidebar sidebar-dark-primary elevation-4 ">

			<a href="#/" className="brand-link">
				<img alt="AdminLTE Logo"
						className="brand-image img-circle elevation-3"
						style={{opacity: 0.8}}
						src={Logo}
				/>

				<span className="brand-text font-weight-light">CMS</span>
			</a>

			<div className="sidebar">

				<div className="user-panel mt-3 pb-3 mb-3 d-flex">

					<div className="image">
						<img className="img-circle elevation-2"
						alt="user"
						src={Photo}
						/>
					</div>

					<div className="info">
						<a href="#/" className="d-block">
						{usuario}
						</a>
					</div>

			</div>		
					<div>

						<nav className="mt-2">
							<ul
								className="nav nav-pills nav-sidebar flex-column"
								data-widget="treeview"
								role="menu"
								data-accordion="false"
							>
							<div class="sidenav-menu-heading">General</div>
								<li className="nav-item">

									<a href="/logo" className="nav-link">
										<i className="nav-icon fas fa-user-lock"></i>
										<p>
										Gestor Logo
										</p>

									</a>

								</li>

								<li className="nav-item">

									<a href="/footer" className="nav-link">
										<i className="nav-icon fas fa-sliders-h"></i>
										<p>
										Gestor Footer
										</p>

									</a>

								</li>

								<li className="nav-item">

									<a href="/redes_sociales" className="nav-link">
										<i className="nav-icon fas fa-sliders-h"></i>
										<p>
										Gestor Social Media
										</p>

									</a>

								</li>
									<div className="sidenav-menu-heading">Inicio</div>

								<li className="nav-item">

									<a href="/inicio_slide" className="nav-link">
										<i className="nav-icon fas fa-images"></i>
										<p>
										Gestor Imagen Principal
										</p>

									</a>

								</li>

								<li className="nav-item">

									<a href="/inicio_plan_personal" className="nav-link">
										<i className="nav-icon fas fa-file"></i>
										<p>
										Gestor Plan Primario
										</p>

									</a>

							    </li>

							    <li className="nav-item">

									<a href="/inicio_planes_estrella" className="nav-link">
										<i className="nav-icon fas fa-file"></i>
										<p>
										Gestor Planes Secundarios
										</p>

									</a>

							    </li>

							    <li className="nav-item">

									<a href="/inicio_benefits" className="nav-link">
										<i className="nav-icon fas fa-file"></i>
										<p>
										Gestor Beneficios
										</p>

									</a>

							    </li>

								<div className="sidenav-menu-heading">Planes</div>

								<li className="nav-item">

									<a href="/planes_slide" className="nav-link">
										<i className="nav-icon fas fa-users"></i>
										<p>
										Gestor Img Principal
										</p>

									</a>

								</li>


								<li className="nav-item">

									<a href="/planes_categoria" className="nav-link">
										<i className="nav-icon fas fa-users"></i>
										<p>
										Gestor Categorías
										</p>

									</a>

								</li>


								<li className="nav-item">

									<a href="/planes" className="nav-link">
										<i className="nav-icon fas fa-users"></i>
										<p>
										Gestor Planes
										</p>

									</a>

								</li>

								<li className="nav-item">

									<a href="/planes_benefits" className="nav-link">
										<i className="nav-icon fas fa-users"></i>
										<p>
										Gestor Beneficios
										</p>

									</a>

								</li>
								<div	div className="sidenav-menu-heading">Sobre mi</div>

								<li className="nav-item">

									<a href="/sobre_mi_slide" className="nav-link">
										<i className="nav-icon fas fa-users"></i>
										<p>
										Gestor Img Principal
										</p>

									</a>

								</li>

								<li className="nav-item">

									<a href="/tarjetas" className="nav-link">
										<i className="nav-icon fas fa-users"></i>
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