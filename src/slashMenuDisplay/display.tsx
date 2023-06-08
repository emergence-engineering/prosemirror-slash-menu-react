import React, { FC, useEffect, useMemo, useRef, useState } from "react";
import { EditorState } from "prosemirror-state";
import * as slashMenu from "prosemirror-slash-menu";
import {
  SlashMenuKey,
  dispatchWithMeta,
  getElementById,
  SlashMetaTypes,
} from "prosemirror-slash-menu";
import { getElements } from "./utils";
import { EditorView } from "prosemirror-view";
import { usePopper } from "react-popper";
import { detectOverflow, ModifierArguments, Options } from "@popperjs/core";
import { ArrowLeft } from "./icons/defaultIcons";
import { ListItem } from "./ListItem";

export interface SlashMenuDisplayConfig {
  height: number;
  minHeight: number;
  overflowPadding: number;
}

export interface SlashMenuProps {
  editorState: EditorState;
  editorView: EditorView;
  config: SlashMenuDisplayConfig;
  icons?: {
    [key: string]: FC;
  };
}

export const SlashMenuDisplay: FC<SlashMenuProps> = ({
  editorState,
  editorView,
  config,
  icons,
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
  console.log({ SlashMetaTypes, slashMenu });
  useEffect(() => {
    if (!rootRef) return;
    const outsideClickHandler = (event: MouseEvent) => {
      console.log({ SlashMetaTypes });
      if (
        rootRef.current &&
        (!event.target ||
          !(event.target instanceof Node) ||
          !rootRef.current.contains(event.target))
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
  const [menuHeight, setMenuHeight] = useState(config.height);
  const [shouldFlip, setShouldFlip] = useState(false);
  const heightModifier = useMemo(() => {
    return {
      name: "heightModifier",
      enabled: true,
      phase: "main",
      requiresIfExists: ["offset"],
      fn(props: ModifierArguments<Options>) {
        const { state } = props;
        const overflow = detectOverflow(state);
        if (menuHeight < config.minHeight) {
          setShouldFlip(true);
          setMenuHeight(config.height);
          return;
        }
        if (overflow.bottom + config.overflowPadding > 0 && !shouldFlip) {
          const newMenuHeight =
            config.height - config.overflowPadding - overflow.bottom;
          setMenuHeight(newMenuHeight);
          return;
        }
        if (menuHeight < config.height) {
          setMenuHeight(config.height);
          return;
        }
        if (overflow.bottom < -config.minHeight) {
          setShouldFlip(false);
          setMenuHeight(config.height);
          return;
        }
        return;
      },
    };
  }, [config, menuHeight, shouldFlip]);
  const [popperElement, setPopperElement] = React.useState(null);
  const flipModifier = useMemo(() => {
    return { name: "flip", enabled: shouldFlip };
  }, [shouldFlip]);
  const virtualReference = useMemo(() => {
    const domNode = editorView.domAtPos(editorState.selection.to)?.node;
    if (!(domNode instanceof HTMLElement)) return;
    const { top, left, height } = domNode.getBoundingClientRect();
    return {
      getBoundingClientRect() {
        return {
          top: top,
          right: left,
          bottom: top,
          left: left,
          width: 0,
          height: height,
          x: left,
          y: top,
          // TODO missing toJSON causes type error do we really need this?
          toJSON: () =>
            JSON.stringify({
              top: top,
              right: left,
              bottom: top,
              left: left,
              width: 0,
              height: height,
              x: left,
              y: top,
            }),
        };
      },
    };
  }, [editorState, window.scrollY]);

  const { styles, attributes } = usePopper(virtualReference, popperElement, {
    modifiers: [
      flipModifier,
      heightModifier,
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
        window.getComputedStyle(element).getPropertyValue("margin-top"),
      ) +
      parseInt(
        window.getComputedStyle(element).getPropertyValue("margin-bottom"),
      ) +
      parseInt(
        window.getComputedStyle(element).getPropertyValue("padding-top"),
      ) +
      parseInt(
        window.getComputedStyle(element).getPropertyValue("padding-bottom"),
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
          //TODO Ts fix, might not be possible, popper is missing its typing I think
          // @ts-ignore
          ref={setPopperElement}
          style={{
            ...styles.popper,
            height: config.height,
            padding: "0.5rem",
          }}
          {...attributes.popper}
        >
          {menuState.filter ? (
            <div className={"menu-filter-wrapper"}>
              <div id={"menu-filter"} className={"menu-filter "}>
                {menuState.filter}
              </div>
            </div>
          ) : null}

          <div
            id={"slashDisplay"}
            ref={rootRef}
            className={"menu-display-root"}
            style={{
              height: menuHeight,
            }}
          >
            {menuState.subMenuId ? (
              <div className={"menu-element-wrapper"}>
                <div className={"menu-element-icon"}>
                  <ArrowLeft />
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
              <div className={"menu-placeholder"}>No Matching items</div>
            ) : null}
          </div>
        </div>
      ) : null}
    </>
  );
};
