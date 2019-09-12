import { createAppContainer } from 'react-navigation'
import { createStackNavigator } from 'react-navigation-stack'
import MyShoppingList from './views/MyShoppingList'
import Login from './views/Login'

const appNavigator = createStackNavigator({
  Login: { screen: Login},
  Home: { screen: MyShoppingList}
}, { initialRouteName: 'Login'} )

export default createAppContainer(appNavigator)