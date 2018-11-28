import React, { Component } from 'react';
import { HashRouter as Router, Switch, Route, Redirect} from 'react-router-dom';
import LoginPage from './page/loginPage/LoginPage'
import ClientPage from './page/clientPage/ClientPage'
import AdminPage from './page/adminPage/AdminPage'

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

                <Route exact path="/clientPage" render={() => (<Redirect to="/front/clientPage"/>)}/>
                <Route exact path="/front/clientPage" component={ClientPage} />

                <Route exact path="/adminPage" render={() => (<Redirect to="/front/adminPage"/>)}/>
                <Route exact path="/front/adminPage" component={AdminPage} />

            </Switch>
      </div>
    </Router>
    );
  }
}

export default App;
