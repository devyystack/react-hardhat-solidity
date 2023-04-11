import React, { useEffect, useState } from 'react'
import { ethers } from 'ethers'
import Web3Modal from 'web3modal'
import Footer from '../components/footer';
import { createGlobalStyle } from 'styled-components';
import { Spinner } from "react-bootstrap";
import { useForm } from 'react-hook-form';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { URLS } from '../app-url'



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

export default function UserProfile(props) {
  const [notes, setNotes] = useState('')
  const [accountAddress, setAccountAddress] = useState("")
  const [fileUrl, setFileUrl] = useState(null)
  const [formInput, updateFormInput] = useState({ fname: '', lname: '', userimage: '' })
  const [files, setFiles] = useState('')
  let [loading, setLoading] = useState(false)
  const { register, control, errors, formState } = useForm({
    // mode: "onChange",
    // reValidateMode:"onChange",
    // defaultValue:{
    //     child:[{name:""}]
    // }
  });

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
      console.log(error)
    }
  }

  const connectButtonOnClick = () => {
    if (typeof window !== "undefined") {
      getAccount().then((response) => {
        setAccountAddress(response);
        // console.log("--------------------------------------------------accountAddress")
        // console.log(accountAddress)
        // console.log("--------------------------------------------------response")
        // console.log(response)
        // console.log(accountAddress, "dcscsd")

      });
    }
  };

  const fetchData = (user_account) => {
    // console.log("-----------------------user_account-----------------------")
    // console.log(user_account)
    // console.log(URLS.getProfileData + "/" + user_account)
    fetch(URLS.getProfileData + "/" + user_account, {
      "method": "GET", "headers": { "Access-Control-Allow-Origin": "*" }
    })
      .then(res => {

        // console.log('res', res)

        res.json().then((data) => {
          if (data.result) {
              // toast.success(`${JSON.stringify(data.massage)}`, {
            //   position: toast.POSITION.TOP_CENTER
            // });
            // document.getElementById("form-create-item").reset();
            const Name = data.result[0].firstName
            const lastName = data.result[0].lastName
            const walletAddr = data.result[0].walletAddress
            const imgPth = data.result[0].imagePath

            let user_info = { "name": Name, "lastName": lastName, "walletAddress": walletAddr, "imgPth": imgPth }
            setNotes(user_info)
            // console.log(user_info,"userinfooooooooooooooooooooooo")
          }
          // console.log(Name,walletAddr,imgPth,"111------------------------------------111-------------------------")
        })


        const fetchDetails = URLS.getProfileData + "/" + user_account
        let fetchDetailsmore = fetchDetails.result
        // console.log(fetchDetailsmore, "1111111111111111111111111111111111111111111111111111111111")

        // console.log(fetchDetails, "bcjbdkjcbkjsdbskj-----------------------------n nan c ask0---------------------")
      }).catch(err => console.log(err))
  }

  useEffect(() => {
    getAccount().then(data => {
      // console.log(data, "data88888uuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu")
      fetchData(data)
    })
  }, [])
  const onSelectFile = (event) => {
    // debugger
    let fileData = event.target.files[0];
    updateFormInput({ ...formInput, userimage: fileData })

    var reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]);
    reader.onload = (event) => {
      let imgURL = reader.result;

    }
  }
  async function getAccount() {
    let accounts
    try {
      accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      const account = accounts[0];
      return account;

    } catch (error) {
      console.log(error)
    }

  }

  async function createProfile() {
    // debugger
    let walletAddress

    await getAccount().then((response) => {
      walletAddress = response;
    });
    const { fname, lname, userimage } = formInput; //get the value from the form input

    // form validation
    if (!fname || !lname || !userimage) {
      toast.warn("All Fields are Required !", {
        position: toast.POSITION.TOP_CENTER
      });
      return
    }

    setLoading(true)

    const formData = new FormData();
    formData.append('firstName', fname);
    formData.append('lastName', lname);
    formData.append('imagePath', userimage);
    formData.append('walletAddress', walletAddress);

    try {
      // debugger
      // console.log(formData);
      // console.log(fname);
      // console.log(URLS.getProfileData+"/"+user_account,"1111111111111111111111111111111111111111111111111111111")

      fetch(URLS.submitProfileApi, {
        "method": "POST", "headers": { "Access-Control-Allow-Origin": "*" },
        "body": formData
      })
        .then(res => {

          // console.log('res', res)

          res.json().then((data) => {

            toast.success(`${JSON.stringify(data.massage)}`, {
              position: toast.POSITION.TOP_CENTER
            });
            // document.getElementById("form-create-item").reset();

            // console.log(data)
          })



        }).catch(err => console.log(err))


      // fetch(URLS.submitProfileApi, {
      //   method: "POST", "headers": { "Access-Control-Allow-Origin": "*" },
      //   "body": formData
      // })
      //   .then(res => { res.json() }).then(res => {


      //     alert('hi')
      //     toast.success("testing toast", { position: toast.POSITION.TOP_RIGHT })
      //     console.log(res.formData);
      //     toast.success(res.massage, {
      //       position: toast.POSITION.TOP_CENTER
      //     })
      //   }).
      //   catch(err => window.alert(err))

      setLoading(false)

    } catch (error) {
      // console.log(`Error uploading file: `, error)
      setLoading(false)
    }




  }

  return (
    <>
      <GlobalStyles />
      <section className='jumbotron breadcumb no-bg' style={{ backgroundImage: `url(${'./img/background/subheader.jpg'})` }}>
        <div className='mainbreadcumb'>
          <div className='container'>
            <div className='row m-10-hor'>
              <div className='col-12'>
                <h1 className='text-center'>User Profile</h1>
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

                <h5>First Name</h5>
                <input type="text" name="item_title"
                  id="item_title"
                  className="form-control"
                  placeholder="e.g. 'Crypto Fix"
                  // value={notes.name}
                  defaultValue={notes.name}
                  // ref={register({required:true})}
                  onChange={e => updateFormInput({ ...formInput, fname: e.target.value })}
                  // disabled
                />
                <div className="spacer-10"></div>

                <h5>Last Name</h5>
                <input type="text" name="item_title"
                  id="item_title"
                  className="form-control"
                  placeholder="e.g. 'Crypto Fix"
                  // value={notes.lastName} 
                  defaultValue={notes.lastName} 
                  // disabled
                  // ref={register({required:true})}
                  onChange={e => updateFormInput({ ...formInput, lname: e.target.value })}

                />


                <div className="spacer-10"></div>

                <h5>User Image</h5>

                <input
                  type="file"
                  name="Asset"
                  className="my-4 form-control" id="item_image"
                  // value={notes.imgPth}
                  // onChange={onChange}
                  onChange={onSelectFile}
                // onChange={e => updateFormInput({ ...formInput, userimage: e.target.file[0] })}

                />
                <button
                  type="button"
                  id="submit"
                  className={`btn-main ${loading ? "disabled" : ""}`}
                  value="Create NFT"
                  onClick={createProfile}
                  style={{
                    display: "flex",
                    alignItems: "center"
                  }}
                // disabled={formInput}
                // onClick={hendleloading} 
                > Update Profile
                  {loading ? <span className='spinner-border' role="status" style={{ display: "inline-block", margin: "0 14px", width: "1rem", height: "1rem" }}>
                    <span className='sr-only'>Loaing...</span>
                  </span> : ''}
                </button>

              </div>
            </form>

          </div>
        </div>
      </section>
      <Footer />
    </>

  )
}