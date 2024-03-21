import {Preferences} from "@capacitor/preferences";
import {CartItem} from "@/utils/Api/interface.ts";

export type UpdateCallback = (newValue: any) => any;

const callbacks: Record<string, Record<string, UpdateCallback>> = {}

export async function getJson<T = Record<string, any> | any[], Default=T>(field: string, def: Default = null): Promise<T | Default> {
  const value = (await Preferences.get({key: field})).value
  if (!value) {
    return def
  }
  return JSON.parse(value)
}

export async function setJson(key: string, json: Record<string, any>) {
  const value = JSON.stringify(json)
  await Preferences.set({key, value})
  if (callbacks[key] === undefined) return;
  for (const callback of Object.values(callbacks[key])) {
    callback(JSON.parse(value));
  }
}

export const getCart = () => getJson<CartItem[]>("cart", [])
export const setCart = (json: CartItem[]) => setJson("cart", json)
export const pushCart = async (items: CartItem[]) => {await setCart((await getCart()).concat(items))}
export const removeCart = async (itemsId: number[]) => {await setCart((await getCart()).filter((item) => !itemsId.includes(item.id)))}

export function addUpdateCallback(callback: UpdateCallback, field: string, key: string) {
  if (!callbacks[field]) {
    callbacks[field] = {};
  }
  callbacks[field][key] = callback;
}

export function removeUpdateCallback(field: string, key: string) {
  delete callbacks[field][key];
}

// @ts-expect-error just debug
window["storageDebug"] = {
  getJson, setJson
};
