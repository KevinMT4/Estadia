const bcrypt = require('bcryptjs');

const password = 'password1'; // La contraseña que quieres comparar

bcrypt.genSalt(10, (err, salt) => {
    if (err) throw err;

    bcrypt.hash(password, salt, (err, hash) => {
        if (err) throw err;
        console.log('Generated Hash:', hash);

        // Ahora compara el hash generado con la contraseña original
        bcrypt.compare(password, hash, (err, isMatch) => {
            if (err) throw err;
            console.log('Password match:', isMatch);
        });
    });
});
