import React, { useEffect, useState, useContext } from "react";
import OrderDetail from "../../components/OrderDetail";
import { DataContext } from "../../store/GlobalState";
import {
  Table,
  Row,
  Col,
  Tooltip,
  User,
  Text,
  useAsyncList,
  useCollator,
} from "@nextui-org/react";
import Link from "next/link";
import moment from "moment";
import DataTable, { createTheme } from "react-data-table-component";
import { AiOutlineEye, AiOutlineCheck } from "react-icons/ai";
import Head from "next/head";
import { getData } from "../../utils/fetchData";

const Order = () => {
  const { state, dispatch } = useContext(DataContext);
  const { cart, auth } = state;
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (auth?.user) {
      getData("/order/list", auth?.token).then((res) => {
        // console.log(res);
        setOrders(res.orders);
      });
    }
  }, [auth]);

  const columns =
    // useMemo (() =>
    [
      {
        name: "Order ID",
        // sortable: true,
        sortField: "id",
        // hide: "sm",
        selector: (row) => (
          <Link href={`/order/${row._id}`}>
            <a>
            {row?._id.substring(0, 6)}...
            {row?._id.substring(row?._id.length - 5)}
            </a>
          </Link>
        ),
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
        // selector: (row) => moment(row.time).format("LLL"),
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
        // conditionalCellStyles: [
        //   {
        //     when: (row) => row.status,
        //     classNames: ["text-success"],
        //     style: {
        //       fontWeight: "bold",
        //     },
        //   },
        // ],
        // hide: "sm",
      },
      {
        name: "Action",
        sortable: true,
        selector: (row) =>
          row.paid ? (
            <span className="badge badge-success">
              <AiOutlineCheck size={25} />
            </span>
          ) : (
            <Link href={`/order/${row._id}`}>
              <a>
                <AiOutlineEye size={25} />
              </a>
            </Link>
          ),
        // hide: "sm",
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
        data={orders}
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
