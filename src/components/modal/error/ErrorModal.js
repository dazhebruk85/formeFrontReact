import React from 'react';
import Modal from 'react-awesome-modal';
import closePng from '../../../media/data/close.png';

class ErrorModal extends Modal {
    constructor(props) {
        super(props);

        this.state = {
            visible : false,
            errors: []
        };

        this.openModal = this.openModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
    }

    componentDidMount() {
        if (this.props.errors.length > 0) {
            this.setState({
                errors: this.props.errors,
                visible: true
            });
        }
    }

    componentDidUpdate(prevProps) {
        if (this.props.errors !== prevProps.errors) {
            if (this.props.errors.length > 0) {
                this.setState({
                    errors: this.props.errors,
                    visible: true
                });
            } else {
                this.setState({
                    errors: [],
                    visible: false
                });
            }
        }
    }

    openModal() {
        this.setState({
            visible : true
        });
    }

    closeModal() {
        this.setState({
            visible : false
        });
    }

    render() {

        function ErrorList(props) {
            if (props.errors.length > 0) {
                let listErrorList = props.errors.map((error) =>
                    <tr>
                        <td></td><td>{error.message}</td>
                    </tr>
                );
                return (
                    listErrorList
                );
            } else {
                return null
            }
        }

        return (
            <Modal style={{marginTop:"20px"}} visible={this.state.visible} effect="fadeInDown" onClickAway={() => this.closeModal()}>
                <div className="panel panel-default" style={{width:'500px',height:'250px',marginBottom:'0px'}}>
                    <div className="panel-heading" style={{height:'45px'}}>
                        <table style={{width:'100%'}}>
                            <tbody>
                                <tr>
                                    <td style={{width:'90%'}}>
                                        <label style={{width:'100%',height:'24px',paddingLeft:'0px',paddingRight:'0px',paddingTop:'2px'}} className="control-label col-sm-2" htmlFor="loginTextbox">Сообщение об ошибках</label>
                                    </td>
                                    <td style={{width:'10%',alignItems:'right'}}>
                                        <img alt='' onClick={() => this.closeModal()} align={'right'} src={closePng} style={{marginLeft:'27px',cursor:'pointer',height:"24px",width:"24px",position:'absolute'}}/>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div className="panel-body">
                        <table style={{width:'100%'}}>
                            <tbody>
                                <ErrorList errors={this.state.errors} />
                            </tbody>
                        </table>
                    </div>
                </div>
            </Modal>
        );
    }
}

export default ErrorModal;
