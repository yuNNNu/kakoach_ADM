import React, {useState} from 'react'
import {rutaAPI} from '../../../config/Config';
import $ from 'jquery';
import notie from 'notie';
import 'notie/dist/notie.css';
import 'summernote/dist/summernote-lite.css';
import 'summernote/dist/summernote-lite.js';

export default function CrearSlide(){

	//FORMATO URL

	let limpiarUrl = text => {
		let texto = text.toLowerCase();
		texto = texto.replace(/[á]/g,'a');
		texto = texto.replace(/[é]/g,'e');
		texto = texto.replace(/[í]/g,'i');
		texto = texto.replace(/[ó]/g,'o');
		texto = texto.replace(/[ú]/g,'u');
		texto = texto.replace(/[ñ]/g,'n');
		texto = texto.replace(/ /g,'-');

		return texto;
	}

	$(document).on("keyup", ".inputUrl", function(){
		$(this).val(
			limpiarUrl($(this).val())
		)
	})

	/* HOOK */

	let [articulo, crearArticulo] = useState({
		portada: null,
		url: "",
		titulo: "",
		intro: "",
		contenido: ""
	})
	//ONCHANGE
	const cambiarFormPost = e => {
		let portada = $("#portada").get(0).files[0];

		if(portada["type"] !== "image/jpeg" && portada["type"] !== "image/png"){
			$("#portada").val("");

			notie.alert({
				type: 3,
				text: 'ERROR: La portada debe estar en formato JPG o PNG!',
				time: 7
			})

			$(".previsualizarImg").attr("src", "");
			return;
		}else if(portada["size"] > 2000000){
			$("#portada").val("");
			notie.alert({
				type: 3,
				text: 'ERROR: La portada debe estar en formato JPG o PNG',
				time: 7
			})
			$(".previsualizarImg").attr("src", "");
			return;
		}else{
			let datosArchivo = new FileReader;
			datosArchivo.readAsDataURL(portada);

			$(datosArchivo).on("load", function(event){
				let rutaArchivo = event.target.result;
				
				$(".previsualizarImg").attr("src", rutaArchivo);

				crearArticulo({

					'portada': portada,
					'url': $("#url").val(),
					'titulo': $("#titulo").val(),
					'intro': $("#intro").val(),
					'contenido': $("#contenido").val()

				})
			})
		}	
	}
	//ONSUBMIT
	const submitPost = async e => {
		$('.alert').remove();
		e.preventDefault();
		const {portada, url, intro, contenido, titulo} = articulo;
		console.log("url", url);
		console.log("intro", intro);
		console.log("contenido", contenido);

		/*=============================================
		Validamos que el campo no venga vacío
		=============================================*/

		if(url === ""){

			$(".invalid-url").show();
			$(".invalid-url").html("Completa este campo");

			return;
		
		}

		/*=============================================
		Validamos Expresión regular
		=============================================*/

		if(url !== ""){

			const expUrl = /^([0-9a-zA-Z-]).{1,50}$/;

			if(!expUrl.test(url)){

				$(".invalid-url").show();
				$(".invalid-url").html("Utiliza un formato que coincida con el solicitado");

				return;
			
			}

		}

		/*=============================================
		Validamos que el campo no venga vacío
		=============================================*/

		if(titulo === ""){

			$(".invalid-titulo").show();
			$(".invalid-titulo").html("Completa este campo");

			return;
		
		}

		/*=============================================
		Validamos Expresión regular
		=============================================*/

		if(titulo !== ""){

			const expTitulo = /^([0-9a-zA-ZñÑáéíóúÁÉÍÓÚ ]).{1,30}$/;

			if(!expTitulo.test(titulo)){

				$(".invalid-titulo").show();
				$(".invalid-titulo").html("Utiliza un formato que coincida con el solicitado");

				return;
			
			}

		}

		/*=============================================
		Validamos que el campo no venga vacío
		=============================================*/

		if(intro === ""){

			$(".invalid-intro").show();
			$(".invalid-intro").html("Completa este campo");

			return;
		
		}

		/*=============================================
		Validamos Expresión regular
		=============================================*/

		if(intro !== ""){

			const expIntro = /^([(\\)\\=\\&\\$\\;\\-\\_\\*\\"\\<\\>\\?\\¿\\!\\¡\\:\\,\\.\\0-9a-zA-ZñÑáéíóúÁÉÍÓÚ ]).{1,300}$/;

			if(!expIntro.test(intro)){

				$(".invalid-intro").show();
				$(".invalid-intro").html("Utiliza un formato que coincida con el solicitado");

				return;
			
			}
		}

		/*=============================================
		Validamos que el campo no venga vacío
		=============================================*/

		if(contenido === ""){

			$(".invalid-contenido").show();
			$(".invalid-contenido").html("Completa este campo");

			return;
		
		}

		/*=============================================
		Validamos Expresión regular
		=============================================*/

		if(contenido !== ""){

			const expContenido = /^([(\\)\\=\\&\\$\\;\\-\\_\\*\\"\\<\\>\\?\\¿\\!\\¡\\:\\,\\.\\0-9a-zA-ZñÑáéíóúÁÉÍÓÚ ]).{1,}$/;

			if(!expContenido.test(contenido)){

				$(".invalid-contenido").show();
				$(".invalid-contenido").html("Utiliza un formato que coincida con el solicitado");

				return;
			
			}
		
		}

		// SE EJECUTA SERVICIO POST

		const result = await postData(articulo);
		console.log(result.status);
		if(result.status === 400){
			$(".modal-footer").before(`<div class="alert alert-danger">${result.mensaje}</div>`);
		}

		if(result.status === 200){
			$(".modal-footer").before(`<div class="alert alert-success">${result.mensaje}</div>`);
			$('button[type="submit"]').remove();

			setTimeout(()=> {
				window.location.href="/articulos";
			},500)
		}
	}

	// SUMMERNOTE

	$(document).ready(function(){
		$("#contenido").summernote({
			height:300
		})
	})

	/* RETORNO DE LA VISTA */
	return(

			<div className="modal fade" id="crearArticulos">

			<div className="modal-dialog">

				<div className="modal-content">

					<div className="modal-header">
						<h4 className="modal-title">Crear Artículo</h4>
						<button type="button" className="close" data-dismiss="modal">×</button>
					</div>

					<form onChange={cambiarFormPost} onSubmit={submitPost} encType="multipart/form-data">

						<div className="modal-body">

							{/*ENTRADA PORTADA*/}

							<div className="form-group">

								<label className="small text-secondary" htmlFor="portada">*Peso Max. 2MB | Formato: JPG o PNG</label>

								<input 
									id="portada"
									type="file" 
									className="form-control-file border" 
									name="portada" 
									required
								/>

								<div className="invalid-feedback invalid-portada"></div>

								<img className="previsualizarImg img-fluid"/>

							</div>

							{/*ENTRADA URL*/}

							<div className="form-group">

								<label className="small text-secondary" htmlFor="url">* No ingresar caracteres especiales, solo letras y números</label>

								<div className="input-group mb-3">
		              
					              <div className="input-group-append input-group-text">               
					                 <i className="fas fa-link"></i>					                 
					              </div>

					              <input 
					              	id="url"
					              	type="text" 
					              	className="form-control inputUrl text-lowercase" 
					              	name="url"
					              	placeholder="Ingrese la url del artículo*"
					              	pattern="([0-9a-zA-Z-]).{1,50}"
					              	required
					              	/>

					              <div className="invalid-feedback invalid-url"></div>
							
								</div>

							</div>

							{/*ENTRADA TÍTULO*/}

							<div className="form-group">

								<label className="small text-secondary" htmlFor="titulo">* No ingresar caracteres especiales, solo letras y números</label>

								<div className="input-group mb-3">

					              <div className="input-group-append input-group-text">               
					                 <i className="fas fa-heading"></i>
					              </div>

					              <input 
					              	id="titulo"
					              	type="text" 
					              	className="form-control" 
					              	name="titulo" 
					              	placeholder="Ingrese el título*"				
					              	pattern="([0-9a-zA-ZñÑáéíóúÁÉÍÓÚ ]).{1,30}" 
					              	required
					              
					              	/>

					              <div className="invalid-feedback invalid-titulo"></div>

								</div>

							</div>

							{/*ENTRADA INTRO*/}

							<div className="form-group">

								<label className="small text-secondary" htmlFor="intro">* No ingresar caracteres especiales, solo letras y números</label>

								<div className="input-group mb-3">
		              
					              <div className="input-group-append input-group-text">               
					                 <i className="fas fa-file-alt"></i>				                 
					              </div>

					              <input 
					              	id="intro"
					              	type="text" 
					              	className="form-control" 
					              	name="intro"
					              	placeholder="Ingrese la Intro del artículo*"
					              	pattern="([(\\)\\=\\&\\$\\-\\_\\*\\<\\>\\?\\¿\\!\\¡\\:\\,\\.\\0-9a-zA-ZñÑáéíóúÁÉÍÓÚ ]).{1,300}"
					              	required
					              	/>

					              <div className="invalid-feedback invalid-intro"></div>
							
								</div>

							</div>

							{/*ENTRADA CONTENIDO*/}

							<div className="form-group">

								<label className="small text-secondary" htmlFor="contenido">Ingrese el contenido del artículo:</label>

								<textarea className="form-control summernote" rows="5" id="contenido" name="contenido"></textarea>

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

	const url = `${rutaAPI}/crear-articulo`;
	const token = localStorage.getItem("ACCESS_TOKEN");

	let formData = new FormData();
	formData.append("archivo", data.portada);
	formData.append("url", data.url);
	formData.append("titulo", data.titulo);
	formData.append("intro", data.intro);
	formData.append("contenido", data.contenido);

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
