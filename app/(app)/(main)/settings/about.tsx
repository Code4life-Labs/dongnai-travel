import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

export default function About() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Về Code4Life</Text>
        
        <Text style={styles.paragraph}>
          Code4Life là một tổ chức nghiên cứu, một cộng đồng học thuật tập trung vào việc nghiên cứu các lý thuyết và công nghệ trong lĩnh vực công nghệ thông tin. 
          Được thành lập bởi 4 thành viên là sinh viên đại học năm cuối (tính đến năm 2024), những người đã cùng nhau thực hiện nhiều dự án có giá trị.
        </Text>
        
        <Text style={styles.paragraph}>
          Với tư cách là một nhóm sinh viên năm cuối, chúng tôi tập trung nghiên cứu các lý thuyết và định hướng phát triển trong nhiều lĩnh vực của ngành IT. 
          Chúng tôi mong muốn các dự án và nghiên cứu của mình sẽ đóng góp vào sự phát triển của cộng đồng lập trình viên tại Việt Nam nói riêng và trên toàn cầu nói chung. 
          Ngoài ra, Code4Life còn hướng đến việc phát triển các thư viện, công cụ và tiện ích mở rộng phục vụ cho các dự án cá nhân, dự án nhóm, và trên hết là đặt trọn tâm huyết để cống hiến cho cộng đồng.
        </Text>
        
        <Text style={styles.paragraph}>
          Code4Life là nơi các thành viên lưu trữ và chia sẻ kiến thức chuyên môn, kinh nghiệm quý báu thông qua các buổi thảo luận chuyên đề và các bài viết học thuật. 
          Chúng tôi không chỉ nhìn lại những kiến thức đã tích lũy được mà còn xây dựng một nguồn tài nguyên giáo dục giúp những người mới bắt đầu có cái nhìn toàn diện và thực tế hơn về ngành công nghệ thông tin.
        </Text>
        
        <Text style={styles.paragraph}>
          <Text style={styles.question}>Vì sao chúng tôi chọn tên Code For Life (Code4Life)?</Text> Bởi vì chúng tôi xác định lập trình không chỉ là một nghề nghiệp, 
          mà còn là niềm đam mê, là con đường mà chúng tôi cam kết theo đuổi suốt đời.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  paragraph: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 16,
    textAlign: 'justify',
  },
  question: {
    fontWeight: 'bold',
  }
});