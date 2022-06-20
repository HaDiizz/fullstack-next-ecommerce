import React, { useEffect, useState, useContext } from "react";
import { useRouter } from "next/router";
import { getData } from "../../utils/fetchData";
import { DataContext } from "../../store/GlobalState";
import { GrCompliance } from "react-icons/gr";

const VerifyEmail = () => {
  const router = useRouter();
  const { id } = router.query;
  const { dispatch } = useContext(DataContext);

  // const handleVerify = async () => {
  //   if (id) {
  //     setIsVerified(true);
  //     const res = await getData(`auth/verify/${id}`);
  //     if (res.err) {
  //       return dispatch({ type: "NOTIFY", payload: { error: res.err } });
  //     }

  //     return dispatch({ type: "NOTIFY", payload: { success: res.msg } });
  //   }
  //   // setIsNull(true);
  // };

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
      <div className="justify-center text-center absolute top-[50%] left-[45%] text-white">
        <h1>ยืนยันอีเมลสำเร็จ</h1>
        <div className="pt-5 text-white">
          <GrCompliance size={100} />
        </div>
      </div>
    </>
  );
};

export default VerifyEmail;
