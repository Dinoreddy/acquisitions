import logger from "#config/logger.js";
import { signUpSchema, signInSchema } from "../validators/auth.validation.js";
import { formatValidationErrors } from "../utils/format.js";
import { CreateUser, getUserByEmail, comparePassword } from "#services/auth.service.js";
import { jwttoken } from "#utils/jwt.js";
import { cookies } from "#utils/cookies.js";

export const signup = async (req , res) => {
    try {
        const validation = signUpSchema.safeParse(req.body);
        if (!validation.success) {
            return res.status(400).json({ message : 'Validation Failed' , error: formatValidationErrors(validation.error) });
        }

        const user = await CreateUser(validation.data);

        const token = jwttoken.generateToken({id : user.id , email : user.email , role : user.role});

        cookies.set(res , 'token' , token);

        return res.status(200).json({ message : 'User registered successfully' , data : user });

    } catch (error) {
        logger.error('Error in signUp' , error);
        return res.status(500).json({ message : 'Internal Server Error' });
    }
}

export const signin = async (req , res) => {
    try {
        const validation = signInSchema.safeParse(req.body);
        if (!validation.success) {
            return res.status(400).json({ message : 'Validation Failed' , error: formatValidationErrors(validation.error) });
        }

        const { email, password } = validation.data;
        
        const user = await getUserByEmail(email);
        if (!user) {
            return res.status(401).json({ message : 'Invalid credentials' });
        }

        const isPasswordValid = await comparePassword(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message : 'Invalid credentials' });
        }

        const token = jwttoken.generateToken({id : user.id , email : user.email , role : user.role});
        cookies.set(res , 'token' , token);

        // Remove password from response
        const { password: _, ...userWithoutPassword } = user;

        return res.status(200).json({ message : 'Sign in successful' , data : userWithoutPassword });
    } catch (error) {
        logger.error('Error in signIn' , error);
        return res.status(500).json({ message : 'Internal Server Error' });
    }
}

export const signout = async (req , res) => {
    try {
        cookies.clear(res , 'token');
        return res.status(200).json({ message : 'Sign out successful' });
    } catch (error) {
        logger.error('Error in signOut' , error);
        return res.status(500).json({ message : 'Internal Server Error' });
    }
}