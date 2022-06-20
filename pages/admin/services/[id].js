import React, { useContext, useEffect, useState } from "react";
import { DataContext } from "../../../store/GlobalState";
import Image from "next/image";
import moment from "moment";
import { putData, getData } from "../../../utils/fetchData";
import { updateItem } from "../../../store/Actions";
import Head from "next/head";
import { useRouter } from "next/router";
import Link from "next/link";
import { Textarea } from "@nextui-org/react";

const ServicesDetail = () => {
  const { state, dispatch } = useContext(DataContext);
  const { auth } = state;
  const router = useRouter();
  const { id } = router.query;
  const [data, setData] = useState([]);
  const [isImage, setIsImage] = useState(false);
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState(false);

  useEffect(() => {
    if (id) {
      getData(`/contact/${id}`).then((res) => {
        setData(res.contacts);
        setIsImage(res?.contacts[0]?.images.length > 0);
        setStatus(res?.contacts[0]?.status);
        // console.log(res);
      });
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message)
      return dispatch({
        type: "NOTIFY",
        payload: { error: "ไม่สามารถส่งข้อความว่างได้" },
      });
    const res = await putData(`/contact/${id}`, {
      message,
      email: data[0]?.email,
      author: data[0]?.author,
    },auth.token);
    if (res?.error)
      return dispatch({ type: "NOTIFY", payload: { error: res?.error } });
    dispatch({ type: "NOTIFY", payload: { success: "ส่งข้อความสำเร็จ" } });
    router.push("/admin/services");
  };

  if (!auth.user) return null;
  if (auth.user.role !== "admin") return null;

  return (
    <div>
      <Head>
        <title>Services Detail</title>
      </Head>
      <div className="shop_bg" style={{ zIndex: "0" }}></div>
      <div className="text-white profile_page h-screen w-full flex flex-wrap justify-center container">
        <div className="text-center text-secondary flex flex-col items-center justify-center pt-5">
          <div
            className="flex justify-center text-left pt-4"
            style={{ zIndex: "1" }}
          >
            {data?.map((item, index) => (
              <div key={index} className="space-y-14">
                <h1 className="text-white">
                  หัวข้อเรื่อง: <span>{item.title}</span>
                </h1>
                <h1 className="text-white">
                  อีเมล: <span>{item.email}</span>
                </h1>
                <h1 className="text-white">
                  ผู้ส่ง: <span>{item.author}</span>
                </h1>
                <h1 className="text-white">
                  วันที่:{" "}
                  <span>{moment(item.createdAt).format("DD/MM/YYYY")}</span>
                </h1>
                <h1 className="text-white">
                  รายละเอียด: <span>{item.detail}</span>
                </h1>
                <div className="col-md-12 row">
                  {isImage &&
                    item.images?.map((img, index) => (
                      <div key={index} className="col-md-6">
                        <Link href={img.url}>
                          <a target={"_blank"}>
                            <Image
                              src={img.url}
                              width={200}
                              height={200}
                              className="rounded"
                            />
                          </a>
                        </Link>
                      </div>
                    ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="p-5">
        {!status ? (
          <>
            <Textarea
              width="100%"
              aria-labelledby="tac"
              placeholder="พิมพ์ข้อความ"
              rows={4}
              className="pb-3"
              onChange={(e) => setMessage(e.target.value)}
            />
            <button className="btn btn-dark sticky" onClick={handleSubmit}>
              ตอบกลับ
            </button>
          </>
        ) : (
          <>
            <div className="sticky">
              <h1 className="text-white">ข้อความที่ส่งไปแล้ว</h1>
              <p className="text-green-500">{data[0]?.message}</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ServicesDetail;
