import React from 'react';
import ReactDOM from 'react-dom';
import Modal from 'react-awesome-modal';
import closePng from '../../../media/data/close.png';

const customStyles = {
    content : {
        top:'30%',
        left:'50%',
        right:'auto',
        bottom:'auto',
        marginRight:'-50%',
        transform:'translate(-50%, -50%)',
        border:'0px',
        padding:'0px'
    }
};

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
        return (
            <Modal style={{marginTop:"20px"}} visible={this.state.visible} effect="fadeInDown" onClickAway={() => this.closeModal()}>
                <div className="panel panel-default" style={{width:'500px',height:'250px',marginBottom:'0px'}}>
                    <div className="panel-heading" style={{height:'45px'}}>
                        <table style={{width:'100%'}}>
                            <td style={{width:'90%'}}>
                                <label style={{width:'100%',height:'24px',paddingLeft:'0px',paddingRight:'0px',paddingTop:'2px'}} className="control-label col-sm-2" htmlFor="loginTextbox">Сообщение об ошибках</label>
                            </td>
                            <td style={{width:'10%',alignItems:'right'}}>
                                <img onClick={() => this.closeModal()} align={'right'} src={closePng} style={{marginLeft:'27px',cursor:'pointer',height:"24px",width:"24px",position:'absolute'}}/>
                            </td>
                        </table>
                    </div>
                    <div className="panel-body">

                    </div>
                </div>
            </Modal>
        );
    }
}

export default ErrorModal;
