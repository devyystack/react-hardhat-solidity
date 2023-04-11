import React, { useEffect, useState } from 'react';
import { navigate } from "@reach/router"
import axios from 'axios';
import { URLS } from '../app-url'
import { post } from 'jquery';
import '../../../src/index.css'




// const nft = "0xd50Ac5A501b4460aDfA9B2dFb11709a2DcC860d4"



export default function authorlist() {
    const [posts, setPosts] = useState([])



    useEffect(() => {
        axios.get(URLS.getTopUser)
            .then(res => {
                // console.log(res.data)
                // console.log("resultss 0th first name")
                // console.log(res.data.result[2].string[0].firstName)
                // console.log(res.data.result[2].string[0].lastName)
                // console.log(res.data.result[2].string[0].imagePath)
                let topUserData = [];
                for (let index = 0; index < res.data.result.length; index++) {
                    let tempData = {};
                    tempData['firstName'] = "";
                    tempData['lastName'] = "";
                    tempData['imagePath'] = "";
                    if (res.data.result[index].string.length > 0) {
                        tempData['firstName'] = res.data.result[index].string[0].firstName;
                        tempData['lastName'] = res.data.result[index].string[0].lastName;
                        tempData['imagePath'] = res.data.result[index].string[0].imagePath;
                        // tempData['walletAddress'] = res.data.result[index].string[0].walletAddress;
                    }
                    tempData['walletAddress'] = res.data.result[index]._id;
                    tempData['firstName'] = res.data.result[index].string.firstName;
                    tempData['lastName'] = res.data.result[index].string.lastName;
                    tempData['imagePath'] = res.data.result[index].string.imagePath;



                    topUserData[index] = tempData;

                }
                // console.log("------------------------------topUserData")
                // console.log(topUserData)
                // debugger
                setPosts(topUserData)
                // setPosts(topUserData)


                // [
                //     {
                //         id: res.data.result[2]._id,
                //         counts:res.data.result[2].count,
                //         personData : {
                //             firstName,
                //             lastName
                //         }
                //     },
                //     {}
                // ]
                //console.log(res.data.result)
                // console.log(posts)
                // console.log(posts,"22222222222222222222222")


            })

            // Note: it's important to handle errors here
            // instead of a catch() block so that we don't swallow
            // exceptions from actual bugs in components.
            .catch(err => {
                // console.log(err)
            })

    }, [])


    function nftClickHandler(setPosts) {
        setPosts._id = setPosts.walletAddress
        // console.log(setPosts)
        // console.log('clicked');
        // console.log(nft, 'useraress----dvsdvsd----------------------------')
        navigate("/topusercollection", { state: { USERADDRESS: setPosts } })
        // console.log(setPosts, 'useraress-----1235555433---------------------------')
        // console.log(posts, "csdcacacasaasasassas65564646446")

    }


    return (
        <div>
            <ul className="__author_list">

                {
                    posts?.map(post => (

                        // < li key={post.walletAddress} onClick={() => `${nftClickHandler(post)}`}>

                        //   <p style={{fontWeight:"800",cursor:"pointer"}}> {post.walletAddress.substring(0, 10)} </p>

                        //     {/* </div> */}
                        //     {post.firstName}
                        // </li>
                        <li key={post.walletAddress} onClick={() => `${nftClickHandler(post)}`}>
                            <div className='_pi-wrapper' style={{ cursor: "pointer" }}>
                                <div className='_profile-img' >
                                    <img src={post?.imagePath}></img>
                                </div>
                                <div className='info'>
                                    <h6 className='_name'>
                                        {post?.firstName}  {post?.lastName}
                                    </h6>
                                    <p>{post.walletAddress}</p>
                                </div>
                            </div>
                        </li>
                    ))
                }
            </ul>
        </div>
    )
};
