import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Dimensions } from 'react-native';
import { Image } from 'expo-image';

const { width, height } = Dimensions.get('window');

interface SplashAnimationProps {
  onAnimationComplete: () => void;
}

export default function SplashAnimation({ onAnimationComplete }: SplashAnimationProps) {
  // Animation values
  const logoScale = useRef(new Animated.Value(0.3)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const containerOpacity = useRef(new Animated.Value(1)).current;
  const containerTranslateY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Sequence of animations
    Animated.sequence([
      // Initial delay for black screen
      Animated.delay(400),
      
      // Fade in and scale logo with spring effect
      Animated.parallel([
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 1200,
          useNativeDriver: true,
        }),
        Animated.spring(logoScale, {
          toValue: 1,
          friction: 6,
          tension: 40,
          useNativeDriver: true,
        }),
      ]),
      
      // Hold for a moment
      Animated.delay(2000),
      
      // Fade out transition
      Animated.parallel([
        Animated.timing(containerOpacity, {
          toValue: 0,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(containerTranslateY, {
          toValue: -height * 0.1,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
    ]).start(() => {
      onAnimationComplete();
    });
  }, []);

  return (
    <Animated.View 
      style={[
        styles.container,
        {
          opacity: containerOpacity,
          transform: [{ translateY: containerTranslateY }]
        }
      ]}
    >
      <View style={styles.content}>
        {/* Centered logo */}
        <Animated.View
          style={[
            styles.logoContainer,
            {
              opacity: logoOpacity,
              transform: [{ scale: logoScale }]
            }
          ]}
        >
          <Image
            source={{ uri: 'https://r2-pub.rork.com/attachments/xy6wbczkua0hi3cxmgvm6' }}
            style={styles.logoImage}
            contentFit="contain"
          />
        </Animated.View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
  },
  logoContainer: {
    width: width * 0.8,
    height: height * 0.4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoImage: {
    width: '100%',
    height: '100%',
  },
});