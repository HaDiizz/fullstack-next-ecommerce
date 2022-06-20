import React, { useState } from "react";
import NavBar from "./NavBar";
import Sidebar from "./Sidebar";
import { FullScreen, useFullScreenHandle } from "react-full-screen";
import Notify from "./Notify";
import Modal from "./Modal";

const Layouts = ({ children }) => {
  const [sidebar, toggleSidebar] = useState(false);

  const handleToggleSidebar = () => toggleSidebar((value) => !value);
  return (
    <>
        <NavBar handleToggleSidebar={handleToggleSidebar} />
        <Modal />
        <Notify/>
        <Sidebar sidebar={sidebar} handleToggleSidebar={handleToggleSidebar} />
        <div className="">{children}</div>
    </>
  );
};

export default Layouts;
