import React, { useEffect, useState, useContext } from "react";
import Script from "next/script";
import { postData, putData } from "../utils/fetchData";
import { DataContext } from "../store/GlobalState";
import { Input, Row, Text } from "@nextui-org/react";
import { imageUpload } from "../utils/imageUpload";
import Button from "@mui/material/Button";
import { useRouter } from "next/router";
import TextField from "@mui/material/TextField";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import { updateItem } from "../store/Actions";

const QrCode = ({ order }) => {
  const { state, dispatch } = useContext(DataContext);
  const { auth, orders } = state;
  const router = useRouter();
  const { id } = router.query;
  const [qrCode, setQrCode] = useState("");
  const [isClicked, setIsClicked] = useState(false);
  const [isUpload, setIsUpload] = useState(false);
  const [image, setImage] = useState("");
  const [date, setDate] = useState(new Date());

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };

  const initialState = {
    amount: 0,
    shop: "",
  };

  const [detail, setDetail] = useState(initialState);

  const { amount, shop } = detail;

  const [visible, setVisible] = useState(false);

  const [value, setValue] = React.useState(new Date());

  useEffect(() => {
    setDetail({
      ...detail,
      amount: parseFloat(order?.total),
      shop: order?.shop,
    });
  }, []);

  const handlePromptpayCheckout = async (e) => {
    e.preventDefault();
    setVisible(true);
    const res = await postData(`promptpay`, { amount, shop }, auth.token);
    if (res.err) return console.log(res.err);
    // console.log(res);
    setQrCode(res.data);
    setIsClicked(true);
  };

  const closeHandler = () => {
    setVisible(false);
    // console.log("closed");
  };

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (e.target.files.length !== 0) {
      setIsUpload(true);
      setImage(file);
    }
    // console.log(file);
    // console.log(file);
    if (!file) {
      setIsUpload(false);
      return dispatch({
        type: "NOTIFY",
        payload: { error: "Files does not exist" },
      });
    }
    if (file.size > 1024 * 1024) {
      setIsUpload(false);
      return dispatch({
        type: "NOTIFY",
        payload: { error: "ขนาดไฟล์ใหญ่เกิน 1MB" },
      });
    }

    if (file.type !== "image/jpeg" && file.type !== "image/png") {
      setIsUpload(false);
      return dispatch({
        type: "NOTIFY",
        payload: { error: "อนุญาตเฉพาะไฟล์ jpeg/png เท่านั้น" },
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    dispatch({ type: "NOTIFY", payload: { loading: true } });

    let media = "";


    if (!image || !date) {
      dispatch({ type: "NOTIFY", payload: { error: "กรุณากรอกข้อมูลให้ครบ" } });
      return;
    }

    if (image) media = await imageUpload(image);

    const res = await putData(
      `order/payment/${id}`,
      {
        image: media[0]?.url,
        dateOfPayment: date,
      },
      auth.token
    );
    closeHandler();

    dispatch(updateItem(orders, order._id, {
      ...order, paid: true, dateOfPayment: date,
      paymentId: order.tel, method: 'PromtPay',
      image: media[0]?.url
    }, 'ADD_ORDERS')) 

    if (res.err) {
      return dispatch({ type: "NOTIFY", payload: { error: res.err } });
    }

    dispatch({ type: "NOTIFY", payload: { success: res.msg } });
  };

  // console.log(order)
  return (
    <div className="pb-4 flex text-right">

      <Modal
        open={visible}
        onClose={closeHandler}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <div className="flex justify-center">
            <img
              className="space-y-5"
              src="https://www.designil.com/wp-content/uploads/2022/02/prompt-pay-logo.jpg"
              alt=""
              width={110}
              height={35}
            />
          </div>
          <div className="flex justify-center">
            <img src={qrCode} alt={qrCode} width={200} height={200} />
          </div>

          <div className="flex justify-center">
            <label htmlFor="contained-button-file" className="mt-[1rem]">
              <Input
                aria-label="รูปภาพการชำระเงิน"
                accept="image/*"
                id="contained-button-file"
                multiple
                type="file"
                className="d-none"
                onChange={handleUpload}
              />
              <Button variant="contained" component="span">
                อัพโหลดหลักฐานการชำระเงิน
              </Button>
              {isUpload && (
                <Text className="text-center" color="success">
                  แนบรูปภาพสำเร็จ
                </Text>
              )}
            </label>
          </div>

          <div className="flex justify-center pt-3 pb-3">
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <div>
                <DateTimePicker
                  label="Date&Time picker"
                  value={value}
                  onChange={(newValue) => {
                    setDate(newValue);
                  }}
                  renderInput={(params) => <TextField {...params} />}
                />
              </div>
            </LocalizationProvider>
          </div>
          <Row justify="space-between" className="pt-3">
            <button
              className="px-4 py-2 rounded text-white bg-red-600"
              onClick={closeHandler}
            >
              ยกเลิก
            </button>
            <button
              className="px-4 py-2 rounded text-white bg-neutral-800"
              onClick={handleSubmit}
            >
              ยืนยันการชำระเงิน
            </button>
          </Row>
        </Box>
      </Modal>

      <button
        className="outline outline-1 p-2 rounded-md hover:bg-neutral-700 hover:text-white"
        onClick={handlePromptpayCheckout}
      >
        Pay with promptpay
      </button>
    </div>
  );
};

export default QrCode;
