import React from 'react';
import Modal from 'react-awesome-modal';
import closePng from '../../media/data/close.png';

class OkCancelDialog extends Modal {

    constructor(props) {
        super(props);

        this.state = {
            visible:false,
            question:'',
            cancelAction:null,
            okAction:null
        };

        this.closeModal = this.closeModal.bind(this);
    }

    closeModal() {
        this.setState({
            visible:false,
            question:'',
            cancelAction:null,
            okAction:null
        });
    }

    render() {
        return (
            <Modal visible={this.state.visible} effect="fadeInDown">

            </Modal>
        )
    }
}