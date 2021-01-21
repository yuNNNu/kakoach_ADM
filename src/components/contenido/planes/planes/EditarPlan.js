import React, {useState, useEffect} from 'react';
import $ from 'jquery';
import notie from 'notie';
import Swal from 'sweetalert2'
import {rutaAPI} from '../../../../config/Config';
import IconButton from '@material-ui/core/IconButton';
import RemoveIcon from '@material-ui/icons/Remove';
import AddIcon from '@material-ui/icons/Add';
import Pros from './Pros';

import axios from 'axios';

export default function EditarPlan()
{
    /*=============================================
	Hook para capturar datos
	=============================================*/
	const [plan, editarPlan ] = useState({

		id: "",
		pros: [],
        imagen: null,
        type: "",
		nombre: "",
		descripcion: "",
		precio: 0,
        nivel:"",
		pdf: null

	})

	const [pros, setPro] = useState([
        {pro: ''}
    ])
    /*=============================================
	OnChange
	=============================================*/

	const cambiaFormPut = e =>
    {
		let type, nivel;
		let arrPros = [];
        let prosObject = [...pros]
			prosObject.map(x => {
            arrPros.push(Object.values(x));
        })


	
        //    TIPO
            if ($('#vol').prop('checked'))
            {
                type="vol"
               
            } else
            {
                type = "def"
               
            }
        // NIVELES
            if ($('#b').prop('checked'))
            {
                nivel = "basico";
            } else if ($('#i').prop('checked'))
            {
                nivel = "intermedio";
            } else
            {
                nivel = "avanzado";
            }
      
       
        
       let pdf = "";
		let imagen = "";
		// si carga img
		if ($("#editarImagen").val())
		{
			let imagen = $("#editarImagen").get(0).files[0];
			// validaciones imagen
			if(imagen["type"] !== "image/jpeg" && imagen["type"] !== "image/png"){
				$("#imagen").val("");

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
				$("#imagen").val("");
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

					editarPlan({

                        'id' : $("#editarID").val(),
                        'nombre' : $("#editarNombre").val(),
                        'descripcion' :  $("#editarDescripcion").val(),
                        'precio' :   $("#editarPrecio").val(),
                        'pros' : arrPros,
                        'pdf' : pdf,
                        'imagen': imagen,
                        'type':type,
                        'nivel':nivel
                    
					})
				})
			}
			
		} else
		{
			editarPlan({

				'id' : $("#editarID").val(),
                'nombre' : $("#editarNombre").val(),
                'descripcion' :  $("#editarDescripcion").val(),
                'precio' :   $("#editarPrecio").val(),
                'pros' : arrPros,
                'pdf' : pdf,
                'imagen': imagen,
                'type':type,
                'nivel':nivel

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
			if (pdf["size"] > 4000000)
			{
				
				notie.alert({
					type: 3,
					text: 'ERROR: La pdf debe pesar como maximo 4mb',
					time: 7
				})
				$("#editarPdf").get(0).value= "";
				return;
			}
			editarPlan({

				'id' : $("#editarID").val(),
                'nombre' : $("#editarNombre").val(),
                'descripcion' :  $("#editarDescripcion").val(),
                'precio' :   $("#editarPrecio").val(),
                'pros' : arrPros,
                'pdf' : pdf,
                'imagen': imagen,
                'type':type,
                'nivel':nivel

			})
		} else
		{
			editarPlan({

				'id' : $("#editarID").val(),
                'nombre' : $("#editarNombre").val(),
                'descripcion' :  $("#editarDescripcion").val(),
                'precio' :   $("#editarPrecio").val(),
                'pros' : arrPros,
                'pdf' : null,
                'imagen': imagen,
                'type':type,
                'nivel':nivel

			})
		}
		
		
		editarPlan({

			'id' : $("#editarID").val(),
			'nombre' : $("#editarNombre").val(),
			'descripcion' :  $("#editarDescripcion").val(),
			'precio' :   $("#editarPrecio").val(),
			'pros' : arrPros,
			'pdf' : pdf,
            'imagen': imagen,
            'type':type,
            'nivel':nivel
		})
		

    }
  /*=============================================
	OnSubmit
	=============================================*/

	const submitPut = async e => {

      
		$('.alert').remove();

		e.preventDefault();		

		const {nombre, descripcion, precio, pros} = plan;
        // validaciones imagen
            // VALIDANDO TIPO
        if (!$('#vol').prop('checked') && !$('#def').prop('checked'))
        {
            $(".invalid-tipo").show();
            $(".invalid-tipo").html("Debe seleccionar un tipo de plan");
            return;
        } 

        // VALIDANDO NIVEL
        if (!$('#b').prop('checked') && !$('#i').prop('checked') && !$('#a').prop('checked')  )
        {
            $(".invalid-nivel").show();
            $(".invalid-nivel").html("Debe seleccionar un nivel del plan");
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

        if(!Number(precio)){

			$(".invalid-precio").show();
			$(".invalid-precio").html("Debe ser numerico");
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

		const result = await putData(plan);

		if(result.status === 400){

			Swal.fire({

		      type: "error",
		      title: result.mensaje,
		      showConfirmButton: true,
		      confirmButtonText: "Cerrar"
            
			}).then(function(result){
				if(result.value){
					window.location.href = "/planes";
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
					window.location.href = "/planes";
				}
			})
		}

	}
    /*=============================================
	CAPTURAMOS DATOS PARA EDITAR
	=============================================*/

	let planId = "5ffbeb74ba17e84374ee8ac5";

	$(document).on("click", ".editarInputs", function(e){

		e.preventDefault();

		let data = $(this).attr("data").split('_,');
    	$("#editarID").val(data[0]);
        $(".previsualizarImg").attr("src", `${rutaAPI}/show-plan/${ data[1] }`);
		$("#editarNombre").val(data[4]);
		$("#editarDescripcion").val(data[5]);
        $("#editarPrecio").val(data[6]);
        // TIPO
        let type = data[3];
        switch (type)
        {
            case 'def':
                $("#def").prop('checked', true);
                break;
            case 'vol':
                $("#vol").prop('checked', true)
				break;
			default:
				$("#def").prop('checked', true);
        }
        // NIVEL
        let nivel = data[7];
        switch (nivel)
        {
            case 'basico':
                $("#b").prop('checked', true);
                break;
            case 'intermedio':
                $("#i").prop('checked', true)
                break;
            case 'avanzado':
                $("#a").prop('checked', true)
				break;
			default:
				$("#b").prop('checked', true);
        }
       
		editarPlan({

			'id' : data[0],
            'pros': null,
            'type': data[3],
			'nombre' : data[4],
			'descripcion' :  data[5],
            'precio': data[6],
            'nivel': data[7],
			'pdf' : null,
			'imagen' : null,
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

			  	const borrarPlan = async () => {

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
								window.location.href = "/planes";
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
								window.location.href = "/planes";
							}
						})
					}

				}

				borrarPlan();

			    
			  }
			})


	})

	const handleChangePro = (index, event) => {
        const values = [...pros];
        values[index][event.target.name] = event.target.value;
        setPro(values);
    }

    const handleAddPro = () => {
        setPro([...pros, {pro: ''}])
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

		<div className="modal" id="editarPlan">
		  <div className="modal-dialog">
		    <div className="modal-content">

		      <div className="modal-header">
		        <h4 className="modal-title">Editar Plan</h4>
		        <button type="button" className="close" data-dismiss="modal">&times;</button>
		      </div>

		      <form  onChange={cambiaFormPut}  onSubmit={submitPut}> 

                <div className="modal-body">

                <input type="hidden" id="editarID"/>

                {/* ENTRADA IMAGEN*/}

                <label className="small text-secondary" htmlFor="editarImagen">
                Imagen de Plan |
                *Peso Max. 2MB | Formato: JPG o PNG</label>
                <input id="editarImagen" type="file" className="form-control-file border" name="imagen" />
                <div className="invalid-feedback invalid-imagen"></div>
                <img className="previsualizarImg img-fluid" alt="img-cargar" />
                            
                {/* filtro tipo */}
                            
                <div className="form-group">

                <label className="small text-secondary mt-3" >*Plan de Volumen o Definicion</label>

                <div className="input-group mb-3">

                    

                    <div className="form-check m-2">
                        <input className="form-check-input" type="radio" name="filtroTipo" id="vol" value="option1" />
                        <label className="form-check-label" htmlFor="vol">
                            Volumen
                        </label>
                    </div>
                    <div className="form-check m-2">
                        <input className="form-check-input" type="radio" name="filtroTipo" id="def" value="option1" />
                        <label className="form-check-label" htmlFor="def">
                            Definicion
                        </label>
                    </div>                                  
                    

                    <div className="invalid-feedback invalid-nombre"></div>

                </div>	

                </div>
                {/* filtro nivel */}
                            
                <div className="form-group">

                <label className="small text-secondary" >*Nivel Basico, Intermedio o Avanzado</label>

                <div className="input-group mb-3">

                    

                    <div class="form-check m-2">
                        <input class="form-check-input" type="radio" name="filtroNivel" id="b" value="option1" />
                        <label class="form-check-label" htmlFor="b">
                            Basico
                        </label>
                    </div>
                    <div class="form-check m-2">
                        <input class="form-check-input" type="radio" name="filtroNivel" id="i" value="option1" />
                        <label class="form-check-label" htmlFor="i">
                            Intermedio
                        </label>
                    </div>      
                    <div class="form-check m-2">
                        <input class="form-check-input" type="radio" name="filtroNivel" id="a" value="option1" />
                        <label class="form-check-label" htmlFor="a">
                            Avanzado
                        </label>
                    </div>                              
                    

                    <div className="invalid-feedback invalid-nombre"></div>

                </div>	

                </div>


                {/* ENTRADA nombre */}

                <div className="form-group">

                    <div className="input-group mb-3 mt-3">

                        <div className="input-group-append input-group-text">
                            <i className="fas fa-user"></i>
                        </div>

                        <input 
                            id="editarNombre"
                            type="text"
                            className="form-control"
                            name="nombre"
                            placeholder="Ingrese el nombre*"
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

                {/* ENTRADA precio */}

                <div className="form-group">

                    <div className="input-group mb-3">

                        <div className="input-group-append input-group-text">
                            <i className="fas fa-key"></i>
                        </div>

                        <input 
                            id="editarPrecio"
                            type="text"
                            className="form-control"
                            name="precio"
                            placeholder="Ingrese el precio*"

                        />

                        <div className="invalid-feedback invalid-precio"></div>

                    </div>	

                </div>

                {/* ENTRADA PROS */}

                <Pros planid={planId}/>

                {/* ENTRADA PDF*/}

                <div className="form-group">
                    <label className="small text-secondary" htmlFor="editarPdf">Plan | *Peso Max. 2MB | Formato: PDF</label>
                    <input id="editarPdf" type="file" className="form-control-file border" name="pdf" />
                    <div className="invalid-feedback invalid-pdf"></div>
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

	const url = `${rutaAPI}/update-plan/${data.id}`;
	const token = localStorage.getItem("ACCESS_TOKEN");

	let formData = new FormData();
	formData.append("nombre", data.nombre);
	formData.append("descripcion", data.descripcion);
	formData.append("precio", data.precio);
	formData.append("pros", data.pros);
	formData.append("pdf", data.pdf);
    formData.append("imagen", data.imagen);
    formData.append("type", data.type);
	formData.append("nivel", data.nivel);

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
PETICIÓN DELETE PLAN
=============================================*/

const deleteData = data =>{

	const url = `${rutaAPI}/delete-plan/${data}`;
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