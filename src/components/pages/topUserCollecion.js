import React from "react";
import ColumnZero from '../components/ColumnZero';
// import ColumnZeroCollection from "../components/ColumnZeroCollection";
// import ColumnZeroTwo from '../components/ColumnZeroTwo';
import TopUserNftData from "../components/TopUserNftData";
import Footer from '../components/footer';
import { createGlobalStyle } from 'styled-components';
import { useParams } from "@reach/router";
import { useState, useEffect } from 'react';
import axios from 'axios';
import { URLS } from '../app-url'


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

const TopUserCollection = function (props) {
    const [User, setUser] = useState([]);
    const USERDATA  = props.location.state.USERADDRESS;
// console.log((USERDATA));
    // let {account} = useParams();

    // console.log(account,"3333333333333333333333333333333333333333333333333333")

    axios.get(URLS.getProfileData +'/'+USERDATA._id)
    .then((res) => {
        // console.log(res.data.result, 'dfdsfsdfdfsdfdffsdfxdfsd')
        setUser(res.data.result[0])
        // console.log(posts)

    }).catch(err=>{
        console.log(err.message)
    })

//   console.log(USERDATA,"userDATA11111111111111111111111-------------------------------------")
    const [openMenu, setOpenMenu] = React.useState(true);
    const [openMenu1, setOpenMenu1] = React.useState(false);
    const handleBtnClick = (): void => {
        setOpenMenu(!openMenu);
        setOpenMenu1(false);
        document.getElementById("Mainbtn").classList.add("active");
        document.getElementById("Mainbtn1").classList.remove("active");
    };
    // const handleBtnClick1 = (): void => {
    //     setOpenMenu1(!openMenu1);
    //     setOpenMenu(false);
    //     document.getElementById("Mainbtn1").classList.add("active");
    //     document.getElementById("Mainbtn").classList.remove("active");
    // };



    return (
        <div>
            <GlobalStyles />

            <section id='profile_banner' className='jumbotron breadcumb no-bg' style={{ backgroundImage: `url(${'./img/background/4.jpg'})` }}>
                <div className='mainbreadcumb'>
                </div>
            </section>

            <section className='container d_coll no-top no-bottom'>
                <div className='row'>
                    <div className="col-md-12">
                        <div className="d_profile">
                            <div className="profile_avatar">
                                <div className="d_profile_img">
                                    <img src={USERDATA.imagePath} alt="" />
                                    <i className="fa fa-check"></i>
                                </div>

                                <div className="profile_name">
                                    <h4>
                                    Welcome   {User.firstName?User.firstName: '' + ' ' + User.lastName?User.lastName:''}
                                        <div className="clearfix"></div>
                                        <span id="wallet" className="profile_wallet">{User.walletAddress?User.walletAddress:USERDATA._id}</span>
                                        {/* <button id="btn_copy" title="Copy Text">Copy</button> */}
                                    </h4>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </section>

            <section className='container no-top'>
                <div className='row'>
                    <div className='col-lg-12'>
                        <div className="items_filter">
                            <ul className="de_nav">
                                <li id='Mainbtn' className="active"><span onClick={handleBtnClick}>On Sale</span></li>
                                {/* <li id='Mainbtn1' className=""><span onClick={handleBtnClick1}>Owned</span></li> */}
                            </ul>
                        </div>
                    </div>
                </div>
                {openMenu && (
                    <div id='zero1' className='onStep fadeIn'>
                        {/* <ColumnZero/> */}
                        <TopUserNftData wadd={USERDATA._id}/>

                    </div>
                )}
                
            </section>


            <Footer />
        </div>
    );
}
export default TopUserCollection;