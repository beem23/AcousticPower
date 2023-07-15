import React, { useEffect, useState, useRef } from 'react'
import MainPageStyles from './MainPageStyles';
import 'bootstrap/dist/css/bootstrap.min.css';


function Clientlist({ filteredClients, user }) {
    const [loadStates, setLoadStates] = useState({});
    const [currentClient, setCurrentClient] = useState(null);
    const ws = useRef(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        //check if token is not null
        if (token) {
            const ws = new WebSocket('wss://tripp-production.up.railway.app');

            ws.onopen = () => {
                console.log('WebSocket is open');
            };

            ws.onerror = (error) => {
                console.error(`WebSocket error: ${error}`);
            };

            ws.onclose = () => {
                console.log('WebSocket is closed');
            };

            ws.current = ws;

            return () => {
                ws.close();
            };
        }
    }, []);


    useEffect((user) => {
        if (ws && currentClient) {
            ws.send(JSON.stringify({
                type: 'webpageuser',
                id: `${user}`,
                location: `${currentClient.location}`,
                device: `${currentClient.device}`,
                mac: `${currentClient.mac}`
            }));

            const handleMessage = (event) => {
                console.log('Raw data received', event.data)
                const data = JSON.parse(event.data);
                if (data.type === 'toWebpage') {
                    console.log('receive toWebpage');
                    const { states } = data;
                    console.log('load states:', states)
                    setLoadStates(states)
                }
            };

            ws.onmessage = handleMessage;

            return () => {
                ws.onmessage = null;
            };
        }
    }, [ws, currentClient, user]);


    const handleClientClick = async (client) => {
        setCurrentClient(client);
    }

    const handleClientExit = async () => {
        setLoadStates(prevState => ({}));
        setCurrentClient(prevState => null);
    }



    const controlLoad = (client, load, control) => {
        console.log('controlLoad function called')
        console.log('client:', client.mac)
        console.log('load:', load)
        console.log('control:', control)

        if (ws) {
            const message = {
                type: 'controlLoad',
                location: client.location,
                mac: client.mac,
                load,
                control,
                id: `${user}`
            };

            ws.send(JSON.stringify(message));
        }
    }



    return (
        <div>
            {filteredClients.map((client, index) => (
                <div key={client._id}>
                    <button
                        style={MainPageStyles.buttonStyles(index)}
                        className="btn btn-primary"
                        type="button"
                        data-bs-toggle="offcanvas"
                        data-bs-target={`#staticBackdrop${index}`}
                        aria-controls={`staticBackdrop${index}`}
                        onClick={() => { handleClientClick(client) }}
                    >
                        <h1>{client.location}</h1>
                        <p>{client.device}</p>
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
                                {client.location} {client.device}
                            </h5>
                            <button
                                type="button"
                                className="btn-close"
                                data-bs-dismiss="offcanvas"
                                aria-label="Close"
                                onClick={() => { handleClientExit() }}
                            ></button>
                        </div>
                        <div className="offcanvas-body">
                            {Object.entries(client.loads).map(([loadNumber, load]) => (
                                <div key={`load-${loadNumber}`} style={{ marginBottom: '1rem' }}>
                                    <h5>{loadNumber} {load.name ? load.name : 'Unamed'}</h5>
                                    <label>
                                        <input
                                            type="checkbox"
                                            checked={loadStates[loadNumber] === 'LOAD_STATE_ON'}
                                            onChange={() => {
                                                let control;
                                                if (loadStates[loadNumber] === 'LOAD_STATE_ON') {
                                                    control = 'OFF';
                                                } else {
                                                    control = 'ON';
                                                }
                                                controlLoad(client, loadNumber, control)
                                            }}
                                        />
                                    </label>
                                    <button
                                        onClick={() => {
                                            controlLoad(client, loadNumber, 'LOAD_STATE_CYCLE')
                                            console.log('cycle')
                                        }}
                                    >
                                        Cycle
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default Clientlist