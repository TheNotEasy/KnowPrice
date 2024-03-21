import "./TabBar.scss";

import React from "react";
import {OverridableComponent} from "@mui/material/OverridableComponent";

export type Tab = {
  icon: OverridableComponent<any>,
  outlined: OverridableComponent<any>,
  hidden?: false
} | {
  hidden: true
}

export type Tabs = {
  [key: string]: Tab
}

function TabIcon({ tab, tabId, active, setActive }: {tab: Tab, tabId: string, active: string, setActive: any }) {
  if (tab.hidden) return;

  let iconToRender = <tab.outlined />;

  if (active === tabId) {
    iconToRender = <tab.icon className="active" />;
  }

  function handleClick() {
    setActive(tabId);
  }

  return (
    <span onClick={handleClick}>
      {iconToRender}
    </span>
  )
}

export function TabBar({ activeTabState, tabs }: { activeTabState: [string, React.Dispatch<any>], tabs: Tabs }) {
  const [active, setActive] = activeTabState;

  const navMenu = Object.entries(tabs).map(([id, tab]) => {
    if (tab.hidden) return;
    return <TabIcon tab={tab} tabId={id} active={active} setActive={setActive} key={id} />
  });

  return (
    <div className="tab">
      <ul className="tab-icons">
        {navMenu}
      </ul>
    </div>
  )
}
