import {
  View,
  Text,
  ImageBackground,
  Image,
  TouchableOpacity,
  ScrollView,
  LayoutAnimation,
  UIManager,
  Platform,
} from "react-native";
import React from "react";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";

import { getWeatherForecastAPI } from "apis/axios";

import styles from "./WeatherScreenStyles";
import { app_c, app_typo } from "globals/styles";

import { weatherImages } from "utilities/mapdata";

import { selectCurrentMap } from "redux/map/mapSlice";

import { AppText } from "components";

function capitalizeFirstLetter(str) {
  // Kiểm tra xem chuỗi có độ dài hợp lệ không (không phải rỗng)
  if (!str || str.length === 0) {
    return str;
  }

  // Viết hoa chữ cái đầu tiên và ghép nối với phần còn lại của chuỗi
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// List days off week

const WeatherDailyBlock = ({ item }) => {
  const data= item;
  const dateString = item.dt_txt;
  const date = new Date(dateString);
  const dayOfWeek = date.getDay();
  const weekdays = [
    "Chủ nhật",
    "Thứ hai",
    "Thứ ba",
    "Thứ tư",
    "Thứ năm",
    "Thứ sáu",
    "Thứ bảy",
  ];
  const dayOfMonth = date.getDate();
  const month = date.getMonth();
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const months = ["1","2","3","4","5","6","7","8","9","10","11","12"];
  const dayOfWeekName = weekdays[dayOfWeek];
  const monthName = months[month];
  const timeConcatenated = `${hours}:${minutes}`;


  const [showWeatherHourlyBlock, setShowWeatherHourlyBlock] = useState(false);
  const handleShowWeatherHourlyBlock = () => {
    setShowWeatherHourlyBlock(!showWeatherHourlyBlock);
    //set layout animatiion
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
  };


  // Thêm dòng này để cho phép LayoutAnimation hoạt động trên Android
  if (Platform.OS === "android") {
    UIManager.setLayoutAnimationEnabledExperimental &&
      UIManager.setLayoutAnimationEnabledExperimental(true);
  }
  const dropWeatherDailyBlock = () => {
    if (showWeatherHourlyBlock) {
      return (
        /*
        <ScrollView
          style={styles.weather_hourly_table}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
        >
          <View style={styles.weather_hourly_info}>
            <AppText style={styles.weather_time}>Bây giờ</AppText>
            <Image
              source={require("../../assets/images/weather_forcast/sunny.png")}
              resizeMode="cover"
              style={styles.weather_hourly_image}
              key={1}
            />
            <AppText style={styles.weather_hourly_temperature}>31°C</AppText>
          </View>
          <View style={styles.weather_hourly_info}>
            <AppText style={styles.weather_time}>Bây giờ</AppText>
            <Image
              source={require("../../assets/images/weather_forcast/sunny.png")}
              resizeMode="cover"
              style={styles.weather_hourly_image}
              key={2}
            />
            <AppText style={styles.weather_hourly_temperature}>31°C</AppText>
          </View>

          <View style={styles.weather_hourly_info}>
            <AppText style={styles.weather_time}>Bây giờ</AppText>
            <Image
              source={require("../../assets/images/weather_forcast/sunny.png")}
              resizeMode="cover"
              style={styles.weather_hourly_image}
            />
            <AppText style={styles.weather_hourly_temperature}>31°C</AppText>
          </View>
          <View style={styles.weather_hourly_info}>
            <AppText style={styles.weather_time}>Bây giờ</AppText>
            <Image
              source={require("../../assets/images/weather_forcast/sunny.png")}
              resizeMode="cover"
              style={styles.weather_hourly_image}
            />
            <AppText style={styles.weather_hourly_temperature}>31°C</AppText>
          </View>
        </ScrollView>
        */
        <View style={styles.dropdown_container}>
          <View style={ styles.dropdown_content}>
            {
              weatherImages.map((img,index) => {
                if( img.id === data.weather[0].icon)
                {
                  return <Image source={img.image} key={index} style={styles.dropdown_img}/>
                }
                return null
              }
              )
            }
            <AppText style={styles.dropdown_desc}>{capitalizeFirstLetter(data.weather[0].description)}</AppText>
          </View>
          <View style={styles.dropdown_content}>
            <View style={styles.content}>
              <AppText style={styles.title_info}>Nhiệt độ</AppText>
              <AppText>{data?.main?.temp} °C</AppText>
            </View>
            <View style={styles.content}>
              <AppText style={styles.title_info}>Gió</AppText>
              <AppText>{data?.wind?.speed} km/h</AppText>
            </View>
          </View>
          <View style={ styles.dropdown_content}>
            <View style={styles.content}>
              <AppText style={styles.title_info}>Độ ẩm</AppText>
              <AppText>{data?.main?.humidity} %</AppText>
            </View>
            <View style={styles.content}>
              <AppText style={styles.title_info}>Tầm nhìn</AppText> 
              <AppText>{(data?.visibility / 1000).toFixed(1)} km</AppText>
            </View>
          </View>
          <View style={ styles.dropdown_content}>
            <View style={styles.content}>
              <AppText style={styles.title_info}>Mây</AppText>
              <AppText>{data?.clouds.all} %</AppText>
            </View>
            <View style={styles.content}>
              <AppText style={styles.title_info}>Tỉ lệ mưa</AppText> 
              <AppText>{(data?.pop)*100} %</AppText>
            </View>
          </View>
        </View>
      );
    }
  };
  //Viết hoa chữ cái đầu
  function capitalizeFirstLetter(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }


   

  return (
    <>
      <TouchableOpacity
        style={styles.weather_daily_info_block}
        onPress={handleShowWeatherHourlyBlock}
      >
        <View style={styles.weather_daily_info}>
          <AppText
            style={[
              styles.weather_daily_name,
              styles.font_weather_daily_info,
              styles.fw_600,
            ]}
          >
            {[dayOfWeekName,"  ",]}
            <AppText style={{marginLeft:12, fontSize:22,fontWeight:'700'}}>{timeConcatenated}</AppText>
          </AppText>
          {/* <Image
            source={require("../../assets/images/weather/02d.png")}
            resizeMode="cover"
            style={styles.weather_daily_image}
          /> */}
          {
            weatherImages.map(weatherImage => {
              if(weatherImage.id === item.weather[0].icon)
              {
                return <Image
                source={weatherImage.image}
                resizeMode="cover"
                style={styles.weather_daily_image}
                key={weatherImage.id}
              />
              }
            })
          }
          <AppText style={styles.weather_daily_value}>
            <AppText>
              <Text style={{fontSize:16, fontWeight:'700'}}>{item.main.temp.toFixed(1)}°C</Text>
              <Text style={{fontSize:18, fontWeight:'900'}}> - </Text>
              <Text style={{fontSize:16}}>{capitalizeFirstLetter(item.weather[0].description)}</Text>
            </AppText>
          </AppText>
        </View>
      </TouchableOpacity>
      {showWeatherHourlyBlock && dropWeatherDailyBlock()}
    </>
  );
};

//Main
const WeatherScreen = () => {
  // weather current
  const [temp, setTemp] = useState(null);
  const [maxTemperature, setMaxTemperature] = useState(null);
  const [minTemperature, setMinTemperature] = useState(null);
  const [place, setPlace] = useState(null);
  const [feelLike, setFeelLike] = useState(null);
  const [desc, setDesc] = useState(null);
  const [iconWeather, setIconWeather] = useState(null);
  const [humidity, setHumidity] = useState(null);
  const [wind, setWind] = useState(null);
  const [day, setDay] = useState(null);
  //weather forecast

  const [weatherForecast, setWeatherForecast] = useState([]);
  const [hours,setHours] = useState([])

  const dateString = day;
  const date = new Date(dateString);
  const dayOfWeek = date.getDay();
  const weekdays = [
    "Chủ nhật",
    "Thứ hai",
    "Thứ ba",
    "Thứ tư",
    "Thứ năm",
    "Thứ sáu",
    "Thứ bảy",
  ];
  const dayOfMonth = date.getDate();
  const month = date.getMonth();
  const months = [
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    "11",
    "12",
  ];
  const dayOfWeekName = weekdays[dayOfWeek];
  const monthName = months[month];

  const currentMap = useSelector(selectCurrentMap);
  const getWeatherForecast = async (location) => {
    await getWeatherForecastAPI(location).then((data) => {
      // weather current
      setTemp(data.weatherCurrent.main.temp.toFixed(1));
      setPlace(data.weatherCurrent.name);
      setMaxTemperature(data.weatherCurrent.main.temp_max);
      setMinTemperature(data.weatherCurrent.main.temp_min);
      setFeelLike(data.weatherCurrent.main.feels_like);
      setHumidity(data.weatherCurrent.main.humidity);
      setDesc(data.weatherCurrent.weather[0].description);
      setIconWeather(data.weatherCurrent.weather[0].icon);
      setWind(data.weatherCurrent.wind.speed);
      setDay(data.weatherForecast[0].dt_txt);
      // weather forecast
      setWeatherForecast(data.weatherForecast)

    });
  };

  useEffect(() => {
    // Đức: Nếu có địa điểm người dùng thì
    if (currentMap.userLocation) {
      getWeatherForecast(currentMap.userLocation);
    }
  }, [currentMap.userLocation]);

  return (
    <ScrollView>
      <ImageBackground
        source={require("../../assets/images/background_weather/pexels-lua-morales-2335767.jpg")}
        resizeMode="cover"
        style={styles.background_weather_image}
      >
        <View style={styles.main_weather_info}>
          <View style={styles.main_weather_info_element}>
            <AppText
              style={[
                styles.address,
                { ...app_typo.fonts.normal.bolder.h2, color: "#FFF" },
              ]}
            >
              {place}
            </AppText>
            <AppText
              style={[
                styles.dateTime,
                { ...app_typo.fonts.normal.normal.h5, color: "#FFF" },
              ]}
            >
              {[dayOfWeekName, ", ", dayOfMonth, "-", monthName]}
            </AppText>
          </View>
          <View style={styles.main_weather_info_element}>
            <View style={styles.temperature_block}>
              {weatherImages.map((item) => {
                if (item.id === iconWeather) {
                  return (
                    <Image
                      source={item.image}
                      style={styles.weather_curr_img}
                      key={item.id}
                    />
                  );
                }
                return null;
              })}

              <AppText style={styles.weather_forecast_degree}>{temp}°C</AppText>
            </View>
          </View>
          <View
            style={[
              styles.main_weather_info_element,
              { justifyContent: "flex-start" },
            ]}
          >
            <AppText
              style={[
                styles.dateTime,
                { ...app_typo.fonts.normal.normal.h3, color: "#FFF" },
              ]}
            >
              {capitalizeFirstLetter(desc)}
            </AppText>
            <AppText style={[styles.weather_current_desc, { lineHeight: 40 }]}>
              <AppText
                style={[
                  styles.dateTime,
                  { ...app_typo.fonts.normal.lighter.h5, color: "#FFF" },
                ]}
              >
                Tỉ lê mây:{" "}
                <Text style={styles.weather_current_value}>{humidity}%</Text>
              </AppText>
              <AppText
                style={{ ...app_typo.fonts.normal.bolder.h4, color: "#FFF" }}
              >
                {" "}
                -{" "}
              </AppText>
              <AppText
                style={[
                  styles.dateTime,
                  { ...app_typo.fonts.normal.lighter.h5, color: "#FFF" },
                ]}
              >
                Tốc độ gió:{" "}
                <Text style={styles.weather_current_value}>{wind} km/h</Text>
              </AppText>
            </AppText>
          </View>
        </View>
      </ImageBackground>
      <View style={styles.weather_table_info}>
        {weatherForecast.map((item,index) => {
          return <WeatherDailyBlock item={item} key={index} />;
        })}
      </View>
    </ScrollView>
  );
};

export default WeatherScreen;
