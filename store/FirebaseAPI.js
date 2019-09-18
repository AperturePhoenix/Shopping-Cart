import firebase from 'firebase'
import '@firebase/firestore';
import base64 from 'react-native-base64';

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

    static usernameExists = async(username, callback) => {
        await this.db.doc(username).get()
            .catch (error => {
                console.log(error)
            })
            .then (user => {
                callback(user.exists)
            })     
    }

    static login = async(username, password, callback) => {
        await this.getField(username, 'password', (encodedPassword) => {
            callback(base64.encode(password) == encodedPassword)
        })
    }

    static getField = async(username, field, callback) => {
        await this.db.doc(username).get()
            .then(userSnapshot => {
                callback(userSnapshot.get(field))
            })
            .catch (error => {
                console.log(error)
            })
    }

    static setFields = async(username, fields) => {
        await this.db.doc(username).set(fields)
            .catch(error => {
                console.log(error)
            })
    }

    static itemExists = async(username, item, callback) => {
        await this.db.doc(username).collection('items').doc(item).get()
            .then(item => {
                callback(item.exists)
            })
            .catch(error => {
                console.log(error)
            })
    }

    static getItems = async(username, callback) => {
        await this.db.doc(username).collection('items').get()
            .then(querySnapshot => {
                items = []
                querySnapshot.forEach(queryDocSnapshot => {
                    items.push({name: queryDocSnapshot.id, quantity: queryDocSnapshot.get('quantity')})
                })
                callback(items)
            })
            .catch(error => {
                console.log(error)
            })
    }

    static addItem = async(username, item, quantity) => {
        await this.db.doc(username).collection('items').doc(item).set({
            quantity: quantity
        })
    }

    static removeItem = async(username, item) => {
        await this.db.doc(username).collection('items').doc(item).delete()
    }

    static getItemField = async(username, item, field, callback) => {
        await this.db.doc(username).collection('items').doc(item)
            .then(itemSnapshot => {
                callback(itemSnapshot.get(field))
            })
            .catch(error => {
                console.log(error)
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

    static getGroup = async(username, group, callback) => {
        await this.doc(username).collection('groups').doc(group).get()
            .then(groupSnapshot => {
                callback(groupSnapshot.get('list'))
            })
            .catch(error => {
                console.log(error)
            })
    }

    static addUserToGroup = async(username, group, newUser) => {
        await this.db.doc(username).collection('groups').doc(group).get()
            .then(group => {
                
            })
            .catch(error => {
                console.log(error)
            })
    }
}