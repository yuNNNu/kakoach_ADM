import React, {useState} from 'react';
import $, { type } from 'jquery';
import notie from 'notie';
import Swal from 'sweetalert2'
import {rutaAPI} from '../../../../config/Config';

export default function CrearPlan()
{ 
    /*=============================================
	Hook para capturar datos
	=============================================*/

	const [plan, crearPlan ] = useState({

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
    /*=============================================
	OnChange
	=============================================*/

	const cambiaFormPut = e =>
    {
     
        
        let type, nivel;
        //    TIPO
            if ($('#crearvol').prop('checked'))
            {
                type="vol"
               
            } else
            {
                type = "def"
               
            }
        // NIVELES
            if ($('#crearb').prop('checked'))
            {
                nivel = "basico";
            } else if ($('#creari').prop('checked'))
            {
                nivel = "intermedio";
            } else
            {
                nivel = "avanzado";
            }
      
       
        
       let pdf = "";
		let imagen = "";
		// si carga img
		if ($("#crearImagen").get(0).files[0])
		{
			let imagen = $("#crearImagen").get(0).files[0];
			// validaciones imagen
			if(imagen["type"] !== "image/jpeg" && imagen["type"] !== "image/png"){
				$("#imagen").val("");

				notie.alert({
					type: 3,
					text: 'ERROR: La imagen debe estar en formato JPG o PNG!',
					time: 4
				})

				$(".previsualizarImg").attr("src", "");
				
				return;
			}else if (imagen["size"] > 2000000)
			{
				$("#imagen").val("");
				notie.alert({
					type: 3,
					text: 'ERROR: La imagen debe pesar como maximo 2mb',
					time: 4
				})
				$(".previsualizarImg").attr("src", "");
				return;
			} else
			{
				let datosArchivo = new FileReader;
				datosArchivo.readAsDataURL(imagen);
				$(datosArchivo).on("load", function (event)
				{
					let rutaArchivo = event.target.result;
					
					$(".previsualizarImg").attr("src", rutaArchivo);

					crearPlan({

                        'id' : $("#editarID").val(),
                        'nombre' : $("#crearNombre").val(),
                        'descripcion' :  $("#crearDescripcion").val(),
                        'precio' :   $("#crearPrecio").val(),
                        'pros' : $("#crearPros").val(),
                        'pdf' : pdf,
                        'imagen': imagen,
                        'type':type,
                        'nivel':nivel
                    
					})
				})
			}
			
		} else
		{
            $(".invalid-imagen").show();
			$(".invalid-imagen").html("Completa este campo");
			return;
		}
        // si carga pdf
        if ($("#crearPdf").get(0).files[0]) {
        pdf = $("#crearPdf").get(0).files[0];
        // validaciones imagen
        if (pdf["type"] !== "application/pdf") {
            notie.alert({
            type: 3,
            text: "ERROR: La archivo debe ser pdf",
            time: 4,
            });

            return;
        }else if (pdf["size"] > 2000000) {
            notie.alert({
            type: 3,
            text: "ERROR: La pdf debe pesar como maximo 2mb",
            time: 4,
            });

            return;
        } else
        {
            crearPlan({
                id: $("#editarID").val(),
                nombre: $("#crearNombre").val(),
                descripcion: $("#crearDescripcion").val(),
                precio: $("#crearPrecio").val(),
                pros: $("#crearPros").val(),
                pdf: pdf,
                imagen: imagen,
                type: type,
                nivel: nivel,
            });
        }
        
        } else {
        $(".invalid-pdf").show();
        $(".invalid-pdf").html("Completa este campo");
        return;
        }

		
		
		crearPlan({

			'id' : $("#editarID").val(),
			'nombre' : $("#crearNombre").val(),
			'descripcion' :  $("#crearDescripcion").val(),
			'precio' :   $("#crearPrecio").val(),
			'pros' : $("#crearPros").val(),
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

		const {id, nombre, descripcion, precio, pros, pdf, imagen} = plan;
    
        // VALIDANDO TIPO
        if (!$('#crearvol').prop('checked') && !$('#creardef').prop('checked'))
        {
            $(".invalid-tipo").show();
            $(".invalid-tipo").html("Debe seleccionar un tipo de plan");
            return;
        } 

        // VALIDANDO NIVEL
        if (!$('#crearb').prop('checked') && !$('#creari').prop('checked') && !$('#creara').prop('checked')  )
        {
            $(".invalid-nivel").show();
            $(".invalid-nivel").html("Debe seleccionar un nivel del plan");
            return;
        } 
        
		/*=============================================
		Validamos que el campo user no venga vacío
		=============================================*/

		

		if(!Number(precio)){

			$(".invalid-precio").show();
			$(".invalid-precio").html("Debe ser numerico");
			return;

		}

	



		/*=============================================
		EJECTUAMOS SERVICIO PUT
		=============================================*/

		const result = await postData(plan);

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
	=       Retornamos vista del componente       =
	=============================================*/
	return(

		<div className="modal" id="crearPlan">
		  <div className="modal-dialog">
		    <div className="modal-content">

		      <div className="modal-header">
		        <h4 className="modal-title">Editar Plan Personal</h4>
		        <button type="button" className="close" data-dismiss="modal">&times;</button>
		      </div>

		      <form onChange={cambiaFormPut}   onSubmit={submitPut}> 

                <div className="modal-body">

                

                {/* ENTRADA IMAGEN*/}

                <label className="small text-secondary" htmlFor="crearImagen">
                IMAGEN de Plan personal |
                *Peso Max. 2MB | Formato: JPG o PNG</label>
                <input id="crearImagen" type="file" className="form-control-file border" name="imagen" required/>
                <div className="invalidad-feedback invalid-imagen"></div>
                <img className="previsualizarImg img-fluid" />
                            
                {/* filtro tipo */}
                            
                <div className="form-group">

                <label className="small text-secondary" >*Plan de Volumen o Definicion</label>

                <div className="input-group mb-3">

                    

                    <div className="form-check m-2">
                        <input className="form-check-input" type="radio" name="filtroTipo" id="crearvol" value="option1" />
                        <label className="form-check-label" htmlFor="crearvol">
                            Volumen
                        </label>
                    </div>
                    <div className="form-check m-2">
                        <input className="form-check-input" type="radio" name="filtroTipo" id="creardef" value="option1" />
                        <label className="form-check-label" htmlFor="creardef">
                            Definicion
                        </label>
                    </div>                                  
                    

                    <div className="invalid-feedback invalid-tipo"></div>

                </div>	

                </div>
                {/* filtro nivel */}
                            
                <div className="form-group">

                <label className="small text-secondary" >*Nivel Basico, Intermedio o Avanzado</label>

                <div className="input-group mb-3">

                    

                    <div class="form-check m-2">
                        <input class="form-check-input" type="radio" name="filtroNivel" id="crearb" value="option1" />
                        <label class="form-check-label" htmlFor="crearb">
                            Basico
                        </label>
                    </div>
                    <div class="form-check m-2">
                        <input class="form-check-input" type="radio" name="filtroNivel" id="creari" value="option1" />
                        <label class="form-check-label" htmlFor="creari">
                            Intermedio
                        </label>
                    </div>      
                    <div class="form-check m-2">
                        <input class="form-check-input" type="radio" name="filtroNivel" id="creara" value="option1" />
                        <label class="form-check-label" htmlFor="creara">
                            Avanzado
                        </label>
                    </div>                              
                    

                    <div className="invalid-feedback invalid-nivel"></div>

                </div>	

                </div>


                {/* ENTRADA nombre */}

                <div className="form-group">

                    <label className="small text-secondary" htmlFor="crearNombre">*Nombre plan</label>

                    <div className="input-group mb-3">

                        <div className="input-group-append input-group-text">
                            <i className="fas fa-user"></i>
                        </div>

                        <input 
                            id="crearNombre"
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

                    <label className="small text-secondary" htmlFor="crearDescripcion">*Descripcion Plan</label>

                    <div className="input-group mb-3">

                        <div className="input-group-append input-group-text">
                            <i className="fas fa-key"></i>
                        </div>

                        <input 
                            id="crearDescripcion"
                            type="text"
                            className="form-control"
                            name="descripcion"
                            placeholder="Ingrese la descripción*"
                            required
                        />

                        <div className="invalid-feedback invalid-descripcion"></div>

                    </div>	

                </div>

                {/* ENTRADA precio */}

                <div className="form-group">

                    <label className="small text-secondary" htmlFor="crearPrecio">*Precio Plan</label>

                    <div className="input-group mb-3">

                        <div className="input-group-append input-group-text">
                            <i className="fas fa-key"></i>
                        </div>

                        <input 
                            id="crearPrecio"
                            type="text"
                            className="form-control"
                            name="precio"
                            placeholder="Ingrese el precio*"
                            required
                        />

                        <div className="invalid-feedback invalid-precio"></div>

                    </div>	

                </div>

                {/* ENTRADA PROS */}

                <div className="form-group">
                        <label className="small text-secondary" htmlFor="crearPros">* Pros del plan, deben separarse por "," para generar el salto de linea.</label>

                    <div className="input-group mb-3">
                        <div className="input-group-append input-group-text">
                            <i className="fas fa-file-alt"></i>
                        </div>

                        <textarea className="form-control" rows="5" id="crearPros" name="pros" placeholder="Ingrese los pros" pattern="([0-9a-zA-Z]).{1,30}" required></textarea>

                        <div className="invalid-feedback invalid-pros"></div>
                    </div>
                </div>

                {/* ENTRADA PDF*/}

                <div className="form-group">
                    <label className="small text-secondary" htmlFor="crearPdf">PDF Plan personal | *Peso Max. 2MB | Formato: JPG o PNG</label>
                    <input id="crearPdf" type="file" className="form-control-file border" name="pdf" required/>
                    <div className="invalidad-feedback invalid-pdf"></div>
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
    =       Peticion POST para SLIDE    =
    =============================================*/

    const postData = data => {

        const url = `${rutaAPI}/new-plan`;
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