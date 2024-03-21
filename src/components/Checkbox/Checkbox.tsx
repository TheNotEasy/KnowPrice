import "./Checkbox.scss"
import React from "react";
import {Check} from "@mui/icons-material";

export type CheckboxProps = {
  onChange?: React.ChangeEventHandler<HTMLInputElement>
  id?: string
  checked?: boolean
  inputRef?: React.LegacyRef<HTMLInputElement>
}

export function Checkbox({id, onChange, checked, inputRef}: CheckboxProps) {
  return (
    <div className="checkbox-wrapper">
      <input
        className="checkbox__native"
        type="checkbox"
        id={id}
        defaultChecked={checked}
        onChange={onChange}
        ref={inputRef}
      />
      <Check/>
    </div>
  )
}
