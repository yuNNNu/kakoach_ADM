import React, {useState, useEffect} from 'react';
import $ from 'jquery';
import {rutaAPI} from '../../../../config/Config';
import IconButton from '@material-ui/core/IconButton';
import RemoveIcon from '@material-ui/icons/Remove';
import AddIcon from '@material-ui/icons/Add';

import axios from 'axios';

export default function Pros(){

	/*=============================================
	=                    useStates                =
	=============================================*/
	
	// primero se pasa la variable(es recorrible!), segundo se pasa la función que modifica el estado
	// de la variable
	
	const [pros, setPro] = useState([
        {pro: ''}
    ])

    /*=============================================
	=               ONCHANGE & ONSUBMIT           =
	=============================================*/

    const changePro = e => {

    	let proArr = [];
        let prosObject = [...pros]
			prosObject.map(x => {
            proArr.push(Object.values(x));
        })

		setPro({
			pro: proArr
		})

    }

    const submitPro = e => {
    	const {pro} = pros;
    }

    /*=============================================
	=                 BUTTON HANDLES              =
	=============================================*/

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
	=             INITIALIZATION VALUES           =
	=============================================*/

	   useEffect(() => {
    	fetch(`${rutaAPI}/show-individual-plan/${localStorage.getItem["planid"]}`)
    	.then(response => response.json())
    	.then(json => {
    		let proArray = json.data.pros;
    		setPro(proArray);
    	})
    	.catch(err => {
    		console.log(err);
    	}) 
    }, [])

	return(
        <div className="form-group">

                {
                    pros.map((pro,index) => (
                        <div key={index} className="mb-3 input-group"> 
                            <div className="input-group-append input-group-text">
                                <i class="fas fa-list"></i>
                            </div>
                            <input value={pro} id="createPro" onChange={event => handleChangePro(index, event)} type="text" className="form-control" name="pro" placeholder="set pro"/>

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
	);

}

