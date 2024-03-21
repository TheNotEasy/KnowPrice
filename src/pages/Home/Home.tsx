import {Collection, Searchbar, SmallShop} from "@/components";

import config from '@/config.ts'
import {memo} from "react";

export function Home() {
  // For testing purposes
  // const ShopArray: React.FC<IOptions> = ({ times }) => {
  //   const shops = Array.from({length: times}, () => <SmallShop name="Lorem Ipsum" rating={4.3} />)
  //   return <>{shops}</>
  // }
  //-0
  // const CollectionArray: React.FC<IOptions> = ({ times }) => {
  //   const collections = Array.from({length: times}, () => <Collection title="Lorem Ipsum"><ShopArray times={5} /></Collection>)
  //   return <>{collections}</>
  // }

  console.log("Rerendered")

  const apiData = config.api.getHomeCollections()
  const collections = apiData.collections.map((collection, index) => {
    const items = collection.shops.map((shop, index) => {
      return <SmallShop name={shop.name} rating={shop.rating} key={index}></SmallShop>
    })
    return <Collection title={collection.title} key={index}>{items}</Collection>
  })

  return (
    <div className="container">
      <Searchbar></Searchbar>
      {collections}
    </div>
  )
}

const Memoized = memo(Home)
export default Memoized
