import { DEFAULT_USER_PASSWORD } from "./config";
import type { BankAccountDetails, SignUpUserData } from "./types";

export const onboardingBankAccount: BankAccountDetails = {
    bankName: "The Best Bank",
    routingNumber: "987654321",
    accountNumber: "123456789",
};

export function createSignUpUser(seed: string): SignUpUserData {
    const suffix = seed.replace(/[^a-z0-9]/gi, "").toLowerCase().slice(-10) || "autouser";

    return {
        firstName: "Bob",
        lastName: "Ross",
        username: `Painter${suffix}`,
        password: DEFAULT_USER_PASSWORD,
        confirmPassword: DEFAULT_USER_PASSWORD,
    };
}