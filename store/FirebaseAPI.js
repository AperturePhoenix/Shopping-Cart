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
        return new Promise((resolve, reject) => {
            this.auth.signInWithEmailAndPassword(email, password)
                .then(userCredential => {
                    this.userName = this.getName()
                    resolve()
                })
                .catch(error => reject(error))
        })
    }

    static register = (name, email, password) => {
        return new Promise((resolve, reject) => {
            this.auth.createUserWithEmailAndPassword(email, password)
                .then(userCredential => {
                    this.userName = name
                    this.db.doc(userCredential.user.uid).set({
                        name: name,
                        email: email
                    })
                    resolve()
                })
                .catch(error => reject(error))
        })
    }

    static getName = (uid=this.auth.currentUser.uid) => {
        return new Promise((resolve, reject) => {
            this.db.doc(uid).get()
                .then(userSnapshot => {
                    resolve(userSnapshot.get('name'))
                })
                .catch(error => { reject(error) })
        })
    }

    static itemExists = (item) => {
        return new Promise((resolve, reject) => {
            this.db.doc(this.auth.currentUser.uid).collection('items').doc(item).get()
            .then(item => {
                resolve(item.exists)
            })
            .catch(error => { reject(error) })
        })
    }

    static getItems = () => {
        return new Promise((resolve, reject) => {
            this.db.doc(this.auth.currentUser.uid).collection('items').get()
                .then(querySnapshot => {
                    index = 0
                    items = []
                    querySnapshot.forEach(queryDocSnapshot => {
                        items.push({key: index++, uid: this.auth.currentUser.uid, userName: this.userName, itemName: queryDocSnapshot.id, quantity: queryDocSnapshot.get('quantity')})
                    })
                    resolve(items)
                })
                .catch(error => { reject(error) })
        })
    }

    static addItem = (item, quantity) => {
        this.db.doc(this.auth.currentUser.uid).collection('items').doc(item).set({
            quantity: quantity
        }).catch(error => { console.log(error) })
    }

    static removeItem = (item) => {
        this.db.doc(this.auth.currentUser.uid).collection('items').doc(item).delete()
        .catch(error => { console.log(error) })
    }

    static groupExists = (group) => {
        return new Promise((resolve, reject) => {
            this.db.doc(this.auth.currentUser.uid).collection('groups').doc(group).get()
                .then(group => {
                    resolve(group.exists)
            })
            .catch(error => { reject(error) })
        })
    }

    static createGroup = (groupName) => {
        users = []
        users.push(this.auth.currentUser.uid)   
        this.db.doc(this.auth.currentUser.uid).collection('groups').doc(groupName).set({
            users: users
        })
    }

    static getGroupList = () => {
        return new Promise((resolve, reject) => {
            this.db.doc(this.auth.currentUser.uid).collection('groups').get()
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