import { ACTIONS } from "./Actions";

const reducers = (state, action) => {
  switch (action.type) {
    case ACTIONS.NOTIFY:
      return {
        ...state,
        notify: action.payload,
      };
    case ACTIONS.AUTH:
      return {
        ...state,
        auth: action.payload,
      };
    case ACTIONS.ADD_SHOP:
      return {
        ...state,
        shops: action.payload,
      };
    case ACTIONS.ADD_MODAL:
      return {
        ...state,
        modal: action.payload,
      };
    case ACTIONS.ADD_CART:
      return {
        ...state,
        cart: action.payload,
      };
    case ACTIONS.ADD_ORDERS:
      return {
        ...state,
        orders: action.payload,
      };
    case ACTIONS.ADD_USERS:
      return {
        ...state,
        users: action.payload,
      };
    case ACTIONS.ADD_CATEGORIES:
      return {
        ...state,
        categories: action.payload,
      };
    case ACTIONS.ADD_PRODUCTS:
      return {
        ...state,
        products: action.payload,
      };
    case ACTIONS.ADD_LIST:
      return {
        ...state,
        lists: action.payload,
      };
    case ACTIONS.ADD_LOCATIONS:
      return {
        ...state,
        locations: action.payload,
      };
    case ACTIONS.ADD_MANAGE_ORDER:
      return {
        ...state,
        manageOrder: action.payload,
      };
    default:
      return state;
  }
};

export default reducers;
