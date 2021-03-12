import React, {useState} from 'react'
import $ from 'jquery';
import {rutaAPI} from '../../../../config/Config';
import Swal from 'sweetalert2'

export default function EditarImgSlide()
{ 
    // HOOK

	const [imgP, editarImg] = useState({

		
        id: "",
        titulo: "",
        descripcion: "",
        imagen: null,

    })
  
    // ONCHANGE

    const cambiarFormPut = e =>
    {

		if($("#editarImagen").val()){


			let imagen = $("#editarImagen").get(0).files[0];
			
			if(imagen["type"] !== "image/jpeg" && imagen["type"] !== "image/png"){
				$("#imagen").val("");

				Swal.fire({

                type: "error",
                title: "La imagen debe estar en formato JPG o PNG!",
                showConfirmButton: true,
                confirmButtonText: "Cerrar"
                
                })

                $(".previsualizarImg").attr("src", "");
                $("#editarImagen").val("");
				return;
			}else if(imagen["size"] > 10000000){
				$("#imagen").val("");
				 Swal.fire({

                type: "error",
                title: "La imagen debe pesar como maximo 10mb",
                showConfirmButton: true,
                confirmButtonText: "Cerrar"
                
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

					editarImg({

                        'imagen': imagen,
                        'titulo': $("#editarTitulo").val(),
                        'descripcion': $("#editarDescripcion").val(),
						'id' : $("#editarID").val()

					})
				})
			}
		}else{

			editarImg({

                'imagen': null,
                'titulo': $("#editarTitulo").val(),
                'descripcion': $("#editarDescripcion").val(),
                'id' : $("#editarID").val()

					})

		}	
    }
    	// ONSUBMIT

	const submitPut = async e => {

		$('.alert').remove();
		e.preventDefault();
		const { titulo, descripcion} = imgP;

       
        if (titulo === "")
        {
            $(".invalid-titulo").show();
            $(".invalid-titulo").html("El titulo no puede ir vacio");
            return
        } 
        if (descripcion === "")
        {
            $(".invalid-descripcion").show();
            $(".invalid-descripcion").html("La descripcion no puede ir vacia");
            return
        } 
     
		// SE EJECUTA SERVICIO PUT

		const result = await putData(imgP); 
		

		if(result.status === 400){

			Swal.fire({

		      type: "error",
		      title: result.mensaje,
		      showConfirmButton: true,
		      confirmButtonText: "Cerrar"
            
			}).then(function(result){
				if(result.value){
					window.location.href = `${process.env.PUBLIC_URL}/planes_slide`;
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
					window.location.href = `${process.env.PUBLIC_URL}/planes_slide`;
				}
			})
		}

	}


    //CAPTURAR DATOS PARA EDITAR

	$(document).on("click", ".editarInputs", function(e){
		e.preventDefault();
       
        let data = $(this).attr("data").split('_,');


        // recuperamos os datos

		$("#editarID").val(data[0]);
        $(".previsualizarImg").attr("src", `${rutaAPI}/mostrar-principal-img-planes/${ data[1] }`);
        $("#editarTitulo").val(data[2]);
		$("#editarDescripcion").val(data[3]);

		editarImg({

			'imagen': null,
			'titulo': data[2],
			'descripcion': data[3],
			'id' : data[0]

		})
	})


    	// RETORNO DE LA VISTA

		return(
		<div className="modal fade" id="editarImgSlide">

			<div className="modal-dialog">

				<div className="modal-content">

					<div className="modal-header">
						<h4 className="modal-title">Editar Imagen Principal Inicio</h4>
						<button type="button" className="close" data-dismiss="modal">x</button>
					</div>

					<form onChange={cambiarFormPut}   onSubmit={submitPut}   encType="multipart/form-data">

						<div className="modal-body">

							<input type="hidden" id="editarID"/>

							{/* ENTRADA IMAGEN*/}

							<label className="small text-secondary" htmlFor="editarImagen">*Peso Max. 10MB | Formato: JPG o PNG</label>
							<input id="editarImagen" type="file" className="form-control-file border" name="imagen" />
							<div className="invalidad-feedback invalid-imagen"></div>
							<img className="previsualizarImg img-fluid" alt="img-cargar"/>

							{/* ENTRADA TITULO*/}

							<div className="form-group">

								<div className="input-group mb-3 mt-3">
									<div className="input-group-append input-group-text">
										<i className="fas fa-heading"></i>
									</div>

									<input id="editarTitulo" type="text" className="form-control" name="titulo" placeholder="Ingrese el titulo" required />

									<div className="invalid-feedback invalid-titulo"></div>
								</div>
							</div>

							{/* ENTRADA DESCRIPCION*/}

							<div className="form-group">

								<div className="input-group mb-3">
									<div className="input-group-append input-group-text">
										<i className="fas fa-file-alt"></i>
									</div>

									<textarea id="editarDescripcion" type="text" className="form-control" name="descripcion" placeholder="Ingrese la descripcion" required /* pattern="([0-9a-zA-Z]).{1,30}" */ />

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

	const url = `${rutaAPI}/editar-principal-img-planes-data/${data.id}`;
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

