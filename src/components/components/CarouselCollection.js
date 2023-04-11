import React, { Component } from "react";
import Slider from "react-slick";
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import styled from "styled-components";

import Clock from "./Clock";
import axios from 'axios';
import Web3Modal from "web3modal"
// import { nftaddress, nftmarketaddress } from '../components/../../config';
// import NFT from '../../NFT.json';
import { NFT, NFT_MARKET } from './../../constants/contract.config'

// import Market from '../../NFTMarket.json';
import { Image } from 'react-bootstrap';
import { ethers } from 'ethers'
import { Link, useNavigate } from "react-router-dom";
import { navigate } from "@reach/router"
import { Navigate } from 'react-router-dom'
import { URLS } from '../app-url'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';




const Outer = styled.div`
  display: flex;
  justify-content: center;
  align-content: center;
  align-items: center;
`;
toast.configure()


class CustomSlide extends Component {
  render() {
    const { index, ...props } = this.props;
    return (
      <div {...props}></div>
    );
  }
}

export default class Responsive extends Component {

  constructor(props) {
    super(props);
    this.state = { timer: { deadline: "January, 10, 2022", deadline1: "February, 10, 2022", deadline2: "February, 1, 2022", height: 0 }, nftList: [], redirect: false, accountAddress: "" };
    // this.onImgLoad = this.onImgLoad.bind(this);

  }


  // onImgLoad({ target: img }) {
  //   let currentHeight = this.state.timer.height;
  //   if (currentHeight < img.offsetHeight) {
  //     this.setState({
  //       height: img.offsetHeight
  //     })
  //   }
  // }
  componentDidMount() {
    this.loadNFTs()

  }


  async getAccount() {
    // debugger
    let accounts
    try {
      accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      // console.log("-------------------------CarouselNew Accont---------------------------------------")
      const account = accounts[0];

      // console.log(account, "cnklsdnvklsdnvlsdncsdcklnl")
      return account;

    } catch (error) {
      // console.log(error)
    }
  }

  async connectButtonOnClick() {
    if (typeof window !== "undefined") {
      getAccount().then((response) => {
        this.setState({ ...this.state, accountAddress: response });

      });
    }
  };




  async loadNFTs() {
    // debugger
    // const web3Modal = new Web3Modal(
    //   {
    //     network: "Rinkeby",
    //     cacheProvider: true,
    //   }
    // )

    // let connection
    try {
      // const web3Modal = await new Web3Modal();

      // connection = await web3Modal.connect()
      // const provider = new ethers.providers.Web3Provider(connection)
      // let provider = new ethers.providers.JsonRpcProvider("https://rinkeby.infura.io/v3/471da85949474db4a917df1ac2365ca0");
      // let provider = new ethers.providers.Web3Provider(connection);
      let provider = new ethers.providers.JsonRpcProvider("https://nd-185-273-976.p2pify.com/6a5193643c359e2c84ca3c7cbcf920f3");
      console.log("provider:",provider);
      // let provider = new ethers.providers.JsonRpcProvider("https://data-seed-prebsc-1-s1.binance.org:8545");


      // let a = provider.getCode("0xDE8EF7064a94b5ae3d8086A03410cBd9a7EAE0E0")
      // console.log(a,"a----------------------------------------------")
      // const provider = new ethers.providers.Web3Provider(window.ethereum)     
      const tokenContract = new ethers.Contract(NFT.NFT_ADDRESS, NFT.NFT_ABI, provider);
      const marketContract = new ethers.Contract(NFT_MARKET.NFT_MARKET_ADDRESS, NFT_MARKET.NFT_MARKET_ABI, provider);
      // console.log(marketContract,"marketConrtract--------------")

      // marketContract.fetchMarketItems().then(data => {
      //   // console.log(data, "datata--------------------")
      // }).catch(err => {
      //   // console.log(err, "err---------CaroselCollection-----------------")
      // })

      //return an array of unsold market items
      // debugger
      const data = await marketContract.fetchMarketItems();
      // console.log(data, "data-Hot Coll---------44")
      const items = await Promise.allSettled(data.map(async i => {
        const tokenUri = await tokenContract.tokenURI(i.tokenId);
        // console.log("token Hot Coolection", tokenUri)
        const meta = await axios.get(tokenUri);
        // console.log("token Hot Collection", meta)
        let price = ethers.utils.formatUnits(i.price.toString(), 'ether')
        let item = {
          price,
          tokenId: i.tokenId.toNumber(),
          itemId: i.itemId.toNumber(),
          seller: i.seller,
          owner: i.owner,
          image: meta.data.image,
          name: meta.data.name,
          description: meta.data.description,
        }
        // console.log(item, "items---------------------")
        return item;
      }));
      // console.log(items, "items---------------------")
      let reqItems = items.filter(data => data.status == "fulfilled");
      let ItemsLoad = reqItems.map((item) => {
        const loadValue = item.value
        // console.log("ItemsLoad", loadValue);
        this.setState({
          ...this.state, nftList: [...this.state.nftList, loadValue]
        })
      })

      // console.log("reqItems:", reqItems)
      // console.log("nftList--------:", nftList)

      this.setState({
        timer: this.state.timer,
        // nftList: loadValue,
      })
    }
    catch (err) {
      // alert(err)
    }




  }


