import firebase from 'firebase'
import '@firebase/firestore';
import base64 from 'react-native-base64';
import { AsyncStorage } from 'react-native';

export default class FirebaseAPI {
    static firebaseConfig = {
        apiKey: "AIzaSyCJLiH1KdAcmdySrvEiydkNxRonH9QCvKg",
        authDomain: "shopping-cart-d8b09.firebaseapp.com",
        databaseURL: "https://shopping-cart-d8b09.firebaseio.com",
        projectId: "shopping-cart-d8b09",
        storageBucket: "shopping-cart-d8b09.appspot.com",
        messagingSenderId: "925913407970",
        appId: "1:925913407970:web:011a4a3e494627b62f19bb"
    }

    static initializeApp = () => {
        firebase.initializeApp(this.firebaseConfig)
        this.db = firebase.firestore().collection('users')
    }

    static loadAsyncStorage = () => {
        return new Promise((resolve, reject) => {
            Promise.all([
                AsyncStorage.getItem('name'),
                AsyncStorage.getItem('username'),
                AsyncStorage.getItem('password')
            ]).then(array => {
                this.nickname = array[0]
                this.username = array[1]
                this.encodedPassword = array[2]
                resolve(this.nickname !== null && this.username !== null && this.encodedPassword !== null)
            }).catch(error => { reject(error) })
        })
    }

    static saveAsyncStorage = (name, username, encodedPassword) => {
        this.nickname = name
        AsyncStorage.setItem('name', name)
        this.username = username
        AsyncStorage.setItem('username', this.username)
        this.encodedPassword = encodedPassword
        AsyncStorage.setItem('password', encodedPassword)
    }

    static usernameExists = (username) => {
        return new Promise((resolve, reject) => {
            this.db.doc(username).get()
                .then(user => {
                    resolve(user.exists)
                })
                .catch(error => { reject(error) })
        })     
    }

    static login = (username, password) => {
        return new Promise((resolve, reject) => {
            this.usernameExists(username)
                .then(exists => {
                    if (exists) {
                        Promise.all([this.getField(username, 'name'), this.getField(username, 'password')])
                            .then(array => {
                                this.saveAsyncStorage(array[0], username, array[1])
                                resolve(base64.encode(password) === array[1])
                            })
                    } else {
                        resolve(false)
                    }
                })
                .catch(error => { reject(error) })
        })
    }

    static register = (name, username, password) => {
        return new Promise((resolve, reject) => {
            this.usernameExists(username)
                .then(exists => {
                    if (!exists) {
                        this.setFields(username, {
                            name: name,
                            password: base64.encode(password)
                        })
                        this.saveAsyncStorage(name, username, base64.encode(password))
                        resolve(true)
                    } else {
                        resolve(false)
                    }
                })
                .catch(error => { reject(error) })
        })
    }

    static getField = (username, field) => {
        return new Promise((resolve, reject) => {
            this.db.doc(username).get()
                .then(userSnapshot => {
                    resolve(userSnapshot.get(field))
                })
                .catch(error => { reject(error) })
        })
    }

    static setFields = (username, fields) => {
        this.db.doc(username).set(fields)
            .catch(error => { console.log(error) })
    }

    static itemExists = (username, item) => {
        return new Promise((resolve, reject) => {
            this.db.doc(username).collection('items').doc(item).get()
            .then(item => {
                resolve(item.exists)
            })
            .catch(error => { reject(error) })
        })
    }

    static getItems = (username) => {
        return new Promise((resolve, reject) => {
            this.db.doc(username).collection('items').get()
                .then(querySnapshot => {
                    items = []
                    querySnapshot.forEach(queryDocSnapshot => {
                        items.push({name: queryDocSnapshot.id, quantity: queryDocSnapshot.get('quantity')})
                    })
                    resolve(items)
                })
                .catch(error => { reject(error) })
        })
    }

    static addItem = (username, item, quantity) => {
        this.db.doc(username).collection('items').doc(item).set({
            quantity: quantity
        }).catch(error => { console.log(error) })
    }

    static removeItem = (username, item) => {
        this.db.doc(username).collection('items').doc(item).delete()
        .catch(error => { console.log(error) })
    }

    static getItemField = (username, item, field) => {
        return new Promise((resolve, reject) => {
            this.db.doc(username).collection('items').doc(item)
            .then(itemSnapshot => {
                resolve(itemSnapshot.get(field))
            })
            .catch(error => { reject(error) })
        })
    }

    static groupExists = async(username, group, callback) => {
        await this.db.doc(username).collection('groups').doc(group).get()
            .then(group => {
                callback(group.exists)
            })
            .catch(error => {
                console.log(error)
            })
    }

    static getGroupList = async(username, callback) => {
        await this.db.doc(username).collection('groups').get()
            .then(groupSnapshot => {
                groups = []
                groupSnapshot.forEach(groupDocSnapshot => {
                    groups.push({name: groupDocSnapshot.id, usernames: groupDocSnapshot.get('usernames')})
                })
                callback(groups)
            })
            .catch(error => {
                console.log(error)
            })
    }

    static getGroupUsernames = async(username, group, callback) => {
        await this.db.doc(username).collection('groups').doc(group).get()
            .then(groupSnapshot => {
                callback(groupSnapshot.get('usernames'))
            })
            .catch(error => {
                console.log(error)
            })
    }

    static addUserToGroup = async(username, group, newUser) => {
        this.getGroupUsernames(username, group, usernames => {
            if (usernames === undefined) usernames = []
            usernames.push(newUser)
            this.db.doc(username).collection('groups').doc(group).set({
                usernames: [...usernames]
            })
        })
    }
}