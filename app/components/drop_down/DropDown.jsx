import { AppText } from "components";
import React, { useState,useRef } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import {Entypo,AntDesign} from 'react-native-vector-icons'

import { app_c, app_typo } from "globals/styles";
import styles from './DropDownStyle'

const options=[
  {
    label: "Bật",
    value: true,
  },
  {
    label: "Tắt",
    value: false,
  },
]

const DropDown = ({name,isMode=false,isParagraph=false,children,icon,isDrop=true,handlePressButton=()=>{}}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(options[0].value);
  const [btnBgColor,setBtnBgColor]=useState(app_c.HEX.ext_primary)

  const dropdownRef=useRef(null)

  const handleOptionChange = (optionValue) => {
    setSelectedOption(optionValue);
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
    // set background color for dropdown when onPress
    if(!isOpen)
    {
      setBtnBgColor(app_c.HEX.sub_third)
    }
    else{
      setBtnBgColor(app_c.HEX.ext_primary)
    }
    if(!isDrop)
    {
      handlePressButton(),
      setBtnBgColor(app_c.HEX.ext_primary)
    }
  };

  return (
    <View  style={styles.dropdown} >
      <TouchableOpacity   onPress={toggleDropdown} style={{...styles.dropdown_btn,backgroundColor:btnBgColor}}>
        
        <View ref={dropdownRef}  style={{justifyContent:'space-between',flexDirection:'row',width:'90%',}}>
          <Text style={{...styles.dropdown_label}}>{icon}<View style={{alignItems:'center',paddingLeft:12}}><Text style={{fontSize:16,color:app_c.HEX.fourth,fontWeight:'500'}}>{name}</Text></View></Text>
         {isMode && 
         <View style={{flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
            {selectedOption ?
              <AppText style={{...styles.dropdown_label,...styles.dropdown_label_mode}}>Bật</AppText>
            :<AppText style={{...styles.dropdown_label,...styles.dropdown_label_mode}}>Tắt</AppText>}
          </View>
          }
        </View>
        {isOpen && isDrop ? 
        <AntDesign  name="down" size={22} color={app_c.HEX.fourth}/>:<AntDesign name="right" size={22} color={app_c.HEX.fourth}/>
        }
      </TouchableOpacity>
      {isOpen && isDrop && (
        <View style={{ paddingTop:12}}>
          {isMode && options.map((option) => (
            <TouchableOpacity
              key={option.value}
              onPress={() => handleOptionChange(option.value)}
            >
              <View style={styles.dropdown_content}>
                <View style={styles.circle_outline}>
                  {selectedOption === option.value && (
                    <View
                      style={styles.circle}
                    />
                  )}
                </View>
                <Text style={styles.option_name}>{option.label}</Text>
              </View>
            </TouchableOpacity>
          ))}
          {
            isParagraph && (
              <View style={{marginTop:12,paddingLeft:12}}>
                {children}
              </View>
            )
          }
          <View style={{borderBottomWidth:1.5,borderBottomColor:app_c.HEX.ext_third,marginTop:12}}></View>
        </View>
      )}
    </View>
  );
};

export default DropDown;
