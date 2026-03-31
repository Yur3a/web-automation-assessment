import type { Page, Response } from "@playwright/test";

interface GraphQLOperationPayload {
    operationName?: string;
}

export function currentPathname(page: Page): string {
    return new URL(page.url()).pathname;
}

export function isApiResponse(response: Response, pathname: string, method: string): boolean {
    return new URL(response.url()).pathname === pathname && response.request().method() === method;
}

export function isGraphQLOperationResponse(response: Response, operationName: string): boolean {
    if (!isApiResponse(response, "/graphql", "POST")) {
        return false;
    }

    try {
        const payload = response.request().postDataJSON() as GraphQLOperationPayload | undefined;
        return payload?.operationName === operationName;
    } catch {
        return false;
    }
}