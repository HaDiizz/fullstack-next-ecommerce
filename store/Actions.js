export const ACTIONS = {
  NOTIFY: "NOTIFY",
  AUTH: "AUTH",
  ADD_SHOP: "ADD_SHOP",
  ADD_MODAL: "ADD_MODAL",
  ADD_PRODUCTS: "ADD_PRODUCTS",
  ADD_CART: "ADD_CART",
  ADD_ORDERS: "ADD_ORDERS",
  ADD_USERS: "ADD_USERS",
  ADD_CATEGORIES: "ADD_CATEGORIES",
  ADD_PRODUCTS: "ADD_PRODUCTS",
  ADD_LIST: "ADD_LIST",
  ADD_LOCATIONS: "ADD_LOCATIONS",
  ADD_MANAGE_ORDER: "ADD_MANAGE_ORDER",
};

export const decrease = (data, id) => {
  const newData = [...data];
  newData.forEach((item) => {
    if (item._id === id) item.quantity -= 1;
  });

  return { type: "ADD_CART", payload: newData };
};

export const increase = (data, id) => {
  const newData = [...data];
  newData.forEach((item) => {
    if (item._id === id) item.quantity += 1;
  });

  return { type: "ADD_CART", payload: newData };
};

export const addToCart = (product, cart) => {
  if (!product.inStock)
    return { type: "NOTIFY", payload: { error: "สินค้าหมด" } };

  const check = cart.every((item) => {
    return item._id !== product._id;
  });

  const checkShop = cart.every((item) => {
    // console.log("cart", item.shop)
    // console.log("product", product.shop)
    return item.shop === product.shop;
  });
  // console.log(checkShop)

  if (!checkShop)
    return {
      type: "NOTIFY",
      payload: { error: "กรุณาเลือกสินค้าจากร้านค้าเดียวกัน" },
    };

  if (!check)
    return {
      type: "NOTIFY",
      payload: { error: "สินค้าเพิ่มลงในตะกร้าเรียบร้อยแล้ว" },
    };

  return { type: "ADD_CART", payload: [...cart, { ...product, quantity: 1 }] };
};

export const addToList = (shop, list) => {
  // const check = list.every(item => {
  //     return item._id !== shop._id
  // })
  // if(!check) return ({ type: 'NOTIFY', payload: {error: 'เพิ่มไปยังร้านค้าโปรดปรานแล้ว'} })

  const check = list.every((item) => {
    return item._id !== shop._id;
  });
  if(!check) return deleteItem(list, shop._id, "ADD_LIST")

  return {
    type: "ADD_LIST",
    payload: [...list, { ...shop }],
  };
};

export const updateItem = (data, id, post, type) => {
  const newData = data?.map((item) => (item._id === id ? post : item));
  return { type, payload: newData };
};

export const deleteItem = (data, id, type) => {
  const newData = data.filter((item) => item._id !== id);
  // console.log(newData)
  return { type, payload: newData };
};

export default ACTIONS;
