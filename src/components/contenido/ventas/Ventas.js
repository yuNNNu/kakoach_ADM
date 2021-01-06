import React, {useState} from 'react';
import {rutaAPI} from '../../../config/Config';
import $ from 'jquery';
import 'datatables.net';
import 'datatables.net-bs4';
import 'datatables.net-responsive';
import Swal from 'sweetalert2'
export default function Ventas()
{
    /*=============================================
	Hook para capturar datos
	=============================================*/

	const [rango, CrearRango ] = useState({

	    fecha_inicio: "",
        fecha_fin: ""

    })
    
    /*=============================================
	OnChange
	=============================================*/

	const cambiaForm = e =>
    {
        if ($("#fechaInicio").val())
        {
            $(".invalid-fechaInicio").hide();
        }
        if ($("#fechaFin").val())
        {
            $(".invalid-fechaFin").hide();
        }
         CrearRango({
        fecha_inicio: $("#fechaInicio").val(),
        fecha_fin: $("#fechaFin").val()
        });
        console.log("rango", rango)
    }

    /*=============================================
	OnSubmit
	=============================================*/
    const submitForm = async e =>
    {
        $('.alert').remove();
        e.preventDefault();	
        const { fecha_inicio, fecha_fin } = rango
        
        if (!fecha_inicio)
        {

			$(".invalid-fechaInicio").show();
			$(".invalid-fechaInicio").html("Requiere de fecha  inico");
			return;
            
        }else{$(".invalid-fechaInicio").hide();}
        if (!fecha_fin)
        {
            $(".invalid-fechaFin").show();
			$(".invalid-fechaFin").html("Requiere de fecha fin");
			return;
          
        } else
        {
            $(".invalid-fechaFin").hide();
        }
         
        
    /*=============================================
    =            SE CREA EL DATASET       =
    =============================================*/
        const getVentas = await getData(rango);
            if(getVentas.status === 404){

			Swal.fire({

		      type: "error",
		      title: getVentas.mensaje,
		      showConfirmButton: true,
		      confirmButtonText: "Cerrar"
            
			}).then(function(getVentas){
				if(getVentas.value){
					window.location.href = "/";
				}
			})
            return
		    }
    const dataSet = [];
    console.log("getVentas",getVentas)    
    
    getVentas["planes_y_cantidad"].forEach((e,i) => {
                dataSet[i] = [(i+1),
                    e.nombre, 
                    e.cantidad,
                    e.id
                    , [e.id + "_",
                    e.nombre + "_", 
                    e.cantidad, 
                        
            ]];
    
        
    });
    
    // pasando datos
        // mas vendido
        $('#masVendido').html(getVentas["mas_vendido"].nombre)
        $('#CantidadmasVendido').html("total: "+getVentas["mas_vendido"].cantidad)
        $('#idMasVendido').html(getVentas["mas_vendido"].id)
        // menos vendido
        $('#menosVendido').html(getVentas["menos_vendido"].nombre)
        $('#CantidadmenosVendido').html("total: "+getVentas["menos_vendido"].cantidad)
        $('#idmenosVendido').html(getVentas["menos_vendido"].id)
        // saldo general
        $('#cantidadVentasGeneral').html("total: "+getVentas["cantidad_ventas"])
        $('#saldoGeneral').html("$"+getVentas["total_ventas"])
        
    // /*=============================================
    // =            EJECUTAMOS DATATABLE          =
    // =============================================*/
    $(document).ready(function () {
        $('.table').DataTable({
            retrieve: true,
            data: dataSet,
            columns: [
            {title: "#"},
            {title: "Nombre"},
            {title: "Cantidad"},
                {title: "id"}]
        })
    })

    }
      



   

    return(

		<div className="content-wrapper" style={{minHeight: "494px"}}>
			<div className="content-header">
				<div className="container-fluid">
					<div className="row mb-2">
						<div className="col-sm-6">
							<h1 className="m-0 text-dark">Ventas</h1>
						</div>
					</div>	
				</div>
			</div>

			<div className="content">

                <div className="container-fluid">
                    {/* RANGO DE FECHAS */}   
                    <form onChange={cambiaForm} onSubmit={submitForm}>
                        <div className="col-sm-6">
							<button type="submit" className="btn btn-primary">Filtrar Ventas</button>
						</div>
                     <div className="row">
                        
                            <div className="col-xl-4 col-md-4">
                                <div className="form-group">
                                    <label className="small text-secondary" htmlFor="fechaInicio">*Fecha inicio</label>
                                    <div className="input-group mb-3">
                                        <input id="fechaInicio" type="date" />
                                        <div className="invalid-feedback invalid-fechaInicio"></div>
                                    </div>
                                    
                                </div>
                            </div>
                            <div className="col-xl-4 col-md-4">
                                <div className="form-group">
                                    <label className="small text-secondary" htmlFor="fechaFin">*Fecha salida</label>
                                    <div className="input-group mb-3">
                                        <input id="fechaFin" type="date" />
                                        <div className="invalid-feedback invalid-fechaFin"></div>
                                    </div>
                                    
                                </div>
                               
                            </div>
                            
                            
                           
                       
                    </div>
                         </form>
                    {/* PLANES + Y - MENOS VENDIDOS */}
                    <div className="row">
                        {/* CUENTA GENERAL */}
                        <div className="col-xl-4 col-md-4">
                            <div className="card bg-primary text-white mb-4">
                                <div className="card-body">
                                    <h3>Información</h3>  
                                    <p>Información por rango</p>
                                </div>
                                <div className="card-footer d-flex align-items-center justify-content-between">
                                    
                                    <div className="small text-white">
                                        <h4 id="cantidadVentasGeneral">nro ventas</h4>        
                                        <h4 id="saldoGeneral">$</h4>           
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* PLAN MAS VENDIDO */}
                        <div className="col-xl-4 col-md-4">
                                <div className="card bg-success text-white mb-4">
                                    
                                <div className="card-body">
                                    <h3 id="masVendido">Más vendido</h3> 
                                    <p>Plan más vendido</p>
                                </div>
                                <div className="card-footer d-flex align-items-center justify-content-between">
                                    
                                    <div className="small text-white">
                                        <h4 id="CantidadmasVendido">cantidad</h4 >        
                                        <p id="idMasVendido"></p>         
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* PLAN MENOS VENDIDO */}
                        <div className="col-xl-4 col-md-4">
                            <div className="card bg-danger text-white mb-4">
                            <div className="card-body">
                                    <h3 id="menosVendido">Menos vendido</h3>  
                                    <p>Plan menos vendido</p>
                                </div>
                                <div className="card-footer d-flex align-items-center justify-content-between">
                                    
                                    <div className="small text-white">
                                        <h4 id="CantidadmenosVendido">cantidad</h4 >        
                                        <p id="idmenosVendido"></p>         
                                    </div>
                                </div> </div>
                        </div>
                    </div>
                    {/* TABLA DE PLANES Y CANTIDAD */}
                   <div className="row">
                        <div className="col-lg-12">
                            <div className="card card-primary card-outline">
                                <div className="card-header">

                                
                                </div>

                                <div className="card-body">
                                    <table className="table table-striped dt-responsive" style={{"width": "100%"}}>
                                        
                                    </table>
                                

                                </div>
                                
                            </div>

                        </div> 
                    </div>	
				</div>

			</div>

		</div>

	);
}
/*=============================================
=                     GET                     =
=============================================*/
	
const getData = (data) => {
	const url = `${ rutaAPI }/estadisticas`;
    const token = localStorage.getItem("ACCESS_TOKEN");
    let formData = new FormData();
    formData.append("fecha_inicio", data.fecha_inicio);
    formData.append("fecha_fin", data.fecha_fin);
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
		return  result;
	}).then(err => {
		return err;
	})
}