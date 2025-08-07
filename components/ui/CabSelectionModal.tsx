import BottomSheet, { BottomSheetFlatList } from "@gorhom/bottom-sheet";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Dimensions,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Animated, {
  Easing,
  Extrapolate,
  interpolate,
  runOnJS,
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/Feather";

export type CabDataType = {
  id: string;
  title: string;
  description: string;
  price: string;
  capacity: number; 
  luggage: string; 
  imageUrl: string; 
  category: "Budget" | "Premium" | "Eco" | "Family" | "All";
  fuelType: "Petrol" | "Diesel" | "Electric" | "Hybrid";
  estimatedArrival: string;
};

const DATA: CabDataType[] = [
  {
    id: "1",
    title: "Mini",
    description: "Affordable and compact",
    price: "₹99",
    capacity: 3,
    luggage: "1 small bag",
    imageUrl: "https://img.icons8.com/color/512/taxi--v2.png",
    category: "Budget",
    fuelType: "Petrol",
    estimatedArrival: "4 mins",
  },
  {
    id: "2",
    title: "Sedan",
    description: "Comfortable ride for city travel",
    price: "₹149",
    capacity: 4,
    luggage: "2 medium bags",
    imageUrl: "https://img.icons8.com/color/512/taxi--v2.png",
    category: "Budget",
    fuelType: "Petrol",
    estimatedArrival: "3 mins",
  },
  {
    id: "3",
    title: "SUV",
    description: "Spacious and rugged, great for families",
    price: "₹199",
    capacity: 6,
    luggage: "3 large bags",
    imageUrl: "https://img.icons8.com/color/512/taxi--v2.png",
    category: "Family",
    fuelType: "Diesel",
    estimatedArrival: "6 mins",
  },
  {
    id: "4",
    title: "Auto",
    description: "Quick and economical three-wheeler",
    price: "₹59",
    capacity: 2,
    luggage: "1 small bag",
    imageUrl: "https://img.icons8.com/color/512/taxi--v2.png",
    category: "Budget",
    fuelType: "Petrol",
    estimatedArrival: "2 mins",
  },
  {
    id: "5",
    title: "Luxury",
    description: "Premium ride with executive comfort",
    price: "₹299",
    capacity: 4,
    luggage: "2 large bags",
    imageUrl: "https://img.icons8.com/color/512/taxi--v2.png",
    category: "Premium",
    fuelType: "Petrol",
    estimatedArrival: "9 mins",
  },
  {
    id: "6",
    title: "Electric",
    description: "Eco-friendly and quiet ride",
    price: "₹179",
    capacity: 4,
    luggage: "2 medium bags",
    imageUrl: "https://img.icons8.com/color/512/taxi--v2.png",
    category: "Eco",
    fuelType: "Electric",
    estimatedArrival: "5 mins",
  },
  {
    id: "7",
    title: "Hybrid",
    description: "Smart, fuel-efficient and green",
    price: "₹209",
    capacity: 4,
    luggage: "2 medium bags",
    imageUrl: "https://img.icons8.com/color/512/taxi--v2.png",
    category: "Eco",
    fuelType: "Hybrid",
    estimatedArrival: "7 mins",
  },
  {
    id: "8",
    title: "Van",
    description: "Spacious for groups and luggage",
    price: "₹249",
    capacity: 8,
    luggage: "4 large bags",
    imageUrl: "https://img.icons8.com/color/512/taxi--v2.png",
    category: "Family",
    fuelType: "Diesel",
    estimatedArrival: "10 mins",
  },
  {
    id: "9",
    title: "Convertible",
    description: "Open-air premium driving experience",
    price: "₹349",
    capacity: 2,
    luggage: "1 small bag",
    imageUrl: "https://img.icons8.com/color/512/taxi--v2.png",
    category: "Premium",
    fuelType: "Petrol",
    estimatedArrival: "12 mins",
  },
  {
    id: "10",
    title: "Bike",
    description: "Fast and nimble for solo riders",
    price: "₹49",
    capacity: 1,
    luggage: "No luggage",
    imageUrl: "https://img.icons8.com/color/512/taxi--v2.png",
    category: "Budget",
    fuelType: "Petrol",
    estimatedArrival: "2 mins",
  },
];

const categories = ["All", "Budget", "Premium", "Eco", "Family"];
const SCREEN_HEIGHT = Dimensions.get("window").height;

interface Props {
  visible: boolean;
  onSelect: (item: CabDataType | undefined) => void;
}

export const CabTypeModal = ({ visible, onSelect }: Props) => {
  const { top } = useSafeAreaInsets();
  const sheetRef = useRef<BottomSheet>(null);
  const listRef = useRef<React.ComponentRef<typeof BottomSheetFlatList>>(null);

  const [showTopHeader, setShowTopHeader] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const SCREEN_HEIGHT = Dimensions.get("window").height;
  const [lockedToFullScreen, setLockedToFullScreen] = useState(false);

  const animatedPosition = useSharedValue(0);
  const bounce = useSharedValue(0);

  const snapPoints = useMemo(() => ["50%", "100%"], []);

  const filteredData = useMemo(() => {
    if (selectedCategory === "All") return DATA;
    return DATA.filter((item) => {
      const price = Number(item.price.replace("₹", ""));
      if (selectedCategory === "Budget") return price <= 100;
      if (selectedCategory === "Premium") return price > 200;
      if (selectedCategory === "Eco")
        return item.title.includes("Electric") || item.title.includes("Hybrid");
      if (selectedCategory === "Family")
        return item.title.includes("SUV") || item.title.includes("Van");
      return true;
    });
  }, [selectedCategory]);

  useEffect(() => {
    bounce.value = withRepeat(
      withTiming(1, {
        duration: 800,
        easing: Easing.inOut(Easing.quad),
      }),
      -1,
      true
    );
  }, []);

  useAnimatedReaction(
    () => animatedPosition.value,
    (value, prev) => {
      if (value === prev) return;

      if (!lockedToFullScreen) {
        const shouldShow = value < 0.95;
        runOnJS(setShowTopHeader)(shouldShow);
      }
    },
    [lockedToFullScreen]
  );

  const animatedHeaderStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      animatedPosition.value,
      [0, 0.8, 1],
      [1, 1, 0],
      Extrapolate.CLAMP
    );
    const translateY = interpolate(
      animatedPosition.value,
      [0, 0.8, 1],
      [0, 0, -20],
      Extrapolate.CLAMP
    );
    return { opacity, transform: [{ translateY }] };
  });

  const arrowStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: bounce.value * 6 }],
      opacity: showTopHeader ? 1 : 0,
    };
  });

  const renderItem = useCallback(
    ({ item }: { item: CabDataType }) => (
      <Pressable style={styles.item} onPress={() => onSelect(item)}>
        <View style={styles.itemTopRow}>
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: item.imageUrl }}
              style={styles.image}
              resizeMode="contain"
            />
          </View>

          <View style={styles.itemInfo}>
            <Text style={styles.itemTitle}>{item.title}</Text>
            <Text style={styles.itemDescription}>{item.description}</Text>

            <View style={styles.metaRow}>
              <Text style={styles.metaText}>👥 {item.capacity}</Text>
              <Text style={styles.metaText}>🧳 {item.luggage}</Text>
              <Text style={styles.metaText}>⚡ {item.fuelType}</Text>
            </View>
          </View>

          <View style={styles.rightInfo}>
            <Text style={styles.itemPrice}>{item.price}</Text>
            <Text style={styles.etaText}>{item.estimatedArrival}</Text>
          </View>
        </View>
      </Pressable>
    ),
    [onSelect]
  );

  const handleMinimize = () => {
    setLockedToFullScreen(false);
    sheetRef.current?.snapToIndex(0);
  };

  if (!visible) return null;

  return (
    <BottomSheet
      ref={sheetRef}
      snapPoints={snapPoints}
      index={0}
      enablePanDownToClose
      enableOverDrag={false}
      enableDynamicSizing={false}
      onClose={() => {
        handleMinimize()
        // setLockedToFullScreen(false);
        onSelect(undefined);
        // sheetRef.current?.snapToIndex(0);
      }}
      animatedPosition={animatedPosition}
      handleComponent={() => null}
      onChange={(index)=>{
      if(index==0){
        handleMinimize()
      }
      }}
    >
      <View style={styles.container}>
        {showTopHeader ? (
          <Animated.View
            style={[styles.topHeader, animatedHeaderStyle, { marginTop: top }]}
          >
            <Animated.View style={[styles.bounceArrow, arrowStyle]}>
              <Pressable onPress={handleMinimize}>
                <Icon name="chevron-down" size={24} color="#FFB300" />
              </Pressable>
            </Animated.View>
            <Text style={styles.topHeaderText}>Choose a ride</Text>
          </Animated.View>
        ) : (
          <View style={styles.header}>
            <Text style={styles.headerText}>
              Choose a trip or swipe up for more
            </Text>
          </View>
        )}

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoryScrollContent}
            keyboardShouldPersistTaps="handled"
            scrollEventThrottle={16}
            nestedScrollEnabled={true} 
          >
            <View style={{ flexDirection: "row" }}>
              {categories.map((cat) => {
                const isActive = cat === selectedCategory;
                return (
                  <Pressable
                    key={cat}
                    onPress={() => {
                      setSelectedCategory(cat);
                      setLockedToFullScreen(true);
                      setShowTopHeader(true);
                      sheetRef.current?.snapToIndex(1);

                      setTimeout(() => {
                        listRef.current?.scrollToOffset({ animated: true, offset: 0 });
                      }, 100);
                    }}
                    style={[
                      styles.categoryChip,
                      isActive && styles.categoryChipActive,
                    ]}
                  >
                    <Text
                      numberOfLines={1}
                      style={[
                        styles.categoryChipText,
                        isActive && styles.categoryChipTextActive,
                      ]}
                    >
                      {cat}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </ScrollView>


        <BottomSheetFlatList
          ref={listRef}
          key={selectedCategory}
          data={filteredData}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={[
            styles.contentContainer,
            { minHeight: SCREEN_HEIGHT * 1.2 },
          ]}
          overScrollMode="always"
          scrollEnabled
          stickyHeaderHiddenOnScroll
        />
      </View>
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#121212",
  },
  topHeader: {
    paddingVertical: 16,
    alignItems: "center",
    borderBottomColor: "#2a2a2a",
    borderBottomWidth: StyleSheet.hairlineWidth,
    backgroundColor: "#121212",
    flexDirection: "row",
    margin: 10,
  },
  topHeaderText: {
    fontSize: 20,
    fontWeight: "700",
    color: "#FFB300",
    letterSpacing: 0.5,
    textAlign: "center",
  },
  header: {
    backgroundColor: "#121212",
    paddingVertical: 12,
    alignItems: "center",
    borderBottomColor: "#2a2a2a",
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  headerText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#AAAAAA",
  },
  bounceArrow: {
    marginHorizontal: 10,
    justifyContent: "flex-start",
    alignContent: "flex-start",
  },
  categoryContainer: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    flexDirection: "row",
    gap: 10,
  },
  categoryChip: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: "#2A2A2A",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#444",
    marginRight: 12,
    height: 36,
    justifyContent: "center",
    alignItems: "center",
    margin:10
  },
  categoryChipActive: {
    backgroundColor: "#FFB300",
    borderColor: "#FFB300",
  },
  categoryChipText: {
    fontSize: 14,
    color: "#CCCCCC",
    fontWeight: "500",
    maxWidth: 100, // optional: prevents overflow
  },
  categoryChipTextActive: {
    color: "#121212",
    fontWeight: "700",
  },
  
  contentContainer: {
    paddingHorizontal: 16,
    paddingBottom: 120,
  },
  item: {
    backgroundColor: "#1F1F1F",
    padding: 16,
    borderRadius: 5,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#2C2C2C",
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 4,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#E0E0E0",
    marginBottom: 4,
  },
  itemDescription: {
    fontSize: 14,
    color: "#AAAAAA",
  },
  itemPrice: {
    marginTop: 6,
    fontWeight: "600",
    fontSize: 15,
    color: "#26C6DA",
  },
  itemTopRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  imageContainer: {
    width: 50,
    height: 50,
    marginRight: 12,
  },

  image: {
    width: "100%",
    height: "100%",
    borderRadius: 8,
  },

  itemInfo: {
    flex: 1,
    justifyContent: "center",
  },

  metaRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 4,
    gap: 10,
  },

  metaText: {
    color: "#BBBBBB",
    fontSize: 12,
    marginRight: 10,
  },

  rightInfo: {
    justifyContent: "center",
    alignItems: "flex-end",
    minWidth: 70,
  },

  etaText: {
    fontSize: 12,
    color: "#888",
    marginTop: 4,
  },
  categoryScrollContent: {
    paddingLeft: 16,
    paddingRight: 8,
    flexDirection: "row",
    alignItems: "center",
  },

});
