import React, {useState} from 'react'
import $ from 'jquery';
import {rutaAPI} from '../../../../config/Config';
import notie from 'notie';
import Swal from 'sweetalert2'

export default function CrearTarjeta()
{ 
    // HOOK
	const [tarjeta, NuevaTarjeta] = useState({
       
        titulo: "",
        descripcion: "",
        imagen: null,
    })

    // ONCHANGE
    const cambiarFormPut = e =>
    {
        if (!$("#crearTitulo").val())
        {
            $(".invalid-titulo").show();
            $(".invalid-titulo").html("El titulo no puede ir vacio");
        } else
        {
            $(".invalid-titulo").hide();
        }
          if (!$("#crearDescripcion").val())
        {
            $(".invalid-descripcion").show();
            $(".invalid-descripcion").html("la descripcion no puede ir vacia");
        } else
        {
            $(".invalid-descripcion").hide();
        }


		if($("#crearImagen").val()){


			let imagen = $("#crearImagen").get(0).files[0];
			
			if(imagen["type"] !== "image/jpeg" && imagen["type"] !== "image/png"){
				$("#imagen").val("");

				notie.alert({
					type: 3,
					text: 'ERROR: La imagen debe estar en formato JPG o PNG!',
					time: 7
				})

                $(".previsualizarImg").attr("src", "");
                $("#crearImagen").val("");
				return;
			}else if(imagen["size"] > 3000000){
				$("#imagen").val("");
				notie.alert({
					type: 3,
					text: 'ERROR: La imagen debe pesar como maximo 3mb',
					time: 7
				})
                $(".previsualizarImg").attr("src", "");
                  $("#crearImagen").val("");
				return;
			}else{
				let datosArchivo = new FileReader;
				datosArchivo.readAsDataURL(imagen);

				$(datosArchivo).on("load", function(event){
					let rutaArchivo = event.target.result;
					
					$(".previsualizarImg").attr("src", rutaArchivo);

					NuevaTarjeta({

                        'imagen': imagen,
                        'titulo': $("#crearTitulo").val(),
                        'descripcion': $("#crearDescripcion").val(),
					

					})
				})
			}
		}else{

			NuevaTarjeta({

                'imagen': null,
                'titulo': $("#crearTitulo").val(),
                'descripcion': $("#crearDescripcion").val()

					})

        }	
       
    }
    // ONSUBMIT

	const submitPut = async e => {

		$('.alert').remove();
		e.preventDefault();
		const {imagen, titulo, descripcion} = tarjeta;

       
        if (titulo == "")
        {
            $(".invalid-titulo").show();
            $(".invalid-titulo").html("El titulo no puede ir vacio");
            return
        } 
        if (descripcion == "")
        {
            $(".invalid-descripcion").show();
            $(".invalid-descripcion").html("La descripcion no puede ir vacia");
            return
        } 
     
		// SE EJECUTA SERVICIO PUT

		const result = await postData(tarjeta); 
		

		if(result.status === 400){

			Swal.fire({

		      type: "error",
		      title: result.mensaje,
		      showConfirmButton: true,
		      confirmButtonText: "Cerrar"
            
			}).then(function(result){
				if(result.value){
					window.location.href = "/tarjetas";
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
					window.location.href = "/tarjetas";
				}
			})
		}

	}   
   
  
    // RETORNO DE LA VISTA
    return(
    <div className="modal fade" id="crearTarjeta">

        <div className="modal-dialog">

            <div className="modal-content">

                <div className="modal-header">
                    <h4 className="modal-title">Editar tarjeta</h4>
                    <button type="button" className="close" data-dismiss="modal">x</button>
                </div>

                <form onChange={cambiarFormPut}   onSubmit={submitPut}  encType="multipart/form-data">

                    <div className="modal-body">

                        {/* ENTRADA IMAGEN*/}

                        <label className="small text-secondary" htmlFor="crearImagen">*Peso Max. 2MB | Formato: JPG o PNG</label>
                        <input id="crearImagen" type="file" className="form-control-file border" name="imagen" required/>
                        <div className="invalidad-feedback invalid-imagen"></div>
                        <img className="previsualizarImg img-fluid"/>

                        {/* ENTRADA TITULO*/}

                        <div className="form-group">
                            <label className="small text-secondary" htmlFor="crearTitulo">* No ingresar caracteres especiales, solo letras y números</label>

                            <div className="input-group mb-3">
                                <div className="input-group-append input-group-text">
                                    <i className="fas fa-heading"></i>
                                </div>

                                <input id="crearTitulo" type="text" className="form-control" name="titulo" placeholder="Ingrese el titulo" /* pattern="([0-9a-zA-Z]){1,30}"*//>

                                <div className="invalid-feedback invalid-titulo"></div>
                            </div>
                        </div>

                        {/* ENTRADA DESCRIPCION*/}

                        <div className="form-group">
                            <label className="small text-secondary" htmlFor="crearDescripcion">* No ingresar caracteres especiales, solo letras y números</label>

                            <div className="input-group mb-3">
                                <div className="input-group-append input-group-text">
                                    <i className="fas fa-file-alt"></i>
                                </div>

                                <textarea id="crearDescripcion" type="text" className="form-control" name="descripcion" placeholder="Ingrese la descripcion" /* pattern="([0-9a-zA-Z]).{1,30}" */ />

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

	const url = `${rutaAPI}/crear-tarjeta-data`;
	const token = localStorage.getItem("ACCESS_TOKEN");

	let formData = new FormData();
	formData.append("imagen", data.imagen);
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