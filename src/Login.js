import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';

function Login(props) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (event) => {
        event.preventDefault();
        const fullEmail = email + '@acousticarchitects.net';
        console.log(fullEmail, "email")
        axios.post('https://tripp-production.up.railway.app/server/login', { email: fullEmail, password })
            .then(response => {
                props.setUser(email);
                localStorage.setItem('token', response.data.token);
                props.history.push('/mainpage');
            })
            .catch(error => {
                console.log(error);
            });
    };

    return (
        <div className="App d-flex align-items-center justify-content-center" style={{ height: '100vh' }}>
            <div className="col-3" style={{ backgroundColor: 'white', padding: '20px', borderRadius: '20px' }}>
                <form onSubmit={handleSubmit} >
                    <div className="input-group mb-3">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Please enter email here"
                            aria-label="Please enter email"
                            aria-describedby="basic-addon2"
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                        />
                        <span
                            className="input-group-text"
                            id="basic-addon2"
                            style={{ borderTopRightRadius: '7px', borderBottomRightRadius: '7px' }}
                        >
                            @acousticarchitects.net
                        </span>
                    </div>
                    <div className="mb-3">
                        <input
                            type="password"
                            className="form-control"
                            aria-labelledby="passwordHelpBlock"
                            placeholder="Please enter password here"
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                        />
                    </div>
                    <button type="submit" className="btn btn-success mt-3">Sign in</button>
                </form>
            </div>
        </div>
    );
}

export default Login;
