import type { Locator, Page } from "@playwright/test";
import type { Credentials } from "../support/types";
import { BasePage } from "./base.page";

export class SignInPage extends BasePage {
    readonly heading: Locator;
    readonly usernameInput: Locator;
    readonly passwordInput: Locator;
    readonly rememberMeCheckbox: Locator;
    readonly submitButton: Locator;
    readonly signUpLink: Locator;
    readonly errorMessage: Locator;
    readonly usernameHelperText: Locator;
    readonly passwordHelperText: Locator;

    constructor(page: Page) {
        super(page);

        this.heading = page.getByRole("heading", { name: "Sign in" });
        this.usernameInput = this.inputByTestId("signin-username");
        this.passwordInput = this.inputByTestId("signin-password");
        this.rememberMeCheckbox = this.byTestId("signin-remember-me").locator("input");
        this.submitButton = page.getByRole("button", { name: "Sign In" });
        this.signUpLink = this.byTestId("signup");
        this.errorMessage = this.byTestId("signin-error");
        this.usernameHelperText = page.locator("#username-helper-text");
        this.passwordHelperText = page.locator("#password-helper-text");
    }

    async goto(): Promise<void> {
        await this.page.goto("/signin");
    }

    async fillCredentials({ username, password }: Credentials): Promise<void> {
        await this.usernameInput.fill(username);
        await this.passwordInput.fill(password);
    }

    async enableRememberMe(): Promise<void> {
        await this.rememberMeCheckbox.check();
    }

    async submit(): Promise<void> {
        await this.submitButton.click();
    }

    async clickSignUp(): Promise<void> {
        await this.signUpLink.click();
    }
}