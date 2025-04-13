export function fromSearchParams(request: Request, {paramName}: {paramName: string}): string | null {
    const searchParams = new URL(request.url).searchParams;
    if (!searchParams.has(paramName)) {
        return null;
    }
    return searchParams.get(paramName);
}