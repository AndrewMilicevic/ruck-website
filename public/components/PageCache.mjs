// @ts-check

import Loading, { css as cssLoading } from "device-agnostic-ui/Loading.mjs";
import Margin, { css as cssMargin } from "device-agnostic-ui/Margin.mjs";
import { createElement as h } from "react";

import ErrorMessageLoading, {
  css as cssErrorMessageLoading,
} from "./ErrorMessageLoading.mjs";

/** @type {import("ruck/routeDetailsForContentWithCss.mjs").RouteContentWithCss["css"]} */
export const css = new Set([
  ...cssLoading,
  ...cssMargin,
  ...cssErrorMessageLoading,
]);

/**
 * React component for rendering page cache with loading, error, or data state.
 * @param {object} props Props.
 * @param {{
 *   errors?: Array<object>,
 *   data?: any
 * }} [props.cacheValue] Cache value.
 * @param {function} props.renderData Renders the data.
 */
export default function PageCache({
  cacheValue: { errors, data } = {},
  renderData,
}) {
  return errors
    ? h(ErrorMessageLoading, null)
    : data
    ? renderData(data)
    : h(Margin, null, h(Loading, { size: "2em" }));
}
