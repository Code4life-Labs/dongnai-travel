 import { View, Text, TouchableOpacity, FlatList, ScrollView} from "react-native";
import React, { useState, useEffect } from "react";

import { app_c, app_sp } from "globals/styles";
import { AppText,VerticalPlaceCard} from "components";
import styles from "./TabSlideCategoryPlaceStyle";
import { useNavigation } from "@react-navigation/native";



const tabPlaceOptions = [
  {
    id: 0,
    name: "All",
  },
  {
    id: 1,
    name: "Recommended",
  },
  {
    id: 2,
    name: "Popular",
  },
  {
    id: 3,
    name: "Most Star",
  },
  {
    id: 4,
    name: "Park",
  },
  {
    id: 5,
    name: "Walking Street",
  },
];

const fakeDataPlaces = [
  {
    id: '1a',
    name: 'Pho di bo',
    avatar: 'https://lh3.googleusercontent.com/p/AF1QipPoYDJXCAlOR3Oc0RgjhQ5WBZt9s2VkvqpbbuNN=s680-w680-h510',
    location: {
      province: 'Dong Nai',
      city: 'Bien Hoa'
    },
    tags: [
      {
        title: 'Walking'
      },
      {
        title: 'Exercise'
      }
    ],
    ratingPoints: 4.3,
    numberOfReviews: 300,
    numberOfVisited: 3200,
    isRecommended: false,
    isVisited: false,
    categoryId:1
  },
  {
    id: '1b',
    name: 'Quang truong tinh',
    avatar: 'https://lh3.googleusercontent.com/p/AF1QipPUoQ-BfuMVqLUZog0RrNnF4HVrFLXlXLQ4wak2=s680-w680-h510',
    location: {
      province: 'Dong Nai',
      city: 'Bien Hoa'
    },
    tags: [
      {
        title: 'Walking'
      },
      {
        title: 'Exercise'
      }
    ],
    ratingPoints: 4.6,
    numberOfReviews: 5687,
    numberOfVisited: 32242,
    isRecommended: true,
    isVisited: true,
    categoryId:1
  },
  {
    id: '1c',
    name: 'Hồ Trị An',
    avatar: 'https://lh3.googleusercontent.com/p/AF1QipOFHqO2nUTvyj0fYEvwt-9AHoQS8e5yajbKLjQE=s680-w680-h510',
    location: {
      province: 'Dong Nai',
      city: 'Bien Hoa'
    },
    tags: [
      {
        title: 'Walking'
      },
      {
        title: 'Exercise'
      }
    ],
    ratingPoints: 3.7,
    numberOfReviews: 1687,
    numberOfVisited: 2242,
    isRecommended: false,
    isVisited: false,
    categoryId:1
  },
  {
    id: '1d',
    name: 'Khu Du Lịch Bửu Long',
    avatar: 'https://lh3.googleusercontent.com/p/AF1QipPoYDJXCAlOR3Oc0RgjhQ5WBZt9s2VkvqpbbuNN=s680-w680-h510',
    location: {
      province: 'Dong Nai',
      city: 'Bien Hoa'
    },
    tags: [
      {
        title: 'Walking'
      },
      {
        title: 'Exercise'
      }
    ],
    ratingPoints: 4.3,
    numberOfReviews: 300,
    numberOfVisited: 3200,
    isRecommended: false,
    isVisited: false,
    categoryId:2
  },
  {
    id: '1e',
    name: 'Quang truong tinh',
    avatar: 'https://lh3.googleusercontent.com/p/AF1QipPUoQ-BfuMVqLUZog0RrNnF4HVrFLXlXLQ4wak2=s680-w680-h510',
    location: {
      province: 'Dong Nai',
      city: 'Bien Hoa'
    },
    tags: [
      {
        title: 'Walking'
      },
      {
        title: 'Exercise'
      }
    ],
    ratingPoints: 4.6,
    numberOfReviews: 5687,
    numberOfVisited: 32242,
    isRecommended: true,
    isVisited: true,
    categoryId:3
  },
  {
    id: '1f',
    name: 'Cong vien Tam Hiep',
    avatar: 'https://lh3.googleusercontent.com/p/AF1QipOFHqO2nUTvyj0fYEvwt-9AHoQS8e5yajbKLjQE=s680-w680-h510',
    location: {
      province: 'Dong Nai',
      city: 'Bien Hoa'
    },
    tags: [
      {
        title: 'Walking'
      },
      {
        title: 'Exercise'
      }
    ],
    ratingPoints: 3.7,
    numberOfReviews: 1687,
    numberOfVisited: 2242,
    isRecommended: false,
    isVisited: false,
    categoryId:4
  }
];


const TabSlideCategoryPlace = () => {
  const [tab, setTab] = useState(tabPlaceOptions[0]);
  const [post, setPost] = useState([]);
  const [selectedId, setSelectedId] = useState(0);

  const handlePressTab = ({ tab }) => {
    setTab(tab);
    setSelectedId(tab.id);
    console.log(tab.name);
  };

  console.log(selectedId);

  useEffect(() => {
    if(tab.id == 0 )
    {
      const filterPlaceById = fakeDataPlaces.map(place=>place)
      setPost(filterPlaceById)
    }
    else{
      const filterPlaceById = fakeDataPlaces.filter((place)=>place.categoryId === selectedId)
      setPost(filterPlaceById)
    }
  }, [selectedId]);

  const getButtonStyle = (buttonId) => {
    if (buttonId === selectedId) {
      return styles.active;
    }
    return styles.tab;
  };

  const colorText = (buttonId) =>{
    if(buttonId ===selectedId)
    {
      return styles.text_active
    }
    return styles.text_normal
  }

  // navigation

  const navigation=useNavigation()

  const handlePressPost=()=>{
    navigation.navigate({name: 'PlaceDetailScreen'});
  }

  return (
    <View>
      <ScrollView style={{ flexDirection: "row" }} horizontal={true} showsHorizontalScrollIndicator={false}>
        {tabPlaceOptions.map((tab, index) => {
          return (
            <TouchableOpacity
              style={[getButtonStyle(tab.id),{  marginLeft: tab.id !== tabPlaceOptions[0].id ? 14 : 0,}]}
              key={tab.id}
              onPress={() => handlePressTab({ tab })}
            >
              <AppText style={colorText(tab.id)}>{tab.name}</AppText>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
      <ScrollView style={{...app_sp.pt_12}} horizontal={true} showsHorizontalScrollIndicator={false}>
        {
          post.map(place=>(
            <TouchableOpacity onPress={handlePressPost} key={place.id}>
              <VerticalPlaceCard place={place} style={{marginLeft: place.id !== post[0].id ? 10 : 2}}/>
            </TouchableOpacity>
          ))
        }
      </ScrollView>
    </View>
  );
};

export default TabSlideCategoryPlace;
