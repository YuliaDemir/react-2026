export const getPageFromSearchParams = (searchParams: URLSearchParams) => {
    const page = Number(searchParams.get('page'));

    if (!Number.isInteger(page) || page < 1) {
        return 1;
    }

    return page;
};