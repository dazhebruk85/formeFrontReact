import React, {Component} from 'react';
import logo from '../../media/logo.png';

class AdminPage extends Component {

    constructor() {
        super();
    }

    render() {
        return (
            <div className="container" style={{width:'100%',height:'100%'}}>
                <div className="panel-group">
                    <img alt='' src={logo} style={{marginTop:"20px", marginLeft:"30px"}}/>
                </div>
            </div>
        )
    }
}

export default AdminPage;