import React, {Component} from 'react';

class FileUploadField extends Component {

    constructor(props) {
        super(props);

        this.state = {
            disabled:false,
            file:''
        };

        this.onChange = this.onChange.bind(this);
    }

    componentDidUpdate(prevProps) {
        if (this.props.disabled !== prevProps.disabled) {
            this.setState({
                disabled:this.props.disabled
            });
        }
    }

    onChange(event) {
        this.setState({
            file:event.currentTarget.files[0]
        })
    }

    render() {
        return(
            <div className="form-group">
                {this.props.label ? <label style={{width:this.props.labelWidth}} className="control-label col-sm-2">{this.props.label}</label> : null}
                <div className="col-sm-10" style={{width:this.props.fieldWidth,paddingRight:'0px'}}>
                    <input id={this.props.id}
                           className="form-control input-sm"
                           onChange={this.onChange}
                           maxLength={this.props.maxLength}
                           style={this.props.style}
                           type="file"
                           disabled={this.props.disabled}/>
                </div>
            </div>
        )
    }
}

export default FileUploadField;