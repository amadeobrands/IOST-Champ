'use strict';
class iostChamp {
    init() {
    }
    can_update(data) {
        return blockchain.requireAuth(blockchain.contractOwner(), 'active');
    }
    registerUser(to, randomAmount, googleHash) {
        if (storage.mapHas(tx.publisher, 'level')) {
            throw new Error('Cannot register twice');
        }
        if (randomAmount <= 0) {
            throw new Error('Random amount cannot be 0');
        }
        blockchain.transfer(tx.publisher, to, randomAmount, 'register user');
        storage.mapPut(tx.publisher, 'level', '1');
        storage.mapPut(tx.publisher, 'certificationLevel', '0');
        storage.mapPut(tx.publisher, 'googleHash', googleHash);
        storage.mapPut(tx.publisher, 'randomAmount', randomAmount);
        console.log(tx.publisher);
        return blockchain.requireAuth(blockchain.contractOwner(), 'owner');
    }
    getUser(userAccount) {
        let certLevel = storage.mapGet(userAccount, 'certificationLevel');
        let level = storage.mapGet(userAccount, 'level');
        let randomAmount = storage.mapGet(userAccount, 'randomAmount');
        let googleHash = storage.mapGet(userAccount, 'googleHash');
        let user = {
            randomAmount,
            certLevel,
            level,
            googleHash
        };
        return user;
    }
    updateUserLevel(userAccount, newLevel) {
        if (!storage.mapHas(userAccount, 'level')) {
            throw new Error('User has to be registered');
        }
        storage.mapPut(userAccount, 'level', newLevel);
    }
    updateUserCertificationLevel(userAccount, newCertLevel) {
        if (!storage.mapHas(userAccount, 'level')) {
            throw new Error('User has to be registered');
        }
        storage.mapPut(userAccount, 'certificationLevel', newCertLevel);
    }
    resetUser(userAccount) {
        storage.mapPut(userAccount, 'level', '0');
        storage.mapPut(userAccount, 'certificationLevel', '0');
    }
}
module.exports = iostChamp;