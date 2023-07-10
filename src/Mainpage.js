import React, { useState, useEffect } from 'react';
import bootstrap from 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import MainPageStyles from './MainPageStyles';
import axios from 'axios';

function Mainpage(props) {
    const [clientList, setClientList] = useState([]);
    const [filteredClients, setFilteredClients] = useState([]);
    const [states, setLoadStates] = useState({});

    // Function to update load states
    const updateLoadState = async (client, loadId) => {
        const state = await getLoadState(client, loadId);
        setLoadStates(prev => ({ ...prev, [`${client}-${loadId}`]: state === "LOAD_STATE_ON" }));
    }

    const getLoadState = async (client, loadId) => {
        console.log('getLoadState function called')
        console.log('client:', client)
        console.log('loadId:', loadId)
        const token = localStorage.getItem('token');


        // return response.data.state; // assuming the response data has a property "state"
        try {
            const response = await axios.get(`https://tripplite-production.up.railway.app/api/load/${client}/${loadId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            console.log(response.data)
            return response.data;
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        // When the component mounts, update all the load states
        // Assuming clientList has been initialized here
        clientList.forEach(client => {
            // Assuming each client has a strip1 with loads 1 through N
            for (let loadId = 1; loadId <= 1; loadId++) {
                updateLoadState(client.strips.strip1.endpoint, loadId);
            }
        });
    }, [clientList]);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            props.history.push('/');
        } else {
            console.log('within useEffect')
            axios
                .get('https://tripplite-production.up.railway.app/api/clientList', {
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
    }, []);

    const handleSearch = (event) => {
        const searchTerm = event.target.value;
        const filtered = clientList.filter(client =>
            client.client.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredClients(filtered);
    };

    return (
        <div style={MainPageStyles.buttonContainer}>
            <input
                style={MainPageStyles.inputField}
                type="text"
                onChange={handleSearch}
                placeholder="Search clients..."
            />
            {filteredClients.map((client, index) => (
                <div key={client._id}>
                    <button
                        style={MainPageStyles.buttonStyles(index)}
                        className="btn btn-primary"
                        type="button"
                        data-bs-toggle="offcanvas"
                        data-bs-target={`#staticBackdrop${index}`}
                        aria-controls={`staticBackdrop${index}`}
                    >
                        <h1>{client.client}</h1>
                    </button>

                    <div
                        className="offcanvas offcanvas-start"
                        data-bs-backdrop="static"
                        tabIndex="-1"
                        id={`staticBackdrop${index}`}
                        aria-labelledby={`staticBackdropLabel${index}`}
                    >
                        <div className="offcanvas-header">
                            <h5
                                className="offcanvas-title"
                                id={`staticBackdropLabel${index}`}
                            >
                                {client.client}
                            </h5>
                            <button
                                type="button"
                                className="btn-close"
                                data-bs-dismiss="offcanvas"
                                aria-label="Close"
                            ></button>
                        </div>
                        <div className="offcanvas-body">
                            <div key={1} style={{ marginBottom: '1rem' }}>
                                {/* <h5>{load.name}</h5> */}
                                <label>
                                    <input
                                        type="checkbox"
                                        checked={loadStates[`${client.strips.strip1.endpoint}-1`] || false}
                                        onChange={() => {
                                            // Pseudo: Toggle the load state (on/off)
                                            console.log('toggle')
                                        }}
                                    />
                                </label>
                                <button
                                    onClick={() => {
                                        // Pseudo: Cycle the individual load
                                        console.log('cycle')
                                    }}
                                >
                                    Cycle
                                </button>
                            </div>
                            {/* {Object.entries(client.strips.strip1.loads).map(([loadNumber, load]) => (
                                <div key={`load-${loadNumber}`} style={{ marginBottom: '1rem' }}>
                                    <h5>{load.name}</h5>
                                    <label>
                                        <input
                                            type="checkbox"
                                            checked={getLoadState(client.strips.strip1.endpoint, loadNumber) == "LOAD_STATE_ON"}
                                            onChange={() => {
                                                // Pseudo: Toggle the load state (on/off)
                                                console.log('toggle')
                                            }}
                                        />
                                    </label>
                                    <button
                                        onClick={() => {
                                            // Pseudo: Cycle the individual load
                                            console.log('cycle')
                                        }}
                                    >
                                        Cycle
                                    </button>
                                </div>
                            ))} */}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default Mainpage;