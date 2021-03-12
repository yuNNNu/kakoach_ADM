import React, {useState} from 'react';
import $ from 'jquery';
import Swal from 'sweetalert2'
import {rutaAPI} from '../../../../config/Config';

import IconButton from '@material-ui/core/IconButton';
import RemoveIcon from '@material-ui/icons/Remove';
import AddIcon from '@material-ui/icons/Add';

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

    const [pros, setPro] = useState([])
    /*=============================================
	OnChange
	=============================================*/

	const cambiaFormPut = e =>
    {
     
        
        let type, nivel;
        let arrDes = [];
        let arrProsfill = [...pros];

       arrProsfill.forEach(x => {
            let value = x + "_"
            arrDes.push(value)

        })


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

				Swal.fire({

                type: "error",
                title: "La imagen debe estar en formato JPG o PNG!",
                showConfirmButton: true,
                confirmButtonText: "Cerrar"
                
                })

                

				$(".previsualizarImg").attr("src", "");
                $("#crearImagen").get(0).value= "";
				return;
			}else if (imagen["size"] > 10000000)
			{
				$("#imagen").val("");
				 Swal.fire({

                type: "error",
                title: "El pdf debe pesar como maximo 10mb",
                showConfirmButton: true,
                confirmButtonText: "Cerrar"
                
                })
                $(".previsualizarImg").attr("src", "");
                 $("#crearImagen").get(0).value= "";
				return;
			} else
			{
				let datosArchivo = new FileReader();
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
                        'pros' : arrDes,
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
            
            Swal.fire({

                type: "error",
                title: "El archivo debe ser pdf",
                showConfirmButton: true,
                confirmButtonText: "Cerrar"
                
            })

            $("#crearPdf").get(0).value = "";
            return;
        }else if (pdf["size"] > 10000000) {
           
            Swal.fire({

                type: "error",
                title: "El pdf debe pesar como maximo 10mb",
                showConfirmButton: true,
                confirmButtonText: "Cerrar"
                
            })
            $("#crearPdf").get(0).value = "";
            return;
        } else
        {
            crearPlan({
                id: $("#editarID").val(),
                nombre: $("#crearNombre").val(),
                descripcion: $("#crearDescripcion").val(),
                precio: $("#crearPrecio").val(),
                pros: arrDes,
                pdf: pdf,
                imagen: imagen,
                type: type,
                nivel: nivel,
            });
        }
        
        } else {
        // $(".invalid-pdf").show();
        // $(".invalid-pdf").html("Completa este campo");
        return;
        }

		

		
		crearPlan({

			'id' : $("#editarID").val(),
			'nombre' : $("#crearNombre").val(),
			'descripcion' :  arrDes,
			'precio' :   $("#crearPrecio").val(),
			'pros' : arrDes,
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

		const {precio, pros} = plan;

        if (pros.length === 0 )
        {
            $(".invalid-pros").show();
            $(".invalid-pros").html("Completa este campo, mínimo un pro");
            return
        } else
        {
            $(".invalid-pros").hide();
        }
    
        var prosEmpty=false;
        pros.forEach((pro) =>
            
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
        
        if ($('#crearPro').val() === undefined  )
        {
            $(".invalid-pros").show();
            $(".invalid-pros").html("Debe ingresar al menos un pro al plan");
            return;
        } else
        {
             $(".invalid-pros").hide();
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
					window.location.href = `${process.env.PUBLIC_URL}/planes`;
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
					window.location.href = `${process.env.PUBLIC_URL}/planes`;
				}
			})
		}

	}

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

		<div className="modal" id="crearPlan">
		  <div className="modal-dialog">
		    <div className="modal-content">

		      <div className="modal-header">
		        <h4 className="modal-title">Nuevo Plan</h4>
		        <button type="button" className="close" data-dismiss="modal">&times;</button>
		      </div>

		      <form onChange={cambiaFormPut}   onSubmit={submitPut}> 

                <div className="modal-body">

                

                {/* ENTRADA IMAGEN*/}
            <div className="form-group">

                <label className="small text-secondary" htmlFor="crearImagen">
                Imagen de Plan |
                *Peso Max. 10MB | Formato: JPG o PNG</label>
                <input id="crearImagen" type="file" className="form-control-file border" name="imagen" required/>
                <div className="invalid-feedback invalid-imagen"></div>
                <img className="previsualizarImg img-fluid" alt="img"/>
                </div>          
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

                    <div className="input-group mb-3">

                        <div className="input-group-append input-group-text">
                             <i className="fas fa-heading"></i>
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

                    <div className="input-group mb-3">

                        <div className="input-group-append input-group-text">
                            <i className="fas fa-file-alt"></i>
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

                    <div className="input-group mb-3">

                        <div className="input-group-append input-group-text">
                            <i class="fas fa-money-bill"></i>
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

                        {
                            pros.map((pro,index) => (

                                <div key={index} className="mb-3 input-group"> 
                                    <div className="input-group-append input-group-text">
                                        <i class="fas fa-list"></i>
                                    </div>
                                    <input onChange={event => handleChangePro(index, event)} value={pros.descripcion} id="crearPro" type="text" className="form-control" name="pro" placeholder="Ingrese pro"/>

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
                    <label className="small text-secondary" htmlFor="crearPdf">Plan | *Peso Max. 10MB | Formato: PDF</label>
                    <input id="crearPdf" type="file"  className="form-control-file border" name="pdf" required/>
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