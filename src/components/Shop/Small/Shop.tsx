import StarOutline from "@mui/icons-material/StarOutline";
import {JSX} from "react";

import "./Shop.scss"

type Props = {
  name: string
  rating: number
  child?: JSX.Element
}


export function Shop({ name, rating, child }: Props) {
  let img = child;
  if (img === undefined || img.type !== 'img') {
    img = <img src="" alt="" />
  }

  return (
    <div className="shop">
      {img}
      <div className="shop__footer">
        <p className="shop__name">{name}</p>
        <div className="shop__rating">
          <StarOutline />
          {rating}
        </div>
      </div>
    </div>
  )
}
