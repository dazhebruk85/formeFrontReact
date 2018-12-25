import React, {Component}from 'react';
import { Panel } from 'react-bootstrap';
import collapseIcon from '../../media/data/collapse.png'
import expandIcon from '../../media/data/expand.png'

class CollapsePanel extends Component {

    constructor(props) {
        super(props);

        this.state = {
            panelOpen:true
        }
    }

    render() {
        return (
            <Panel style={{marginBottom:'0px'}} expanded={this.state.panelOpen} onToggle={() => {}}>
                <Panel.Heading style={{padding:'7px 10px'}}>
                    <div style={{fontWeight:'700'}}>
                        <img onClick={() => this.setState({panelOpen: !this.state.panelOpen})} alt='' align={'left'} src={this.state.panelOpen ? collapseIcon : expandIcon} style={{marginTop:'-2px',marginRight:'5px',cursor:'pointer',height:"24px",width:"24px"}}/>
                        {this.props.title}
                    </div>
                </Panel.Heading>
                <Panel.Collapse>
                    <Panel.Body style={{paddingTop:'5px'}}>
                        {this.props.children}
                    </Panel.Body>
                </Panel.Collapse>
            </Panel>
        )
    }
}

export default CollapsePanel;