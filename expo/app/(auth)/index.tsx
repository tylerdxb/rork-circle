import React, { useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Animated, 
  Dimensions
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { theme } from '@/constants/theme';

const { width, height } = Dimensions.get('window');

export default function WelcomeScreen() {
  const router = useRouter();
  
  // Animation values
  const containerOpacity = useRef(new Animated.Value(0)).current;
  const containerTranslateY = useRef(new Animated.Value(20)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const logoScale = useRef(new Animated.Value(0.9)).current;
  const contentOpacity = useRef(new Animated.Value(0)).current;
  const contentTranslateY = useRef(new Animated.Value(30)).current;
  const buttonOpacity = useRef(new Animated.Value(0)).current;
  const buttonTranslateY = useRef(new Animated.Value(20)).current;
  
  useEffect(() => {
    // Animate in sequence
    Animated.sequence([
      // Fade in container
      Animated.parallel([
        Animated.timing(containerOpacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(containerTranslateY, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
      ]),
      
      // Animate logo
      Animated.parallel([
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.spring(logoScale, {
          toValue: 1,
          friction: 8,
          tension: 40,
          useNativeDriver: true,
        }),
      ]),
      
      // Animate content
      Animated.parallel([
        Animated.timing(contentOpacity, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(contentTranslateY, {
          toValue: 0,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
      
      // Animate buttons
      Animated.parallel([
        Animated.timing(buttonOpacity, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(buttonTranslateY, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, []);
  
  const handleLinkedInSignup = () => {
    // In a real app, this would trigger LinkedIn OAuth
    // For now, we'll just navigate to the next screen
    router.push('/(auth)/invite-code');
  };
  
  const handleEmailSignup = () => {
    router.push('/(auth)/email-signup');
  };
  
  const handleLogin = () => {
    router.push('/(auth)/login');
  };
  
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
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.content}>
          <Animated.View 
            style={[
              styles.logoContainer,
              {
                opacity: logoOpacity,
                transform: [{ scale: logoScale }]
              }
            ]}
          >
            <View style={styles.logoWrapper}>
              <View style={styles.hexagonOutline}>
                <View style={[styles.circle, styles.topRightCircle]} />
                <View style={[styles.circle, styles.bottomLeftCircle]} />
              </View>
              <View style={styles.hexagonFill}>
                <View style={[styles.circleFill, styles.topRightCircle]} />
                <View style={[styles.circleFill, styles.bottomLeftCircle]} />
              </View>
            </View>
            <Text style={styles.logoText}>CIRCLE</Text>
            <Text style={styles.tagline}>FIND YOUR CIRCLE</Text>
          </Animated.View>
          
          <Animated.View 
            style={[
              styles.descriptionContainer,
              {
                opacity: contentOpacity,
                transform: [{ translateY: contentTranslateY }]
              }
            ]}
          >
            <Text style={styles.description}>
              Connect with like-minded professionals, founders, and creatives based on shared interests and values.
            </Text>
          </Animated.View>
          
          <Animated.View 
            style={[
              styles.buttonsContainer,
              {
                opacity: buttonOpacity,
                transform: [{ translateY: buttonTranslateY }]
              }
            ]}
          >
            <TouchableOpacity 
              style={styles.button}
              onPress={handleLinkedInSignup}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={['rgba(92, 122, 255, 0.15)', 'rgba(92, 122, 255, 0.05)']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.buttonGradient}
              />
              <Text style={styles.buttonText}>Continue with LinkedIn</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.button}
              onPress={handleEmailSignup}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={['rgba(32, 240, 198, 0.15)', 'rgba(32, 240, 198, 0.05)']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.buttonGradient}
              />
              <Text style={styles.buttonText}>Sign up with Email</Text>
            </TouchableOpacity>
            
            <View style={styles.loginContainer}>
              <Text style={styles.loginText}>Already have an account?</Text>
              <TouchableOpacity onPress={handleLogin}>
                <Text style={styles.loginLink}>Log in</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>
      </SafeAreaView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  safeArea: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'space-between',
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: height * 0.1,
  },
  logoWrapper: {
    width: 100,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    position: 'relative',
  },
  hexagonOutline: {
    width: 70,
    height: 70,
    borderWidth: 3,
    borderColor: '#20f0c6', // Teal
    borderRadius: 15,
    transform: [{ rotate: '45deg' }],
    position: 'absolute',
  },
  hexagonFill: {
    width: 50,
    height: 50,
    backgroundColor: '#5c7aff', // Neon blue
    borderRadius: 12,
    transform: [{ rotate: '45deg' }],
    position: 'absolute',
  },
  circle: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#20f0c6', // Teal
    position: 'absolute',
  },
  circleFill: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#5c7aff', // Neon blue
    position: 'absolute',
  },
  topRightCircle: {
    top: -9,
    right: -9,
  },
  bottomLeftCircle: {
    bottom: -9,
    left: -9,
  },
  logoText: {
    fontSize: 36,
    fontWeight: '700',
    color: '#5c7aff', // Neon blue
    letterSpacing: 3,
    marginBottom: 8,
  },
  tagline: {
    fontSize: 12,
    fontWeight: '500',
    color: '#20f0c6', // Teal
    letterSpacing: 2,
  },
  descriptionContainer: {
    marginVertical: 40,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
    color: 'rgba(255, 255, 255, 0.8)',
    paddingHorizontal: 20,
  },
  buttonsContainer: {
    marginBottom: 40,
  },
  button: {
    height: 56,
    borderRadius: 28,
    marginBottom: 16,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    position: 'relative',
  },
  buttonGradient: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    zIndex: 1,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  loginText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.6)',
    marginRight: 4,
  },
  loginLink: {
    fontSize: 14,
    fontWeight: '600',
    color: '#5c7aff', // Neon blue
  },
});