import React, { Component} from 'react';
import {FaHeart} from"react-icons/fa";
import {FaKey} from"react-icons/fa";
import { IoIosCheckmarkCircle } from 'react-icons/io';
import ModalTip from './ModalTip'
import Identicon from 'identicon.js';

class Main extends Component {

  tipPost(id, tipAmount){
    this.props.tipPost(id, tipAmount)
  }
  constructor(props) {
    super(props);
    this.state = {
      socialNetwork: null,
      showList: false,

    };
    this.tipPost = this.tipPost.bind(this)
    this.toggleList = this.toggleList.bind(this);
  }

  toggleList() {
    this.setState({ showList: !this.state.showList });
  }
  
  
  manageAccount(){
    if(this.props.isAdmin === true){
      return(
        <div className="fixed-top mt-5" style={{ maxWidth: '430px' }}>
                <button className="btn btn-primary" onClick={this.toggleList}>Show List</button>
                <ul className="list-group" style={{ display: this.state.showList ? 'block' : 'none' }}>
                {
                  this.props.members.map((address,key)=>{
                    return(
                      <div>
                        <li className="list-group-item d-flex align-items-center justify-content-between mt-3" key = {key}>
                          <small>{address}
                          <br />
                          Expiry date: {this.props.daysOfMember[key]}</small>
                        <button className='btn btn-danger float-right ml-4'onClick={(event)=>{
                          this.props.deleteMember(address)
                        }}>Cancel</button></li>
                      </div>
                    )
                  })
                  
                }
                </ul>
            </div>
      )
    }
  }
  setIconTick(address){
    const members = this.props.membersAll;
    const isMember = members.filter((value) => {
      return value === address;
    });
    if (address === this.props._adminWallet) {
      return <FaKey />;
    } else if ((isMember.length > 0)) {
      return <IoIosCheckmarkCircle />;
    } else {
      return null;
    }
  }
  
  render() {
    return (
      <div className="container-fluid mt-5">
        <div className="row">
          <main role="main" className="col-lg-12 ml-auto mr-auto" style={{ maxWidth: '500px' }}>
          
            <div className="content mr-auto ml-auto">
            {
              this.manageAccount()
            }
            
              <p>&nbsp;</p>
                <form onSubmit={(event) => {
                  event.preventDefault()
                  const content = this.postContent.value
                  this.props.createPost(content)
                }}>
                <div className="form-group mr-sm-2">
                  <input
                    id="postContent"
                    type="text"
                    ref={(input) => { this.postContent = input }}
                    className="form-control"
                    placeholder="What's on your mind?"
                    required />
                </div>
                <button type="submit" className="btn btn-primary btn-block">Share</button>
              </form>
              <p>&nbsp;</p>
              { this.props.posts.map((post, key) => {
                return(
                  <div className="card mb-4" key={key} >
                    <div className="card-header">
                      <img
                        alt='img'
                        className='mr-2'
                        width='30'
                        height='30'
                        src={`data:image/png;base64,${new Identicon(post.author, 30).toString()}`}
                      />
                      <small className="text-muted">{post.author}</small>
                      <span style={{color:"blue"}}  className="ml-3">
                        {this.setIconTick(post.author)}
                      </span>
                      
                    </div>
                    <ul id="postList" className="list-group list-group-flush">
                      <li className="list-group-item">
                        <p>{post.content}</p>
                      </li>
                      <li key={key}  className="list-group-item py-2">
                        <small className="float-left mt-1 text-muted">
                          TIPS: {window.web3.utils.fromWei(post.tipAmount.toString(), 'Ether')} ETH
                        </small>
                        
                        <button
                          className="btn btn-link btn-sm float-right pt-0"
                          onClick={(event) => {
                            console.log("You vote post has id: ", post.id)
                            this.props.votePost(post.id)                
                          }}
                        >   
                          <span className='vote-icon' style={{color: this.props.isVote[post.id-1] ?  "red" : "gray"}}>
                            <FaHeart/>
                          </span>
                          <span className='vote-number'>{post.vote}</span>
                        </button>
                        {/* <button
                          className="btn btn-link btn-sm float-right pt-0"
                          name={post.id}
                          data-toggle="modal" data-target="#exampleModalLong"

                          onClick={(event) => {

                            // this.props.tipPost(event.target.name, tipAmount)
                          }}
                        >
                          TIP 0.1 ETH
                        </button> */}
                        <ModalTip 
                          post={post}
                          tipPost = {this.tipPost}
                        />
                      </li>
                    </ul>
                  </div>
                )
              })}
            </div>
          </main>
        </div>
      </div>
    );
  }
}

export default Main;
