import React, { useState, useContext, useEffect } from "react";
import Link from "next/link";
import { putData } from "../utils/fetchData";
import { DataContext } from "../store/GlobalState";
import moment from "moment";

const OrderDetail = ({ item }) => {
  const { state, dispatch } = useContext(DataContext);
  const { auth } = state;
  const [count, setCount] = useState(1);

  const handleUpdate = (e) => {
    e.preventDefault();
    setCount(count + 1);
    if (item.status < 2) {
      item.status = item.status + count;
    } else {
      item.status = 2;
    }

    putData(
      `order/${item?._id}`,
      {
        status: item.status,
      },
      auth.token
    ).then((res) => {
      // console.log(res);
      if (res.err)
        return dispatch({ type: "NOTIFY", payload: { error: res.err } });

      // dispatch({
      //   type: "ADD_CATEGORY",
      //   payload: {
      //     token: auth.token,
      //     status: res.status,
      //   },
      // });
      // router.reload()
      return dispatch({ type: "NOTIFY", payload: { success: res.msg } });
    });
  };

  return (
    <>
      <tr className="text-white">
        <td
          // style={{ minWidth: "200px" }}
          className="align-middle"
        >
          <h5 className="text-capitalize text-secondary">
            {
              item?._id && 
              <Link href={`/order/${item?._id}`}>
              <a>
                {item?._id.substring(0, 6)}...
                {item?._id.substring(item?._id.length - 5)}
              </a>
            </Link>
            }
          </h5>
        </td>

        {auth.user && auth?.user.role === "seller" ? (
          <td className="align-middle" style={{ minWidth: "150px" }}>
            {item?.user.name}
          </td>
        ) : (
          // <td className="align-middle" style={{ minWidth: "150px" }}>
          //   {item.shop}
          // </td>
          ""
        )}

        {
          auth.user && auth?.user.role === "seller" ? (
            <td className="align-middle" style={{ minWidth: "150px" }}>
              {item?.tel}
            </td>
          ) : (
            ""
          )
        }

        <td
        // className="align-middle"
        // style={{ minWidth: "50px", cursor: "pointer" }}
        >
          {item?.time}
        </td>

        <td>
          {/* {item?.createdAt.split(" ")[0].split("T")[1].split(".")[0] +
            " - " +
            new Date(item?.createdAt).toDateString()} */}
            {
              moment(item?.createdAt).startOf(item?.createdAt).fromNow()
            }
        </td>

        <td>
          {item?.paid === true ? (
            <span className="badge badge-success">Paid</span>
          ) : (
            <span className="badge badge-danger">Not pay</span>
          )}
        </td>

        <td>
          {
            item?.status === 0 ? (
              <span className="badge badge-warning">รอดำเนินการ</span>
            ) : item?.status === 1 ? (
              <span className="badge badge-primary">กำลังตรวจสอบ</span>
            ) : item?.status === 2 ? (
              <span className="badge badge-success">กำลังทำอาหาร</span>
            ) : item?.status === 3 ? (
              <span className="badge badge-danger">เสร็จสิ้น</span>
            ) : (
              <span className="badge badge-danger">ยกเลิก</span>
            )
          }
        </td>

        {auth.user && auth?.user.role === "seller" && (
          <td>
            <button className="btn btn-secondary" onClick={handleUpdate}>
              update
            </button>
          </td>
        )}
      </tr>
    </>
  );
};

export default OrderDetail;
