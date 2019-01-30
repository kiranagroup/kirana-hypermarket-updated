import React,{Component} from 'react';
import '../../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import icon from './../../images/logo.png';
import LoginSignup from './LoginSignup/loginisignup';
import '../../../node_modules/font-awesome/css/font-awesome.min.css';
import Searchbar from './Searchbar/searchbar';
import './navbar.css';
import Count from '../Cart/count';
import Cart from '../Cart/cart';
import {connect} from 'react-redux';
import {Store} from '../../Models/Store';

class Navbar extends Component{
    constructor(){
        super();
        this.cart=undefined;
        this.login_signup=undefined;
        // this.state={'cart':this.props.visible};
    }
    turnCartOn(){
        // this.setState({...this.state,'cart':!this.state.cart},()=>{
        // });
        Store.dispatch({type:'cartChange'});
    }
    componentDidMount(){
        this.changeIcons();
    }
    changeIcons(){
        if(window.innerWidth>576){
            this.cart = 
            <div className="col-sm-12 midIt">
                <i className="fa fa-shopping-basket" aria-hidden="true" onClick={this.turnCartOn.bind(this)}>
                <Count></Count>
                </i>
                <Cart></Cart>
            </div>
            this.login_signup = <LoginSignup></LoginSignup>
        }
        else{
            this.cart=null;
            this.login_signup=null;
        }
        this.setState({...this.state});
    }
    render(){
        window.addEventListener('resize',this.changeIcons.bind(this));
        return(
            <div className="row nav">

            {/* For Logo and ShopName */}
            <div className="col-sm-3 col-12 row outside">
                <div className="col-sm-6 col-2 imgIt ibIt rightIt">
                    <a href="/">
                        <img src={icon} alt="Logo"/>
                    </a>
                </div>
                <div className="col-sm-6 col-8 ibIt">
                    <div className="design">
                        <h4>Village HyperMarket</h4>
                    </div>
                </div>
                <div className="col-sm-0 col-2 usericon">
                    <i class="fa fa-user-circle-o" aria-hidden="true"></i>
                </div>
            </div>

            {/* For SearchBar */}
            <div className="col-sm-7 col-12 outside row">
                <div className="col-sm-12 rightIt">
                    <h6>Sample Text</h6>
                </div>
                <div className="col-sm-0 col-2">
                        <i class="fa fa-bars" aria-hidden="true"></i>
                </div>
                <div className="col-sm-12 col-10 searchIt">
                    <Searchbar></Searchbar>
                </div>
            </div>
            
            {/* For Showing Cart and Login/Signup */}
            <div className="col-sm-2 outside">
            <div className="col-sm-12 lsIt">
            {this.login_signup}
            </div>
            <div className="col-sm-12 h12">
            </div>
            {/* <div className="col-sm-12 midIt">
                <i className="fa fa-shopping-basket" aria-hidden="true" onClick={this.turnCartOn.bind(this)}>
                <Count></Count>
                </i>
                <Cart></Cart>
            </div> */}
            {this.cart}
            </div>


            </div>
        )
    }
}

// const mapStateToProps = (state) =>{
//     if(state.visible){
//         let cart=state.visible;
//         return {visible:cart};
//     }
//     return {}
// }

export default Navbar;