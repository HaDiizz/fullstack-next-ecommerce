import React, { useContext, useEffect } from "react";
import Link from "next/link";
import { DataContext } from "../../store/GlobalState";
import Image from "next/image";
import { Card, Col, Row, Button, Text, Grid } from "@nextui-org/react";
import { BsCartPlus } from "react-icons/bs";
import Checkbox from "@mui/material/Checkbox";
import FavoriteBorder from "@mui/icons-material/FavoriteBorder";
import Favorite from "@mui/icons-material/Favorite";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import { addToList } from "../../store/Actions";
import { motion } from "framer-motion";

const ShopItem = ({ shop }) => {
  const { state, dispatch } = useContext(DataContext);
  const { lists, locations } = state;
  const [isChecked, setIsChecked] = React.useState(false);
  const [dataList, setDataList] = React.useState([]);
  const [dataLocation, setDataLocation] = React.useState("");

  const label = { inputProps: { "aria-label": "Checkbox demo" } };

  useEffect(() => {
    const newArr = lists.filter((list) => list._id === shop._id);
    setDataList(newArr);
    // console.log(newArr)
  }, [lists]);

  useEffect(() => {
    const newArr = locations.filter(
      (location) => location._id === shop.location
    );
    // console.log(newArr);
    setDataLocation(newArr[0]?.name);
  }, [locations]);

  // console.log("SHOP= "+shop)
  return (
    <motion.div layout>
      <div
        className="flex flex-col items-center justify-center bg-neutral-800 text-white rounded-3xl shadow-md p-auto m-14 w-full overflow-hidden card box1 sm:w-[50rem]"
        style={{
          height: "320px", //20
          width: "304px", //19
          zIndex: "1",
          cursor: "pointer",
        }}
      >
        <Image src={shop.logo} alt={"logo"} width="1000" height="1200" />
        <span
          className="absolute pl-3 pt-3 uppercase bg-black span_status"
          style={{
            // top: "0",
            // left: "0",
            fontWeight: "900",
            padding: "3px 7px",
            paddingRight: "9px",
            background: "#000000c2",
            borderRadius: "50%",
            left: "4px",
            color: "white",
            fontSize: "10px",
            top: "2px",
          }}
        >
          {shop.status ? (
            <p className="text-success pb-1 pr-1">Open</p>
          ) : (
            <p className="text-danger pb-1 pr-1">Closed</p>
          )}
        </span>

        <span
          className="absolute pt-2 uppercase span_list"
          style={{
            // top: "0",
            // left: "0",
            fontWeight: "900",
            background: "#ffffffc2",
            padding: "3px 7px",
            paddingRight: "9px",
            borderRadius: "50%",
            right: "4px",
            color: "white",
            fontSize: "10px",
            top: "2px",
          }}
        >
          <Checkbox
            {...label}
            icon={<FavoriteBorder className="text-red-500" />}
            checkedIcon={<Favorite className="text-red-500" />}
            //check find shop id or no
            checked={dataList.length > 0 ? true : false}
            onChange={() => {
              dispatch(addToList(shop, lists));
            }}
          />
        </span>
        <div className="content text-white p-3 pt-2 pb-2">
          <h3>{shop.shopName}</h3>
          {/* <p className="container" style={{ fontSize: "10px" }}>
            {shop.detail.substring(0, 100)}...
          </p> */}
          {/* <p>ติดต่อ : {shop.contact}</p> */}
          <p>สถานที่ : {dataLocation}</p>
          <p>ประเภทร้านอาหาร : {shop.isHalal ? "รองรับฮาลาล" : "ทั่วไป"}</p>
          <ul>
            <li>
              <Link href={`/products/${shop._id}`}>
                <a>
                  <BsCartPlus size={30} />
                </a>
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </motion.div>
  );
};

export default ShopItem;
