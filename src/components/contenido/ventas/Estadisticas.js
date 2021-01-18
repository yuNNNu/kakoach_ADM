import React, {useState} from 'react';
import {rutaAPI} from '../../../config/Config';
import $ from 'jquery';
import 'datatables.net';
import 'datatables.net-bs4';
import 'datatables.net-responsive';
import Swal from 'sweetalert2'
export default function Estadisticas()
{
    /*=============================================
	Hook para capturar datos
	=============================================*/

	const [rango, CrearRango ] = useState({

	    fecha_inicio: "",
        fecha_fin: ""

    })
    const [fecha, CrearFecha ] = useState({

	    fecha_filtro: ""

    })
    
    /*=============================================
	OnChange de filtro x rangos
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
        
    }

    /*=============================================
	OnSubmit de filtro x rangos
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

    /*=============================================
	OnChange de filtro x fecha unica mm/yyyy
	=============================================*/

	const cambiaFormFecha = e =>
    {
        if ($("#cambiaFormFecha").val())
        {
            $(".invalid-fecha").hide();
        }
        
         CrearFecha({
        fecha_filtro: $("#fecha").val()
        });
    
    }
    /*=============================================
	OnSubmit de filtro  x fecha unica mm/yyyy
	=============================================*/
    const submitFormFecha = async e =>
    {
        $('.alert').remove();
        e.preventDefault();	
        const { fecha_filtro } = fecha
        
        if (!fecha_filtro)
        {

			$(".invalid-fecha").show();
			$(".invalid-fecha").html("Requiere de fecha de filtro");
			return;
            
        }else{$(".invalid-fecha").hide();}
       
         
        
    /*=============================================
    =            SE CREA EL DATASET       =
    =============================================*/
        const getVentas = await getDatabyMonth(fecha);
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
        $('#masVendido').html("Nombre: " + getVentas["mas_vendido"].nombre)
        $('#CantidadmasVendido').html("Cantidad: "+getVentas["mas_vendido"].cantidad)
        $('#idMasVendido').html("Id: " + getVentas["mas_vendido"].id)
        // menos vendido
        $('#menosVendido').html("Nombre: " + getVentas["menos_vendido"].nombre)
        $('#CantidadmenosVendido').html("Cantidad: "+getVentas["menos_vendido"].cantidad)
        $('#idmenosVendido').html("Id: " + getVentas["menos_vendido"].id)
        // saldo general
        $('#cantidadVentasGeneral').html("N° de Ventas: "+getVentas["cantidad_ventas"])
        $('#saldoGeneral').html("Total de ventas: $"+getVentas["total_ventas"])
        
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
							<h1 className="m-0 text-dark">Estadísticas</h1>
						</div>
					</div>	
				</div>
			</div>

			<div className="content">

                <div className="container-fluid">
                    {/* RANGO DE FECHAS */}   
                    <div className="row">
                        <div className=" col-xl-6 col-md-6">
                            <form onChange={cambiaForm} onSubmit={submitForm}>
                                <div className="col-sm-6">
                                    <button type="submit" className="btn btn-primary">Filtrar por rango </button>
                                </div>
                                <div className="">
                                
                                    <div className="col-xl-6 col-md-6">
                                        <div className="form-group">
                                            <label className="small text-secondary" htmlFor="fechaInicio">*Fecha inicio</label>
                                            <div className="input-group mb-3">
                                                <input id="fechaInicio" type="date" />
                                                <div className="invalid-feedback invalid-fechaInicio"></div>
                                            </div>
                                            
                                        </div>
                                    </div>
                                    <div className="col-xl-6 col-md-6">
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
                        
                        </div>
                          {/* RANGO  X MES Y AÑO */}   
                        <div className=" col-xl-6 col-md-6">
                            <form onChange={cambiaFormFecha} onSubmit={submitFormFecha} >
                                <div className="col-sm-6">
                                    <button type="submit" className="btn btn-primary">Filtrar por mes y año</button>
                                </div>
                                <div className="">
                                
                                    <div className="col-xl-12 col-md-12">
                                        <div className="form-group">
                                            <label className="small text-secondary" htmlFor="fecha">*Fecha inicio</label>
                                            <div className="input-group mb-3">
                                                <input id="fecha" type="month" />
                                                <div className="invalid-feedback invalid-fecha"></div>
                                            </div>
                                            
                                        </div>
                                    </div>
                                </div>
                            </form>
                    
                        </div>

                    </div>
                   
                    
                    
                    {/* PLANES + Y - MENOS VENDIDOS */}
                    <div className="row">
                        {/* CUENTA GENERAL */}
                        <div className="col-xl-4 col-md-4">
                            <div className="card bg-primary text-white mb-4">
                                <div className="card-body">
                                    <h3>Información por rango:</h3>  
                                </div>
                                <div className="card-footer d-flex align-items-center justify-content-between">
                                    
                                    <div className="small text-white">
                                        <h5 id="cantidadVentasGeneral">N° de Ventas: 0</h5>        
                                        <h5 id="saldoGeneral">Total de ventas: $0</h5>           
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* PLAN MAS VENDIDO */}
                        <div className="col-xl-4 col-md-4">
                                <div className="card bg-success text-white mb-4">
                                    
                                <div className="card-body">
                                    <h3>Plan más vendido:</h3> 

                                </div>
                                <div className="card-footer d-flex align-items-center justify-content-between">
                                    
                                    <div className="small text-white">
                                        <h5 id="masVendido">Nombre: </h5>
                                        <h5 id="CantidadmasVendido">Cantidad: </h5 >        
                                        <h5 id="idMasVendido">Id: </h5>         
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* PLAN MENOS VENDIDO */}
                        <div className="col-xl-4 col-md-4">
                            <div className="card bg-danger text-white mb-4">
                            <div className="card-body">
                                    <h3>Plan menos vendido:</h3>  
                                </div>
                                <div className="card-footer d-flex align-items-center justify-content-between">
                                    
                                    <div className="small text-white">
                                        <h5 id="menosVendido">Nombre: </h5>
                                        <h5 id="CantidadmenosVendido">Cantidad: </h5>        
                                        <h5 id="idmenosVendido">Id: </h5>         
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
/*=============================================
=                     GET                     =
=============================================*/
	
const getDatabyMonth = (data) => {
	const url = `${ rutaAPI }/estadisticas-mensual`;
    const token = localStorage.getItem("ACCESS_TOKEN");
    let formData = new FormData();
    formData.append("fecha_filtro", data.fecha_filtro);
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