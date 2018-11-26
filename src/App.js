import React, { Component } from 'react';
import './App.css';
import LoginPage from './LoginPage'
import { BrowserRouter as Router, Switch, Route, Redirect} from 'react-router-dom';


class App extends Component {
  render() {
    console.log("Host URL"+process.env.PUBLIC_URL);
    return (

      <Router basename={process.env.PUBLIC_URL}>
        <div className="App">
            <Switch>
                  <Route exact path= "/" render={() => (
                    <Redirect to="/loginPage"/>
                  )}/>
                   <Route exact path='/loginPage' component={LoginPage} />
            </Switch>
      </div>
    </Router>
    );
  }
}

export default App;
