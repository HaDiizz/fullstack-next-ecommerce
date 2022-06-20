import Head from "next/head";
import { useState, useContext, useEffect } from "react";
import { DataContext } from "../../store/GlobalState";
import { useRouter } from "next/router";
import Link from "next/link";
import OrderItem from "../../components/OrderItem";

const DetailOrder = () => {
  const { state, dispatch } = useContext(DataContext);
  const { orders, auth, manageOrder } = state;

  const router = useRouter();
  // console.log(router)

  const [orderDetail, setOrderDetail] = useState([]);

  useEffect(() => {
    const newArr = orders.filter((order) => order._id === router.query.id)
    setOrderDetail(newArr);
  }, [orders]);

  if (!auth.user) return null;

  return (
    <div className="my-3">
      <Head>
        <title>Order Detail</title>
      </Head>
      <OrderItem orderDetail={orderDetail} state={state} dispatch={dispatch} />
    </div>
  );
};

export default DetailOrder;
