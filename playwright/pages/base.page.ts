import type { Locator, Page } from "@playwright/test";

export abstract class BasePage {
    constructor(protected readonly page: Page) { }

    protected byTestId(testId: string): Locator {
        return this.page.getByTestId(testId);
    }

    protected inputByTestId(testId: string): Locator {
        return this.byTestId(testId).locator("input");
    }
}