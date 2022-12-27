import React, { useEffect, useContext, useState } from "react";
import { FaTimes } from "react-icons/fa";
import { DataContext } from "../store/GlobalState";
import { increase, decrease } from "../store/Actions";
import { TiDeleteOutline } from "react-icons/ti";
import Link from "next/link";

const Sidebar = ({ sidebar, handleToggleSidebar }) => {
  const { state, dispatch } = useContext(DataContext);
  const { auth, cart } = state;
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const getTotal = () => {
      const res = cart.reduce((prev, item) => {
        return prev + item.price * item.quantity;
      }, 0);
      setTotal(res);
    };

    getTotal();
  });

  return (
    <>
      <div className="container-fluid">
        <div className={`sidebar ${sidebar == true ? "active" : ""}`}>
          <div className="sd-header pt-4">
            <FaTimes
              className="text-danger cursor-pointer"
              size={15}
              onClick={handleToggleSidebar}
            />
            <div className="flex space-x-9">
              <h4 className="mb-0">ราคารวม {total} บาท</h4>
              <Link href={"/cart"}>
                <a className="pr-2">Place Order</a>
              </Link>
            </div>
          </div>
          <div className="sd-body">
            <ul>
              {cart.length === 0 ? (
                <>
                  <h1
                    style={{
                      textAlign: "center",
                      marginTop: "15rem",
                      letterSpacing: "10px",
                      textTransform: "uppercase",
                      opacity: "0.7",
                    }}
                  >
                    Cart is empty
                  </h1>
                </>
              ) : (
                cart.map((item) => (
                  <li key={item._id}>
                    <div className="row pb-5 pl-4 border-b-2 border-neutral-200 ml-2 mr-2">
                      <div className="col-md-3 pt-2 col-sm-3 col-4">
                        <img
                          src={item.images[0].url}
                          alt={item.images[0].url}
                          width={100}
                          height={100}
                          style={{ minWidth: "110px", maxHeight: "110px" }}
                          className="img-thumbnail"
                        />
                      </div>
                      <div className="col-md-9 col-sm-9 pl-[5rem] col-8">
                        <div className="row pt-2 flex pl-4">
                          <div className="col-md-9 flex">
                            <h4
                              className="font-extrabold"
                              style={{ fontSize: "16px" }}
                            >
                              {item.title}
                            </h4>

                            <div className="pl-4">
                              <p>{item.price} บาท</p>
                            </div>
                          </div>
                        </div>

                        <div className="row pt-5 flex pl-3">
                          <div className="col-md-6 col-sm-3 flex">
                            <div className="" style={{ minWidth: "115px" }}>
                              <button
                                className="btn btn-outline-secondary"
                                onClick={() =>
                                  dispatch(decrease(cart, item._id))
                                }
                                disabled={item.quantity === 1 ? true : false}
                              >
                                {" "}
                                -{" "}
                              </button>
                              <span className="px-3">{item.quantity}</span>
                              <button
                                className="btn btn-outline-secondary"
                                onClick={() =>
                                  dispatch(increase(cart, item._id))
                                }
                                disabled={
                                  item.quantity === item.inStock ? true : false
                                }
                              >
                                {" "}
                                +{" "}
                              </button>
                            </div>
                            <div
                              className="pr-1 md:pl-6 sm:pr-2"
                              style={{ minWidth: "50px", cursor: "pointer" }}
                            >
                              <TiDeleteOutline
                                className="text-danger"
                                aria-hidden="true"
                                style={{ fontSize: "19px" }}
                                data-toggle="modal"
                                data-target="#exampleModal"
                                onClick={() =>
                                  dispatch({
                                    type: "ADD_MODAL",
                                    payload: [
                                      {
                                        data: cart,
                                        id: item._id,
                                        title: item.title,
                                        type: "ADD_CART",
                                      },
                                    ],
                                  })
                                }
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                ))
              )}
            </ul>
          </div>
        </div>
        <div
          className={`sidebar-overlay ${sidebar == true ? "active" : ""}`}
          onClick={handleToggleSidebar}
        ></div>
      </div>
    </>
  );
};

export default Sidebar;
