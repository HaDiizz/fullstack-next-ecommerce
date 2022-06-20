import { useContext, useState, useEffect } from "react";
import { DataContext } from "../../../store/GlobalState";
import Head from "next/head";
import { postData, putData } from "../../../utils/fetchData";
import { updateItem } from "../../../store/Actions";
import { useRouter } from "next/router";
import { FaEdit } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";

const Location = () => {
  const { state, dispatch } = useContext(DataContext);
  const { auth, locations } = state;
  const [name, setName] = useState("");
  const [id, setId] = useState("");
  const router = useRouter();

  const createLocation = async () => {
    if (auth.user.role !== "admin")
      return dispatch({
        type: "NOTIFY",
        payload: { error: "Authentication is not valid." },
      });

    if (!name)
      return dispatch({
        type: "NOTIFY",
        payload: { error: "Name can not be a blank." },
      });

    dispatch({ type: "NOTIFY", payload: { loading: true } });

    let res;
    // if edit
    if (id) {
      res = await putData(`locations/${id}`, { name }, auth.token);

      // console.log(res)

      if (res.err)
        return dispatch({ type: "NOTIFY", payload: { error: res.err } });

      // console.log(res) //join value ._doc in api/categories/[id].js

      dispatch(updateItem(locations, id, res.location, "ADD_LOCATIONS"));
    } else {
      res = await postData("locations", { name }, auth.token);

      // console.log(res)

      if (res.err)
        return dispatch({ type: "NOTIFY", payload: { error: res.err } });

      dispatch({
        type: "ADD_LOCATIONS",
        payload: [...locations, res.newLocations],
      }); //Realtime->add item to state
    }

    setName("");
    setId("");

    return dispatch({ type: "NOTIFY", payload: { success: res.msg } });
  };

  const handleEditLocation = (location) => {
    // console.log(category)
    setId(location._id);
    setName(location.name);
  };

  if (!auth.user) return null;
  if (auth.user.role !== "admin") return null;

  return (
    <>
      <Head>
        <title>Location</title>
      </Head>

      <div className="shop_bg"></div>

      <div className="pt-[8rem] container pb-5 pl-[7rem] pr-[7rem] profile_page">
        <div className="flex space-x-6 sticky">
          <button
            className="btn btn-dark ml-5 mt-4"
            onClick={() => router.back()}
          >
            ย้อนกลับ
          </button>
        </div>
      </div>
      <div className="col-md-6 mx-auto my-3 pb-5">
        <div className="input-group mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Add a new location"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <button className="btn btn-secondary ml-3" onClick={createLocation}>
            {id ? "Update" : "Create"}
          </button>
        </div>

        {locations.map((location) => (
          <div key={location?._id} className="card my-2 text-capitalize">
            <div className="card-body d-flex justify-content-between">
              {location?.name}
              <div style={{ cursor: "pointer" }} className="flex space-x-5">
                <FaEdit onClick={() => handleEditLocation(location)} />
                {/* <i
                className="fas fa-edit mr-2 text-info"
                onClick={() => handleEditCategory(category)}
              ></i> */}
                <RiDeleteBin6Line
                  className="text-danger"
                  title="Remove"
                  data-toggle="modal"
                  data-target="#exampleModal"
                  onClick={() =>
                    dispatch({
                      type: "ADD_MODAL",
                      payload: [
                        {
                          data: locations,
                          id: location?._id,
                          title: location?.name,
                          type: "ADD_LOCATIONS",
                        },
                      ],
                    })
                  }
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default Location;
