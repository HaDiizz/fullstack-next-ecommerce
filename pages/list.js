import React, { useContext, useState, useEffect } from "react";
import { Table, Row, Col, Tooltip, User, Text } from "@nextui-org/react";
import { StyledBadge } from "../components/StyledBadge.jsx";
import { IconButton } from "../components/IconButton";
import { EyeIcon } from "../components/EyeIcon";
import { EditIcon } from "../components/EditIcon";
import { DeleteIcon } from "../components/DeleteIcon";
import { DataContext } from "../store/GlobalState";
import Link from "next/link";
import { deleteItem } from "../store/Actions.js";
import Head from "next/head";

const List = () => {
  const { state, dispatch } = useContext(DataContext);
  const { auth, lists, locations } = state;
  const [dataLocation, setDataLocation] = useState("");

  useEffect(() => {
    const newArr = locations.filter((item) => item._id === lists[0]?.location);
    setDataLocation(newArr[0]?.name);
  }, [locations, lists]);

  return (
    <>
      <Head>
        <title>Lists</title>
      </Head>
      <div className="shop_bg" style={{ zIndex: "0" }}></div>
      <Table
        className="mt-[7rem]"
        aria-label="Example table with static content"
        css={{
          height: "auto",
          minWidth: "100%",
          color: "white",
        }}
      >
        <Table.Header>
          <Table.Column>ร้านค้า</Table.Column>
          <Table.Column>รายละเอียด</Table.Column>
          <Table.Column>ที่ตั้ง</Table.Column>
          <Table.Column>Action</Table.Column>
        </Table.Header>
        <Table.Body>
          {Object.values(lists).map((item) => (
            <Table.Row key={item._id}>
              <Table.Cell>
                <User size="xl" squared src={item.logo} css={{ p: 0 }}>
                  <Row>
                    <Text size={14} css={{ tt: "capitalize", color: "white" }}>
                      {item.shopName}
                    </Text>
                  </Row>
                  {item.contact}
                </User>
              </Table.Cell>
              <Table.Cell>
                <Col>
                  <Row>
                    <Text
                      b
                      size={12}
                      css={{ tt: "capitalize", color: "white" }}
                    >
                      {item.detail.substring(0, 100)}...
                    </Text>
                  </Row>
                </Col>
              </Table.Cell>
              <Table.Cell>
                <div className="text-white">{dataLocation}</div>
              </Table.Cell>
              <Table.Cell>
                <Row justify="center" align="center">
                  <Col css={{ d: "flex" }}>
                    <Tooltip content="Details">
                      <Link href={`products/${item._id}`}>
                        <a>
                          <IconButton>
                            <EyeIcon size={20} fill="#979797" />
                          </IconButton>
                        </a>
                      </Link>
                    </Tooltip>
                  </Col>
                  <Col css={{ d: "flex" }}>
                    <Tooltip
                      content="Delete"
                      color="error"
                      onClick={() =>
                        dispatch(deleteItem(lists, item._id, "ADD_LIST"))
                      }
                    >
                      <IconButton>
                        <DeleteIcon size={20} fill="#FF0080" />
                      </IconButton>
                    </Tooltip>
                  </Col>
                </Row>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
        <Table.Pagination
          shadow
          noMargin
          align="center"
          rowsPerPage={10}
          // onPageChange={(page) => console.log({ page })}
        />
      </Table>
    </>
  );
};

export default List;
