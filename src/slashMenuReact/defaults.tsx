import { CommandItem, SubMenu } from "prosemirror-slash-menu";
import { setBlockType, toggleMark } from "prosemirror-commands";
import { schema } from "prosemirror-schema-basic";

export enum Icons {
  "HeaderMenu" = "HeaderMenu",
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
    setBlockType(view.state.schema.nodes.heading, { level: 1 })(
      view.state,
      view.dispatch,
      view
    );
  },
  available: (view) => true,
};
const H2Command: CommandItem = {
  id: Icons.Level2,
  label: "H2",
  type: "command",
  command: (view) => {
    setBlockType(view.state.schema.nodes.heading, { level: 2 })(
      view.state,
      view.dispatch,
      view
    );
  },
  available: (view) => true,
};
const H3Command: CommandItem = {
  id: Icons.Level3,
  label: "H3",
  type: "command",
  command: (view) => {
    setBlockType(view.state.schema.nodes.heading, { level: 3 })(
      view.state,
      view.dispatch,
      view
    );
  },
  available: (view) => true,
};

const BoldCommand: CommandItem = {
  id: Icons.Bold,
  label: "Bold",
  type: "command",
  command: (view) => {
    const markType = view.state.schema.marks.strong;
    toggleMark(markType)(view.state, view.dispatch, view);
  },
  available: (view) => true,
};
const ItalicCommand: CommandItem = {
  id: Icons.Italic,
  label: "Italic",
  type: "command",
  command: (view) => {
    const markType = view.state.schema.marks.em;
    toggleMark(markType)(view.state, view.dispatch, view);
  },
  available: (view) => true,
};
const CodeCommand: CommandItem = {
  id: Icons.Code,
  label: "Code",
  type: "command",
  command: (view) => {
    const markType = view.state.schema.marks.code;
    toggleMark(markType)(view.state, view.dispatch, view);
  },
  available: (view) => true,
};
const LinkCommand: CommandItem = {
  id: Icons.Link,
  label: "Link",
  type: "command",
  command: (view) => {
    const markType = view.state.schema.marks.link;
    toggleMark(markType)(view.state, view.dispatch, view);
  },
  available: (view) => true,
};

const HeadingsMenu: SubMenu = {
  id: Icons.HeaderMenu,
  label: "Headings",
  type: "submenu",
  available: (view) => true,
  elements: [H1Command, H2Command, H3Command],
};
export const defaultElements = [
  HeadingsMenu,
  BoldCommand,
  ItalicCommand,
  CodeCommand,
  LinkCommand,
];
import React from "react";

