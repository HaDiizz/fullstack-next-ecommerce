import Link from "next/link";
import { patchData } from "../utils/fetchData";
import { updateItem } from "../store/Actions";
import { useRouter } from "next/router";
import OmiseBtn from "./omiseBtn";
import OmiseIBBtn from "./omiseIBBtn";
import QrCode from "./QrCode";
import moment from "moment";

const OrderItem = ({ orderDetail, state, dispatch }) => {
  const router = useRouter();
  const { auth, orders } = state;

  if (!auth.user) return null;

  return (
    <>
      <div className="shop_bg" style={{ zIndex: "0" }}></div>

      <div className="pt-[5rem] pl-5 sticky">
        <button className="btn btn-dark mr-4" onClick={() => router.back()}>
          <i className="fas fa-long-arrow-alt-left" aria-hidden="true"></i>{" "}
          ย้อนกลับ
        </button>
        <button
          className="btn btn-dark"
          onClick={() => router.push(`/products/${orderDetail[0]?.shop}`)}
        >
          {" "}
          ไปที่ร้านค้า
        </button>
      </div>

      {orderDetail?.map((order) => (
        <div
          key={order?._id}
          style={{ margin: "20px auto" }}
          className="row justify-content-around sticky"
        >
          <div
            className="text-uppercase my-3 ml-3 mr-3"
            style={{ maxWidth: "600px", width: "60%" }}
          >
            <h2 className="text-break text-white font-extrabold">
              Order {order?._id}
            </h2>
            <div className="mt-4 text-white">
              <h3 className="text-white font-extrabold">รายละเอียดออเดอร์</h3>
              <p>ชื่อ: {order.user.name}</p>
              <p>อีเมล: {order.user.email}</p>
              <p>เวลารับสินค้า: {order.time}</p>
              <p>เบอร์โทร: {order.tel}</p>
              <p className="text-orange-400">หมายเหตุ: {order.note}</p>
              <h3 className="text-white">Payment</h3>
              {order.method && (
                <h6 className="text-secondary">
                  Method: <em>{order.method}</em>
                </h6>
              )}
              {/* {order.paymentId && (
                <p>
                  PaymentID: <em>{order.paymentId}</em>
                </p>
              )} */}
              <div
                className={`alert ${
                  order.paid ? "alert-success" : "alert-danger"
                } d-flex justify-content-between align-items-center`}
                role="alert"
              >
                {order.paid
                  ? `จ่ายเมื่อ ${moment(order.dateOfPayment).format("LLLL")}`
                  : "ยังไม่ชำระเงิน"}
              </div>

              <div>
                <div className="row">
                <h4 className="text-white pr-5">Order Items</h4>
                <h5 className="text-white">ราคารวม: {order.total} บาท</h5>
                </div>
                {order.cart.map((item) => (
                  <div
                    className="row border-bottom pt-4 mx-0 p-2 justify-content-between align-items-center"
                    key={item?._id}
                    style={{ maxWidth: "550px" }}
                  >
                    <img
                      src={item.images[0].url}
                      alt={item.images[0].url}
                      style={{
                        width: "50px",
                        height: "45px",
                        objectFit: "cover",
                      }}
                    />

                    <h5 className="flex-fill text-secondary px-3 m-0">
                      <a>{item.title}</a>
                    </h5>

                    <span className="text-white text-lowcase m-0">
                      {item.quantity} x ${item.price} = $
                      {item.price * item.quantity}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {!order.paid && auth.user._id === order?.user._id && (
            <div className="p-4 text-white">
              <h2 className="mb-4 text-uppercase text-xl text-white">
                Total:{" "}
                <span className="text-red-500 font-extrabold">
                  ${order.total}
                </span>
              </h2>
              <p>Scan with QR-CODE</p>
              <div className="pb-3">
                <img
                  className="space-y-5"
                  src="https://www.designil.com/wp-content/uploads/2022/02/prompt-pay-logo.jpg"
                  alt=""
                  width={110}
                  height={35}
                />
              </div>
              <QrCode order={order} />
              <p>Pay with Omise</p>
              <OmiseBtn order={order} />
              {/* <OmiseIBBtn order={order} /> */}
            </div>
          )}
        </div>
      ))}
    </>
  );
};

export default OrderItem;
