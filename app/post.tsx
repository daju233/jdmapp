import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Slot, useLocalSearchParams, useGlobalSearchParams } from "expo-router";
import { FlashList } from "@shopify/flash-list";
import { SQLiteProvider, useSQLiteContext } from "expo-sqlite";
import { drizzle } from "drizzle-orm/expo-sqlite";
import { topics, posts, users } from "@/drizzle/schema";
import { eq, desc, sql } from "drizzle-orm";

function Content() {
  const { id } = useGlobalSearchParams();

  const sqlite_db = useSQLiteContext();
  const db = drizzle(sqlite_db);

  const title = db
    .select({ title: topics.title, category_name: topics.category_name })
    .from(topics)
    .where(sql`id=${id}`)
    .all();

  const all_post = db
    .select()
    .from(users)
    .leftJoin(posts, eq(users.id, posts.user_id))
    .where(sql`${posts.topic_id} = ${id}`)
    .all();

  return (
    <>
      <Text
        style={{
          fontWeight: "bold",
          fontSize: 20,
        }}
      >
        {title[0].title}
        <Text
          style={{
            color: "blue",
            fontWeight: "bold",
            fontSize: 15,
          }}
        >
          {"  "}
          {title[0].category_name}
        </Text>
      </Text>
      <FlashList
        numColumns={1}
        estimatedItemSize={70}
        data={all_post}
        renderItem={({ item: post }) => (
          <>
            <Text
              style={{
                color: "brown",
                textAlign: "left",
              }}
            >
              {post.users.name}
            </Text>
            <Text style={{ color: "green", textAlign: "left" }}>
              {post.posts?.raw}
              {"\n"}
            </Text>
          </>
        )}
      ></FlashList>
    </>
  );
}

export default function Route() {
  return (
    <View style={styles.container}>
      <SQLiteProvider
        databaseName="xmen.db"
        assetSource={{ assetId: require("../assets/db/xmen.db") }}
      >
        <Content />
      </SQLiteProvider>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
  },
});
