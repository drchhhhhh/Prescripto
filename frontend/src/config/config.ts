interface Endpoints {
    login: string;
    me: string;
    logout: string;
    getUsers: string;
    getUserId: string;
    createUser: string;
    updateUser: string;
    deleteUser: string;
    getMedAll: string;
    getMedExp: string;
    getMedId: string;
    createMed: string;
    updateMed: string;
    deleteMed: string;
    createTransac: string;
    getTransacAll: string;
    getTransacDate: string;
    getTransacRec: string;
    getTransacId: string;
}

export const endpoints: Endpoints = {
    login: `/api/auth/login`,
    me: `/api/auth/me`,
    logout: `/api/auth/logout`,
    getUsers: `/api/users`,
    getUserId: `/api/users/:id`,
    createUser: `/api/users`,
    updateUser: `/api/users/:id`,
    deleteUser: `/api/users/:id`,
    getMedAll: `/api/medicines`,
    getMedExp: `/api/medicines/expiration`,
    getMedId: `/api/medicines/:id`,
    createMed: `/api/medicines/`,
    updateMed: `/api/medicines/:id`,
    deleteMed: `/api/medicines/:id`,
    createTransac: `/api/transactions`,
    getTransacAll: `/api/transactions`,
    getTransacDate: `/api/transactions/date`,
    getTransacRec: `/api/transactions/receipt/:receiptNumber`,
    getTransacId: `/api/transactions/:id`,
} as const;