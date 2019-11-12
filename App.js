import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createDrawerNavigator } from 'react-navigation-drawer';
import LoginLoader from './views/LoginLoader';
import Login from './views/Login';
import Register from './views/Register';
import MyShoppingList from './views/MyShoppingList';
import GroupView from './views/GroupView';
import Profile from './views/Profile';

const authStack = createStackNavigator(
  {
    Login,
    Register,
  },
  {
    initialRouteName: 'Login',
    defaultNavigationOptions: {
      header: null,
    },
  }
);
const appDrawer = createDrawerNavigator(
  {
    Home: MyShoppingList,
    Groups: GroupView,
    Profile,
  },
  {
    drawerType: 'slide',
    hideStatusBar: true,
    initialRouteName: 'Home',
  }
);

export default createAppContainer(
  createSwitchNavigator(
    {
      AuthLoading: LoginLoader,
      Auth: authStack,
      App: appDrawer,
    },
    {
      initialRouteName: 'AuthLoading',
    }
  )
);
