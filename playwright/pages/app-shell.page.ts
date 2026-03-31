import type { Locator, Page } from "@playwright/test";
import { BasePage } from "./base.page";

export class AppShellPage extends BasePage {
    readonly transactionList: Locator;
    readonly listSkeleton: Locator;
    readonly notificationsCount: Locator;
    readonly sideNavToggle: Locator;
    readonly sideNavSignOut: Locator;

    constructor(page: Page) {
        super(page);

        this.transactionList = this.byTestId("transaction-list");
        this.listSkeleton = this.byTestId("list-skeleton");
        this.notificationsCount = this.byTestId("nav-top-notifications-count");
        this.sideNavToggle = this.byTestId("sidenav-toggle");
        this.sideNavSignOut = this.byTestId("sidenav-signout");
    }

    async signOut(): Promise<void> {
        if (!(await this.sideNavSignOut.isVisible()) && (await this.sideNavToggle.isVisible())) {
            await this.sideNavToggle.click();
        }

        await this.sideNavSignOut.click();
    }
}