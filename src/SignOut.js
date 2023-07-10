import React from 'react'
import { useHistory } from 'react-router-dom';

function SignOut() {
    const history = useHistory();

    const handleSignOut = () => {
        // Remove the user's token from localStorage
        localStorage.removeItem('token');

        // Redirect the user to the login page
        history.push('/');
    };
    return (
        <button onClick={handleSignOut}>
            Sign Out
        </button>
    )
}

export default SignOut