import React, { Component } from 'react';
import {connect} from 'react-redux';
import '../../../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import './loginisignup.css';
import firebase from '../../../assets/firebase_config';

class LoginSignup extends Component {
    constructor(){
        super();
        this.error = null;
    }
    state = {
        currentStep: 1,
    }
    takeAction = () => {
        let step = (this.state.currentStep === 3) ? 1 : ++this.state.currentStep;
        this.setState({currentStep: step});
    }
    showModal = () => {
        this.refs.modal.classList.add('block');
    }
    hideModal = () => {
        this.refs.modal.classList.remove('block');
    }
    logout = () => {
        firebase.auth().signOut();
    }
    render() {
        let message;
        let {user} = this.props;
        let {currentStep} = this.state;
        let currentModal, button1, button2, button3, extrafooter;
        currentModal=button1=button2=button3=extrafooter = null;

        switch (currentStep) {
            case 1:
                currentModal = <div className="row">
                    <h5 className="col-12 col-sm-12">Sign In to Proceed</h5>
                    <br />
                    <input type="email" ref='email' className="col-12 col-sm-12" placeholder="Email" />
                    <br />
                    <input type="password" ref='password' className="col-12 col-sm-12" placeholder="Password" />
                </div>;
                button1 = 'Close';
                button2 = 'Enter';
                button3 = 'Not Registered? Click Here';
                extrafooter = null;
                break;
            
            case 2:
                currentModal = <div className="row">
                    <h5 className="col-12 col-sm-12">Sign Up</h5>
                    <br />
                    <input type="email" ref='email' className="col-12 col-sm-12" placeholder="Email" />
                    <br />
                    <input type="password" ref='password' className="col-12 col-sm-12" placeholder="Password" />
                </div>;
                button1 = 'Close';
                button2 = 'Enter';
                button3 = null;
                extrafooter = null;
                break;
            
            case 3:
                currentModal = <div className="row">
                    <h5 className='col-12 col-sm-12'>Personal Details</h5>
                    <select ref='newm' className='col-2 col-sm-2' defaultValue="Mr">
                        <option value="Mr">Mr</option>
                        <option value="Mrs">Mrs</option>
                        <option value="Miss">Miss</option>
                    </select>
                    <input type="text" ref='newfname' placeholder='First Name' className='col-5 col-sm-5' />
                    <input type="text" ref='newlname' placeholder='Last Name' className='col-5 col-sm-5' />
                    {/* <input type="text" ref='newemail' placeholder='Email Address' className='col-6 col-sm-6'/> */}
                    {/* <input type="text" ref='newage' placeholder='Age' className='col-2 col-sm-2'/> */}
                    <input type="text" ref='newnum' placeholder='Contact Number' className='col-4 col-sm-4' />
                    <br />
                    <h5 className='col-12 col-sm-12'>Address Details</h5>
                    <input type="text" placeholder='House Number' ref='newaddrhno' className="col-4 col-sm-4" />
                    <input type="text" placeholder='Apartment Name' ref='newaddrapname' className="col-8 col-sm-8" />
                    <input type="text" placeholder='Street Name' ref='newaddrstname' className="col-6 col-sm-6" />
                    <input type="text" placeholder='Locality' ref='newaddrlocality' className="col-6 col-sm-6" />
                    <input type="text" placeholder='Landmark(if any)' ref='newaddrlandmark' className="col-6 col-sm-6" />
                    <input type="text" placeholder='Pin Code' ref='newaddrpcode' className="col-6 col-sm-6" />
                </div>
                button1 = 'Cancel';
                button2 = 'Save & Proceed';
                button3 = null;
                extrafooter = null;
        
            default:
                break;
        }

        
        if(user === null){
            message = null;
        }
        else if(user === undefined){
            message = <h5 style={{cursor: 'pointer'}} onClick={this.showModal}>Login/Signup</h5>
        } else if(user){
            message = (
                <h5>Welcome back, {user.firstName} <span onClick={this.logout}>Logout</span> </h5>
            )
        }
        return (
        <div>
            {message}
            <div className="modal" ref="modal" role="dialog">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={this.hideModal}>
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            {currentModal}
                            <br />
                            <p className="error">{this.error}</p>
                        </div>
                        <div className="modal-footer">
                            <p style={extrafooter ? { display: 'block' } : { display: 'none' }}>{extrafooter}</p>
                            {/* Commented because after that payment vala aana h */}
                            <button type="button" style={button3 ? { display: 'inline-block' } : { display: 'none' }} className="btn btn-primary">{button3}</button>
                            <button type="button" style={button2 ? { display: 'inline-block' } : { display: 'none' }} className="btn btn-primary" onClick={this.takeAction}>{button2}</button>
                            <button type="button" style={button1 ? { display: 'inline-block' } : { display: 'none' }} className="btn btn-secondary" data-dismiss="modal">{button1}</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        user: state.Reducer.user
    };
}

export default connect(mapStateToProps)(LoginSignup);
