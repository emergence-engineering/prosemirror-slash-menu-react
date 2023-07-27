import { SlashMenuState, getElementById } from "prosemirror-slash-menu";

export const getElements = (state: SlashMenuState) => {
  const { subMenuId, filteredElements } = state;

  if (!subMenuId) {
    return filteredElements;
  }

  const subMenu = getElementById(subMenuId, state);

  if (subMenu && subMenu.type === "submenu") {
    return subMenu.elements;
  }
};
