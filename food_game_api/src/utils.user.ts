const bcrypt = require('bcryptjs');

/**
 * Simple async hashing + salting function
 * @param password string clear text
 */
export const hashPassword: (password: string) => Promise<string> = async (password) => {
    
    let psw: string = await bcrypt.hash(password, 10).then(function(hash:string) {
        return hash;
    });
    return psw;
}

/**
 * Function to check if a password is equivalent to an hashed one.
 * @param password clear password (user input)
 * @param hashedPassword hashed password (db psw)
 */
export const checkUserPassword: (password: string, hashedPassword:string) => Promise<boolean> = async(password,hashedPassword) => {

    let match:boolean = bcrypt.compare(password, hashedPassword).then(function(result:any) {
        if(result){
            return true
        }else{
           return false
        }
    });
    return await match
}
