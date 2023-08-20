const handleRegister = (req, res, db, bcrypt, saltRounds) => {
    const { email, name, password } = req.body;
    
    if (!email || !name || !password) {
      return res.status(400).json('Incorrect form submission');
    }
  
    // Check if email already exists
    db.select('email').from('login')
      .where('email', '=', email)
      .then(existingEmail => {
        if (existingEmail.length > 0) {
          return res.status(400).json('Email already exists');
        } else {
          // Hash the password and insert user data
          const hash = bcrypt.hashSync(password, saltRounds);
          
          // Insert user data into 'login' table
          db.transaction(trx => {
            trx.insert({
              hash: hash,
              email: email
            })
            .into('login')
            .returning('email')
            .then(loginEmail => {
              // Insert user data into 'users' table
              return trx('users')
                .returning('*')
                .insert({
                  email: loginEmail[0].email,
                  name: name,
                  joined: new Date()
                })
                .then(user => {
                  res.json(user[0]);
                })
            })
            .then(trx.commit)
            .catch(trx.rollback)
          })
          .catch(err => res.status(400).json('Unable to register'));
        }
      })
      .catch(err => res.status(400).json('Error checking email'));
  };
  
  module.exports = {
    handleRegister: handleRegister
  };
  