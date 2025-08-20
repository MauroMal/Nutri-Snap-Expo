import React from 'react';
import { Pressable, StyleSheet } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

export interface TabBarButtonProps {
  isFocused: boolean;
  routeName: string;
  color: string;
  onPress: () => void;
  onLongPress: () => void;
}

const getIconName = (routeName: string, isFocused: boolean): keyof typeof Ionicons.glyphMap => {
  switch (routeName) {
    case 'index':
      return isFocused ? 'search' : 'search-outline';
    case 'camera':
      return isFocused ? 'camera' : 'camera-outline';
    case 'data':
      return isFocused ? 'bar-chart' : 'bar-chart-outline';
    default:
      return 'ellipse-outline';
  }
};

const TabBarButton: React.FC<TabBarButtonProps> = ({ isFocused, routeName, color, onPress, onLongPress }) => {
  const iconName = getIconName(routeName, isFocused);

  return (
    <Pressable
      onPress={onPress}
      onLongPress={onLongPress}
      style={styles.button}
    >
      <Ionicons name={iconName} size={26} color={color} />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default TabBarButton;