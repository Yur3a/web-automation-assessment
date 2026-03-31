import { expect, test } from "../fixtures/test";
import { DEFAULT_USER_PASSWORD } from "../support/config";
import { isApiResponse, isGraphQLOperationResponse } from "../support/utils";

test.describe("User Sign-up and Login", () => {
    test("should redirect unauthenticated user to signin page", async ({ page, signInPage }) => {
        await page.goto("/personal");

        await expect(page).toHaveURL(/\/signin$/);
        await expect(signInPage.heading).toBeVisible();
    });

    test("should redirect to the home page after login", async ({ page, firstUser, loginAs }) => {
        await page.goto("/signin");
        await loginAs({ username: firstUser.username, password: DEFAULT_USER_PASSWORD }, { rememberUser: true });

        await expect(page).toHaveURL(/\/$/);
    });

    test("should remember a user for 30 days after login", async ({
        page,
        context,
        firstUser,
        loginAs,
        appShell,
        signInPage,
    }) => {
        await page.goto("/signin");
        await loginAs({ username: firstUser.username, password: DEFAULT_USER_PASSWORD }, { rememberUser: true });

        const cookies = await context.cookies();
        const sessionCookie = cookies.find((cookie) => cookie.name === "connect.sid");

        expect(sessionCookie).toBeDefined();
        expect(sessionCookie?.expires ?? 0).toBeGreaterThan(0);

        await appShell.signOut();

        await expect(page).toHaveURL(/\/signin$/);
        await expect(signInPage.heading).toBeVisible();
    });

    test("should allow a visitor to sign-up, login, and logout", async ({
        page,
        newUser,
        onboardingBankAccount,
        signInPage,
        signUpPage,
        loginAs,
        onboardingDialog,
        appShell,
    }) => {
        await test.step("Sign-up user", async () => {
            await page.goto("/");

            await expect(page).toHaveURL(/\/signin$/);
            await expect(signInPage.signUpLink).toHaveAttribute("href", "/signup");

            await signInPage.usernameInput.blur();
            await signInPage.clickSignUp();

            await expect(page).toHaveURL(/\/signup$/);
            await expect(signUpPage.heading).toHaveText("Sign Up");

            const signupResponsePromise = page.waitForResponse((response) =>
                isApiResponse(response, "/users", "POST")
            );

            await signUpPage.fillForm(newUser);
            await signUpPage.submit();

            const signupResponse = await signupResponsePromise;

            expect(signupResponse.ok()).toBeTruthy();
            await expect(page).toHaveURL(/\/signin$/);
        });

        await test.step("Login user", async () => {
            await loginAs({ username: newUser.username, password: newUser.password });

            await expect(page).toHaveURL(/\/$/);
        });

        await test.step("Complete onboarding", async () => {
            await expect(onboardingDialog.dialog).toBeVisible();
            await expect(appShell.listSkeleton).toHaveCount(0);
            await expect(appShell.notificationsCount).toBeVisible();

            await onboardingDialog.clickNext();

            await expect(onboardingDialog.title).toHaveText("Create Bank Account");

            const createBankAccountResponsePromise = page.waitForResponse((response) =>
                isGraphQLOperationResponse(response, "CreateBankAccount")
            );

            await onboardingDialog.fillBankAccount(onboardingBankAccount);
            await onboardingDialog.submitBankAccount();

            const createBankAccountResponse = await createBankAccountResponsePromise;

            expect(createBankAccountResponse.ok()).toBeTruthy();
            await expect(onboardingDialog.title).toHaveText("Finished");
            await expect(onboardingDialog.content).toContainText("You're all set!");

            await onboardingDialog.clickNext();

            await expect(appShell.transactionList).toBeVisible();
        });

        await test.step("Logout user", async () => {
            await appShell.signOut();

            await expect(page).toHaveURL(/\/signin$/);
            await expect(signInPage.heading).toBeVisible();
        });
    });

    test("should display login errors", async ({ page, signInPage }) => {
        await page.goto("/");

        await expect(page).toHaveURL(/\/signin$/);

        await test.step("Username is required", async () => {
            await signInPage.usernameInput.fill("User");
            await signInPage.usernameInput.clear();
            await signInPage.usernameInput.blur();

            await expect(signInPage.usernameHelperText).toBeVisible();
            await expect(signInPage.usernameHelperText).toHaveText("Username is required");
        });

        await test.step("Password must contain at least 4 characters", async () => {
            await signInPage.passwordInput.fill("abc");
            await signInPage.passwordInput.blur();

            await expect(signInPage.passwordHelperText).toBeVisible();
            await expect(signInPage.passwordHelperText).toHaveText(
                "Password must contain at least 4 characters"
            );
        });

        await test.step("Submit button is disabled", async () => {
            await expect(signInPage.submitButton).toBeDisabled();
        });
    });

    test("should display signup errors", async ({ signUpPage }) => {
        await signUpPage.goto();

        await test.step("First Name is required", async () => {
            await signUpPage.firstNameInput.fill("First");
            await signUpPage.firstNameInput.clear();
            await signUpPage.firstNameInput.blur();

            await expect(signUpPage.firstNameHelperText).toBeVisible();
            await expect(signUpPage.firstNameHelperText).toHaveText("First Name is required");
        });

        await test.step("Last Name is required", async () => {
            await signUpPage.lastNameInput.fill("Last");
            await signUpPage.lastNameInput.clear();
            await signUpPage.lastNameInput.blur();

            await expect(signUpPage.lastNameHelperText).toBeVisible();
            await expect(signUpPage.lastNameHelperText).toHaveText("Last Name is required");
        });

        await test.step("Username is required", async () => {
            await signUpPage.usernameInput.fill("User");
            await signUpPage.usernameInput.clear();
            await signUpPage.usernameInput.blur();

            await expect(signUpPage.usernameHelperText).toBeVisible();
            await expect(signUpPage.usernameHelperText).toHaveText("Username is required");
        });

        await test.step("Password is required", async () => {
            await signUpPage.passwordInput.fill("password");
            await signUpPage.passwordInput.clear();
            await signUpPage.passwordInput.blur();

            await expect(signUpPage.passwordHelperText).toBeVisible();
            await expect(signUpPage.passwordHelperText).toHaveText("Enter your password");
        });

        await test.step("Password does not match", async () => {
            await signUpPage.confirmPasswordInput.fill("DIFFERENT PASSWORD");
            await signUpPage.confirmPasswordInput.blur();

            await expect(signUpPage.confirmPasswordHelperText).toBeVisible();
            await expect(signUpPage.confirmPasswordHelperText).toHaveText("Password does not match");
        });

        await test.step("Submit button is disabled", async () => {
            await expect(signUpPage.submitButton).toBeDisabled();
        });
    });

    test("should error for an invalid user", async ({ page, signInPage, loginAs }) => {
        await page.goto("/signin");
        await loginAs({ username: "invalidUserName", password: "invalidPa$$word" }, { expectSuccess: false });

        await expect(signInPage.errorMessage).toBeVisible();
        await expect(signInPage.errorMessage).toHaveText("Username or password is invalid");
    });

    test("should error for an invalid password for existing user", async ({
        page,
        signInPage,
        firstUser,
        loginAs,
    }) => {
        await page.goto("/signin");
        await loginAs({ username: firstUser.username, password: "INVALID" }, { expectSuccess: false });

        await expect(signInPage.errorMessage).toBeVisible();
        await expect(signInPage.errorMessage).toHaveText("Username or password is invalid");
    });
});
