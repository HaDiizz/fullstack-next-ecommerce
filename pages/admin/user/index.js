import React, { useState, useEffect, useContext } from "react";
import Head from "next/head";
import { DataContext } from "../../../store/GlobalState";
import DataTable, { createTheme } from "react-data-table-component";
import Image from "next/image";
import moment from "moment";
import { patchData } from "../../../utils/fetchData";
import { updateItem } from "../../../store/Actions";

import { Select, Tag } from "antd";

const AdminManageUsers = () => {
  const { state, dispatch } = useContext(DataContext);
  const { users, auth } = state;
  const [filteredData, setFilteredData] = useState([]);
  const [search, setSearch] = useState("");

  const roles = ["admin", "user", "seller"];

  const columns =
    // useMemo (() =>
    [
      {
        // name: "image",
        // sortable: true,
        // sortField: "image",
        hide: "sm",
        selector: (row) => <Image width={40} height={35} src={row.avatar} alt="logo" />,
      },
      {
        name: "Name",
        sortable: true,
        sortField: "name",
        selector: (row) => row.name,
      },
      {
        name: "Email",
        sortable: true,
        sortField: "email",
        selector: (row) => row.email,
      },
      {
        name: "Telephone NO.",
        sortable: true,
        sortField: "telephone",
        selector: (row) => row.telephone,
      },
      {
        name: "Role",
        // sortable: true,
        sortField: "role",
        selector: (row) => {
          return row.role === "admin" ? (
            <span className="badge badge-danger uppercase">{row.role}</span>
          ) : (
            <Select
              defaultValue={row.role}
              value={row.role}
              style={{ width: 120 }}
              onChange={(e) => handleChange(e, row._id, row)}
            >
              {roles.map((item, index) => (
                <Select.Option key={index} value={item}>
                  {item === "admin" ? (
                    <Tag color={"red"}>{item}</Tag>
                  ) : item === "user" ? (
                    <Tag color={"blue"}>{item}</Tag>
                  ) : (
                    <Tag color={"green"}>{item}</Tag>
                  )}
                </Select.Option>
              ))}
            </Select>
          );
        },
        // hide: "sm",

        // conditionalCellStyles: [
        //   {
        //     when: (row) => row.role === "user",
        //     classNames: ["text-primary uppercase"],
        //     style: {
        //       fontWeight: "bold",
        //     },
        //   },
        //   {
        //     when: (row) => row.role === "admin",
        //     classNames: ["text-danger uppercase"],
        //     style: {
        //       fontWeight: "bold",
        //     },
        //   },
        //   {
        //     when: (row) => row.role === "seller",
        //     classNames: ["text-orange-500 uppercase"],
        //     style: {
        //       fontWeight: "bold",
        //     },
        //   },
        // ],
      },
      {
        name: "IsVerified",
        sortable: true,
        sortField: "isVerified",
        selector: (row) => (row.isVerified ? "YES" : "NO"),
        conditionalCellStyles: [
          {
            when: (row) => row.isVerified,
            classNames: ["text-success"],
            style: {
              fontWeight: "bold",
            },
          },
          {
            when: (row) => !row.isVerified,
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
        name: "updatedAt",
        sortable: true,
        sortField: "updatedAt",
        selector: (row) =>
          moment(row.updatedAt).startOf(row.updatedAt).fromNow(),
        hide: "sm",
      },
      {
        name: "Action",
        cell: (row) => (
          <button
            className="bg-purple-700 btn text-white"
            title="Remove"
            data-toggle="modal"
            data-target="#exampleModal"
            onClick={() =>
              dispatch({
                type: "ADD_MODAL",
                payload: [
                  {
                    data: users,
                    id: row._id,
                    title: row.name,
                    type: "ADD_USERS",
                  },
                ],
              })
            }
          >
            Delete
          </button>
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

  useEffect(() => {
    const res = users.filter((item) => {
      return (
        item.name.toLowerCase().match(search.toLowerCase()) ||
        item.email.toLowerCase().match(search.toLowerCase()) ||
        item.role.toLowerCase().match(search.toLowerCase())
      );
    });
    setFilteredData(res);
  }, [search, users]);

  const handleChange = (e, id, user) => {
    const role = e;

    patchData(`user/${id}`, { role }, auth.token).then((res) => {
      if (res.err)
        return dispatch({ type: "NOTIFY", payload: { error: res.err } });

      // console.log(res);

      dispatch(
        updateItem(
          users,
          id,
          {
            ...user,
            role,
          },
          "ADD_USERS"
        )
      );
      return dispatch({ type: "NOTIFY", payload: { success: res.msg } });
    });
  };

  if (!auth.user) {
    return null;
  }
  if (auth.user && auth.user.role !== "admin" && !auth.user.root) {
    return null;
  }

  return (
    <div className="justify-center text-center col-md-12 mt-[10rem] container px-5 text-white">
      <Head>
        <title>Manage Users</title>
      </Head>
      <>
        <input
          type="text"
          placeholder="Search.."
          className="form-control w-25"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <DataTable
          title="Admin Manage Users"
          columns={columns}
          data={filteredData}
          theme="dark"
          pagination
          paginationPerPage={20}
          defaultSortField="createdAt"
          defaultSortAsc={false}
          // fixedHeader
          // fixedHeaderScrollHeight="450px"
          highlightOnHover
        />
      </>
    </div>
  );
};

export default AdminManageUsers;
