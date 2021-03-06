import db from '../../data-access/account';

export default {
    
    create: ({username, password, email =  null, name = null}) => {
        return new Promise((resolve, reject) => {
            let newAccount = {
                username: username.trim().toLowerCase(),
                password: password.trim(),
                email: (!email || email.trim() === '') ? null : email.trim().toLowerCase(),
                name: (!name || name.trim() === '') ? null : name.trim()
            };
            db.saveAccount(newAccount)
                .then(user => resolve(user))
                .catch(error => reject(error));
        }); 
    },
    
    findOne: ({username, password}) => {
        return new Promise((resolve, reject) => {
           let accountToRetrieve = {
               user: username.trim().toLowerCase(),
               password: password.trim()
           };
           db.authenticateAccount(accountToRetrieve)
                .then(jwt => resolve(jwt))
                .catch(error => reject(error)); 
        });
    },

    findByQuery: (query) => {
        return new Promise((resolve, reject) => {
            if (!query) return reject(new Error('No query provided'));

            let searchQuery = query.trim().toLowerCase();
            db.findByQuery(searchQuery)
                .then(users => resolve(users))
                .catch(error => reject(error));
        })
    }
    
}