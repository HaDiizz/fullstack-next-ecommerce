import React, { useState, useContext, useEffect } from "react";
import Head from "next/head";
import Image from "next/image";
import banner1 from "../public/images/banner1.jpg";
import banner2 from "../public/images/banner2.jpg";
import banner3 from "../public/images/banner3.jpg";
import Typed from "react-typed";
import { AiOutlineShoppingCart } from "react-icons/ai";
// import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
// import { Carousel } from "react-responsive-carousel";
import { Link, Element } from "react-scroll";
import ShopItem from "../components/shop/ShopItem";
import { getData } from "../utils/fetchData";
import { Input } from "@nextui-org/react";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import { DataContext } from "../store/GlobalState";
import { BsSearch } from "react-icons/bs";

const Home = (props) => {
  const { state, dispatch } = useContext(DataContext);
  const { locations } = state;
  const [shops, setShop] = useState(props?.shops);
  const [filter, setFilter] = useState([]);
  const [location, setLocation] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    setShop(props.shops);
  }, [props.shops]);

  const handleSearch = (e) => {
    setSearch(e.target.value);
    console.log(e.target.value);
  };

  const handleLocation = (e) => {
    setLocation(e.target.value);
    console.log(e.target.value);
  };

  useEffect(() => {
    if (
      (location === "all" && search === "") ||
      (location === "" && search === "")
    ) {
      setFilter(shops);
    } else if ((location === "all" || location === "") && search !== "") {
      const filtered = shops.filter((item) =>
        item.shopName.toLowerCase().includes(search.toLowerCase())
      );
      setFilter(filtered);
    } else if ((location !== "all" || location !== "") && search === "") {
      const filtered = shops.filter((item) => item.location === location);
      setFilter(filtered);
    } else if ((location !== "all" || location !== "") && search !== "") {
      const filtered = shops.filter(
        (item) =>
          item.shopName.toLowerCase().includes(search.toLowerCase()) &&
          item.location === location
      );
      setFilter(filtered);
    }
    // else {
    //   const filtered = shops.filter((item) => item.location === location);
    //   setFilter(filtered);
    // }
  }, [location, shops, search]);

  useEffect(() => {
    setFilter(shops);
  }, [shops]);

  return (
    <div className="items-center justify-center-cover bg-cover">
      <Head>
        <title>Home</title>
      </Head>
      <div className="shop_bg" style={{ zIndex: "0" }}></div>
      <div
        name="banner"
        id="carouselExampleIndicators"
        className="carousel slide hero_image pointer-event"
        data-ride="carousel"
        data-interval="7000"
      >
        <ol className="carousel-indicators"></ol>
        <div className="carousel-inner text-uppercase">
          <div className="absolute z-10 text-white text_banner">

            <h1 className="text-intro bg-gradient-to-l from-indigo-500 via-purple-400 to-indigo-600 font-bold text-gradient drop-shadow-md">
              It&apos;s not just a food, it&apos;s an experience.
            </h1>

            <div className="type_animate pt-10 pb-3">
              <Typed
                strings={[
                  "Order your best food anytime",
                  "Order your best food everywhere",
                  "The Best experience for you",
                ]}
                typeSpeed={40}
                backSpeed={50}
                loop
              />
            </div>
            <br />
            <button className="btn_banner outline outline-1 p-2 rounded-md hover:bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 ">
              <Link to="shop" smooth={true} duration={500} offset={-105}>
                <div className="d-flex">
                  LET&apos;S SHOP
                  <div className="pt-1 pl-2">
                    <AiOutlineShoppingCart />
                  </div>
                </div>
              </Link>
            </button>
          </div>
          <div className="carousel-item active">
            <Image
              className="d-block w-100 banner"
              src={banner1}
              alt={banner1}
            />
          </div>
          <div className="carousel-item">
            <Image
              className="d-block w-100 banner"
              src={banner2}
              alt={banner2}
            />
          </div>
          <div className="carousel-item">
            <Image
              className="d-block w-100 banner"
              src={banner3}
              alt={banner3}
            />
          </div>
        </div>
      </div>

      <Element
        name="shop"
        className="flex flex-wrap justify-center pl-4 pr-4 mt-[15rem] pb-[25rem] text-white items-center justify-center-cover"
      >
        <div className="col-md-12">
          <div className="row">
            <div className="col-md-4 col-sm-12 mb-3">
              <Input
                aria-labelledby="tac"
                width="100%"
                autoComplete="on"
                contentRightStyling={false}
                placeholder="Type your message..."
                onChange={(e) => handleSearch(e)}
                contentRight={
                  <BsSearch className="text-black pr-2" size={25} />
                }
              />
            </div>
            <div className="col-md-4">
              <Select
                // blurOnSelect={true}
                // MenuProps={{
                //   PaperProps: {
                //     onScroll: (event) => {
                //       console.log(event);
                //       console.log("we scroll");
                //     }
                //   },
                // }}
                className="bg-white scrollable"
                defaultValue={"all"}
                id="location"
                style={{
                  maxHeight: "2.5rem",
                  fontFamily: "Prompt",
                  width: "100%",
                }}
                name="location"
                aria-label="location"
                onChange={(e) => handleLocation(e)}
              >
                <MenuItem style={{ fontFamily: "Prompt" }} value="all">
                  แสดงทั้งหมด
                </MenuItem>
                {locations.map((location) => {
                  return (
                    <MenuItem
                      key={location._id}
                      style={{ fontFamily: "Prompt" }}
                      value={location._id}
                    >
                      {location.name}
                    </MenuItem>
                  );
                })}
              </Select>
            </div>
          </div>
        </div>
        {shops &&
          filter?.map((shop, index) => <ShopItem key={index} shop={shop} />)}
      </Element>
    </div>
  );
};

export async function getServerSideProps() {
  const res = await getData("shop");

  return {
    props: {
      shops: res.shops,
    },
  };
}

export default Home;
