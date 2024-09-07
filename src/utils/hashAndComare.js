import bcrypt from 'bcryptjs'
export const hashPassword = ({ password, saltRound = 8 }) => {
    return bcrypt.hashSync(password, saltRound)
}

export const comparePassword = ({ password, hashedPasswrod }) => {
    return bcrypt.compareSync(password, hashedPasswrod)
}