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
  const logoScale = useRef(new Animated.Value(0.3)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  
  const glowOpacity = useRef(new Animated.Value(0)).current;
  const glowScale = useRef(new Animated.Value(0.5)).current;
  
  const textOpacity = useRef(new Animated.Value(0)).current;
  const textTranslateY = useRef(new Animated.Value(40)).current;
  
  const subtitleOpacity = useRef(new Animated.Value(0)).current;
  const subtitleTranslateY = useRef(new Animated.Value(30)).current;
  
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
      
      // Animate glow effect
      Animated.parallel([
        Animated.timing(glowOpacity, {
          toValue: 0.8,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.spring(glowScale, {
          toValue: 1.3,
          friction: 8,
          tension: 30,
          useNativeDriver: true,
        }),
      ]),
      
      // Animate main text
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
      
      // Animate subtitle
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
      
      // Hold for a moment
      Animated.delay(1800),
      
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
            colors={[
              'rgba(92, 122, 255, 0.6)', 
              'rgba(32, 240, 198, 0.6)', 
              'rgba(92, 122, 255, 0.3)',
              'rgba(32, 240, 198, 0.3)',
              'transparent'
            ]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.gradientGlow}
          />
        </Animated.View>
        
        {/* Full-screen logo */}
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
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
  },
  glow: {
    position: 'absolute',
    width: width * 1.2,
    height: width * 1.2,
    borderRadius: width * 0.6,
    overflow: 'hidden',
  },
  gradientGlow: {
    width: '100%',
    height: '100%',
  },
  logoContainer: {
    width: width * 0.8,
    height: width * 0.8,
    maxWidth: 400,
    maxHeight: 400,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: height * 0.08,
  },
  logoImage: {
    width: '100%',
    height: '100%',
  },
  title: {
    fontSize: Math.min(width * 0.12, 48),
    fontWeight: '700',
    color: '#5c7aff',
    letterSpacing: 6,
    marginBottom: 20,
    textAlign: 'center',
    fontFamily: 'System',
  },
  subtitle: {
    fontSize: Math.min(width * 0.04, 16),
    fontWeight: '500',
    color: '#20f0c6',
    letterSpacing: 3,
    textAlign: 'center',
    fontFamily: 'System',
  },
});