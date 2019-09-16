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

    static usernameExists = async(username, completion) => {
        await this.db.doc(username).get()
            .catch (error => {
                console.log(error)
            })
            .then (user => {
                completion(user.exists)
            })     
    }

    static login = async(username, password, completion) => {
        await this.getField(username, 'password', (encodedPassword) => {
            completion(base64.encode(password) == encodedPassword)
        })
    }

    static getField = async(username, field, completion) => {
        await this.db.doc(username).get()
            .then(documentSnapshot => {
                completion(documentSnapshot.get(field))
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
}