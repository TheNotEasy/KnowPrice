import React from "react";

import "./ItemPack.scss"

type ItemPackProps = React.PropsWithChildren<{
  title: string
}>

export function ItemPack({ title, children }: ItemPackProps) {
  return (
    <div className="item-pack">
      <h1 className="pack__title">{title}</h1>
      <div className="pack__items">
        {children}
      </div>
    </div>
  )
}
