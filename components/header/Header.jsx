import { StyleSheet, SafeAreaView, View, Text, ScrollView, Button, Touchable, TouchableOpacity } from "react-native";
import React from "react";
import styles from "./HeaderStyles";
import AntDesign from 'react-native-vector-icons/AntDesign'
import { app_c } from "globals/styles";

function Header({ headerName }) {
  return (<View style={styles.wrapper_header}>
   <TouchableOpacity style={styles.circle_ctrl_icon}>
        <AntDesign style={styles.icon_exit} name="left" color={app_c.HEX.fourth} />
   </TouchableOpacity>
    <Text style={styles.header_name}>{headerName}</Text>
  </View>);
}

export default Header;

