import { View, ViewStyle } from "react-native";

interface CardProps extends React.PropsWithChildren {
  style?: ViewStyle;
}

export default function Card({ children, style = {} }: CardProps) {
  return (
    <View
      style={{
        padding: 12,
        marginVertical:6,
        borderRadius: 15,
        backgroundColor: "#fff",
        elevation: 8,
        shadowColor: "#000",
        shadowRadius: 8,
        shadowOffset: { height: 6, width: 0 },
        shadowOpacity: 0.25,
        ...style,
      }}
    >
      {children}
    </View>
  );
}