import React, { Component } from 'react';
import { HashRouter as Router, Switch, Route, Redirect} from 'react-router-dom';
import MainPage from './page/MainPage'

class App extends Component {

    render() {

      return (
          <Router basename={process.env.PUBLIC_URL}>
              <div style={{width:'100%',height:'100%'}}>
                  <Switch>
                      <Route exact path="/" render={() => (<Redirect to="/front/mainPage"/>)}/>
                      <Route exact path="/front" render={() => (<Redirect to="/front/mainPage"/>)}/>
                      <Route exact path="/front/mainPage" render={() => (
                          <MainPage ref={'mainPageComp'}/>)
                      } />
                  </Switch>
              </div>
          </Router>
      );

    }

}

export default App;
