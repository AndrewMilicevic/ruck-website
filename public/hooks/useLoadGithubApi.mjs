import ACCESS_TOKEN_GITHUB from "env/ACCESS_TOKEN_GITHUB.mjs";
import useLoadGraphQL from "graphql-react/useLoadGraphQL.mjs";
import { useCallback } from "react";

/** A React hook for using a loader to query the GitHub GraphQL API. */
export default function useLoadGithubApi() {
  const loadGraphQL = useLoadGraphQL();

  return useCallback(
    (cacheKey, graphqlOperation) =>
      loadGraphQL(cacheKey, "https://api.github.com/graphql", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${ACCESS_TOKEN_GITHUB}`,
        },
        body: JSON.stringify(graphqlOperation),
      }),
    [loadGraphQL],
  );
}
