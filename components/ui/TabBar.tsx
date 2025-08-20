import React from 'react';
import { View, StyleSheet } from 'react-native';
import { BlurView } from 'expo-blur';
import TabBarButton from './TabBarButton';

interface TabBarProps {
  state: any;
  descriptors: any;
  navigation: any;
}

const TabBar: React.FC<TabBarProps> = ({ state, descriptors, navigation }) => {
  const currentRouteName = state.routes[state.index].name;
  const isCamera = currentRouteName === 'camera';

  const activeColor = isCamera ? '#fff' : '#000';
  const inactiveColor = isCamera ? '#fff' : '#000';

  const containerStyle = [
    styles.tabbar,
    isCamera
      ? { backgroundColor: '#000' }
      : { backgroundColor: 'transparent' }
  ];

  return (
    <>
      {isCamera ? (
        <View style={containerStyle}>
          {state.routes.map((route: any, index: number) => {
            if (['_sitemap', '+not-found'].includes(route.name)) return null;

            const { options } = descriptors[route.key];
            const isFocused = state.index === index;

            const onPress = () => {
              const event = navigation.emit({
                type: 'tabPress',
                target: route.key,
                canPreventDefault: true,
              });
              if (!isFocused && !event.defaultPrevented) {
                navigation.navigate(route.name, route.params);
              }
            };

            const onLongPress = () => {
              navigation.emit({ type: 'tabLongPress', target: route.key });
            };

            return (
              <TabBarButton
                key={route.name}
                onPress={onPress}
                onLongPress={onLongPress}
                isFocused={isFocused}
                routeName={route.name}
                color={isFocused ? activeColor : inactiveColor}
              />
            );
          })}
        </View>
      ) : (
        <BlurView tint="light" intensity={50} style={containerStyle}>
          {state.routes.map((route: any, index: number) => {
            if (['_sitemap', '+not-found'].includes(route.name)) return null;

            const { options } = descriptors[route.key];
            const isFocused = state.index === index;

            const onPress = () => {
              const event = navigation.emit({
                type: 'tabPress',
                target: route.key,
                canPreventDefault: true,
              });
              if (!isFocused && !event.defaultPrevented) {
                navigation.navigate(route.name, route.params);
              }
            };

            const onLongPress = () => {
              navigation.emit({ type: 'tabLongPress', target: route.key });
            };

            return (
              <TabBarButton
                key={route.name}
                onPress={onPress}
                onLongPress={onLongPress}
                isFocused={isFocused}
                routeName={route.name}
                color={isFocused ? activeColor : inactiveColor}
              />
            );
          })}
        </BlurView>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  tabbar: {
    position: 'absolute',
    bottom: 20,
    left: 70,
    right: 70,
    height: 70,
    borderRadius: 30,
    paddingHorizontal: 15,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    overflow: 'hidden',
    borderWidth: 0.5,
    borderColor: 'rgba(0,0,0,0.1)',
  },
});

export default TabBar;