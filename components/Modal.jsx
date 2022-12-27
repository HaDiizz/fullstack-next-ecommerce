import { useContext } from "react";
import { DataContext } from "../store/GlobalState";
import { deleteItem } from "../store/Actions";
import { deleteData } from "../utils/fetchData";
import { useRouter } from "next/router";

const Modal = () => {
  const { state, dispatch } = useContext(DataContext);

  const { modal, auth, shop } = state;

  const router = useRouter();


  const deleteUser = (item) => {
    dispatch(deleteItem(item.data, item.id, item.type));

    deleteData(`user/${item.id}`, auth.token).then((res) => {

      if (res.err)
        return dispatch({ type: "NOTIFY", payload: { error: res.err } });

      return dispatch({ type: "NOTIFY", payload: { success: res.msg } });
    });
  };

  const deleteCategories = (item) => {
    deleteData(`categories/${item.id}`, auth.token).then((res) => {
      if (res.err)
        return dispatch({ type: "NOTIFY", payload: { error: res.err } });

      dispatch(deleteItem(item.data, item.id, item.type));
      return dispatch({ type: "NOTIFY", payload: { success: res.msg } });
    });
  };

  const deleteProduct = (item) => {
    dispatch(deleteItem(item.data, item.id, item.type));
    dispatch({ type: "NOTIFY", payload: { loading: true } });
    deleteData(`product/${item.id}`, auth.token).then((res) => {
      if (res.err)
        return dispatch({ type: "NOTIFY", payload: { error: res.err } });
      dispatch({ type: "NOTIFY", payload: { success: res.msg } });
    });
  };

  const deleteShop = (item) => {
    dispatch(deleteItem(item.data, item.id, item.type));
    dispatch({ type: "NOTIFY", payload: { loading: true } });
    deleteData(`shop/${item.id}`, auth.token).then((res) => {
      if (res.err)
        return dispatch({ type: "NOTIFY", payload: { error: res.err } });
      dispatch({ type: "NOTIFY", payload: { success: res.msg } });
      return router.push("/admin/shop");
    });
  };

  const deleteLocation = (item) => {
    deleteData(`locations/${item.id}`, auth.token).then((res) => {
      if (res.err)
        return dispatch({ type: "NOTIFY", payload: { error: res.err } });

      dispatch(deleteItem(item.data, item.id, item.type));
      return dispatch({ type: "NOTIFY", payload: { success: res.msg } });
    });
  };

  const handleSubmit = () => {
    if (modal.length !== 0) {
      for (const item of modal) {
        if (item.type === "ADD_CART") {
          dispatch(deleteItem(item.data, item.id, item.type));
        }
        if (item.type === "ADD_USERS") {
          deleteUser(item);
        }

        if (item.type === "ADD_CATEGORIES") {
          deleteCategories(item);
        }

        if (item.type === "ADD_PRODUCTS") {
          deleteProduct(item);
        }

        if (item.type === "ADD_SHOP") {
          deleteShop(item);
        }
        if (item.type === "ADD_LOCATIONS") {
          deleteLocation(item);
        }

        dispatch({ type: "ADD_MODAL", payload: [] });
      }
    }
  };

  return (
    <div
      className="modal fade"
      id="exampleModal"
      tabIndex={-1}
      role="dialog"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title text-capitalize" id="exampleModalLabel">
              {modal.length !== 0 && modal[0].title}
              {/* WARNNING..! */}
            </h5>
            <button
              type="button"
              className="close"
              data-dismiss="modal"
              aria-label="Close"
            >
              <span aria-hidden="true">×</span>
            </button>
          </div>
          <div className="modal-body">Do you want to delete this item ?</div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn bg-danger text-white"
              data-dismiss="modal"
              onClick={handleSubmit}
            >
              Yes
            </button>
            <button
              type="button"
              className="btn btn-primary"
              data-dismiss="modal"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
