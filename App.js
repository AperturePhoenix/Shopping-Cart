import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import LoginLoader from './views/LoginLoader'
import Login from './views/Login'
import Register from './views/Register'
import MyShoppingList from './views/MyShoppingList'

const authStack = createStackNavigator({ 
  Login: Login, 
  Register: Register 
}, {
  initialRouteName: 'Login',
})
const appStack = createStackNavigator({ Home: MyShoppingList })

export default createAppContainer(
  createSwitchNavigator({
    AuthLoading: LoginLoader,
    Auth: authStack,
    App: appStack
  }, {
    initialRouteName: 'AuthLoading',
    defaultNavigationOptions: {
      headerStyle: {
        backgroundColor: '#ffd602',
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: 'bold',
      },
    },
  })
)