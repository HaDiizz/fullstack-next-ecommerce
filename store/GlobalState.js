import { createContext, useEffect, useReducer } from "react";
import reducers from "./Reducers";
import { getData } from "../utils/fetchData";

export const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const initialState = {
    notify: {},
    auth: {},
    shops: [],
    modal: [],
    products: [],
    cart: [],
    orders: [],
    users: [],
    categories: [],
    products: [],
    lists: [],
    locations: [],
    orders: [],
    manageOrder: [],
  };
  const [state, dispatch] = useReducer(reducers, initialState);
  const { auth, cart, lists } = state;

  useEffect(() => {
    const firstLogin = localStorage.getItem("firstLogin");
    if (firstLogin) {
      getData("auth/accessToken").then((res) => {
        // console.log(res)
        if (res.err) return localStorage.removeItem("firstLogin");

        dispatch({
          type: "AUTH",
          payload: {
            token: res.access_token,
            user: res.user,
          },
        });
      });
    }
  }, []);

  useEffect(() => {
    const __next__cart = JSON.parse(localStorage.getItem("__next__cart"));
    if (__next__cart) dispatch({ type: "ADD_CART", payload: __next__cart });
  }, []);

  useEffect(() => {
    localStorage.setItem("__next__cart", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    const __next__list = JSON.parse(localStorage.getItem("__next__list"));
    if (__next__list) dispatch({ type: "ADD_LIST", payload: __next__list });
  }, []);

  useEffect(() => {
    localStorage.setItem("__next__list", JSON.stringify(lists));
  }, [lists]);

  useEffect(() => {
    getData("locations", auth.token).then((res) => {
      // console.log(res)
      if (res.err)
        return dispatch({ type: "NOTIFY", payload: { error: res.err } });

      dispatch({ type: "ADD_LOCATIONS", payload: res.locations });
    });
  }, [])

  useEffect(() => {
    if (auth.token) {
      getData("edit_shop", auth.token).then((res) => {
        // console.log(res)
        if (res.err)
          return dispatch({ type: "NOTIFY", payload: { error: res.err } });

        dispatch({ type: "ADD_SHOP", payload: res.shops });
      });

      getData("order", auth.token).then((res) => {
            if (res.err)
              return dispatch({ type: "NOTIFY", payload: { error: res.err } });
  
            dispatch({ type: "ADD_ORDERS", payload: res.orders });
          });

      if (auth.user.role === "seller") {
        getData("product", auth.token).then((res) => {
          // console.log(res)
          if (res.err)
            return dispatch({ type: "NOTIFY", payload: { error: res.err } });

          dispatch({ type: "ADD_PRODUCTS", payload: res.products });
        });

        getData("categories", auth.token).then((res) => {
          // console.log(res)
          if (res.err)
            return dispatch({ type: "NOTIFY", payload: { error: res.err } });

          dispatch({ type: "ADD_CATEGORIES", payload: res.categories });
        });

        getData("order/manage", auth.token).then((res) => {
          // console.log(res)
          if (res.err)
            return dispatch({ type: "NOTIFY", payload: { error: res.err } });

          dispatch({ type: "ADD_MANAGE_ORDER", payload: res.orders });
        })
        
      }

      if (auth.user.role === "admin") {
        getData("user", auth.token).then((res) => {
          // console.log(res)
          if (res.err)
            return dispatch({ type: "NOTIFY", payload: { error: res.err } });
          dispatch({ type: "ADD_USERS", payload: res.users });
        });
      }
    } else {
      dispatch({ type: "ADD_ORDERS", payload: [] });
      dispatch({ type: "ADD_USERS", payload: [] });
      dispatch({ type: "ADD_SHOP", payload: [] });
      dispatch({ type: "ADD_CATEGORIES", payload: [] });
      dispatch({ type: "ADD_PRODUCTS", payload: [] });
      dispatch({ type: "ADD_MANAGE_ORDER", payload: [] });

    }
  }, [auth.token]);

  return (
    <DataContext.Provider value={{ state, dispatch }}>
      {children}
    </DataContext.Provider>
  );
};
