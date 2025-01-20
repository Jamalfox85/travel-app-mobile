import React from "react";
import {
  View,
  Text,
  Button,
  StyleSheet,
  Dimensions,
  Linking,
} from "react-native";
import moment from "moment";

const { width } = Dimensions.get("window");

const ArticleGroup = ({ newsResults }: { newsResults: any[] }) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>News Articles</Text>
        <Button
          title="See More"
          onPress={() => {
            /* Handle see more action */
          }}
        />
      </View>
      <View style={styles.mainContent}>
        <View
          style={[
            styles.fullWidthArticle,
            { backgroundImage: `url(${newsResults[0]?.image})` },
          ]}
        >
          {newsResults[0]?.title && (
            <Text style={styles.articleTitle} numberOfLines={2}>
              {newsResults[0].title}
            </Text>
          )}
          {newsResults[0]?.author && <Text>{newsResults[0].author}</Text>}
          {newsResults[0]?.published_at && (
            <Text>
              {moment(newsResults[0].published_at).format("MMM DD, YYYY")}
            </Text>
          )}
          {newsResults[0]?.url && (
            <Text
              style={styles.link}
              onPress={() => Linking.openURL(newsResults[0].url)}
            >
              Read More
            </Text>
          )}
        </View>
        <View style={styles.halfWidthContainer}>
          {newsResults.slice(1, 3).map((article, index) => (
            <View
              key={index}
              style={[
                styles.halfWidthArticle,
                { backgroundImage: `url(${article?.image})` },
              ]}
            >
              {article?.title && (
                <Text style={styles.articleTitle} numberOfLines={2}>
                  {article.title}
                </Text>
              )}
              {article?.author && <Text>{article.author}</Text>}
              {article?.published_at && (
                <Text>
                  {moment(article.published_at).format("MMM DD, YYYY")}
                </Text>
              )}
              {article?.url && (
                <Text
                  style={styles.link}
                  onPress={() => Linking.openURL(article.url)}
                >
                  Read More
                </Text>
              )}
            </View>
          ))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  headerText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  mainContent: {
    flex: 1,
  },
  fullWidthArticle: {
    flexGrow: 1,
    height: 200,
    backgroundColor: "#CBC3E350",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
    padding: 10,
  },
  halfWidthContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  halfWidthArticle: {
    maxWidth: (width - 50) / 2,
    flexGrow: 1,
    height: 100,
    backgroundColor: "#CBC3E3",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    margin: 4,
    padding: 10,
  },
  link: {
    color: "#1E90FF",
    marginBottom: 5,
  },
  articleTitle: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 5,
    overflow: "hidden",
    width: "100%",
  },
});

export default ArticleGroup;
