import React, { useEffect, useState } from "react";
import Clock from "../components/Clock";
import Footer from "../components/footer";
import { createGlobalStyle } from "styled-components";
import axios from "axios";
import { ethers } from "ethers";
import { create as ipfsHttpClient } from "ipfs-http-client";
import Web3Modal from "web3modal";
import { NFT, NFT_MARKET, NFT_AUCTION } from "../../constants/contract.config"
// import { nftaddress, nftmarketaddress, auctionaddress } from "../../config";
// import NFT from "../../../src/NFT.json";
// import Market from "../../NFTMarket.json";
// import Auction from "../../Auction.json";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { URLS } from "../app-url";
import { navigate } from "@reach/router";

// import customScript from "../../assets/custom";

import { Helmet } from "react-helmet";
// import { useMoralisFile } from "react-moralis";
// import NftImg from "../../assets/Test_nft.png"
// import * as fs from 'fs/promises';
import * as fs from "fs";
import { useMoralis, useMoralisFile } from "react-moralis";
import Moralis from "moralis";
import Web3 from "web3";
// import { log } from "console";

let WalletADDR = "";

// const client = ipfsHttpClient('https://ipfs.infura.io:5001/api/v0');

const GlobalStyles = createGlobalStyle`
  header#myHeader.navbar.sticky.white {
    background: #403f83;
    border-bottom: solid 1px #403f83;
  }
  header#myHeader.navbar .search #quick_search{
    color: #fff;
    background: rgba(255, 255, 255, .1);
  }
  header#myHeader.navbar.white .btn, .navbar.white a, .navbar.sticky.white a{
    color: #fff;
  }
  header#myHeader .dropdown-toggle::after{
    color: rgba(255, 255, 255, .5);
  }
  header#myHeader .logo .d-block{
    display: none !important;
  }
  header#myHeader .logo .d-none{
    display: block !important;
  }
  @media only screen and (max-width: 1199px) {
    .navbar{
      background: #403f83;
    }
    .navbar .menu-line, .navbar .menu-line1, .navbar .menu-line2{
      background: #fff;
    }
    .item-dropdown .dropdown a{
      color: #fff !important;
    }
  }
  button.disabled{
    background-color: #cad1df;
    pointer-events: none;
    cursor: not-allowed!important;
  } 
`;
toast.configure();

