import './App.scss';
import {TabBar} from "@/components";

import {FunctionComponent, memo, useState} from "react";
import {Home, HomeOutlined, Settings, SettingsOutlined, ShoppingBag, ShoppingBagOutlined} from "@mui/icons-material";
import {Tabs} from "@/components/TabBar/TabBar.tsx";

import HomePage from "@/pages/Home/Home.tsx"
import CartPage from "@/pages/Cart/Cart.tsx"
import SettingsPage from "@/pages/Settings/Settings.tsx"
import ItemPage from "@/pages/Item/Item.tsx"

const tabs: Record<string, any> = {
  home: {
    icon: Home,
    outlined: HomeOutlined,
  },
  cart: {
    icon: ShoppingBag,
    outlined: ShoppingBagOutlined,
  },
  settings: {
    icon: Settings,
    outlined: SettingsOutlined,
  },
  item: {
    hidden: true,
    needRerender: true,
  }
}

type Pages<Tabs> = {
  [key in keyof Tabs]: FunctionComponent<any>
}

const pages: Pages<typeof tabs> = {
  home: HomePage,
  cart: CartPage,
  settings: SettingsPage,
  item: ItemPage
}

function App() {
  const activeTabState = useState('home');

  return (
    <>
      {Object.entries(pages).map(([id, Page]) => {
        if (tabs[id].needRerender && activeTabState[0] !== id) {
          return
        }
        return <div
          style={id !== activeTabState[0] ? {display: "none"} : undefined}
          className="contents"
          key={id}>
          <Page></Page>
        </div>})
      }

      <TabBar activeTabState={activeTabState} tabs={tabs as Tabs}></TabBar>
    </>
  )
}

const Instance = memo(App)
export default Instance

