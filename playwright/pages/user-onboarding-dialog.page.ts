import type { Locator, Page } from "@playwright/test";
import type { BankAccountDetails } from "../support/types";
import { BasePage } from "./base.page";

export class UserOnboardingDialogPage extends BasePage {
    readonly dialog: Locator;
    readonly title: Locator;
    readonly content: Locator;
    readonly nextButton: Locator;
    readonly bankNameInput: Locator;
    readonly routingNumberInput: Locator;
    readonly accountNumberInput: Locator;
    readonly submitButton: Locator;

    constructor(page: Page) {
        super(page);

        this.dialog = this.byTestId("user-onboarding-dialog");
        this.title = this.byTestId("user-onboarding-dialog-title");
        this.content = this.byTestId("user-onboarding-dialog-content");
        this.nextButton = this.byTestId("user-onboarding-next");
        this.bankNameInput = this.inputByTestId("bankaccount-bankName-input");
        this.routingNumberInput = this.inputByTestId("bankaccount-routingNumber-input");
        this.accountNumberInput = this.inputByTestId("bankaccount-accountNumber-input");
        this.submitButton = this.byTestId("bankaccount-submit");
    }

    async clickNext(): Promise<void> {
        await this.nextButton.click();
    }

    async fillBankAccount(details: BankAccountDetails): Promise<void> {
        await this.bankNameInput.fill(details.bankName);
        await this.accountNumberInput.fill(details.accountNumber);
        await this.routingNumberInput.fill(details.routingNumber);
    }

    async submitBankAccount(): Promise<void> {
        await this.submitButton.click();
    }
}