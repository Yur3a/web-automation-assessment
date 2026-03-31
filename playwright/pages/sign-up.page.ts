import type { Locator, Page } from "@playwright/test";
import type { SignUpUserData } from "../support/types";
import { BasePage } from "./base.page";

export class SignUpPage extends BasePage {
    readonly heading: Locator;
    readonly firstNameInput: Locator;
    readonly lastNameInput: Locator;
    readonly usernameInput: Locator;
    readonly passwordInput: Locator;
    readonly confirmPasswordInput: Locator;
    readonly submitButton: Locator;
    readonly firstNameHelperText: Locator;
    readonly lastNameHelperText: Locator;
    readonly usernameHelperText: Locator;
    readonly passwordHelperText: Locator;
    readonly confirmPasswordHelperText: Locator;

    constructor(page: Page) {
        super(page);

        this.heading = page.getByRole("heading", { name: "Sign Up" });
        this.firstNameInput = this.inputByTestId("signup-first-name");
        this.lastNameInput = this.inputByTestId("signup-last-name");
        this.usernameInput = this.inputByTestId("signup-username");
        this.passwordInput = this.inputByTestId("signup-password");
        this.confirmPasswordInput = this.inputByTestId("signup-confirmPassword");
        this.submitButton = page.getByRole("button", { name: "Sign Up" });
        this.firstNameHelperText = page.locator("#firstName-helper-text");
        this.lastNameHelperText = page.locator("#lastName-helper-text");
        this.usernameHelperText = page.locator("#username-helper-text");
        this.passwordHelperText = page.locator("#password-helper-text");
        this.confirmPasswordHelperText = page.locator("#confirmPassword-helper-text");
    }

    async goto(): Promise<void> {
        await this.page.goto("/signup");
    }

    async fillForm(user: SignUpUserData): Promise<void> {
        await this.firstNameInput.fill(user.firstName);
        await this.lastNameInput.fill(user.lastName);
        await this.usernameInput.fill(user.username);
        await this.passwordInput.fill(user.password);
        await this.confirmPasswordInput.fill(user.confirmPassword);
    }

    async submit(): Promise<void> {
        await this.submitButton.click();
    }
}