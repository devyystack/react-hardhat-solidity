import React, { useEffect, useState } from 'react';
import { Link } from '@reach/router';
import logo from "../../assets/logo.png"
import { URLS } from '../app-url'
import axios from "axios";
import { navigate } from "@reach/router"



const NavLink = props => (
    <Link
        {...props}
        getProps={({ isCurrent }) => {
            // the object returned here is passed to the
            // anchor element's props
            return {
                className: isCurrent ? 'active' : 'non-active',
            };
        }}
    />
);


export default function footer() {
    const [User, setUser] = useState([]);


    useEffect(() => {


        axios.get(URLS.getCategoryList)
            .then((res) => {
                // console.log(res.data.result, ' getcategorylist-----------------130----header-------------------')
                // console.log(res.data.result, "resluktfc---------------------")
                // console.log(res.data.result[0]._id, "res.data.resul[0].categoryName---------------------")


                if (res.data.result) {

                    // toast.success(`${JSON.stringify(data.massage)}`, {
                    //   position: toast.POSITION.TOP_CENTER
                    // });
                    // document.getElementById("form-create-item").reset();
                    // console.log(data.result[0].firstName,"data.result[1].firstName----------------------------")
                    const catName = res.data.result[0].categoryName
                    const catId = res.data.result[0]._id

                    let user_info = { "categoryname": catName, "categoryid": catId, }
                    // setUser(user_info)
                    // console.log(catName, catId, "149-------------------------------------------------")
                }
                setUser(res.data.result)
                // console.log(res.data.result[0].categoryName, "respons result get categoryList----------header-------------------");
                // console.log(User, "setUser----------------------------");
                // console.log(User.categoryName, "setUser------------------header------------")

            }).catch(err => {
                // console.log(err.message)
            })


    }, []);
    return (
        <>

            <footer className="footer-light" style={{ position: "relative " }}>
                <div className="container">
                    <div className="row">
                        <div className="col-md-3 col-sm-6 col-xs-1">
                            <div className="widget">
                                <h5>Marketplace</h5>

                                <div>

                                    {/* {User.map((data, index) => (
                                        <div key={index} className='navbar-item'>
                                            <NavLink key={index} to={`category/${data._id}`}>
                                                {data.categoryName}
                                                <span className='lines'></span>
                                            </NavLink>
                                        </div>

                                    ))} */}

                                    {
                                        User.map((data, index) => {
                                            return (
                                                <>
                                                <p style={{ cursor: 'pointer', fontWeight: '600' }} className="m-0" key={data._id} onClick={() => {
                                                    navigate(`/category/${data._id}`)
                                                }}>
                                                    {data.categoryName}
                                                </p>
                                                
                                                </>
                                            )
                                        })
                                    }
                                    <p > <span><a style={{ cursor: 'pointer', fontWeight: '600' }} href='http://linkitupdev.com/celebart-support' target="_blank">For Support Click here</a></span></p>
                                </div>
                                {/* <li><Link to="">All NFTs</Link></li> */}
                                {/* <li><Link to="/arts">Art</Link></li>
                                    <li><Link to="/arts">Celeb</Link></li>
                                    <li><Link to="/influencer">Influencers</Link></li>
                                    <li><Link to="/music">Music</Link></li>
                                    <li><Link to="/sports">Sports</Link></li> */}
                                {/* <li><Link to="">Domain Names</Link></li> */}
                                {/* <li><Link to="">Virtual World</Link></li> */}
                                {/* <li><Link to="">Collectibles</Link></li> */}

                            </div>
                        </div>
                        {/* <div className="col-md-3 col-sm-6 col-xs-1">
                        <h5>Contact Support</h5>
                        <p><span style={{fontWeight:"700"}}><a href='http://linkitupdev.com/celebart-support' target="_blank">Linkitup Service.</a></span></p>
                        
                        </div> */}
                        <div className="col-md-3 col-sm-6 col-xs-1">
                            {/* <div className="widget">
                        <h5>Community</h5>
                        <ul>
                            <li><Link to="">Community</Link></li>
                            <li><Link to="">Documentation</Link></li>
                            <li><Link to="">Brand Assets</Link></li>
                            <li><Link to="">Blog</Link></li>
                            <li><Link to="">Forum</Link></li>
                            <li><Link to="">Mailing List</Link></li>
                        </ul>
                    </div> */}
                        </div>
                        <div className="col-md-3 col-sm-6 col-xs-1">
                            {/* <div className="widget">
                            <h5>Newsletter</h5>
                            <p>Signup for our newsletter to get the latest news in your inbox.</p>
                            <form action="#" className="row form-dark" id="form_subscribe" method="post" name="form_subscribe">
                                <div className="col text-center">
                                    <input className="form-control" id="txt_subscribe" name="txt_subscribe" placeholder="enter your email" type="text" /> 
                                    <Link to="" id="btn-subscribe">
                                      <i className="arrow_right bg-color-secondary"></i>
                                    </Link>
                                    <div className="clearfix"></div>
                                </div>
                            </form>
                            <div className="spacer-10"></div>
                            <small>Your email is safe with us. We don't spam.</small>
                        </div> */}
                        </div>
                    </div>
                </div>
                <div className="subfooter">
                    <div className="container">
                        <div className="row">
                            <div className="col-md-12">
                                <div className="de-flex">
                                    <div className="de-flex-col">
                                        <span onClick={() => window.open("", "_self")}>
                                            <img alt="" className="f-logo d-1" src={logo} />
                                            <img alt="" className="f-logo d-3" src={logo} />
                                            <span className="copy">&copy; Copyright 2022 - CelebArt is a <span ><a href='http://linkitupdev.com/' target="_blank">linkitup service.</a></span></span>
                                        </span>
                                    </div>
                                    <div className="de-flex-col">
                                        <div className="social-icons">
                                            <span><a href='https://www.facebook.com/linkitupdev' target="_blank"><i className="fa fa-facebook fa-lg"></i></a></span>
                                            <span><a href='https://twitter.com/CelebArtNFT' target="_blank"><i className="fa fa-twitter fa-lg"></i></a></span>
                                            {/* <span><a><i className="fa fa-linkedin fa-lg"></i></a></span> */}
                                            <span><a href='http://www.linkitupdev.com' target="_blank"><i className="fa fa-rss fa-lg"></i></a></span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
        </>
    )
};