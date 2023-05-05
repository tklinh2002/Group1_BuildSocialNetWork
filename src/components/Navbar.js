import React, { Component } from 'react';
import Identicon from 'identicon.js';

class Navbar extends Component {

  signMember(){
    if(this.props.isAdmin){
      return(
        <React.Fragment>
          <small className="text-info float left mr-4"> Expiry date: infinity</small>
          <button class="btn btn-primary m-1 mr-3"
        disabled={true} 
      >Admin</button>
      </React.Fragment>
        )
    }else if(this.props.isMember){
      return(
      <React.Fragment>
        <small className="text-info float left"> Expiry date: {this.props.day} days</small>
        <button class="btn btn-primary m-1 ml-3"
        disabled={true} 
        onClick = {(event)=>{
          let amount = window.web3.utils.toWei('1', 'Ether') 
          this.props.signMember(amount)  
      }}
      >Member</button>
      </React.Fragment>
      )
    }else{
      return(<button class="btn btn-primary m-1" 
      onClick = {(event)=>{
        let amount = window.web3.utils.toWei('4', 'Ether') 
        this.props.signMember(amount)  
      }}
      >Member</button>)
    }
  }
  render() {
    return (
      <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
        <a
          className="navbar-brand col-sm-3 col-md-2 mr-0"
          href="http://www.dappuniversity.com/bootcamp"
          target="_blank"
          rel="noopener noreferrer"
        >
          Group 1
        </a>
        
        <ul className="navbar-nav px-3">
          <li className="nav-item text-nowrap d-none d-sm-none d-sm-block">
          {
            this.signMember()
          }
            <small className="text-secondary">
              <small id="account">{this.props.account}</small>
            </small>
            { this.props.account
              ? <img
                className='ml-2'
                width='30'
                height='30'
                alt='avatar'
                src={`data:image/png;base64,${new Identicon(this.props.account, 30).toString()}`}
              />
              : <span></span>
            }
          </li>
        </ul>
      </nav>
    );
  }
}

export default Navbar;
