// @ts-check

import Heading from "device-agnostic-ui/Heading.mjs";
import Html from "device-agnostic-ui/Html.mjs";
import LinkText from "device-agnostic-ui/LinkText.mjs";
import ListUnordered from "device-agnostic-ui/ListUnordered.mjs";
import Margin from "device-agnostic-ui/Margin.mjs";
import Para from "device-agnostic-ui/Para.mjs";
import useAutoLoad from "graphql-react/useAutoLoad.mjs";
import useCacheEntry from "graphql-react/useCacheEntry.mjs";
import useWaterfallLoad from "graphql-react/useWaterfallLoad.mjs";
import { createElement as h, Fragment, useCallback } from "react";
import useOnClickRouteLink from "ruck/useOnClickRouteLink.mjs";

import useDescription from "../hooks/useDescription.mjs";
import useLoadGithubApi from "../hooks/useLoadGithubApi.mjs";
import useTitle from "../hooks/useTitle.mjs";
import FormattedDate from "./FormattedDate.mjs";
import PageCache, { css as cssPageCache } from "./PageCache.mjs";
import PageHeader, { css as cssPageHeader } from "./PageHeader.mjs";
import Section, { css as cssSection } from "./Section.mjs";

/** @type {import("ruck/routeDetailsForContentWithCss.mjs").RouteContentWithCss["css"]} */
export const css = new Set([
  "https://unpkg.com/device-agnostic-ui@10.0.0/Blockquote.css",
  "https://unpkg.com/device-agnostic-ui@10.0.0/Code.css",
  "https://unpkg.com/device-agnostic-ui@10.0.0/Heading.css",
  "https://unpkg.com/device-agnostic-ui@10.0.0/Html.css",
  "https://unpkg.com/device-agnostic-ui@10.0.0/LinkText.css",
  "https://unpkg.com/device-agnostic-ui@10.0.0/ListOrdered.css",
  "https://unpkg.com/device-agnostic-ui@10.0.0/ListUnordered.css",
  "https://unpkg.com/device-agnostic-ui@10.0.0/Margin.css",
  "https://unpkg.com/device-agnostic-ui@10.0.0/Para.css",
  "https://unpkg.com/device-agnostic-ui@10.0.0/Pre.css",
  "https://unpkg.com/device-agnostic-ui@10.0.0/Table.css",
  ...cssPageCache,
  ...cssPageHeader,
  ...cssSection,
]);

const cacheKey = "PageReleases_github_repo_releases";
const query = /* GraphQL */ `query ($repoOwner: String!, $repoName: String!) {
  repository(owner: $repoOwner, name: $repoName) {
    releases(
      orderBy: {
        field: CREATED_AT,
        direction: DESC
      },
      first: 100
    ) {
      nodes {
        url
        publishedAt
        tagName
        descriptionHTML
      }
    }
  }
}`;

/**
 * @typedef {{
 *   repository: {
 *     releases: {
 *       nodes: Array<{
 *         url: string,
 *         publishedAt: string,
 *         tagName: string,
 *         descriptionHTML: string
 *       }>
 *     }
 *   }
 * }} GithubQueryData
 */

/** React component for the releases page. */
export default function PageReleases() {
  useTitle("Releases");
  useDescription("Changelog for Ruck versions that have been released.");

  const cacheValue =
    /**
     * @type {{
     *   errors?: Array<object>,
     *   data?: GithubQueryData
     * } | undefined}
     */
    (useCacheEntry(cacheKey));

  const loadGithubApi = useLoadGithubApi();
  const load = useCallback(
    () =>
      loadGithubApi(cacheKey, {
        query,
        variables: {
          repoOwner: "jaydenseric",
          repoName: "ruck",
        },
      }),
    [cacheKey, loadGithubApi],
  );

  useAutoLoad(cacheKey, load);

  const isWaterfallLoading = useWaterfallLoad(cacheKey, load);

  const onClickRouteLink = useOnClickRouteLink();

  return isWaterfallLoading ? null : h(PageCache, {
    cacheValue: cacheValue,
    renderData(/** @type {GithubQueryData} */ data) {
      return h(
        Fragment,
        null,
        h(
          PageHeader,
          {
            headingChildren: "Ruck releases",
          },
          h(
            Para,
            {
              style: {
                fontSize: "1.75rem",
              },
            },
            "Releases respect ",
            h(LinkText, { href: "https://semver.org" }, "semantic versioning"),
            ".",
          ),
        ),
        ...data.repository.releases.nodes.map((release) =>
          h(
            Section,
            {
              headerChildren: h(
                Heading,
                {
                  level: 2,
                  size: 2,
                },
                h(
                  LinkText,
                  {
                    href: `/releases/${release.tagName}`,
                    onClick: onClickRouteLink,
                  },
                  release.tagName,
                ),
              ),
            },
            h(
              Margin,
              null,
              h(
                Para,
                null,
                "Published ",
                h(FormattedDate, { datetime: release.publishedAt }),
                ".",
              ),
              h(
                ListUnordered,
                null,
                h(
                  "li",
                  null,
                  h(LinkText, { href: release.url }, "GitHub release"),
                ),
                h(
                  "li",
                  null,
                  h(LinkText, {
                    href: `https://deno.land/x/ruck@${release.tagName}`,
                  }, "Deno CDN"),
                ),
              ),
              h(Html, {
                style: {
                  // @ts-ignore This is a problem with React’s types.
                  "--daui-h1-font-size": "calc(150% + 1.5vw)",
                  "--daui-h2-font-size": "calc(130% + 0.75vw)",
                  "--daui-h3-font-size": "calc(120% + 0.3vw)",
                  "--daui-h4-font-size": "calc(110% + 0.15vw)",
                  "--daui-h5-font-size": "100%",
                },
                dangerouslySetInnerHTML: { __html: release.descriptionHTML },
              }),
            ),
          )
        ),
      );
    },
  });
}
