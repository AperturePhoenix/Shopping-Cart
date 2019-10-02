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
        this.userCollection = firebase.firestore().collection('users')
        this.itemCollection = firebase.firestore().collection('items')
        this.auth = firebase.auth()
    }

    static isLoggedIn = (callback) => {
        return this.auth.onAuthStateChanged(user => {
            this.getName(user.uid)
                .then(name => this.userName = name)
                .catch(error => console.log(error))
            callback(user)
        })
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
                    this.userCollection.doc(userCredential.user.uid).set({
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
            this.userCollection.doc(uid).get()
                .then(userSnapshot => {
                    resolve(userSnapshot.get('name'))
                })
                .catch(error => { reject(error) })
        })
    }

    static itemExists = (itemName) => {
        return new Promise((resolve, reject) => {
            this.itemCollection.where('uid', '==', this.auth.currentUser.uid).where('itemName', '==', itemName).get()
                .then(querySnapshot => {
                    resolve(!querySnapshot.empty)
                })
                .catch(error => reject(error))
        })
    }

    static getItems = () => {
        return new Promise((resolve, reject) => {
            this.itemCollection.where('uid', '==', this.auth.currentUser.uid).get()
                .then(querySnapshot => {
                    index = 0
                    items = []
                    if (!querySnapshot.empty) { 
                        querySnapshot.forEach(itemSnapshot => {
                            let {uid, name, itemName, itemQuantity} = itemSnapshot.data()
                            items.push({
                                iid: itemSnapshot.id,
                                key: index++,
                                uid: uid,
                                name: name,
                                itemName: itemName,
                                itemQuantity: itemQuantity
                            })
                        })
                    }
                    resolve(items)
                })
                .catch(error => reject(error))
        })
    }

    static addItem = (itemName, quantity) => {
        return new Promise((resolve, reject) => {
            itemObject = {
                uid: this.auth.currentUser.uid,
                name: this.userName,
                itemName: itemName,
                itemQuantity: parseInt(quantity)
            }
            this.itemCollection.add(itemObject)
                .then(itemReference => {
                    itemObject.iid = itemReference.id
                    resolve(itemObject)
                })
                .catch(error => reject(error))
        })
    }

    static removeItem = (iid) => {
        return new Promise((resolve, reject) => {
            this.itemCollection.doc(iid).delete()
                .catch(error => reject(error))
        })
    }

    static groupExists = (group) => {
        return new Promise((resolve, reject) => {
            this.userCollection.doc(this.auth.currentUser.uid).collection('groups').doc(group).get()
                .then(group => {
                    resolve(group.exists)
            })
            .catch(error => { reject(error) })
        })
    }

    static createGroup = (groupName) => {
        users = []
        users.push(this.auth.currentUser.uid)   
        this.userCollection.doc(this.auth.currentUser.uid).collection('groups').doc(groupName).set({
            users: users
        })
    }

    static getGroupList = () => {
        return new Promise((resolve, reject) => {
            this.userCollection.doc(this.auth.currentUser.uid).collection('groups').get()
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
            this.userCollection.doc(username).collection('groups').doc(group).get()
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
                this.userCollection.doc(username).collection('groups').doc(group).set({
                    usernames: [...usernames]
                })
                resolve(usernames)
            })
            .catch(error => { reject(error) })
        })
    }
}