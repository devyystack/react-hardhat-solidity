import React, { Component } from "react";
import styled from "styled-components";
import { ethers } from "ethers";
import { Link } from "@reach/router";
import { useEffect, useState } from "react";
import axios from "axios";
import Web3Modal from "web3modal";
import Clock from "./Clock";
import { URLS } from '../app-url'
// import { nftmarketaddress, nftaddress } from "../../config";
// import Market from "../../NFTMarket.json";
// import NFT from "../../NFT.json";
import { NFT, NFT_MARKET } from './../../constants/contract.config'
import { useNavigate } from "@reach/router";
import "../../assets/nftcollection.css";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';




let METASELL;



const Outer = styled.div`
  display: flex;
  justify-content: center;
  align-content: center;
  align-items: center;
  overflow: hidden;
  border-radius: 8px;
`;
toast.configure()


export default function ColumnZeroCollection() {
    const [nfts, setNfts] = useState([]);
    const [sold, setSold] = useState([]);
    const [accountAddress, setAccountAddress] = useState("");
    const [loadingState, setLoadingState] = useState("not-loaded");
    const [posts, setPosts] = useState([]);
    const [imageData, setImageData] = useState([]);
    const [priceData, setPriceData] = useState([]);
    const [descriptionData, setDescriptionData] = useState([]);
    const [listNft, setListNft] = useState([])

    const [catFilter, setCatFilter] = useState([]);
    const [categoryId, setCategoryId] = useState("")
    const [subCategoryId, setSubCategoryId] = useState("")
    const [catSubcatFilter, setCatSubCatFilter] = useState([]);
    const [User, setUser] = useState([]);
    const [subCat, setSubCat] = useState([]);
    let [loading, setLoading] = useState("")
    let [loading1, setLoading1] = useState(false)



    async function getAccount() {
        let accounts;
        try {
            accounts = await window.ethereum.request({
                method: "eth_requestAccounts",
            });
            // console.log("---------------------------------------yee---------------------------------------")
            const account = accounts[0];
            return account;

            // console.log(account, "account------------------------")
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
            // console.log(error);
        }

    }
    // console.log("fvdsfvsdfv")
    //------------------------------Category and SubCategory Function & API ------------------------------- //4

    async function loadNFTs() {
        // debugger
        let connection
        let response = await getAccount()
        // console.log("Response:::", response)
        try {
            const web3Modal = await new Web3Modal();

            connection = await web3Modal.connect()

            let provider = new ethers.providers.JsonRpcProvider("https://nd-940-903-339.p2pify.com/26cb308bc7dfe5d3497d0ec046b42f07");

            const tokenContract = new ethers.Contract(NFT.NFT_ADDRESS, NFT.NFT_ABI, provider);
            const marketContract = new ethers.Contract(NFT_MARKET.NFT_MARKET_ADDRESS, NFT_MARKET.NFT_MARKET_ABI, provider);
            // console.log(marketContract, "marketConrtract--------------")


            marketContract.fetchsoldItems().then(data => {
                // console.log(data, "datata--------------------")
            }).catch(err => {
                // console.log(err, "err---------CaroselCollection-----------------")
            })

            //return an array of unsold market items
            // debugger
            // console.log("response:FetchSOLD------",response);
            const resWalletAddr = response.toString();
            // console.log("resWallAddress:",resWalletAddr);
            const data = await marketContract.fetchsoldItems(resWalletAddr);
            // console.log(data, "data----------44")
            const items = await Promise.allSettled(data.map(async i => {
                const tokenUri = await tokenContract.tokenURI(i.tokenId);
                // console.log("token", tokenUri)
                const meta = await axios.get(tokenUri);
                // console.log("token", meta)
                let price = ethers.utils.formatUnits(i.price.toString(), 'ether')
                let item = {
                    price,
                    tokenId: i.tokenId.toNumber(),
                    itemId: i.itemId.toNumber(),
                    seller: i.seller,
                    owner: i.owner,
                    imagePath: meta.data.image,
                    name: meta.data.name,
                    description: meta.data.description,
                }
                // console.log(item, "items---------------------")
                return item;
            }));
            // console.log(items, "items---------------------")
            let reqItems = items.filter(data => data.status == "fulfilled");
            // console.log(reqItems, "reqItems items---------------------")
            let ItemsLoad = reqItems.map((item) => {
                const loadValue = item.value
                // console.log("ItemsLoad", loadValue);
                // setListData(loadValue)
                // console.log("listData:-------------------",listData)
                // this.setState({
                //     ...this.state, nftList: [...this.state.nftList, loadValue]
                // })
                // const imageList = loadValue.image
                // const priceList = loadValue.price
                // const descriptionList = loadValue.description

                // setImageData(imageList)
                // setPriceData(priceList)
                // setDescriptionData(descriptionList)
                // console.log("imageList", imageList);
                // console.log("listData:-------------------", listData)
                return loadValue
            })
            // console.log("ItemsLoad-----------", ItemsLoad);
            // console.log("reqItems:", reqItems)
            setListNft(ItemsLoad)



            // this.setState({
            //     timer: this.state.timer,
            //     // nftList: loadValue,
            // })
        }
        catch (err) {
            // alert(err)
        }




    }


    useEffect(() => {

        loadNFTs();
        axios.get(URLS.getCategoryList)
            .then((res) => {
                // console.log(res.data.result, ' getcategorylist----------------------------------------')
                setUser(res.data.result)
                // console.log(res.data.result, "respons result get categoryList-----------------------------");

                // console.log(User, "setUser------------------------------")

            }).catch(err => {
                // console.log(err.message)
            })


    }, []);



    const subCatagoryId = (e) => {
        // debugger
        // console.log(e.target.value, 'shubhammmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmm');
        let subCatID = e.target.value
        setCatSubCatFilter(catFilter)
        let newData = []
        for (let index = 0; index < catFilter?.length; index++) {
            const element = catFilter[index];
            if (subCatID == element.categoryId) {
                newData.push(element)
            }

        }
        setPosts(newData)
        setCategoryId(subCatID)

        axios.get(URLS.getSubCategoryList + "/" + subCatID)
            .then((res) => {
                // console.log(res.data.result, ' getSubcategorylist----------------------------------------')
                setSubCat(res.data.result)


                // console.log(subCat, "setUser--ssss----------------------------")

            }).catch(err => {
                // console.log(err.message)
            })
        // console.log(subCatID, "usuhdb-----------------")
    }
    const subCatagoryIdList = (e) => {
        // debugger
        // console.log(e.target.value, "subcATlIST------------------------------------")
        let subCategoryID = e.target.value;
        let newData = []
        for (let index = 0; index < catFilter?.length; index++) {
            const element = catFilter[index];
            if (subCategoryID == element.subCategoryId) {
                newData.push(element)
            }

        }
        setPosts(newData)
        setSubCategoryId(subCategoryID)

    }

    //------------------------------Category and SubCategory Function & API ------------------------------- //4



    const connectButtonOnClick = () => {
        // debugger
        if (typeof window !== "undefined") {
            getAccount().then((response) => {
                setAccountAddress(response);
                // console.log("responnse:", response)
                axios
                    .get(URLS.getOwnedCollection + "/" + response)
                    .then((res) => {
                        setPosts(res.data.result);
                        setCatFilter(res.data.result)
                        // console.log(
                        //     res.data.result,
                        //     "---------------------get owned collection data response--------"
                        // );
                    })
                    .catch((err) => {
                        // console.log(err);
                    });
            });
        }
    };
    useEffect(() => {
        connectButtonOnClick();
    }, []);

    const navigate = useNavigate();

    async function Redirect(post) {

        // console.log(post, "..............gfgffg......");
        // navigate("../create2", { replace: true });
        await navigate("/create2", { state: { NFT: post,sell: true } });
        // console.log(post, "ColumnZeroTwo---- Nft--------202------40");
    }

    async function Auction(post) {
        //debugger
        // console.log(post, "ufhghgh..........gj")
        localStorage.setItem('NFT', post)
        await navigate("/create2", { state: { NFT: post, auction: true } });
    }




    //-------------------2. List item for Resale------------------------------//
    async function BurnNFt(post) {
        let wallAddr;
        let dataBaseID;
        let catId;
        let subCatId;

        // debugger
        setLoading(post.tokenId)
        // console.log(post, "-------------------post----------------")
        let name = post.name;
        let desc = post.description;
        let price = post.price;
        let imgPth = post.imagePath;
        let toknId = post.tokenId
        // console.log("name:", name, "desc:", desc, "price:", price, "imgpth:", imgPth, "tokenId:", toknId)


        await axios.get(`${URLS.resellNftList}/${toknId}`).then((res) => {

            // console.log("res:", res);
            // console.log(res.data.result, "result:")
            // console.log(res.data.result[0]._id, "result_id:")
            // console.log(res.data.result[0].walletAddress, "result.walletAddress:")
            dataBaseID = res.data.result[0]._id;
            wallAddr = res.data.result[0].walletAddress
            catId = res.data.result[0].categoryId
            subCatId = res.data.result[0].subCategoryId



        }).catch(err => {
            console.log(err.message)
        })


        const web3Modal = new Web3Modal(

        );
        const connection = await web3Modal.connect();
        const provider = new ethers.providers.Web3Provider(connection);

        //sign the transaction
        const signer = provider.getSigner();
        let contract = new ethers.Contract(NFT.NFT_ADDRESS, NFT.NFT_ABI, signer);

        let transaction = await contract.burn(post.tokenId);


        if (transaction) {
            // debugger
            await transaction.wait().then(data => {
                // console.log(data, "data--113")

                const formData1 = new FormData();
                // console.log(nftTokenId, "-----------------------------tokren ")
                // formData1.append('walletAddress', post.walletAddress);
                formData1.append('status', 'burn');



                axios.patch(`${URLS.pathNftStatus}${wallAddr.toLowerCase()}/${dataBaseID}`, formData1)
                    .then(res => {
                        let message = res.data.Message
                        // console.log(res.data, "----Resel UpdateNFT status to Burn res.da----------------")
                        toast.success(`${message}`, {
                            position: toast.POSITION.TOP_CENTER
                        });
                        // navigate("/")

                        // console.log(res.data, "res.daata--------------updateNftsTATUS-----------------")
                    })
                    .catch(err => {
                        // console.log(err)
                    })


                const formData = new FormData();
                formData.append('walletAddress', wallAddr);
                formData.append("nftName", name);
                formData.append("nftDiscription", desc);
                formData.append("nftPrice", 0);
                formData.append("imagePath", imgPth);
                formData.append("categoryId", catId);
                formData.append("subCategoryId", subCatId);
                formData.append("parentId", 0);
                formData.append("type", 'resell');
                try {
                    // console.log(formData);

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

                                setLoading(post.tokenId)

                                navigate("/colection")

                            })

                        }).catch(err => {
                            setLoading(post.tokenId)
                            console.log(err)
                        }

                        )
                } catch (error) {
                    setLoading(post.tokenId)

                    console.log(`Error uploading file: `, error)
                }





            }).catch(err => {
                console.log(err.message, "err-115")
            });
        }
        let tx = await transaction.wait()
        loadNFTs();

        //get the tokenId from the transaction that occured above
        //there events array that is returned, the first item from that event
        //is the event, third item is the token id.

        // console.log('Transaction: ', tx)
        // console.log('Transaction events: ', tx.events[0])
        let event = tx.events[0]
        let value = event.args[2]
        let tokenId = value.toNumber() //we need to convert it a number


        //---------------------- post nftmint api --------------------------



        //---------------------- post nftmint api --------------------------

    }


    //-------------------2. List item for Resale------------------------------//


    if (loadingState === "loaded" && !nfts.length)
        return <h1 className="py-10 px-20 text-3xl">No assets created</h1>;
    return (
        <>
            <div className="row">
                <div >
                    <div className="us-form">
                        <select
                            // onChange={(e) => `${setCategoryId(e.target.value)}  ${subCatagoryId}`}
                            onChange={subCatagoryId}
                        >


                            <option selected="selected" disabled value="disable">choose value</option>
                            {User?.map((data) => (

                                <option value={data?._id}
                                >
                                    {data?.categoryName}</option>
                            ))}

                        </select>
                    </div>
                    <div className="spacer-10"></div>

                    <div className="us-form">

                        <select id="categorySelect" size="1"
                            onChange={subCatagoryIdList}
                        >
                            <option selected="selected" disabled value="disable">choose value</option>
                            {subCat?.map((data) => (

                                <option value={data?._id}
                                >
                                    {data?.subCatName}</option>
                            ))}

                        </select>

                    </div>

                </div>
                <h2 className="text-2xl py-2 text-center">My Collections</h2>
                <div className="container-fluid">
                    <div className="row">

                        {posts?.map((post) => (
                            <div className="col-md-4">
                                <div className="nft__item_wrap">
                                    <div className="collection-nft-box">
                                        <li key={post?.id}>
                                            <img src={post?.imagePath} className="collection-nft" width={250}
                                                height={300} />

                                            <p className="nft__item_price">{post?.firstName}{post?.lastName}</p>
                                            <div className="text-left" style={{ display: "flex", justifyContent: "space-around" }}>
                                                {/* <button
                                                    onClick={() => Redirect(post)}
                                                    type="button"
                                                    className="btn-main"
                                                >
                                                   <span>  {post.tokenId ? <span onClick={dumy}>Resell</span> : "Sell"}</span>
                                                   
                                                </button> */}
                                                {post.tokenId ?
                                                    <button
                                                        className={`btn-main ${loading ? "disabled" : ""}`}

                                                        // onClick={() => { Redirect(post); BurnNFt(); }}
                                                        onClick={() => { BurnNFt(post) }}

                                                        type="button"
                                                    // className="btn-main"
                                                    >Resell
                                                        {post.tokenId == loading ? <span className='spinner-border' role="status" style={{ display: "inline-block", margin: "0 14px", width: "1rem", height: "1rem" }}>
                                                            <span className='sr-only'>Loaing...</span>
                                                        </span> : ''}
                                                    </button>
                                                    :
                                                    <button
                                                        // className={`btn-main ${loading1 ? "disabled" : ""}`}

                                                        onClick={() => Redirect(post)}
                                                        type="button"
                                                        className="btn-main"
                                                    > sell</button>

                                                }

                                                <button
                                                    // className={`btn-main ${loading1 ? "disabled" : ""}`}

                                                    onClick={() => Auction(post)}
                                                    type="button"
                                                    className="btn-main btn-auction"
                                                > Auction</button>


                                            </div>


                                        </li>
                                    </div>
                                </div>
                            </div>

                        ))}
                    </div>

                    <div className="row">


                        {listNft?.map((data) => (
                            <div className="col-md-4">
                                <div className="nft__item_wrap">
                                    <div className="collection-nft-box">
                                        <li key={data?.itemId}>
                                            <img src={data?.imagePath} className="collection-nft" width={250}
                                                height={300} />

                                            {/* <p className="nft__item_price">{post?.firstName}{post?.lastName}</p> */}
                                            <div className="text-left" style={{ display: "flex", justifyContent: "space-around" }}>
                                                {/* <button
                                                    onClick={() => Redirect(post)}
                                                    type="button"
                                                    className="btn-main"
                                                >
                                                   <span>  {post.tokenId ? <span onClick={dumy}>Resell</span> : "Sell"}</span>
                                                   
                                                </button> */}

                                                {data.itemId ?
                                                    <button
                                                        className={`btn-main ${loading ? "disabled" : ""}`}

                                                        // onClick={() => { Redirect(post); BurnNFt(); }}
                                                        onClick={() => { BurnNFt(data) }}

                                                        type="button"
                                                    // className="btn-main"
                                                    >Resell
                                                        {data.itemId == loading ? <span className='spinner-border' role="status" style={{ display: "inline-block", margin: "0 14px", width: "1rem", height: "1rem" }}>
                                                            <span className='sr-only'>Loaing...</span>
                                                        </span> : ''}
                                                    </button>
                                                    :
                                                    <button
                                                        // className={`btn-main ${loading1 ? "disabled" : ""}`}

                                                        onClick={() => Redirect(data)}
                                                        type="button"
                                                        className="btn-main"
                                                    > sell</button>

                                                }

                                                <button
                                                    // className={`btn-main ${loading1 ? "disabled" : ""}`}

                                                    onClick={() => Auction(data)}
                                                    type="button"
                                                    className="btn-main btn-auction"
                                                > Auction</button>


                                            </div>


                                        </li>
                                    </div>
                                </div>
                            </div>

                        ))}

                    </div>
                </div>

                {nfts.map((nft, i) => (
                    <div className="d-item col-lg-3 col-md-6 col-sm-6 col-xs-12">
                        <div key={i} className="border shadow rounded-xl overflow-hidden">
                            <div className="nft__item">
                                {/* <div className="author_list_pp">
                                    <span onClick={() => window.open(nfts.authorLink, "_self")}>
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
                                                src={imagePath}
                                                className="lazy nft__item_preview"
                                                alt="Picture of the author"
                                            />
                                        </span>
                                    </Outer>
                                </div>

                                <div className="nft__item_info">
                                    {/* {/ <span>nft Name</span> /} */}

                                    <div class="nft__item_price">Price - {nft?.price} BNB</div>
                                    <div className="text-left">
                                        <button
                                            onClick={() => Redirect(post)}
                                            type="button"
                                            className="btn-main"
                                        >
                                            <span>Sell</span>
                                        </button>
                                    </div>
                                    <div className="nft__item_like">
                                        <i className="fa fa-heart" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <div className="row">
                {Boolean(sold?.length) && (
                    <div className="d-item col-lg-3 col-md-6 col-sm-6 col-xs-12">
                        <h2 className="text-2xl py-2text-center">NFT Sold</h2>
                        {sold.map((nft, i) => (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
                                <div
                                    key={i}
                                    className="border shadow rounded-xl overflow-hidden"
                                >
                                    <div className="nft__item">
                                        <div className="nft__item_wrap">
                                            <Outer>
                                                <img
                                                    width={250}
                                                    height={300}
                                                    src={nft?.image}
                                                    className="lazy nft__item_preview"
                                                    alt="Picture of the author"
                                                />
                                            </Outer>
                                        </div>
                                        <div className="nft__item_info">
                                            <div class="nft__item_price">Price - {nft?.nftPrice} BNB</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}