export default function Createpage(props) {
  const POST = props.location.state.NFT;
  const isSell = props.location.state.sell;
  const isAuction = props.location.state.auction;
  const isBid = props.location.state.bid;
  //debugger
  // console.log(POST, "____________create2________");

  const [users, setUsers] = useState({});

  const [fileUrl, setFileUrl] = useState(null);

  const [files, setFiles] = useState([]);
  const [isActive, setIsActive] = useState(false);
  let [loading, setLoading] = useState(false);
  const [imagePath, setImagePath] = useState("");
  // const [tokenID , setTokenID] = useState(null)

  //--------------------------moralis-----------------------------------------------------

  const { error, isUploading, moralisFile, saveFile } = useMoralisFile();
  const { authenticate, isAuthenticated, user } = useMoralis();
  // const { saveFile } = useMoralisFile();

  const [photoFile, setPhotoFile] = useState();
  const [photoFileName, setPhotoFileName] = useState();

  //NEW-------

  // const [walletAddr, setWalletAddr] = useState("");
  // const [post, setPOST] = useState(POST);

  const handleClick = (e) => {
    e.preventDefault();
    const { name, value } = e.target;
    setUsers((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const login = async () => {
    if (!isAuthenticated) {
      await authenticate()
        .then(function (user) {
          // console.log(user.get("ethAddress"));
        })
        .catch(function (error) {
          console.log(error);
        });
    }
  };

  //-------------------------------- moralis ---------------------------------------------//

  const onChange = (e) => {
    var files = e.target.files;
    var filesArr = Array.prototype.slice.call(files);
    document.getElementById("file_name").style.display = "none";
    setFiles(...files, ...filesArr);
  };

  const handleShow = () => {
    document.getElementById("tab_opt_1").classList.add("show");
    document.getElementById("tab_opt_1").classList.remove("hide");
    document.getElementById("tab_opt_2").classList.remove("show");
    document.getElementById("auctionNFTButton").classList.add("hide");
    document.getElementById("auctionNFTButton").classList.remove("show");
    document.getElementById("bidNFTButton").classList.add("hide");
    document.getElementById("bidNFTButton").classList.remove("show");
    document.getElementById("sellNFTButton").classList.add("show");
    document.getElementById("btn1").classList.add("active");
    document.getElementById("btn2").classList.remove("active");
    document.getElementById("btn3").classList.remove("active");
  };
  const handleShow1 = () => {
    document.getElementById("tab_opt_1").classList.add("hide");
    document.getElementById("tab_opt_1").classList.remove("show");
    document.getElementById("tab_opt_2").classList.add("show");
    document.getElementById("auctionNFTButton").classList.add("show");
    document.getElementById("sellNFTButton").classList.add("hide");
    document.getElementById("sellNFTButton").classList.remove("show");
    document.getElementById("bidNFTButton").classList.add("hide");
    document.getElementById("bidNFTButton").classList.remove("show");
    document.getElementById("btn1").classList.remove("active");
    document.getElementById("btn2").classList.add("active");
    document.getElementById("btn3").classList.remove("active");
  };
  const handleShow2 = () => {
    document.getElementById("tab_opt_1").classList.add("show");
    document.getElementById("tab_opt_2").classList.remove("show");
    document.getElementById("tab_opt_2").classList.add("hide");
    document.getElementById("bidNFTButton").classList.add("show");
    document.getElementById("sellNFTButton").classList.add("hide");
    document.getElementById("sellNFTButton").classList.remove("show");
    document.getElementById("auctionNFTButton").classList.add("hide");
    document.getElementById("auctionNFTButton").classList.remove("show");
    document.getElementById("btn1").classList.remove("active");
    document.getElementById("btn2").classList.remove("active");
    document.getElementById("btn3").classList.add("active");
  };

  useEffect(() => {
    if(isSell){
      document.getElementById("btn1").classList.add("active");
      document.getElementById('btn2').hidden=true;
      document.getElementById('btn3').hidden=true;
    }
    if (isAuction) {
      document.getElementById("btn2").classList.add("active");
      document.getElementById('btn1').hidden=true;
      document.getElementById('btn3').hidden=true;
      handleShow1();
    }
    if (isBid == true) {
      document.getElementById('bidNFTButton').classList.add('active');
      document.getElementById('btn2').hidden=true;
      document.getElementById('btn1').hidden=true;

      handleShow2();
    }
   
  }, []);
  const unlockClick = () => {
    setIsActive(true);
  };
  const unlockHide = () => {
    setIsActive(false);
  };

  const fetchImg = async (e) => {
    let url = document.querySelector("#item_image").src;
    return url;
    //  setFileUrl(url)
  };
  // ------testing-------

  // const  WalletADDR =  window.ethereum.request({
  //   method: "eth_requestAccounts",
  // });

  // const addres = WalletADDR[0];
  // setWalletAddr(addres);

  const createTokenFunction = async (url, signer) => {
    let address = NFT.NFT_ADDRESS;
    let abi = NFT.NFT_ABI;
    let signerOrProvider = signer;

    let contract = new ethers.Contract(address, abi, signerOrProvider);

    let transaction = await contract.createToken(url);
    let tx = await transaction.wait();

    // console.log(contract, url, ".........dmm..........");

    if (transaction) {
      await transaction
        .wait()
        .then((data) => {
          // console.log(data, "data--113");
        })
        .catch((err) => {
          // console.log(err.message, "err-115");
          toast.error("Transaction Failed", {
            position: toast.POSITION.TOP_CENTER,
          });
        });
    }

    WalletADDR = tx.from;
    let event = tx.events[0];
    let value = event.args[2];
    let tokenId = value.toNumber();

    return tokenId;
  };

  const sellNFTFunction = async (e) => {
    // debugger
    e.preventDefault();

    try {
      // debugger
      const web3Modal = new Web3Modal();
      const connection = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const signer = provider.getSigner();

      let loggedIn = await login();
      const url2 = await fetchImg();

      let price = document.getElementById("item_price").value;
      const description = POST.nftDiscription;
      const name = POST.nftName;

      setLoading(true);
      //setLoading(false);

      //changing moralish to ipfs


      const object = {
        name: name,
        description: description,
        price: price,
        image: url2,
      };

      const newfile = new Moralis.File("file.json", {
        base64: btoa(JSON.stringify(object)),
      });


      //   const data = JSON.stringify({
      //     name, description, image: fileUrl
      // });

      // debugger
      // const object = JSON.stringify({
      //   name, description, price, image: url2
      // })


      // const added = await client.add(object)
      // const url = `https://ipfs.infura.io/ipfs/${added.path}`
      //pass the url to sav eit on Polygon adter it has been uploaded to IPFS

      // await createSale(url,price)


      //setLoading(false)


      let res = await newfile.saveIPFS();
      //let res = await object.saveIPFS();

      //console.log(res, "save IPFS");

      const url = res._url;
      // const url = res.url
      //console.log(url,"...........abcd.....");

      let tokenId = await createTokenFunction(url, signer);

      // const newPrice = ethers.utils.parseUnits(price, "ether");
      const priceWEI = Web3.utils.toWei(price, "ether");

      const listingPrice = 0.00002;
      const listingPriceWei = Web3.utils.toWei(listingPrice.toString(), "ether");

      const listingPriceETH = ethers.utils.parseUnits(listingPrice.toString(), "ether");

      // console.log(listingPriceWei, listingPriceETH, "Listing Price");

      let contract = new ethers.Contract(NFT_MARKET.NFT_MARKET_ADDRESS, NFT_MARKET.NFT_MARKET_ABI, signer);

      // let listingPrice = await new contract.getListingPrice();
      // listingPrice = listingPrice.toString();
// debugger
      let transaction1 = await contract.createMarketItem(
        NFT.NFT_ADDRESS,
        tokenId,
        priceWEI,
        {
          value: 0
        }
      );

      let tx1 = await transaction1.wait();

      if (transaction1) {
        await transaction1
          .wait()
          .then((data) => {
            // console.log(data, "data--113");

            if (WalletADDR) {
              //debugger;
              const formData = new FormData();
              formData.append("nftPrice", price);
              formData.append("tokenId", tokenId);
              formData.append("ipfsUrl", url);
              formData.append("status", "sell");

              axios
                .patch(
                  `${URLS.pathNftStatus}${WalletADDR.toLowerCase()}/${POST._id}`,
                  formData
                )
                .then((res) => {
                  let message = res.data.Message;
                  // console.log(message,"message------------")
                  toast.success(`${message}`, {
                    position: toast.POSITION.TOP_CENTER,
                  });
                  navigate("/");
                })
                .catch((err) => {
                  console.log(err);
                });
            }
            toast.success("Transaction successfull", {
              position: toast.POSITION.TOP_CENTER,
            });
          })
          .catch((err) => {
            // console.log(err.message, "err-115");
            toast.error("Transaction Failed", {
              position: toast.POSITION.TOP_CENTER,
            });
          });
      }

      setLoading(false);
    } catch (error) {
      console.log(error);
      console.trace(error);
      toast.error("Transaction Failed", {
        position: toast.POSITION.TOP_CENTER,
      });
      setLoading(false);
    }
  };

  const auctionNFTFunction = async (e) => {
    e.preventDefault();
    // debugger;

    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();

    try {
      let loggedIn = await login();
      const url2 = await fetchImg();

      let price = document.getElementById("item_price").value;
      const description = POST.nftDiscription;
      const name = POST.nftName;

      setLoading(true);
      handleShow1();

      const object = {
        name: name,
        description: description,
        price: price,
        image: url2,
      };

      const newfile = new Moralis.File("file.json", {
        base64: btoa(JSON.stringify(object)),
      });
      let res = await newfile.saveIPFS();
      // console.log(res, "save IPFS");

      const url = res._url;

      let nftTokenId = await createTokenFunction(url, signer);

      const contract = new ethers.Contract(NFT_AUCTION.NFT_AUCTION_ADDRESS, NFT_AUCTION.NFT_AUCTION_ABI, signer);

      let dateStamp = new Date(users.startingdate).getTime();
      let dateStamp1 = new Date(users.enddate).getTime();
      const priceWEI = Web3.utils.toWei(price, "ether");

      // console.log(priceWEI, dateStamp, dateStamp1, NFT.NFT_ADDRESS, nftTokenId);

      let transaction = await contract.createTokenAuction(
        NFT.NFT_ADDRESS,
        nftTokenId,
        priceWEI,
        dateStamp,
        dateStamp1,
        {
          gasLimit: 9000000,
        }
      );
      let tx = await transaction.wait();

      if (transaction) {
        await transaction
          .wait()
          .then((data) => {
            // console.log(data, "data--113");

            if (WalletADDR) {
              //debugger;
              const formData = new FormData();
              formData.append("nftPrice", price);
              formData.append("tokenId", nftTokenId);
              formData.append("ipfsUrl", url);
              formData.append("startDate", users.startingdate);
              formData.append("endDate", users.enddate);
              formData.append("status", "Auction");

              // console.log(POST._id, "post iddd");

              axios
                .patch(
                  `${URLS.pathNftStatus}${WalletADDR.toLowerCase()}/${POST._id}`,
                  formData
                )
                .then((res) => {
                  let message = res.data.Message;
                  toast.success(`${message}`, {
                    position: toast.POSITION.TOP_CENTER,
                  });
                  navigate("/");
                })
                .catch((err) => {
                  console.log(err);
                });
            }

            toast.success("Auction successfull", {
              position: toast.POSITION.TOP_CENTER,
            });
            setLoading(false);
            handleShow1();
          })
          .catch((err) => {
            // console.log(err.message, "err-115");
            toast.error("Transaction Failed", {
              position: toast.POSITION.TOP_CENTER,
            });
          });
      }


    } catch (error) {
      // console.log(error);
      // console.trace(error);
      toast.error("Auction failed", {
        position: toast.POSITION.TOP_CENTER,
      });
      setLoading(false);
      handleShow1();
    }
  };

  const bidNFTFunction = async (e) => {
    e.preventDefault();
    // debugger

    try {
      const web3Modal = new Web3Modal();
      const connection = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const signer = provider.getSigner();

      let loggedIn = await login();
      const url2 = await fetchImg();

      let price = document.getElementById("item_price").value;
      const description = POST.nftDiscription;
      const name = POST.nftName;

      setLoading(true);
      handleShow2();

      const object = {
        name: name,
        description: description,
        price: price,
        image: url2,
      };

      const newfile = new Moralis.File("file.json", {
        base64: btoa(JSON.stringify(object)),
      });
      let res = await newfile.saveIPFS();
      // console.log(res, "save IPFS");

      const url = res._url;

      // let tokenId = await createTokenFunction(url, signer);

      const newPrice = ethers.utils.parseUnits(price, "ether");
      // const newprice = ethers.utils.parseUnits(nft.price.toString(), 'ether');

      const priceWEI = Web3.utils.toWei(price, "ether");
      // debugger;
      let contract = new ethers.Contract(NFT_AUCTION.NFT_AUCTION_ADDRESS, NFT_AUCTION.NFT_AUCTION_ABI, signer);

      let bid = price;
      let _nft = NFT.NFT_ADDRESS;
      let _tokenId = POST.tokenId;

      // console.log("bid;",bid);
      // console.log("_nft:",_nft);
      // console.log("_tokenId:",_tokenId);

      

      let bidding = await contract.bid(_nft, _tokenId, {
        value: ethers.utils.parseEther(bid.toString()),
      });

      let tx = await bidding.wait();

      if (bidding) {
        await bidding
          .wait()
          .then((data) => {
            // console.log(data, "data--113");
          })
          .catch((err) => {
            // console.log(err.message, "err-115");
            toast.error("Transaction Failed", {
              position: toast.POSITION.TOP_CENTER,
            });
          });
      }

      toast.success("Bidding successfull", {
        position: toast.POSITION.TOP_CENTER,
      });

      setLoading(false);
      handleShow2();
    } catch (error) {
      toast.error("Bidding failed", {
        position: toast.POSITION.TOP_CENTER,
      });
      console.log(error);
      console.trace(error);
      setLoading(false);
      handleShow2();
    }
  };

  async function createItem() {
    //debugger;
    await login();

    const url2 = await fetchImg();
    // setFileUrl(url2)

    // const name = document.getElementById("item_title").value;
    // const description = document.getElementById("item_desc").value;
    let price = document.getElementById("item_price").value;
    const description = POST.nftDiscription;
    const name = POST.nftName;
    // const { name, description, price } = formInput; //get the value from the form input

    //form validation
    if (!name || !description || !price) {
      // toast.warn("All Fields are Required !", {
      //     position: toast.POSITION.TOP_CENTER
      //   });
      // return
    }

    setLoading(true);

    const data = JSON.stringify({
      // name, description, price, image: fileUrl
      name,
      description,
      price,
      image: url2,
    });

    const object = {
      name: name,
      description: description,
      price: price,
      image: url2,
    };
    // debugger
    const newfile = new Moralis.File("file.json", {
      base64: btoa(JSON.stringify(object)),
    });
    let res = await newfile.saveIPFS();
    // console.log(res._url, "-----------------RES MORALIS----------------")

    try {
      const url = res._url;
      // console.log(url, "----------------- MORALIS----URL------------")

      let nftTokenId = await createSale(url, price);
      // console.log(nftTokenId, "token-jjhhhhhhhhh----------------");

      await createAuction(price, nftTokenId);

      // console.log(url, "moralis-------url------------------381--------------");
      setLoading(false);

      if (WalletADDR) {
        //debugger
        const formData = new FormData();
        // console.log(nftTokenId, "-----------------------------tokren ")
        formData.append("nftPrice", price);
        formData.append("tokenId", nftTokenId);
        formData.append("ipfsUrl", url);
        formData.append("status", "sell");

        // debugger
        axios
          .patch(
            `${URLS.pathNftStatus}${WalletADDR.toLowerCase()}/${POST._id}`,
            formData
          )
          .then((res) => {
            let message = res.data.massage;
            // console.log(res.data, "res.data----------------")
            toast.success(`${message}`, {
              position: toast.POSITION.TOP_CENTER,
            });
            navigate("/");

            // console.log(res.data, "res.daata--------------169----------create2------------------")
          })
          .catch((err) => {
            console.log(err);
            // alert('api nhi chl rji hai')
          });
      }
    } catch (error) {
      // console.log(`Error uploading file: `, error);
      toast.error("Transaction Failed", {
        position: toast.POSITION.TOP_CENTER,
      });
      setLoading(false);
    }
  }

  //2. List item for sale
  async function createSale(url, NP) {
    // debugger
    const web3Modal = new Web3Modal();
    // {
    //     network: "Rinkeby",
    //     cacheProvider: true,
    // }
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);

    //sign the transaction
    const signer = provider.getSigner();
    let contract = new ethers.Contract(NFT.NFT_ADDRESS, NFT.NFT_ABI, signer);
    let transaction = await contract.createToken(url);
    let tx = await transaction.wait();

    if (transaction) {
      await transaction
        .wait()
        .then((data) => {
          // console.log(data, "data--113");
        })
        .catch((err) => {
          // console.log(err.message, "err-115");
          toast.error("Transaction Failed", {
            position: toast.POSITION.TOP_CENTER,
          });
        });
    }

    //get the tokenId from the transaction that occured above
    //there events array that is returned, the first item from that event
    //is the event, third item is the token id.
    // console.log('Transaction: ', tx)
    // console.log('Transaction events: ', tx.events[0])
    WalletADDR = tx.from;
    // console.log(WalletADDR, "ss............ss.............");
    let event = tx.events[0];
    let value = event.args[2];
    let tokenId = value.toNumber(); //we need to convert it a number
    // setTokenID(tokenId)
    // console.log(setTokenID,"-----------setTokenID----------")
    // console.log(tokenID,"-----------tokenID----------")

    // console.log(tokenId, "tokenId---------------tokenIdtokenId-------------------")
    //get a reference to the price entered in the form
    const price = ethers.utils.parseUnits(NP, "ether");

    contract = new ethers.Contract(NFT_MARKET.NFT_MARKET_ADDRESS, NFT_MARKET.NFT_MARKET_ABI, signer);

    //get the listing price
    // let listingPrice = await contract.getListingPrice();
    // listingPrice = listingPrice.toString();
    //  let  listingPrice = '1'

    transaction = await contract.createMarketItem(NFT.NFT_ADDRESS, tokenId, price, {
      value: price,
      gasLimit: 3000000,
    });
    // console.log(transaction, "transaction--------------------------")

    if (transaction) {
      await transaction
        .wait()
        .then((data) => {
          // console.log(data, "data--113");
        })
        .catch((err) => {
          // console.log(err.message, "err-115");
          toast.error("Transaction Failed", {
            position: toast.POSITION.TOP_CENTER,
          });
        });
    }
    // await transaction.wait()
    // console.log(transaction, "transaction----------111111111111----------------")

    return tokenId;
  }

  //

  return (
    <div>
      <Helmet>
        {/* <script src={`${customScript}`}></script> */}
      </Helmet>

      <GlobalStyles />

      <section
        className="jumbotron breadcumb no-bg"
        style={{ backgroundImage: `url(${"./img/background/subheader.jpg"})` }}
      >
        <div className="mainbreadcumb">
          <div className="container">
            <div className="row m-10-hor">
              <div className="col-12">
                <h1 className="text-center">List Item for Sell</h1>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container">
        <div className="row">
          <div className="col-lg-7 offset-lg-1 mb-5">
            <form id="form-create-item" className="form-border" action="#">
              <div className="field-set">
                <div className="spacer-single"></div>

                <h5>Select method</h5>

                <div className="de_tab tab_methods">
                  <ul className="de_nav">
                    <li id="btn1" className="active" onClick={handleShow}>
                      <span>
                        <i className="fa fa-tag"></i>Fixed price
                      </span>
                    </li>
                    <li id="btn2" onClick={handleShow1}>
                      <span>
                        <i className="fa fa-hourglass-1"></i>Timed auction
                      </span>
                    </li>
                    <li id="btn3" onClick={handleShow2}>
                      <span>
                        <i className="fa fa-users"></i>Open for bids
                      </span>
                    </li>
                  </ul>

                  <div className="de_tab_content pt-3">
                    {/* <div id="tab_opt_1">
                      <h5>Price</h5>
                      <input type="text" name="item_price" id="item_price" className="form-control" placeholder="enter price for one item (ETH)" />
                    </div> */}

                    <div id="tab_opt_2" className="hide">
                      {/* <h5>Minimum bid</h5>
                      <input
                        type="text"
                        name="item_price_bid"
                        id="item_price_bid"
                        className="form-control"
                        placeholder="enter minimum bid"
                      /> */}

                      <div className="spacer-20"></div>

                      <div className="row">
                        <div className="col-md-6">
                          <h5>Starting date</h5>
                          <input
                            type="date"
                            name="startingdate"
                            id="bid_starting_date"
                            className="form-control"
                            onChange={handleClick}
                            min="1997-01-01"
                          />
                        </div>
                        <div className="col-md-6">
                          <h5>Expiration date</h5>
                          <input
                            type="date"
                            name="enddate"
                            id="bid_expiration_date"
                            className="form-control"
                            onChange={handleClick}
                          />
                        </div>
                      </div>
                    </div>

                    <div id="tab_opt_3"></div>
                  </div>
                </div>

                <div className="spacer-20"></div>
                {/* 
                <div className="switch-with-title">
                  <h5><i className="fa fa- fa-unlock-alt id-color-2 mr10"></i>Unlock once purchased</h5>
                  <div className="de-switch">
                    <input type="checkbox" id="switch-unlock" className="checkbox" />
                    {isActive ? (
                      <label htmlFor="switch-unlock" onClick={unlockHide}></label>
                    ) : (
                      <label htmlFor="switch-unlock" onClick={unlockClick}></label>
                    )}
                  </div>
                  <div className="clearfix"></div>
                  <p className="p-info pb-3">Unlock content after successful transaction.</p>

                  {isActive ?
                    <div id="unlockCtn" className="hide-content">
                      <input type="text" name="item_unlock" id="item_unlock" className="form-control" placeholder="Access key, code to redeem or link to a file..." />
                    </div>
                    : null}
                </div> */}

                <div id="tab_opt_1">
                  <h5>NFT Name</h5>
                  <input
                    type="text"
                    defaultValue={POST.nftName}
                    name="item_title"
                    id="item_title"
                    className="form-control"
                    placeholder="e.g. 'Crypto Funk"
                    disabled
                  />
                </div>

                <div className="spacer-10"></div>

                <h5>Description</h5>
                <textarea
                  data-autoresize
                  name="item_desc"
                  defaultValue={POST.nftDiscription ? POST.nftDiscription : POST.description}
                  id="item_desc"
                  className="form-control"
                  placeholder="e.g. 'This is very limited item'"
                  disabled
                ></textarea>

                <div className="spacer-10"></div>

                <h5>Price</h5>
                <input
                  defaultValue={POST.nftPrice}
                  type="text"
                  name="nftPrice"
                  id="item_price"
                  className="form-control"
                  placeholder="Enter price for one item (BNB)"
                  onChange={handleClick}
                />

                <div className="spacer-10"></div>

                {/* <input
                  type="file"
                  name="Asset"
                  className="my-4 form-control" id="item_image"
                  onChange={onSelectFile}
                /> */}
                {/* <div className="profile-pic-container">
                  <input className="form-control" type="file" accept="image/*" multiple="false" id="profilePhoto" onChange={onChangePhoto} />
                </div>

                <input type="sumbit" value="Upload" className="btn btn-primary btn-block mt-1" onClick={onSubmitPhoto} /> */}

                <div
                  style={{
                    height: "100px",
                    width: "100px",
                    borderRadius: "50%",
                    marginBottom: 16,
                  }}
                >
                  <img
                    id="item_image"
                    style={{
                      height: 100,
                      width: 100,
                      objectFit: "cover",
                      borderRadius: 50,
                    }}
                    src={POST.imagePath}
                  ></img>
                </div>
                {/* <h5>Royalties</h5>
                <input type="text" name="item_royalties" id="item_royalties" className="form-control" placeholder="suggested: 0, 10%, 20%, 30%. Maximum is 70%" /> */}

                {/* <div className="spacer-10"></div> */}

                {/* <input type="button" id="submit" className="btn-main" value="Complete Listing" onClick={createItem}/> */}
                <button
                  type="button"
                  id="sellNFTButton"

                  className={`btn-main ${loading ? "disabled" : ""}`}
                  value="Create NFT"
                  // onClick={(e) => `${sellNFTFunction(e)}`}
                  onClick={sellNFTFunction}
                  style={{
                    display: "flex",
                    alignItems: "center",
                  }}
                // disabled={formInput}
                // onClick={hendleloading}
                >
                  {" "}
                  Sell Nft
                  {loading ? (
                    <span
                      className="spinner-border"
                      role="status"
                      style={{
                        display: "inline-block",
                        margin: "0 14px",
                        width: "1rem",
                        height: "1rem",
                      }}
                    >
                      <span className="sr-only">Loading...</span>
                    </span>
                  ) : (
                    ""
                  )}
                </button>

                <button
                  type="button"
                  id="auctionNFTButton"
                  className={`btn-main ${loading ? "disabled" : ""}`}
                  value="Create NFT"
                  onClick={auctionNFTFunction}
                  style={{
                    display: "none",
                    alignItems: "center",
                  }}
                // disabled={formInput}
                // onClick={hendleloading}
                >
                  {" "}
                  Auction
                  {loading ? (
                    <span
                      className="spinner-border"
                      role="status"
                      style={{
                        margin: "0 14px",
                        width: "1rem",
                        height: "1rem",
                      }}
                    >
                      <span className="sr-only">Loading...</span>
                    </span>
                  ) : (
                    ""
                  )}
                </button>

                <button
                  type="button"
                  id="bidNFTButton"
                  className={`btn-main ${loading ? "disabled" : ""}`}
                  value="Create NFT"
                  onClick={bidNFTFunction}
                  style={{
                    display: "none",
                    alignItems: "center",
                  }}
                // disabled={formInput}
                // onClick={hendleloading}
                >
                  {" "}
                  Bid NFT
                  {loading ? (
                    <span
                      className="spinner-border"
                      role="status"
                      style={{
                        margin: "0 14px",
                        width: "1rem",
                        height: "1rem",
                      }}
                    >
                      <span className="sr-only">Loading...</span>
                    </span>
                  ) : (
                    ""
                  )}
                </button>
              </div>
            </form>
          </div>

          <div className="col-lg-3 col-sm-6 col-xs-12">
            <h5>Preview item</h5>
            <div className="nft__item m-0">
              <div className="de_countdown">
                <Clock deadline="December, 30, 2021" />
              </div>
              <div className="author_list_pp">
                {/* <span>
                  <img
                    className="lazy"
                    src="./img/author/author-1.jpg"
                    alt=""
                  />
                  <i className="fa fa-check"></i>
                </span> */}
              </div>
              <div className="nft__item_wrap">
                <span>
                  <img
                    // src="./img/collections/coll-item-3.jpg"
                    src={POST.imagePath}
                    id="get_file_2"
                    className="lazy nft__item_preview"
                    alt=""
                  />
                </span>
              </div>
              <div className="nft__item_info">
                <span>
                  <h4>{POST.nftName}</h4>
                </span>
                <div className="nft__item_price">
                {POST.nftPrice} BNB
                </div>
                <div className="nft__item_action">
                  <span>Place a bid</span>
                </div>
                <div className="nft__item_like">
                  <i className="fa fa-heart"></i>
                  <span>50</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

// ||||||||||||||||||||||||||||||||||||||||||||||||\

// const fetchImg = async (e) => {

//   //

//   let url = document.querySelector("#item_image").src

//   const toDataURL = url => fetch(url,{  headers: {
//     'Access-Control-Allow-Origin': '*'
//   }})
//     .then(response => response.blob())
//     .then(blob => new Promise((resolve, reject) => {
//       const reader = new FileReader()
//       reader.onloadend = () => resolve(reader.result)
//       reader.onerror = reject
//       reader.readAsDataURL(blob)
//     }))

//   function dataURLtoFile(dataurl, filename) {
//     var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
//       bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
//     while (n--) {
//       u8arr[n] = bstr.charCodeAt(n);
//     }
//     return new File([u8arr], filename, { type: mime });
//   }

//   const fileArr = [];
//   await toDataURL(url)
//     .then(dataUrl => {
//       //  console.log('Here is Base64 Url', dataUrl)
//       var fileData = dataURLtoFile(dataUrl, "imageName.jpg");
//       //  console.log("Here is JavaScript File Object",fileData)
//       fileArr.push(fileData)
//       //  file2 = fileData
//     })
//   //
//   // console.log(fileArr)

//   // let fileData = event.target.files[0];
//   // console.log(fileData,"file data")
//   // console.log(file2,"file2")
//   // setImagePath(fileData)
//   // const file = e.target.files[0]
//   const file = fileArr[0]

//   // console.log(file)
//   try { //try uploading the file
//     const added = await client.add(
//       file,
//       {
//         progress: (prog) => console.log(`received: ${prog}`)
//       }
//     )
//     //file saved in the url path below
//     const url = `https://ipfs.infura.io/ipfs/${added.path}`
//     // const url = `https://ipfs.infura.io/ipfs/QmZpreUMt86tRfx4h6K61FhfoYjuqV3eCQ9vewgzGezVyi`

//     // alert(url)
//     setFileUrl(url)
//   } catch (e) {
//     console.log('Error uploading file: ', e)
//   }
// }

// //

// <div style={{height:"100px",width:"100px",borderRadius:"50%",marginBottom:16}}>
//                 <img  style={{height:100,width:100,objectFit:"cover",borderRadius:50} }src={POST.imagePath}></img>
//               </div>
//
// |||||||||||||||||||||||||||||||||||||||||||
