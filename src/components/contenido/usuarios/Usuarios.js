import React from 'react';
import {rutaAPI} from '../../../config/Config';
import $ from 'jquery';
import 'datatables.net';
import 'datatables.net-bs4';
import 'datatables.net-responsive';
import BorrarUser from './borrarUser'
export default function Usuarios(){

	const dataUser = async()=>{
		/*=============================================
		=            SE CREA EL DATASET       =
		=============================================*/
		const getUser = await getData();
		const dataSet = [];
	
		getUser.data.forEach((user, index) =>
        {
           
			dataSet[index] = [(index+1),
							user.nombre, 
                            user.mail
                            , [user._id + "_",
							user.nombre + "_", 
                            user.mail, 
                ]];
            
		})
		/*=============================================
		=            EJECUTAMOS DATATABLE          =
		=============================================*/
		$(document).ready(function () {
			$('.table').DataTable({
				retrieve: true,
				data: dataSet,
				columns: [
				{title: "#"},
				{title: "Usuario"},
				{title: "Mail"},
				{title: "Acciones",
				render: function(data){

					return `
						
						<a href="#" class="borrarInput" data="${data}">

							
							<svg style="color:white; background:#dc3545; border-radius:100%; width:35px; line-height:35px; text-align:center; padding:12px"

							aria-hidden="true" focusable="false" data-prefix="fas" data-icon="trash-alt" class="svg-inline--fa fa-trash-alt fa-w-14" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="currentColor" d="M32 464a48 48 0 0 0 48 48h288a48 48 0 0 0 48-48V128H32zm272-256a16 16 0 0 1 32 0v224a16 16 0 0 1-32 0zm-96 0a16 16 0 0 1 32 0v224a16 16 0 0 1-32 0zm-96 0a16 16 0 0 1 32 0v224a16 16 0 0 1-32 0zM432 32H312l-9.4-18.7A24 24 0 0 0 281.1 0H166.8a23.72 23.72 0 0 0-21.4 13.3L136 32H16A16 16 0 0 0 0 48v32a16 16 0 0 0 16 16h416a16 16 0 0 0 16-16V48a16 16 0 0 0-16-16z"></path></svg>
						</a>`

				}

				}]
			})
		})

	}
	dataUser();
	return(

		<div className="content-wrapper" style={{minHeight: "494px"}}>
			<div className="content-header">
				<div className="container-fluid">
					<div className="row mb-2">
						<div className="col-sm-6">
							<h1 className="m-0 text-dark">Usuarios</h1>
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

								
								</div>

								<div className="card-body">
				   					<table className="table table-striped dt-responsive" style={{"width": "100%"}}>
				   						
				   					</table>
				   				

				  			</div>
								   
							</div>

						</div> 
					</div>	
				</div>

			</div>
			<BorrarUser/>
		</div>

	);

}
/*=============================================
=                     GET                     =
=============================================*/
	
const getData = () => {
	const url = `${ rutaAPI }/mostrar-clientes`;
	const token = localStorage.getItem("ACCESS_TOKEN");
	const params = {
		method: "GET",
		headers: {
			"Authorization": token,
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