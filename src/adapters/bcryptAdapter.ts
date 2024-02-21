import bcrypt from "bcryptjs";

class BcryptAdapter {
    async generateHash(password: string, salt: string): Promise<string> {
        return await bcrypt.hash(password, salt)
    }
}

export const bcryptAdapter = new BcryptAdapter()