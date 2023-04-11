import { ethers } from 'ethers';
import styled from "styled-components";
import { useEffect, useState } from 'react';
import axios from 'axios';
import Web3Modal from "web3modal"
// import { nftaddress, nftmarketaddress } from '../components/../../config';
import {NFT, NFT_MARKET } from '../../constants/contract.config';
// import NFT from '../../NFT.json';
// import Market from '../../NFTMarket.json';
import { Image } from 'react-bootstrap';
import { navigate } from "@reach/router"


const Outer = styled.div`
  display: flex;
  justify-content: center;
  align-content: center;
  align-items: center;
  overflow: hidden;
  border-radius: 8px;
`;

export default function TopUserNftData(walletAddress) {
  // const USEDATA  = props.location.state.USERADDRESS;
  // console.log(walletAddress.wadd,"userDATA11111111111111111111111-------------------------------------")

  const [nfts, setNfts] = useState([]);
  const [sold, setSold] = useState([]);
  const [loadingState, setLoadingState] = useState('not-loaded');

  useEffect(() => {

    loadNFTs();

  }, []);

  async function loadNFTs() {
    const web3Modal = new Web3Modal(
      {
        network: "Rinkeby",
        cacheProvider: true,
      }
    )

    let connection
    try {
      connection = await web3Modal.connect()
      const provider = new ethers.providers.Web3Provider(connection)
      // let provider = new ethers.providers.JsonRpcProvider("https://rinkeby.infura.io/v3/69b84db4409b48ccb999399d5d5244b0");

      // const provider = new ethers.providers.Web3Provider(window.ethereum)
      // console.log(await web3.eth.getAccounts(), "provider-accounts--------")
      const tokenContract = new ethers.Contract(NFT.NFT_ADDRESS, NFT.NFT_ABI, provider);
      const marketContract = new ethers.Contract(NFT_MARKET.NFT_MARKET_ADDRESS, NFT_MARKET.NFT_MARKET_ABI, provider);
      // console.log(marketContract)
      const data = [];
      await marketContract.fetchMarketItems().then(d => {
        if (d) {
          d.forEach(dd => {
            if (dd.seller.toLowerCase() == walletAddress.wadd.toLowerCase())
              data.push(dd)

          })
        }
      }).catch(err => {
        console.log(err)
      })

      //return an array of unsold market items
      // const ALLDATA = await marketContract.fetchMarketItems();
      // const data = ALLDATA.map((d) => {
      //   // console.log({sallet:d.seller.toLowerCase()})
      //   // console.log({address:walletAddress.wadd.toLowerCase()})
      //   // console.log(d.seller.toLowerCase() == walletAddress.wadd.toLowerCase())

      //   if (d.seller.toLowerCase() == walletAddress.wadd.toLowerCase()){
      //     console.log(true)
      //     return d;
      //   }


      // })

      console.log({ contracts_data: data })
      // console.log(data, "data----------44")
      const items = await Promise.all(data.map(async i => {
        const tokenUri = await tokenContract.tokenURI(i.tokenId);
        const meta = await axios.get(tokenUri);
        let price = ethers.utils.formatUnits(i.price.toString(), 'ether')
        let item = {
          price,
          tokenId: i.tokenId.toNumber(),
          seller: i.seller,
          owner: i.owner,
          image: meta.data.image,
          name: meta.data.name,
          description: meta.data.description,
        }
        return item;
      }));
      setNfts(items)
      // console.log(items)
      this.setState({
        timer: this.state.timer,
        nftList: items,
      })
    }
    catch (err) {
      // alert(err)
    }




  }


  async function buyNFT(nft) {
    // debugger
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);

    //sign the transaction
    const signer = provider.getSigner();
    const contract = new ethers.Contract(NFT_MARKET.NFT_MARKET_ADDRESS, NFT_MARKET.NFT_MARKET_ABI, signer);

    //set the price
    const price = ethers.utils.parseUnits(nft.price.toString(), 'ether');

    //make the sale
    const transaction = await contract.createMarketSale(NFT.NFT_ADDRESS, nft.tokenId, {
      value: price,
      gasLimit: 3000000,
      // gasPrice: 8000000
    }).catch(err => {
      console.log(err.message, "err.msg-------110")
    })
    if(transaction){
    await transaction.wait().then(data => {
      // console.log(data, "data--113")
    }).catch(err => {
      // console.log(err.message, "err-115")
    });
  }
    loadNFTs()
  }
  async function nftClickHandler(nft) {


    navigate("/ItemDetail", { state: { NFT: nft } })
    // console.log(nft, "ColumnZeroTwo---- Nft--------------40")
  }


  if (loadingState === 'loaded' && !nfts.length) return (
    <h1 className="px-20 py-10 text-3xl">No items in market place</h1>
  )

  return (
    <div className='row'>
      <h2 className="text-2xl py-2 text-center">NFT BUYING </h2>

      {
        nfts?.map((nft, i) => (
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
                        src={nft.image}
                        className="lazy nft__item_preview"
                        style={{ cursor: "pointer" }}
                        alt="Picture of the author"
                        onClick={() => `${nftClickHandler(nft)}`}
                      />

                    </span>
                  </Outer>
                </div>

                <div className="nft__item_info">
                  {/* <span>nft Name</span> */}

                  <div className="nft__item_price">
                    Price - {nft.price} BNB
                  </div>
                  <div className="text-left">
                    <button onClick={() => buyNFT(nft)} type="button" className="btn-main"
                    ><span>Buy NFT</span></button>
                  </div>
                  <div className="nft__item_like">
                    <i className="fa fa-heart" />

                  </div>

                </div>
              </div>
            </div>
          </div>
        ))
      }

    </div>
  )
}