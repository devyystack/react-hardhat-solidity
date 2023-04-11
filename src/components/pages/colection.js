import React, { useState, useEffect } from "react";
// import ColumnZero from "../components/ColumnZero";
import ColumnZeroCollection from "../components/ColumnZeroCollection";
import ColumnZeroTwo from "../components/ColumnZeroTwo";
import Footer from "../components/footer";
import { createGlobalStyle } from "styled-components";
import { URLS } from "../app-url";
import AuctionMenuCollection from "../components/AuctionMenuCollection";

const GlobalStyles = createGlobalStyle`
  header#myHeader.navbar.white {
    background: #fff;
  }
  @media only screen and (max-width: 1199px) {
    .navbar{
      background: #403f83;
    }
    .navbar .menu-line, .navbar .menu-line1, .navbar .menu-line2{
      background: #111;
    }
    .item-dropdown .dropdown a{
      color: #111 !important;
    }
  }
`;

const Colection = function () {
  const [notes, setNotes] = useState("");
  const [accountAddress, setAccountAddress] = useState("");
  const [openMenu, setOpenMenu] = React.useState(true);
  const [openMenu1, setOpenMenu1] = React.useState(false);
  const [auctionMenu, setAuctionMenu] = useState(false);

  const handleBtnClick = () => {
    setOpenMenu(!openMenu);
    setOpenMenu1(false);
    setAuctionMenu(false);
    document.getElementById("Mainbtn").classList.add("active");
    document.getElementById("Mainbtn1").classList.remove("active");
    document.getElementById("Auction").classList.remove("active");
  };

  const handleBtnClick1 = () => {
    setOpenMenu1(!openMenu1);
    setOpenMenu(false);
    setAuctionMenu(false);
    document.getElementById("Mainbtn1").classList.add("active");
    document.getElementById("Mainbtn").classList.remove("active");
    document.getElementById("Auction").classList.remove("active");
  };

  const handleBtnClick2 = () => {
    setAuctionMenu(true);
    setOpenMenu(false);
    setOpenMenu1(false);
    document.getElementById("Auction").classList.add("active");
    document.getElementById("Mainbtn").classList.remove("active");
    document.getElementById("Mainbtn1").classList.remove("active");
  };

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
  // console.log("fvdsfvsdfv")

  const connectButtonOnClick = () => {
    if (typeof window !== "undefined") {
      getAccount().then((response) => {
        setAccountAddress(response);
        // console.log("--------------------------------------------------accountAddress")
        // console.log(accountAddress)
        // console.log("--------------------------------------------------response")
        // console.log(response)
        // console.log(accountAddress,"dcscsd")
      });
    }
  };

  const fetchData = (user_account) => {
    // console.log("-----------------------user_account-----------------------")
    // console.log(user_account)
    // console.log(URLS.getProfileData+"/"+user_account)
    fetch(URLS.getProfileData + "/" + user_account, {
      method: "GET",
      headers: { "Access-Control-Allow-Origin": "*" },
    })
      .then((res) => {
        // console.log("res", res);

        res.json().then((data) => {
          // console.log(data.result, "resluktfc---------------------");

          if (data.result) {
            // toast.success(`${JSON.stringify(data.massage)}`, {
            //   position: toast.POSITION.TOP_CENTER
            // });
            // document.getElementById("form-create-item").reset();
            // console.log(data.result[0].firstName,"data.result[1].firstName----------------------------")
            const Name = data.result[0].firstName;
            const lastName = data.result[0].lastName;
            const walletAddr = data.result[0].walletAddress;
            const imgPth = data.result[0].imagePath;

            let user_info = {
              name: Name,
              lastName: lastName,
              walletAddress: walletAddr,
              imgPth: imgPth,
            };
            setNotes(user_info);
            // console.log(
            //   Name,
            //   walletAddr,
            //   imgPth,
            //   "111------------------------------------111-------------------------"
            // );
          }
        });

        const fetchDetails = URLS.getProfileData + "/" + user_account;
        let fetchDetailsmore = fetchDetails.result;
        // console.log(
        //   fetchDetailsmore,
        //   "1111111111111111111111111111111111111111111111111111111111"
        // );

        // console.log(user_info,"notes----------------------------");

        // console.log(
        //   fetchDetails,
        //   "bcjbdkjcbkjsdbskj-----------------------------n nan c ask0---------------------"
        // );
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    getAccount().then((data) => {
      // console.log(data, "data88888uuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu");
      fetchData(data);
    });
  }, []);

  return (
    <div>
      <GlobalStyles />

      <section
        id="profile_banner"
        className="jumbotron breadcumb no-bg"
        style={{ backgroundImage: `url(${"./img/background/4.jpg"})` }}
      >
        <div className="mainbreadcumb"></div>
      </section>

      <section className="container d_coll no-top no-bottom">
        <div className="row">
          <div className="col-md-12">
            <div className="d_profile">
              <div className="profile_avatar">
                <div className="d_profile_img">
                  <img
                    src={notes.imgPth}
                    alt="profileImg"
                    width={300}
                    height={300}
                  />
                  <i className="fa fa-check"></i>
                </div>

                <div className="profile_name">
                  <h4>
                    Welcome {notes.name} {notes.lastName}
                    <div className="clearfix"></div>
                    <span id="wallet" className="profile_wallet">
                      {notes.walletAddress}
                    </span>
                    {/* <button id="btn_copy" title="Copy Text">Copy</button> */}
                  </h4>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="container no-top">
        <div className="row">
          <div className="col-lg-12">
            <div className="items_filter">
              <ul className="de_nav">
                <li id="Mainbtn1" className="">
                  <span onClick={handleBtnClick1}>On Sale</span>
                </li>
                <li id="Mainbtn" className="active">
                  <span onClick={handleBtnClick}>Owned</span>
                </li>
                <li id="Auction" className="">
                  <span onClick={handleBtnClick2}>Auction</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
        {openMenu1 && (
          <div id="zero2" className="onStep fadeIn">
            {/* <ColumnZero/> */}
            <ColumnZeroTwo />
          </div>
        )}
        {openMenu && (
          <div id="zero1" className="onStep fadeIn">
            <ColumnZeroCollection />
          </div>
        )}
        {auctionMenu && (
          <div id="zero1" className="onStep fadeIn">
            <AuctionMenuCollection />
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
};
export default Colection;
