import { db } from "./db.mjs";
import { Voto } from "./Proposta.mjs";

export const getVoti = () => {
    return new Promise((resolve, reject) => {
        db.all('SELECT * FROM voti', [], (err, rows) =>{
            if(err)
                reject(err);
            else{
                const elencovoti = rows.map((v) => new Voto(v.PropostaID, v.UserID, v.voto));
                resolve(elencovoti);
            }
        })
    })
}

export const postVoto = (voto) => {
    return new Promise((resolve, reject) => {
        db.run('INSERT INTO voti (PropostaID, UserID, voto) VALUES (?,?,?)', [voto.propostaid, voto.userid, voto.voto], function(err){
            if(err)
                reject(err)
            else
                resolve('')
        })
    })
}

export const deleteVoto = (voto) => {
    return new Promise((resolve, reject) => {
        db.run('DELETE FROM voti WHERE PropostaID=? AND UserID=?', [voto.propostaid, voto.userid], function(err){
            if(err)
                reject(err)
            else
                resolve("voto eliminato correttamente")
        })
    })
}

export const deleteAllVoti = () => {
    return new Promise((resolve, reject) => {
      db.run('DELETE FROM voti', [], function (err) {
        if (err) reject(err);
        else resolve(this.changes);
      });
    });
};