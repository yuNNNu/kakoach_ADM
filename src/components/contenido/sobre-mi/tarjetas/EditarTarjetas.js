import React, {useState} from 'react'
import $ from 'jquery';
import {rutaAPI} from '../../../../config/Config';
import notie from 'notie';
import Swal from 'sweetalert2'
import 'summernote/dist/summernote-lite.js'
import 'summernote/dist/summernote-lite.css'
export default function EditarTarjetas()
{ 
    // HOOK
	const [tarjeta, editarTarjetas] = useState({
        id: "",
        titulo: "",
        descripcion: "",
        imagen: null,
    })

    // ONCHANGE
    const cambiarFormPut = e =>
    {
        if (!$("#editarTitulo").val())
        {
            $(".invalid-titulo").show();
            $(".invalid-titulo").html("El titulo no puede ir vacio");
        } else
        {
            $(".invalid-titulo").hide();
        }
          if (!$("#editarDescripcion").val())
        {
            $(".invalid-descripcion").show();
            $(".invalid-descripcion").html("la descripcion no puede ir vacia");
        } else
        {
            $(".invalid-descripcion").hide();
        }


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
                $("#editarImagen").val("");
				return;
			}else if(imagen["size"] > 3000000){
				$("#imagen").val("");
				notie.alert({
					type: 3,
					text: 'ERROR: La imagen debe pesar como maximo 3mb',
					time: 7
				})
                $(".previsualizarImg").attr("src", "");
                  $("#editarImagen").val("");
				return;
			}else{
				let datosArchivo = new FileReader();
				datosArchivo.readAsDataURL(imagen);

				$(datosArchivo).on("load", function(event){
					let rutaArchivo = event.target.result;
					
					$(".previsualizarImg").attr("src", rutaArchivo);

					editarTarjetas({

                        'imagen': imagen,
                        'titulo': $("#editarTitulo").val(),
                        'descripcion': $('#editarDescripcion').summernote('code'),
						'id' : $("#editarID").val()

					})
				})
			}
		}else{

			editarTarjetas({

                'imagen': null,
                'titulo': $("#editarTitulo").val(),
                'descripcion': $('#editarDescripcion').summernote('code'),
                'id' : $("#editarID").val()

					})

		}	
    }
    // ONSUBMIT

	const submitPut = async e =>
	{
		
	
		$('.alert').remove();
		e.preventDefault();
		let { id, titulo, imagen } = tarjeta;
		const html = $('#editarDescripcion').summernote('code');
		if (titulo === "")
		{
			$(".invalid-titulo").show();
			$(".invalid-titulo").html("El titulo no puede ir vacio");
			return
		} 
		if (html === "")
		{
			$(".invalid-descripcion").show();
			$(".invalid-descripcion").html("La descripcion no puede ir vacia");
			return
		} 
		let data = {
			id: id,
			titulo: titulo,
			descripcion: $('#editarDescripcion').summernote('code'),
			imagen : imagen
		}
      
		
		
		
     
		// SE EJECUTA SERVICIO PUT

		const result = await putData(data); 
		

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
    //CAPTURAR DATOS PARA EDITAR
	$(document).on("click", ".editarInputs", function(e){
		e.preventDefault();
       
        let data = $(this).attr("data").split('_,');
        console.log("🚀 ~ file: EditarTarjetas.js ~ line 175 ~ $ ~ data", data)
      

        // recuperamos os datos

		$("#editarID").val(data[0]);
        $(".previsualizarImg").attr("src", `${rutaAPI}/mostrar-tarjeta-img/${ data[1] }`);
        $("#editarTitulo").val(data[2]);
		$("#editarDescripcion").val(data[3]);
		$("#editarDescripcion").summernote({
            height:350,
			width:460
        });
		editarTarjetas({

			'imagen': null,
			'titulo': data[2],
			'descripcion': data[3],
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

			  	const borrarTarjeta = async () => {

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

				borrarTarjeta();

			    
			  }
			})


	})
	// summernote
	$(document).ready(function(valorSummer){
		$("#descripcion").summernote({
			height:350,
			width:460
		});
	})
    // RETORNO DE LA VISTA
    return(
    <div className="modal fade" id="open">

        <div className="modal-dialog">

            <div className="modal-content">

                <div className="modal-header">
                    <h4 className="modal-title">Editar tarjeta</h4>
                    <button type="button" className="close" data-dismiss="modal">x</button>
                </div>

                <form onChange={cambiarFormPut}   onSubmit={submitPut}   encType="multipart/form-data">

                    <div className="modal-body">

                        <input type="hidden" id="editarID"/>

                        {/* ENTRADA IMAGEN*/}

                        <label className="small text-secondary" htmlFor="editarImagen">*Peso Max. 2MB | Formato: JPG o PNG</label>
                        <input id="editarImagen" type="file" className="form-control-file border" name="imagen" />
                        <div className="invalidad-feedback invalid-imagen"></div>
                        <img className="previsualizarImg img-fluid" alt="img-cargar"/>

                        {/* ENTRADA TITULO*/}

                        <div className="form-group">

                            <div className="input-group mb-3 mt-3">
                                <div className="input-group-append input-group-text">
                                    <i className="fas fa-heading"></i>
                                </div>

                                <input id="editarTitulo" type="text" className="form-control" name="titulo" placeholder="Ingrese el titulo" /* pattern="([0-9a-zA-Z]){1,30}"*//>

                                <div className="invalid-feedback invalid-titulo"></div>
                            </div>
                        </div>

                        {/* ENTRADA DESCRIPCION*/}

                        <div className="form-group">

                            <div className="input-group mb-3">
                                <div className="input-group-append input-group-text">
                                    <i className="fas fa-file-alt"></i>
                                </div>

                                <textarea id="editarDescripcion" type="text" className="form-control" name="descripcion" placeholder="Ingrese la descripcion" /* pattern="([0-9a-zA-Z]).{1,30}" */ />

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
=       Peticion PUT para logo    =
=============================================*/

const putData = data => {

	const url = `${rutaAPI}/editar-tarjeta-data/${data.id}`;
	const token = localStorage.getItem("ACCESS_TOKEN");

	let formData = new FormData();
	formData.append("imagen", data.imagen);
	formData.append("titulo", data.titulo);
	formData.append("descripcion", data.descripcion);

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
/*=============================================
PETICIÓN DELETE TARJETA
=============================================*/

const deleteData = data =>{

	const url = `${rutaAPI}/eliminar-tarjeta/${data}`;
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