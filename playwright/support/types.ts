export interface TestUser {
    id: string;
    username: string;
    firstName: string;
    lastName: string;
}

export interface Credentials {
    username: string;
    password: string;
}

export interface SignUpUserData extends Credentials {
    firstName: string;
    lastName: string;
    confirmPassword: string;
}

export interface BankAccountDetails {
    bankName: string;
    routingNumber: string;
    accountNumber: string;
}

export interface LoginOptions {
    rememberUser?: boolean;
    expectSuccess?: boolean;
}

export interface UsersResponse {
    results: TestUser[];
}