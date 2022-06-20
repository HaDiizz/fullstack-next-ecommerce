import React, { useEffect, useState, useContext, useMemo } from "react";
import { getData } from "../../utils/fetchData";
import { useRouter } from "next/router";
import { DataContext } from "../../store/GlobalState";
import { addToCart } from "../../store/Actions";
import Head from "next/head";
import Select from "@mui/material/Select";
import FormControl from "@mui/material/FormControl";
import MenuItem from "@mui/material/MenuItem";
import { motion } from "framer-motion";

const Products = () => {
  const router = useRouter();
  const { id } = router.query;
  const { state, dispatch } = useContext(DataContext);
  const { cart, locations } = state;
  const [product, setProduct] = useState([]);
  const [shopImage, setShopImage] = useState("");
  const [shopItem, setShopItem] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [dataLocation, setDataLocation] = useState("");

  useEffect(() => {
    if (id) {
      getData(`categories/${id}`).then((data) => {
        setCategories(data.categories);
      });
    }
  }, [id]);

  useEffect(() => {
    const fetchProducts = async () => {
      if (id) {
        const res = await getData(`product/${id}`);
        setProduct(res.product);
      }
    };
    fetchProducts();
  }, [getData, id]);

  useEffect(() => {
    const fetchShops = async () => {
      if (id) {
        const res = await getData(`shop/${id}`);
        setShopItem(res.shop);
        setShopImage(res.shop);
      }
    };
    fetchShops();
  }, [getData, id]);

  const handleSelect = (e) => {
    // const value = e.target.value;
    // if (value === "all") {
    //   setSelectedCategory(categories);
    // } else {
    //   const filtered = categories.filter((item) => item._id === value);
    //   setSelectedCategory(filtered);
    // }
    setSelectedCategory(e.target.value);
  };

  function getFilteredList() {
    // Avoid filter when selectedCategory is null
    if (!selectedCategory) {
      return product;
    }
    return product.filter((item) => item.category === selectedCategory);
  }

  var filteredList = useMemo(getFilteredList, [selectedCategory, product]);

  useEffect(() => {
    const newArr = locations.filter(
      (location) => location._id === shopItem.location
    );
    // console.log(newArr);
    setDataLocation(newArr[0]?.name);
  }, [locations, shopItem]);

  return (
    <div>
      <Head>
        <title>Products</title>
      </Head>
      <div className="text-center shop_banner ">
        {shopImage && (
          <>
            <img
              className="banner"
              src={shopImage.logo}
              alt="logo"
              width="100%"
            />
          </>
        )}
      </div>
      <div className="container " style={{ paddingTop: "25.5rem" }}></div>
      <div
        className="col-md-12 pt-5 pb-5 item_list"
        style={{ paddingTop: "5rem" }}
      >
        {shopItem && (
          <div className="row pl-5 shop_title p-5">
            <div className="col-md-6">
              <h1 className="text-white" style={{ fontSize: "40px" }}>
                {shopItem.shopName}
              </h1>
            </div>
            <div className="col-md-2">
              <h6 className="text-white">สถานที่: {dataLocation}</h6>
            </div>
            <div className="col-md-2">
              <h6 className="text-white">ติดต่อ: {shopItem.contact}</h6>
            </div>
            <div className="col-md-2 flex">
              <h6 className="text-white pr-2">สถานะ: </h6>
              {shopItem.status ? (
                <h6 className="text-success font-extrabold">เปิด</h6>
              ) : (
                <h6 className="text-danger font-extrabold">ปิด</h6>
              )}
            </div>

            <FormControl
              sx={{ mt: 1, width: "300px" }}
              className="text-dark pl-3"
            >
              <Select
                className="bg-white scrollable"
                defaultValue={selectedCategory}
                id="categories"
                style={{ maxHeight: "3.5rem" }}
                name="categories"
                aria-label="categories"
                value={selectedCategory}
                onChange={(e) => handleSelect(e)}
              >
                <MenuItem value={""}>ทั้งหมด</MenuItem>
                {categories &&
                  Object.values(categories)?.map((category, index) => {
                    return (
                      <MenuItem key={index} value={category._id}>
                        {category.name}
                      </MenuItem>
                    );
                  })}
              </Select>
            </FormControl>
          </div>
        )}

        {product &&
          Object.values(filteredList).map((item) => (
            // item.category === selectedCategory[0]?._id
            <motion.div layout className="col-md-12 col-sm-12" key={item._id}>
              <div
                className="card text-left sm:text-center bg-neutral-900 text-white border-b-2 border-neutral-800"
                style={{ borderRadius: "5px 5px 5px 5px" }}
              >
                <div className="row p-5 flex justify-center">
                  <div className="place-items-center col-md-4 col-sm-12 product_image">
                    <img
                      src={item.images[0].url}
                      width="100%"
                      alt="product"
                      className="product_item"
                    />
                  </div>
                  <div className="col-md-4 pl-5 pt-4">
                    <h1
                      className="font-extrabold text-white"
                      style={{ fontSize: "150%" }}
                    >
                      {item.title}
                    </h1>
                    <p
                      className="font-bold text-green-600"
                      style={{ fontSize: "120%" }}
                    >
                      {item.price} บาท
                    </p>
                    <p>
                      รายละเอียด:{" "}
                      {item.content.length > 40
                        ? item.content.substring(0, 50) + "..."
                        : item.content}
                    </p>
                    <div>
                      {item.inStock ? (
                        <p className="text-green-500">มีสินค้า</p>
                      ) : (
                        <p className="text-red-500">สินค้าหมด</p>
                      )}
                    </div>
                    {/* <p>หมวดหมู่: {item.category}</p> */}
                  </div>
                  <div className="col-md-4 col-sm-12 pb-3">
                    {/* <label htmlFor="">Add to cart</label>
                      <input
                        className="form-control"
                        type="checkbox"
                        name="checkBox"
                        checked={item?.checked}
                        // value={item?.checked}
                        onChange={() => handleCheck(item._id)}
                      /> */}

                    <button
                      className="px-4 py-2 rounded text-white bg-sky-500 hover:bg-sky-700"
                      onClick={() => {
                        // console.log(item)
                        // console.log(cart)
                        dispatch(addToCart(item, cart));

                        // router.push("/cart");
                      }}
                      style={{
                        fontSize: "12px",
                        position: "absolute",
                        right: "0",
                      }}
                    >
                      เพิ่มลงตะกร้า
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
      </div>
    </div>
  );
};

export default Products;
