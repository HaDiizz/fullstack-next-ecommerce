import React, { useEffect, useState, useContext } from "react";
import Script from "next/script";
import { postData } from "../utils/fetchData";
import { DataContext } from "../store/GlobalState";
import { useRouter } from "next/router";

const OmiseIBBtn = ({ order }) => {
  
  const router = useRouter();
  let OmiseCard;

  const { state, dispatch } = useContext(DataContext);
  const { auth } = state;

  const initialState = {
    amount: 0,
    name: "",
    email: "",
    _id: "",
  };

  const [detail, setDetail] = useState(initialState);

  const { amount, name, email, _id } = detail;

  useEffect(() => {
    setDetail({
      ...detail,
      amount: order?.total,
      name: order?.user.name,
      email: order?.user.email,
      _id: order?._id,
    });
  }, []);

  const handleLoadScript = () => {
    OmiseCard = window.OmiseCard;
    OmiseCard?.configure({
      publicKey: "pkey_test_5rqcq77se1ccy84j7uz",
      buttonLabel: "PAY WITH OMISE",
      submitLabel: "Pay",
      currency: "THB",
      frameLabel: "Next Shop",
    });
  };

  const internetBankingConfigure = () => {
    OmiseCard?.configure({
      defaultPaymentMethod: "internet_banking",
      otherPaymentMethods: [
        "alipay",
        "pay_easy",
        "net_banking",
        "convenience_store",
        "bill_payment_tesco_lotus",
      ],
    });
    OmiseCard?.configureButton("#internet-banking");
    OmiseCard?.attach();
  };

  const omiseHandler = () => {
    OmiseCard?.open({
      amount: order?.total * 100,
      onCreateTokenSuccess: async (token) => {
        console.log(token);


        postData(
          `omise_checkout/internet_banking`,
          { amount, name, email, token, _id },
          auth.token
        ).then((res) => {
          if (res.err)
            return dispatch({ type: "NOTIFY", payload: { error: res.err } });
          console.log(res);
          const { authorizeUri } = res;
          if (authorizeUri) {
            router.push(authorizeUri);
          }
          dispatch({ type: "NOTIFY", payload: { success: res.status } });
        });
      },
      onFormClosed: () => {},
      frameDescription: "Next Shop",
    });
  };

  const handleClick = async (e) => {
    e.preventDefault();
    internetBankingConfigure();
    omiseHandler();
  };

  return (
    <div className="flex text-right">
      <Script src="https://cdn.omise.co/omise.js" onLoad={handleLoadScript()} />
      <form>
        <button
          id="internet-banking"
          className="btn btn-outline-danger mb-4"
          type="button"
          onClick={handleClick}
        >
          Pay with Internet Banking
        </button>
      </form>
    </div>
  );
};

export default OmiseIBBtn;
