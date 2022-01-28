import React, { Component } from 'react'
import Web3 from 'web3'
import Navbar from './Navbar'
import DaiToken from '../contracts/DaiToken.sol/DaiToken.json'
import DappToken from '../contracts/DappToken.sol/DappToken.json'
import TokenFarm from '../contracts/TokenFarm.sol/TokenFarm.json'
import Main from './Main'

import './App.css'

class App extends Component {
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
    const accounts = await web3.eth.getAccounts()
    this.setState({ account: accounts[0] })

    // Load DaiToken
    const daiTokenContractAddress = DaiToken.contractAddress;

    if (daiTokenContractAddress) {
      const daiToken = new web3.eth.Contract(DaiToken.abi, daiTokenContractAddress)
      this.setState({ daiToken })
      let daiTokenBalance = await daiToken.methods.balanceOf(this.state.account).call()
      this.setState({ daiTokenBalance: daiTokenBalance.toString() })
    } else {
      window.alert('DaiToken contract not deployed to detected network.')
    }

    // Load DappToken
    const dappTokenContractAddress = DappToken.contractAddress;

    if (dappTokenContractAddress) {
      const dappToken = new web3.eth.Contract(DappToken.abi, dappTokenContractAddress)
      this.setState({ dappToken })
      let dappTokenBalance = await dappToken.methods.balanceOf(this.state.account).call()
      this.setState({ dappTokenBalance: dappTokenBalance.toString() })
    } else {
      window.alert('DappToken contract not deployed to detected network.')
    }

    // Load TokenFarm
    const tokenFarmContractAddress = TokenFarm.contractAddress;

    if (tokenFarmContractAddress) {
      const tokenFarm = new web3.eth.Contract(TokenFarm.abi, tokenFarmContractAddress)
      this.setState({ tokenFarm })
      let stakingBalance = await tokenFarm.methods.stakingBalance(this.state.account).call()
      this.setState({ stakingBalance: stakingBalance.toString() })
    } else {
      window.alert('TokenFarm contract not deployed to detected network.')
    }
    console.log(this.state)

    this.setState({ loading: false })

  }

  constructor(props) {
    super(props)
    this.state = {
      account: '0x0',
      daiToken: {},
      dappToken: {},
      tokenFarm: {},
      daiTokenBalance: '0',
      dappTokenBalance: '0',
      stakingBalance: '0',
      loading: true
    }
  }

  stakeTokens = async (amount) => {
    this.setState({ loading: true })
    await this.state.daiToken.methods.approve(this.state.tokenFarm._address, amount).send({ from: this.state.account }).on('transactionHash', (hash) => {
      console.log("HERE", this.state.tokenFarm.methods.stakeTokens(amount).send({ from: this.state.account }).on)
    })
    await this.state.tokenFarm.methods.stakeTokens(amount).send({ from: this.state.account }).on('transactionHash', (hash) => {
      console.log("HERE 1", this.state.tokenFarm._address);
    })
    await this.loadBlockchainData()
  }

  unstakeTokens = async (amount) => {
    this.setState({ loading: true })
    await this.state.tokenFarm.methods.unstakeTokens().send({ from: this.state.account }).on('transactionHash', (hash) => {
      // this.setState({ loading: false })
    })
    await this.loadBlockchainData()
  }

  render() {

    return (
      <div>
        <Navbar account={this.state.account} />
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 ml-auto mr-auto" style={{ maxWidth: '600px' }}>
              <div className="content mr-auto ml-auto">
                <a
                  href="http://www.dappuniversity.com/bootcamp"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                </a>
                {
                  this.state.loading ? (
                    <p id="loader" className="text-center">Loading...</p>
                  ) : (<Main
                    daiTokenBalance={this.state.daiTokenBalance}
                    dappTokenBalance={this.state.dappTokenBalance}
                    stakingBalance={this.state.stakingBalance}
                    stakeTokens={this.stakeTokens}
                    unstakeTokens={this.unstakeTokens}
                  />
                  )
                }
              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
