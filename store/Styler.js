import React from 'react'
import { Icon } from 'react-native-elements'

export const MainContainerStyle={
    backgroundColor: '#fff',
    flex: 1
}

export const ChildContainerStyle={
    marginHorizontal: 20,
    marginVertical: 20,
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
}

export const HeaderStyle={
    ZPosition:{
        elevation: 100,
        zIndex: 100
    },
    Menu:{
        Icon: <Icon name='menu' color='white' />,
        Type: 'clear'
    },
    Text:{
        color: '#fff',
        fontSize: 24
    },
    BackgroundColor: '#ffd602',
    Add:{
        Icon: <Icon name='add' color='white' />,
    },
    Remove: {
        Icon: <Icon name='remove' color='white' />
    }
}

export const DropDownStyle={
    BackgroundColor: '#ffa891',
    InputText:{
        color: '#fff',
        fontSize: 20
    },
    InputContainer:{
        borderColor: '#fff'
    },
    PlaceHolderColor: '#fff',
    Error:{
        color: '#f5624b'
    },
    Button:{
        Title:{
            color: '#fff',
            fontSize: 20
        },
        Type: 'clear'
    }
}

export const TextHeaderStyle={
    fontSize: 25
}

export const FlatListStyle={
    Text:{
        fontSize: 22
    },
    Subtle:{
        fontSize: 22,
        color: '#999'
    },
    Separator:{
        height: 1,
        width: "95%",
        margin: 5,
        backgroundColor: "#000",
        alignSelf: "center"
    }
}

export const ButtonTextStyle={
    color: '#6db105',
    fontSize: 20
}

export const ErrorStyle={
    color: '#f5624b'
}