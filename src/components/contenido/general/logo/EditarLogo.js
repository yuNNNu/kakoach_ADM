import React, {useState} from 'react'
import $ from 'jquery';
import {rutaAPI} from '../../../../config/Config';
import notie from 'notie';
import Swal from 'sweetalert2'

export default function EditarLogo(){

	// HOOK

	const [logo, editarLogo] = useState({

		archivo: null,
		id: ""

	})

	// ONCHANGE

	const cambiarFormPut = e => {
		if($("#editarImagen").val()){


			let imagen = $("#editarImagen").get(0).files[0];
			
			if(imagen["type"] !== "image/jpeg" && imagen["type"] !== "image/png"){
				$("#imagen").val("");

				notie.alert({
					type: 3,
					text: 'ERROR: La imagen debe estar en formato JPG o PNG!',
					time: 7
				})

				$(".previsualizarImg").attr("src", "");
				$("#editarImagen").get(0).value= "";
				return;
			}else if(imagen["size"] > 2000000){
				$("#imagen").val("");
				notie.alert({
					type: 3,
					text: 'ERROR: La imagen debe pesar como maximo 2mb',
					time: 7
				})
				$(".previsualizarImg").attr("src", "");
				$("#editarImagen").get(0).value= "";
				return;
			}else{
				let datosArchivo = new FileReader();
				datosArchivo.readAsDataURL(imagen);

				$(datosArchivo).on("load", function(event){
					let rutaArchivo = event.target.result;
					
					$(".previsualizarImg").attr("src", rutaArchivo);

					editarLogo({

						'imagen': imagen,
						'id' : $("#editarID").val()

					})
				})
			}
		}else{

			editarLogo({

						'imagen': null,
						'id' : $("#editarID").val()

					})

		}	
	}

	// ONSUBMIT

	const submitPut = async e => {

		$('.alert').remove();
		e.preventDefault();
		

	

		// SE EJECUTA SERVICIO PUT

		const result = await putData(logo); 


		if(result.status === 400){

			Swal.fire({

		      type: "error",
		      title: result.mensaje,
		      showConfirmButton: true,
		      confirmButtonText: "Cerrar"
            
			}).then(function(result){
				if(result.value){
					window.location.href = "/logo";
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
					window.location.href = "/logo";
				}
			})
		}

	}

	//CAPTURAR DATOS PARA EDITAR

	$(document).on("click", ".editarInputs", function(e){
		e.preventDefault();

		let data = $(this).attr("data").split('_,');
		$("#editarID").val(data[0]);
		$(".previsualizarImg").attr("src", `${rutaAPI}/mostrar-logo/${data[1]}`);

		editarLogo({

			'imagen': null,
			
			'id' : data[0]

		})
	})

	

	// RETORNO DE LA VISTA

	return(
		<div className="modal fade" id="editarLogo">

			<div className="modal-dialog">

				<div className="modal-content">

					<div className="modal-header">
						<h4 className="modal-title">Editar logo</h4>
						<button type="button" className="close" data-dismiss="modal">x</button>
					</div>

					<form onChange={cambiarFormPut} onSubmit={submitPut} encType="multipart/form-data">

						<div className="modal-body">

							<input type="hidden" id="editarID"/>

							{/* ENTRADA IMAGEN*/}

							<label className="small text-secondary" htmlFor="editarImagen">*Peso Max. 2MB | Formato: PNG</label>
							<input id="editarImagen" type="file" className="form-control-file border" name="imagen" required/>
							<div className="invalidad-feedback invalid-imagen"></div>
							<img className="previsualizarImg img-fluid" alt="img-carga"/>

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
=       Peticion PUT para logo    =
=============================================*/

const putData = data => {

	const url = `${rutaAPI}/edit-logo/${data.id}`;
	const token = localStorage.getItem("ACCESS_TOKEN");

	let formData = new FormData();
	formData.append("imagen", data.imagen);


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



