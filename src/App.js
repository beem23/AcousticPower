import React, { useState } from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import Login from './Login';
import Mainpage from './MPage';
import 'bootstrap/dist/css/bootstrap.min.css';

window.addEventListener('error', (e) => {
  if (e.message === 'ResizeObserver loop limit exceeded') {
    e.stopPropagation();
    e.preventDefault();
  }
});

function App() {
  const [user, setUser] = useState('');

  return (
    <Router>
      <Switch>
        <Route exact path="/" render={(props) => <Login {...props} user={user} setUser={setUser} />} />
        <Route path="/mainpage" render={(props) => <Mainpage {...props} user={user} />} />

        <Redirect to="/" />
      </Switch>
    </Router>
  );
}

export default App;