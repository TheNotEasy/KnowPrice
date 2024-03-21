import {useEffect, useRef, useState} from "react";
import {CartItem} from "@/utils/Api/interface.ts";
import {addUpdateCallback, getCart, getJson, setJson} from "@/utils/storage.ts";

export function useCart() {
  const [cart, setCart] = useState<Record<string, CartItem[]>>({});
  const [isCleared, setIsCleared] = useState(false);

  const cartChecked = useRef<number[]>([]);
  const cartLength = useRef<number>(0);

  function groupCart(cart: CartItem[]) {
    const groupedCart: Record<string, CartItem[]> = {};
    let newIsCleared = true;

    for (const cartItem of cart) {
      // Create a list if it doesn't exist in groupedCart
      if (!groupedCart[cartItem.store]) groupedCart[cartItem.store] = [];
      groupedCart[cartItem.store].push(cartItem);

      newIsCleared = newIsCleared && cartItem.checked
    }

    cartLength.current = cart.length;

    setCart(groupedCart);
  }

  useEffect(() => {
    getCart().then(groupCart);
    getJson<number[]>("cartChecked", []).then(async (items) => {
      cartChecked.current = items;
    });
  }, []);

  function updateCartChecked() {
    setIsCleared(cartChecked.current.length == cartLength.current);
    void setJson("cartChecked", cartChecked.current);
  }

  addUpdateCallback(groupCart, 'cart', 'cartHookCallback')
  return {cart, cartChecked: cartChecked.current, updateCartChecked, isCleared};
}
