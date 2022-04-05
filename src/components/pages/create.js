
import React, { useState } from 'react'
import { ethers } from 'ethers'
import { create as ipfsHttpClient } from 'ipfs-http-client'
import Web3Modal from 'web3modal'
// import { useNavigate } from "react-router";
import { nftaddress, nftmarketaddress } from '../../config';
import NFT from '../../../src/NFT.json';
import Market from '../../NFTMarket.json';
import { EtherscanProvider } from '@ethersproject/providers'
// import Image from 'next-images'
import Clock from "../components/Clock";
import Footer from '../components/footer';
import { createGlobalStyle } from 'styled-components';
// import { Redirect } from '@reach/router';
import { useNavigate } from "@reach/router"



const client = ipfsHttpClient('https://ipfs.infura.io:5001/api/v0');

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
`;


export default function CreateItem() {
    const [fileUrl, setFileUrl] = useState(null)
    const [formInput, updateFormInput] = useState({ price: '', name: '', description: '' })
    const [files, setFiles] = useState('')
    // const navigate = useNavigate();
    // const navigate = useNavigate();
    // navigate("/");
    // const history = History();
    // const handleClick = () => history.push('/')
    const navigate = useNavigate();
    async function onChange(e) {
        const file = e.target.files[0]
        // var files = e.target.files;
        // var filesArr = Array.prototype.slice.call(files);
        // document.getElementById("file_name").style.display = "none";
        // setFiles({ files: [...this.state.files, ...filesArr] });
        try { //try uploading the file
            const added = await client.add(
                file,
                {
                    progress: (prog) => console.log(`received: ${prog}`)
                }
            )
            //file saved in the url path below
            const url = `https://ipfs.infura.io/ipfs/${added.path}`
            alert(added.path)
            setFileUrl(url)
        } catch (e) {
            console.log('Error uploading file: ', e)
        }
    }

    //1. create item (image/video) and upload to ipfs
    // function createItem1() {
    //     navigate("/");

    // }
    async function createItem() {
        // <Redirect to="/" />
        const { name, description, price } = formInput; //get the value from the form input

        //form validation
        if (!name || !description || !price || !fileUrl) {
            return
        }

        const data = JSON.stringify({
            name, description, image: fileUrl
        });

        try {
            const added = await client.add(data)
            const url = `https://ipfs.infura.io/ipfs/${added.path}`
            //pass the url to sav eit on Polygon adter it has been uploaded to IPFS
            createSale(url)
        } catch (error) {
            console.log(`Error uploading file: `, error)
        }

    }

    //2. List item for sale
    async function createSale(url) {
        const web3Modal = new Web3Modal();
        const connection = await web3Modal.connect();
        const provider = new ethers.providers.Web3Provider(connection);

        //sign the transaction
        const signer = provider.getSigner();
        let contract = new ethers.Contract(nftaddress, NFT.abi, signer);
        let transaction = await contract.createToken(url);
        let tx = await transaction.wait()

        //get the tokenId from the transaction that occured above
        //there events array that is returned, the first item from that event
        //is the event, third item is the token id.
        console.log('Transaction: ', tx)
        console.log('Transaction events: ', tx.events[0])
        let event = tx.events[0]
        let value = event.args[2]
        let tokenId = value.toNumber() //we need to convert it a number

        //get a reference to the price entered in the form 
        const price = ethers.utils.parseUnits(formInput.price, 'ether')

        contract = new ethers.Contract(nftmarketaddress, Market.abi, signer);

        //get the listing price
        let listingPrice = await contract.getListingPrice()
        listingPrice = listingPrice.toString()

        transaction = await contract.createMarketItem(
            nftaddress, tokenId, price, { value: listingPrice }
        )

        await transaction.wait()

        // router.push('/')
        // navigate("/");
        navigate('../', { replace: true })

    }

    return (
        <>
            <GlobalStyles />
            <section className='jumbotron breadcumb no-bg' style={{ backgroundImage: `url(${'./img/background/subheader.jpg'})` }}>
                <div className='mainbreadcumb'>
                    <div className='container'>
                        <div className='row m-10-hor'>
                            <div className='col-12'>
                                <h1 className='text-center'>Create NFT</h1>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className='container'>
                <div className="row">
                    <div className="col-lg-7 offset-lg-1 mb-5">
                        <form id="form-create-item" className="form-border" action="#">
                            <div className="field-set">
                                {/* <h5>Upload file</h5>
                                <div className="d-create-file">
                                    <p id="file_name">PNG, JPG, GIF, WEBP or MP4. Max 200mb.</p> */}
                                    {/* {files.map(x =>
                                        <p key="{index}">PNG, JPG, GIF, WEBP or MP4. Max 200mb.{x.name}</p>
                                    )} */}
                                    {/* {
                                        fileUrl && (

                                            <Image
                                                src={fileUrl}
                                                alt="Picture of the author"
                                                className="rounded mt-4"
                                                width={350}
                                                height={500}
                                            // blurDataURL="data:..." automatically provided
                                            // placeholder="blur" // Optional blur-up while loading
                                            />
                                        )
                                    } */}
                                    {/* <div className='browse'>
                                        <input type="button" id="get_file" className="btn-main" value="Browse" />
                                        <input id='upload_file' type="file" multiple onChange={onChange} />
                                    </div>

                                </div> */}
                                <h5>NFT Name</h5>
                                <input type="text" name="item_title"
                                    id="item_title"
                                    className="form-control"
                                    placeholder="e.g. 'Crypto Fix"
                                    onChange={e => updateFormInput({ ...formInput, name: e.target.value })}
                                />
                                {/* <input
                                    placeholder="Asset Name"
                                    className="mt-8 border rounded p-4"
                                    onChange={e => updateFormInput({ ...formInput, name: e.target.value })}
                                /> */}
                                <div className="spacer-10"></div>

                                <h5>NFT Description</h5>
                                <textarea
                                    data-autoresize
                                    name="item_desc"
                                    id="item_desc"
                                    className="form-control"
                                    onChange={e => updateFormInput({ ...formInput, description: e.target.value })}
                                    placeholder="e.g. 'This is very limited item'"></textarea>

                                <div className="spacer-10"></div>

                                {/* <textarea
                                    placeholder="Asset description"
                                    className="mt-2 border rounded p-4"
                                    onChange={e => updateFormInput({ ...formInput, description: e.target.value })}
                                /> */}

                                <h5>NFT Price</h5>
                                <input
                                    type="number"
                                    name="item_price"
                                    id="item_price"
                                    className="form-control"
                                    onChange={e => updateFormInput({ ...formInput, price: e.target.value })}
                                    placeholder="enter price for one item (ETH)" />

                                <div className="spacer-10"></div>
                                {/* <input
                                    placeholder="Asset Price in Eth"
                                    className="mt-8 border rounded p-4"
                                    type="number"
                                    onChange={e => updateFormInput({ ...formInput, price: e.target.value })}
                                /> */}
                                <input
                                    type="file"
                                    name="Asset"
                                    className="my-4"
                                    onChange={onChange}
                                />
                                {/* {
                        fileUrl && (
                           
                            <Image
                            src={fileUrl}
                            alt="Picture of the author"
                            className="rounded mt-4"
                            width={350}
                            height={500} 
                            // blurDataURL="data:..." automatically provided
                            // placeholder="blur" // Optional blur-up while loading
                          />
                        )
                    } */}
                                <input
                                    type="button"
                                    id="submit"
                                    className="btn-main"
                                    value="Create NFT"
                                    onClick={createItem}
                                // onClick={createItem1}
                                // onClick={() => navigate(-1)}
                                />
                                {/* <button onClick={createItem}
                                    className="font-bold mt-4 bg-pink-500 text-white rounded p-4 shadow-lg"
                                >Create NFT</button> */}
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
                                <span>
                                    <img className="lazy" src="./img/author/author-1.jpg" alt="" />
                                    <i className="fa fa-check"></i>
                                </span>
                            </div>
                            <div className="nft__item_wrap">
                                <span>
                                    <img src="./img/collections/coll-item-3.jpg" id="get_file_2" className="lazy nft__item_preview" alt="" />
                                </span>
                            </div>
                            <div className="nft__item_info">
                                <span >
                                    <h4>Pinky Ocean</h4>
                                </span>
                                <div className="nft__item_price">
                                    0.08 ETH<span>1/20</span>
                                </div>
                                <div className="nft__item_action">
                                    <span>Place a bid</span>
                                </div>
                                <div className="nft__item_like">
                                    <i className="fa fa-heart"></i><span>50</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <Footer />
        </>

    )
}