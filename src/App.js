import React, { Component } from 'react';
import LoginPage from './loginPage/LoginPage'
import { HashRouter as Router, Switch, Route, Redirect} from 'react-router-dom';

class App extends Component {
  render() {
    console.log("Host URL"+process.env.PUBLIC_URL);
    return (

      <Router basename={process.env.PUBLIC_URL}>
        <div style={{width:'100%',height:'100%', backgroundColor:'#f2f2f2'}}>
            <Switch>
                  <Route exact path="/" render={() => (<Redirect to="/front/loginPage"/>)}/>
                  <Route exact path="/front" render={() => (<Redirect to="/front/loginPage"/>)}/>
                  <Route exact path="/front/loginPage" component={LoginPage} />
            </Switch>
      </div>
    </Router>
    );
  }
}

export default App;
