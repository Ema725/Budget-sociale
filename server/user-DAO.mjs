import { db } from "./db.mjs";
import crypto from 'crypto';
import { Utente } from "./Proposta.mjs";

export const getUser = (username, password) => {
    return new Promise((resolve, reject) => {
        db.get('SELECT * FROM users WHERE username = ?', [username], (err,row) => {
            if (err)
                reject(err);
            else if (row === undefined) {
                resolve(false);
            } else {
                const user = {id: row.ID, username: row.username, role: row.role};
                crypto.scrypt(password, row.salt, 32, function (err, hashedPassword) {
                    if (err)
                        reject(err);
                    if(!crypto.timingSafeEqual(Buffer.from(row.password,'hex'), hashedPassword))
                        resolve(false);
                    else
                        resolve(user);
                });
            }
        });
    });
}

export const getAllUsers = () => {
    return new Promise((resolve, reject) => {
        db.all('SELECT * FROM users', [], (err, rows) =>{
            if(err)
                reject(err);
            else{
                const utenti = rows.map((u) => new Utente(u.ID, u.username));
                resolve(utenti);
            }
        })
    })
}