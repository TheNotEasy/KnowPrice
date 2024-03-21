import "./Item.scss"
import React, { JSX } from "react";
import {Checkbox} from "@/components/Checkbox/Checkbox.tsx";

export type ItemProps = {
  name: string
  price: number
  onClick?: (ev: React.MouseEvent<HTMLDivElement>) => any
} & (
  { isCart: true, checkbox?: JSX.Element } |
  { isCart: false, checkbox: never }
)

export function Item({ name, price, isCart, checkbox, onClick }: ItemProps) {
  return (
    <div className="item">
      <div className="item__info" onClick={onClick}>
        <p className="item__name">{name}</p>
        <p className="item__price">{price} руб</p>
      </div>
      {isCart ? <div className="item__controls">
        {/*{isCart ? <Checkbox {...checkbox} /> : <p>not cart</p>}*/}
        {checkbox ? checkbox : <Checkbox />}
      </div> : (<></>)}
    </div>
  )
}
