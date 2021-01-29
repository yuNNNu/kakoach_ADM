import React, {useState} from 'react'
import $ from 'jquery';
import {rutaAPI} from '../../../../config/Config';

import IconButton from '@material-ui/core/IconButton';
import RemoveIcon from '@material-ui/icons/Remove';
import AddIcon from '@material-ui/icons/Add';

import Swal from 'sweetalert2'

export default function EditarFooter(){

	// HOOK

	const [Footer, crearFooter ] = useState({

		titulo: "",
		descripciones: ""
    })

    const [descInputs, createDesc] = useState([
    	{descripcion: '', link: ''}
    ])

	// ONCHANGE

	const cambiarFormPut = e =>
	{
		let arrDes = [...descInputs]
		crearFooter({
			'id' : $("#editarID").val(),
			'titulo': $("#editarTitulo").val(),
			'descripcion': arrDes
		})
	}

	// ONSUBMIT

	const submitPut = async e => {

		$('.alert').remove();
		e.preventDefault();
		const { titulo, descripcion} = Footer;
		if (!titulo || !descripcion)
        {
            if(titulo === ""){
			$(".invalid-titulo").show();
			$(".invalid-titulo").html("Completa este campo");
            }

            if(descripcion === ""){
                $(".invalid-descripcion").show();
                $(".invalid-descripcion").html("Completa este campo");
            }
            return
        }
	
		// SE EJECUTA SERVICIO PUT

		const result = await putData(Footer); 

		

		if(result.status === 400){

			Swal.fire({

		      type: "error",
		      title: result.mensaje,
		      showConfirmButton: true,
		      confirmButtonText: "Cerrar"
            
			}).then(function(result){
				if(result.value){
					window.location.href = "/footer";
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
					window.location.href = "/footer";
				}
			})
		}

	}

	//CAPTURAR DATOS PARA EDITAR

	$(document).on("click", ".editarInputs", function(e){
		e.preventDefault();
		
		let data = $(this).attr("data").split('_,');
		let id = data[0];
		let arrDes;
		$("#editarID").val(data[0]);
		$("#editarTitulo").val(data[1]);
		$("#editarDescripcion").val(data[2]);
		
		fetch(`${rutaAPI}/show-individual-footer/${id}`)
    	.then(response => response.json())
    	.then(json => {

    		let descArr = json.data.descripcion;
    		let descArrofObjs = [];
    		descArr.forEach(x => {
    		
    			let descObj = {
    				descripcion: x.descripcion,
    				link: x.link
    			}

    			descArrofObjs.push(descObj)
    		})

    		createDesc(descArrofObjs);
    		
    	})
    	.catch(err => {
    		console.log(err);
    	}) 

		crearFooter({

			'titulo' : $('#editarTitulo').val(),
			'descripcion': arrDes,
			'id' : data[0]

		})
	})
    // CAPTURAR DATOS PARA BORRAR
	$(document).on("click", ".borrarInput", function(e){

		e.preventDefault();
		let data = $(this).attr("data").split("_,")[0];
		
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

			  	const borrarFooter = async () => {

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
								window.location.href = "/footer";
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
								window.location.href = "/footer";
							}
						})
					}

				}

				borrarFooter();

			    
			  }
			})


	})

	const handleChangeDesc = (index, event) => {
		const values = [...descInputs];
		values[index][event.target.name] = event.target.value;
		createDesc(values);
	}

	const handleAddFields = () => {
		createDesc([...descInputs, {descripcion: '', link: ''}])
	}

	const handleRemoveFields = () => {
		const values = [...descInputs];
		let index = values.length-1;
		values.splice(index, 1);
		createDesc(values);
	}
	

	// RETORNO DE LA VISTA

	return(
		<div className="modal fade" id="editarFooter">

			<div className="modal-dialog">

				<div className="modal-content">

					<div className="modal-header">
						<h4 className="modal-title">Editar footer</h4>
						<button type="button" className="close" data-dismiss="modal">x</button>
					</div>

						<div className="modal-header">
						<ul>
							<li><p className="small mt-3">En caso de no necesitar un link, completar el campo con "/"</p></li>
							<li><p className="small mb-0">No olvidar escribir el link con la sigla "https://"</p></li>
						</ul>
					</div>

					<form onChange={cambiarFormPut} onSubmit={submitPut} encType="multipart/form-data">

						<div className="modal-body mt-3">
							<input type="hidden" id="editarID"/>
							{/* ENTRADA TITULO */}

							<div className="form-group">

								<div className="input-group mb-3">
									<div className="input-group-append input-group-text">
										<i className="fas fa-quote-left"></i>
									</div>

									<input id="editarTitulo" type="text" className="form-control" name="titulo" placeholder="Ingrese el título" pattern="([0-9a-zA-Z]).{1,30}"/>

									<div className="invalid-feedback invalid-titulo"></div>
								</div>
							</div>

							{/* ENTRADA DESCRIPCION*/}

							{/* ENTRADA DESCRIPCION Y LINK*/}

							<div className="form-group">

								<div className="input-group mb-3 ml-2">

									{
										descInputs.map((descInput,index) => (

											<div key={index} className="row mb-3"> 
												<div className="input-group-append input-group-text col-1">
													<i class="fas fa-list"></i>
												</div>
												<input value={descInput.descripcion} onChange={event => handleChangeDesc(index, event)} id="crearDesc" type="text" className="form-control col-5" name="descripcion" placeholder="Ingrese la descripción"/>

												<div className="input-group-append input-group-text col-1">
													<i class="fas fa-link"></i>
												</div>

												<input value={descInput.link} onChange={event => handleChangeDesc(index, event)} id="crearLink" type="text" className="form-control col-5" name="link" placeholder="Ingrese el link"/>
											</div>
										))
									}

								</div>
							</div>

						</div>

						<div className="modal-footer d-flex justify-content-between">

							<div>
								<button type="button" className="btn btn-danger" data-dismiss="modal">Cerrar</button>
							</div>

							<div>
								<IconButton className="mb-1" style={{margin: 0}}  onClick={() => handleRemoveFields()}> 
									<RemoveIcon/>
								</IconButton>
								<IconButton onClick={() => handleAddFields()}>
									<AddIcon/>
								</IconButton>
							</div>


							<div>
								<button type="submit" className="btn btn-primary" onClick={cambiarFormPut}>Guardar</button>
							</div>

						</div>

					</form>
				</div>

			</div>

		</div>

	)

}

/*=============================================
=       Peticion PUT para footer    =
=============================================*/

const putData = data => {

	const url = `${rutaAPI}/edit-footer/${data.id}`;
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

/*=============================================
PETICIÓN DELETE FOOTER
=============================================*/

const deleteData = data =>{

	const url = `${rutaAPI}/borrar-footer/${data}`;
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