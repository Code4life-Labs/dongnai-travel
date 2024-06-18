import { app_c } from "globals/styles";
import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    },
    h1: {
        color: 'blue',
        fontSize: 30,
        margin: 10,
        padding: 10,
        textAlign: 'center'
    },
    text_version: {
        fontSize: 20,
        color: 'gray',
        textAlign: 'center',
    },
    aboardingContainer: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        right: 0,
        left: 0,
        zIndex: 5,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    }
})

export default styles