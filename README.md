# prosemirror-slash-menu-react

[![made by Emergence Engineering](https://emergence-engineering.com/ee-logo.svg)](https://emergence-engineering.com)

[**Made by Emergence-Engineering**](https://emergence-engineering.com/)

A UI package used together
with [prosemirror-slash-menu](https://github.com/emergence-engineering/prosemirror-slash-menu) to display the menu with
react.

By Horváth Áron & [Viktor Váczi](https://emergence-engineering.com/cv/viktor)
at [Emergence Engineering](https://emergence-engineering.com/)

Try it out at <https://emergence-engineering.com/blog/prosemirror-slash-menu>
![alt text](https://github.com/emergence-engineering/prosemirror-slash-menu-react/blob/main/public/prosemirror-slash-menu.gif?raw=true)

# Features

- Displaying `prosemirror-slash-menu` with react
- Menu positioning at the cursor position
- Displaying the menu upwards in case of overflow
- Default styling
- Custom styling with css classnames
- Optional popper reference element, placement and offset
- Outside click handling

# Behavior

You can open the menu with the `/` key in an empty paragraph or after a space and you can filter the elements just by
typing, or you can navigate with the keyboard. For exact behaviour description
checkout [prosemirror-slash-menu](https://github.com/emergence-engineering/prosemirror-slash-menu).

# Installation and Usage

Install from npm with:

`npm install prosemirror-slash-menu-react`

Usage in the app:

```tsx
import React, { useEffect, useRef, useState } from "react";
import { exampleSetup } from "prosemirror-example-setup";
import { EditorState } from "prosemirror-state";
import { EditorView } from "prosemirror-view";
import schema from "./schema";
import { SlashMenuPlugin } from "prosemirror-slash-menu";
import {
  defaultElements,
  defaultIcons,
  Icons,
  SlashMenuReact,
} from "prosemirror-slash-menu-react";

const ProseMirrorSlashMenuDemo = () => {
  const [pmState, setPmState] = useState<EditorState>();
  const [editorView, setEditorView] = useState<EditorView>();
  const editorRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!editorRef.current) return;
    const state = EditorState.create({
      doc: schema.nodeFromJSON({
        content: [
          {
            content: [
              {
                text: "Type '/' after a space to open the menu. ",
                type: "text",
              },
            ],
            type: "paragraph",
          },
        ],
        type: "doc",
      }),
      plugins: [
        SlashMenuPlugin(defaultElements),
        ...exampleSetup({
          schema,
        }),
      ],
    });
    const view: EditorView = new EditorView(editorRef.current, {
      state,
      dispatchTransaction: (tr) => {
        try {
          const newState = view.state.apply(tr);
          view.updateState(newState);
          setPmState(newState);
        } catch (e) {}
      },
    });
    setEditorView(view);
    return () => {
      view && view.destroy();
    };
  }, [editorRef]);
  return (
    <>
      <div ref={editorRef} id="editor" />
      {pmState && editorView && (
        <SlashMenuReact
          icons={{
            [Icons.HeaderMenu]: defaultIcons.H1Icon,
            [Icons.Level1]: defaultIcons.H1Icon,
            [Icons.Level2]: defaultIcons.H2Icon,
            [Icons.Level3]: defaultIcons.H3Icon,
            [Icons.Bold]: defaultIcons.BoldIcon,
            [Icons.Italic]: defaultIcons.ItalicIcon,
            [Icons.Code]: defaultIcons.CodeIcon,
            [Icons.Link]: defaultIcons.LinkIcon,
          }}
          editorState={pmState}
          editorView={editorView}
        />
      )}
    </>
  );
};
```

# Styling

To use the basic styling you can import `menu-style.css` into your project. If you want to use your own styling you can
override the following classnames.

- `menu-display-root` root div for the menu
- `menu-element-wrapper` root of menu elements
- `menu-element-wrapper-clickable` root of menu elements when the menu items are set to be clickable
- `menu-element-selected` classname that is added alongside `menu-element-wrapper` when an element is selected
- `menu-element-icon` if icon is provided for the element it's rendered in this div
- `menu-element-right-icon` if right icon is provided its rendered in this div
- `menu-element-label` label of the menu element
- `menu-placeholder` when there is no matching items for the filter, this is displayed with the text "No matching items"
- `menu-filter-wrapper` root of the filter display, positioned above the menu by default
- `menu-filter` the filter text
- `menu-filter-placeholder` placeholder text for the filter field
- `menu-filter-icon` if icon is provided for the filter field it's rendered in this div
- `submenu-label` The label of the submenu is shown above the menu elements when its opened
- `group-wrapper` wrapper around the menu elements, if there are multiple groups of elements
- `group-label` label/title of the group

# Props

- `editorState` prosemirrors editor state
- `editorView` prosemirror editor view
- `icons` Optional, if you want to provide icons for your menu elements. Type of `{[key: string]: FC}` where the key is
  the id of the menu element and the value is a `FunctionComponent` that renders the icon
- `rightIcons` Same as icons but these appear on the right on the menu element, most commonly used for indicating a
  submenu with an arrow
- `subMenuIcon` Optional icon for submenu label. By default, when a submenu is open an arrow is displayed indicating
  that the user is in a subMenu, it can be replaced with a react node of your choice
- `filterFieldIcon` Optional icon in the filter field.
- `filterPlaceHolder` Optional placeholder text for the filter field.
- `mainMenuLabel` Optional label for the main menu. By default, there is none.
- `popperReference` Optional popper reference HTMLElement, for displaying the menu next to whatever element you want
- `popperOptions` You can pass in `placement` and `offset` to position your menu around the reference Element
- `clickable` Optional boolean, if true the menu items are clickable, by default they are used only with keyboard
