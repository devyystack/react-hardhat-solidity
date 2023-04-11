import { ethers } from "ethers";
import styled from "styled-components";
import { useEffect, useState } from "react";
import axios from "axios";
import Web3Modal from "web3modal";
import { NFT, NFT_MARKET } from "../../../../constants/contract.config";
import { navigate } from "@reach/router";
import { URLS } from "../../../app-url";

const Outer = styled.div`
  display: flex;
  justify-content: center;
  align-content: center;
  align-items: center;
  overflow: hidden;
  border-radius: 8px;
  button.disabled {
    background-color: #cad1df;
    pointer-events: none;
    cursor: not-allowed !important;
  }
`;

export default function AllNft() {
  const [nfts, setNfts] = useState([]);
  const [sold, setSold] = useState([]);
  const [loadingState, setLoadingState] = useState("not-loaded");
  const [accountAddress, setAccountAddress] = useState("");
  const [posts, setPosts] = useState([]);
  const [auctionPosts, setauctionPosts] = useState([]);
  const [nftID, setNftID] = useState();
  let [loading, setLoading] = useState(false);

  async function getAccount() {
    let accounts;
    try {
      accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      const account = accounts[0];

      return account;
    } catch (error) {
      console.log(error);
    }
  }

  const fetchAllNft = () => {
    if (typeof window !== "undefined") {
      getAccount().then((response) => {
        setAccountAddress(response);
        axios
          .get(URLS.getAllNFTs)
          .then((res) => {

            // let sellPost = res.data.result.filter((nft) =>{
            //   return nft.status === "sell"
            // })
            // setPosts(res.data.result);
            let auctionPost = res.data.result.filter((nft) => {
              return nft.status === "Auction"
            })
            setauctionPosts(auctionPost)
            // setPosts(sellPost)
            // console.log(auctionPost);
            // console.log(posts);
          })
          .catch((err) => {
            // console.log(err);
          });
        setLoading(false);
      });
    }
  };

  const fetchNftFromContract = async () => {
    debugger
    // let connection
    try {
      // const web3Modal = await new Web3Modal();

      // connection = await web3Modal.connect()
      let provider = new ethers.providers.JsonRpcProvider("https://nd-185-273-976.p2pify.com/6a5193643c359e2c84ca3c7cbcf920f3");
      console.log("provider:",provider);
      // let provider = new ethers.providers.Web3Provider(connection);
      const tokenContract = new ethers.Contract(NFT.NFT_ADDRESS, NFT.NFT_ABI, provider);
      const marketContract = new ethers.Contract(NFT_MARKET.NFT_MARKET_ADDRESS, NFT_MARKET.NFT_MARKET_ABI, provider);

      // marketContract.fetchMarketItems().then(data => {
      //   console.log(data, "AllNFT--------------------")
      // }).catch(err => {
      //   console.log(err, "err---------AllNFT-----------------")
      // })

      //return an array of unsold market items
      // debugger
      const data = await marketContract.fetchMarketItems();
      // console.log(data, "data----------44")
      const items = await Promise.allSettled(data.map(async i => {
        const tokenUri = await tokenContract.tokenURI(i.tokenId);
        // console.log("token", tokenUri)
        const meta = await axios.get(tokenUri);
        // console.log("token", meta)
        let price = ethers.utils.formatUnits(i.price.toString(), 'ether')
        let item = {
          nftPrice: price,
          tokenId: i.tokenId.toNumber(),
          itemId: i.itemId.toNumber(),
          seller: i.seller,
          owner: i.owner,
          imagePath: meta.data.image,
          nftName: meta.data.name,
          description: meta.data.description,
        }
        // console.log(item, "items---------------------")
        return item;
      }));
      // console.log(items, "items---------------------")
      let reqItems = items.filter(data => data.status == "fulfilled");
      // console.log(reqItems);
      let ItemsLoad = reqItems.map((item) => {
        const loadValue = item.value
        // console.log("ItemsLoad", loadValue);
        return loadValue
      })
      setPosts(ItemsLoad)
      // console.log(ItemsLoad);

      // console.log("reqItems:", reqItems)
      this.setState({
        timer: this.state.timer,
        // nftList: loadValue,
      })
    }
    catch (err) {
      console.log(err);
      // alert(err)
    }

  }

  useEffect(() => {
    fetchAllNft();
    fetchNftFromContract()
  }, []);

  async function buyNFT(nft) {
    debugger; 
    setNftID(nft.itemId);
    //setNftID(nft.tokenId)
    // console.log("nft:", nft);
    // console.log("nft.tokkenId:", nft.tokenId);

    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);

    //sign the transaction
    const signer = provider.getSigner();
    const contract = new ethers.Contract(
      NFT_MARKET.NFT_MARKET_ADDRESS,
      NFT_MARKET.NFT_MARKET_ABI,
      signer
    );

    //set the price
    const price = ethers.utils.parseUnits(nft.nftPrice.toString(), "ether");
    // console.log(
    //   nft.nftPrice,
    //   nft.nftPrice.toString(),
    //   price,
    //   price.toString(),
    //   nft.tokenId,
    //   "wwfeweeefef"
    // );
    // let ItemTokenId = nft.tokenId - 1
    // console.log (ItemTokenId , "ItemTokenId----------------------")
    setLoading(true);

    let nftContract = NFT.NFT_ADDRESS;
    // let itemId = Number(nft.tokenId);

    const transaction = await contract
      .createMarketSale(nftContract, nft.itemId, {
        value: price,
        gasLimit: 3000000,
      })

      .catch((err) => {
        toast.error(`NFT Failed`, {
          position: toast.POSITION.TOP_CENTER,
        });
        // console.log(err.message, "err.msg-------110");
        setLoading(false);
      });



    if (transaction) {
      await transaction
        .wait()
        .then((data) => {
          setLoading(false);
          // console.log(data, "data--113");
          location.reload();
          toast.success(`NFT Buy Successfully`, {
            position: toast.POSITION.TOP_CENTER,
          });
          // const formData = new FormData();
          // formData.append("status", "mint");

          // axios
          //   .patch(
          //     URLS.pathNftStatus +
          //     JSON.parse(
          //       localStorage.getItem(
          //         "Parse/HrU19YeOOBdTvZZl7PJSfX2hAa9K7m2cqkmWiqsx/currentUser"
          //       )
          //     ).authData.moralisEth.id +
          //     "/" +
          //     nft._id,
          //     formData
          //   )
          //   .then((res) => {
          //     let message = res.data.Message;
          //     toast.success(`${message}`, {
          //       position: toast.POSITION.TOP_CENTER,
          //     });
          //     navigate("/");
          //   })
          //   .catch((err) => {
          //     console.log(err);
          //   });
        })
        .catch((err) => {
          toast.error(`NFT Failed`, {
            position: toast.POSITION.TOP_CENTER,
          });
          setLoading(false);
        });
    }
  }
  async function nftClickHandler(nft) {
    // console.log(nftClickHandler, "............fgf.....");

    navigate("/ItemDetail", { state: { NFT: nft } });
  }

  if (loadingState === "loaded" && !nfts.length)
    return <h1 className="px-20 py-10 text-3xl">No items in market place</h1>;

  const bidNFT = (nft) => {
    // console.log(nft);
    navigate("/create2", {
      state: {
        NFT: nft,
        bid: true,
      },
    });
    setLoading(false);
  };

  return (
    <div className="row">
      {posts?.map((nft, i) => (
        <div className="d-item col-lg-3 col-md-6 col-sm-6 col-xs-12">
          <div key={i} className="border shadow rounded-xl overflow-hidden">
            <div className="nft__item" style={{ height: "auto" }}>
              <div
                onClick={() => {
                  nftClickHandler(nft);
                }}
                className="nft__item_wrap"
              >
                <Outer>
                  <span>
                    <img
                      style={{ width: "225px", height: "225px", cursor: "pointer" }}
                      src={nft.imagePath}
                      className="lazy nft__item_preview"
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
                  {/* {nft.status == "sell" && ( */}
                  <button
                    type="button"
                    id="buyNFTButton"
                    className={`btn-main ${loading ? "disabled" : ""}`}
                    value="Create NFT"
                    onClick={() => buyNFT(nft)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    {" "}
                    Buy NFT
                    {loading && nft.itemId == nftID ? (
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
                        {
                          <span className="sr-only">Loading...</span>
                        }
                      </span>
                    ) : (
                      ""
                    )}
                  </button>
                  {/* )} */}
                  {nft.status == "Auction" && (
                    <button
                      onClick={() => bidNFT(nft)}
                      type="button"
                      className="btn-main"
                    >
                      <span>Bid</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* AUction */}
      {auctionPosts?.map((nft, i) => (
        <div className="d-item col-lg-3 col-md-6 col-sm-6 col-xs-12">
          <div key={i} className="border shadow rounded-xl overflow-hidden">
            <div className="nft__item" style={{ height: "auto" }}>
              <div
                onClick={() => {
                  nftClickHandler(nft);
                }}
                className="nft__item_wrap"
              >
                <Outer>
                  <span>
                    <img
                      
                      src={nft.imagePath}
                      className="lazy nft__item_preview"
                      style={{ width: "225px", height: "225px", cursor: "pointer" }}
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
                  {nft.status == "Auction" && (
                    <button
                      onClick={() => bidNFT(nft)}
                      type="button"
                      className="btn-main"
                    >
                      <span>Bid</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
