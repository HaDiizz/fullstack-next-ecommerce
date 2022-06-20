import { useContext, useState, useEffect } from "react";
import { DataContext } from "../../../store/GlobalState";
import Head from "next/head";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { imageUpload } from "../../../utils/ImageUpload";
import { putData } from "../../../utils/fetchData";
import { useRouter } from "next/dist/client/router";
import { Row, Checkbox, Input } from "@nextui-org/react";
import { Image } from "@nextui-org/react";
import { updateItem } from "../../../store/Actions";
import CryptoJS from "crypto-js";
import { FaCameraRetro } from "react-icons/fa";

const EditShop = () => {
  const router = useRouter();

  const { id } = router.query;

  const initialState = {
    logo: "",
    shopName: "",
    contact: "",
    detail: "",
    location: "",
    public_key: "",
    secret_key: "",
  };

  const [data, setData] = useState(initialState);
  const { logo, shopName, contact, detail, location, public_key, secret_key } =
    data;

  const { state, dispatch } = useContext(DataContext);
  const { auth, notify, shops, locations } = state;

  const [editShop, setEditShop] = useState([]);

  const [valueShop, setValueShop] = useState([]);

  useEffect(() => {
    const newArr = Object.values(shops)?.filter((shop) => shop._id !== id);
    setEditShop(newArr);
    // console.log(newArr);
  }, [shops]);

  useEffect(() => {
    editShop.map((owner) => {
      // console.log(owner)
      setValueShop({
        ...valueShop,
        logo: owner.logo,
      });
      // setId(owner._id)

      let publicKeyDecryp = CryptoJS.AES.decrypt(
        shops[0]?.public_key,
        process.env.CRYPTO_PUBLIC
      );
      let secretKeyDecryp = CryptoJS.AES.decrypt(
        shops[0]?.secret_key,
        process.env.CRYPTO_SECRET
      );
      let publicKey = publicKeyDecryp?.toString(CryptoJS.enc.Utf8).toString();
      let secretKey = secretKeyDecryp?.toString(CryptoJS.enc.Utf8).toString();
      setData({
        ...data,
        shopName: owner.shopName,
        detail: owner.detail,
        contact: owner.contact,
        location: owner.location,
        id: id,
        public_key: publicKey,
        secret_key: secretKey,
      });

      // setData({
      //   ...data,
      //   shopName: owner.shopName,
      //   detail: owner.detail,
      //   contact: owner.contact,
      //   location: owner.location,
      //   id: id,
      //   public_key: owner.public_key === '' ? "" : publicKey,
      //   secret_key: owner.secret_key === '' ? "" : secretKey,
      // });
      //   console.log(owner);
    });
  }, [editShop]);

  //   console.log(editShop);

  const handleChange = (e) => {
    const { name, value } = e.target;
    //   console.log(e.target.name)
    setData({ ...data, [name]: value });
    dispatch({ type: "NOTIFY", payload: {} });
  };

  const handleUpdateShop = (e) => {
    e.preventDefault();

    let publicKeyDecryp = CryptoJS.AES.decrypt(
      shops[0]?.public_key,
      process.env.CRYPTO_PUBLIC
    );
    let secretKeyDecryp = CryptoJS.AES.decrypt(
      shops[0]?.secret_key,
      process.env.CRYPTO_SECRET
    );
    let public_key_decryp = publicKeyDecryp
      .toString(CryptoJS.enc.Utf8)
      .toString();
    let secret_key_decryp = secretKeyDecryp
      .toString(CryptoJS.enc.Utf8)
      .toString();

    if (
      shopName !== shops[0].shopName ||
      logo ||
      detail !== shops[0].detail ||
      location !== shops[0].location ||
      contact !== shops[0].contact ||
      public_key !== public_key_decryp ||
      secret_key !== secret_key_decryp
    ) {
      updateInfor();
    } else {
      dispatch({ type: "NOTIFY", payload: { err: "No change" } });
    }
  };

  const changeLogo = (e) => {
    // console.log(e.target.files[0])
    const file = e.target.files[0];
    // if (e.target.files.length !== 0) {
    //   setNewLogo(URL.createObjectURL(e.target.files[0]));
    // }
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

    setData({ ...data, logo: file });
  };

  const updateInfor = async () => {
    let media;
    dispatch({ type: "NOTIFY", payload: { loading: true } });

    if (logo) media = await imageUpload(logo);

    // console.log(media)
    if (id)
      putData(
        `shop/${id}`,
        {
          shopName,
          detail,
          contact,
          location,
          logo: logo ? media[0]?.url : editShop[0]?.logo,
          public_key,
          secret_key,
        },
        auth.token
      ).then((res) => {
        if (res.err)
          return dispatch({ type: "NOTIFY", payload: { error: res.err } });

        var publicKeyHash = CryptoJS.AES.encrypt(public_key, process.env.CRYPTO_PUBLIC).toString();
        var secretKeyHash = CryptoJS.AES.encrypt(secret_key, process.env.CRYPTO_SECRET).toString();

        dispatch(
          updateItem(
            shops,
            editShop[0]._id,
            {
              ...editShop[0],
              shopName,
              detail,
              contact,
              location,
              logo: logo ? media[0]?.url : editShop[0]?.logo,
              public_key: publicKeyHash,
              secret_key: secretKeyHash,
            },
            "ADD_SHOP"
          )
        );

        //   dispatch({
        //     type: "ADD_SHOP",
        //     payload: {
        //       token: auth.token,
        //       shop: res.shop,
        //     },
        //   });

        //   router.reload();
        return dispatch({ type: "NOTIFY", payload: { success: res.msg } });
      });
  };

  if (!auth.user) return null;
  if (auth.user && auth.user.role !== "seller") return null;
  if (!shops[0]) return null;

  return (
    <>
      <Head>
        <title>Shop Manager</title>
      </Head>
      <div className="shop_bg"></div>

      <div className="pt-[8rem] container pb-5 pl-[7rem] pr-[7rem] profile_page">
        <div className="flex space-x-6 sticky">
          <button
            className="btn btn-dark ml-5 mt-4"
            onClick={() => router.back()}
          >
            ย้อนกลับ
          </button>
        </div>

        <div
          className="text-white pt-[3rem] flex justify-center sticky"
          style={{ zIndex: "1" }}
        >
          <h3
            className="text-center text-uppercase ml-2 mb-1 text-white"
            style={{ zIndex: "1" }}
          >
            แก้ไขข้อมูลร้านค้า
          </h3>
        </div>

        <div className="row pt-[5rem] text-white">
          <div className="col-md-2">
            <div className="avatar mt-2">
              <Image
                src={logo ? URL.createObjectURL(logo) : valueShop.logo}
                width="100%"
                height="100%"
                alt="logo"
                objectFit="cover"
              />
              <span>
                <div className="flex justify-center pt-2">
                  <FaCameraRetro />
                </div>
                <p>Change</p>
                <input
                  type="file"
                  name="file"
                  id="file_up"
                  accept="image/*"
                  onChange={changeLogo}
                />
              </span>
            </div>
          </div>

          <div className="col-md-10 pl-[5rem]">
            <div className="row">
              <div className="col-md-5 pl-[5rem]">
                <div className="form-group">
                  <label htmlFor="shopName">Shop Name</label>
                  <input
                    type="text"
                    name="shopName"
                    value={shopName}
                    className="form-control"
                    placeholder="Enter your shop name"
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="col-md-5 pl-[5rem]">
                <div className="form-group">
                  <label htmlFor="contact">Promptpay</label>
                  <input
                    type="text"
                    name="contact"
                    value={contact}
                    className="form-control"
                    placeholder="Enter your Promptpay"
                    //   disabled={true}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-md-5 pl-[5rem]">
                <div className="form-group">
                  <label htmlFor="contact">Public Key</label>
                  {/* <input
                    type="text"
                    name="public_key"
                    value={public_key}
                    className="form-control"
                    placeholder="Enter your public key"
                    //   disabled={true}
                    onChange={handleChange}
                  /> */}
                  <Input.Password
                    autoComplete="on"
                    aria-label="OMISE PUBLIC KEY"
                    width="100%"
                    placeholder="OMISE PUBLIC KEY"
                    color="secondary"
                    name="public_key"
                    className="mr-2"
                    value={public_key}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="col-md-5 pl-[5rem]">
                <div className="form-group">
                  <label htmlFor="contact">Secret Key</label>
                  {/* <input
                    type="text"
                    name="secret_key"
                    value={secret_key}
                    className="form-control"
                    placeholder="Enter your secret key"
                    //   disabled={true}
                    onChange={handleChange}
                  /> */}
                  <Input.Password
                    autoComplete="on"
                    aria-label="OMISE SECRET KEY"
                    width="100%"
                    placeholder="OMISE SECRET KEY"
                    color="secondary"
                    name="secret_key"
                    className="mr-2"
                    value={secret_key}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-md-5 pl-[5rem]">
                <div className="form-group">
                  <span className="text-white" style={{ fontSize: "90%" }}>
                    ตำแหน่งที่ตั้ง
                  </span>
                  <FormControl
                    sx={{ mt: 1, width: "100%" }}
                    className="text-dark"
                  >
                    <Select
                      className="bg-white scrollable"
                      defaultValue={"rongChangRest"}
                      id="location"
                      style={{ maxHeight: "3.5rem" }}
                      name="location"
                      aria-label="ตำแหน่งที่ตั้ง"
                      value={location}
                      onChange={handleChange}
                    >
                      {locations.map((location, index) => (
                        <MenuItem key={index} value={location._id}>
                          {location.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </div>
              </div>

              <div className="col-md-5 pl-[5rem]">
                <div className="form-group">
                  <label htmlFor="Details">Detail</label>
                  <textarea
                    className="form-control"
                    name="detail"
                    id="detail"
                    value={detail}
                    cols="20"
                    rows="2"
                    onChange={handleChange}
                  ></textarea>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center pt-4 flex sticky justify-center">
          <button
            className="px-4 py-2 rounded text-white bg-blue-600"
            disabled={notify.loading}
            onClick={handleUpdateShop}
          >
            Update
          </button>
        </div>
      </div>
    </>
  );
};

export default EditShop;
