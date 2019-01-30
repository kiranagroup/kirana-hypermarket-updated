import React, { Component } from 'react';
import './App.css';
import {Home} from './Components/Home/home'; 
import {Store} from './Models/Store';
import firebase from './assets/firebase_config';

class App extends Component {
  constructor(){
    super();
    var add = localStorage.getItem('added');
    this.visible=false;
    // console.log(add);
    if(add){
    var added = JSON.parse(add);
    }
    var count=localStorage.getItem('count');
    var payload = {'added':added,'count':count};
    Store.dispatch({type:'retain',payLoad:payload});
  }

  componentDidMount(){
    firebase.auth().signOut();
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        console.log("User info is", user);
        firebase.database().ref(`/users/${user.uid}`).on('value', snapshot => {
          console.log(snapshot.val());
          let payload = {
            uid: user.uid,
            ...snapshot.val()
          };
          Store.dispatch({type:'user_data',payLoad:payload});
        });
      } else {
        console.log("No user logged in");
        Store.dispatch({ type: 'user_data', payLoad: undefined });
      }
    });
  }

  render() {
    return (
      // The main file leading to every HTML and JS
      <Home>
      </Home>
    );
  }
}

export default App;
