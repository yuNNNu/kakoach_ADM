import React, {useState} from 'react';
import $ from 'jquery';
import notie from 'notie';
import Swal from 'sweetalert2'
import {rutaAPI} from '../../../../config/Config';
import IconButton from '@material-ui/core/IconButton';
import RemoveIcon from '@material-ui/icons/Remove';
import AddIcon from '@material-ui/icons/Add';


export default function EditarBorrarAdministradores(){


	/*=============================================
	Hook para capturar datos
	=============================================*/

	const [planpersonal, editarPlanPersonal ] = useState({

		id: "",
		nombre: "",
		descripcion: "",
		precio: 0,
		pross: [],
		pdf: null,
		imagen: null

	})

	const [pros, setPro] = useState([])

	/*=============================================
	OnChange
	=============================================*/

	const cambiaFormPut = e =>
	{
		let arrPros = [];
		let arrProsfill = [...pros];

		arrProsfill.forEach(x => {
			let value = x + "_"
			arrPros.push(value)

		})

		

		let pdf = "";
		let imagen = "";
      
		// si carga img
		if ($("#editarImagen").val())
		{
			 imagen = $("#editarImagen").get(0).files[0];
			// validaciones imagen
			if(imagen["type"] !== "image/jpeg" && imagen["type"] !== "image/png"){
				

				notie.alert({
					type: 3,
					text: 'ERROR: La imagen debe estar en formato JPG o PNG!',
					time: 7
				})

				$(".previsualizarImg").attr("src", "");
				$("#editarImagen").get(0).value= "";
				
				return;
			}else if (imagen["size"] > 2000000)
			{
				
				notie.alert({
					type: 3,
					text: 'ERROR: La imagen debe pesar como maximo 2mb',
					time: 7
				})
				$(".previsualizarImg").attr("src", "");
				$("#editarImagen").get(0).value= "";
				return;
			} else
			{
				let datosArchivo = new FileReader();
                 datosArchivo.readAsDataURL(imagen);
				$(datosArchivo).on("load", function (event)
				{
					let rutaArchivo = event.target.result;
					
					$(".previsualizarImg").attr("src", rutaArchivo);

					editarPlanPersonal({

						'id': $("#editarID").val(),
						'nombre': $("#editarNombre").val(),
						'descripcion': $("#editarDescripcion").val(),
						'precio': $("#editarPrecio").val(),
						'pross' : arrPros,
						'pdf': pdf,
						'imagen': imagen
					
					})
				})
			}
			
		} else
		{
			editarPlanPersonal({

				'id' : $("#editarID").val(),
				'nombre' : $("#editarNombre").val(),
				'descripcion' :  $("#editarDescripcion").val(),
				'precio' :   $("#editarPrecio").val(),
				'pross' : arrPros,
				'pdf' : pdf,
				'imagen' : null

			})
		}
		// si carga pdf
		if ($("#editarPdf").val())
		{
			 pdf = $("#editarPdf").get(0).files[0];
			// validaciones imagen
			if(pdf["type"] !== "application/pdf" ){
			

				notie.alert({
					type: 3,
					text: 'ERROR: La archivo debe ser pdf',
					time: 7
				})
				
				
				$("#editarPdf").get(0).value= "";
				return;
			}
			if (pdf["size"] > 2000000)
			{
				
				notie.alert({
					type: 3,
					text: 'ERROR: La pdf debe pesar como maximo 2mb',
					time: 7
				})
				$("#editarPdf").get(0).value= "";
				return;
			}
			editarPlanPersonal({

				'id' : $("#editarID").val(),
				'nombre' : $("#editarNombre").val(),
				'descripcion' :  $("#editarDescripcion").val(),
				'precio' :   $("#editarPrecio").val(),
				'pross' : arrPros,
				'pdf' : pdf,
				'imagen' : imagen

			})
		} else
		{
			editarPlanPersonal({

				'id' : $("#editarID").val(),
				'nombre' : $("#editarNombre").val(),
				'descripcion' :  $("#editarDescripcion").val(),
				'precio' :   $("#editarPrecio").val(),
				'pross' : arrPros,
				'pdf' : null,
				'imagen' : imagen

			})
		}
		
		
		editarPlanPersonal({

			'id' : $("#editarID").val(),
			'nombre' : $("#editarNombre").val(),
			'descripcion' :  $("#editarDescripcion").val(),
			'precio' :   $("#editarPrecio").val(),
			'pross' : arrPros,
			'pdf' : pdf,
			'imagen' : imagen
		})
		

	}

	/*=============================================
	OnSubmit
	=============================================*/

	const submitPut = async e => {

		$('.alert').remove();

		e.preventDefault();		

		const { nombre, descripcion, precio, pross } = planpersonal;
		if (pross.length === 0 )
        {
            $(".invalid-pros").show();
            $(".invalid-pros").html("Completa este campo, mínimo un pro");
            return
        } else
        {
            $(".invalid-pros").hide();
		}
		
		var prosEmpty=false;
        pross.forEach((pro) =>
            
        {
            let val = pro;
            if (val === "_")
            {
                prosEmpty = true
            }    
        })

        if (prosEmpty)
        {
            $(".invalid-pros").show();
            $(".invalid-pros").html("Completa este campo, pro no puede ir vacío");
            return
        } 



		if(!Number(precio)){

			$(".invalid-precio").show();
			$(".invalid-precio").html("Este es un campo numérico");
			return;

		}
		/*=============================================
		Validamos que el campo user no venga vacío
		=============================================*/

		if(nombre === ""){

			$(".invalid-nombre").show();
			$(".invalid-nombre").html("Completa este campo");
			return;
		}

		/*=============================================
		Validamos Expresión regular
		=============================================*/
		if(descripcion === ""){

			
			$(".invalid-descripcion").show();
			$(".invalid-descripcion").html("Completa este campo");
			return;
		}


		if(precio === ""){

			$(".invalid-precio").show();
			$(".invalid-precio").html("Completa este campo");
			return;

		}

		if(pros === ""){

			$(".invalid-pros").show();
			$(".invalid-pros").html("Completa este campo");
			return;
		}



		/*=============================================
		EJECTUAMOS SERVICIO PUT
		=============================================*/

		const result = await putData(planpersonal);

		if(result.status === 400){

			Swal.fire({

		      type: "error",
		      title: result.mensaje,
		      showConfirmButton: true,
		      confirmButtonText: "Cerrar"
            
			}).then(function(result){
				if(result.value){
					window.location.href = "/inicio_plan_personal";
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
					window.location.href = "/inicio_plan_personal";
				}
			})
		}

	}

	/*=============================================
	CAPTURAMOS DATOS PARA EDITAR
	=============================================*/

	$(document).on("click", ".editarInputs", function(e){

		e.preventDefault();

		let data = $(this).attr("data").split('_,');
	
		fetch(`${rutaAPI}/show-personal-plan`)
    	.then(response => response.json())
    	.then(json => {
    		let proArray = json.data[0].pros;
    		setPro(proArray);
    	})
    	.catch(err => {
    		console.log(err);
    	}) 

		$("#editarID").val(data[0]);
		$("#editarNombre").val(data[2]);
		$("#editarDescripcion").val(data[3]);
	 	$("#editarPrecio").val(data[4]);
		$("#editarPros").val(data[5]);
		$(".previsualizarImg").attr("src", `${rutaAPI}/show-personal-plan-img/${ data[1] }`);
		// editarImagen

		editarPlanPersonal({

			'id' : data[0],
			'nombre' : data[2],
			'descripcion' :  data[3],
			'precio' :   data[4],
			'pros' : null,
			'pdf' : null,
			'imagen' : null,
		})


	})		

	const handleChangePro = (index, event) => {
		let arrPros = [...pros];
		arrPros[index] = event.target.value;
		setPro(arrPros);

    }

    const handleAddPro = () => {
        setPro([...pros, []])
    }

    const handleRemovePro = () => {
        const values = [...pros];
        let index = values.length-1;
        values.splice(index, 1);
        setPro(values);
    }

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

		      <form onSubmit={submitPut} onChange={cambiaFormPut}> 

			      <div className="modal-body">

			      	<input type="hidden" id="editarID"/>

			      	{/* ENTRADA IMAGEN*/}

					<label className="small text-secondary" htmlFor="editarImagen">
					Imagen de Plan personal |
					*Peso Max. 2MB | Formato: JPG o PNG</label>
					<input id="editarImagen" type="file" className="form-control-file border" name="imagen" />
					<div className="invalidad-feedback invalid-imagen"></div>
					<img className="previsualizarImg img-fluid" alt="img-carga"/>

					{/* ENTRADA nombre */}

			      	<div className="form-group">

			      		<div className="input-group mb-3 mt-3">

			      			<div className="input-group-append input-group-text">
			      				<i className="fas fa-heading"></i>
			      			</div>

			      			<input 
			      				id="editarNombre"
			      				type="text"
			      				className="form-control"
			      				name="nombre"
			      				placeholder="Ingrese el nombre"
			      				maxLength="40"
			      				required

			      			/>

			      			<div className="invalid-feedback invalid-nombre"></div>

			      		</div>	

			      	</div>

			        {/* ENTRADA DESCRIPCION */}

			      	<div className="form-group">

			      		<div className="input-group mb-3">

			      			<div className="input-group-append input-group-text">
			      				<i className="fas fa-file-alt"></i>
			      			</div>

			      			<input 
			      				id="editarDescripcion"
			      				type="text"
			      				className="form-control"
			      				name="descripcion"
			      				placeholder="Ingrese la descripción"
			      				required

			      			/>

			      			<div className="invalid-feedback invalid-descripcion"></div>

			      		</div>	

			      	</div>

			      	 {/* ENTRADA precio */}

			      	<div className="form-group">

			      		<div className="input-group mb-3">

			      			<div className="input-group-append input-group-text">
			      				<i class="fas fa-money-bill"></i>
			      			</div>

			      			<input 
			      				id="editarPrecio"
			      				type="text"
			      				className="form-control"
			      				name="precio"
			      				placeholder="Ingrese el precio"
			      				required
			      			/>

			      			<div className="invalid-feedback invalid-precio"></div>

			      		</div>	

			      	</div>

			      	   {/* ENTRADA PROS */}

                   <div className="form-group">

	                {
	                    pros.map((pro,index) => (
	                        <div key={index} className="mb-3 input-group"> 
	                            <div className="input-group-append input-group-text">
	                                <i class="fas fa-list"></i>
	                            </div>
	                            <input value={pro} id="createPro" onChange={event => handleChangePro(index, event)} type="text" className="form-control" name="pro" placeholder="Ingresar pro*"/>

	                        </div>
	                    ))
	                }

	                <div className="invalid-feedback invalid-pros"></div>


		            <div className="row">
			                <div className="col-12 justify-content-center d-flex" >
			                    <IconButton className="mb-1 justify-content-center" onClick={() => handleRemovePro()}> 
			                        <RemoveIcon/>
			                    </IconButton>
			                    <IconButton onClick={() => handleAddPro()}>
			                        <AddIcon/>
			                    </IconButton>
			                </div>
			            </div>
			        </div>

					{/* ENTRADA PDF*/}

					<div className="form-group">
						<label className="small text-secondary" htmlFor="editarPdf">Plan personal | *Peso Max. 2MB | Formato: PDF</label>
						<input id="editarPdf" type="file" className="form-control-file border" name="pdf" />
						<div className="invalidad-feedback invalid-pdf"></div>
			   		</div>


			      	<div className="modal-footer d-flex justify-content-between">

				      <div><button type="button" className="btn btn-danger" data-dismiss="modal">Cerrar</button></div>

				      <div><button type="submit" className="btn btn-primary" onClick={cambiaFormPut}>Enviar</button></div>        
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
	formData.append("nombre", data.nombre);
	formData.append("descripcion", data.descripcion);
	formData.append("precio", data.precio);
	formData.append("pros", data.pross);
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