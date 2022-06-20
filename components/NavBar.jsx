import React, { useState, useEffect, useContext } from "react";
import { HiMenuAlt1 } from "react-icons/hi";
import { FiShoppingCart } from "react-icons/fi";
import { AiOutlineHeart, AiOutlineUser } from "react-icons/ai";
import { FaTimes } from "react-icons/fa";
import { Link, scroller } from "react-scroll";
import { MdOutlineZoomOutMap } from "react-icons/md";
import ModalSignin from "./ModalSignin";
import { Row, Button, Tooltip, User, css, Text } from "@nextui-org/react";
import NextLink from "next/link";
import { useRouter } from "next/router";
import { DataContext } from "../store/GlobalState";
import Cookies from "js-cookie";
import Badge from "@mui/material/Badge";

const NavBar = ({ handleToggleSidebar }) => {
  const [show, setShow] = useState(false);
  const [isClose, setIsClose] = useState("");
  const [visible, setVisible] = React.useState(false);
  const router = useRouter();
  const { state, dispatch } = useContext(DataContext);
  const { auth, cart, lists } = state;

  const [isShop, setIsShop] = useState(
    "hover-underline-animation cursor-pointer"
  );

  const loggedRouter = () => {
    return (
      <div className="button-login ml-5 ">
        <Row>
          <NextLink href="/profile">
            <a>
              <User
                pointer="true"
                className="cursor-pointer"
                size="md"
                squared
                src={auth.user.avatar}
              />
            </a>
          </NextLink>

          <div className="btn-group show text-white dropdown pt-1">
            <span
              className="dropdown-toggle"
              href="#"
              role="button"
              id="dropdownMenuLink"
              data-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false"
            >
              {auth.user.name}
            </span>
            <div className="dropdown-menu" aria-labelledby="dropdownMenuLink">
              <User src={auth.user.avatar} css={{ p: 0 }}>
                <Row>
                  <Text size={14} css={{ tt: "capitalize", color: "white" }}>
                    {auth.user.email}
                  </Text>
                </Row>
                {auth.user.role}
              </User>
              <NextLink href="/profile">
                <a className="dropdown-item">Profile</a>
              </NextLink>
              {auth.user && auth.user.role === "admin" ? (
                <NextLink href="/admin/shop">
                  <a
                    className="dropdown-item"
                    // style={{ fontSize: "16px" }}
                  >
                    Shops
                  </a>
                </NextLink>
              ) : auth.user.role === "seller" ? (
                <NextLink href="/manage">
                  <a
                    className="dropdown-item"
                    // style={{ fontSize: "16px" }}
                  >
                    Manage Shop
                  </a>
                </NextLink>
              ) : (
                <NextLink href="/register">
                  <a
                    className="dropdown-item"
                    // style={{ fontSize: "16px" }}
                  >
                    Register Shop
                  </a>
                </NextLink>
              )}

              {auth.user && auth.user.role === "admin" && (
                <>
                  <NextLink href="/admin/user">
                    <a
                      className="dropdown-item"
                      // style={{ fontSize: "16px" }}
                    >
                      Users
                    </a>
                  </NextLink>
                  <NextLink href="/admin/location">
                    <a
                      className="dropdown-item"
                      // style={{ fontSize: "16px" }}
                    >
                      Locations
                    </a>
                  </NextLink>
                  <NextLink href="/admin/services">
                    <a
                      className="dropdown-item"
                      // style={{ fontSize: "16px" }}
                    >
                      Services
                    </a>
                  </NextLink>
                </>
              )}

              <button
                className="dropdown-item cursor-pointer bg-neutral-700"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          </div>
        </Row>
      </div>
    );
  };

  const handleLogout = () => {
    Cookies.remove("refreshtoken", { path: "api/auth/accessToken" });
    localStorage.removeItem("firstLogin");
    dispatch({ type: "AUTH", payload: {} });

    dispatch({ type: "NOTIFY", payload: { loggedout: "ออกจากระบบสำเร็จ" } });
    return router.push("/");
  };

  const isActive = (r) => {
    if (r === router.pathname) {
      return " active";
    } else {
      return "";
    }
  };

  const handler = (e) => {
    e.preventDefault();
    setVisible(true);
  };

  const handleNavbar = (e) => {
    e.preventDefault();
    // const navbar = document.querySelector('.navbar')
    // const menu = document.querySelector('#bars')
    setShow(!show);
  };

  useEffect(() => {
    if (show) {
      setIsClose("active");
    } else {
      setIsClose("");
    }
  }, [show]);

  const scrollTarget = (target) =>
    scroller.scrollTo(target, { smooth: true, offset: -105 });

  const scrollToPage = async (target) => {
    if (target === "banner" || (target === "shop" && router.pathname !== "/")) {
      await router.push("/");
    }
    scrollTarget(target);
  };

  const changeBg = () => {
    if (window.scrollY > 550 && router.pathname === "/") {
      setIsShop("hover-underline-animation cursor-pointer active");
    } else {
      setIsShop("hover-underline-animation cursor-pointer");
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", changeBg);
  }, [changeBg]);

  return (
    <>
      <header className="">
        <NextLink href="/">
          <a
            className="logo text-white hover:bg-gradient-to-r from-cyan-400 to-blue-500 font-bold hover:text-gradient drop-shadow-md"
            style={{ textDecoration: "none" }}
          >
            {" "}
            NextEcommerce{" "}
          </a>
        </NextLink>

        <nav className={"navbar " + isClose}>
          <Link
            delay={100}
            duration={500}
            to="banner"
            className={
              "hover-underline-animation cursor-pointer" + isActive("/")
            }
            onClick={() => scrollToPage("banner")}
          >
            Home
          </Link>

          <Link
            to="shop"
            // spy={true}
            className={isShop}
            onClick={() => scrollToPage("shop")}
          >
            Shop
          </Link>

          <NextLink href="/order">
            <a
              className={
                "hover-underline-animation cursor-pointer" + isActive("/order")
              }
            >
              Order
            </a>
          </NextLink>

          {auth.user && auth.user.role === "admin" ? (
            <NextLink href="/admin/services">
              <a className="hover-underline-animation">Contact</a>
            </NextLink>
          ) : (
            <NextLink href="/contact">
              <a className="hover-underline-animation">Contact</a>
            </NextLink>
          )}
        </nav>
        {Object.keys(auth).length === 0 ? (
          <div className="button-login ml-5">
            <button
              className="px-6 py-2 rounded-2xl text-white outline outline-[2px] hover:bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"
              onClick={handler}
            >
              Account
            </button>
          </div>
        ) : (
          loggedRouter()
        )}

        <div className="icons d-flex">
          <a className="react_icon" onClick={handleNavbar}>
            {show ? <FaTimes id="times" /> : <HiMenuAlt1 id="bars" />}
          </a>
          <Tooltip
            color="error"
            content="Favorite Lists"
            placement="bottomStart"
          >
            <NextLink href="/list">
              <a className="react_icon hover:animate-bounce">
                <Badge badgeContent={lists.length} color="error" variant="dot">
                  <AiOutlineHeart id="heart" />
                </Badge>
              </a>
            </NextLink>
          </Tooltip>
          <Tooltip color="secondary" content="Cart" placement="bottomStart">
            <a className="react_icon">
              <Badge badgeContent={cart.length} color="secondary">
                <FiShoppingCart
                  id="cart"
                  onClick={() => handleToggleSidebar()}
                />
              </Badge>
            </a>
          </Tooltip>
        </div>
      </header>

      <ModalSignin visible={visible} setVisible={setVisible} />
    </>
  );
};

export default NavBar;
