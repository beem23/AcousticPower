import React, { useState, useEffect } from 'react'
import axios from 'axios';

function AddClient() {
    const [client, setClient] = useState("");
    const [address, setAddress] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [endpoint, setEndpoint] = useState("");
    const [mac, setMac] = useState("");
    const [location, setLocation] = useState("");

    const handleSubmit = async (event) => {
        event.preventDefault();

        const token = localStorage.getItem('token');
        const ping = await axios.get(`https://tripplite-production.up.railway.app/ping/${endpoint}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        console.log(ping)

        const data = {
            client,
            address,
            username,
            password,
            strips: {
                strip1: {
                    endpoint,
                    MAC: mac,
                    location
                }
            }
        };

        // make a POST request to your server
        await axios.post('https://tripplite-production.up.railway.app/clients', data, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        console.log(data)
    }
    return (
        <div>
            <button className="btn btn-primary" type="button" data-bs-toggle="offcanvas" data-bs-target="#staticBackdrop" aria-controls="staticBackdrop">
                Add Client
            </button>

            <div className="offcanvas offcanvas-start" data-bs-backdrop="static" tabIndex="-1" id="staticBackdrop" aria-labelledby="staticBackdropLabel">
                <div className="offcanvas-header">
                    <h5 className="offcanvas-title" id="staticBackdropLabel">Add Client</h5>
                    <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                </div>
                <div className="offcanvas-body">
                    <div>
                        Form to fill in
                        <form onSubmit={handleSubmit}>
                            <input type="text" placeholder="Client Name" value={client} onChange={e => setClient(e.target.value)} required />
                            <input type="text" placeholder="Address" value={address} onChange={e => setAddress(e.target.value)} required />
                            <input type="text" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} required />
                            <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
                            <input type="text" placeholder="Endpoint" value={endpoint} onChange={e => setEndpoint(e.target.value)} required />
                            <input type="text" placeholder="MAC" value={mac} onChange={e => setMac(e.target.value)} required />
                            <input type="text" placeholder="Location" value={location} onChange={e => setLocation(e.target.value)} required />
                            <button type="submit">Submit</button>
                        </form>

                    </div>
                </div>
            </div>
        </div>
    )
}

export default AddClient