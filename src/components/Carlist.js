import React, { useState, useEffect } from 'react';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Addcar from './Addcar';
import Editcar from './Editcar';

export default function Carlist() {
    const [cars, setCars] = useState([]);
    const [open, setOpen] = React.useState(false);
    const [link, setLink] = useState('');

    useEffect(() => fetchData(), []);

    const fetchData = () => {
        fetch('https://carstockrest.herokuapp.com/cars')
        .then(response => response.json())
        .then(data => setCars(data._embedded.cars))
    }

    const handleOpen = (link) => {
        setLink(link);
        setOpen(true);
    }

    const deleteCar = () => {
        fetch(link, {method: 'DELETE'})
        .then(res => fetchData())
        .catch(err => console.error(err))
        setOpen(false);
    }

    const saveCar = (car) => {
        fetch('https://carstockrest.herokuapp.com/cars', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(car)
        })
        .then(res => fetchData())
        .catch(err => console.error(err))
    }

    const updateCar = (car, link) => {
        fetch(link, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
                },
            body: JSON.stringify(car)
        })
        .then(res => fetchData())
        .catch(err => console.error(err))
    }

    const handleClose = () => {
        setOpen(false);
      };

    const columns = [
        {
            Header: 'Brand', 
            accessor: 'brand'
        },
        {
            Header: 'Model', 
            accessor: 'model'
        },
        {
            Header: 'Color', 
            accessor: 'color'
        },
        {
            Header: 'Fuel', 
            accessor: 'fuel'
        },
        {
            Header: 'Year', 
            accessor: 'year'
        },
        {
            Header: 'Price', 
            accessor: 'price'
        },
        {
            sortable: false,
            filterable: false,
            width: 100,
            Cell: row => <Editcar updateCar={updateCar} car={row.original}/>
        },
        {
            sortable: false,
            filterable: false,
            width: 100,
            accessor: '_links.self.href',
            Cell: row => 
                <Button size="small" 
                    color="secondary" 
                    onClick={() => handleOpen(row.value)}>Delete</Button>
        }
    ]
    
    return (
        <div>
            <Addcar saveCar={saveCar} />
            <ReactTable filterable={true} data={cars} columns={columns} />
            <Snackbar
                anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
                }}
            open={open}
            autoHideDuration={6000}
            onClose={handleClose}
            message="Are you sure?"
            action={
            <React.Fragment>
                <Button color="secondary" size="small" onClick={deleteCar}>
                    Delete
                </Button>
                <IconButton size="small" aria-label="close" color="inherit" onClick={handleClose}>
                    <CloseIcon fontSize="small" />
                </IconButton>
            </React.Fragment>
            }
        />
        </div>
    );
}