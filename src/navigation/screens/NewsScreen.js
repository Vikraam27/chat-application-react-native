import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Linking,
  Platform,
  SafeAreaView, ScrollView, StyleSheet, Text, TouchableWithoutFeedback, View,
} from 'react-native';
import FetchAPI from '../../api';
import NewsCard from '../../components/NewsCard';
import color from '../../styles/color';

export default function NewsScreen({ navigation }) {
  const category = ['all', 'business', 'entertainment', 'general', 'health', 'science', 'sports', 'technology'];
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [page, setPage] = useState(1);
  const [news, setNews] = useState([]);

  useEffect(() => {
    getNews();
    console.log(page);
  }, [selectedCategory, page]);

  const getNews = async () => {
    const res = await FetchAPI.getAllNews(selectedCategory, page);
    setNews((prev) => ([
      ...prev,
      ...res.results,
    ]));
  };

  const navigateArticle = (item) => {
    if (Platform.OS !== 'web') {
      return navigation.navigate('article', { item });
    }

    return Linking.openURL(item.link);
  };
  return (
    <SafeAreaView style={styles.main}>
      <View style={styles.headers}>
        <Text style={{
          color: color.white, fontSize: 40, fontWeight: '700', fontFamily: 'Comfortaa-Medium',
        }}
        >
          News
        </Text>
      </View>
      <View style={{ marginBottom: 5 }}>
        <ScrollView
          horizontal
          style={styles.category}
          contentContainerStyle={{ height: 65 }}
          showsHorizontalScrollIndicator={false}
        >
          {category.map((item) => (
            <TouchableWithoutFeedback
              key={item}
              onPress={() => {
                setSelectedCategory(item);
                setPage(1);
                setNews([]);
              }}
            >
              <Text style={[styles.categoryItem,
                selectedCategory === item ? { backgroundColor: color.darkBlue }
                  : { backgroundColor: color.secondaryColor }]}
              >
                {item}

              </Text>
            </TouchableWithoutFeedback>
          ))}
        </ScrollView>
      </View>
      {news.length ? (
        <FlatList
          style={{ marginTop: 20 }}
          data={news}
          renderItem={({ item }) => (
            <NewsCard
              item={item}
              onPress={() => navigateArticle(item)}
            />
          )}
          keyExtractor={(_, index) => `key${index}`}
          onEndReachedThreshold={0.9}
          onEndReached={() => setPage(page + 1)}
        />
      ) : (
        <View style={{
          position: 'absolute', top: '50%', right: 0, left: 0,
        }}
        >
          <ActivityIndicator size="large" color={color.darkBlue} />
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  main: {
    backgroundColor: color.mainColor,
    flex: 1,
    margin: 0,
  },
  headers: {
    marginTop: 60,
    marginLeft: 20,
  },
  category: {
    flexGrow: 0,
  },
  categoryItem: {
    margin: 10,
    padding: 10,
    color: color.white,
    borderRadius: 60,
  },
});
