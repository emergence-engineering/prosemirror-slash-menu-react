import React, {
  FC,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from "react";
import { EditorState } from "prosemirror-state";
import {
  dispatchWithMeta,
  getElementById,
  MenuElement,
  SlashMenuKey,
  SlashMetaTypes,
} from "prosemirror-slash-menu";
import { EditorView } from "prosemirror-view";
import { usePopper } from "react-popper";
import { ListItem } from "./ListItem";
import "./styles/menu-style.css";
import { defaultIcons } from "./defaults";

export enum Placement {
  auto = "auto",
  autoStart = "auto-start",
  autoEnd = "auto-end",
  top = "top",
  topStart = "top-start",
  topEnd = "top-end",
  bottom = "bottom",
  bottomStart = "bottom-start",
  bottomEnd = "bottom-end",
  right = "right",
  rightStart = "right-start",
  rightEnd = "right-end",
  left = "left",
  leftStart = "left-start",
  leftEnd = "left-end",
}

export interface PopperOptions {
  placement: Placement;
  offsetModifier: { name: string; options: { offset: number[] } };
}

export interface SlashMenuProps {
  editorState: EditorState;
  editorView: EditorView;
  icons?: {
    [key: string]: FC;
  };
  rightIcons?: {
    [key: string]: FC;
  };
  subMenuIcon?: ReactNode;
  filterFieldIcon?: ReactNode;
  filterPlaceHolder?: string;
  mainMenuLabel?: string;
  popperReference?: HTMLElement;
  popperOptions?: PopperOptions;
  clickable?: boolean;
  disableInput?: boolean;
  emptySearchComponent?: ReactNode;
}

export const SlashMenuReact: FC<SlashMenuProps> = ({
  editorState,
  editorView,
  icons,
  rightIcons,
  subMenuIcon,
  filterFieldIcon,
  filterPlaceHolder,
  mainMenuLabel,
  popperReference,
  popperOptions,
  clickable,
  disableInput,
  emptySearchComponent,
}) => {
  const menuState = useMemo(() => {
    if (!editorState) return;

    return SlashMenuKey.getState(editorState);
  }, [editorState]);
  const elements = useMemo(() => {
    if (!menuState) return;

    return menuState.filteredElements;
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
    const cursorPosition = editorView.state.selection.to;
    const cursorLeft = editorView.coordsAtPos(cursorPosition).left;

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
  }, [editorView, editorState, window.scrollY]);

  const offsetModifier = useMemo(() => {
    return {
      name: "offset",
      options: {
        offset: [0, 36],
      },
    };
  }, [popperReference]);

  const { styles, attributes } = usePopper(
    popperReference || virtualReference,
    popperElement,
    {
      placement: popperOptions?.placement
        ? popperOptions.placement
        : Placement.bottomStart,
      modifiers: [
        { name: "flip", enabled: true },
        {
          name: "preventOverflow",
        },
        popperOptions?.offsetModifier
          ? popperOptions.offsetModifier
          : offsetModifier,
      ],
    }
  );

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

  const closeSubMenu = useCallback(() => {
    if (menuState?.subMenuId) {
      dispatchWithMeta(editorView, SlashMenuKey, {
        type: SlashMetaTypes.closeSubMenu,
        element: getElementById(menuState.subMenuId, menuState),
      });
    }
  }, [menuState]);

  // These two useEffects prevent a bug where the user navigates with clicks, which then blurs the editor and key presses stop working
  useEffect(() => {
    editorView.focus();
  }, [menuState?.open]);
  useEffect(() => {
    editorView.focus();
  }, [menuState?.subMenuId]);

  const groups = useMemo(() => {
    if (!elements) {
      return;
    }

    return elements.reduce((acc, el) => {
      if (el.group) {
        acc[el.group] = acc[el.group] || [];
        acc[el.group].push(el);
      } else {
        acc[""] = acc[""] || [];
        acc[""].push(el);
      }
      return acc;
    }, {} as { [key: string]: MenuElement[] });
  }, [elements]);

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
          {disableInput ? null : menuState.filter ? (
            <div className={"menu-filter-wrapper"}>
              {filterFieldIcon ? (
                <div className={"menu-filter-icon"}>{filterFieldIcon}</div>
              ) : null}
              <div id={"menu-filter"} className={"menu-filter"}>
                {menuState.filter}
              </div>
            </div>
          ) : (
            <div className={"menu-filter-wrapper"}>
              {filterFieldIcon ? (
                <div className={"menu-filter-icon"}>{filterFieldIcon}</div>
              ) : null}
              <div className={"menu-filter-placeholder"}>
                {filterPlaceHolder}
              </div>
            </div>
          )}

          <div
            id={"slashDisplay"}
            ref={rootRef}
            className={"menu-display-root"}
          >
            {menuState.subMenuId ? (
              <div
                className={"menu-element-wrapper"}
                onClick={clickable ? closeSubMenu : undefined}
                style={{ cursor: clickable ? "pointer" : undefined }}
              >
                <div className={"menu-element-icon-left"}>
                  {subMenuIcon || defaultIcons.ArrowLeft()}
                </div>
                <div className={"submenu-label"}>{subMenuLabel}</div>
              </div>
            ) : null}
            {!menuState.subMenuId && mainMenuLabel ? (
              <div className={"menu-element-wrapper"}>
                <div className={"submenu-label"}>{mainMenuLabel}</div>
              </div>
            ) : null}
            {groups && Object.keys(groups)?.length > 1
              ? Object.keys(groups).map((group, x) => {
                  return (
                    <div key={x} className="group-wrapper">
                      <div className="group-label">{group}</div>
                      {groups?.[group].map((el: MenuElement, idx: number) => (
                        <ListItem
                          key={el.id}
                          menuState={menuState}
                          Icon={icons?.[el.id]}
                          RightIcon={rightIcons?.[el.id]}
                          idx={idx}
                          clickable={clickable}
                          el={el}
                          view={editorView}
                        />
                      ))}
                    </div>
                  );
                })
              : elements?.map((el: MenuElement, idx: number) => (
                  <ListItem
                    key={el.id}
                    menuState={menuState}
                    Icon={icons?.[el.id]}
                    RightIcon={rightIcons?.[el.id]}
                    idx={idx}
                    clickable={clickable}
                    el={el}
                    view={editorView}
                  />
                ))}
            {elements?.length === 0
              ? emptySearchComponent || (
                  <div className={"menu-placeholder"}>No matching items</div>
                )
              : null}
          </div>
        </div>
      ) : null}
    </>
  );
};
