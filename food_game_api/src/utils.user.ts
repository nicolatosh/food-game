const bcrypt = require('bcrypt');

/**
 * Simple async hashing function
 * @param password string clear text
 */
export const hashPassword: (password: string) => Promise<any> = async (password) => {
    bcrypt.hash(password, 10).then(function(hash:string) {
        return hash;
    });
}

/**
 * Function to check if a password is equivalent to an hashed one.
 * @param password clear password (user input)
 * @param hashedPassword hashed password (db psw)
 */
export const checkUserPassword: (password: string, hashedPassword:string) => Promise<boolean> = async(password,hashedPassword) => {

    const match = await bcrypt.compare(password, hashedPassword);
    return match;
}