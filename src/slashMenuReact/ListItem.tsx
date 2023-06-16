import React, { FC, useEffect } from "react";
import { SlashMenuState } from "prosemirror-slash-menu";
import "./styles/menu-style.css";

export const ListItem: FC<{
  menuState: SlashMenuState;
  id: string;
  Icon?: FC;
  idx: number;
  label: string;
}> = ({ menuState, id, Icon, idx, label }) => {
  useEffect(() => {
    const element = document.getElementById(id);
    if (!element) return;
    if (id === menuState.selected) {
      element.classList.add("menu-element-selected");
      return;
    }
    if (element.classList.contains("menu-element-selected")) {
      element.classList.remove("menu-element-selected");
    }
  }, [menuState.selected]);
  return (
    <div className={"menu-element-wrapper"} id={id} key={`${id}-${idx}`}>
      {Icon ? (
        <div className={"menu-element-icon"}>
          <Icon />
        </div>
      ) : null}

      <div className={"menu-element"}>{label}</div>
    </div>
  );
};
