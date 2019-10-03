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
        this.groupCollection  = firebase.firestore().collection('groups')
        this.auth = firebase.auth()
    }

    static isLoggedIn = (callback) => {
        return this.auth.onAuthStateChanged(user => {
            if (user) {
                this.getUserInfo(user.uid)
                .then(user => this.userName = user.name)
                .catch(error => console.log(error))
            }
            callback(user)
        })
    }

    static login = (email, password) => {
        return new Promise((resolve, reject) => {
            this.auth.signInWithEmailAndPassword(email, password)
                .then(userCredential => {
                    this.getUserInfo()
                        .then(user => this.userName = user.name)
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

    static signOut = () => {
        return new Promise((resolve, reject) => {
            this.auth.signOut()
                .catch(error => reject(error))
        })
    }

    static getUserInfo = (uid=this.auth.currentUser.uid) => {
        return new Promise((resolve, reject) => {
            this.userCollection.doc(uid).get()
                .then(userSnapshot => {
                    userObject = userSnapshot.data()
                    userObject.uid = uid
                    resolve(userObject)
                })
                .catch(error => { reject(error) })
        })
    }

    static getUserListInfo = (uids) => {
        return new Promise((resolve, reject) => {
            promises = uids.map((value) => {
                return this.getUserInfo(value)
            })
    
            Promise.all(promises)
                .then(values => {
                    users = []
                    values.forEach((value) => users.push(value))
                    resolve(users)
                })
                .catch(error => reject(error))
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

    static getItems = (uid=this.auth.currentUser.uid) => {
        return new Promise((resolve, reject) => {
            this.itemCollection.where('uid', '==', uid).get()
                .then(querySnapshot => {
                    items = []
                    if (!querySnapshot.empty) { 
                        querySnapshot.forEach(itemSnapshot => {
                            let {uid, name, itemName, itemQuantity} = itemSnapshot.data()
                            items.push({
                                iid: itemSnapshot.id,
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

    static groupExists = (groupName) => {
        return new Promise((resolve, reject) => {
            this.groupCollection.where('uids', 'array-contains', this.auth.currentUser.uid).where('groupName', '==', groupName).get()
                .then(querySnapshot => {
                    resolve(!querySnapshot.empty)
                })
                .catch(error => reject(error))
        })
    }

    static createGroup = (groupName) => {
        users = []
        users.push(this.auth.currentUser.uid)
        return new Promise((resolve, reject) => {
            groupObject = {
                groupName: groupName,
                uids: users
            }
            this.groupCollection.add(groupObject)
                .then(groupReference => {
                    groupObject.gid = groupReference.id
                    resolve (groupObject)
                })
                .catch(error => reject(error))
        })
    }

    static getGroupList = () => {
        return new Promise((resolve, reject) => {
            this.groupCollection.where('uids', 'array-contains', this.auth.currentUser.uid).get()
                .then(querySnapshot => {
                    groups = []
                    if (!querySnapshot.empty) {
                        querySnapshot.forEach(groupSnapshot => {
                            let {groupName, uids} = groupSnapshot.data()
                            groups.push({
                                gid: groupSnapshot.id,
                                groupName: groupName,
                                uids: uids
                            })
                        })
                    }
                    resolve(groups)
                })
                .catch(error => reject(error))
        })
    }

    static getGroupItems = (uids) => {
        return new Promise((resolve, reject) => {
            promises = uids.map((value) => {
                return this.getItems(value)
            })

            groupItems = []
            Promise.all(promises)
                .then(values => {
                    values.forEach(userItems => groupItems = groupItems.concat(userItems))
                    resolve(groupItems)
                })
                .catch(error => reject(error))
        })
    }

    static addUserToGroup = (gid, uid) => {
        return new Promise((resolve, reject) => {
            this.groupCollection.doc(gid).get()
                .then(groupSnapshot => {
                    uids = groupSnapshot.get('uids')
                    uids.push(uid)
                    this.groupCollection.doc(gid).update({ uids: uids })
                })
                .catch(error => reject(error))
        })
    }
}