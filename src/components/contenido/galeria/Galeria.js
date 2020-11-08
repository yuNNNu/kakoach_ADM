import React from 'react'
import {rutaAPI} from '../../../config/Config';

export default function Galeria(){

	const photo = `${rutaAPI}/mostrar-img-galeria/9760.jpg`

	return(

		<div className="content-wrapper" style={{minHeight: "494px"}}>
			<div className="content-header">
				<div className="container-fluid">
					<div className="row mb-2">
						<div className="col-sm-6">
							<h1 className="m-0 text-dark">Galeria</h1>
						</div>
					</div>	
				</div>
			</div>

			<div className="content">

				<div className="container-fluid">
					<div className="row">
						<div className="col-lg-12">
							<div className="card card-primary card-outline">
								<div className="card-header">

								<h5 className="m-0">
									<button className="btn btn-primary">Crear nueva Galería</button>
								</h5>
								</div>

								<div className="card-body">
				   					<table className="table" style={{"width": "100%"}}>

				   						<thead>
				   							<tr>
				   								<th>#</th>
					   							<th width="320px" alt="foto">Foto</th>
					   							<th>Acciones</th> 
				   							</tr>
				   						</thead>
				   						<tbody>

				   							<tr>
				   								<td>1</td>
				   								<td><img src={photo} className="img-fluid" alt="photo1"/></td>
				   								<td>
				   									<div>
				   										<button type="button" className="btn btn-warning rounded-circle mr-2">
				   										   <i className="nav-icon fas fa-pencil-alt"></i>
				   										</button>

				   										<button type="button" className="btn btn-danger rounded-circle">
				   										   <i className="nav-icon fas fa-trash"></i>
				   										</button>
				   									</div>
				   								</td>
				   							</tr>

				   						</tbody>
				   					</table>
				   				

				  			</div>
								   
							</div>

						</div>
					</div>	
				</div>

			</div>

		</div>

	);

}