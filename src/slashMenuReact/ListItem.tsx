import React, { FC, useCallback, useEffect } from "react";
import {
  dispatchWithMeta,
  MenuElement,
  SlashMenuKey,
  SlashMenuState,
  SlashMetaTypes,
} from "prosemirror-slash-menu";
import "./styles/menu-style.css";
import { EditorView } from "prosemirror-view";

export const ListItem: FC<{
  menuState: SlashMenuState;
  el: MenuElement;
  view: EditorView;
  idx: number;
  Icon?: FC;
  RightIcon?: FC;
  clickable?: boolean;
}> = ({ menuState, el, view, Icon, idx, clickable, RightIcon }) => {
  useEffect(() => {
    const element = document.getElementById(el.id);
    if (!element) return;
    if (el.id === menuState.selected) {
      element.classList.add("menu-element-selected");
      return;
    }
    if (element.classList.contains("menu-element-selected")) {
      element.classList.remove("menu-element-selected");
    }
  }, [menuState.selected]);
  const handleOnClick = useCallback(() => {
    if (el.type === "command") {
      dispatchWithMeta(view, SlashMenuKey, {
        type: SlashMetaTypes.execute,
      });
      el.command(view);
    }
    if (el.type === "submenu") {
      dispatchWithMeta(view, SlashMenuKey, {
        type: SlashMetaTypes.openSubMenu,
        element: el,
      });
    }
  }, [el]);
  return (
    <div
      className={
        clickable ? "menu-element-wrapper-clickable" : "menu-element-wrapper"
      }
      id={el.id}
      key={`${el.id}-${idx}`}
      onClick={handleOnClick}
    >
      {Icon ? (
        <div className={"menu-element-icon"}>
          <Icon />
        </div>
      ) : null}
      <div className={"menu-element-label"}>{el.label}</div>
      {RightIcon ? (
        <div className={"menu-element-right-icon"}>
          <RightIcon />
        </div>
      ) : null}
    </div>
  );
};
