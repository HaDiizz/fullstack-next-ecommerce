import React from "react";
import Link from "next/link";
import Typed from "react-typed";
import Head from "next/head";

const NotFound = () => {
  return (
    <div className="flex h-screen text-white uppercase err_content">
      <Head>
        <title>404 Error</title>
      </Head>
      <div className="m-auto text-center block">
        <div className="content_404 pt-5">
          <h1 className="text_error pt-11 bg-gradient-to-l from-indigo-400 via-purple-300 to-indigo-400 py-1 text-center font-bold text-gradient drop-shadow-md sm:text-md">
            <Typed strings={["404 Error!"]} typeSpeed={40} backSpeed={50} loop />
          </h1>
          <div className="pt-[2rem]">
          <span className="pb-[5rem] text-xl span_err">
            We encountered an unexpected error.
          </span>
          </div>
        </div>
        <div className="pt-[5rem]">
          <Link href={"/"}>
            <a className="px-3 py-3 rounded-xl text-white outline hover:bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
              back home
            </a>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
