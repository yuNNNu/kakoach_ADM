import React from 'react';
import {rutaAPI} from '../../../config/Config';
import $ from 'jquery';
import 'datatables.net';
import 'datatables.net-bs4';
import 'datatables.net-responsive';
export default function Ventas()
{
    let totalVentas = 0;
    let cantVentas = 0;
    	const dataVentas = async()=>{
		/*=============================================
		=            SE CREA EL DATASET       =
		=============================================*/
		const getUser = await getData();
		const dataSet = [];
		
       
        cantVentas = getUser.data.length;
            
		getUser.data.forEach((venta, index) =>
        {
            totalVentas += venta.precio;
        
           
			dataSet[index] = [(index+1),
                            venta.nro_venta, 
                            venta.fecha_venta,
                            venta.email,
							venta.nombre_plan, 
                            venta.precio
                            , [venta._id + "_",
							venta.nro_venta+ "_", 
                            venta.email+ "_",
							venta.nombre_plan+ "_", 
                            venta.precio 
                ]];
            
            
        })
       
		/*=============================================
		=            EJECUTAMOS DATATABLE          =
		=============================================*/
		$(document).ready(function () {
			$('.table').DataTable({
				retrieve: true,
				data: dataSet,
				columns: [
                { title: "#" },
				{title: "Nº"},
                {title: "Fecha"},
                {title: "Mail"},
				{title: "Plan"},
				{title: "Precio"}]
			})
        })
        //   Mostrando datos 
            $('#cantidadVentasGeneral').html("Cantidad de Ventas: " + cantVentas);
            $('#saldoGeneral').html("Total de Ventas: $"+totalVentas);

	}
    dataVentas();

   

    return(

		<div className="content-wrapper" style={{minHeight: "494px"}}>
			<div className="content-header">
				<div className="container-fluid">
					<div className="row mb-2">
						<div className="col-sm-6">
							<h1 className="m-0 text-dark">Ventas Históricas</h1>
						</div>
					</div>	
				</div>
			</div>

			<div className="content">

                <div className="container-fluid">
                
                    
                    {/* PLANES + Y - MENOS VENDIDOS */}
                    <div className="row">
                        {/* CUENTA GENERAL */}
                        <div className="col-xl-4 col-md-4">
                            <div className="card bg-primary text-white mb-4">
                                <div className="card-body">
                                    <h3>Información General</h3>  
                                </div>
                                <div className="card-footer d-flex align-items-center justify-content-between">
                                    
                                    <div className="small text-white">
                                        <h4 id="cantidadVentasGeneral">0</h4>        
                                        <h4 id="saldoGeneral">$</h4>           
                                    </div>
                                </div>
                            </div>
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
	const url = `${ rutaAPI }/showVentas`;
    const token = localStorage.getItem("ACCESS_TOKEN");
   
	const params = {
        method: "GET",
		headers: {
            "Authorization": token,
            "Content-type": "application/json"
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