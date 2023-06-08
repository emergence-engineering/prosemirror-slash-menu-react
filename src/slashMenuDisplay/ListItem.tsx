import React, { FC } from "react";
import { SlashMenuState } from "prosemirror-slash-menu";

export const ListItem: FC<{
  menuState: SlashMenuState;
  id: string;
  Icon?: FC;
  idx: number;
  label: string;
}> = ({ menuState, id, Icon, idx, label }) => {
  return (
    <div
      className={"menu-element-wrapper"}
      style={{
        backgroundColor: `${id === menuState.selected ? "#f1f1f1" : "white"}`,
      }}
      id={id}
      key={`${id}-${idx}`}
    >
      {Icon ? (
        <div className={"menu-element-icon"}>
          <Icon />
        </div>
      ) : null}

      <div className={"menu-element"}>{label}</div>
    </div>
  );
};
