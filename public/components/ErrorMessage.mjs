// @ts-check

import Para, { css as cssPara } from "device-agnostic-ui/Para.mjs";
import { createElement as h } from "react";

import GrumpyCat from "./GrumpyCat.mjs";
import PageHeader, { css as cssPageHeader } from "./PageHeader.mjs";

/** @type {import("ruck/routeDetailsForContentWithCss.mjs").RouteContentWithCss["css"]} */
export const css = new Set([
  ...cssPara,
  ...cssPageHeader,
]);

/**
 * React component for an error message.
 * @param {object} props Props.
 * @param {string} props.title Title.
 * @param {import("react").ReactNode} props.description Description.
 */
export default function ErrorMessage({ title, description }) {
  return h(
    PageHeader,
    { headingChildren: title },
    h(Para, null, description),
    h(GrumpyCat),
  );
}
