import React, {useState} from 'react'
import $ from 'jquery';
import {rutaAPI} from '../../../../config/Config';

import Swal from 'sweetalert2'

export default function EditarSocialMedia()
{ 

	// HOOK

	const [red, editarRed] = useState({

		url: "",
		id: ""

	})

	// ONCHANGE

	const cambiarFormPut = e => {

		
		editarRed({

	
			'url': $("#editarUrl").val(),
			'id' : $("#editarID").val()

		})

		
	}
	
	// ONSUBMIT
	const submitPut = async e => {

		$('.alert').remove();
		e.preventDefault();
		const { url } = red;
		if (url === "")
		{
			$(".invalid-url").show();
			$(".invalid-url").html("URL no puede ir vacia");

			return;
		} else
		{
			$(".invalid-url").hide();
		}
		const result = await putData(red); 
		
	
		if(result.status === 400){

			Swal.fire({

		      type: "error",
		      title: result.mensaje,
		      showConfirmButton: true,
		      confirmButtonText: "Cerrar"
            
			}).then(function(result){
				if(result.value){
					window.location.href = `${process.env.PUBLIC_URL}/redes_sociales`;
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
					window.location.href = `${process.env.PUBLIC_URL}/redes_sociales`;
				}
			})
		}

	}



	//CAPTURAR DATOS PARA EDITAR

	$(document).on("click", ".editarInputs", function(e){
		e.preventDefault();

		let data = $(this).attr("data").split('_,');
		$("#editarID").val(data[0]);
		$("#editarUrl").val(data[1]);


		editarRed({

			
			'url': data[1],
			'id' : data[0]

		})
	})


	// RETORNO DE LA VISTA
		return(
		<div className="modal fade" id="editarRed">

			<div className="modal-dialog">

				<div className="modal-content">

					<div className="modal-header">
						<h4 className="modal-title">Editar url</h4>
						<button type="button" className="close" data-dismiss="modal">x</button>
					</div>

					<form  onChange={cambiarFormPut} onSubmit={submitPut} encType="multipart/form-data">

						<div className="modal-body">

							<input type="hidden" id="editarID"/>

							{/* ENTRADA URL*/}

							<div className="form-group">
								<label className="small text-secondary" htmlFor="editarUrl">* Ingrese la url considerando la entrada "https://". </label>

								<div className="input-group mb-3">
									<div className="input-group-append input-group-text">
										<i className="fas fa-heading"></i>
									</div>

									<input id="editarUrl" type="text" className="form-control" name="url" placeholder="Ingrese la url" /* pattern="([0-9a-zA-Z]){1,30}" */ />

									<div className="invalid-feedback invalid-url"></div>
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
=       Peticion PUT para REDES SOCIALES   =
=============================================*/
	const putData = data => {

		const url = `${rutaAPI}/update-socialmedia/${data.id}`;
		const token = localStorage.getItem("ACCESS_TOKEN");

		let formData = new FormData();
		formData.append("url", data.url);
		

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