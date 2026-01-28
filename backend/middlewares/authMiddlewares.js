const verifyAdmin = (req, res, next) => {
    const role = req.headers['x-user-role'];

    if (role === 'admin') {
        next(); 
    } else {
        return res.status(403).json({
            message: "Akses Ditolak: Anda bukan Admin!"
        });
    }
};

const verifyUser = (req, res, next) => {
    const role = req.headers['x-user-role'];
    const userId = req.headers['x-user-id'];

    if (role === 'user' && userId) {
        req.userContext = { id: userId };
        next();
    } else {
        return res.status(403).json({
            message: "Akses Ditolak: Harus menyertakan x-user-role 'user' dan x-user-id!"
        });
    }
};

module.exports = { verifyAdmin, verifyUser };