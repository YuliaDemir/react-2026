export function getToForLink(id?: number, page?: number) {

    const searchParams = new URLSearchParams(window.location.search);

    if (id) {
        searchParams.set('details', String(id));
    }
    else {
        searchParams.delete('details');
    }

    if (page) {
        searchParams.set('page', String(page));
    }

    const to = {
        pathname: location.pathname,
        search: searchParams.toString(),
    };

    return to;
}