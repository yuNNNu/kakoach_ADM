import React from 'react'
import $ from 'jquery';
import {rutaAPI} from '../../../../config/Config';

import Swal from 'sweetalert2'
import 'summernote/dist/summernote-lite.js'
import 'summernote/dist/summernote-lite.css'
export default function EditarTerminos(){

	

	// ONSUBMIT
	const submitPut = async e => {
		$('.alert').remove();
		e.preventDefault();
		const html = $('#editarContenido').summernote('code');
			
		if (html === "" || html === "<p><br></p>")
		{
			$(".invalid-editarContenido").show();
            $(".invalid-editarContenido").html("Debe ingresar contenido");
			return
		} else
		{
			$(".invalid-editarContenido").hide();
		}
		
		
		let datos = {
			'id' : $('#editarID').val(),
			'contenido': $('#editarContenido').summernote('code') 
		}
			
		// SE EJECUTA SERVICIO PUT

		const result = await putData(datos); 
		
		if(result.status === 400){

			Swal.fire({
		      type: "error",
		      title: result.mensaje,
		      showConfirmButton: true,
		      confirmButtonText: "Cerrar"
            
			}).then(function(result){
				if(result.value){
					window.location.href = `${process.env.PUBLIC_URL}/terminos_y_condiciones`;
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
					window.location.href = `${process.env.PUBLIC_URL}/terminos_y_condiciones`;
				}
			})
		}

	}

	
	//CAPTURAR DATOS PARA EDITAR

	$(document).on("click", ".editarInputs", function(e){
		e.preventDefault();

		 let data = $(this).attr("data").split("_,"); 
      
		
        // // recuperamos os datos
		
		$("#editarID").val(data[0]);
		$("#editarContenido").val(data[1])
		$("#editarContenido").summernote({
			height: 350,
			width:460
        });
	
		
	})

	// summernote
	$(document).ready(function(valorSummer){
		$("#contenido").summernote({
			height: 350,
			width:460
		});
	})

	// RETORNO DE LA VISTA

		return(
		<div className="modal fade" id="editarTerminos">

			<div className="modal-dialog">

				<div className="modal-content">

					<div className="modal-header">
						<h4 className="modal-title">Editar Términos y Condiciones</h4>
						<button type="button" className="close" data-dismiss="modal">x</button>
					</div>

					<form   onSubmit={submitPut} encType="multipart/form-data" >

						<div className="modal-body">

							<input type="hidden" id="editarID"/>

					
							{/* ENTRADA contenido*/}

							<div className="form-group"  >
									<label className="small text-secondary" htmlFor="editarContenido">Ingresar los términos y condiciones</label>

								<div className="input-group mb-3">
								

									<textarea id="editarContenido" name="contenido" ></textarea>

									<div className="invalid-feedback invalid-editarContenido"></div>
								</div>
							</div>

                        </div>

						<div className="modal-footer d-flex justify-content-between">

							<div>
								<button type="button" className="btn btn-danger" data-dismiss="modal">Cerrar</button>
							</div>

							<div>
								<button type="submit" className="btn btn-primary">Guardar</button>
							</div>

						</div>

					</form>
				</div>

			</div>

		</div>

	)

}

/*=============================================
=       Peticion PUT para benefit de inicio    =
=============================================*/

const putData = data => {

	const url = `${rutaAPI}/editar-terminos/${data.id}`;
	const token = localStorage.getItem("ACCESS_TOKEN");

	let formData = new FormData();
	formData.append("contenido", data.contenido);

	const params = {
		method: "PUT",
		body: formData,
		headers: {
			"Authorization": token
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



