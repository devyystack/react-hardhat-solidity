import React, { useEffect, useState } from "react";
import Breakpoint, {
  BreakpointProvider,
  setDefaultBreakpoints,
} from "react-socks";
import { Link } from "@reach/router";
import useOnclickOutside from "react-cool-onclickoutside";
import logo from "../../assets/logo.png";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { URLS } from "../app-url";

let METABTN;

setDefaultBreakpoints([{ xs: 0 }, { l: 1199 }, { xl: 1200 }]);

toast.configure();
const NavLink = (props) => (
  <Link
    {...props}
    getProps={({ isCurrent }) => {
      return {
        className: isCurrent ? "active" : "non-active",
      };
    }}
  />
);

async function getAccount() {
  let accounts;
  try {
    accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    const account = accounts[0];
    return account;
  } catch (error) {
    toast.warn("Please Install Metamask Wallet Extension");
    // console.log(error)
  }
}

const Header = () => {
  const [waladdress, setWalAddress] = useState(
    "0xC03E118eA1a055f909C0dDa77A47F130f07031CE"
  );
  const [accountAddress, setAccountAddress] = useState("");
  const [openMenu, setOpenMenu] = React.useState(false);
  const [openMenu1, setOpenMenu1] = React.useState(false);
  const [openMenu2, setOpenMenu2] = React.useState(false);
  const [openMenu3, setOpenMenu3] = React.useState(false);
  const [User, setUser] = useState([]);

  const handleBtnClick = () => {
    setOpenMenu(!openMenu);
  };
  const handleBtnClick1 = () => {
    setOpenMenu1(!openMenu1);
  };
  const handleBtnClick2 = () => {
    setOpenMenu2(!openMenu2);
  };
  const handleBtnClick3 = () => {
    setOpenMenu3(!openMenu3);
  };
  const closeMenu = () => {
    setOpenMenu(false);
  };
  const closeMenu1 = () => {
    setOpenMenu1(false);
  };
  const closeMenu2 = () => {
    setOpenMenu2(false);
  };
  const closeMenu3 = () => {
    setOpenMenu3(false);
  };
  const ref = useOnclickOutside(() => {
    closeMenu();
  });
  const ref1 = useOnclickOutside(() => {
    closeMenu1();
  });
  const ref2 = useOnclickOutside(() => {
    closeMenu2();
  });
  const ref3 = useOnclickOutside(() => {
    closeMenu3();
  });

  const [showmenu, btn_icon] = useState(false);
  const [count, setCount] = useState(0);

  const disconnectMeta = () => {
    setAccountAddress("");
    // alert(accounts)
  };

  const connectButtonOnClick = () => {
    // debugger
    if (window.ethereum.chainId === "0x38") {
      // console.log(window,"----------window-----------")

      getAccount().then((response) => {
        setAccountAddress(response);
      });
    } else {
      toast.warn("Please Connect to BSC Mainnet Network!!!", {
        position: toast.POSITION.TOP_CENTER,
      });
    }
  };

  useEffect(() => {
    axios
      .get(URLS.getCategoryList)
      .then((res) => {
        if (res.data.result) {
          const catName = res.data.result[0].categoryName;
          const catId = res.data.result[0]._id;

          let user_info = { categoryname: catName, categoryid: catId };
        }
        setUser(res.data.result);
      })
      .catch((err) => { });
  }, []);

  useEffect(() => {
    getAccount().then((data) => {
      if (data) {
        connectButtonOnClick();
      }
    }, []);

    const header = document.getElementById("myHeader");
    const totop = document.getElementById("scroll-to-top");
    const sticky = header.offsetTop;
    const scrollCallBack = window.addEventListener("scroll", () => {
      btn_icon(false);
      if (window.pageYOffset > sticky) {
        header.classList.add("sticky");
        totop.classList.add("show");
      } else {
        header.classList.remove("sticky");
        totop.classList.remove("show");
      }
      if (window.pageYOffset > sticky) {
        closeMenu();
      }
    });
    return () => {
      window.removeEventListener("scroll", scrollCallBack);
    };
  }, []);
  const address = "0xC03E118eA1a055f909C0dDa77A47F130f07031CE";

  //
  if (!accountAddress) {
    METABTN = (
      <button
        variant="contained"
        className="btn-main"
        onClick={connectButtonOnClick}
      >
        {!!accountAddress
          ? `Connected:${accountAddress.substring(0, 5)}...`
          : "Connect Wallet"}
      </button>
    );
  } else {
    METABTN = (
      <button
        className="btn-main"
        onClick={disconnectMeta}
      >{` ${accountAddress.substring(0, 10)}...Disconnect`}</button>
    );
  }

  //

  return (
    <header id="myHeader" className="navbar white">
      <div className="container">
        <div className="row w-100-nav">
          <div className="logo px-0">
            <div className="navbar-title navbar-item">
              <NavLink to="/">
                <img src={logo} className="img-fluid d-block" alt="#" />
                <img
                  src={logo}
                  // src="./img/logo-2.png"
                  className="img-fluid d-3"
                  alt="#"
                />
                <img
                  src={logo}
                  // src="./img/logo-light.png"
                  className="img-fluid d-none"
                  alt="#"
                />
              </NavLink>
            </div>
          </div>

          <BreakpointProvider>
            <Breakpoint l down>
              {showmenu && (
                <div className="menu">
                  <div className="navbar-item">
                    <div ref={ref}>
                      <div
                        className="dropdown-custom dropdown-toggle btn"
                        onClick={handleBtnClick}
                      >
                        Home
                      </div>
                      {openMenu && (
                        <div className="item-dropdown">
                          <div className="dropdown" onClick={closeMenu}></div>
                        </div>
                      )}
                    </div>
                  </div>
                  <div>
                    {User.map((data, index) => (
                      <div key={index} className="navbar-item">
                        <div key={index} ref={ref2}>
                          <NavLink key={index} to={`category/${data._id}`}>
                            {data.categoryName}
                            <span className="lines"></span>
                          </NavLink>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="navbar-item">
                    <div ref={ref1}>
                      <div
                        className="dropdown-custom dropdown-toggle btn"
                        onClick={handleBtnClick1}
                      >
                        Explore
                      </div>
                      {openMenu1 && (
                        <div className="item-dropdown">
                          <div className="dropdown" onClick={closeMenu1}>
                            <NavLink
                              to="/colection"
                              onClick={() => btn_icon(!showmenu)}
                            >
                              Collection
                            </NavLink>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="navbar-item"></div>
                  <div className="navbar-item">
                    <div ref={ref2}>
                      <div
                        className="dropdown-custom dropdown-toggle btn"
                        onClick={handleBtnClick2}
                      >
                        Pages
                      </div>
                      {openMenu2 && (
                        <div className="item-dropdown">
                          <div className="dropdown" onClick={closeMenu2}>
                            {"0xC03E118eA1a055f909C0dDa77A47F130f07031CE" ==
                              "0xC03E118eA1a055f909C0dDa77A47F130f07031CE" ? (
                              <NavLink
                                to="/create"
                                onClick={() => btn_icon(!showmenu)}
                              >
                                Create
                              </NavLink>
                            ) : (
                              ""
                            )}

                            {accountAddress ? (
                              <NavLink to="/userprofile">Profile</NavLink>
                            ) : (
                              ""
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </Breakpoint>

            <Breakpoint xl>
              <div className="menu">
                <div className="navbar-item">
                  <NavLink to="/">
                    Home
                    <span className="lines"></span>
                  </NavLink>
                </div>
                <div>
                  {User.map((data, i) => (
                    <div key={i} className="navbar-item">
                      <NavLink key={i} to={`category/${data._id}`}>
                        {data.categoryName}
                        <span className="lines"></span>
                      </NavLink>
                    </div>
                  ))}
                </div>

                <div className="navbar-item">
                  <div ref={ref1}>
                    <div
                      className="dropdown-custom dropdown-toggle btn"
                      onMouseEnter={handleBtnClick1}
                      onMouseLeave={closeMenu1}
                    >
                      Explore
                      <span className="lines"></span>
                      {openMenu1 && (
                        <div className="item-dropdown">
                          <div className="dropdown" onClick={closeMenu1}>
                            <NavLink to="/colection">Collection</NavLink>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="navbar-item">
                  <div ref={ref2}>
                    <div
                      className="dropdown-custom dropdown-toggle btn"
                      onMouseEnter={handleBtnClick2}
                      onMouseLeave={closeMenu2}
                    >
                      Pages
                      <span className="lines"></span>
                      {openMenu2 && (
                        <div className="item-dropdown">
                          <div className="dropdown" onClick={closeMenu2}>
                            {accountAddress?.toUpperCase() ==
                              "0xC03E118eA1a055f909C0dDa77A47F130f07031CE".toUpperCase() ? (
                              <NavLink
                                to="/create"
                                onClick={() => btn_icon(!showmenu)}
                              >
                                Create
                              </NavLink>
                            ) : (
                              ""
                            )}

                            {accountAddress ? (
                              <NavLink to="/userprofile">Profile</NavLink>
                            ) : (
                              ""
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </Breakpoint>
          </BreakpointProvider>

          <div className="mainside">{METABTN}</div>
        </div>

        <button className="nav-icon" onClick={() => btn_icon(!showmenu)}>
          <div className="menu-line white"></div>
          <div className="menu-line1 white"></div>
          <div className="menu-line2 white"></div>
        </button>
      </div>
    </header>
  );
};

export default Header;
