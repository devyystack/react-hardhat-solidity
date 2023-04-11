import React, { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import { create as ipfsHttpClient } from 'ipfs-http-client'
import Web3Modal from 'web3modal'
// import { nftaddress, nftmarketaddress } from '../../config';
// import NFT from '../../../src/NFT.json';
// import Market from '../../NFTMarket.json';
import {NFT ,NFT_MARKET}  from "../../constants/contract.config"
import { EtherscanProvider } from '@ethersproject/providers'
import Clock from "../components/Clock";
import Footer from '../components/footer';
import axios from 'axios';
import { createGlobalStyle } from 'styled-components';
import { useNavigate } from "@reach/router"
import Loader from 'react-loader-spinner';
import { Spinner } from "react-bootstrap";
import $ from "jquery"
import { useForm } from 'react-hook-form';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { URLS } from '../app-url'
import "../../assets/create.css";
import "../components/Css/nft-category.css";



let METAIMG;


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
  button.disabled{
    background-color: #cad1df;
    pointer-events: none;
    cursor: not-allowed!important;
  } 
`;

toast.configure()

export default function CreateItem() {

    const [fileUrl, setFileUrl] = useState(null)
    const [formInput, updateFormInput] = useState({ price: '', name: '', description: '' })
    const [files, setFiles] = useState('')
    const [prev, setPrev] = useState();
    const [fileimg, setFileImg] = useState(false)
    let [loading, setLoading] = useState(false)

    const { register, control, errors, formState } = useForm({
    });
    const [nftName, setNftName] = useState("")
    const [nftDiscription, setNftDiscription] = useState('')
    const [imagePath, setImagePath] = useState("")
    const [nftPrice, setNftPrice] = useState("")
    const [categoryId, setCategoryId] = useState("")
    const [subCategoryId, setSubCategoryId] = useState("")

    const [accountAddress, setAccountAddress] = useState("")
    const [User, setUser] = useState([]);
    const [subCat, setSubCat] = useState([]);



    async function getAccount() {
        let accounts
        try {
            accounts = await window.ethereum.request({
                method: "eth_requestAccounts",
            });
            // console.log("---------------------------------------yee---------------------------------------")
            const account = accounts[0];

            // console.log(account, "cnklsdnvklsdnvlsdncsdcklnl")
            return account;

        } catch (error) {
            console.log(error)
        }
    }

    const connectButtonOnClick = () => {
        if (typeof window !== "undefined") {
            getAccount().then((response) => {
                setAccountAddress(response);

            });
        }
    };




    useEffect(() => {


        axios.get(URLS.getCategoryList)
            .then((res) => {
                // console.log(res.data.result, ' getcategorylist----------------------------------------')
                setUser(res.data.result)

                // console.log(User, "setUser------------------------------")

            }).catch(err => {
                console.log(err.message)
            })


    }, []);

    function handleChange(e) {
        // console.log(e.target.files);
        setPrev(URL.createObjectURL(e.target.files[0]));
    }
    function formDataToJson(f) {
        return Object.fromEntries(Array.from(f.keys(), k =>
            k.endsWith('[]') ? [k.slice(0, -2), f.getAll(k)] : [k, f.get(k)]));
    }



    const createNft = async (e) => {
        let walletAddress
        setLoading(true)

        await getAccount().then((response) => {
            walletAddress = response;
        });
        // debugger

        const formData = new FormData();
        formData.append('walletAddress', walletAddress);
        formData.append("nftName", nftName);
        formData.append("nftDiscription", nftDiscription);
        formData.append("nftPrice", 0);
        formData.append("imagePath", imagePath);
        formData.append("categoryId", categoryId);
        formData.append("subCategoryId", subCategoryId);
        formData.append("parentId", 0);
        formData.append("type", 'sell');





        let form_toJson = formDataToJson(formData)

        // console.log(form_toJson)

        if (!form_toJson.nftDiscription && !form_toJson.imagePath && !form_toJson.nftName) {
            toast.warn('All field are required !', {
                position: toast.POSITION.TOP_CENTER
            });
        }
        else if (!form_toJson.imagePath) {
            toast.warn(`please provide a image first`, {
                position: toast.POSITION.TOP_CENTER
            });
        }
        else if (!form_toJson.nftDiscription) {
            toast.warn(`please provide a description first`, {
                position: toast.POSITION.TOP_CENTER
            });
        }
        else if (!form_toJson.nftName) {
            toast.warn('Must have a NFT name', {
                position: toast.POSITION.TOP_CENTER
            });
        }

        // setLoading(true)

        try {
            // console.log(formData);

            // console.log(URLS.getProfileData+"/"+user_account,"1111111111111111111111111111111111111111111111111111111")
            const requestOptions = {
                method: 'POST',
                headers: { "Access-Control-Allow-Origin": "*" },
                body: formData
            };

            fetch(URLS.createnftmint, requestOptions)
                .then(res => {
                    res.json().then((data) => {

                        toast.success(`${JSON.stringify(data.massage)}`, {
                            position: toast.POSITION.TOP_CENTER
                        });
                        // document.getElementById("form-create-item").reset();

                        setLoading(false)

                        navigate("/colection")

                    })



                }).catch(err => {
                    setLoading(false)
                    console.log(err)
                }

                )

            // setLoading(false)

        } catch (error) {
            setLoading(false)

            console.log(`Error uploading file: `, error)
            // setLoading(false)
        }

        //---------------------- post nftmint api --------------------------


    };

    const subCatagoryId = (e) => {
        // debugger
        // console.log(e.target.value, 'shubhammmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmm');
        let subCatID = e.target.value
        setCategoryId(subCatID)

        axios.get(URLS.getSubCategoryList + "/" + subCatID)
            .then((res) => {
                // console.log(res.data.result, ' getSubcategorylist----------------------------------------')
                setSubCat(res.data.result)

                // console.log(subCat, "setUser--ssss----------------------------")

            }).catch(err => {
                console.log(err.message)
            })
        // console.log(subCatID, "usuhdb-----------------")
    }
    const subCatagoryIdList = (e) =>{
        // console.log(e.target.value,"subcATlIST------------------------------------")
        let subCategoryID = e.target.value;
        setSubCategoryId(subCategoryID)
        
    }

    const onSelectFile = (event) => {
        let fileData = event.target.files[0];
        let len = event.target.files[0].name.split(".").length
        let filename = event.target.files[0].name.split(".")[len - 1]
        if (filename == 'mp3' || filename == 'mp4') {

            setFileImg(true)
        }
        else {
            setFileImg(false)
        }
        // console.log(filename,"filename---------------------------------")
        setImagePath(fileData)
    }
    const onSelectFile1 = (event) => {
        let fileData = event.target.files[0];
        setImagePath(fileData)
    }
    // console.log(fileimg, "filemimgsd-");

    if (fileimg) {
        METAIMG = <div><input type="file" onChange={`${handleChange()} && ${onSelectFile()}` } ></input>
            <img src={prev} width={100} height={100} /></div>


    } else {
        METAIMG = ''

    }

    const navigate = useNavigate();
    async function onChange(e) {
        const file = e.target.files[0]

        try { //try uploading the file
            const added = await client.add(
                file,
                {
                    progress: (prog) => console.log(`received: ${prog}`)
                }
            )
            //file saved in the url path below
            const url = `https://ipfs.infura.io/ipfs/${added.path}`
            // alert(added.path)
            setFileUrl(url)
        } catch (e) {
            console.log('Error uploading file: ', e)
        }
    }



    async function createItem() {
        const { name, description, price } = formInput; //get the value from the form input

        //form validation
        if (!name || !description || !price || !fileUrl) {
            toast.warn("All Fields are Required !", {
                position: toast.POSITION.TOP_CENTER
            });
            return
        }

        setLoading(true)


        const data = JSON.stringify({
            name, description, image: fileUrl
        });
        // console.log(data, "data-----------ipfs---------------------------")
        try {
            const added = await client.add(data)
            const url = `https://ipfs.infura.io/ipfs/${added.path}`
            //pass the url to sav eit on Polygon adter it has been uploaded to IPFS
            await createSale(url)

            setLoading(false)


        } catch (error) {
            console.log(`Error uploading file: `, error)
            setLoading(false)
        }




    }

    //2. List item for sale
    async function createSale(url) {
        const web3Modal = new Web3Modal(
            // {
            //     network: "Rinkeby",
            //     cacheProvider: true,
            // }
        );
        const connection = await web3Modal.connect();
        const provider = new ethers.providers.Web3Provider(connection);

        //sign the transaction
        const signer = provider.getSigner();
        let contract = new ethers.Contract(NFT.NFT_ADDRESS, NFT.NFT_ABI, signer);
        let transaction = await contract.createToken(url);
        let tx = await transaction.wait()

        //get the tokenId from the transaction that occured above
        //there events array that is returned, the first item from that event
        //is the event, third item is the token id.
        // console.log('Transaction: ', tx)
        // console.log('Transaction events: ', tx.events[0])
        let event = tx.events[0]
        let value = event.args[2]
        let tokenId = value.toNumber() //we need to convert it a number

        //get a reference to the price entered in the form 
        const price = ethers.utils.parseUnits(formInput.price, 'ether')

        contract = new ethers.Contract(NFT_MARKET.NFT_MARKET_ADDRESS, NFT_MARKET.NFT_MARKET_ABI, signer);

        //get the listing price
        let listingPrice = await contract.getListingPrice()
        listingPrice = listingPrice.toString()

        transaction = await contract.createMarketItem(
            NFT.NFT_ADDRESS, tokenId, price, { value: listingPrice }
        )

        await transaction.wait()

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

                                <h5>NFT Name</h5>
                                <input type="text" name="item_title"
                                    id="item_title"
                                    className="form-control"
                                    placeholder="e.g. 'Crypto Fix"

                                    // ref={register({required:true})}
                                    onChange={(e) => setNftName(e.target.value)}

                                />
                                <div className="spacer-10"></div>

                                <h5>NFT Description</h5>
                                <textarea
                                    data-autoresize
                                    name="item_desc"
                                    id="item_desc"
                                    className="form-control"
                                    onChange={(e) => setNftDiscription(e.target.value)}
                                    placeholder="e.g. 'This is very limited item'"></textarea>

                                <div className="spacer-10"></div>

                                <div className="spacer-10"></div>


                                <input
                                    type="file"
                                    name="Asset"
                                    accept="video/*,audio/*,image/gif,image/jpeg,image/png,.gif,.jpeg,.jpg,.png"
                                    className="my-4 form-control" id="item_image"
                                    onChange={onSelectFile}
                                />
                                {METAIMG}

                                <div className="spacer-10"></div>
                                <div className="us-form">
                                    <select 
                                    // onChange={(e) => `${setCategoryId(e.target.value)}  ${subCatagoryId}`}
                                      onChange={subCatagoryId}
                                    >


                                        <option selected="selected" disabled value="disable">choose value</option>
                                        {User.map((data) => (

                                            <option value={data._id}
                                            >
                                                {data.categoryName}</option>
                                        ))}

                                    </select>
                                </div>
                                <div className="spacer-10"></div>

                                <div className="us-form">

                                    <select id="categorySelect" size="1"
                                          onChange={subCatagoryIdList}
                                        >
                                        <option selected="selected" disabled value="disable">choose value</option>
                                        {subCat.map((data) => (

                                            <option value={data._id}
                                            >
                                                {data.subCatName}</option>
                                        ))}

                                    </select>

                                </div>

                                <div className="spacer-10"></div>

                                {/* <CharacterDropDown /> */}
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
                                <button
                                    type="button"
                                    id="submit"
                                    className={`btn-main ${loading ? "disabled" : ""}`}
                                    value="Create NFT"
                                    onClick={createNft}
                                    style={{
                                        display: "flex",
                                        alignItems: "center"
                                    }}
                                // disabled={formInput}
                                // onClick={hendleloading} 
                                > Create Nft
                                    {loading ? <span className='spinner-border' role="status" style={{ display: "inline-block", margin: "0 14px", width: "1rem", height: "1rem" }}>
                                        <span className='sr-only'>Loaing...</span>
                                    </span> : ''}
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
            </section >
            <Footer />
        </>

    )
}