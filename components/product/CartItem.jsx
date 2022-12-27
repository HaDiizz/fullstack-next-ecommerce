import Link from "next/link";
import { increase, decrease } from "../../store/Actions";
import {FaTimes} from 'react-icons/fa'

const CartItem = ({ item, dispatch, cart }) => {
  return (
    <>
      <tr>
        <td style={{ width: "100px", overflow: "hidden" }}>
          <img
            src={item.images[0].url}
            alt={item.images[0].url}
            className="img-thumbnail w-100"
            style={{ minWidth: "80px", height: "80px" }}
          />
        </td>

        <td style={{ minWidth: "200px" }} className="w-50 align-middle">
          <h5 className="text-capitalize text-secondary">
            <Link href={`/products/${item.shop}`}>
              <a>{item.title}</a>
            </Link>
          </h5>
          <h6 className="text-danger">${item.quantity * item.price}</h6>
          {item.inStock === true ? (
            <p className="mb-1 text-success">In Stock </p>
          ) : (
            <p className="mb-1 text-danger">Out of Stock </p>
          )}
        </td>

        <td className="align-middle" style={{ minWidth: "150px" }}>
          <button
            className="btn btn-outline-secondary"
            onClick={() => dispatch(decrease(cart, item._id))}
            disabled={item.quantity === 1 ? true : false}
          >
            {" "}
            -{" "}
          </button>
          <span className="px-3 text-white">{item.quantity}</span>
          <button
            className="btn btn-outline-secondary"
            onClick={() => dispatch(increase(cart, item._id))}
          >
            {" "}
            +{" "}
          </button>
        </td>

        <td
          className="align-middle"
          style={{ minWidth: "50px", cursor: "pointer" }}
        >
          <FaTimes
            className="fas fa-trash-alt text-danger"
            aria-hidden="true"
            style={{ fontSize: "19px" }}
            data-toggle="modal" data-target="#exampleModal"
            onClick={() => dispatch({
                type: 'ADD_MODAL',
                payload: [{ data: cart, id: item._id, title: item.title, type: 'ADD_CART' }]
            })}
          ></FaTimes>
        </td>
      </tr>
    </>
  );
};

export default CartItem;
