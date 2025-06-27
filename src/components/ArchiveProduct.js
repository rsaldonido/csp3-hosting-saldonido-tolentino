import { useState } from 'react';
import { Button } from 'react-bootstrap';
import { Notyf } from 'notyf';
import '../styles/ArchiveProduct.css';

export default function ArchiveProduct({product, isActive, fetchData}) {

    const notyf = new Notyf();
    const [productId, setproductId] = useState(product._id);

    const archiveToggle = () => {
        fetch(`https://kchtg2e005.execute-api.us-west-2.amazonaws.com/production/products/${productId}/archive`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })

        .then(res => res.json())
        .then(data => {
            console.log(data)
            if(data.success === true) {
                notyf.success("Successfully Archived")
                fetchData();

            }else {
                notyf.error("Something Went Wrong")
                fetchData();
            }


        })
    }


        const activateToggle = () => {
        fetch(`https://kchtg2e005.execute-api.us-west-2.amazonaws.com/production/products/${productId}/activate`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })

        .then(res => res.json())
        .then(data => {
            console.log(data)
            if(data.success === true) {
                notyf.success("Successfully Activated")
                fetchData();
            }else {
                notyf.error("Something Went Wrong")
                fetchData();
            }


        })
    }
 

    return(
        <div className="archive-btn-container">
            {isActive ?

                <Button variant="danger" size="sm" onClick={() => archiveToggle()} className="archive-btn">Disable</Button>

                :

                <Button variant="success" size="sm" onClick={() => activateToggle()} className="activate-btn">Activate</Button>

            }
        </div>

        )
}