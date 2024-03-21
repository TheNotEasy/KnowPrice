import "./Toolbar.scss"

import {JSX} from "react";

type ToolbarProps = {
  title?: string,
  children?: JSX.Element[] | JSX.Element
}


export function Toolbar({ children, title }: ToolbarProps) {
  return (
    <div className="toolbar">
      {title && <p className="toolbar__title">{title}</p>}
      <nav className="toolbar__nav">
        {children}
      </nav>
    </div>
  )
}
