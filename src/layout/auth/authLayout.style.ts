import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
        width: '100%',
        backgroundColor: '#ffffff',
    },
    formContainer:{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        width: '85%',
        height: '90%',
        padding: 20,
        gap: 20,
    },
    welcomeWords:{
        fontSize: 26,
        fontWeight: '900',
        marginBottom: 20,
        fontFamily: 'Roboto',
    },
    fieldContainer:{
        display: 'flex',
        flexDirection: 'column',
        paddingVertical: 15,
        gap: 30,
    },
    fields:{
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        paddingVertical: 2,
        fontSize: 16,
        backgroundColor: '#ffffff',
    },
    forgotPassword:{
        textAlign: 'right',
        color: '#6ba7e3',
        textDecorationLine: 'underline',
    },
    button:{
        marginVertical:20,
        paddingVertical: 8,
        borderRadius: 5,
        alignItems: 'center',
    },
    buttonTxt:{
        fontSize: 18,
        color: '#ffffff',
    },
    registerContainer:{
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 5,
    },
    linkText:{
        fontSize: 16,
        color: '#00aaffff',
        textDecorationLine: 'underline',
    },
});

export default styles;