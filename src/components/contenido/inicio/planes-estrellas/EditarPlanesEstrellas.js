import React, {useState} from 'react';
import $ from 'jquery';
import {rutaAPI} from '../../../../config/Config';
import Swal from 'sweetalert2'

export default function EditarBorrarAdministradores(){


	/*=============================================
	Hook para capturar datos
	=============================================*/

	const [planesestrellas, editarPlanesEstrellas ] = useState({
		
		_id: "",
		id: ""

	})

	/*=============================================
	OnChange
	=============================================*/

	const cambiaFormPut = e => {

		editarPlanesEstrellas({

			'_id' : $("#editarID").val(),
			'id' : $("#editaridd").val()
		})
	}

	/*=============================================
	OnSubmit
	=============================================*/

	const submitPut = async e => {

		$('.alert').remove();

		e.preventDefault();		

		const {_id, id} = planesestrellas;

		/*=============================================
		Validamos que el campo user no venga vacío
		=============================================*/

		if(id === ""){

			$(".invalid-editaridd").show();
			$(".invalid-editaridd").html("Completa este campo");

		}


		/*=============================================
		EJECTUAMOS SERVICIO PUT
		=============================================*/

		const result = await putData(planesestrellas);

	
		if(result.status === 400){

			Swal.fire({

		      type: "error",
		      title: result.mensaje,
		      showConfirmButton: true,
		      confirmButtonText: "Cerrar"
            
			}).then(function(result){
				if(result.value){
					window.location.href = "/inicio_planes_estrella";
				}
			})

		}

		if(result.status === 200){

			Swal.fire({

		      type: "success",
		      title: result.mensaje,
		      showConfirmButton: true,
		      confirmButtonText: "Cerrar"
            
			}).then(function(result){
				if(result.value){
					window.location.href = "/inicio_planes_estrella";
				}
			})
		}

	}

	/*=============================================
	CAPTURAMOS DATOS PARA EDITAR
	=============================================*/

	$(document).on("click", ".editarInputs", function(e){

		e.preventDefault();

		let data = $(this).attr("data").split('_,');


		$("#editarID").val(data[0]);
		$("#editaridd").val(data[1]);

		editarPlanesEstrellas({

			'_id' : data[0],
			'id' : data[1]
		})


	})		



	/*=============================================
	=       Retornamos vista del componente       =
	=============================================*/
	return(

		<div className="modal" id="editarPlanesEstrellas">
		  <div className="modal-dialog">
		    <div className="modal-content">

		      <div className="modal-header">
		        <h4 className="modal-title">Editar Plan Secundario</h4>
		        <button type="button" className="close" data-dismiss="modal">&times;</button>
		      </div>

		      <form onChange={cambiaFormPut} onSubmit={submitPut}> 

			      <div className="modal-body">

			      	<input type="hidden" id="editarID"/>

			      	 {/* ENTRADA VALOR */}

			      	<div className="form-group">

			      		<label className="small text-secondary" htmlFor="editaridd"></label>

			      		<div className="input-group mb-3">

			      			<div className="input-group-append input-group-text">
			      				<i className="fas fa-key"></i>
			      			</div>

			      			<input 
			      				id="editaridd"
			      				type="text"
			      				className="form-control"
			      				name="editaridd"
			      				placeholder="Ingrese el valor*"
			      				required

			      			/>

			      			<div className="invalid-feedback invalid-editaridd"></div>

			      		</div>	

			      	</div>


			      	<div className="modal-footer d-flex justify-content-between">

				      <div><button type="button" className="btn btn-danger" data-dismiss="modal">Cerrar</button></div>

				      <div><button type="submit" className="btn btn-primary">Enviar</button></div>        
					</div>

				</div>

		      </form>

		    </div>
		  </div>
		</div>

	)

}


/*=============================================
=       Peticion PUT para PLAN PERSONAL    =
=============================================*/

const putData = data => {

	const url = `${rutaAPI}/edit-secondary-plan/${data._id}`;
	const token = localStorage.getItem("ACCESS_TOKEN");
	
	const params = {
		method: "PUT",
		body: JSON.stringify(data),
		headers: {
			"Authorization": token,
			"Content-Type": "application/json"
		}
	}

	return fetch(url, params).then(response => {
		return response.json();
	}).then(result => {
		return result;
	}).catch(err => {
		return err;
	})

}