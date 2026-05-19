type GraphQLVariables = Record<string, unknown>;

type GraphQLResponse<TData> = {
  data?: TData;
  errors?: Array<{ message: string }>;
};

type WordPressRequestOptions = {
  revalidate?: number;
};

const DEFAULT_REVALIDATE_SECONDS = 300;

export async function wpClient<TData, TVariables extends GraphQLVariables = GraphQLVariables>(
  query: string,
  variables?: TVariables,
  options: WordPressRequestOptions = {},
) {
  const apiUrl = process.env.NEXT_PUBLIC_WORDPRESS_API_URL;

  if (!apiUrl) {
    return null;
  }

  let endpoint: URL;

  try {
    endpoint = new URL(apiUrl);
  } catch {
    return null;
  }

  endpoint.searchParams.set("query", query);

  if (variables && Object.keys(variables).length > 0) {
    endpoint.searchParams.set("variables", JSON.stringify(variables));
  }

  try {
    const response = await fetch(endpoint.toString(), {
      headers: {
        Accept: "application/json",
      },
      next: {
        revalidate: options.revalidate ?? DEFAULT_REVALIDATE_SECONDS,
      },
    });

    if (!response.ok) {
      console.error(`WordPress request failed with status ${response.status}`);
      return null;
    }

    const payload = (await response.json()) as GraphQLResponse<TData>;

    if (payload.errors?.length || !payload.data) {
      console.error("WordPress GraphQL returned errors", payload.errors);
      return null;
    }

    return payload.data;
  } catch (error) {
    console.error("WordPress request error", error);
    return null;
  }
}