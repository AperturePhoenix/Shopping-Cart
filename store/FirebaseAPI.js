import firebase from 'firebase'
import '@firebase/firestore'

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
        this.auth = firebase.auth()
    }

    static isLoggedIn = (callback) => {
        return this.auth.onAuthStateChanged(callback)
    }

    static login = (email, password) => {
        this.auth.signInWithEmailAndPassword(email, password)
    }

    static register = (name, email, password) => {
        return this.auth.createUserWithEmailAndPassword(email, password)
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
                        items.push({username: username, name: queryDocSnapshot.id, quantity: queryDocSnapshot.get('quantity')})
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

    static groupExists = (username, group) => {
        return new Promise((resolve, reject) => {
            this.db.doc(username).collection('groups').doc(group).get()
                .then(group => {
                    resolve(group.exists)
            })
            .catch(error => { reject(error) })
        })
    }

    static getGroupList = (username) => {
        return new Promise((resolve, reject) => {
            this.db.doc(username).collection('groups').get()
                .then(groupSnapshot => {
                    groups = []
                    groupSnapshot.forEach(groupDocSnapshot => {
                        groups.push({name: groupDocSnapshot.id, usernames: groupDocSnapshot.get('usernames')})
                    })
                resolve(groups)
            })
            .catch(error => { reject(error) })
        })
    }

    static getGroupUsernames = (username, group) => {
        return new Promise((resolve, reject) => {
            this.db.doc(username).collection('groups').doc(group).get()
                .then(groupSnapshot => {
                    resolve(groupSnapshot.get('usernames'))
            })
            .catch(error => { reject(error) })
        })
    }

    static addUserToGroup = (username, group, newUser) => {
        return new Promise((resolve, reject) => {
            this.getGroupUsernames(username, group) 
            .then(usernames => {
                if (usernames === undefined) usernames = []
                usernames.push(newUser)
                this.db.doc(username).collection('groups').doc(group).set({
                    usernames: [...usernames]
                })
                resolve(usernames)
            })
            .catch(error => { reject(error) })
        })
    }
}