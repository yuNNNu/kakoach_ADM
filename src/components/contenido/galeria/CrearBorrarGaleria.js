import React, {useState} from 'react'
import {rutaAPI} from '../../../config/Config';
import $ from 'jquery';
import notie from 'notie';
import 'notie/dist/notie.css';
import Swal from 'sweetalert2';

export default function CrearBorrarGaleria(){

	//HOOK

	const [galeria, crearGaleria] = useState({

		foto: null

	})

	/* ONCHANGE */

	const cambiarFormPost = e => {

		let fotos = $("#foto").get(0).files;
		console.log("foto", fotos);

		for(let  i = 0 ; i < fotos.length ; i++){


			if(fotos[i]["type"] !== "image/jpeg" && fotos[i]["type"] !== "image/jpg" && fotos[i]["type"] !== "image/JPEG" && fotos[i]["type"] !== "image/JPG"
			 && fotos[i]["type"] !== "image/png" && fotos[i]["type"] !== "image/PNG"){
				$("#foto").val("");

				notie.alert({
					type: 3,
					text: 'ERROR: La foto debe estar en formato JPG o PNG!',
					time: 7
				})

				$(".vistaGaleria").attr("src", "");
				return;
			}else if(fotos[i]["size"] > 2000000){
				$("#foto").val("");
				notie.alert({
					type: 3,
					text: 'ERROR: La foto debe estar en formato JPG o PNG',
					time: 7
				})
				$(".vistaGaleria").html("");
				return;
			}else{
				let datosArchivo = new FileReader;
				datosArchivo.readAsDataURL(fotos[i]);

				$(datosArchivo).on("load", function(event){
					let rutaArchivo = event.target.result;

					$(".vistaGaleria").append(`

						<div class="col-6 pt-1">

							<img src="${rutaArchivo}" class="img-fluid"/>

						</div>

					`);

					crearGaleria({
						'foto': fotos,
					})
				})
			}
		}
	}


	/* ONSUBMIT */

	const submitPost = async e => {


		e.preventDefault();

		const {foto} = galeria;

		for(let i = 0; i < foto.length; i++){

			$('.alert').remove();

			if(foto[i] === null){
				$(".invalid-foto").show();
				$(".invalid-foto").html("La foto no puede ir vacía")

				return;
			}
			
			/*=============================================
			=         SE EJECUTA EL SERVICIO POST         =
			=============================================*/

			const result = await postData(foto[i]);

			if(result.status === 400){
				$(".modal-footer").before(`<div class="alert alert-danger">${result.mensaje}</div>`);
			}

			if(result.status === 200){
				$(".modal-footer").before(`<div class="alert alert-success">${result.mensaje}</div>`);
				$('button[type="submit"]').remove();

				setTimeout(()=> {
					window.location.href="/galeria";
				},500)
			}
		}


	}

	$(document).on("click", ".limpiarForm", function(){
		$(".modal").find('form')[0].reset();
		$(".vistaGaleria").html("");
	})

	// CAPTURAR DATOS PARA BORRAR

	$(document).on("click", ".borrarInput", function(e){

		e.preventDefault();
		let data = $(this).attr("data");
		
		Swal.fire({
		  title: '¿Está seguro de eliminar este registro?',
		  text: "Si no lo está... Puede cancelar esta acción!",
		  type: 'warning',
		  showCancelButton: true,
		  confirmButtonColor: '#3085d6',
		  cancelButtonColor: '#d33',
		  confirmButtonText: 'Sí, eliminar registro!'
		}).then((result) => {
		    if (result.value) {

			  	const borrarGaleria = async () => {

					/*=============================================
					EJECTUAMOS SERVICIO DELETE
					=============================================*/

					const result = await deleteData(data);
					console.log("a");

					if(result.status === 400){

						Swal.fire({

					      type: "error",
					      title: result.mensaje,
					      showConfirmButton: true,
					      confirmButtonText: "Cerrar"
			            
						}).then(function(result){
							if(result.value){
								window.location.href = "/galeria";
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
								window.location.href = "/galeria";
							}
						})
					}

				}

				borrarGaleria();
			}
		})
	})

	return(

		<div className="modal fade" id="crearGaleria">

			<div className="modal-dialog">
				<div className="modal-content">

					<div className="modal-header">
						<h4 className="modal-title">Crear Galeria</h4>
						<button type="button" className="close" data-dismiss="modal">x</button> 
					</div>

					<form onChange={cambiarFormPost} onSubmit={submitPost} encType="multipart/form-data">

						<div className="modal-body">

							<div className="form-group">
							{/* ENTRADA foto*/}

								<label className="small text-secondary" htmlFor="foto">*Peso Max. 2MB | Formato: JPG o PNG</label>
								<input id="foto" type="file" className="form-control-file border" name="foto" multiple required/>
								<div className="invalidad-feedback invalid-foto"></div>
								<div className="vistaGaleria row"></div>

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
=       Peticion POST para GALERIA    =
=============================================*/

const postData = data => {

	const url = `${rutaAPI}/crear-galeria`;
	const token = localStorage.getItem("ACCESS_TOKEN");

	let formData = new FormData();
	formData.append("archivo", data);
	const params = {
		method: "POST",
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

/*=============================================
PETICIÓN DELETE SLIDE
=============================================*/

const deleteData = data =>{

	const url = `${rutaAPI}/eliminar-galeria/${data}`;
	const token = localStorage.getItem("ACCESS_TOKEN");
	const params = {

		method: "DELETE",
		headers: {

			"Authorization": token,
			"Content-Type": "application/json"
		}

	}

	return fetch(url, params).then(response=>{

		return response.json();

	}).then(result=>{

		return result;

	}).catch(err=>{

		return err;

	})

}
