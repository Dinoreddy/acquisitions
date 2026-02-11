import config from "#config/index.js";

export const cookies = {
    options : () => ({
        httpOnly : true,
        secure : config.env === 'production',
        sameSite : 'strict',
        maxAge : 15 * 60 * 1000,
        path: '/',
    }),

    set: (res , name , value , options = {}) => {
        const defaultOptions = cookies.options();
        res.cookie(name , value , {...defaultOptions , ...options});
    },

    get: (req , name) => {
        return req.cookies[name];
    },

    clear: (res , name , options ={}) => {
        res.clearCookie(name , {...cookies.options() , ...options});
    }
}