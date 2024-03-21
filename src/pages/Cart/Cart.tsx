import { ItemPack, Toolbar, Checkbox } from "@/components"
import DeleteOutline from "@mui/icons-material/DeleteOutline";
import Close from "@mui/icons-material/Close";

import React, {useState} from "react";

import "./Cart.scss"
import classNames from "classnames";
import {useCart} from "@/hooks/useCart.ts";
import {Item} from "@/components/Item/Small/Item.tsx";
import {CartItem} from "@/utils/Api/interface.ts";
import {setCart} from "@/utils/storage.ts";

let timeout: NodeJS.Timeout;
const HOLD_TIME = 2000;

function EndButton({callback}: {callback: () => any}) {
  return <button className="end-button" onClick={callback}>
    Очистить
  </button>
}

function DeleteButton({callback, disabled}: {callback: () => any, disabled: boolean}) {
  const [showTip, setShowTip] = useState(false);
  let activated = false;

  const start = () => {
    if (disabled) return

    timeout = setTimeout(() => {
      callback();
      activated = true;
    }, HOLD_TIME)
    setShowTip(false);
  }
  const cancel = () => {
    if (disabled) return

    clearTimeout(timeout)
    setShowTip(!activated)
  }

  return (
    <>
      {showTip && <p>Удерживай кнопку</p>}
      <button className="delete-button"
              onPointerDown={start}
              onPointerUp={cancel}
              onPointerLeave={cancel}
              disabled={disabled}
      >Удалить</button>
    </>
  )
}

export function Cart() {
  console.log("Cart rerender")

  const [deleteMode, setDeleteMode] = useState(false);

  const {cart, cartChecked, updateCartChecked, isCleared} = useCart();
  const [deleteChecked, setDeleteChecked] = useState<number[]>([]);

  const classes = classNames({
    "deletemode": deleteMode,
    "cart-wrapper": true,
  })

  function addCartChecked(item: CartItem) {
    cartChecked.push(item.id);
    updateCartChecked();
  }
  function addDeleteChecked(item: CartItem) {
    setDeleteChecked([...deleteChecked, item.id])
  }
  function removeDeleteChecked(id: number) {
    setDeleteChecked(deleteChecked.filter((item) => item !== id));
  }
  function removeCartChecked(id: number) {
    cartChecked.splice(cartChecked.indexOf(id));
    updateCartChecked();
  }
  function purgeCart() {
    return setCart([]);
  }

  function handleItemCheckboxChange(this: CartItem, ev: React.ChangeEvent<HTMLInputElement>) {
    if (ev.target.checked) {
      deleteMode ? addDeleteChecked(this) : addCartChecked(this);
      return;
    }
    deleteMode ? removeDeleteChecked(this.id) : removeCartChecked(this.id);
  }

  const items = Object.entries(cart).map(([shopName, items]) =>
    <ItemPack title={shopName} key={shopName}>
      {items.map((item) =>
        <Item key={item.id} {...item} isCart={true} checkbox={
          <Checkbox key={`${item.id} checkbox`} onChange={handleItemCheckboxChange.bind(item)} />
        } />
      )}
    </ItemPack>
  )

  return (
    <div className={classes}>
      <Toolbar title={deleteMode ? "Удаление элементов" : "Список"}>
        <span onClick={() => setDeleteMode(!deleteMode)} className="contents">
          {deleteMode ? <DeleteOutline /> : <Close />}
        </span>
      </Toolbar>
      <div className="container">
        {items}
      </div>
      <div className="cart__footer">
        {deleteMode &&
            <DeleteButton
                callback={() => {setDeleteMode(false)}}
                disabled={deleteChecked.length === 0} />}
        {(!deleteMode && isCleared) && <EndButton callback={purgeCart} />}
      </div>
    </div>
  )
}

export default Cart
