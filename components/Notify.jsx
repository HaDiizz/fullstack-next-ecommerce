import { useContext } from "react";
import { DataContext } from "../store/GlobalState";
import Loading from "./Loading";
import Toast from "./Toast";

const Notify = () => {
  const { state, dispatch } = useContext(DataContext);
  const { notify } = state;
  return (
    <div>
      {notify.loading && <Loading />}
      {notify.error && (
        <Toast
          msg={{ msg: notify.error, title: "Error", status: "error" }}
        />
      )}
      {notify.success && (
        <Toast
          msg={{ msg: notify.success, title: "Success", status: "success" }}
        />
      )}
      {notify.loggedout && (
        <Toast
          msg={{ msg: notify.loggedout, title: "Success", status: "loggedout" }}
        />
      )}
    </div>
  );
};

export default Notify;
