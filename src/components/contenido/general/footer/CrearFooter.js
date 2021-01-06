import React, {useState} from 'react'
import $ from 'jquery';
import {rutaAPI} from '../../../../config/Config';
import Swal from 'sweetalert2'

export default function CrearFooter()
{ 
    /*=============================================
	Hook para capturar datos
	=============================================*/

	const [Footer, crearFooter ] = useState({

		titulo: "",
		descripcion: []

    })
    /*=============================================
	OnChange
	=============================================*/
    const cambiarFormPut = e =>
    {
        let arrDes;
        if ($("#crearDescripcion").val())
        {
            let arrDi = $("#crearDescripcion").val().split(',');
             arrDes = arrDi.map((x) =>
            {
                return x.replace("\n", "");
                
            })
        } else
        {
            arrDes = "";
        }


		console.log("arr en onchange",arrDes)
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
	// RETORNO DE LA VISTA

	return(
		<div className="modal fade" id="crearFooter">

			<div className="modal-dialog">

				<div className="modal-content">

					<div className="modal-header">
						<h4 className="modal-title">crear footer</h4>
						<button type="button" className="close" data-dismiss="modal">x</button>
					</div>

					<form onChange={cambiarFormPut}   onSubmit={submitPut} encType="multipart/form-data">

						<div className="modal-body">
						
							{/* ENTRADA TITULO */}

							<div className="form-group">
								<label className="small text-secondary" htmlFor="crearTitulo">* No ingresar caracterás especiales, sólo letras y números</label>

								<div className="input-group mb-3">
									<div className="input-group-append input-group-text">
										<i className="fas fa-quote-left"></i>
									</div>

									<input id="crearTitulo" type="text" className="form-control" name="titulo" placeholder="Ingrese el título" pattern="([0-9a-zA-Z]).{1,30}"/>

									<div className="invalid-feedback invalid-titulo"></div>
								</div>
							</div>

							{/* ENTRADA DESCRIPCION*/}

							<div className="form-group">
								<label className="small text-secondary" htmlFor="crearDescripcion">* No ingresar carácteres especiales, sólo letras y números</label>

								<div className="input-group mb-3">
									<div className="input-group-append input-group-text">
										<i className="fas fa-file-alt"></i>
									</div>

									<textarea className="form-control" rows="5" id="crearDescripcion" name="descripcion" placeholder="Ingrese la descripción" pattern="([0-9a-zA-Z]).{1,30}"></textarea>

									<div className="invalid-feedback invalid-descripcion"></div>
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