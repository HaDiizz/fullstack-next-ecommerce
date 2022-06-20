import React, { useContext, useEffect, useState } from "react";
import { DataContext } from "../../../store/GlobalState";
import DataTable, { createTheme } from "react-data-table-component";
import Image from "next/image";
import moment from "moment";
import { patchData, getData } from "../../../utils/fetchData";
import { updateItem } from "../../../store/Actions";
import Head from "next/head";
import { MdOutlineManageSearch } from "react-icons/md";
import Link from "next/link";

const Services = (props) => {
  const { state, dispatch } = useContext(DataContext);
  const { auth } = state;
  const [data, setData] = useState([]);

  useEffect(() => {
    setData(props.contacts);
    // console.log(props.contacts);
  }, [props.contacts]);

  const columns = [
    {
      name: "Title",
      sortable: true,
      sortField: "title",
      selector: (row) => row.title,
    },
    {
      name: "Email",
      sortable: true,
      sortField: "email",
      selector: (row) => row.email,
    },
    {
      name: "Author",
      sortable: true,
      sortField: "author",
      selector: (row) => row.author,
    },
    {
      name: "Status",
      sortable: true,
      sortField: "status",
      selector: (row) => (row.status ? "เสร็จสิ้น" : "ยังไม่ตอบกลับ"),
      conditionalCellStyles: [
        {
          when: (row) => row.status,
          classNames: ["text-success"],
          style: {
            fontWeight: "bold",
          },
        },
        {
          when: (row) => !row.status,
          classNames: ["text-danger"],
          style: {
            fontWeight: "bold",
          },
        },
      ],
      hide: "sm",
    },
    {
      name: "createdAt",
      sortable: true,
      sortField: "createdAt",
      selector: (row) => moment(row.createdAt).format("LLL"),
      hide: "sm",
    },
    {
      name: "View",
      cell: (row) => (
        <Link href={`/admin/services/${row._id}`}>
          <a>
            <MdOutlineManageSearch size={25} />
          </a>
        </Link>
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

  if (!auth.user) return null;
  if (auth.user.role !== "admin") return null;

  return (
    <div className="justify-center text-center col-md-12 mt-[10rem] container px-5 text-white">
      <Head>
        <title>Manage Services</title>
      </Head>
      <DataTable
        title="Admin Manage Contact"
        columns={columns}
        data={data}
        theme="dark"
        pagination
        paginationPerPage={20}
        defaultSortField="createdAt"
        defaultSortAsc={false}
        highlightOnHover
      />
    </div>
  );
};

export async function getServerSideProps() {
  const res = await getData("contact");
  return {
    props: {
      contacts: res.contacts,
    },
  };
}

export default Services;
