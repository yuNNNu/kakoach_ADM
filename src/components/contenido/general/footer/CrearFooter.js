import React, {useState} from 'react'
import $ from 'jquery';
import {rutaAPI} from '../../../../config/Config';
import Swal from 'sweetalert2'

import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import RemoveIcon from '@material-ui/icons/Remove';
import AddIcon from '@material-ui/icons/Add';

export default function CrearFooter()
{ 
    /*=============================================
	Hook para capturar datos
	=============================================*/

	const [Footer, crearFooter ] = useState({

		titulo: "",
		descripcion: []
    })

    const [descInputs, createDesc] = useState([
    	{descripcion: '', link: ''}
    ])
    /*=============================================
	OnChange
	=============================================*/
    const cambiarFormPut = () =>
    {
        let arrDes = [...descInputs];

		crearFooter({
			'titulo': $("#crearTitulo").val(),
			'descripcion': arrDes
		})

    }
    /*=============================================
	OnSubmit
	=============================================*/

	const submitPut = async e => {
        
      
		$('.alert').remove();

		e.preventDefault();		

		const { titulo, descripcion} = Footer;
        if (!titulo || !descripcion)
        {
            if(!titulo){
			$(".invalid-titulo").show();
			$(".invalid-titulo").html("Completa este campo");
            }

            if(descripcion === ""){
                $(".invalid-descripcion").show();
                $(".invalid-descripcion").html("Completa este campo");
            }
            return
        }

        console.log("Footer", Footer);
        return;
		/*=============================================
		EJECTUAMOS SERVICIO PUT
		=============================================*/

		const result = await postData(Footer);

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
		<div className="modal fade" id="crearFooter">

			<div className="modal-dialog">

				<div className="modal-content">

					<div className="modal-header">
						<h4 className="modal-title">Nuevo Footer</h4>
						<button type="button" className="close" data-dismiss="modal">x</button>
					</div>

					<form onChange={cambiarFormPut} onSubmit={submitPut} encType="multipart/form-data">

						<div className="modal-body">
						
							{/* ENTRADA TITULO */}

							<div className="form-group">
						

								<div className="input-group mb-3">
									<div className="input-group-append input-group-text">
										<i className="fas fa-quote-left"></i>
									</div>

									<input id="crearTitulo" type="text" className="form-control" name="titulo" placeholder="Ingrese el título" pattern="([0-9a-zA-Z]).{1,30}"/>

									<div className="invalid-feedback invalid-titulo"></div>
								</div>
							</div>

							{/* ENTRADA DESCRIPCION Y LINK*/}

							<div className="form-group">

								<div className="input-group mb-3 ml-2">

									{
										descInputs.map((descInput,index) => (

											<div key={index} className="row mb-3"> 
												<div className="input-group-append input-group-text col-1">
													<i class="fas fa-list"></i>
												</div>
												<input onChange={event => handleChangeDesc(index, event)} value={descInputs.descripcion} id="crearDesc" type="text" className="form-control col-5" name="descripcion" placeholder="Ingrese la descripción"/>

												<div className="input-group-append input-group-text col-1">
													<i class="fas fa-link"></i>
												</div>

												<input onChange={event => handleChangeDesc(index, event)} value={descInputs.link} id="crearLink" type="text" className="form-control col-5" name="link" placeholder="Ingrese el link"/>
											</div>
										))
									}

									<div className="invalid-feedback invalid-descripcion"></div>
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
    =       Peticion POST para SLIDE    =
    =============================================*/

    const postData = data => {

        const url = `${rutaAPI}/create-footer`;
        const token = localStorage.getItem("ACCESS_TOKEN");

        let formData = new FormData();
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