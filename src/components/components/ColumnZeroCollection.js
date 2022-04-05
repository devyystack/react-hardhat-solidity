import React, { Component } from "react";
import styled from "styled-components";
import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import axios from 'axios'
import Web3Modal from "web3modal"
import Clock from "./Clock";

// import Image from 'next/image'

import {
    nftmarketaddress, nftaddress
} from '../../config'

import Market from '../../NFTMarket.json'
import NFT from '../../NFT.json'
// import { useNavigate } from "react-router-dom";
import { useNavigate } from "@reach/router"


const Outer = styled.div`
  display: flex;
  justify-content: center;
  align-content: center;
  align-items: center;
  overflow: hidden;
  border-radius: 8px;
`;

export default function ColumnZeroCollection() {
    const [nfts, setNfts] = useState([])
    const [sold, setSold] = useState([])
    const [loadingState, setLoadingState] = useState('not-loaded')
    useEffect(() => {
        loadNFTs()
    }, [])
    async function loadNFTs() {
        const web3Modal = new Web3Modal(
            //     {
            //   network: "mainnet",
            //   cacheProvider: true,
            // }
        )
        const connection = await web3Modal.connect()
        const provider = new ethers.providers.Web3Provider(connection)
        const signer = provider.getSigner()

        const marketContract = new ethers.Contract(nftmarketaddress, Market.abi, signer)
        const tokenContract = new ethers.Contract(nftaddress, NFT.abi, provider)
        const data = await marketContract.fetchItemsCreated()


        console.log(data, "data----------------------")
        const items = await Promise.all(data.map(async i => {
            const tokenUri = await tokenContract.tokenURI(i.tokenId)
            console.log(i.tokenId, "tokenID--------------------")
            console.log(tokenUri, "tokenURI-------------------------------")
            const meta = await axios.get(tokenUri)
            let price = ethers.utils.formatUnits(i.price.toString(), 'ether')
            console.log(meta, "meta------------")
            console.log(price, "price-----------------------")
            let item = {
                price,
                tokenId: i.tokenId.toNumber(),
                seller: i.seller,
                owner: i.owner,
                sold: i.sold,
                image: meta.data.image,
            }
            return item
        }))

        /* create a filtered array of items that have been sold */
        const soldItems = items.filter(i => i.sold)
        setSold(soldItems)
        setNfts(items)
        setLoadingState('loaded')
    }
    const navigate = useNavigate();
    // let navigate = useNavigate(); 
    // const redirect = () =>{ 
    // //   let path = `newPath`; 
    //   navigate('/create2');
    // };
    // function onImgLoad({ target: img }) {
    //     let currentHeight = this.state.height;
    //     if (currentHeight < img.offsetHeight) {
    //         this.setState({
    //             height: img.offsetHeight
    //         })
    //     }
    // }
    console.log(nfts, "nft-------------------------------------------")
    if (loadingState === 'loaded' && !nfts.length) return (<h1 className="py-10 px-20 text-3xl">No assets created</h1>)
    return (
        <div className='row'>
            <h2 className="text-2xl py-2 text-center">My Collections</h2>

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
                                        <button onClick={() => navigate('../create2', { replace: true })} type="button" className="btn-main" 
                                        ><span>Sell</span></button>
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