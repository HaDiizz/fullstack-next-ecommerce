import Head from "next/head";
import { useContext, useState, useEffect } from "react";
import { DataContext } from "../../../store/GlobalState";
import { useRouter } from "next/dist/client/router";
import { patchData } from "../../../utils/fetchData";
import { updateItem } from "../../../store/Actions";
import Link from "next/link";
import Image from "next/image";
import { IoIosReturnLeft } from "react-icons/io";
import { Row } from "@nextui-org/react";

const ManageShopId = () => {
  const router = useRouter();
  const { id } = router.query;

  const { state, dispatch } = useContext(DataContext);
  const { auth, users, shops, locations } = state;

  const [editShop, setEditShop] = useState([]);

  const [checkSeller, setCheckSeller] = useState(false);
  const [checkAccept, setCheckAccept] = useState(false);

  const [numRole, setNumRole] = useState(0);
  const [numACC, setNumACC] = useState(0);
  const [dataLocation, setDataLocation] = useState("");

  useEffect(() => {
    const newArr = shops.filter((shop) => shop._id === id);
    setEditShop(newArr);
  }, [shops, id]);

  useEffect(() => {
    const newArr = users.filter((user) => user?._id === editShop[0]?.user._id);
    setCheckSeller(newArr[0]?.role === "seller" ? true : false);
  }, [users, editShop]);

  useEffect(() => {
    editShop.map((owner) => {
      setCheckAccept(owner.accepted);
    });
  }, [editShop]);

  const handleCheckSeller = () => {
    setCheckSeller(!checkSeller);
    setNumRole(numRole + 1);
  };

  const handleCheckAccept = () => {
    setCheckAccept(!checkAccept);
    setNumACC(numACC + 1);
  };

  const handleUpdate = () => {
    let role = checkSeller ? "seller" : "user";
    let accepted = checkAccept ? true : false;

    dispatch({ type: "NOTIFY", payload: { loading: true } });

    patchData(`shop/${editShop[0].user._id}`, { role }, auth.token).then(
      (res) => {

        if (res.err)
          return dispatch({ type: "NOTIFY", payload: { error: res.err } });

        dispatch(
          updateItem(
            users,
            editShop[0].user._id,
            {
              ...editShop[0].user,
              role,
            },
            "ADD_USERS"
          )
        );

        setTimeout(() => {
          router.push("/admin/shop");
        }, 500);
        return dispatch({ type: "NOTIFY", payload: { success: res.msg } });
      }
    );

    dispatch({ type: "NOTIFY", payload: { loading: true } });
    patchData(`shop/accept/${editShop[0]._id}`, { accepted }, auth.token).then(
      (res) => {
        setCheckAccept(res.accepted);

        if (res.err)
          return dispatch({ type: "NOTIFY", payload: { error: res.err } });

        dispatch(
          updateItem(
            shops,
            editShop[0]._id,
            {
              ...editShop[0],
              accepted,
            },
            "ADD_SHOP"
          )
        );

        setTimeout(() => {
          router.push("/admin/shop");
        }, 500);
        return dispatch({ type: "NOTIFY", payload: { success: res.msg } });
      }
    );
  };

  useEffect(() => {
    const newArr = locations.filter(
      (item) => item._id === editShop[0]?.location
    );
    setDataLocation(newArr[0]?.name);
  }, [locations, editShop]);

  if (!auth.user) {
    return null;
  }
  if (auth.user && auth.user.role !== "admin" && !auth.user.root) {
    return null;
  }

  return (
    <div className="edit_user my-3 w-100 pt-[5rem]">
      <Head>
        <title>Edit Shop</title>
      </Head>

      <div>
        <button
          className="btn btn-dark ml-5 mt-4"
          onClick={() => router.back()}
        >
          <Row className="mt-2">
            <IoIosReturnLeft />
            <h3 className="ml-2 text-white">ย้อนกลับ</h3>
          </Row>
        </button>
      </div>

      <div className="col-md-6 mx-auto my-4">
        <h3 className="text-uppercase text-secondary mb-4 text-center">
          แก้ไขร้านค้า
        </h3>

        {editShop?.map((shopOwner) => (
          <div key={shopOwner._id}>
            <figure>
              <div className="profileImage flex justify-center">
                <Image
                  src={shopOwner.logo}
                  alt={shopOwner.logo}
                  className="w-50 h-50 mx-auto d-block"
                  width={"200%"}
                  height={"200%"}
                />
              </div>
            </figure>

            <div className="row mt-4 text-white">
              <div className="col-md-6">
                <div className="form-group">
                  <label htmlFor="name" className="d-block">
                    ชื่อเจ้าของร้าน
                  </label>
                  <input
                    type="text"
                    id="name"
                    defaultValue={shopOwner.user.name}
                    disabled
                    className="form-control"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email" className="d-block">
                    อีเมล
                  </label>
                  <input
                    type="text"
                    id="email"
                    defaultValue={shopOwner.user.email}
                    disabled
                    className="form-control"
                  />
                </div>
              </div>

              <div className="col-md-6">
                <div className="form-group">
                  <label htmlFor="name" className="d-block">
                    ชื่อร้าน
                  </label>
                  <input
                    type="text"
                    id="name"
                    defaultValue={shopOwner.shopName}
                    disabled
                    className="form-control"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email" className="d-block">
                    สถานที่ตั้ง
                  </label>
                  <input
                    type="text"
                    id="email"
                    defaultValue={dataLocation}
                    disabled
                    className="form-control"
                  />
                </div>
              </div>
            </div>

            <div className="row text-white">
              <div className="col-md-6">
                <div className="form-group">
                  <input
                    type="checkbox"
                    id="isSeller"
                    checked={checkSeller}
                    style={{ width: "20px", height: "20px" }}
                    onChange={handleCheckSeller}
                  />
                  <label
                    htmlFor="isSeller"
                    style={{ transform: "translate(4px, -3px)" }}
                  >
                    สถานะเจ้าของร้านคือ {checkSeller ? "ผู้ขาย" : "ผู้ซื้อ"}
                  </label>
                </div>
              </div>

              <div className="col-md-6">
                <div className="form-group">
                  <input
                    type="checkbox"
                    id="isAccept"
                    checked={checkAccept}
                    style={{ width: "20px", height: "20px" }}
                    onChange={handleCheckAccept}
                  />
                  <label
                    htmlFor="isAccept"
                    style={{ transform: "translate(4px, -3px)" }}
                  >
                    สถานะร้าน
                  </label>
                </div>
              </div>
            </div>
          </div>
        ))}

        <button className="btn btn-dark w-100" onClick={handleUpdate}>
          Update
        </button>
      </div>
    </div>
  );
};

export default ManageShopId;
