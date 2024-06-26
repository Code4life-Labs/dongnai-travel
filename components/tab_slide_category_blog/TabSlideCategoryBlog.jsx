import { View, Text, TouchableOpacity, FlatList, ScrollView} from "react-native";
import React, { useState, useEffect } from "react";

import { app_c, app_sp } from "globals/styles";
import { AppText, VerticalBlogCard} from "components";
import styles from "./TabSlideCategoryBlogStyle";
import { useNavigation } from "@react-navigation/native";



const tabBlogOptions = [
  {
    id: 0,
    name: "All",
  },
  {
    id: 1,
    name: "Following",
  },
  {
    id: 2,
    name: "Trending",
  },
  {
    id: 3,
    name: "Most Star",
  },
];

const fakeDataBlogs = [
  {
    id: 'b1',
    user: {
      id: 'user1',
      name: 'Lost Teach',
      avatar: ''
    },
    name: 'Top 10 dia diem neu ghe qua khi du lich o Dong Nai',
    avatar: '',
    createdAt: 1675908513000,
    readTime: 480,
    isLiked: true,
    categoryId:1
  },
  {
    id: 'b2',
    user: {
      id: 'user1',
      name: 'Lost Teach',
      avatar: ''
    },
    name: 'Top 10 dia diem neu ghe qua khi du lich o Dong Nai',
    avatar: '',
    createdAt: 1675908513000,
    readTime: 480,
    isLiked: true,
    categoryId:2
  },
];


const TabSlideCategoryBlog = () => {
  const [tab, setTab] = useState(tabBlogOptions[0]);
  const [post, setPost] = useState([]);
  const [selectedId, setSelectedId] = useState(0);
  const [background, setBackground] = useState(...app_c.HEX.fourth);

  const handlePressTab = ({ tab }) => {
    setTab(tab);
    setSelectedId(tab.id);
    console.log(tab.name);
    console.log(tab.id)
  };
  console.log(selectedId);

  useEffect(() => {
    if(tab.id == 0 )
    {
      const filterBlogById = fakeDataBlogs.map(blog=>blog)
      setPost(filterBlogById)
    }
    else{
      const filterBlogById = fakeDataBlogs.filter((blog)=>blog.categoryId === selectedId)
      setPost(filterBlogById)
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

  const navigation=useNavigation()

  const handlePressPost=()=>{
    navigation.navigate({name: 'BlogDetailScreen'});
  }

  return (
    <View>
      <ScrollView style={{ flexDirection: "row" }} horizontal={true} showsHorizontalScrollIndicator={false}>
        {tabBlogOptions.map((tab, index) => {
          return (
            <TouchableOpacity
              style={[getButtonStyle(tab.id),{  marginLeft: tab.id !== tabBlogOptions[0].id ? 14 : 0,}]}
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
          post.map(blog=>(
            <TouchableOpacity onPress={handlePressPost} key={blog.id}>
              <VerticalBlogCard blog={blog}  style={{marginLeft: blog.id !== post[0].id ? 10 : 2,}}/>
              </TouchableOpacity>
          ))
        }
      </ScrollView>
    </View>
  );
};

export default TabSlideCategoryBlog;
