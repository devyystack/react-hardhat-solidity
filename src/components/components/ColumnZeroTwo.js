import {ethers} from 'ethers';
import styled from "styled-components";
import { useEffect, useState } from 'react';
import axios from 'axios';
import Web3Modal from "web3modal"
import { nftaddress, nftmarketaddress } from '../components/../../config';
import NFT from '../../NFT.json';
import Market from '../../NFTMarket.json';
import { Image } from 'react-bootstrap';

const Outer = styled.div`
  display: flex;
  justify-content: center;
  align-content: center;
  align-items: center;
  overflow: hidden;
  border-radius: 8px;
`;

export default function ColumnZeroTwo() {
    const [nfts, setNfts] = useState([]);
    const [loadingState, setLoadingState] = useState('not-loaded');
  
    useEffect(()=>{
      loadNFTs();
  
    }, []);
  
    async function loadNFTs(){
        const web3Modal = new Web3Modal(
                {
              network: "Rinkeby",
              cacheProvider: true,
            }
        )
        
        const connection = await web3Modal.connect()
        const provider = new ethers.providers.Web3Provider(connection)
      const tokenContract = new ethers.Contract(nftaddress, NFT.abi, provider);
      const marketContract = new ethers.Contract(nftmarketaddress, Market.abi, provider);
  
      //return an array of unsold market items
      const data = await marketContract.fetchMarketItems();
      console.log(data,"data----------44")
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
  
      setNfts(items);
      setLoadingState('loaded')
    }
  
    async function buyNFT(nft){
      const web3Modal = new Web3Modal();
      const connection = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
  
      //sign the transaction
      const signer = provider.getSigner();
      const contract = new ethers.Contract(nftmarketaddress, Market.abi, signer);
  
      //set the price
      const price = ethers.utils.parseUnits(nft.price.toString(), 'ether');
  
      //make the sale
      const transaction = await contract.createMarketSale(nftaddress, nft.tokenId, {
        value: price
      });
      await transaction.wait();
  
      loadNFTs()
    }
  
    if(loadingState === 'loaded' && !nfts.length) return (
      <h1 className="px-20 py-10 text-3xl">No items in market place</h1>
    )
  
    return (
        <div className='row'>
        <h2 className="text-2xl py-2 text-center">NFT BUYING</h2>

        {
            nfts.map((nft, i) => (
                <div className="d-item col-lg-3 col-md-6 col-sm-6 col-xs-12" >

                    <div key={i} className="border shadow rounded-xl overflow-hidden">
                        <div className="nft__item">
                            <div className="author_list_pp">
                                <span onClick={() => window.open(nfts.authorLink, "_self")}>
                                    <img className="lazy" src="./img/author/author-1.jpg" alt="" />
                                    <i className="fa fa-check"></i>
                                </span>
                            </div>
                            <div className="nft__item_wrap">
                                <Outer>
                                    <span>
                                        <img
                                            width={250}
                                            height={300}
                                            // onLoad={this.onImgLoad}
                                            src={nft.image}
                                            className="lazy nft__item_preview"
                                            alt="Picture of the author" />
                                    </span>
                                </Outer>
                            </div>

                            <div className="nft__item_info">
                                {/* <span>nft Name</span> */}

                                <div class="nft__item_price">
                                    Price - {nft.price} Eth
                                </div>
                                <div className="text-left">
                                    <button   onClick={() => buyNFT(nft)} type="button" className="btn-main" 
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