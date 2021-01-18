import React from 'react';
import {rutaAPI} from '../../../config/Config';
import $ from 'jquery';
import 'datatables.net';
import 'datatables.net-bs4';
import 'datatables.net-responsive';
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
							user.nombre + " " + user.apellido, 
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
				{title: "Mail"}]
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