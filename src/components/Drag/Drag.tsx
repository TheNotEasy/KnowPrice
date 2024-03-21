import { JSX } from "react";

type DragProps = {
  child: JSX.Element
  holdTime: number

}

export function Drag({ child }: DragProps) {
  return (
    {child}
  )
}
