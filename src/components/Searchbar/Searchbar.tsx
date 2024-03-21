import './Searchbar.scss'

import Icon from "@mui/material/Icon"

export function Searchbar({ text="Поиск" }) {
  return (
    <div className="searchbar">
      <Icon className="search-icon">search</Icon>

      <input type="text" placeholder={text} />
    </div>
  )
}
