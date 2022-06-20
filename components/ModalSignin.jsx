import React, { useState, useContext, useEffect } from "react";
import {
  Input,
  Spacer,
  Row,
  Checkbox,
  Button,
  Text,
  Tooltip,
  Modal,
} from "@nextui-org/react";
import { Mail } from "./Mail";
import { LockIcon } from "./LockIcon";
import { BsTelephone } from "react-icons/bs";
import { AiOutlineUser } from "react-icons/ai";
import validate from "../utils/validate";
import { postData } from "../utils/fetchData";
import { DataContext } from "../store/GlobalState";
import Cookie from "js-cookie";
import { useRouter } from "next/router";

const ModalSignin = ({ visible, setVisible }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const router = useRouter();
  const initialState = {
    name: "",
    email: "",
    password: "",
    cf_password: "",
    telephone: "",
  };
  const [userData, setUserData] = useState(initialState);

  const { name, email, password, cf_password, telephone } = userData;

  const { state, dispatch } = useContext(DataContext);
  const { auth } = state;

  const closeHandler = (e) => {
    e?.preventDefault();
    setVisible(false);
    // setUserData(initialState);
  };

  const handleClick = (e) => {
    e.preventDefault();
    setIsSignUp(!isSignUp);
    // setUserData(initialState);
  };

  const handleChangeInput = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
    return dispatch({ type: "NOTIFY", payload: {} });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errMsg = validate(name, email, password, cf_password, telephone);
    if (errMsg) {
      closeHandler();
      return dispatch({ type: "NOTIFY", payload: { error: errMsg } });
    }

    // console.log(errMsg)
    dispatch({ type: "NOTIFY", payload: { loading: true } });

    const res = await postData("auth/register", userData);

    // console.log(res)
    if (res.err) {
      closeHandler();
      return dispatch({ type: "NOTIFY", payload: { error: res.err } });
    }

    setUserData(initialState);
    setIsSignUp(false);
    closeHandler();
    return dispatch({ type: "NOTIFY", payload: { success: res.msg } });
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    closeHandler();
    dispatch({ type: "NOTIFY", payload: { loading: true } });

    const res = await postData("auth/login", { email, password });

    // console.log(res)
    if (res.err) {
      // closeHandler();
      return dispatch({ type: "NOTIFY", payload: { error: res.err } });
    }

    if(res.user.isVerified === false){
      // closeHandler();
      return dispatch({ type: "NOTIFY", payload: { error: "Please verify your email" } });
    }

    setUserData(initialState);
    // closeHandler();

    dispatch({
      type: "AUTH",
      payload: {
        token: res.access_token,
        user: res.user,
      },
    });

    Cookie.set("refreshtoken", res.refresh_token, {
      path: "api/auth/accessToken",
      expires: 7,
    });

    localStorage.setItem("firstLogin", true);
    return dispatch({ type: "NOTIFY", payload: { success: res.msg } });
  };

  // useEffect(() => {
  //   if (Object.keys(auth).length !== 0) router.push("/");
  // }, [auth]);

  return (
    <>
      {!isSignUp ? (
        <form>
          <Modal
            closeButton
            blur
            aria-labelledby="modal-title"
            open={visible}
            onClose={closeHandler}
          >
            <Modal.Header>
              <Text id="modal-title" size={18}>
                <Text b size={18}>
                  เข้าสู่ระบบ
                </Text>
              </Text>
            </Modal.Header>
            <Modal.Body>
              <Spacer y={1} />
              <Input
                autoComplete="on"
                bordered
                fullWidth
                color="primary"
                size="lg"
                labelPlaceholder="Email"
                value={email}
                name="email"
                onChange={handleChangeInput}
                contentLeft={<Mail fill="currentColor" />}
              />
              <Spacer y={1} />
              <Input.Password
                bordered
                fullWidth
                color="primary"
                size="lg"
                labelPlaceholder="Password"
                initialValue=""
                value={password}
                name="password"
                onChange={handleChangeInput}
                contentLeft={<LockIcon fill="currentColor" />}
              />

              <Row justify="space-between">
                <Text size={14}>ยังไม่มีบัญชี?</Text>
                <Text size={12} onClick={handleClick}>
                  คลิกที่นี่เพื่อสมัครสมาชิก
                </Text>
              </Row>
            </Modal.Body>
            <Modal.Footer>
              <button
                className="px-5 py-2 rounded text-white bg-red-600"
                onClick={closeHandler}
              >
                ปิด
              </button>
              <button
                className="px-4 py-2 rounded text-white bg-blue-600"
                onClick={handleLogin}
              >
                เข้าสู่ระบบ
              </button>
            </Modal.Footer>
          </Modal>
        </form>
      ) : (
        <form>
          <Modal
            closeButton
            blur
            aria-labelledby="modal-title"
            open={visible}
            onClose={closeHandler}
          >
            <Modal.Header>
              <Text id="modal-title" size={18}>
                <Text b size={18}>
                  สมัครสมาชิก
                </Text>
              </Text>
            </Modal.Header>
            <Modal.Body>
              <Spacer y={1} />
              <Input
                autoComplete="on"
                bordered
                fullWidth
                color="primary"
                size="lg"
                labelPlaceholder="Username"
                value={name}
                name="name"
                onChange={handleChangeInput}
                contentLeft={<AiOutlineUser fill="currentColor" />}
              />
              <Spacer y={1} />
              <Input
                autoComplete="on"
                bordered
                fullWidth
                color="primary"
                size="lg"
                labelPlaceholder="Email"
                value={email}
                name="email"
                onChange={handleChangeInput}
                contentLeft={<Mail fill="currentColor" />}
              />
              <Spacer y={1} />
              <Input.Password
                bordered
                fullWidth
                color="primary"
                size="lg"
                labelPlaceholder="Password"
                initialValue=""
                value={password}
                name="password"
                onChange={handleChangeInput}
                contentLeft={<LockIcon fill="currentColor" />}
              />

              <Spacer y={1} />
              <Input.Password
                bordered
                fullWidth
                color="primary"
                size="lg"
                labelPlaceholder="Confirm Password"
                initialValue=""
                value={cf_password}
                name="cf_password"
                onChange={handleChangeInput}
                contentLeft={<LockIcon fill="currentColor" />}
              />

              <Spacer y={1} />
              <Input
                autoComplete="on"
                bordered
                fullWidth
                color="primary"
                size="lg"
                labelPlaceholder="Telephone"
                value={telephone}
                name="telephone"
                onChange={handleChangeInput}
                contentLeft={<BsTelephone fill="currentColor" />}
              />

              <Row justify="space-between">
                <Text size={14}>มีบัญชีเรียบร้อยแล้ว?</Text>
                <Text size={12} onClick={handleClick}>
                  คลิกที่นี่เพื่อเข้าสู่ระบบ
                </Text>
              </Row>
            </Modal.Body>
            <Modal.Footer>
              <button
                className="px-5 py-2 rounded text-white bg-red-600"
                onClick={closeHandler}
              >
                ปิด
              </button>
              <button
                className="px-4 py-2 rounded text-white bg-blue-600"
                onClick={handleSubmit}
              >
                สมัครสมาชิก
              </button>
            </Modal.Footer>
          </Modal>
        </form>
      )}
    </>
  );
};

export default ModalSignin;
