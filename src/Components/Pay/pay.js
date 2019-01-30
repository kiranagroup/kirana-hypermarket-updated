import React,{Component} from 'react';
import {connect} from 'react-redux';
import '../../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import './pay.css';
import {Store} from '../../Models/Store';
import { withRouter } from 'react-router';
import firebase from '../../assets/firebase_config';

class Pay extends Component{
    constructor(props){
        super(props);
        this.state={currentStep:1,selectedAddr:null};
        this.error='';
    }

    static getDerivedStateFromProps(nextProps, prevState){
        if (!nextProps.user && prevState.currentStep === 2){
            return {
                currentStep: 1
            };
        }
        if(nextProps.user && prevState.currentStep === 1){
            return {
                currentStep: 2
            };
        }
        return null;
    }

    selectAddress(addr){
        let address = {...this.props.user.address[addr], id:addr};
        this.setState({...this.state, selectedAddr: address});
    }

    hideError(){
        this.setState({...this.state});
        setTimeout(()=>{
            this.error='';
            this.setState({...this.state});
        }, 2500);
    }
    takeAction(){
        let regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        switch(this.state.currentStep){
            case 1:
            if(!this.refs.email.value || !this.refs.email.value.match(regex)){
                this.error='Please enter a valid email address';
                this.hideError();
                break;
            } else if(!this.refs.password.value){
                this.error ='Please enter a password';
                this.hideError();
                break;
            } else {
                firebase.auth().signInWithEmailAndPassword(this.refs.email.value, this.refs.password.value).then(user => {
                    console.log("User Logged In");
                    this.setState({ ...this.state, currentStep: 2 });
                }).catch(error => {
                    console.log(error.code);
                    console.log(error.message);
                    if (error.code === 'auth/user-not-found'){
                        this.refs.email.value = '';
                        this.refs.password.value = '';
                        this.setState({ ...this.state, currentStep: 4 });
                    } else {
                        this.error = 'Error in Signing In';
                        this.hideError();
                    }
                });
            }
            //Make a hit on firebase and check if user already registered

            //User recognized

            //User not recognized
            // this.setState({currentStep:5});
            break;

            // case 2:
            // if(!this.refs.pin.value){
            //     this.error='Please enter your pin';
            //     this.hideError();
            //     break;
            // }
            // //Check if the pin entered is valid
            // this.setState({...this.state,currentStep:3});
            // break;

            //When the option of new address is selected
            case 2:
            this.setState({...this.state,currentStep:3});
            break;

            case 3:
            if(!this.refs.addrhno.value || !this.refs.addrapname.value || !this.refs.addrstname.value || !this.refs.addrlocality.value || !this.refs.addrpcode.value){
                this.error='Please fill all the details';
                this.hideError();
                break;
            }
            //Hit the firebase and add the address
            // this.setState({...this.state,currentStep:}); Payment vale page pr
            let id = firebase.auth().currentUser.uid;
            let key = firebase.database().ref(`/users/${id}`).child('address').push().key;
            let values = this.refs;
            let houseNo = values.addrhno.value;
            let apartmentName = values.addrapname.value;
            let streetName = values.addrstname.value;
            let locality = values.addrlocality.value;
            let landmark = (values.addrlandmark.value) ? values.addrlandmark.value : '';
            let pincode = values.addrpcode.value;
            let addr = {
                houseNo,
                apartmentName,
                streetName,
                locality,
                landmark,
                pincode
            };
            firebase.database().ref().update({
                [`/users/${id}/address/${key}`]: addr
            }).then(console.log('Address Added')).catch(error => {
                console.log(error);
            });
            this.props.history.push('/payment');
            break;
            
            case 4:
            if (!this.refs.email.value || !this.refs.email.value.match(regex)) {
                this.error = 'Please enter a valid email address';
                this.hideError();
                break;
            } else if (!this.refs.password.value) {
                this.error = 'Please enter a password';
                this.hideError();
                break;
            } else {
                firebase.auth().createUserWithEmailAndPassword(this.refs.email.value, this.refs.password.value).then(user => {
                    firebase.database().ref('/users/' + user.user.uid).set({
                        email: user.user.email,
                        createdOn: Date.now()
                    });
                    this.refs.email.value = '';
                    this.refs.password.value = '';
                    this.setState({...this.state,currentStep:5});
                }).catch(error => {
                    console.log(error.code, error.message);
                    this.error = error.message;
                    this.hideError();
                });
            }
            break;

            case 5:
            if(!this.refs.newaddrhno.value || !this.refs.newaddrapname.value || !this.refs.newaddrstname.value || !this.refs.newaddrlocality.value || !this.refs.newaddrpcode.value || !this.refs.newm.value || !this.refs.newfname.value || !this.refs.newlname.value || !this.refs.newnum.value){
                this.error='Please fill all the details';
                this.hideError();
                break;
            } else {
                let values = this.refs;
                let id = firebase.auth().currentUser.uid;
                let houseNo = values.newaddrhno.value;
                let apartmentName = values.newaddrapname.value;
                let streetName = values.newaddrstname.value;
                let locality = values.newaddrlocality.value;
                let landmark = (values.newaddrlandmark.value) ? values.newaddrlandmark.value : ''; 
                let pincode = values.newaddrpcode.value;
                let addr = {
                    houseNo,
                    apartmentName,
                    streetName,
                    locality,
                    landmark,
                    pincode
                };
                let history = this.props.history;
                let key = firebase.database().ref(`/users/${id}`).child('address').push().key;
                firebase.database().ref().update({
                    [`/users/${id}/firstName`]: values.newfname.value,
                    [`/users/${id}/lastName`]: values.newlname.value,
                    [`/users/${id}/contact`]: values.newnum.value,
                    [`/users/${id}/title`]: values.newm.value,
                    [`/users/${id}/address/${key}`]: addr 
                }).then(() => {
                    console.log('User data saved');
                    history.push('/payment');
                }).catch(error => {
                    console.log(error);
                });
            }
            // Hit the firebase and add user with his address
            // this.setState({...this.state,currentStep:6});
            break;

            // case 6:
            // if(!this.refs.otp.value){
            //     this.error='Please enter valid OTP';
            //     this.hideError();
            //     break;
            // }
            // // Check if thats the same OTP;
            // this.setState({...this.state,currentStep:7});
            // break;

            // case 7:
            // if(!this.refs.newpin.value || !this.refs.newconfirmpin.value){
            //     this.error='Please enter your pin';
            //     this.hideError();
            //     break;
            // }
            // if(this.refs.newpin.value!=this.refs.newconfirmpin.value){
            //     this.error='Your pin does not match, please enter your pin again';
            //     this.refs.newpin.value='';
            //     this.refs.newconfirmpin.value='';
            //     this.hideError();
            //     break;
            // }
            // if(this.refs.newpin.value==this.refs.newconfirmpin.value){
            // // Save the pin on firebase
            // }
            // // this.setState({...this.state,currentStep:}) Payment vale page pr
            // break;

            default:
            break;

        }
    }
    render(){
        if(this.props.start){
            this.refs.modal.classList.add('block');
        }
        else if(this.refs.modal){
            this.refs.modal.classList.remove('block');
        }
        var currentModal=null;
        var button1 = null;
        var button2=null;
        var button3=null;
        var extrafooter=null;
        switch(this.state.currentStep){

        //When user enters phone number
        case 1:
        currentModal=<div className="row">
            <h5 style={{textAlign:'center'}} className="col-12 col-sm-12">Sign In to Proceed</h5>
            <br/>
            <input type="email" ref='email' className="col-12 col-sm-12" placeholder="Email"/>
            <br/>
            <input type="password" ref='password' className="col-12 col-sm-12" placeholder="Password"/>
        </div>;
        button1='Close';
        button2='Enter';
        button3='Not Registered? Click Here';
        extrafooter=null;
            break;

        //When we recognize the user and its data is in firebase
        // case 2:
        // currentModal=<div className="row">
        //     <h5 className="col-12 col-sm-12">Welcome <b>User's Name</b></h5>
        //     <h5 className="col-12 col-sm-12">Please enter your 4 digit pin number</h5>
        //     <input type="password" ref='pin' className="col-12 col-sm-12"/>
        // </div>;
        // button1='Close';
        // button2='Enter';
        // button3=null;
        // extrafooter=<label htmlFor="">
        // <input type="checkbox" name="" id="" ref="signedIn"/>
        // &nbsp; Keep me signed in
        // </label>
        // break;    

        // When user chooses addres from its already registered addresses/can add new address
        case 2:
        console.log(this.props.user);
        if(!this.props.user){
            currentModal=<h5>Loading</h5>
            // break;
        }
        else{
                // if (this.props.user){
        let addresses = (this.props.user.address) ? Object.keys(this.props.user.address) : null;
        let id = (this.state.selectedAddr) ? this.state.selectedAddr.id : null;
        // console.log(addresses);
        // var good=true;
                // }
        currentModal=<div className='row'>
            <h5 className="col-12 col-sm-12">Please choose your address</h5>
            {/* <p className="col-12 col-sm-12">Addresses that come from backend will be shown</p> */}
            {   
                (!addresses) ? <h5 className="col-12 col-sm-12">No address added yet</h5> :
                // if(good){
                addresses.map(address =>{ 
                    let addr = this.props.user.address[address];
               return (<div style={{display:'inline-block', border:(id===address) ? '2px solid blue' : '2px solid black', margin: '4px 8px', cursor: 'pointer'}} key={address} onClick={this.selectAddress.bind(this,address)}>
                    {Object.keys(addr).map(key => 
                        <p key={key}>{key}-----{addr[key]}</p>
                    )}
                </div>)
                })
            }
            {/* } */}
        </div>
        }
        button1 = 'Close';
        button2 = 'Add New Address';
        button3 = 'Proceed';
        extrafooter = null; 
        break;
        
        // Adding an address(Can be and is for new user and old user both)
        case 3:
        currentModal=<div className='row'>
            <input type="text" placeholder='House Number' ref='addrhno' className="col-4 col-sm-4"/>
            <input type="text" placeholder='Apartment Name' ref='addrapname' className="col-8 col-sm-8"/>
            <input type="text" placeholder='Street Name' ref='addrstname' className="col-6 col-sm-6"/>
            <input type="text" placeholder='Locality' ref='addrlocality' className="col-6 col-sm-6"/>
            <input type="text" placeholder='Landmark(if any)' ref='addrlandmark' className="col-6 col-sm-6"/>
            <input type="text" placeholder='Pin Code' ref='addrpcode' className="col-6 col-sm-6"/>
        </div>
        button1 = 'Cancel';
        button2 = 'Save & Proceed';
        button3 = null;
        extrafooter = null;
        break;

        case 4:
        currentModal = <div className="row">
            <h5 style={{ textAlign: 'center' }} className="col-12 col-sm-12">Sign Up</h5>
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

        // User Details asked for new user
        case 5:
        currentModal=<div className="row">
        <h5 className='col-12 col-sm-12'>Personal Details</h5>
            <select ref='newm' className='col-2 col-sm-2' defaultValue="Mr">
                <option value="Mr">Mr</option>
                <option value="Mrs">Mrs</option>
                <option value="Miss">Miss</option>
            </select>
            <input type="text" ref='newfname' placeholder='First Name' className='col-5 col-sm-5'/>
            <input type="text" ref='newlname' placeholder='Last Name' className='col-5 col-sm-5'/>
            {/* <input type="text" ref='newemail' placeholder='Email Address' className='col-6 col-sm-6'/> */}
            {/* <input type="text" ref='newage' placeholder='Age' className='col-2 col-sm-2'/> */}
            <input type="text" ref='newnum' placeholder='Contact Number' className='col-4 col-sm-4'/>
            <br/>
            <h5 className='col-12 col-sm-12'>Address Details</h5>
            <input type="text" placeholder='House Number' ref='newaddrhno' className="col-4 col-sm-4"/>
            <input type="text" placeholder='Apartment Name' ref='newaddrapname' className="col-8 col-sm-8"/>
            <input type="text" placeholder='Street Name' ref='newaddrstname' className="col-6 col-sm-6"/>
            <input type="text" placeholder='Locality' ref='newaddrlocality' className="col-6 col-sm-6"/>
            <input type="text" placeholder='Landmark(if any)' ref='newaddrlandmark' className="col-6 col-sm-6"/>
            <input type="text" placeholder='Pin Code' ref='newaddrpcode' className="col-6 col-sm-6"/>
        </div>
        button1 = 'Cancel';
        button2 = 'Save & Proceed';
        button3 = null;
        extrafooter = null;
        break;


        //Otp Confirmation for new user
        // case 6:
        // currentModal=<div className='row'>
        //     <h5>Welcome <b>User's Name</b></h5>
        //     <h5>Please enter the 6 digit OTP sent to your phone</h5>
        //     <input type="text" ref="otp" className='col-12 col-sm-12'/>
        // </div>
        // button1 = 'Cancel';
        // button2 = 'Enter';
        // button3 = null;
        // extrafooter = null;
        // break;

        // //Set pin for new user
        // case 7:
        // currentModal=<div className="row">
        //     <p className='col-7 col-sm-7'>Set your 4 digit pin</p>
        //     <input type="password" className='col-5 col-sm-5' ref='newpin'/>
        //     <br/>
        //     <p className='col-7 col-sm-7'>Re-confirm pin</p>
        //     <input type="password" className='col-5 col-sm-5' ref='newconfirmpin'/>
        // </div>
        // button1 = 'Cancel';
        // button2 = 'Enter';
        // button3 = null;
        // extrafooter = null;
        // break;

        default:
        currentModal=
        <h5>Your cart is empty.</h5>
        button1='Close';
        button2=null;
        button3=null;
        extrafooter=null;
        break;
        }
        return(
            <div className="modal" ref="modal" role="dialog">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={()=>{
                                Store.dispatch({'type':'pay','payLoad':false});
                                this.setState({...this.state,currentStep:1});
                            }}>
                            <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                        {currentModal}
                        <br/>
                        <p className="error">{this.error}</p>
                        </div>
                        <div className="modal-footer">
                            <p style={extrafooter?{display:'inline-block'}:{display:'none'}}>{extrafooter}</p>
                            {/* Commented because after that payment vala aana h */}
                            <button type="button" style={button3?{display:'inline-block'}:{display:'none'}} className="btn btn-primary" onClick={()=>{
                                if(this.state.currentStep === 1){
                                    console.log('yes');
                                    this.setState({currentStep: 4})
                                } else {
                                    this.props.history.push('/payment')
                                }
                            }}>{button3}</button>

                            <button type="button" className="btn btn-primary" onClick={this.takeAction.bind(this)}>{button2}</button>

                            <button type="button" className="btn btn-secondary" data-dismiss="modal" onClick={()=>{
                                Store.dispatch({'type':'pay','payLoad':false});
                                this.setState({...this.state,currentStep:1});
                            }}>{button1}</button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) =>{
    if(state.Reducer.payStart){
        console.log(state.Reducer.user);
        var use = state.Reducer.user;
        return {start:true,user: use};
    }
    return { start: false, user: state.Reducer.user};
}

export default withRouter(connect(mapStateToProps)(Pay));