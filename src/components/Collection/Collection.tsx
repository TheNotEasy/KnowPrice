import React, {JSX} from "react";

import './Collection.scss';

type Props = {
  title: string
  children: JSX.Element[] | JSX.Element
}

export function Collection({ title, children }: Props) {
  let nav: JSX.Element | null = null
  const shops: JSX.Element[] = [];

  children = React.Children.toArray(children) as any;

  for (const child of children as JSX.Element[]) {
    if (child.type === 'nav') {
      nav = child;
    } else {
      shops.push(child);
    }
  }

  return (
    <div className="collection">
      <div className="collection__header">
        <h1 className="collection__title">{title}</h1>
        {nav}
      </div>
      <div className="collection__list">
        <div className="collection__list-inner">
          {shops}
        </div>
      </div>
    </div>
  )
}

