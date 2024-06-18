import { app_c } from "globals/styles";
import React, { Component, useEffect, useState } from "react";
import { View, Image, StatusBar, Dimensions } from "react-native";
import Swiper from "react-native-swiper";
import { languageData } from "../../utilities/language";
import { useSelector } from "react-redux";
const { width, height } = Dimensions.get("window");
import { selectCurrentLanguage } from 'redux/language/LanguageSlice'


const HomeBannerSlider = ()=>{

  const langCode = useSelector(selectCurrentLanguage).languageCode // vi or en 
  const [ banners, setBanner ] =  useState([])

  useEffect(()=>{
    if(langCode === 'vi')
    {
      setBanner(bannersVi)
    }
    if(langCode === 'en')
    {
      setBanner(bannersEn)
    }
  })
  
  return (
    <View style={styles.container}>
      
      <Swiper
        style={styles.wrapper}
        // autoplay
        loop
        dot={
          <View
            style={styles.dot}
          />
        }
        activeDot={
          <View
            style={styles.active_dot}
          />
        }
        paginationStyle={{
          bottom: -12,
        }}
      >
          {
            banners.map((banner,index)=>{
              return(
              <View key={index} style={styles.slide}>
                <Image
                  style={styles.image}
                  source={{uri : banner}}
                  resizeMode="cover"
                />
              </View>
              )
            })
          }
      </Swiper>
    </View>
  );
}

export default HomeBannerSlider
    
const styles = {
  wrapper: {
    // backgroundColor: '#f00'
  },

  slide: {
    height:200,
    backgroundColor: "transparent",
  },
  container: {
    height:200
  },

  imgBackground: {
    width,
    height,
    backgroundColor: "transparent",
    position: "absolute",
  },

  image: {
    height:200,
  },
  dot:{
    backgroundColor:app_c.HEX.ext_third,
    width: 8,
    height: 8,
    borderRadius: 4,
    marginLeft: 3,
    marginRight: 3,
  },
  active_dot:{
    backgroundColor: app_c.HEX.third,
    width: 8,
    height: 8,
    borderRadius: 4,
    marginLeft: 3,
    marginRight: 3,
  }
};

const bannersVi = [
  'https://res.cloudinary.com/dbtb0sjby/image/upload/v1685983477/banners/vi/1_nqx0pu.jpg',
  'https://res.cloudinary.com/dbtb0sjby/image/upload/v1685983478/banners/vi/3_i3makt.jpg',
  'https://res.cloudinary.com/dbtb0sjby/image/upload/v1685983478/banners/vi/5_uijds1.jpg',
  'https://res.cloudinary.com/dbtb0sjby/image/upload/v1685983475/banners/vi/7_hnspu5.jpg',
  'https://res.cloudinary.com/dbtb0sjby/image/upload/v1685983476/banners/vi/9_w9iskz.jpg',
  'https://res.cloudinary.com/dbtb0sjby/image/upload/v1685983476/banners/vi/11_brt1fg.jpg',
  'https://res.cloudinary.com/dbtb0sjby/image/upload/v1685983478/banners/vi/13_vd6g6b.jpg',
  'https://res.cloudinary.com/dbtb0sjby/image/upload/v1685983477/banners/vi/15_uaiyk7.jpg',
  'https://res.cloudinary.com/dbtb0sjby/image/upload/v1685983477/banners/vi/17_dvgaqn.jpg',
  'https://res.cloudinary.com/dbtb0sjby/image/upload/v1685983476/banners/vi/19_bxjlbj.jpg'
];
const bannersEn = [
  'https://res.cloudinary.com/dbtb0sjby/image/upload/v1685983504/banners/en/2_vwpe7c.jpg',
  'https://res.cloudinary.com/dbtb0sjby/image/upload/v1685983504/banners/en/4_trp9xj.jpg',
  'https://res.cloudinary.com/dbtb0sjby/image/upload/v1685983504/banners/en/6_tdup44.jpg',
  'https://res.cloudinary.com/dbtb0sjby/image/upload/v1685983502/banners/en/8_srf8ww.jpg',
  'https://res.cloudinary.com/dbtb0sjby/image/upload/v1685983502/banners/en/10_hcpe5m.jpg',
  'https://res.cloudinary.com/dbtb0sjby/image/upload/v1685983502/banners/en/12_kilqkr.jpg',
  'https://res.cloudinary.com/dbtb0sjby/image/upload/v1685983502/banners/en/14_dynbxz.jpg',
  'https://res.cloudinary.com/dbtb0sjby/image/upload/v1685983503/banners/en/16_xad7dt.jpg',
  'https://res.cloudinary.com/dbtb0sjby/image/upload/v1685983503/banners/en/18_ffz6co.jpg',
  'https://res.cloudinary.com/dbtb0sjby/image/upload/v1685983503/banners/en/20_lnzglb.jpg'
];