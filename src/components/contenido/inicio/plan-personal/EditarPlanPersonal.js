import React, {useState} from 'react';
import $ from 'jquery';
import Swal from 'sweetalert2'
import {rutaAPI} from '../../../../config/Config';

export default function EditarBorrarAdministradores(){


	/*=============================================
	Hook para capturar datos
	=============================================*/

	const [planpersonal, editarPlanPersonal ] = useState({

		id: "",
		titulo: "",
		descripcion: "",
		valor: 0,
		pros: [],
		pdf: null,
		imagen: null

	})

	/*=============================================
	OnChange
	=============================================*/

	const cambiaFormPut = e => {

		
		/*=============================================
		 FALTA VALIDAR PDF E IMAGEN
		=============================================*/
		/*=============================================
		 FALTA VALIDAR PDF E IMAGEN
		=============================================*/
		/*=============================================
		 FALTA VALIDAR PDF E IMAGEN
		=============================================*/
		/*=============================================
		 FALTA VALIDAR PDF E IMAGEN
		=============================================*/
		/*=============================================
		 FALTA VALIDAR PDF E IMAGEN
		=============================================*/
		//                    |
		//					  |
		//					  |
		//					  |
		//					  V

		let imagen = $("#editarImagen").get(0).files[0];
		let pdf = $("#editarPdf").get(0).files[0];

		let datosArchivo = new FileReader;
		
		datosArchivo.readAsDataURL(imagen, pdf);

		$(datosArchivo).on("load", function(event){
			let rutaArchivo = event.target.result;
			
			$(".previsualizarImg").attr("src", rutaArchivo);

			editarPlanPersonal({

				'id' : $("#editarID").val(),
				'titulo' : $("#editarTitulo").val(),
				'descripcion' :  $("#editarDescripcion").val(),
				'valor' :   $("#editarValor").val(),
				'pros' : $("#editarPros").val(),
				'pdf' : pdf,
				'imagen' : imagen
			})
		})

	}

	/*=============================================
	OnSubmit
	=============================================*/

	const submitPut = async e => {

		$('.alert').remove();

		e.preventDefault();		

		const {id, titulo, descripcion, valor, pros, pdf, imagen} = planpersonal;

		/*=============================================
		Validamos que el campo user no venga vacío
		=============================================*/

		if(titulo === ""){

			$(".invalid-titulo").show();
			$(".invalid-titulo").html("Completa este campo");

		}

		/*=============================================
		Validamos Expresión regular
		=============================================*/

		// const expuser = /^(?=.*[A-Za-z]).{2,6}$/;

		// if(!expuser.test(user)){

		// 	$(".invalid-user").show();
		// 	$(".invalid-user").html("Utiliza un formato que coincida con el solicitado");

		// 	return;

		// }


		/*=============================================
		Validamos Expresión regular
		=============================================*/

		if(descripcion === ""){

			// const expPassword = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{8,}$/;
			$(".invalid-descripcion").show();
			$(".invalid-descripcion").html("Utiliza un formato que coincida con el solicitado");
		}


		if(valor === ""){

			$(".invalid-valor").show();
			$(".invalid-valor").html("Completa este campo");

		}

		if(pros === ""){

			$(".invalid-pros").show();
			$(".invalid-pros").html("Completa este campo");

		}



		/*=============================================
		EJECTUAMOS SERVICIO PUT
		=============================================*/

		const result = await putData(planpersonal);

		if(result.status === 400){

			$(".modal-footer").before(`<div class="alert alert-danger">${result.mensaje}</div>`)

		}

		if(result.status === 200){

			$(".modal-footer").before(`<div class="alert alert-success">${result.mensaje}</div>`)

			$('button[type="submit"]').remove();

			setTimeout(()=>{window.location.href= "/inicio_plan_personal";},500)

		}

	}

	/*=============================================
	CAPTURAMOS DATOS PARA EDITAR
	=============================================*/

	$(document).on("click", ".editarInputs", function(e){

		e.preventDefault();

		let data = $(this).attr("data").split('_,');
		
		$("#editarID").val(data[0]);
		$("#editarTitulo").val(data[2]);
		$("#editarDescripcion").val(data[3]);
	 	$("#editarValor").val(data[4]);
		$("#editarPros").val(data[5]);

		editarPlanPersonal({

			'id' : data[0],
			'titulo' : $("#editarTitulo").val(),
			'descripcion' :  $("#editarDescripcion").val(),
			'valor' :   $("#editarValor").val(),
			'pros' : $("#editarPros").val(),
			'pdf' : $("#editarPdf").val(),
			'imagen' : $("#editarImagen").val(),
		})


	})		



	/*=============================================
	=       Retornamos vista del componente       =
	=============================================*/
	return(

		<div className="modal" id="editarPlanPersonal">
		  <div className="modal-dialog">
		    <div className="modal-content">

		      <div className="modal-header">
		        <h4 className="modal-title">Editar Plan Personal</h4>
		        <button type="button" className="close" data-dismiss="modal">&times;</button>
		      </div>

		      <form onChange={cambiaFormPut} onSubmit={submitPut}> 

			      <div className="modal-body">

			      	<input type="hidden" id="editarID"/>

			      	{/* ENTRADA IMAGEN*/}

					<label className="small text-secondary" htmlFor="editarImagen">
					Imagen de Plan personal |
					*Peso Max. 2MB | Formato: JPG o PNG</label>
					<input id="editarImagen" type="file" className="form-control-file border" name="imagen" required/>
					<div className="invalidad-feedback invalid-imagen"></div>
					<img className="previsualizarImg img-fluid"/>

					{/* ENTRADA TITULO */}

			      	<div className="form-group">

			      		<label className="small text-secondary" htmlFor="editarTitulo">*Mínimo 2 caracteres, máximo 6, sin números</label>

			      		<div className="input-group mb-3">

			      			<div className="input-group-append input-group-text">
			      				<i className="fas fa-user"></i>
			      			</div>

			      			<input 
			      				id="editarTitulo"
			      				type="text"
			      				className="form-control"
			      				name="titulo"
			      				placeholder="Ingrese el titulo*"
			      				maxLength="40"
			      				required

			      			/>

			      			<div className="invalid-feedback invalid-titulo"></div>

			      		</div>	

			      	</div>

			        {/* ENTRADA DESCRIPCION */}

			      	<div className="form-group">

			      		<label className="small text-secondary" htmlFor="editarDescripcion">* Mínimo 8 caracteres, letras en mayúscula, en minúscula y números</label>

			      		<div className="input-group mb-3">

			      			<div className="input-group-append input-group-text">
			      				<i className="fas fa-key"></i>
			      			</div>

			      			<input 
			      				id="editarDescripcion"
			      				type="text"
			      				className="form-control"
			      				name="descripcion"
			      				placeholder="Ingrese la descripción*"

			      			/>

			      			<div className="invalid-feedback invalid-descripcion"></div>

			      		</div>	

			      	</div>

			      	 {/* ENTRADA VALOR */}

			      	<div className="form-group">

			      		<label className="small text-secondary" htmlFor="editarValor">* Mínimo 8 caracteres, letras en mayúscula, en minúscula y números</label>

			      		<div className="input-group mb-3">

			      			<div className="input-group-append input-group-text">
			      				<i className="fas fa-key"></i>
			      			</div>

			      			<input 
			      				id="editarValor"
			      				type="text"
			      				className="form-control"
			      				name="valor"
			      				placeholder="Ingrese el valor*"

			      			/>

			      			<div className="invalid-feedback invalid-valor"></div>

			      		</div>	

			      	</div>

			      	 {/* ENTRADA PROS */}

		     		<div className="form-group">
							<label className="small text-secondary" htmlFor="editarPros">* No ingresar caracteres especiales, solo letras y números</label>

						<div className="input-group mb-3">
							<div className="input-group-append input-group-text">
								<i className="fas fa-file-alt"></i>
							</div>

							<textarea className="form-control" rows="5" id="editarPros" name="pros" placeholder="Ingrese los pros" pattern="([0-9a-zA-Z]).{1,30}"></textarea>

							<div className="invalid-feedback invalid-pros"></div>
						</div>
					</div>

					{/* ENTRADA PDF*/}

					<div className="form-group">
						<label className="small text-secondary" htmlFor="editarPdf">PDF Plan personal | *Peso Max. 2MB | Formato: JPG o PNG</label>
						<input id="editarPdf" type="file" className="form-control-file border" name="pdf" required/>
						<div className="invalidad-feedback invalid-pdf"></div>
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

	const url = `${rutaAPI}/edit-personal-plan/${data.id}`;
	const token = localStorage.getItem("ACCESS_TOKEN");

	let formData = new FormData();
	formData.append("titulo", data.titulo);
	formData.append("descripcion", data.descripcion);
	formData.append("valor", data.valor);
	formData.append("pros", data.pros);
	formData.append("pdf", data.pdf);
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