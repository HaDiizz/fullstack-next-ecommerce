import Head from "next/dist/shared/lib/head";
import { useContext, useState, useEffect } from "react";
import { DataContext } from "../../../../store/GlobalState";
import { useRouter } from "next/dist/client/router";
import { getData, putData } from "../../../../utils/fetchData";
import Link from "next/link";
import { imageUploadArr } from "../../../../utils/imageUpload";
import { updateItem } from "../../../../store/Actions";

const EditItem = () => {
  const { state, dispatch } = useContext(DataContext);
  const { auth, shops, categories, products } = state;
  const [checkInStock, setInStock] = useState(false);

  const initialState = {
    title: "",
    price: 0,
    inStock: false,
    content: "",
    category: "",
  };

  const [product, setProduct] = useState(initialState);
  
  // const { title, price, inStock, content, category } = product;

  const [onEdit, setOnEdit] = useState(false);

  const [Isimages, setIsImages] = useState(false);

  const [images, setImages] = useState([]);

  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    const fetchProducts = async () => {
      if (id && auth.token) {
        const res = await getData(`product/edit/${id}`, auth.token);
        if (res) {
          setInStock(res.product?.inStock);
          setOnEdit(true);
          setProduct(res.product);
          setIsImages(true);
          setImages(res.product?.images);
        }
        if (res.err) return router.push("/404");
      }
    };

    fetchProducts();
  }, [id, auth.token]);

  const handleCheck = () => {
    setInStock(!checkInStock);
    product.inStock = !checkInStock;
  };

  const handleUpload = (e) => {
    dispatch({ type: "NOTIFY", payload: {} });
    let newImages = [];
    let num = 0;
    let err = "";
    const files = [...e.target.files];

    if (files.length === 0)
      return dispatch({
        type: "NOTIFY",
        payload: { error: "Files does not exist" },
      });

    files.forEach((file) => {
      if (file.size > 1024 * 1024) {
        setIsImages(false);
        return (err = "The file size is larger than 1 MB.");
      }

      if (file.type !== "image/jpeg" && file.type !== "image/png") {
        setIsImages(false);
        return (err = "The file type must be JPEG/PNG.");
      }
      num += 1;
      if (num === 1) newImages.push(file);
      return newImages;
    });

    if (err) {
      setIsImages(false);
      dispatch({ type: "NOTIFY", payload: { error: err } });
    }

    setIsImages(true);
    setImages([...images, ...newImages]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (auth.user.role !== "seller")
      return dispatch({
        type: "NOTIFY",
        payload: { error: "Authentication is not valid." },
      });

    if (
      !product?.title ||
      !product?.price ||
      !product?.content ||
      product?.category === "all" ||
      images.length === 0
    )
      return dispatch({
        type: "NOTIFY",
        payload: { error: "Input can not be blank." },
      });

    dispatch({ type: "NOTIFY", payload: { loading: true } });

    let media = [];
    const imgNewURL = images.filter((img) => !img.url);
    const imgOldURL = images.filter((img) => img.url);

    if (imgNewURL.length > 0) media = await imageUploadArr(imgNewURL);

    let res;
    if (onEdit) {
      if (id) {
        res = await putData(
          `product/edit/${id}`,
          { ...product, images: [...imgOldURL, ...media] },
          auth.token
        );
      }
      if (res.err)
        return dispatch({ type: "NOTIFY", payload: { error: res.err } });
    }
    dispatch(updateItem(products, id, res.product, "ADD_PRODUCTS"));

    router.push("/manage");
    return dispatch({ type: "NOTIFY", payload: { success: res.msg } });
  };

  const deleteImage = (index) => {
    const newArr = [...images];
    newArr.splice(index, 1);
    setImages(newArr);
    setIsImages(false);
  };

  const handleChangeInput = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
    dispatch({ type: "NOTIFY", payload: {} });
  };

  if (!auth.user) return null;
  if (auth.user.role !== "seller") return null;

  return (
    <div className="edit_user my-3 w-100 mt-5">
      <Head>
        <title>Add Products</title>
      </Head>
      <div className="shop_bg" style={{ zIndex: "0" }}></div>

      <div className="container pt-5 sticky">
        <button className="btn btn-dark ml-5 " onClick={() => router.back()}>
          <i className="fas fa-long-arrow-alt-left" aria-hidden="true"></i>{" "}
          ย้อนกลับ
        </button>

        {id && (
          <div className="create_product ">
            <div className="upload">
              <input
                type="file"
                name="file"
                id="file_up"
                onChange={handleUpload}
                multiple
                accept="image/*"
              />

              {Isimages && (
                <div
                  id="file_img"
                  // style={styleUpload}
                >
                  {images &&
                    images?.map((img, index) => (
                      <div className="file_img" key={index}>
                        <img
                          src={img.url ? img.url : URL.createObjectURL(img)}
                          alt="logo"
                          className="img-thumbnail rounded"
                        />
                        <span onClick={() => deleteImage(index)}>X</span>
                      </div>
                    ))}
                  {/* <span onClick={handleDestroys}>X</span> */}
                </div>
              )}
            </div>
            <form onSubmit={handleSubmit}>
              <div className="row">
                <label htmlFor="title" className="text-white">
                  ชื่อสินค้า
                </label>
                <input
                  type="text"
                  name="title"
                  id="title"
                  required
                  value={product?.title}
                  onChange={handleChangeInput}
                />
              </div>
              <div className="row">
                <label htmlFor="price" className="text-white">
                  ราคา
                </label>
                <input
                  type="number"
                  name="price"
                  id="price"
                  required
                  value={product?.price}
                  onChange={handleChangeInput}
                />
              </div>
              <div className="row">
                <label htmlFor="content" className="text-white">
                  รายละเอียด
                </label>
                <textarea
                  className="p-2"
                  type="text"
                  name="content"
                  id="content"
                  required
                  value={product?.content}
                  rows="7"
                  onChange={handleChangeInput}
                />
              </div>
              <div className="row">
                <label htmlFor="inStock" className="text-white">
                  {checkInStock ? "มีสินค้า" : "ไม่มีสินค้า"}
                </label>
                <input
                  type="checkbox"
                  name="inStock"
                  id="inStock"
                  checked={checkInStock}
                  onChange={handleCheck}
                />
              </div>
              <div className="row">
                <label htmlFor="categories" className="text-white pr-2">
                  หมวดหมู่ :{" "}
                </label>
                <select
                  name="category"
                  value={product?.category}
                  onChange={handleChangeInput}
                >
                  <option value="all">กรุณาเลือกหมวดหมู่สินค้า</option>
                  {categories.map((cat, index) => (
                    <option key={index} value={cat._id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
              <button type="submit">{onEdit ? "แก้ไข" : "Create"}</button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default EditItem;
