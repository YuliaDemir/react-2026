type GetToForLinkArg = {
    id?: number | null;
    page?: number | null;
    q?: string | null;
};

const Params = {
    id: "details",
    page: "page",
    q: "q",
} as const satisfies Record<keyof GetToForLinkArg, string>;

export function getToForLink(arg: GetToForLinkArg) {
    const searchParams = new URLSearchParams(window.location.search);

    Object.entries(arg).forEach(([key, value]) => {
        const paramName = Params[key as keyof GetToForLinkArg];

        if (
            value === undefined ||
            value === null ||
            (typeof value === "string" && !value.trim())
        ) {
            searchParams.delete(paramName);
            return;
        }

        searchParams.set(paramName, String(value).trim());
    });

    return {
        pathname: window.location.pathname,
        search: searchParams.toString(),
    };
}