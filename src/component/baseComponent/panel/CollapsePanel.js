import React, {Component}from 'react';
import { Panel } from 'react-bootstrap';
import collapseIcon from '../../../media/common/collapse.png'
import expandIcon from '../../../media/common/expand.png'
import './../../../media/collapsePanel/collapsePanel.css';

class CollapsePanel extends Component {

    constructor(props) {
        super(props);

        this.state = {
            panelOpen:true
        }
    }

    render() {

        let panelStyle = this.props.style ? this.props.style : {};
        if (!panelStyle.marginBottom) {
            panelStyle.marginBottom = '0px';
        }

        return (
            <Panel style={panelStyle} expanded={this.state.panelOpen} onToggle={() => {}}>
                <Panel.Heading style={{padding:'5px 5px'}}>
                    <div style={{fontWeight:'700'}}>
                        <img onClick={() => this.setState({panelOpen: !this.state.panelOpen})} alt='' align={'left'} src={this.state.panelOpen ? collapseIcon : expandIcon} className={'collapseExpandButton'}/>
                        {this.props.title}
                    </div>
                </Panel.Heading>
                <Panel.Collapse>
                    <Panel.Body style={{padding:'5px'}}>
                        {this.props.children}
                    </Panel.Body>
                </Panel.Collapse>
            </Panel>
        )
    }
}

export default CollapsePanel;