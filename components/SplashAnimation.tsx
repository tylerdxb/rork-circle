import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Image } from 'expo-image';

const { width, height } = Dimensions.get('window');

interface SplashAnimationProps {
  onAnimationComplete: () => void;
}

export default function SplashAnimation({ onAnimationComplete }: SplashAnimationProps) {
  // Animation values
  const logoScale = useRef(new Animated.Value(0.7)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  
  const glowOpacity = useRef(new Animated.Value(0)).current;
  const glowScale = useRef(new Animated.Value(0.8)).current;
  
  const textOpacity = useRef(new Animated.Value(0)).current;
  const textTranslateY = useRef(new Animated.Value(30)).current;
  
  const subtitleOpacity = useRef(new Animated.Value(0)).current;
  const subtitleTranslateY = useRef(new Animated.Value(20)).current;
  
  const containerOpacity = useRef(new Animated.Value(1)).current;
  const containerTranslateY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Sequence of animations
    Animated.sequence([
      // Delay for initial black screen
      Animated.delay(300),
      
      // Fade in and scale logo with spring effect
      Animated.parallel([
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.spring(logoScale, {
          toValue: 1,
          friction: 8,
          tension: 40,
          useNativeDriver: true,
        }),
      ]),
      
      // Fade in and scale glow effect
      Animated.parallel([
        Animated.timing(glowOpacity, {
          toValue: 0.6,
          duration: 1200,
          useNativeDriver: true,
        }),
        Animated.spring(glowScale, {
          toValue: 1.2,
          friction: 10,
          tension: 30,
          useNativeDriver: true,
        }),
      ]),
      
      // Fade in and slide up main text
      Animated.parallel([
        Animated.timing(textOpacity, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.spring(textTranslateY, {
          toValue: 0,
          friction: 8,
          tension: 40,
          useNativeDriver: true,
        }),
      ]),
      
      // Fade in and slide up subtitle
      Animated.parallel([
        Animated.timing(subtitleOpacity, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.spring(subtitleTranslateY, {
          toValue: 0,
          friction: 8,
          tension: 40,
          useNativeDriver: true,
        }),
      ]),
      
      // Pause before transitioning out
      Animated.delay(1500),
      
      // Fade out and slide up the entire container
      Animated.parallel([
        Animated.timing(containerOpacity, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(containerTranslateY, {
          toValue: -height * 0.1,
          duration: 600,
          useNativeDriver: true,
        }),
      ]),
    ]).start(() => {
      // Call the callback when animation is complete
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
        {/* Glow effect behind logo */}
        <Animated.View 
          style={[
            styles.glow,
            { 
              opacity: glowOpacity,
              transform: [{ scale: glowScale }]
            }
          ]}
        >
          <LinearGradient
            colors={['rgba(92, 122, 255, 0.4)', 'rgba(32, 240, 198, 0.4)', 'rgba(92, 122, 255, 0.2)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.gradientGlow}
          />
        </Animated.View>
        
        {/* Logo */}
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
        
        {/* App name */}
        <Animated.Text 
          style={[
            styles.title,
            {
              opacity: textOpacity,
              transform: [{ translateY: textTranslateY }]
            }
          ]}
        >
          CIRCLE
        </Animated.Text>
        
        {/* Tagline */}
        <Animated.Text 
          style={[
            styles.subtitle,
            {
              opacity: subtitleOpacity,
              transform: [{ translateY: subtitleTranslateY }]
            }
          ]}
        >
          FIND YOUR CIRCLE
        </Animated.Text>
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
    alignItems: 'center',
    justifyContent: 'center',
  },
  glow: {
    position: 'absolute',
    width: 300,
    height: 300,
    borderRadius: 150,
    overflow: 'hidden',
  },
  gradientGlow: {
    width: '100%',
    height: '100%',
    opacity: 0.8,
  },
  logoContainer: {
    marginBottom: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoImage: {
    width: 120,
    height: 120,
  },
  title: {
    fontSize: 42,
    fontWeight: '700',
    color: '#5c7aff', // Neon blue matching the logo
    letterSpacing: 4,
    marginBottom: 16,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#20f0c6', // Teal matching the logo
    letterSpacing: 2,
    textAlign: 'center',
  },
});