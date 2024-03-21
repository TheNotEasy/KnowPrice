import {Toolbar} from "@/components";

import {ArrowBack} from "@mui/icons-material";
import {useParams, useNavigate} from "react-router";

export function Item() {
  const { id } = useParams()
  const navigate = useNavigate()

  console.log("Rerender item")

  return (
    <>
      <Toolbar>
        <nav>
          <span onClick={() => {navigate(-1)}}>
            <ArrowBack />
          </span>
        </nav>
      </Toolbar>
      <div className="container">
        {id}
      </div>
    </>
  )
}

export default Item
