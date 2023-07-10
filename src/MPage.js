import React, { useState, useEffect } from 'react';

import 'bootstrap/dist/css/bootstrap.min.css';
import MainPageStyles from './MainPageStyles';
import axios from 'axios';
import Search from './Search';
import Clientlist from './Clientlist';
import SignOut from './SignOut';


function Mainpage(props) {
    const [clientList, setClientList] = useState([]);
    const [filteredClients, setFilteredClients] = useState([]);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            props.history.push('/');
        } else {
            console.log('within useEffect')
            axios
                .get(`http://localhost:8080/server/clientlist`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })
                .then(async (response) => {
                    console.log(
                        response.data,
                        'response from proxy on client side. Trying to obtain client list.'
                    );
                    setClientList(response.data);
                    setFilteredClients(response.data);
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    }, [props.history]);

    const handleSearch = (event) => {
        const searchTerm = event.target.value;
        const filtered = clientList.filter(client =>
            client.location.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredClients(filtered);
    };

    return (
        <div style={MainPageStyles.buttonContainer}>
            {/* <AddClient /> */}
            <SignOut />
            <Search handleSearch={handleSearch} />
            <Clientlist filteredClients={filteredClients} user={props.user} />
        </div>
    )
}

export default Mainpage;