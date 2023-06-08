import {
  CommandItem,
  SlashMenuState,
  SubMenu,
  ignoredKeys,
} from "prosemirror-slash-menu";
import { setBlockType, toggleMark } from "prosemirror-commands";
import { schema } from "prosemirror-schema-basic";

export enum Icons {
  "Level1" = "Level1",
  "Level2" = "Level2",
  "Level3" = "Level3",
  "Bold" = "Bold",
  "Italic" = "Italic",
  "Link" = "Link",
  "Code" = "Code",
}

const H1Command: CommandItem = {
  id: Icons.Level1,
  label: "H1",
  type: "command",
  command: (view) => {
    console.log("shpould make heading 1");
    setBlockType(schema.nodes.heading, { level: 1 })(
      view.state,
      view.dispatch,
      view
    );
  },
  available: () => true,
};
const H2Command: CommandItem = {
  id: Icons.Level2,
  label: "H2",
  type: "command",
  command: (view) => {
    console.log("shpould make heading 2");
    setBlockType(schema.nodes.heading, { level: 2 })(
      view.state,
      view.dispatch,
      view
    );
  },
  available: () => true,
};
const H3Command: CommandItem = {
  id: Icons.Level3,
  label: "H2",
  type: "command",
  command: (view) => {
    console.log("shpould make heading 3");
    setBlockType(schema.nodes.heading, { level: 3 })(
      view.state,
      view.dispatch,
      view
    );
  },
  available: () => true,
};

const BoldCommand: CommandItem = {
  id: Icons.Bold,
  label: "Bold",
  type: "command",
  command: (view) => {
    const markType = schema.marks.strong;
    toggleMark(markType)(view.state, view.dispatch, view);
  },
  available: () => true,
};
const ItalicCommand: CommandItem = {
  id: Icons.Italic,
  label: "Italic",
  type: "command",
  command: (view) => {
    const markType = schema.marks.em;
    toggleMark(markType)(view.state, view.dispatch, view);
  },
  available: () => true,
};
const CodeCommand: CommandItem = {
  id: Icons.Code,
  label: "Code",
  type: "command",
  command: (view) => {
    const markType = schema.marks.code;
    toggleMark(markType)(view.state, view.dispatch, view);
  },
  available: () => true,
};
const LinkCommand: CommandItem = {
  id: Icons.Link,
  label: "Link",
  type: "command",
  command: (view) => {
    const markType = schema.marks.link;
    toggleMark(markType)(view.state, view.dispatch, view);
  },
  available: () => true,
};

const HeadingsMenu: SubMenu = {
  id: "headings",
  label: "Headings",
  type: "submenu",
  elements: [H1Command, H2Command, H3Command],
};
export const defaultConfig: Partial<SlashMenuState> = {
  filteredElements: [
    HeadingsMenu,
    BoldCommand,
    ItalicCommand,
    CodeCommand,
    LinkCommand,
  ],
  selected: HeadingsMenu.id,
  open: false,
  filter: "",
  ignoredKeys: ignoredKeys,
};
