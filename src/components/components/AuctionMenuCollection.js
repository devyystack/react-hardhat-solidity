import { ethers } from 'ethers';
import styled from "styled-components";
import { useEffect, useState } from 'react';
import axios from 'axios';
import Web3Modal from "web3modal"
// import { nftaddress, nftmarketaddress } from '../../config';
// import NFT from '../../NFT.json';
// import {NFT} from '../../constants';
// import Market from '../../NFTMarket.json';
import { NFT_MARKET ,NFT} from '../../constants/contract.config';
import { Image } from 'react-bootstrap';
import { navigate } from "@reach/router"
import { URLS } from '../app-url'


const Outer = styled.div`
  display: flex;
  justify-content: center;
  align-content: center;
  align-items: center;
  overflow: hidden;
  border-radius: 8px;
`;

export default function AuctionMenuCollection() {
  const [nfts, setNfts] = useState([]);
  const [sold, setSold] = useState([]);
  const [loadingState, setLoadingState] = useState('not-loaded');
  const [accountAddress, setAccountAddress] = useState("");
  const [posts, setPosts] = useState([]);





  const fetchData = (user_account) => {
    // debugger
    // console.log("-----------------------user_account-----------------------")
    // console.log(user_account, "ddddddddddd 32")
    // console.log(URLS.getProfileData + "/" + user_account)

    fetch(URLS.getOwnedCollection + "/" + user_account, {
      "method": "GET", "headers": { "Access-Control-Allow-Origin": "*" }
    })
      .then(res => {

        // console.log('res', res)

        res.json().then((data) => {

          // toast.success(`${JSON.stringify(data.massage)}`, {
          //   position: toast.POSITION.TOP_CENTER
          // });
          // document.getElementById("form-create-item").reset();
          // console.log(data.result[0].firstName,"data.result[1].firstName----------------------------")
          // const Name = data.result[0].firstName
          // const lastName = data.result[0].lastName
          // const walletAddr = data.result[0].walletAddress
          // const imgPth = data.result[0].imagePath

          // let user_info = {"name":Name, "lastName":lastName, "walletAddress": walletAddr, "imgPth":imgPth}
          // setNotes(user_info)
          // console.log(Name,walletAddr,imgPth,"111------------------------------------111-------------------------")
        })


        const fetchDetails = URLS.getProfileData + "/" + user_account
        let fetchDetailsmore = fetchDetails.result
        // console.log(fetchDetailsmore, "1111111111111111111111111111111111111111111111111111111111")

        // console.log(fetchDetails, "bcjbdkjcbkjsdbskj-----------------------------n nan c ask0---------------------")
      }).catch(err => console.log(err))
  }


  //------------GetOnSaleNft Api and Function ------------------------------------- //

  async function getAccount() {
    let accounts;
    try {
      accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      // console.log("---------------------------------------yee---------------------------------------")
      const account = accounts[0];

      // console.log(account, "cnklsdnvklsdnvlsdncsdcklnl")
      return account;
      // if (typeof window !== "undefined") {
      //   getAccount().then((response) => {
      //     setAccountAddress(response);
      //   });
      // }
    } catch (error) {
      // toast.warn("Please Install Metamask Wallet Extension !", {
      //   position: toast.POSITION.TOP_CENTER
      // });
      // alert("Please Install Metamask Wallet Extension")
      console.log(error);
    }
  }

  const onSaleNFTFunction = () => {
    if (typeof window !== "undefined") {
      getAccount().then((response) => {
        setAccountAddress(response);
        axios
          .get(URLS.getOnAuctionNFTCollection + "/" + response)
          // .get(`http://3.133.29.104:8000/app/getCollection/${response}`)
          .then((res) => {
            setPosts(res.data.result);
            // setCatFilter(res.data.result)


            // console.log(
            //   res.data.result,
            //   "---------------------get sale collection data response------89--"
            // );
          })
          .catch((err) => {
            // console.log(err);
          });
      });
    }
  };
  useEffect(() => {
    onSaleNFTFunction();
  }, []);

  //------------GetOnSaleNft Api and Function ------------------------------------- //


  // async function loadNFTs() {
  //   const web3Modal = new Web3Modal(
  //     // {
  //     //   network: "Rinkeby",
  //     //   cacheProvider: true,
  //     // }
  //   )

  //   let connection
  //   try {
  //     connection = await web3Modal.connect()
  //     console.log(connection,"connection----------------------");
  //     const provider = new ethers.providers.Web3Provider(connection)
  //     // let provider = new ethers.providers.JsonRpcProvider("https://rinkeby.infura.io/v3/69b84db4409b48ccb999399d5d5244b0");

  //     // const provider = new ethers.providers.Web3Provider(window.ethereum)
  //     console.log(provider,"provider-------")

  //     console.log(window.ethereum,"window.ethereum-------")


  //     const tokenContract = new ethers.Contract(nftaddress, NFT.abi, provider);
  //     const marketContract = new ethers.Contract(nftmarketaddress, Market.abi, provider);
  //     // console.log(marketContract)
  //     marketContract.fetchMarketItems().then(data => {
  //       console.log(data,"data----101")
  //     }).catch(err => {
  //       console.log(err)
  //     })

  //     //return an array of unsold market items
  //     const data = await marketContract.fetchMarketItems();
  //     console.log(data, "data----------108")
  //     const items = await Promise.all(data.map(async i => {
  //       const tokenUri = await tokenContract.tokenURI(i.tokenId);
  //       const meta = await axios.get(tokenUri);
  //       let price = ethers.utils.formatUnits(i.price.toString(), 'ether')
  //       let item = {
  //         price,
  //         tokenId: i.tokenId.toNumber(),
  //         seller: i.seller,
  //         owner: i.owner,
  //         image: meta.data.image,
  //         name: meta.data.name,
  //         description: meta.data.description,
  //       }
  //       return item;
  //     }));
  //     setNfts(items)
  //     // console.log(items)
  //     this.setState({
  //       timer: this.state.timer,
  //       nftList: items,
  //     })
  //   }
  //   catch (err) {
  //     // alert(err)
  //   }




  // }


  async function buyNFT(nft) {
    // debugger
    // console.log(nft, "--------------nft---------------------")

    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);

    //sign the transaction
    const signer = provider.getSigner();
    const contract = new ethers.Contract(NFT_MARKET.NFT_MARKET_ADDRESS, NFT_MARKET.NFT_MARKET_ABI, signer);

    //set the price
    const price = ethers.utils.parseUnits(nft.nftPrice.toString(), 'ether');

    //make the sale
    const transaction = await contract.createMarketSale(NFT.NFT_ADDRESS, nft.tokenId, {
      value: price,
      gasLimit: 3000000,
      // gasPrice: 8000000
    }).catch(err => {
      // console.log(err.message, "err.msg-------110")
    })
    if (transaction) {
      await transaction.wait().then(data => {
        // console.log(data, "data--113")
      }).catch(err => {
        // console.log(err.message, "err-115")
      });
    }
    // loadNFTs()
    //     const walletAdr = nft.seller;
    // console.log(walletAdr,"walletcbjdbfjsbdjckjsd----------")

  }
  async function nftClickHandler(nft) {


    navigate("/ItemDetail", { state: { NFT: nft } })
    // console.log(nft, "ColumnZeroTwo---- Nft---------  224-----40")
  }

  if (loadingState === 'loaded' && !nfts.length) return (
    <h1 className="px-20 py-10 text-3xl">No items in market place</h1>
  )

  const bidNFT = (nft)=> {
    // console.log(nft);
    navigate('/create2', {
        state:{
            NFT: nft,
            bid: true, 
        }
    })
  }

  return (

    <div className='row'>
      <h2 className="text-2xl py-2 text-center">NFT AUCTION </h2>

      {
        posts?.map((nft, i) => (
          <div className="d-item col-lg-3 col-md-6 col-sm-6 col-xs-12" >

            <div key={i} className="border shadow rounded-xl overflow-hidden">
              <div className="nft__item">
                {/* <div className="author_list_pp">
                                  <span >
                                      <img className="lazy" src="./img/author/author-1.jpg" alt="" />
                                      <i className="fa fa-check"></i>
                                  </span>
                              </div> */}
                <div className="nft__item_wrap">
                  <Outer>
                    <span>
                      <img
                        width={250}
                        height={300}
                        // onLoad={this.onImgLoad}
                        src={nft.imagePath}
                        className="lazy nft__item_preview"
                        style={{ cursor: "pointer" }}
                        alt="Picture of the author"
                        onClick={() => `${nftClickHandler(nft)}`}
                      />

                    </span>
                  </Outer>
                </div>

                <div className="nft__item_info pb-3">
                  <span>{nft.nftName}</span>

                  <div className="nft__item_price">
                    Price - {nft.nftPrice} BNB
                  </div>
                  <div className="text-left">
                    <button onClick={() => bidNFT(nft)} type="button" className="btn-main"
                    ><span>BID</span></button>
                  </div>
                  {/* <div className="nft__item_like">
                    <i className="fa fa-heart" />

                  </div> */}

                </div>
              </div>
            </div>
          </div>
        ))
      }

    </div>
    // <div className='row'>
    //   <h2 className="text-2xl py-2 text-center">NFT BUYING </h2>

    //   {
    //     nfts.map((nft, i) => (
    //       <div className="d-item col-lg-3 col-md-6 col-sm-6 col-xs-12" >

    //         <div key={i} className="border shadow rounded-xl overflow-hidden">
    //           <div className="nft__item">
    //             {/* <div className="author_list_pp">
    //                                 <span >
    //                                     <img className="lazy" src="./img/author/author-1.jpg" alt="" />
    //                                     <i className="fa fa-check"></i>
    //                                 </span>
    //                             </div> */}
    //             <div className="nft__item_wrap">
    //               <Outer>
    //                 <span>
    //                   <img
    //                     width={250}
    //                     height={300}
    //                     // onLoad={this.onImgLoad}
    //                     src={nft.image}
    //                     className="lazy nft__item_preview"
    //                     style={{ cursor: "pointer" }}
    //                     alt="Picture of the author"
    //                     onClick={() => `${nftClickHandler(nft)}`}
    //                   />

    //                 </span>
    //               </Outer>
    //             </div>

    //             <div className="nft__item_info">
    //               {/* <span>nft Name</span> */}

    //               <div className="nft__item_price">
    //                 Price - {nft.price} Eth
    //               </div>
    //               <div className="text-left">
    //                 <button onClick={() => buyNFT(nft)} type="button" className="btn-main"
    //                 ><span>Buy NFT</span></button>
    //               </div>
    //               <div className="nft__item_like">
    //                 <i className="fa fa-heart" />

    //               </div>

    //             </div>
    //           </div>
    //         </div>
    //       </div>
    //     ))
    //   }

    // </div>
  )
}