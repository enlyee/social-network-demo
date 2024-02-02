export type RateLimitIpType = {
    ip: string,
    url: string,
    date: Date
}

export type AuthSessionsType = {
    userId: string,
    ip: string,
    deviceId: string,
    title: string,
    lastActiveDate: Date,
    expiresAt: Date
}
