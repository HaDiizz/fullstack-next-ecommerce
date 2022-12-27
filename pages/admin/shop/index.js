import Head from "next/head";
import { useContext, useState, useEffect } from "react";
import { DataContext } from "../../../store/GlobalState";
import Link from "next/link";
import {
  AiOutlineCloseCircle,
  AiOutlineCheckCircle,
  AiFillEdit,
  AiFillDelete,
} from "react-icons/ai";
import { FaEdit } from "react-icons/fa";
import Image from "next/image";
import moment from "moment";
import { Row, Input } from "@nextui-org/react";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

const AdminManageShop = () => {
  const { state, dispatch } = useContext(DataContext);
  const { auth, shops } = state;
  const [dropdown, setDropdown] = useState([]);
  const [search, setSearch] = useState("");
  const [filtered, setFiltered] = useState([]);

  const handleSelectAccepted = (e) => {
    const value = e.target.value;
    if (value === "all") {
      setDropdown(shops);
    } else {
      const filtered = shops.filter((item) => item.accepted === value);
      setDropdown(filtered);
    }
  };

  useEffect(() => {
    if (auth.user) {
      setDropdown(shops);
    }
  }, [shops, auth.user]);

  if (!auth.user) {
    return null;
  }
  if (auth.user && auth.user.role !== "admin" && !auth.user.root) {
    return null;
  }

  return (
    <div className="flex h-screen container">
      <Head>
        <title>Admin Manage Shop</title>
      </Head>
      <div className="justify-center text-center text-white col-md-12 mt-[10rem]">
        <h3 className="p-3 text-secondary uppercase">Admin Manage Shops</h3>
        <Row justify="left">
          <FormControl sx={{ m: 1, width: "30ch" }} className="text-dark">
            <Select
              className="bg-white scrollable"
              defaultValue={"all"}
              id="accepted"
              style={{ maxHeight: "2.5rem", fontFamily: "Prompt" }}
              name="accepted"
              aria-label="accepted"
              onChange={(e) => handleSelectAccepted(e)}
            >
              <MenuItem style={{ fontFamily: "Prompt" }} value="all">
                แสดงทั้งหมด
              </MenuItem>
              <MenuItem style={{ fontFamily: "Prompt" }} value={true}>
                อนุมัติแล้ว
              </MenuItem>
              <MenuItem style={{ fontFamily: "Prompt" }} value={false}>
                รอดำเนินการ
              </MenuItem>
            </Select>
          </FormControl>
          <div className="pt-[0.8rem]">
          </div>
        </Row>
        <div className="my-3 table-responsive pb-5">
          <table
            className="table-bordered w-100 text-uppercase"
            style={{ minWidth: "600px", cursor: "pointer" }}
          >
            <thead className="bg-light font-weight-bold text-dark">
              <tr>
                <td className="p-2">รูปภาพร้าน</td>
                <td className="p-2">ไอดี</td>
                <td className="p-2">ชื่อร้าน</td>
                <td className="p-2">เจ้าของร้าน</td>
                <td className="p-2">ร้านอาหารอิสลาม</td>
                <td className="p-2">สร้างเมื่อ</td>
                <td className="p-2">อัปเดต</td>
                <td className="p-2">สถานะ</td>
                <td className="p-2">ACTIONS</td>
              </tr>
            </thead>

            <tbody>
              {dropdown?.map((shop) => (
                <tr key={shop._id}>
                  <td className="p-2">
                    <Image src={shop.logo} width="100%" height="100%" alt="logo" />
                  </td>
                  <td className="p-2">
                    <Link href="#">
                      <a>
                        {shop._id.substring(0, 6)}...
                        {shop._id.substring(shop._id.length - 6)}
                      </a>
                    </Link>
                  </td>
                  <td className="p-2">{shop.shopName}</td>
                  <td className="p-2">{shop.user.name}</td>
                  <td className="p-2">{shop.isHalal ? "ใช่" : "ไม่ใช่"}</td>
                  <td className="p-2">
                    {moment(shop.createdAt).locale("th").format("llll")}
                  </td>
                  <td className="p-2">
                    {moment(shop.updatedAt).startOf(shop.updatedAt).fromNow()}
                  </td>
                  <td className="p-2" style={{ textAlign: "center" }}>
                    {shop.accepted ? (
                      <div className="text-green-500 flex justify-center">
                        {/* <AiOutlineCheckCircle /> */}
                        <span className="badge badge-success">อนุมัติแล้ว</span>
                      </div>
                    ) : (
                      <div className="text-red-500 flex justify-center ">
                        {/* <AiOutlineCloseCircle /> */}
                        <span className="badge badge-danger">รอดำเนินการ</span>
                      </div>
                    )}
                  </td>

                  <td className="p-2">
                    <div className="flex justify-center">
                      {auth.user && auth?.user.role === 'admin' && (
                        <Link href={`shop/${shop._id}`}>
                          <a style={{ textDecoration: "none" }}>
                            <FaEdit
                              className="mr-4 text-primary"
                              size={25}
                            />
                          </a>
                        </Link>
                      )}
                      <AiFillDelete
                        size={25}
                        className="text-danger ml-4"
                        title="Remove"
                        data-toggle="modal"
                        data-target="#exampleModal"
                        onClick={() =>
                          dispatch({
                            type: "ADD_MODAL",
                            payload: [
                              {
                                data: shops,
                                id: shop._id,
                                title: shop.shopName,
                                type: "ADD_SHOP",
                              },
                            ],
                          })
                        }
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminManageShop;
