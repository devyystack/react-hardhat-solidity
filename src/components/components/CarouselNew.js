import React, { Component } from "react";
import Slider from "react-slick";
import styled from "styled-components";
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Clock from "./Clock";
import axios from 'axios';
import Web3Modal from "web3modal"
import { nftaddress, nftmarketaddress } from '../components/../../config';
import NFT from '../../NFT.json';
import Market from '../../NFTMarket.json';
import { Image } from 'react-bootstrap';
import { ethers } from 'ethers'
import { Link, useNavigate } from "react-router-dom";
import { navigate } from "@reach/router"
import { Navigate } from 'react-router-dom'





const Outer = styled.div`
  display: flex;
  justify-content: center;
  align-content: center;
  align-items: center;
`;

class CustomSlide extends Component {
    render() {
        const { index, ...props } = this.props;
        return (
            <div {...props}></div>
        );


    }
}
// const { index, ...props } = this.props;
// console.log()

class Responsive extends Component {

    constructor(props) {
        super(props);
        this.state = { timer: { deadline: "January, 10, 2022", deadline1: "February, 10, 2022", deadline2: "February, 1, 2022", height: 0 }, nftList: [], redirect: false };
        this.onImgLoad = this.onImgLoad.bind(this);

    }
    // setRedirect = () => {
      
    //     navigate("/ItemDetail", { state: { color: "red" } })

    // }

    onImgLoad({ target: img }) {
        let currentHeight = this.state.timer.height;
        if (currentHeight < img.offsetHeight) {
            this.setState({
                height: img.offsetHeight
            })
        }
    }
    componentDidMount() {
        this.loadNFTs()

    }


    async loadNFTs() {
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
        console.log(data, "data----------44")
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
        // this.setState({
        //   items
        // })
        // alert('hello')
        this.setState({
            timer: this.state.timer,
            nftList: items,
            // this.setState(items)
            // setNfts(items);
            // setLoadingState('loaded')
        })
    }


    async buyNFT(nft) {
        console.log(nft, "nft----------")
        const web3Modal = await new Web3Modal();
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
    nftClickHandler(nft) {
        // this.setState({
        //     redirect: true
        //   })

        //   localStorage.setItem('SingleNFT', JSON.stringify(nft));

        navigate("/ItemDetail", { state: { NFT: nft } })

        // window.open("/ItemDetail", "_self")
        // useNavigate('/ItemDetail', { replace: true })
        console.log(nft, "ddddddddddddddddddddddddddddddddddd")
    }

    render() {

        var settings = {
            infinite: false,
            speed: 500,
            slidesToShow: 4,
            slidesToScroll: 1,
            initialSlide: 0,
            adaptiveHeight: 300,
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
                        return <CustomSlide key={i} className='itm' >
                            <div className="d-item">
                                <div className="nft__item">
                                    <div className="author_list_pp">
                                        <span onClick={() => window.open(nfts.authorLink, "_self")}>
                                            <img className="lazy" src="./img/author/author-1.jpg" alt="" />
                                            <i className="fa fa-check"></i>
                                        </span>
                                    </div>
                                    <div className="author_list_pp">
                                        <span onClick={() => window.open("/ItemDetail", "_self")}>
                                            <img className="lazy" src="./img/author/author-1.jpg" alt="" />
                                            <i className="fa fa-check"></i>
                                        </span>

                                    </div>
                                    <div className="nft__item_wrap" >
                                        <Outer>

                                            <img src={nft.image}
                                                style={{ maxWidth: 250, maxHeight: 170 }}
                                                className="lazy nft__item_preview img-responsive cursor-pointer"
                                                onLoad={this.onImgLoad} alt=""
                                                onClick={() => `${this.nftClickHandler(nft)}`}
                                            />


                                        </Outer>
                                    </div>
                                    <div className="nft__item_info">

                                        <div className="nft__item_price">
                                            Price - {nft.price} Eth
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
                    })}




                </Slider>
            </div>
        );
    }
}


export default Responsive;