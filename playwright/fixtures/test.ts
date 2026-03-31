import { test as base, expect } from "@playwright/test";
import { AppShellPage } from "../pages/app-shell.page";
import { SignInPage } from "../pages/sign-in.page";
import { SignUpPage } from "../pages/sign-up.page";
import { UserOnboardingDialogPage } from "../pages/user-onboarding-dialog.page";
import { TestDataApi } from "../support/api-client";
import { currentPathname, isApiResponse } from "../support/utils";
import { createSignUpUser, onboardingBankAccount } from "../support/test-data";
import type {
    BankAccountDetails,
    Credentials,
    LoginOptions,
    SignUpUserData,
    TestUser,
} from "../support/types";

type PlaywrightFixtures = {
    api: TestDataApi;
    dbSeed: void;
    firstUser: TestUser;
    newUser: SignUpUserData;
    onboardingBankAccount: BankAccountDetails;
    signInPage: SignInPage;
    signUpPage: SignUpPage;
    appShell: AppShellPage;
    onboardingDialog: UserOnboardingDialogPage;
    loginAs: (credentials: Credentials, options?: LoginOptions) => Promise<void>;
};

export const test = base.extend<PlaywrightFixtures>({
    api: async ({ request }, use) => {
        await use(new TestDataApi(request));
    },

    dbSeed: [
        async ({ api }, use) => {
            await api.seedDatabase();
            await use();
        },
        { auto: true },
    ],

    firstUser: async ({ api }, use) => {
        await use(await api.getFirstUser());
    },

    newUser: async ({ browserName: _browserName }, use, testInfo) => {
        const uniqueSeed = [testInfo.project.name, testInfo.workerIndex, testInfo.retry, Date.now()].join(
            "-"
        );
        await use(createSignUpUser(uniqueSeed));
    },

    onboardingBankAccount: async ({ browserName: _browserName }, use) => {
        await use(onboardingBankAccount);
    },

    signInPage: async ({ page }, use) => {
        await use(new SignInPage(page));
    },

    signUpPage: async ({ page }, use) => {
        await use(new SignUpPage(page));
    },

    appShell: async ({ page }, use) => {
        await use(new AppShellPage(page));
    },

    onboardingDialog: async ({ page }, use) => {
        await use(new UserOnboardingDialogPage(page));
    },

    loginAs: async ({ page, signInPage }, use) => {
        await use(async (credentials, options = {}) => {
            const expectSuccess = options.expectSuccess ?? true;

            if (currentPathname(page) !== "/signin") {
                await signInPage.goto();
            }

            const loginResponsePromise = page.waitForResponse((response) =>
                isApiResponse(response, "/login", "POST")
            );

            await signInPage.fillCredentials(credentials);

            if (options.rememberUser) {
                await signInPage.enableRememberMe();
            }

            await signInPage.submit();

            const loginResponse = await loginResponsePromise;

            if (expectSuccess && !loginResponse.ok()) {
                throw new Error(`Expected login to succeed, but received ${loginResponse.status()}.`);
            }
        });
    },
});

export { expect };