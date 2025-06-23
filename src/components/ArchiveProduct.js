import { useState } from 'react';
import { Button } from 'react-bootstrap';
import { Notyf } from 'notyf';

export default function ArchiveProduct({product, isActive, fetchData}) {

    const notyf = new Notyf();
    const [productId, setproductId] = useState(product._id);

    const archiveToggle = () => {
        fetch(`http://localhost:4000/products/${productId}/archive`, {
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
        fetch(`http://localhost:4000/products/${productId}/activate`, {
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
        <>
            {isActive ?

                <Button variant="danger" size="sm" onClick={() => archiveToggle()}>Archive</Button>

                :

                <Button variant="success" size="sm" onClick={() => activateToggle()}>Activate</Button>

            }
        </>

        )
}