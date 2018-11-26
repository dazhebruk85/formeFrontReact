import React, { Component } from 'react';
import LoginPage from './LoginPage'
import { BrowserRouter as Router, Switch, Route, Redirect} from 'react-router-dom';


class App extends Component {
  render() {
    console.log("Host URL"+process.env.PUBLIC_URL);
    return (

      <Router basename={process.env.PUBLIC_URL}>
        <div style={{width:'100%',height:'100%', backgroundColor:'#f2f2f2'}}>
            <Switch>
                  <Route exact path= "/" render={() => (<Redirect to="/loginPage"/>)}/>
                  <Route exact path='/loginPage' component={LoginPage} />
            </Switch>
      </div>
    </Router>
    );
  }
}

export default App;
