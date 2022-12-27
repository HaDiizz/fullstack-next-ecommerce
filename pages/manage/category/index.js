import { useContext, useState, useEffect } from "react";
import { DataContext } from "../../../store/GlobalState";
import Head from "next/head";
import { postData, putData } from "../../../utils/fetchData";
import { updateItem } from "../../../store/Actions";
import { useRouter } from "next/router";
import { FaEdit } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";

const Category = () => {
  const { state, dispatch } = useContext(DataContext);
  const { auth, categories, shops } = state;
  const [name, setName] = useState("");
  const [id, setId] = useState("");
  const router = useRouter();

  const createCategory = async () => {
    if (auth.user.role !== "seller")
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
      res = await putData(`categories/${id}`, { name }, auth.token);

      if (res.err)
        return dispatch({ type: "NOTIFY", payload: { error: res.err } });

      dispatch(updateItem(categories, id, res.category, "ADD_CATEGORIES"));
    } else {
      res = await postData("categories", { name }, auth.token);

      if (res.err)
        return dispatch({ type: "NOTIFY", payload: { error: res.err } });

      dispatch({
        type: "ADD_CATEGORIES",
        payload: [...categories, res.newCategory],
      }); 
    }

    setName("");
    setId("");

    return dispatch({ type: "NOTIFY", payload: { success: res.msg } });
  };

  const handleEditCategory = (category) => {
    setId(category._id);
    setName(category.name);
  };

  if (!auth.user) return null;
  if (auth.user.role !== "seller") return null;

  return (
    <>
      <Head>
        <title>Category</title>
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
      <div className="col-md-6 mx-auto my-3">
        <div className="input-group mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Add a new category"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <button className="btn btn-secondary ml-3" onClick={createCategory}>
            {id ? "Update" : "Create"}
          </button>
        </div>

        {categories.map((category) => (
          <div key={category._id} className="card my-2 text-capitalize">
            <div className="card-body d-flex justify-content-between">
              {category.name}
              <div style={{ cursor: "pointer" }} className="flex space-x-5">
                <FaEdit onClick={() => handleEditCategory(category)} />
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
                          data: categories,
                          id: category._id,
                          title: category.name,
                          type: "ADD_CATEGORIES",
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

export default Category;
