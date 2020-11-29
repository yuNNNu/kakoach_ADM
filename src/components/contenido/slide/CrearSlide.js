import React, {useState} from 'react'
import {rutaAPI} from '../../../config/Config';
import $ from 'jquery';
import notie from 'notie';
import 'notie/dist/notie.css';

export default function CrearSlide(){

	/* HOOK */

	const [slide, crearSlide] = useState({

		imagen: null,
		titulo: "",
		descripcion: ""

	})

	/* ONCHANGE */

	const cambiarFormPost = e => {
		let imagen = $("#imagen").get(0).files[0];
		
		if(imagen["type"] !== "image/jpeg" && imagen["type"] !== "image/png"){
			$("#imagen").val("");

			notie.alert({
				type: 3,
				text: 'ERROR: La imagen debe estar en formato JPG o PNG!',
				time: 7
			})

			$(".previsualizarImg").attr("src", "");
			return;
		}else if(imagen["size"] > 2000000){
			$("#imagen").val("");
			notie.alert({
				type: 3,
				text: 'ERROR: La imagen debe estar en formato JPG o PNG',
				time: 7
			})
			$(".previsualizarImg").attr("src", "");
			return;
		}else{
			let datosArchivo = new FileReader;
			datosArchivo.readAsDataURL(imagen);

			$(datosArchivo).on("load", function(event){
				let rutaArchivo = event.target.result;
				
				$(".previsualizarImg").attr("src", rutaArchivo);

				crearSlide({

					'imagen': imagen,
					'titulo': $("#titulo").val(),
					'descripcion': $("#descripcion").val()

				})
			})
		}
	}

	/* ONSUBMIT */

	const submitPost = async e => {

		e.preventDefault();		
		const {imagen, titulo, descripcion} = slide;
		console.log("slide", slide);

		if(imagen === null){
			$(".invalid-imagen").show();
			$(".invalid-imagen").html("La imagen no puede ir vacía")

			return;
		}
		
		if(titulo !== ""){
			const expTitulo = /^([0-9a-zA-Z]).{1,30}$/;

			if(!expTitulo.test(titulo)){
				$(".invalid-titulo").show();
				$(".invalid-titulo").html("Utiliza un formato que coincida con el solicitado");

				return;
			}

			return;
		}

		/*=============================================
		=         SE EJECUTA EL SERVICIO POST         =
		=============================================*/

		const result = await postData(slide);

		console.log(result.status);

		if(result.status === 400){
			$(".modal-footer").before(`<div class="alert alert-danger">${result.mensaje}</div>`);
		}

		if(result.status === 200){
			$(".modal-footer").before(`<div class="alert alert-success">${result.mensaje}</div>`);
			$('button[type="submit"]').remove();

			setTimeout(()=> {
				window.location.href="/slide";
			},500)
		}
	}	

	$(document).on("click", ".limpiarForm", function(){
		$(".modal").find('form')[0].reset();
		$(".previsualizarImg").attr("src", "");
	})

	/* RETORNO DE LA VISTA */
	return(

		<div className="modal fade" id="crearSlide">

			<div className="modal-dialog">

				<div className="modal-content">

					<div className="modal-header">
						<h4 className="modal-title">Crear Slide</h4>
						<button type="button" className="close" data-dismiss="modal">x</button>
					</div>

					<form onChange={cambiarFormPost} onSubmit={submitPost} encType="multipart/form-data">

						<div className="modal-body">

							{/* ENTRADA IMAGEN*/}

							<label className="small text-secondary" htmlFor="imagen">*Peso Max. 2MB | Formato: JPG o PNG</label>
							<input id="imagen" type="file" className="form-control-file border" name="imagen" required/>
							<div className="invalidad-feedback invalid-imagen"></div>
							<img className="previsualizarImg img-fluid"/>

							{/* ENTRADA TITULO*/}

							<div className="form-group">
								<label className="small text-secondary" htmlFor="titulo">* No ingresar caracteres especiales, solo letras y números</label>

								<div className="input-group mb-3">
									<div className="input-group-append input-group-text">
										<i className="fas fa-heading"></i>
									</div>

									<input id="titulo" type="text" className="form-control" name="titulo" placeholder="Ingrese el titulo" pattern="([0-9a-zA-Z]).{1,30}"/>

									<div className="invalid-feedback invalid-titulo"></div>
								</div>
							</div>

							{/* ENTRADA DESCRIPCION*/}

							<div className="form-group">
								<label className="small text-secondary" htmlFor="descripcion">* No ingresar caracteres especiales, solo letras y números</label>

								<div className="input-group mb-3">
									<div className="input-group-append input-group-text">
										<i className="fas fa-file-alt"></i>
									</div>

									<input id="descripcion" type="text" className="form-control" name="descripcion" placeholder="Ingrese la descripcion" pattern="([0-9a-zA-Z]).{1,30}"/>

									<div className="invalid-feedback invalid-titulo"></div>
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
=       Peticion POST para SLIDE    =
=============================================*/

const postData = data => {

	const url = `${rutaAPI}/crear-slide`;
	const token = localStorage.getItem("ACCESS_TOKEN");

	let formData = new FormData();
	formData.append("archivo", data.imagen);
	formData.append("titulo", data.titulo);
	formData.append("descripcion", data.descripcion);

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
