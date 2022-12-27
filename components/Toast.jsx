import React, { useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import { injectStyle } from "react-toastify/dist/inject-style";

const Toast = ({ msg }) => {
  const customId = "custom-id-yes";
  
  injectStyle();
  useEffect(() => {

    if (msg.status === "success") {
      toast.success(`${msg.msg}`, {
        toastId: customId,
        progress: undefined,
        theme: "colored",
      });
    } else if (msg.status === "error") {
      toast.error(`${msg.msg}`, {
        toastId: customId,
        progress: undefined,
        theme: "colored",
      });
    } else if (msg.status === "loggedout") {
      toast.success(`${msg.msg}`, {
        toastId: customId,
        progress: undefined,
        theme: "colored",
      });
    }
  }, []);
  // msg.status, toast, msg.msg
  return (
    <div className="notify">
      <ToastContainer
        position="top-center"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
};

export default Toast;
