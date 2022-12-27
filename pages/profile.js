import Head from "next/head";
import { useContext, useState, useEffect } from "react";
import { DataContext } from "../store/GlobalState";
import Link from "next/link";
import validate from "../utils/validate";
import { patchData } from "../utils/fetchData";
import { imageUploadArr } from "../utils/imageUpload";
import { Input, Table } from "@nextui-org/react";
import { UnLockIcon } from "../components/UnLockIcon.jsx";
import { LockIcon } from "../components/LockIcon.jsx";
import { AiOutlineCamera } from "react-icons/ai";

const Profile = () => {
  const initialState = {
    avatar: "",
    name: "",
    password: "",
    cf_password: "",
    telephone: "",
  };

  const [data, setData] = useState(initialState);
  const { avatar, name, password, cf_password, telephone } = data;

  const { state, dispatch } = useContext(DataContext);
  const { auth, notify, shops } = state;

  useEffect(() => {
    if (auth.user)
      setData({
        ...data,
        name: auth.user.name,
        telephone: auth.user.telephone,
      });
  }, [auth.user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
    dispatch({ type: "NOTIFY", payload: {} });
  };

  const handleUpdateProfile = (e) => {
    e.preventDefault();

    if (password) {
      if (password !== cf_password) {
        return dispatch({ type: "NOTIFY", payload: { error: "Password does not match" } });
      }
      else if (password.length < 6) {
        return dispatch({ type: "NOTIFY", payload: { error: "Password must be greater than or equal 6" } });
      }
      else if (!name) {
        return dispatch({ type: "NOTIFY", payload: { error: "Username is required" } });
      }
      updatePassword();
    }

    if (name !== auth.user.name || avatar || telephone !== auth.user.telephone)
      updateInfor();
  };

  const updatePassword = () => {
    dispatch({ type: "NOTIFY", payload: { loading: true } });
    patchData("user/resetPassword", { password }, auth.token).then((res) => {

      if (res.err)
        return dispatch({ type: "NOTIFY", payload: { error: res.err } });
      return dispatch({ type: "NOTIFY", payload: { success: res.msg } });
    });
  };

  const changeAvatar = (e) => {
    const file = e.target.files[0];

    if (!file)
      return dispatch({
        type: "NOTIFY",
        payload: { error: "File does not exists." },
      });

    if (file.size > 1024 * 1024)
      return dispatch({
        type: "NOTIFY",
        payload: { error: "The largest image size is 1 MB" },
      });

    if (file.type !== "image/jpeg" && file.type !== "image/png")
      return dispatch({
        type: "NOTIFY",
        payload: { error: "File must be jpeg or png types." },
      });

    setData({ ...data, avatar: file });
  };

  const updateInfor = async () => {
    let media;
    dispatch({ type: "NOTIFY", payload: { loading: true } });

    if (avatar) media = await imageUploadArr([avatar]);

    patchData(
      "user",
      {
        name,
        avatar: avatar ? media[0].url : auth.user.avatar,
        telephone,
      },
      auth.token
    ).then((res) => {
      if (res.err)
        return dispatch({ type: "NOTIFY", payload: { error: res.err } });

      dispatch({
        type: "AUTH",
        payload: {
          token: auth.token,
          user: res.user,
        },
      });
      return dispatch({ type: "NOTIFY", payload: { success: res.msg } });
    });
  };

  if (!auth.user) return null;

  return (
    <div name="profile" id="profile" className="profile_page h-screen w-full">
      <Head>
        <title>Profile</title>
      </Head>

      <section className="text-secondary my-5 pt-[3rem]">
        <div className="center_div">

          <div className="avatar mt-4">
            <img
              src={
                avatar
                  ? URL.createObjectURL(avatar)
                  : auth.user && auth?.user.avatar
              }
              alt="avatar"
              width="50%"
            />
            <span>
              <div className="flex justify-center">
                <AiOutlineCamera />
              </div>
              <p>Change</p>
              <input
                type="file"
                name="file"
                id="file_up"
                accept="image/*"
                onChange={changeAvatar}
              />
            </span>
          </div>

          <div className="form-group flex justify-center">
            <Input
              width="70%"
              label="Name"
              placeholder="Name"
              color="primary"
              name="name"
              value={name}
              onChange={handleChange}
            />
          </div>

          <div className="form-group flex justify-center">
            <Input
              width="70%"
              label="Telephone"
              placeholder="Telephone"
              color="primary"
              name="telephone"
              value={telephone}
              onChange={handleChange}
            />
          </div>

          <div className="form-group flex justify-center">
            <Input
              width="70%"
              label="Email (ไม่สามารถแก้ไขได้)"
              color="warning"
              name="email"
              initialValue={auth?.user.email}
              readOnly
            />
          </div>

          <div className="form-group flex justify-center">
            <Input.Password
              width="70%"
              label="New Password"
              placeholder="New Password"
              color="primary"
              name="password"
              value={password}
              onChange={handleChange}
              visibleIcon={<UnLockIcon fill="currentColor" />}
              hiddenIcon={<LockIcon fill="currentColor" />}
            />
          </div>

          <div className="form-group flex justify-center">
            <Input.Password
              width="70%"
              label="Confirm New Password"
              placeholder="Confirm New Password"
              color="primary"
              name="cf_password"
              value={cf_password}
              onChange={handleChange}
              visibleIcon={<UnLockIcon fill="currentColor" />}
              hiddenIcon={<LockIcon fill="currentColor" />}
            />
          </div>

          <div className="flex justify-center pt-3">
            <button
              className="px-4 py-2 rounded text-white bg-neutral-600 hover:bg-neutral-700"
              disabled={notify.loading}
              onClick={handleUpdateProfile}
              style={{ width: "30%" }}
            >
              Update
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Profile;
