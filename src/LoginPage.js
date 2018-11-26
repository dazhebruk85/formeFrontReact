import React, {Component} from 'react';
import Panel from 'react-bootstrap/lib/Panel'
import Button from 'react-bootstrap/lib/Button'

class LoginPage extends Component {

    constructor() {
        super();
        this.state = {
            username: '',
            password: '',
            error: '',
        };

        this.handlePassChange = this.handlePassChange.bind(this);
        this.handleUserChange = this.handleUserChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.dismissError = this.dismissError.bind(this);
    }

    componentDidMount() {
    }

    dismissError() {
        this.setState({ error: '' });
    }

    handleSubmit(evt) {
        evt.preventDefault();

        if (!this.state.username) {
            return this.setState({ error: 'Username is required' });
        }

        if (!this.state.password) {
            return this.setState({ error: 'Password is required' });
        }

        return this.setState({ error: '' });
    }

    handleUserChange(evt) {
        this.setState({
            username: evt.target.value,
        });
    };

    handlePassChange(evt) {
        this.setState({
            password: evt.target.value,
        });
    }


    render() {
        // NOTE: I use data-attributes for easier E2E testing
        // but you don't need to target those (any css-selector will work)

        return (
            <div className="input-group mb-3" style={{width:'300px', margin:'auto'}}>
                <form onSubmit={this.handleSubmit}>
                    {
                        this.state.error &&
                        <h3 data-test="error" onClick={this.dismissError}>
                            <button onClick={this.dismissError}>✖</button>
                            {this.state.error}
                        </h3>
                    }
                    <div className="form-group">
                        <label htmlFor="loginTextbox">User Name</label>
                        <input id="loginTextbox" className="form-control" type="text" value={this.state.username}
                               onChange={this.handleUserChange}/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="passwordTextbox">Password</label>
                        <input id="passwordTextbox" className="form-control" type="password" value={this.state.password} onChange={this.handlePassChange}/>
                    </div>
                    <div className="form-group">
                        <input type="submit" value="Войти" class="btn btn-primary"/>
                    </div>
                </form>
            </div>
        );
    }
}

export default LoginPage;
