const handleSignIn = async (req, res, db, bcrypt) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json('Incorrect form submission');
    }

    try {
        const user = await db.select('*').from('users').where('email', '=', email).first();

        if (user && bcrypt.compareSync(password, user.hash)) {
            res.json(user);
        } else {
            res.status(400).json('Wrong Credentials');
        }
    } catch (error) {
        res.status(400).json('Wrong Credentials');
    }
};

module.exports = {
    handleSignIn: handleSignIn
};
