import React, { useEffect, useState, useContext } from "react";
import OrderDetail from "../../../components/OrderDetail";
import { DataContext } from "../../../store/GlobalState";
import { Row, Tooltip, User, Text, Modal, Image } from "@nextui-org/react";
import Link from "next/link";
import moment from "moment";
import DataTable, { createTheme } from "react-data-table-component";
import { AiOutlineEye, AiOutlineCheck } from "react-icons/ai";
import Head from "next/head";
import { AiOutlineFileSearch, AiFillTool } from "react-icons/ai";
import { putData } from "../../../utils/fetchData";
import { FaRegCalendarTimes } from "react-icons/fa";

const Order = () => {
  const { state, dispatch } = useContext(DataContext);
  const { cart, auth, manageOrder } = state;
  const [count, setCount] = useState(1);

  const [visible, setVisible] = React.useState(false);
  const handler = () => setVisible(true);
  const closeHandler = () => {
    setVisible(false);
    // console.log("closed");
  };

  const handleCancel = (e, item) => {
    e.preventDefault();
    setCount(5);
    item.status = count + item.status;
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

      return dispatch({ type: "NOTIFY", payload: { success: res.msg } });
    });
  };

  const handleUpdate = (e, item) => {
    e.preventDefault();
    setCount(count + 1);
    if (item.status < 1) {
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

      return dispatch({ type: "NOTIFY", payload: { success: res.msg } });
    });
  };

  const columns =
    // useMemo (() =>
    [
      {
        name: "Order ID",
        // sortable: true,
        sortField: "id",
        // hide: "sm",
        selector: (row) => (
          <Link href={`/manage/order/${row._id}`}>
            <a>
              {row?._id.substring(0, 6)}...
              {row?._id.substring(row?._id.length - 5)}
            </a>
          </Link>
        ),
      },
      {
        name: "ลูกค้า",
        sortable: true,
        sortField: "name",
        selector: (row) => row.user.name,
        // hide: "sm",
      },
      {
        name: "เบอร์โทร",
        sortable: true,
        sortField: "telephone",
        selector: (row) => row.user.telephone,
        // hide: "sm",
      },
      {
        name: "เวลาออเดอร์",
        sortable: true,
        sortField: "createdAt",
        selector: (row) => moment(row.createdAt).format("LLL"),
        // hide: "sm",
      },
      {
        name: "เวลารับออเดอร์",
        sortable: true,
        sortField: "time",
        selector: (row) => row.time
      },
      {
        name: "สถานะการชำระเงิน",
        sortable: true,
        sortField: "paid",
        selector: (row) =>
          row.paid ? (
            <p className="text-green-500">ชำระเงินเรียบร้อยแล้ว</p>
          ) : (
            "ค้างการชำระ"
          ),
        conditionalCellStyles: [
          {
            when: (row) => row.paid,
            classNames: ["text-green-500"],
            style: {
              fontWeight: "bold",
              color: "green",
            },
            when: (row) => row.paid === false,
            classNames: ["text-red-500"],
            style: {
              fontWeight: "bold",
              color: "red",
            },
          },
        ],
      },
      {
        name: "สถานะออเดอร์",
        // sortable: true,
        sortField: "status",
        selector: (row) =>
          row?.status === 0 ? (
            <span className="badge badge-warning">รอดำเนินการ</span>
          ) : row?.status === 1 ? (
            <span className="badge badge-primary">กำลังทำอาหาร</span>
          ) : row?.status === 2 ? (
            <span className="badge badge-success">เสร็จสิ้น</span>
          ) : (
            <span className="badge badge-danger">ยกเลิก</span>
          ),
      },
      {
        name: "Action",
        selector: (row) =>
          auth.user && auth?.user.role === "seller" ? (
            <>
              <Row justify="space-between" className="space-x-5">
                {row.method === "PromptPay" && (
                  <Tooltip
                    content={"ดูหลักฐานการชำระเงิน"}
                    trigger="hover"
                    color="secondary"
                    placement="bottomStart"
                  >
                    <a href={row.image} target={'_blank'}>
                    <AiOutlineFileSearch
                      className="hover:cursor-pointer"
                      size={25}
                    //   onClick={handler}
                    />
                    </a>
                  </Tooltip>
                )}
                <Tooltip
                  content={"อัพเดทสถานะออเดอร์"}
                  trigger="hover"
                  color="invert"
                  placement="bottomEnd"
                >
                  <AiFillTool
                    className="hover:cursor-pointer"
                    size={25}
                    onClick={(e) => handleUpdate(e, row)}
                  />
                </Tooltip>{" "}
              </Row>
              {/* <Modal noPadding open={visible} onClose={closeHandler}>
                <Modal.Header
                  css={{ position: "absolute", zIndex: "$1", top: 5, right: 8 }}
                ></Modal.Header>
                <Modal.Body>
                  <a href="" target={'_blank'}>{row.image}</a>
                </Modal.Body>
              </Modal> */}
            </>
          ) : (
            ""
          ),
        // hide: "sm",
      },
      {
        name: "Cancel",
        selector: (row) =>
          auth.user && auth?.user.role === "seller" ? (
            <Tooltip
              content={"ยกเลิกออเดอร์"}
              trigger="hover"
              color="error"
              placement="bottomStart"
            >
              <FaRegCalendarTimes
                size={25}
                className="text-red-500 hover:cursor-pointer"
                onClick={(e) => handleCancel(e, row)}
              />
            </Tooltip>
          ) : (
            ""
          ),
      },
    ];

  createTheme("dark", {
    background: {
      default: "transparent",
    },
    context: {
      background: "transparent",
    },
    divider: {
      default: "transparent",
    },
  });

  return (
    <div className="pt-5">
      <Head>
        <title>Order</title>
      </Head>
      <div className="shop_bg" style={{ zIndex: "0" }}></div>

      <h1 className="pb-5 pt-5 text-center text-uppercase text-secondary">
        Orders
      </h1>

      <DataTable
        title="Orders"
        columns={columns}
        data={manageOrder}
        theme="dark"
        pagination
        paginationPerPage={20}
        defaultSortField="createdAt"
        defaultSortAsc={false}
        // fixedHeader
        // fixedHeaderScrollHeight="450px"
        highlightOnHover
      />
    </div>
  );
};

export default Order;
