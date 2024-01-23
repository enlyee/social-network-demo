declare namespace Express {
    interface Request {
        userId?: string
        confirmationCode?: string
    }
}