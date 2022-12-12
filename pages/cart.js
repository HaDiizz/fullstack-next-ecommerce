import Head from "next/head";
import { useContext, useState, useEffect } from "react";
import { DataContext } from "../store/GlobalState";
import CartItem from "../components/product/CartItem";
import Link from "next/link";
import { getData, postData } from "../utils/fetchData";
import { useRouter } from "next/router";
import TextField from "@mui/material/TextField";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import moment from "moment";
import { Text } from "@nextui-org/react";

const Cart = () => {
  const { state, dispatch } = useContext(DataContext);
  const { cart, auth, orders } = state;
  const [product, setProduct] = useState([]);

  const [total, setTotal] = useState(0);
  const [tel, setTel] = useState("");
  const [note, setNote] = useState("");
  // const [payment, setPayment] = useState(false);

  const [callback, setCallback] = useState(false);
  const router = useRouter();

  const [value, setValue] = useState(null);
  const [time, setTime] = useState("");

  useEffect(() => {
    const getTotal = () => {
      const res = cart.reduce((prev, item) => {
        return prev + item.price * item.quantity;
      }, 0);
      setTotal(res);
      // console.log(res)
    };

    getTotal();
  });

  useEffect(() => {
    if (auth.user) {
      setTel(auth.user.telephone);
    }
  }, [auth.user]);

  useEffect(() => {
    const cartLocal = JSON.parse(localStorage.getItem("__next__cart"));
    if (cartLocal && cartLocal.length > 0) {
      let newArr = [];
      const updateCart = async () => {
        for (const items of cartLocal) {
          const res = await getData(`product/cart/${items._id}`);
          //   console.log(res);
          const { _id, title, images, price, inStock, shop } = res.product;
          if (inStock === true) {
            newArr.push({
              shop,
              _id,
              title,
              images,
              price,
              inStock,
              quantity: items.quantity < 1 ? 1 : items.quantity,
            });
          }
        }
        dispatch({ type: "ADD_CART", payload: newArr });
      };
      updateCart();
    }
  }, [callback]);

  //   useEffect(() => {
  //     const cartLocal = JSON.parse(localStorage.getItem("__next__cart"));
  //     if (cartLocal && cartLocal.length > 0) {
  //       let newArr = [];
  //       const updateCart = async () => {
  //         for (const item of cartLocal) {
  //           const res = await getData(`products/edit/${item._id}`);
  //           console.log(res)
  //           const { _id, title, images, price, inStock } = res;
  //           if (inStock === true) {
  //             newArr.push({
  //               _id,
  //               title,
  //               images,
  //               price,
  //               inStock,
  //               quantity: item.quantity < 1 ? 1 : item.quantity,
  //             });
  //           }
  //         }

  //         dispatch({ type: "ADD_CART", payload: newArr });
  //       };

  //       updateCart();
  //     }
  //   }, [callback]);

  const handlePayment = async () => {
    if (!auth.user)
      return dispatch({
        type: "NOTIFY",
        payload: { error: "กรุณาเข้าสู่ระบบเพื่อดำเนินการต่อ" },
      });
      
    if (!time || !tel)
      return dispatch({
        type: "NOTIFY",
        payload: { error: "กรุณากรอกเบอร์โทร/เวลาในการรับสินค้าให้ครบถ้วน" },
      });

    // setPayment(true);

    let newCart = [];
    for (const item of cart) {
      const res = await getData(`product/cart/${item._id}`);
      if (res.product.inStock === true) {
        newCart.push(item);
      }
    }

    if (newCart.length < cart.length) {
      setCallback(!callback);
      return dispatch({
        type: "NOTIFY",
        payload: {
          error: "The product is out of stock / quantity is insufficient.",
        },
      });
    }

    dispatch({
      type: "NOTIFY",
      payload: { loading: true },
    });

    postData("order", { time, tel, cart, total, note }, auth.token).then(
      (res) => {
        if (res.err)
          return dispatch({ type: "NOTIFY", payload: { error: res.err } });

        dispatch({ type: "ADD_CART", payload: [] }); //Remove product from cart

        const newOrder = {
          ...res.newOrder,
          user: auth.user,
        };
        dispatch({ type: "ADD_ORDERS", payload: [...orders, newOrder] });

        dispatch({ type: "NOTIFY", payload: { success: res.msg } });
        // return router.push(`/order/${res.newOrder._id}`)
        return router.push(`/order/${res.newOrder._id}`);
      }
    );
    // This function shows a transaction success message to your buyer.
    // console.log(data)
    // alert('Transaction completed by ' + details.payer.name.given_name);
  };

  // if (cart.length === 0)
  //   return (
  //     <>
  //       <div className="shop_bg" style={{ zIndex: "0" }}></div>
  //       <h1
  //         style={{
  //           textAlign: "center",
  //           marginTop: "15rem",
  //           letterSpacing: "10px",
  //           textTransform: "uppercase",
  //           opacity: "0.7",
  //           color: "white",
  //         }}
  //       >
  //         Cart is empty
  //       </h1>
  //     </>
  //   );

  var newDateObj = moment(new Date()).add(15, "m").toDate();

  return (
    <>
      <Head>
        <title>Cart</title>
      </Head>
      <div className="shop_bg" style={{ zIndex: "0" }}></div>
      <div className="row mx-auto pt-5 ml-5 mr-5">
        {cart.length === 0 ? (
          <div className="h-screen w-full flex flex-wrap justify-center fixed">
            {/* <h1
              className="text-center flex flex-col items-center justify-center"
              style={{
                textAlign: "center",
                letterSpacing: "10px",
                textTransform: "uppercase",
                opacity: "0.9",
                color: "white",
              }}
            >
              Cart is empty
            </h1> */}
            <Text
              className="text-center flex flex-col items-center justify-center"
              b
              size={18}
              css={{ tt: "capitalize", color: "white" }}
              style={{
                textAlign: "center",
                letterSpacing: "10px",
                textTransform: "uppercase",
                opacity: "0.9",
                color: "white",
              }}
            >
              Cart is empty
            </Text>
          </div>
        ) : (
          <>
            <div className="col-md-8 text-secondary table-responsive my-3 pt-[5rem]">
              <div className="flex space-x-10">
                <h2 className="text-uppercase text-white">ตะกร้าสินค้า</h2>
                <Link href={`products/${cart[0].shop}`}>
                  <a className="text-orange-500">ดูเพิ่มเติม</a>
                </Link>
              </div>
              <table className="table my-3">
                <tbody>
                  {cart.map((item) => (
                    <CartItem
                      key={item._id}
                      item={item}
                      dispatch={dispatch}
                      cart={cart}
                    />
                  ))}
                </tbody>
              </table>
            </div>

            <div className="col-md-4 my-3 text-right text-uppercase pt-[5rem]">
              <form>
                <h1 className="text-white flex justify-center text-xl">
                  ผลลัพธ์
                </h1>
                <div className="pt-3 space-x-9 form-group">
                  <label htmlFor="tel" className="text-white flex text-left">
                    หมายเหตุ
                  </label>
                  <input
                    type="text"
                    name="note"
                    id="note"
                    className="form-control mb-3"
                    style={{ maxWidth: "250px" }}
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                  />
                </div>
                <div className="pt-3 space-x-9 form-group">
                  <label htmlFor="tel" className="text-white flex text-left">
                    เบอร์โทร
                  </label>
                  <input
                    type="text"
                    name="tel"
                    id="tel"
                    className="form-control mb-3"
                    style={{ maxWidth: "250px" }}
                    value={tel}
                    onChange={(e) => setTel(e.target.value)}
                  />
                </div>
                <div className="pt-3 space-x-9 form-group">
                  <label htmlFor="tel" className="text-white flex text-left">
                    เวลารับสินค้า.
                  </label>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <TimePicker
                      style={{ maxWidth: "250px" }}
                      className="text-dark"
                      // label="Time to receive"
                      value={value}
                      onChange={(newValue) => {
                        setValue(newValue);
                        const newDate = newValue?.toLocaleString();
                        console.log(newDate);
                        setTime(newDate);
                      }}
                      minTime={newDateObj}
                      renderInput={(params) => (
                        <TextField
                          className="bg-white flex text-left"
                          {...params}
                        />
                      )}
                    />
                  </LocalizationProvider>
                </div>
              </form>

              <h3 className="pt-5 text-white font-extrabold text-xl">
                ราคารวม: <span className="text-danger">${total}</span>
              </h3>

              <Link href={auth.user ? "#" : "/"}>
                <a className="btn btn-dark my-4" onClick={handlePayment}>
                  {" "}
                  Payment
                </a>
              </Link>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default Cart;
