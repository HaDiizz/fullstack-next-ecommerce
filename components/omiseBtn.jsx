import React, { useEffect, useState, useContext } from "react";
import Script from "next/script";
import { getData, postData } from "../utils/fetchData";
import { DataContext } from "../store/GlobalState";
import CryptoJS from "crypto-js";
import { useRouter } from "next/router";
import { updateItem } from "../store/Actions";

const OmiseBtn = ({ order }) => {
  let OmiseCard;
  const router = useRouter();
  const { id } = router.query;

  const { state, dispatch } = useContext(DataContext);
  const { auth, orders } = state;

  const initialState = {
    amount: 0,
    name: "",
    email: "",
    // token: "",
  };

  const [detail, setDetail] = useState(initialState);

  const { amount, name, email } = detail;

  const [publicKey, setPublicKey] = useState("");
  const [secretKey, setSecretKey] = useState("");

  const [isProvided, setIsProvided] = useState(false);

  useEffect(() => {
    getData(`shop/${order.shop}`, auth.token).then((res) => {
      // console.log(res);
      if (res.shop.public_key && res.shop.secret_key) {
        let publicKeyDecryp = CryptoJS.AES.decrypt(
          res.shop.public_key,
          process.env.CRYPTO_PUBLIC
        );
        let secretKeyDecryp = CryptoJS.AES.decrypt(
          res.shop.secret_key,
          process.env.CRYPTO_SECRET
        );
        let publicKey = publicKeyDecryp?.toString(CryptoJS.enc.Utf8).toString();
        let secretKey = secretKeyDecryp?.toString(CryptoJS.enc.Utf8).toString();
        setPublicKey(publicKey);
        setSecretKey(secretKey);

        if (publicKey !== "" && secretKey !== "") {
          setIsProvided(true);
        }
        // console.log("decryp "+publicKey, secretKey);
      }
    });
  }, [auth.token, order]);

  useEffect(() => {
    setDetail({
      ...detail,
      amount: order?.total,
      name: order?.user.name,
      email: order?.user.email,
      // token: tokenId,
    });
  }, []);

  const handleLoadScript = () => {
    // console.log(window.OmiseCard)
    OmiseCard = window.OmiseCard;
    OmiseCard?.configure({
      publicKey: publicKey,
      buttonLabel: "PAY WITH OMISE",
      submitLabel: "Pay",
      currency: "THB",
      frameLabel: "Next Shop",
    });
  };

  const creditcardConfigure = () => {
    OmiseCard?.configure({
      defaultPaymentMethod: "credit_card",
      otherPaymentMethods: [],
    });
    OmiseCard?.configureButton("#credit-card");
    OmiseCard?.attach();
  };

  const omiseHandler = () => {
    OmiseCard?.open({
      amount: order?.total * 100,
      // submitFormTarget: '#checkout-form',
      onCreateTokenSuccess: async (token) => {
        // console.log(token);

        var publicKeyHash = CryptoJS.AES.encrypt(
          publicKey,
          process.env.CRYPTO_PUBLIC
        ).toString();
        var secretKeyHash = CryptoJS.AES.encrypt(
          secretKey,
          process.env.CRYPTO_SECRET
        ).toString();

        // console.log("encryp " + publicKeyHash, secretKeyHash);

        postData(
          `omise_checkout`,
          { amount, name, email, token, publicKeyHash, secretKeyHash, id },
          auth.token
        ).then((res) => {
          if (res.err)
            return dispatch({ type: "NOTIFY", payload: { error: res.status } });
          dispatch({ type: "NOTIFY", payload: { success: res.status } });

          dispatch(
            updateItem(
              orders,
              order._id,
              {
                ...order,
                paid: true,
                dateOfPayment: new Date(),
                paymentId: res.chargeId,
                method: "OMISE CARD",
              },
              "ADD_ORDERS"
            )
          );
        });
      },
      onFormClosed: () => {},
      frameDescription: "Next Shop",
    });
  };

  const handleClick = async (e) => {
    e.preventDefault();
    creditcardConfigure();
    omiseHandler();

    // const res = await postData('omise_checkout', {email, total, name, token}, auth.token)
    // if (res.err)
    //     return alert(res.err);
    // alert(res.msg);
  };

  // useEffect(() => {

  // }
  // , [])

  // console.log(order)
  return (
    <div>
      <Script src="https://cdn.omise.co/omise.js" onLoad={handleLoadScript()} />
      {isProvided ? (
        <form>
          <button
            id="credit-card"
            className="outline outline-1 p-2 rounded-md hover:bg-blue-800 mb-4"
            type="button"
            onClick={handleClick}
          >
            Pay with Credit Cards
          </button>
        </form>
      ) : (
        <div>
          <p className="text-red-200">
            ไม่รับการจ่ายผ่าน Omise Credit/Debit Card
          </p>
        </div>
      )}
    </div>
  );
};

export default OmiseBtn;
