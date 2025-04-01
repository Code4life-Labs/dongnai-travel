import React from "react";
import { View, ScrollView } from "react-native";

// Import components
import { FC } from "@/components";

export default function BlogDetailSkeleton() {
  return (
    <View style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
        {/* Author, Blog information section */}
        <View style={{ padding: 16, borderBottomWidth: 1 }}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginBottom: 12,
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <FC.Skeleton width={48} height={48} />
              <View style={{ marginLeft: 12 }}>
                <FC.Skeleton width={120} height={20} />
                <FC.Skeleton width={80} height={16} style={{ marginTop: 4 }} />
              </View>
            </View>
            <FC.Skeleton width={80} height={30} />
          </View>
          <FC.Skeleton width={200} height={28} style={{ marginBottom: 12 }} />
          <View style={{ flexDirection: "row" }}>
            <FC.Skeleton width={40} height={40} style={{ marginRight: 8 }} />
            <FC.Skeleton width={40} height={40} />
          </View>
        </View>

        {/* Blog Content */}
        <View style={{ padding: 16 }}>
          <FC.Skeleton
            width={"100%"}
            height={200}
            style={{ marginBottom: 16 }}
          />
          <FC.Skeleton width={"90%"} height={20} style={{ marginBottom: 8 }} />
          <FC.Skeleton width={"80%"} height={20} style={{ marginBottom: 8 }} />
          <FC.Skeleton width={"95%"} height={20} style={{ marginBottom: 8 }} />
        </View>

        {/* Related Blogs */}
        <View style={{ padding: 16 }}>
          <FC.Skeleton width={150} height={24} style={{ marginBottom: 12 }} />
          <View>
            {[...Array(3)].map((_, index) => (
              <FC.Skeleton
                key={index}
                width={"100%"}
                height={100}
                style={{ marginBottom: 12 }}
              />
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Float container */}
      <View
        style={{
          position: "absolute",
          bottom: 16,
          left: 16,
          right: 16,
          flexDirection: "row",
          padding: 12,
          borderRadius: 8,
        }}
      >
        <FC.Skeleton width={40} height={40} style={{ marginRight: 8 }} />
        <FC.Skeleton width={40} height={40} />
      </View>
    </View>
  );
}
