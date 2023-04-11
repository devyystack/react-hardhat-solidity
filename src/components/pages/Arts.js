import React, { useEffect, useState } from "react";
import Web3Modal from "web3modal";
// import { nftaddress, nftmarketaddress } from "../components/../../config";
import {NFT,NFT_MARKET} from "../../constants/contract.config"
// import Market from "../../NFTMarket.json";
import { ethers } from "ethers";
import { navigate } from "@reach/router";
import ImageGallery from "../components/ImageGallery";
import Footer from "../components/footer";
import { createGlobalStyle } from "styled-components";
import "../components/Css/arts.css";
import { useParams } from "@reach/router";
import axios from "axios";
import BannerImg from "../../assets/banner.jpeg";
import { URLS } from "../app-url";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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

toast.configure();

export default function Arts() {
  const [posts, setPosts] = useState([]);
  const [posts1, setPosts1] = useState([]);
  const [catFilter, setCatFilter] = useState([]);
  const [catId, setCatId] = useState([]);
  const [subCatData, setSubCatData] = useState([]);
  const [subCategoryId, setSubCategoryId] = useState("");
  const [accountAddress, setAccountAddress] = useState("");

  const params = useParams();
  // alert("hello",{ id })

  useEffect(async () => {
    await axios
      .get(`${URLS.getNftSaleCategory}/${params.id}`)
      .then((res) => {
        // console.log(res.data.result, ' ==========getNftSaleCategory----------------------------------------')

        setPosts(res.data.result);
        setSubCatData(res.data.result, "-----------------------");
      })
      .catch((err) => {
        // console.log(err.message)
      });
    subCatagoryIdList();
  }, []);

  //================== SUB-CATEGORY-API ========================================== //

  const subCatagoryIdList = async (e) => {
    await axios
      .get(`${URLS.getSubCategoryList}/${params.id}`)
      .then((res) => {
        // console.log(res.data.result, ' ==========getSubCategoryList----------------------------------------')
        //  alert("hello",params.id)

        setPosts1(res.data.result);
      })
      .catch((err) => {
        // console.log(err.message)
      });
  };

  const fetchSubCategoryId = (e) => {
    let selectedId = e.target.value;
    let newData = [];
    // console.log(selectedId, "eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee")
    // console.log(subCatData, "eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee")

    for (let index = 0; index < subCatData?.length; index++) {
      const element = subCatData[index];
      // console.log(element, "element-----------------")

      if (element.subCategoryId == selectedId) {
        newData.push(element);
      }
    }
    setPosts(newData);
  };

  //================== SUB-CATEGORY-API ========================================== //

  async function getAccount() {
    let accounts;
    try {
      accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      const account = accounts[0];
      return account;
    } catch (error) {
      // console.log(error)
    }
  }

  const connectButtonOnClick = () => {
    if (typeof window !== "undefined") {
      getAccount().then((response) => {
        setAccountAddress(response);
        // console.log("--------------------------------------------------accountAddress")
        // console.log(accountAddress)
      });
    }
  };

  //---------------------BUY NOW with metamask -------------------------------------//

  async function buyNFT(nft) {
    // debugger
    // console.log(nft, "nft---ARTS-------------------119-----")
    const web3Modal = await new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);

    //sign the transaction
    const signer = provider.getSigner();
    const contract = new ethers.Contract(NFT_MARKET.NFT_MARKET_ADDRESS, NFT_MARKET.NFT_MARKET_ABI, signer);

    //set the price
    const price = ethers.utils.parseUnits(nft.nftPrice.toString(), "ether");

    //make the sale
    const transaction = await contract
      .createMarketSale(NFT.NFT_ADDRESS, nft.tokenId, {
        value: price,
        gasLimit: 3000000,
        // gasPrice: 8000000
      })
      .catch((err) => {
        // console.log(err.message, "err.msg-------110")
      });
    if (transaction) {
      await transaction
        .wait()
        .then((data) => {
          // console.log(data, "data--113")
        })
        .catch((err) => {
          // console.log(err.message, "err-115")
        });
    }
    await updateNft(nft.tokenId, nft.seller);

    return nft;

    // this.loadNFTs()
  }
  //---------------------BUY NOW with metamask -------------------------------------//
  async function updateNft(idd, seller) {
    // console.log(idd,"------------nft token is-------------")
    // debugger
    let walletAddress;
    await getAccount().then((response) => {
      walletAddress = response;
    });
    const formData = new FormData();
    // console.log(nftTokenId, "-----------------------------tokren ")
    formData.append("walletAddress", walletAddress);

    axios
      .patch(`${URLS.updateNftMint}/${seller}/${idd}`, formData)
      .then((res) => {
        let message = res.data.Message;
        // console.log(res.data, "res.data----------------")
        toast.success(`${message}`, {
          position: toast.POSITION.TOP_CENTER,
        });
        navigate("/");

        // console.log(res.data, "res.daata--------------169----------create2------------------")
      })
      .catch((err) => {
        // console.log(err)
        // alert('api nhi chl rji hai')
      });
  }

  return (
    <div>
      <GlobalStyles />
      <section
        className="jumbotron breadcumb no-bg"
        style={{ backgroundImage: `url(${BannerImg})` }}
      >
        <div className="mainbreadcumb">
          <div className="container">
            <div className="row">
              <div className="col-md-12 text-center">
                <h1>NFT Category</h1>
                <p>NFTs created by global leading </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container">
        <div className="row">
          <div className="us-form">
            <select id="categorySelect" size="1" onChange={fetchSubCategoryId}>
              <option selected="selected" disabled value="disable">
                choose value
              </option>
              {posts1?.map((data) => (
                <option value={data?._id}>{data?.subCatName}</option>
              ))}
            </select>
          </div>

          {posts?.map((nft) => (
            <div className="col-md-4">
              <div className="nft__item_wrap">
                <div className="collection-nft-box">
                  <li key={nft?.categoryId}>
                    <img
                      src={nft?.imagePath}
                      className="collection-nft"
                      width={250}
                      height={300}
                    />

                    <p className="nft__item_price">{nft.nftName}</p>
                    <div className="nft__item_price">
                      Price - {nft?.nftPrice} BNB
                    </div>

                    <div className="text-left">
                      <button
                        onClick={() => buyNFT(nft)}
                        type="button"
                        className="btn-main"
                      >
                        <span>Buy NFT</span>
                      </button>
                    </div>
                    {/* <div className="text-left">
                      <button
                        onClick={() => Redirect(post)}
                        type="button"
                        className="btn-main"
                      >
                        <span>Sell</span>
                      </button>
                    </div> */}
                  </li>
                </div>
              </div>
            </div>
          ))}

          {/* <ImageGallery /> */}
        </div>
      </section>

      <Footer />
    </div>
  );
}
