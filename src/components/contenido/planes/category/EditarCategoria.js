import React, {useState} from 'react'
import $ from 'jquery';
import {rutaAPI} from '../../../../config/Config';
import notie from 'notie';
import Swal from 'sweetalert2'

export default function EditarCategoria()
{ 
   // HOOK

	const [category, editarCategoria] = useState({

		
        id: "",
        nombre: "",
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

					editarCategoria({

                        'imagen': imagen,
                        'nombre': $("#editarnombre").val(),
                        'descripcion': $("#editarDescripcion").val(),
						'id' : $("#editarID").val()

					})
				})
			}
		}else{

			editarCategoria({

                'imagen': null,
                'nombre': $("#editarnombre").val(),
                'descripcion': $("#editarDescripcion").val(),
                'id' : $("#editarID").val()

					})

		}	
	}
	// ONSUBMIT

	const submitPut = async e => {

		$('.alert').remove();
		e.preventDefault();
		const {nombre, descripcion} = category;

        if (nombre === "")
        {
            $(".invalid-nombre").show();
            $(".invalid-nombre").html("El nombre no puede ir vacio");
            return
        } 
        if (descripcion === "")
        {
            $(".invalid-descripcion").show();
            $(".invalid-descripcion").html("La descripcion no puede ir vacia");
            return
        } 
     
		// SE EJECUTA SERVICIO PUT

		const result = await putData(category); 
		

		if(result.status === 400){

			Swal.fire({

		      type: "error",
		      title: result.mensaje,
		      showConfirmButton: true,
		      confirmButtonText: "Cerrar"
            
			}).then(function(result){
				if(result.value){
					window.location.href = "/planes_categoria";
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
					window.location.href = "/planes_categoria";
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
        $(".previsualizarImg").attr("src", `${rutaAPI}/show-img-category/${ data[1] }`);
        $("#editarnombre").val(data[2]);
		$("#editarDescripcion").val(data[3]);

		editarCategoria({

			'imagen': null,
			'nombre': data[2],
			'descripcion': data[3],
			'id' : data[0]

		})
	})

	// RETORNO DE LA VISTA
	return(
	<div className="modal fade" id="editarCategoria">

		<div className="modal-dialog">

			<div className="modal-content">

				<div className="modal-header">
					<h4 className="modal-title">Editar Categoria</h4>
					<button type="button" className="close" data-dismiss="modal">x</button>
				</div>

				<form onChange={cambiarFormPut}  onSubmit={submitPut}   encType="multipart/form-data">

					<div className="modal-body">

						<input type="hidden" id="editarID"/>

						{/* ENTRADA IMAGEN*/}

						<label className="small text-secondary" htmlFor="editarImagen">*Peso Max. 2MB | Formato: JPG o PNG</label>
						<input id="editarImagen" type="file" className="form-control-file border" name="imagen" />
						<div className="invalidad-feedback invalid-imagen"></div>
						<img className="previsualizarImg img-fluid" alt="img-carga"/>

						{/* ENTRADA nombre*/}

						<div className="form-group">

							<div className="input-group mb-3 mt-3">
								<div className="input-group-append input-group-text">
									<i className="fas fa-heading"></i>
								</div>

								<input id="editarnombre" type="text" className="form-control" name="nombre" placeholder="Ingrese el nombre" required/>

								<div className="invalid-feedback invalid-nombre"></div>
							</div>
						</div>

						{/* ENTRADA DESCRIPCION*/}

						<div className="form-group">

							<div className="input-group mb-3">
								<div className="input-group-append input-group-text">
									<i className="fas fa-file-alt"></i>
								</div>

								<textarea id="editarDescripcion" type="text" className="form-control" name="descripcion" placeholder="Ingrese la descripcion" required />

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

	const url = `${rutaAPI}/edit-category/${data.id}`;
	const token = localStorage.getItem("ACCESS_TOKEN");

	let formData = new FormData();
	formData.append("imagen", data.imagen);
	formData.append("nombre", data.nombre);
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

