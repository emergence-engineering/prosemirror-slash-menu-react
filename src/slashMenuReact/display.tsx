import React, { FC, ReactNode, useEffect, useMemo, useRef } from "react";
import { EditorState } from "prosemirror-state";
import {
  SlashMenuKey,
  dispatchWithMeta,
  getElementById,
  SlashMetaTypes,
} from "prosemirror-slash-menu";
import { getElements } from "./utils";
import { EditorView } from "prosemirror-view";
import { usePopper } from "react-popper";
import { ListItem } from "./ListItem";
import "./styles/menu-style.css";
import { defaultIcons } from "./defaults";

export interface SlashMenuProps {
  editorState: EditorState;
  editorView: EditorView;
  icons?: {
    [key: string]: FC;
  };
  subMenuIcon?: ReactNode;
}

export const SlashMenuReact: FC<SlashMenuProps> = ({
  editorState,
  editorView,
  icons,
  subMenuIcon,
}) => {
  const menuState = useMemo(() => {
    if (!editorState) return;
    return SlashMenuKey.getState(editorState);
  }, [editorState]);
  const elements = useMemo(() => {
    if (!menuState) return;
    return getElements(menuState);
  }, [menuState]);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!rootRef) return;
    const outsideClickHandler = (event: MouseEvent) => {
      if (
        rootRef.current &&
        (!event.target ||
          !(event.target instanceof Node) ||
          !rootRef.current.contains(event?.target))
      ) {
        dispatchWithMeta(editorView, SlashMenuKey, {
          type: SlashMetaTypes.close,
        });
      }
    };
    document.addEventListener("mousedown", outsideClickHandler);
    return () => {
      document.removeEventListener("mousedown", outsideClickHandler);
    };
  }, [rootRef]);

  const [popperElement, setPopperElement] = React.useState(null);
  const virtualReference = useMemo(() => {
    const domNode = editorView.domAtPos(editorState.selection.to)?.node;
    const cursorLeft = editorView.coordsAtPos(editorState.selection.to).left;
    if (!(domNode instanceof HTMLElement)) return;
    const { top, height } = domNode.getBoundingClientRect();

    return {
      getBoundingClientRect() {
        return {
          top: top,
          right: cursorLeft,
          bottom: top,
          left: cursorLeft,
          width: 0,
          height: height,
          x: cursorLeft,
          y: top,
          toJSON: () =>
            JSON.stringify({
              top: top,
              right: cursorLeft,
              bottom: top,
              left: cursorLeft,
              width: 0,
              height: height,
              x: cursorLeft,
              y: top,
            }),
        };
      },
    };
  }, [editorState, window.scrollY]);

  const { styles, attributes } = usePopper(virtualReference, popperElement, {
    modifiers: [
      { name: "flip", enabled: true },
      {
        name: "preventOverflow",
        options: {
          mainAxis: false,
        },
      },
    ],
  });

  useEffect(() => {
    if (!menuState) return;
    const element = document.getElementById(menuState.selected);

    if (!element || !rootRef.current) return;
    const isTopElement =
      menuState.selected === menuState.filteredElements[0].id;
    if (isTopElement) {
      rootRef.current.scrollTop = 0;
      return;
    }
    const height =
      element.clientHeight +
      parseInt(
        window.getComputedStyle(element).getPropertyValue("margin-top")
      ) +
      parseInt(
        window.getComputedStyle(element).getPropertyValue("margin-bottom")
      ) +
      parseInt(
        window.getComputedStyle(element).getPropertyValue("padding-top")
      ) +
      parseInt(
        window.getComputedStyle(element).getPropertyValue("padding-bottom")
      );

    const { bottom, top } = element.getBoundingClientRect();
    const containerRect = rootRef.current.getBoundingClientRect();
    const scrollUp = top - height < containerRect.top;
    const visible = scrollUp
      ? top - containerRect.top > height
      : !(bottom > containerRect.bottom);
    if (!visible) {
      if (scrollUp) {
        rootRef.current.scrollTop = element.offsetTop - height / 2;
      } else {
        rootRef.current.scrollTop =
          element.offsetTop - containerRect.height + height + height / 4;
      }
    }
  }, [menuState]);

  useEffect(() => {
    if (rootRef.current === null) {
      return;
    }
    rootRef.current.scrollTop = 0;
  }, [menuState?.filteredElements]);
  const subMenuLabel = useMemo(() => {
    if (menuState?.subMenuId) {
      return getElementById(menuState.subMenuId, menuState)?.label;
    }
  }, [menuState]);

  return (
    <>
      {menuState?.open ? (
        <div
          // @ts-ignore
          ref={setPopperElement}
          style={{
            ...styles.popper,
          }}
          {...attributes.popper}
        >
          {menuState.filter ? (
            <div className={"menu-filter-wrapper"}>
              <div id={"menu-filter"} className={"menu-filter"}>
                {menuState.filter}
              </div>
            </div>
          ) : null}

          <div
            id={"slashDisplay"}
            ref={rootRef}
            className={"menu-display-root"}
          >
            {menuState.subMenuId ? (
              <div className={"menu-element-wrapper"}>
                <div className={"menu-element-icon"}>
                  {subMenuIcon || defaultIcons.ArrowLeft()}
                </div>
                <div className={"submenu-label"}>{subMenuLabel}</div>
              </div>
            ) : null}
            {elements?.map((el, idx) => (
              <ListItem
                key={el.id}
                menuState={menuState}
                id={el.id}
                Icon={icons?.[el.id]}
                idx={idx}
                label={el.label}
              />
            ))}
            {elements?.length === 0 ? (
              <div className={"menu-placeholder"}>No matching items</div>
            ) : null}
          </div>
        </div>
      ) : null}
    </>
  );
};
