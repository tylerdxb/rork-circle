import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  TextInput,
  Animated,
  Dimensions,
  Keyboard,
  Platform
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { login } from '@/store/authStore';
import { useUserStore } from '@/store/userStore';
import { mockUsers } from '@/constants/mockData';
import { ChevronLeft } from 'lucide-react-native';

const { width, height } = Dimensions.get('window');

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateYAnim = useRef(new Animated.Value(20)).current;
  const buttonScaleAnim = useRef(new Animated.Value(1)).current;
  
  useEffect(() => {
    // Animate content when component mounts
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(translateYAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
    
    // Keyboard listeners
    const keyboardDidShowListener = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      () => setKeyboardVisible(true)
    );
    const keyboardDidHideListener = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      () => setKeyboardVisible(false)
    );
    
    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);
  
  const handleLogin = () => {
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }
    
    setLoading(true);
    
    // Button press animation
    Animated.sequence([
      Animated.timing(buttonScaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(buttonScaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
    
    // Simulate API call
    setTimeout(() => {
      // For demo purposes, any credentials are valid
      // Set a mock user as the current user
      const mockUser = mockUsers[0];
      login(mockUser.id);
      useUserStore.getState().setCurrentUser(mockUser);
      
      setLoading(false);
    }, 1000);
  };
  
  const handleLinkedInLogin = () => {
    // In a real app, this would trigger LinkedIn OAuth
    // For now, we'll just simulate a login
    setLoading(true);
    
    setTimeout(() => {
      const mockUser = mockUsers[0];
      login(mockUser.id);
      useUserStore.getState().setCurrentUser(mockUser);
      
      setLoading(false);
    }, 1000);
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <Animated.View 
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ translateY: translateYAnim }]
          }
        ]}
      >
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
          hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
        >
          <ChevronLeft size={24} color="#FFFFFF" />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
        
        <View style={styles.header}>
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>
            Log in to continue building your professional circle
          </Text>
        </View>
        
        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <TextInput
              style={[
                styles.input,
                emailFocused && styles.inputFocused
              ]}
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                setError('');
              }}
              placeholder="Email"
              placeholderTextColor="rgba(255, 255, 255, 0.4)"
              keyboardType="email-address"
              autoCapitalize="none"
              onFocus={() => setEmailFocused(true)}
              onBlur={() => setEmailFocused(false)}
            />
            <View 
              style={[
                styles.inputUnderline,
                emailFocused && styles.inputUnderlineFocused
              ]} 
            />
          </View>
          
          <View style={styles.inputContainer}>
            <TextInput
              style={[
                styles.input,
                passwordFocused && styles.inputFocused
              ]}
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                setError('');
              }}
              placeholder="Password"
              placeholderTextColor="rgba(255, 255, 255, 0.4)"
              secureTextEntry
              onFocus={() => setPasswordFocused(true)}
              onBlur={() => setPasswordFocused(false)}
            />
            <View 
              style={[
                styles.inputUnderline,
                passwordFocused && styles.inputUnderlineFocused
              ]} 
            />
          </View>
          
          {error ? <Text style={styles.errorText}>{error}</Text> : null}
          
          <TouchableOpacity 
            style={styles.forgotPassword}
            onPress={() => {}}
          >
            <Text style={styles.forgotPasswordText}>Forgot password?</Text>
          </TouchableOpacity>
          
          <Animated.View style={{ transform: [{ scale: buttonScaleAnim }] }}>
            <TouchableOpacity
              style={styles.loginButton}
              onPress={handleLogin}
              disabled={loading}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={['#5c7aff', '#4361ee']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.buttonGradient}
              />
              <Text style={styles.loginButtonText}>
                {loading ? 'Logging in...' : 'Log In'}
              </Text>
            </TouchableOpacity>
          </Animated.View>
          
          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or</Text>
            <View style={styles.dividerLine} />
          </View>
          
          <TouchableOpacity 
            style={styles.socialButton}
            onPress={handleLinkedInLogin}
            disabled={loading}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['rgba(255, 255, 255, 0.1)', 'rgba(255, 255, 255, 0.05)']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.buttonGradient}
            />
            <Text style={styles.socialButtonText}>Continue with LinkedIn</Text>
          </TouchableOpacity>
        </View>
        
        {!keyboardVisible && (
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              Don't have an account?{' '}
              <Text 
                style={styles.footerLink}
                onPress={() => router.push('/(auth)/email-signup')}
              >
                Sign up
              </Text>
            </Text>
          </View>
        )}
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'space-between',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  backText: {
    color: '#FFFFFF',
    fontSize: 16,
    marginLeft: 4,
  },
  header: {
    marginTop: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.7)',
    lineHeight: 22,
  },
  form: {
    marginTop: 40,
  },
  inputContainer: {
    marginBottom: 24,
  },
  input: {
    fontSize: 16,
    color: '#FFFFFF',
    paddingVertical: 12,
    paddingHorizontal: 0,
  },
  inputFocused: {
    color: '#5c7aff', // Neon blue
  },
  inputUnderline: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  inputUnderlineFocused: {
    height: 2,
    backgroundColor: '#5c7aff', // Neon blue
  },
  errorText: {
    color: '#ff4d4d',
    marginBottom: 16,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 24,
  },
  forgotPasswordText: {
    color: '#5c7aff', // Neon blue
    fontSize: 14,
  },
  loginButton: {
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    marginBottom: 24,
  },
  buttonGradient: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  dividerText: {
    color: 'rgba(255, 255, 255, 0.6)',
    paddingHorizontal: 16,
    fontSize: 14,
  },
  socialButton: {
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  socialButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
  },
  footer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  footerText: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 14,
  },
  footerLink: {
    color: '#5c7aff', // Neon blue
    fontWeight: '600',
  },
});