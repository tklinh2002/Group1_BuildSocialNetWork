import React, { Component } from 'react';
import Web3 from 'web3';
import './App.css';
import SocialNetwork from '../abis/SocialNetwork.json'
import Navbar from './Navbar'
import Main from './Main'

class App extends Component {
  _adminWallet = '0x31435210dA75eE90bE5d7f03a5AAB94015Fc3cC2';
  async componentWillMount() {
    await this.loadWeb3()
    await this.loadBlockchainData()
  }

  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  }

  async loadBlockchainData() {
    const web3 = window.web3
    // Load account
    const accounts = await web3.eth.getAccounts()
    this.setState({ account: accounts[0] })
    // Network ID
    const networkId = await web3.eth.net.getId()
    const networkData = SocialNetwork.networks[networkId]
    if(networkData) {
      const socialNetwork = new web3.eth.Contract(SocialNetwork.abi, networkData.address)
      this.setState({ socialNetwork })
      const postCount = await socialNetwork.methods.postCount().call()
      this.setState({ postCount })


      // load isMember
      // change pkAdmin
      if(this.state.account === this._adminWallet){
        this.state.isAdmin = true
        const numMember = await this.state.socialNetwork.methods.numMember().call()
        for (let i = 0; i < numMember; i++) {
          let address = await this.state.socialNetwork.methods.accounts(i).call()
          let timeSign = await this.state.socialNetwork.methods.members(address).call()
          // let day = ((Date.now()/1000) - timeSign)/60/60/24
          
          if(timeSign !=='0'){
            this.state.members[this.state.members.length] = address
          }
        }
        
        await this.getDaysOfAllMember()
        
      }

      const numMember = await this.state.socialNetwork.methods.numMember().call()
        for (let i = 0; i < numMember; i++) {
          let address = await this.state.socialNetwork.methods.accounts(i).call()
          let timeSign = await this.state.socialNetwork.methods.members(address).call()
          // let day = ((Date.now()/1000) - timeSign)/60/60/24
          if(timeSign !=='0'){
            this.state.membersAll[this.state.membersAll.length] = address
          }
        }

        

      const isMember = await this.state.socialNetwork.methods.members(this.state.account).call()
      if(isMember === '0'){
        this.state.isMember = false   
      }else{
        let day = 30 - ((Date.now()/1000) - isMember)/60/60/24
        this.state.day = parseInt(day.toFixed(0))
        this.state.isMember = true
      }

      // Load Posts
      for (let i = 1; i <= postCount; i++) {
        const post = await socialNetwork.methods.posts(i).call()
        this.setState({
          posts: [...this.state.posts, post]
        })
      }
      // Sort posts. Show highest tipped posts first
      this.setState({
        posts: this.state.posts.sort((a,b) => {

          if(a.author === this._adminWallet || b.author === this._adminWallet ) {
            if(a.author === this._adminWallet)
              return -1;
            else
              return 1;
          } else if(b.vote >= 3 && a.vote >=3){
            if(b.vote > a.vote){
              return 1
            }
            if(b.vote === a.vote){
              if (this.state.membersAll.includes(b.author) && !this.state.membersAll.includes(a.author))
              {
                
                return 1;
              }
              else if(!this.state.membersAll.includes(b.author) && this.state.membersAll.includes(a.author))
              {
                
                return -1;
              }
            }
          }else if(b.vote < 3 && a.vote <3){
              if (this.state.membersAll.includes(b.author) && !this.state.membersAll.includes(a.author))
              {
                return 1;
              }
              else if(!this.state.membersAll.includes(b.author) && this.state.membersAll.includes(a.author))
              {
                return -1;
              }else{
                if(b.vote > a.vote){
                  return 1;
                }else if(b.vote < a.vote){
                  return -1;
                }else{
                  return 0;
                }
              }
          }else{
            if(b.vote > a.vote){
              return 1;
            }else if(b.vote < a.vote){
              return -1;
            }else{
              return 0;
            }
          }
          return 0;
        })
      })

      // load vote
      const isVoteTemp = this.state.isVotes.concat()
      for (let i = 1; i <= postCount; i++) {
        const status = await this.state.socialNetwork.methods.getVote(this.state.account, i).call();
        isVoteTemp[i-1] = status
      }
      
      this.setState({isVotes: isVoteTemp})
      this.setState({ loading: false})
    } else {
      window.alert('SocialNetwork contract not deployed to detected network.')
    }
  }


  createPost(content) {
    this.setState({ loading: true })
    this.state.socialNetwork.methods.createPost(content).send({ from: this.state.account })
    .once('receipt', (receipt) => {
      this.setState({ loading: false })
      this.reloadPage()
    })
  }

  tipPost(id, tipAmount) {
    this.setState({ loading: true })
    this.state.socialNetwork.methods.tipPost(id).send({ from: this.state.account, value: tipAmount })
    .once('receipt', (receipt) => {
      this.setState({ loading: false })
      this.reloadPage()
    })
  }
  signMember(amount) {
    this.setState({ loading: true })
    this.state.socialNetwork.methods.signMember().send({ from: this.state.account, value: amount })
    .once('receipt', (receipt) => {
      this.setState({ loading: false })
      this.reloadPage()
    })
  }
  deleteMember(account){
    this.setState({ loading: true })
    this.state.socialNetwork.methods.deleteMember(account).send({ from: this.state.account})
    .once('receipt', (receipt) => {
      this.setState({ loading: false })
      this.reloadPage()
    })
  }
  votePost(id){
    this.setState({ loading: true })
    this.state.socialNetwork.methods.votePost(id).send({ from: this.state.account, value: window.web3.utils.toWei('0.5', 'Ether')})
    .once('receipt', (receipt) => {
      this.setState({ loading: false })
      this.reloadPage()
    })
  }

  
  reloadPage() {
    window.location.reload()
  }

  async getDaysOfAllMember() {
    const numMembers = this.state.members.length; 
    var days = 0;
    const members = this.state.members;
    for(let i=0; i<numMembers; i++)
    {
      days = await this.state.socialNetwork.methods.members(members[i]).call()
      days =  30 - ((Date.now()/1000) - days)/60/60/24
      this.state.daysOfMember.push(days.toFixed(0))
    }  
  }

  constructor(props) {
    super(props)
    this.state = {
      account: '',
      socialNetwork: null,
      postCount: 0,
      posts: [],
      isVotes:[],
      members:[],
      membersAll:[],
      daysOfMember:[],
      day: 0,
      isMember:false,
      isAdmin: false,
      loading: true,
    }
    this.deleteMember = this.deleteMember.bind(this)
    this.signMember = this.signMember.bind(this)
    this.createPost = this.createPost.bind(this)
    this.tipPost = this.tipPost.bind(this)
    this.votePost = this.votePost.bind(this)
    this.reloadPage = this.reloadPage.bind(this)
  }

  render() {
    return (
      <div>
        <Navbar 
            account={this.state.account} 
            signMember = {this.signMember}
            isMember = {this.state.isMember}
            day = {this.state.day}
            isAdmin = {this.state.isAdmin}
        />
        { this.state.loading
          ? <div id="loader" className="text-center mt-5"><p>Loading...</p></div>
          : <Main
              isAdmin = {this.state.isAdmin}
              deleteMember = {this.deleteMember}
              membersAll = {this.state.membersAll}
              members = {this.state.members}
              posts={this.state.posts}
              createPost={this.createPost}
              tipPost={this.tipPost}
              votePost={this.votePost}
              isVote={this.state.isVotes}
              daysOfMember={this.state.daysOfMember}
              _adminWallet = {this._adminWallet}
            />
        }
      </div>
    );
  }
}

export default App;
