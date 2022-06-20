import Head from "next/dist/shared/lib/head";
import { useContext, useState, useEffect } from "react";
import { DataContext } from "../../store/GlobalState";
import { patchData, getData } from "../../utils/fetchData";
import Link from "next/link";
import noDataSVG from "../../public/images/void.svg";
import Image from "next/image";

const Manage = () => {
  const { state, dispatch } = useContext(DataContext);
  const { auth, shops, products, locations } = state;

  const [checkStatus, setCheckStatus] = useState(false);
  const [numCheck, setNumCheck] = useState(0);
  const [id, setId] = useState("");
  const [checkHalal, setCheckHalal] = useState(false);
  const [numCheckHalal, setNumCheckHalal] = useState(0);
  const [dataLocation, setDataLocation] = useState({
    name: "",
  });
  const { name } = dataLocation;

  useEffect(() => {
    Object.values(shops).map((owner) => {
      setId(owner._id);
      setCheckStatus(owner.status);
      setCheckHalal(owner.isHalal);
    });
  }, [shops]);

  const handleCheckStatus = () => {
    setCheckStatus(!checkStatus);
    setNumCheck(numCheck + 1);
  };

  const handleCheckHalal = () => {
    setCheckHalal(!checkHalal);
    setNumCheckHalal(numCheckHalal + 1);
  };

  const updateStatus = () => {
    let status = checkStatus ? true : false;
    let isHalal = checkHalal ? true : false;

    if (numCheck % 2 !== 0) {
      dispatch({ type: "NOTIFY", payload: { loading: true } });

      patchData(`shop/status/${id}`, { status }, auth.token).then((res) => {
        setCheckStatus(res.status);
        if (res.err)
          return dispatch({ type: "NOTIFY", payload: { error: res.err } });

        setNumCheck(0);
        return dispatch({ type: "NOTIFY", payload: { success: res.msg } });
      });
    }

    if (numCheckHalal % 2 !== 0) {
      dispatch({ type: "NOTIFY", payload: { loading: true } });

      patchData(`shop/status/${id}`, { isHalal }, auth.token).then((res) => {
        setCheckHalal(res.isHalal);
        if (res.err)
          return dispatch({ type: "NOTIFY", payload: { error: res.err } });

        setNumCheckHalal(0);
        return dispatch({ type: "NOTIFY", payload: { success: res.msg } });
      });
    }
  };

  useEffect(() => {
    const newArr = locations?.filter(
      (location) => location?._id === shops[0]?.location
    );
    setDataLocation({
      ...dataLocation,
      name: newArr?.[0]?.name,
    });
  }, [locations]);

  if (!auth.user) return null;
  if (auth.user.role !== "seller") return null;

  return (
    <div className="">
      <Head>
        <title>Manage</title>
      </Head>

      <div className="shop_bg"></div>

      <div className="pt-[8rem] container pb-5 pl-[7rem] pr-[7rem]">
        <div className="flex space-x-6 sticky">
          <Link href={"/manage/product"}>
            <a className="text-sky-500 font-bold">จัดการสินค้า</a>
          </Link>

          <Link href={`/manage/category`}>
            <a className="text-purple-600 font-bold hover:text-purple-500">
              จัดการหมวดหมู่สินค้า
            </a>
          </Link>

          <Link href={`/manage/order`}>
            <a className="text-orange-600 font-bold hover:text-orange-500">
              จัดการคำสั่งซื้อ
            </a>
          </Link>
          {Object.values(shops).map((shop) => (
            <div key={shop?._id}>
              <Link href={`/manage/shop/${shop._id}`}>
                <a className="text-red-600 font-bold hover:text-red-500">
                  แก้ไขร้านค้า
                </a>
              </Link>
            </div>
          ))}
        </div>

        <div className="row pt-5 text-uppercase text-secondary">
          {Object.values(shops).map((shop) => (
            <div className="col-md-5 pb-5" key={shop?._id}>
              <h1 className="text-secondary pb-3" style={{ fontSize: "150%" }}>
                รายละเอียดร้านค้า
              </h1>

              <div className="avatar mt-2 pt-2 flex justify-center">
                <img src={shop?.logo} alt="logo" height={"90%"} width="90%" />
              </div>

              <div className="form-group">
                <div className="row pt-3">
                  <label className="pr-2 ml-3" htmlFor="isAccept">
                    สถานะร้าน:
                  </label>
                  {checkStatus ? (
                    <h6 className="text-green-500">เปิด</h6>
                  ) : (
                    <h6 className="text-red-500">ปิด</h6>
                  )}
                </div>

                <div className="row">
                  <input
                    type="checkbox"
                    id="status"
                    className="form-control ml-3 mt-2 mr-5"
                    checked={checkStatus}
                    style={{ width: "20px", height: "20px" }}
                    onChange={handleCheckStatus}
                  />

                  <button
                    className="btn btn-outline-dark ml-5 text-white"
                    onClick={updateStatus}
                  >
                    แก้ไขสถานะ
                  </button>
                </div>
              </div>

              <div className="form-group">
                <div className="row pt-3">
                  <label className="pr-2 ml-3" htmlFor="isHalal">
                    ประเภท:
                  </label>
                  {checkHalal ? (
                    <h6 className="text-green-500">ฮาลาล</h6>
                  ) : (
                    <h6 className="text-red-500">ไม่ฮาลาล</h6>
                  )}
                </div>

                <div className="row">
                  <input
                    type="checkbox"
                    id="status"
                    className="form-control ml-3 mt-2 mr-5"
                    checked={checkHalal}
                    style={{ width: "20px", height: "20px" }}
                    onChange={handleCheckHalal}
                  />

                  <button
                    className="btn btn-outline-dark ml-5 text-white"
                    onClick={updateStatus}
                  >
                    แก้ไขประเภท
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="name" className="d-block">
                  ชื่อร้าน
                </label>
                <input
                  type="text"
                  value={shop.shopName}
                  className="form-control"
                  disabled
                />
              </div>

              <div className="form-group">
                <label htmlFor="contact" className="d-block">
                  Promptpay
                </label>
                <input
                  type="text"
                  value={shop.contact}
                  className="form-control"
                  disabled
                />
              </div>

              <div className="form-group">
                <label htmlFor="detail" className="d-block">
                  รายละเอียด
                </label>
                <textarea
                  type="text"
                  cols="20"
                  rows="3"
                  value={shop.detail}
                  className="form-control"
                  disabled
                />
              </div>

              <div className="form-group">
                <label htmlFor="location" className="d-block">
                  ที่อยู่
                </label>
                <input
                  type="text"
                  value={name}
                  className="form-control"
                  disabled
                />
              </div>
            </div>
          ))}
          <div className="col-md-6 pl-5 col-sm-12">
            <h1 className="text-secondary pb-3" style={{ fontSize: "150%" }}>
              สินค้า
            </h1>
            {products && products?.length === 0 ? (
              <div className="text-center">
                <h1 className="flex justify-center text-center pt-5 text-white pb-5">
                  ไม่มีสินค้า
                </h1>
                <Image src={noDataSVG} width="200%" height="200%" />
              </div>
            ) : (
              products?.map((product) => (
                <div className="row mb-5" key={product?._id}>
                  <div className="col-md-4">
                    <div className="avatar mt-2 pb-4 pt-2 flex justify-center">
                      <img
                        src={product?.images[0].url}
                        alt="images"
                        style={{
                          width: "100px",
                          height: "100px",
                          objectFit: "cover",
                        }}
                      />
                    </div>
                  </div>
                  <div className="col-md-4 place-self-center">
                    <div className="form-group">
                      <label htmlFor="name" className="d-block">
                        ชื่อสินค้า
                      </label>
                      <input
                        type="text"
                        value={product?.title}
                        className="form-control"
                        disabled
                      />
                    </div>
                  </div>
                  <div className="col-md-4 place-self-center">
                    <div className="form-group">
                      <label htmlFor="price" className="d-block">
                        ราคา
                      </label>
                      <input
                        type="text"
                        value={product?.price}
                        className="form-control"
                        disabled
                      />
                    </div>
                  </div>
                  <div className="row container text-center">
                    <div
                      className="col-md-12 pl-[6rem]"
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <Link href={`/manage/product/edit/${product?._id}`}>
                        <a
                          className="px-4 py-2 rounded text-white font-bold bg-neutral-700 hover:bg-sky-600"
                          style={{ marginRight: "5px", flex: 1 }}
                        >
                          แก้ไข
                        </a>
                      </Link>
                      <button
                        className="px-4 py-2 rounded text-white font-bold bg-red-500 hover:bg-red-600"
                        data-toggle="modal"
                        data-target="#exampleModal"
                        style={{ marginLeft: "5px", flex: 1 }}
                        onClick={() =>
                          dispatch({
                            type: "ADD_MODAL",
                            payload: [
                              {
                                data: products,
                                id: product?._id,
                                title: product?.title,
                                type: "ADD_PRODUCTS",
                              },
                            ],
                          })
                        }
                      >
                        ลบ
                      </button>
                    </div>
                  </div>
                  <hr style={{ width: "200rem" }} />
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Manage;
