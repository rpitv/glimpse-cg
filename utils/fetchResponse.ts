export function fetchSuccess() {
    return { code: 200, body: "SUCCESS" };
}

export function fetchError(e: any) {
    return { code: 404, body: `Error, something unexpected happened while fetching: ${e}`}
}