const HeadingIcon = () => (
  <svg
    fill="#000000"
    width="36"
    height="36"
    viewBox="0 0 36 36"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M18 20V4h-3v6H9V4H6v16h3v-7h6v7z" />
  </svg>
);
const H1Icon = () => (
  <svg
    width="36"
    height="36"
    viewBox="0 0 36 36"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M17 17H11V12C11 11.4477 10.5523 11 10 11C9.44772 11 9 11.4477 9 12V24C9 24.5523 9.44772 25 10 25C10.5523 25 11 24.5523 11 24V19H17V24C17 24.5523 17.4477 25 18 25C18.5523 25 19 24.5523 19 24V12C19 11.4477 18.5523 11 18 11C17.4477 11 17 11.4477 17 12V17Z"
      fill="#050038"
    />
    <path
      d="M26 25C26.5523 25 27 24.5523 27 24V12C27 11.4477 26.5523 11 26 11H23C22.4477 11 22 11.4477 22 12C22 12.5523 22.4477 13 23 13H25V24C25 24.5523 25.4477 25 26 25Z"
      fill="#050038"
    />
  </svg>
);
const H2Icon = () => (
  <svg
    width="36"
    height="36"
    viewBox="0 0 36 36"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M16 17H11V13C11 12.4477 10.5523 12 10 12C9.44772 12 9 12.4477 9 13V23C9 23.5523 9.44772 24 10 24C10.5523 24 11 23.5523 11 23V19H16V23C16 23.5523 16.4477 24 17 24C17.5523 24 18 23.5523 18 23V13C18 12.4477 17.5523 12 17 12C16.4477 12 16 12.4477 16 13V17Z"
      fill="#050038"
    />
    <path
      d="M26 22H22V19H26C26.5523 19 27 18.5523 27 18V13C27 12.4477 26.5523 12 26 12H21C20.4477 12 20 12.4477 20 13C20 13.5523 20.4477 14 21 14H25V17H21C20.4477 17 20 17.4477 20 18V23C20 23.5523 20.4477 24 21 24H26C26.5523 24 27 23.5523 27 23C27 22.4477 26.5523 22 26 22Z"
      fill="#050038"
    />
  </svg>
);
const H3Icon = () => (
  <svg
    width="36"
    height="36"
    viewBox="0 0 36 36"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12 17H16V14C16 13.4477 16.4477 13 17 13C17.5523 13 18 13.4477 18 14V22C18 22.5523 17.5523 23 17 23C16.4477 23 16 22.5523 16 22V19H12V22C12 22.5523 11.5523 23 11 23C10.4477 23 10 22.5523 10 22V14C10 13.4477 10.4477 13 11 13C11.5523 13 12 13.4477 12 14V17Z"
      fill="#050038"
    />
    <path
      d="M20 14C20 13.4477 20.4477 13 21 13H25C25.5523 13 26 13.4477 26 14V22C26 22.5523 25.5523 23 25 23H21C20.4477 23 20 22.5523 20 22C20 21.4477 20.4477 21 21 21H24V19H21C20.4477 19 20 18.5523 20 18C20 17.4477 20.4477 17 21 17H24V15H21C20.4477 15 20 14.5523 20 14Z"
      fill="#050038"
    />
  </svg>
);
const ItalicIcon = () => (
  <svg
    width="25"
    height="24"
    viewBox="0 0 25 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M8.38197 18L14.382 6H11.5C10.9477 6 10.5 5.55228 10.5 5C10.5 4.44772 10.9477 4 11.5 4H19.5C20.0523 4 20.5 4.44772 20.5 5C20.5 5.55228 20.0523 6 19.5 6H16.618L10.618 18H13.5C14.0523 18 14.5 18.4477 14.5 19C14.5 19.5523 14.0523 20 13.5 20H5.5C4.94772 20 4.5 19.5523 4.5 19C4.5 18.4477 4.94772 18 5.5 18H8.38197Z"
      fill="#050038"
    />
  </svg>
);
const BoldIcon = () => (
  <svg
    width="25"
    height="24"
    viewBox="0 0 25 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M19.5 15C19.5 17.7614 17.2614 20 14.5 20H8.5C7.94772 20 7.5 19.5523 7.5 19V5C7.5 4.44772 7.94772 4 8.5 4H14C16.4853 4 18.5 6.01472 18.5 8.5C18.5 9.4786 18.1876 10.3842 17.6572 11.1226C18.7818 12.0395 19.5 13.4359 19.5 15ZM10.5 10H14C14.8284 10 15.5 9.32843 15.5 8.5C15.5 7.67157 14.8284 7 14 7H10.5V10ZM10.5 17V13H14.5C15.6046 13 16.5 13.8954 16.5 15C16.5 16.1046 15.6046 17 14.5 17H10.5Z"
      fill="#050038"
    />
  </svg>
);
const ArrowLeft = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="feather feather-arrow-left"
  >
    <line x1="19" y1="12" x2="5" y2="12"></line>
    <polyline points="12 19 5 12 12 5"></polyline>
  </svg>
);
const ArrowRight = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="feather feather-arrow-right"
  >
    <line x1="5" y1="12" x2="19" y2="12"></line>
    <polyline points="12 5 19 12 12 19"></polyline>
  </svg>
);
const CodeIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="feather feather-code"
  >
    <polyline points="16 18 22 12 16 6"></polyline>
    <polyline points="8 6 2 12 8 18"></polyline>
  </svg>
);
const LinkIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="feather feather-link-2"
  >
    <path d="M15 7h3a5 5 0 0 1 5 5 5 5 0 0 1-5 5h-3m-6 0H6a5 5 0 0 1-5-5 5 5 0 0 1 5-5h3"></path>
    <line x1="8" y1="12" x2="16" y2="12"></line>
  </svg>
);

export const defaultIcons = {
  H1Icon,
  H2Icon,
  H3Icon,
  LinkIcon,
  BoldIcon,
  CodeIcon,
  ItalicIcon,
  ArrowLeft,
  ArrowRight,
};
