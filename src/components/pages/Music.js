// import React, { useEffect, useState } from 'react';
// import ImageGallery from "../components/ImageGallery";
// import Footer from '../components/footer';
// import { createGlobalStyle } from 'styled-components';
// import "../components/Css/arts.css";
// import axios from "axios";

// import { URLS } from '../app-url'


// const GlobalStyles = createGlobalStyle`
//   header#myHeader.navbar.sticky.white {
//     background: #403f83;
//     border-bottom: solid 1px #403f83;
//   }
//   header#myHeader.navbar .search #quick_search{
//     color: #fff;
//     background: rgba(255, 255, 255, .1);
//   }
//   header#myHeader.navbar.white .btn, .navbar.white a, .navbar.sticky.white a{
//     color: #fff;
//   }
//   header#myHeader .dropdown-toggle::after{
//     color: rgba(255, 255, 255, .5);
//   }
//   header#myHeader .logo .d-block{
//     display: none !important;
//   }
//   header#myHeader .logo .d-none{
//     display: block !important;
//   }
//   @media only screen and (max-width: 1199px) {
//     .navbar{
//       background: #403f83;
//     }
//     .navbar .menu-line, .navbar .menu-line1, .navbar .menu-line2{
//       background: #fff;
//     }
//     .item-dropdown .dropdown a{
//       color: #fff !important;
//     }
//   }
// `;




// export default function Arts() {
//   const [posts, setPosts] = useState([]);
//   const [catFilter, setCatFilter] = useState([]);
//   const [catId, setCatId] = useState([]);

//   const [accountAddress, setAccountAddress] = useState("");

//   async function getAccount() {
//     let accounts;
//     try {
//       accounts = await window.ethereum.request({
//         method: "eth_requestAccounts",
//       });
//       // console.log("---------------------------------------yee---------------------------------------")
//       const account = accounts[0];

//       // console.log(account, "cnklsdnvklsdnvlsdncsdcklnl")
//       return account;
//       // if (typeof window !== "undefined") {
//       //   getAccount().then((response) => {
//       //     setAccountAddress(response);
//       //   });
//       // }
//     } catch (error) {
//       // toast.warn("Please Install Metamask Wallet Extension !", {
//       //   position: toast.POSITION.TOP_CENTER
//       // });
//       // alert("Please Install Metamask Wallet Extension")
//       console.log(error);
//     }
//   }

//   const connectButtonOnClick = () => {
//     if (typeof window !== "undefined") {
//       getAccount().then((response) => {
//         setAccountAddress(response);
//         axios
//           .get(URLS.getOwnedCollection + "/" + response)
//           // .get(`http://3.133.29.104:8000/app/getCollection/${response}`)
//           .then((res) => {
//             let catFilter = res.data.result
//             let newData = []

//             for (let index = 0; index < catFilter.length; index++) {
//               const element = catFilter[index];
//               if (catId == element.categoryId) {
//                 newData.push(element)
//               }

//             }
//             console.log(newData, 'fghjkkkkkkkkkkkkkkkkkkkkkkkkk');
//             setPosts(newData)

//             // setPosts(res.data.result);
//             // setCatFilter(res.data.result)

//             console.log(
//               res.data.result,
//               "---------------------get owned collection data response--------"
//             );
//           })
//           .catch((err) => {
//             console.log(err);
//           });
//       });
//     }
//   };
//   useEffect(() => {
//     axios.get(URLS.getCategoryList)
//       .then((res) => {
//         console.log(res.data.result, ' getcategorylist----------------------------------------')
//         for (let index = 0; index < res.data.result.length; index++) {
//           const element = res.data.result[index];

//           if (element.categoryName == 'Music') {

//             setCatId(element._id)
//           }
//           console.log(catId, "catId----------------")

//         }
//         // console.log(res.data.result, "respons result get categoryList-----------------------------");

//         // console.log(User, "setUser------------------------------")

//       }).catch(err => {
//         console.log(err.message)
//       })
//     connectButtonOnClick();
//   }, []);





//   return (
//     <div>
//       <GlobalStyles />
//       <section className='jumbotron breadcumb no-bg' style={{ backgroundImage: `url(${'./img/background/subheader.jpg'})` }}>
//         <div className='mainbreadcumb'>
//           <div className='container'>
//             <div className='row'>
//               <div className="col-md-12 text-center">
//                 <h1>Music</h1>
//                 <p>NFTs created by global leading Musician</p>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>

//       <section className='container'>
//         <div className='row'>
//           <div className="select">
//             <select name="format" id="format">
//               <option selected disabled>Choose a book format</option>
//               <option value="pdf">PDF</option>
//               <option value="txt">txt</option>
//               <option value="epub">ePub</option>
//               <option value="fb2">fb2</option>
//               <option value="mobi">mobi</option>
//             </select>
//           </div>

//           <div className="row">

//             {posts.map((post) => (
//               <div className="col-md-4">
//                 <div className="nft__item_wrap">
//                   <div className="collection-nft-box">
//                     <li key={post._id}>
//                       <img src={post.imagePath} className="collection-nft" width={250}
//                         height={300} />

//                       <p className="nft__item_price">{post.nftName}</p>
//                       <div className="text-left">
//                         <button
//                           onClick={() => Redirect(post)}
//                           type="button"
//                           className="btn-main"
//                         >
//                           <span>Sell</span>
//                         </button>
//                       </div>


//                     </li>
//                   </div>
//                 </div>
//               </div>

//             ))}
//           </div>

//           {/* <ImageGallery /> */}

//         </div>
//       </section>

//       <Footer />
//     </div>
//   );

// }
