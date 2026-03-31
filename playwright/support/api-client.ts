import type { APIRequestContext, APIResponse } from "@playwright/test";
import { API_BASE_URL } from "./config";
import type { TestUser, UsersResponse } from "./types";

export class TestDataApi {
    constructor(private readonly request: APIRequestContext) { }

    private async ensureOk(response: APIResponse, action: string): Promise<void> {
        if (response.ok()) {
            return;
        }

        const body = await response.text();
        throw new Error(`${action} failed with status ${response.status()}: ${body}`);
    }

    async seedDatabase(): Promise<void> {
        const response = await this.request.post(`${API_BASE_URL}/testData/seed`);
        await this.ensureOk(response, "Database seed");
    }

    async getUsers(): Promise<TestUser[]> {
        const response = await this.request.get(`${API_BASE_URL}/testData/users`);
        await this.ensureOk(response, "Fetch users");

        const body = (await response.json()) as UsersResponse;
        return body.results;
    }

    async getFirstUser(): Promise<TestUser> {
        const [firstUser] = await this.getUsers();

        if (!firstUser) {
            throw new Error("The seeded database did not return any users.");
        }

        return firstUser;
    }
}