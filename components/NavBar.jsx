import React, { useState, useEffect, useContext } from "react";
import { HiMenuAlt1 } from "react-icons/hi";
import { FiShoppingCart } from "react-icons/fi";
import { AiOutlineHeart, AiOutlineUser } from "react-icons/ai";
import { FaTimes } from "react-icons/fa";
import { Link, scroller } from "react-scroll";
import ModalSignin from "./ModalSignin";
import {
  Row,
  Tooltip,
  User,
  Text,
  Dropdown,
  Avatar,
  Grid,
} from "@nextui-org/react";
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

          <Dropdown placement="bottom-left">
            <Dropdown.Trigger>
              <User src={auth.user.avatar} css={{ p: 0 }}>
                <Row>
                  <Text size={14} css={{ tt: "capitalize", color: "white" }}>
                    {auth.user.name}
                  </Text>
                </Row>
                {auth.user.role}
              </User>
            </Dropdown.Trigger>
            <Dropdown.Menu color="primary" aria-label="User Actions">
              <Dropdown.Item key="profile" textValue css={{ height: "$18" }}>
                <Text b color="primary" css={{ d: "flex" }}>
                  {auth.user.email}
                </Text>
              </Dropdown.Item>
              <Dropdown.Item key="settings" textValue withDivider>
                <NextLink href="/profile">
                  <a className="text-black">โปรไฟล์</a>
                </NextLink>
              </Dropdown.Item>
              <Dropdown.Item textValue key="team_settings">
                {auth.user && auth.user.role === "admin" ? (
                  <NextLink href="/admin/shop">
                    <a className="text-black">ร้านค้า</a>
                  </NextLink>
                ) : auth.user.role === "seller" ? (
                  <NextLink href="/manage">
                    <a className="text-black">จัดการร้านค้า</a>
                  </NextLink>
                ) : (
                  <NextLink href="/register">
                    <a className="text-black">ลงทะเบียนร้านค้า</a>
                  </NextLink>
                )}
              </Dropdown.Item>
              {auth?.user && auth?.user.role === "admin" && (
                <Dropdown.Item key="users" textValue>
                  <NextLink href="/admin/user">
                    <a className="text-black">ผู้ใช้งาน</a>
                  </NextLink>
                </Dropdown.Item>
              )}
              {auth.user && auth.user.role === "admin" && (
                <Dropdown.Item key="services" textValue>
                  <NextLink href="/admin/services">
                    <a className="text-black">การบริการ</a>
                  </NextLink>
                </Dropdown.Item>
              )}
              {auth.user && auth.user.role === "admin" && (
                <Dropdown.Item key="location" textValue>
                  <NextLink href="/admin/location">
                    <a className="text-black">สถานที่</a>
                  </NextLink>
                </Dropdown.Item>
              )}

              <Dropdown.Item key="logout" color="error" textValue withDivider>
                <button onClick={handleLogout}>ออกจากระบบ</button>
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>

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
              className="px-6 py-2 rounded-2xl text-white outline outline-[2px] hover:bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 account_btn"
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
