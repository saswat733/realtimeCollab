import React from "react";
import { NewButton } from "./new-button";
import { List } from "./list";

const SideBar = () => {
  return (
    <aside className="fixed z-[1] left-0 bg-blue-950 h-full flex p-3 w-[60px] flex-col gap-y-4 text-white ">
           <List/>
            <NewButton/>
    </aside>
  );
};

export default SideBar;
