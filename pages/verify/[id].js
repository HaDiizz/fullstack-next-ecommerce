import React, { useEffect, useState, useContext } from "react";
import { useRouter } from "next/router";
import { getData } from "../../utils/fetchData";
import { DataContext } from "../../store/GlobalState";
import { GrCompliance } from "react-icons/gr";
import Head from "next/head";
import emailSuccess from "../../assets/email_success.svg";
import Image from "next/image";
import { motion } from "framer-motion";

const VerifyEmail = () => {
  const router = useRouter();
  const { id } = router.query;
  const { dispatch } = useContext(DataContext);

  const svgVariants = {
    hidden: {
      rotate: -90,
    },
    visible: {
      rotate: 0,
      transition: {
        duration: 1,
      },
    },
  };

  useEffect(() => {
    if (id) {
      getData(`auth/verify/${id}`).then((res) => {
        if (res.err) {
          return router.push("/");
        }

        return dispatch({ type: "NOTIFY", payload: { success: res.msg } });
      });
    }
  }, [id]);

  return (
    <>
      <Head>
        <title>Verify Email</title>
      </Head>
      <div className="h-screen w-full flex flex-wrap justify-center">
        <div className="flex flex-col items-center justify-center">
          <motion.div variants={svgVariants} initial="hidden" animate="visible">
            <Image src={emailSuccess} width="200%" height="200%" />
          </motion.div>
          <h1 className="text-green-500 pt-5">ยืนยันอีเมลสำเร็จ</h1>
        </div>
      </div>
    </>
  );
};

export default VerifyEmail;
