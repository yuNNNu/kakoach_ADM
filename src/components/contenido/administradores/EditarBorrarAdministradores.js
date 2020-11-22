import React, {useState} from 'react';
import $ from 'jquery';
import Swal from 'sweetalert2'
import { rutaAPI } from '../../../config/Config';

export default function EditarBorrarAdministradores(){


	/*=============================================
	Hook para capturar datos
	=============================================*/

	const [administradores, editarAdministrador ] = useState({

		user: "",
		password: "",
		id: ""

	})

	/*=============================================
	OnChange
	=============================================*/

	const cambiaFormPost = e => {

		editarAdministrador({

			...administradores,
			[e.target.name] : e.target.value

		})

	}

	/*=============================================
	OnSubmit
	=============================================*/

	const submitPost = async e => {

		$('.alert').remove();

		e.preventDefault();		

		const {user, password} = administradores;

		/*=============================================
		Validamos que el campo user no venga vacío
		=============================================*/

		if(user === ""){

			$(".invalid-user").show();
			$(".invalid-user").html("Completa este campo");

			return;

		}

		/*=============================================
		Validamos Expresión regular
		=============================================*/

		const expuser = /^(?=.*[A-Za-z]).{2,6}$/;

		if(!expuser.test(user)){

			$(".invalid-user").show();
			$(".invalid-user").html("Utiliza un formato que coincida con el solicitado");

			return;

		}


		/*=============================================
		Validamos Expresión regular
		=============================================*/

		if(password !== ""){

			const expPassword = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{8,}$/;

			if(!expPassword.test(password)){

				$(".invalid-password").show();
				$(".invalid-password").html("Utiliza un formato que coincida con el solicitado");

				return;

			}

		}

		/*=============================================
		EJECTUAMOS SERVICIO PUT
		=============================================*/

		const result = await putData(administradores);

		if(result.status === 400){

			$(".modal-footer").before(`<div class="alert alert-danger">${result.mensaje}</div>`)

		}

		if(result.status === 200){

			$(".modal-footer").before(`<div class="alert alert-success">${result.mensaje}</div>`)

			$('button[type="submit"]').remove();

			setTimeout(()=>{window.location.href= "/";},500)

		}

	}

	/*=============================================
	CAPTURAMOS DATOS PARA EDITAR
	=============================================*/

	$(document).on("click", ".editarInputs", function(e){

		e.preventDefault();

		let data = $(this).attr("data").split(',');
		
		$("#editarUsuario").val(data[1]);

		editarAdministrador({


			'user' : $("#editarUsuario").val(),
			'password' :  $("#editarPassword").val(),
			'id' :  data[0]

		})


	})

	/*=============================================
	CAPTURAMOS DATOS PARA BORRAR
	=============================================*/

	$(document).on("click", ".borrarInput", function(e){

		e.preventDefault();

		let data = $(this).attr("data").split(',')[0];

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

			  	const borrarAdministrador = async () => {

					/*=============================================
					EJECTUAMOS SERVICIO DELETE
					=============================================*/

					const result = await deleteData(data);

					if(result.status === 400){

						Swal.fire({

					      type: "error",
					      title: result.mensaje,
					      showConfirmButton: true,
					      confirmButtonText: "Cerrar"
			            
						}).then(function(result){
							if(result.value){
								window.location.href = "/";
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
								window.location.href = "/";
							}
						})
					}

				}

				borrarAdministrador();

			    
			  }
			})


		


    })




	/*=============================================
	=       Retornamos vista del componente       =
	=============================================*/
	return(

		<div className="modal" id="editarAdmin">
		  <div className="modal-dialog">
		    <div className="modal-content">

		      <div className="modal-header">
		        <h4 className="modal-title">Editar Administrador</h4>
		        <button type="button" className="close" data-dismiss="modal">&times;</button>
		      </div>


		      <form onChange={cambiaFormPost} onSubmit={submitPost}> 

			      <div className="modal-body">

			      	<div className="form-group">

			      		<label className="small text-secondary" htmlFor="editarUsuario">*Mínimo 2 caracteres, máximo 6, sin números</label>

			      		<div className="input-group mb-3">

			      			<div className="input-group-append input-group-text">
			      				<i className="fas fa-user"></i>
			      			</div>

			      			<input 
			      				id="editarUsuario"
			      				type="text"
			      				className="form-control text-lowercase"
			      				name="user"
			      				placeholder="Ingrese el user*"
			      				minLength="2"
			      				maxLength="6"
			      				pattern="(?=.*[A-Za-z]).{2,6}"
			      				required

			      			/>

			      			<div className="invalid-feedback invalid-user"></div>

			      		</div>	

			      	</div>

			      	<div className="form-group">

			      		<label className="small text-secondary" htmlFor="editarPassword">* Mínimo 8 caracteres, letras en mayúscula, en minúscula y números</label>

			      		<div className="input-group mb-3">

			      			<div className="input-group-append input-group-text">
			      				<i className="fas fa-key"></i>
			      			</div>

			      			<input 
			      				id="editarPassword"
			      				type="password"
			      				className="form-control"
			      				name="password"
			      				placeholder="Ingrese la contraseña*"
			      				minLength="8"
			      				pattern="(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{8,}"

			      			/>

			      			<div className="invalid-feedback invalid-password"></div>

			      		</div>	

			      	</div>

			      </div>


			      <div className="modal-footer d-flex justify-content-between">

				      <div><button type="button" className="btn btn-danger" data-dismiss="modal">Cerrar</button></div>

				      <div><button type="submit" className="btn btn-primary">Enviar</button></div>        

			      </div>

		      </form>

		    </div>
		  </div>
		</div>

	)

}


/*=============================================
PETICIÓN PUT ADMINISTRADORES
=============================================*/

const putData = data =>{

	const url = `${rutaAPI}/editar-admin/${data.id}`;
	const token = localStorage.getItem("ACCESS_TOKEN");
	const params = {

		method: "PUT",
		body:JSON.stringify(data),
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

/*=============================================
PETICIÓN DELETE ADMINISTRADORES
=============================================*/

const deleteData = data =>{

	const url = `${rutaAPI}/eliminar-admin/${data}`;
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
