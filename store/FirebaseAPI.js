import firebase from 'firebase';
import '@firebase/firestore';

export default class FirebaseAPI {
  static firebaseConfig = {
    apiKey: 'AIzaSyCJLiH1KdAcmdySrvEiydkNxRonH9QCvKg',
    authDomain: 'shopping-cart-d8b09.firebaseapp.com',
    databaseURL: 'https://shopping-cart-d8b09.firebaseio.com',
    projectId: 'shopping-cart-d8b09',
    storageBucket: 'shopping-cart-d8b09.appspot.com',
    messagingSenderId: '925913407970',
    appId: '1:925913407970:web:011a4a3e494627b62f19bb',
  };

  static initializeApp = () => {
    firebase.initializeApp(this.firebaseConfig);
    this.userCollection = firebase.firestore().collection('users');
    this.itemCollection = firebase.firestore().collection('items');
    this.groupCollection = firebase.firestore().collection('groups');
    this.auth = firebase.auth();
  };

  static isLoggedIn = callback => {
    return this.auth.onAuthStateChanged(user => {
      if (user) {
        this.getUserInfo(user.uid)
          .then(userInfo => {
            this.userName = userInfo.name;
          })
          .catch(error => console.log(error));
      }
      callback(user);
    });
  };

  static login = (email, password) => {
    return new Promise((resolve, reject) => {
      this.auth
        .signInWithEmailAndPassword(email, password)
        .then(() => {
          this.getUserInfo().then(userInfo => {
            this.userName = userInfo.name;
          });
          resolve();
        })
        .catch(error => reject(error));
    });
  };

  static register = (name, email, password) => {
    return new Promise((resolve, reject) => {
      this.auth
        .createUserWithEmailAndPassword(email, password)
        .then(userCredential => {
          this.userName = name;
          this.userCollection.doc(userCredential.user.uid).set({
            name,
            email,
          });
          resolve();
        })
        .catch(error => reject(error));
    });
  };

  static signOut = () => {
    return new Promise((resolve, reject) => {
      this.auth.signOut().catch(error => reject(error));
    });
  };

  static getUserInfo = (uid = this.auth.currentUser.uid) => {
    return new Promise((resolve, reject) => {
      this.userCollection
        .doc(uid)
        .get()
        .then(userSnapshot => {
          const userObject = userSnapshot.data();
          userObject.uid = uid;
          resolve(userObject);
        })
        .catch(error => {
          reject(error);
        });
    });
  };

  static getUser = email => {
    return new Promise((resolve, reject) => {
      this.userCollection
        .where('email', '==', email)
        .get()
        .then(querySnapshot => {
          if (querySnapshot.empty) resolve();
          else {
            const userObject = querySnapshot.docs[0].data();
            userObject.uid = querySnapshot.docs[0].id;
            resolve(userObject);
          }
        })
        .catch(error => reject(error));
    });
  };

  static getUserListInfo = uids => {
    return new Promise((resolve, reject) => {
      const promises = uids.map(value => {
        return this.getUserInfo(value);
      });

      Promise.all(promises)
        .then(values => {
          const users = [];
          values.forEach(value => users.push(value));
          resolve(users);
        })
        .catch(error => reject(error));
    });
  };

  static itemExists = itemName => {
    return new Promise((resolve, reject) => {
      this.itemCollection
        .where('uid', '==', this.auth.currentUser.uid)
        .where('itemName', '==', itemName)
        .get()
        .then(querySnapshot => {
          resolve(!querySnapshot.empty);
        })
        .catch(error => reject(error));
    });
  };

  static getItems = (uid = this.auth.currentUser.uid) => {
    return new Promise((resolve, reject) => {
      this.itemCollection
        .where('uid', '==', uid)
        .get()
        .then(querySnapshot => {
          const items = [];
          if (!querySnapshot.empty) {
            querySnapshot.forEach(itemSnapshot => {
              const { name, itemName, itemQuantity } = itemSnapshot.data();
              items.push({
                iid: itemSnapshot.id,
                uid,
                name,
                itemName,
                itemQuantity,
              });
            });
          }
          resolve(items);
        })
        .catch(error => reject(error));
    });
  };

  static addItem = (itemName, quantity) => {
    return new Promise((resolve, reject) => {
      const itemObject = {
        uid: this.auth.currentUser.uid,
        name: this.userName,
        itemName,
        itemQuantity: parseInt(quantity, 10),
      };
      this.itemCollection
        .add(itemObject)
        .then(itemReference => {
          itemObject.iid = itemReference.id;
          resolve(itemObject);
        })
        .catch(error => reject(error));
    });
  };

  static removeItem = iid => {
    return new Promise((resolve, reject) => {
      this.itemCollection
        .doc(iid)
        .delete()
        .catch(error => reject(error));
    });
  };

  static groupExists = groupName => {
    return new Promise((resolve, reject) => {
      this.getGroupList()
        .then(groups => {
          let exists = false;

          groups.forEach(group => {
            if (group.name === groupName) {
              exists = true;
            }
          });
          resolve(exists);
        })
        .catch(error => reject(error));
    });
  };

  static createGroup = groupName => {
    return new Promise((resolve, reject) => {
      const group = { name: groupName };
      group[this.auth.currentUser.uid] = true;
      this.groupCollection
        .add(group)
        .then(groupReference => {
          const groupObject = {
            gid: groupReference.id,
            name: groupName,
            users: [{ uid: this.auth.currentUser.uid, admin: true }],
          };
          resolve(groupObject);
        })
        .catch(error => reject(error));
    });
  };

  static getGroupList = () => {
    return new Promise((resolve, reject) => {
      const promises = [];
      promises.push(this.groupCollection.where(this.auth.currentUser.uid, '==', true).get());
      promises.push(this.groupCollection.where(this.auth.currentUser.uid, '==', false).get());

      Promise.all(promises)
        .then(values => {
          const groupObject = [];
          values.forEach(querySnapshot => {
            querySnapshot.forEach(groupSnapshot => {
              const users = groupSnapshot.data();
              const userObject = [];
              delete users.name;

              const usersIterator = Object.keys(users);

              usersIterator.forEach(uid => {
                userObject.push({ uid, isAdmin: users[uid] });
              });
              groupObject.push({
                gid: groupSnapshot.id,
                name: groupSnapshot.get('name'),
                users: userObject,
              });
            });
          });
          resolve(groupObject);
        })
        .catch(error => reject(error));
    });
  };

  static getGroupItems = uids => {
    return new Promise((resolve, reject) => {
      const promises = uids.map(value => {
        return this.getItems(value);
      });

      let groupItems = [];
      Promise.all(promises)
        .then(values => {
          values.forEach(userItems => {
            groupItems = groupItems.concat(userItems);
          });
          resolve(groupItems);
        })
        .catch(error => reject(error));
    });
  };

  static addUserToGroup = (gid, uid, isAdmin = false) => {
    return new Promise((resolve, reject) => {
      const user = {};
      user[uid] = isAdmin;
      this.groupCollection
        .doc(gid)
        .update(user)
        .then(() => resolve())
        .catch(error => reject(error));
    });
  };
}