  async buyNFT(nft) {
    // debugger
    // console.log(nft, "nft----------")
    try {
      const web3Modal = await new Web3Modal();
      const connection = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);

      //sign the transaction
      const signer = provider.getSigner();
      const contract = new ethers.Contract(NFT_MARKET.NFT_MARKET_ADDRESS, NFT_MARKET.NFT_MARKET_ABI, signer);

      //set the price
      const price = ethers.utils.parseUnits(nft.price.toString(), 'ether');

      //make the sale
      // let ItemTokenId = nft.tokenId - 1
      const transaction = await contract.createMarketSale(NFT.NFT_ADDRESS, nft.itemId, {
        value: price,
        gasLimit: 3000000,
        // gasPrice: 8000000
      })
      // console.log(nft.tokenId, "tokenId---------------143----------------");
      // console.log(transaction, "transaction-------------------------------")


      const txRes = await transaction.wait();
      this.loadNFTs()
      this.updateNft(nft.itemId, nft.seller)


      return nft;


    } catch (error) {
      // console.log(error.message);
      if (error.code == "4001") {
        toast.error(error.message)
      }
    }



  }

  async updateNft(idd, seller) {
    // debugger
    // console.log(idd,"------------nft token is-------------")
    // debugger
    let walletAddress
    await this.getAccount().then((response) => {
      walletAddress = response;
    });
    const formData = new FormData();
    // console.log(nftTokenId, "-----------------------------tokren ")
    formData.append('walletAddress', walletAddress);



    axios.patch(URLS.updateNftMint + "/" + seller + "/" + idd, formData)
      .then(res => {
        let message = res.data.Message
        // console.log(res.data, "res.data-----------Hot Collection-----")
        toast.success(`${message}`, {
          position: toast.POSITION.TOP_CENTER
        });
        navigate("/")

        // console.log(res.data, "res.daata--------------169----------create2------------------")
      })
      .catch(err => {
        // console.log(err)
        // alert('api nhi chl rji hai')
      })

  }


  nftClickHandler(nft) {
    navigate("/ItemDetail", { state: { NFT: nft } })
  }
  render() {
    var settings = {
      infinite: true,
      speed: 500,
      slidesToShow: 4,
      slidesToScroll: 1,
      initialSlide: 0,
      responsive: [
        {
          breakpoint: 1900,
          settings: {
            slidesToShow: 4,
            slidesToScroll: 1,
            infinite: true
          }
        },
        {
          breakpoint: 1600,
          settings: {
            slidesToShow: 4,
            slidesToScroll: 1,
            infinite: true
          }
        },
        {
          breakpoint: 1024,
          settings: {
            slidesToShow: 3,
            slidesToScroll: 1,
            infinite: true
          }
        },
        {
          breakpoint: 600,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 1,
            initialSlide: 2
          }
        },
        {
          breakpoint: 480,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1,
            dots: true
          }
        }
      ]
    };
    return (
      <div className='nft'>
        <Slider {...settings}>
          {this.state.nftList.map((nft, i) => {
            // { console.log("nft:", nft)}
            if (i < 6) {
              return <CustomSlide key={i} className='itm' >
                <div className="d-item">
                  <div className="nft__item">
                    {/* <div className="author_list_pp">
                      <span >
                        <img className="lazy" src="./img/author/author-1.jpg" alt="" />
                        <i className="fa fa-check"></i>
                      </span>
                    </div> */}
                    {/* <div className="author_list_pp">
                      <span >
                        <img className="lazy" src="./img/author/author-1.jpg" alt="" />
                        <i className="fa fa-check"></i>
                      </span>

                    </div> */}
                    <div className="nft__item_wrap" >
                      <Outer>

                        <img src={nft.image}
                          style={{ width: "225px", height: "225px", cursor: "pointer" }}
                          className="lazy nft__item_preview img-responsive cursor-pointer"
                          // onLoad={this.onImgLoad} alt=""
                          onClick={() => `${this.nftClickHandler(nft)}`}
                        />


                      </Outer>
                    </div>
                    <div className="nft__item_info">

                      <div className="nft__item_price">
                        Price - {nft.price} BNB
                      </div>
                      <div className="text-left">
                        <button onClick={() => this.buyNFT(nft)} type="button" className="btn-main"
                        ><span>Buy NFT</span></button>
                      </div>
                      <div className="nft__item_like">
                        <i className="fa fa-heart" />
                      </div>
                    </div>
                  </div>
                </div>
              </CustomSlide>
            }
          })}


        </Slider>
      </div>
    );
  }
}
