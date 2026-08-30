// import { StatusBar } from 'expo-status-bar';
// import { SafeAreaProvider } from 'react-native-safe-area-context';
// import { QueryClientProvider } from '@tanstack/react-query';
// import { NavigationContainer } from '@react-navigation/native';
// import { createNativeStackNavigator } from '@react-navigation/native-stack';

// import { queryClient } from '@/lib/queryClient';
// import { SessionProvider, useSession } from '@/session/session';
// import { Loading } from '@/components/ui';

// import { SignInScreen } from '@/screens/SignInScreen';
// import { SignUpScreen } from '@/screens/SignUpScreen';
// import { ForgotPasswordScreen } from '@/screens/ForgotPasswordScreen';

// import { ProductsScreen } from '@/screens/ProductsScreen';
// import { ProductDetailScreen } from '@/screens/ProductDetailScreen';
// import { FavoritesScreen } from '@/screens/FavoritesScreen';
// import { CartScreen } from '@/screens/CartScreen';
// import { CheckoutScreen } from '@/screens/CheckoutScreen';
// import { OrderScreen } from '@/screens/OrderScreen';
// import { OrdersScreen } from '@/screens/OrdersScreen';

// import type { AuthStackParamList, RootStackParamList } from '@/navigation';

// const AuthStack = createNativeStackNavigator<AuthStackParamList>();
// const AppStack = createNativeStackNavigator<RootStackParamList>();

// function AuthFlow() {
//   return (
//     <AuthStack.Navigator screenOptions={{ headerShown: false }}>
//       <AuthStack.Screen name="SignIn" component={SignInScreen} />
//       <AuthStack.Screen name="SignUp" component={SignUpScreen} />
//       <AuthStack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
//     </AuthStack.Navigator>
//   );
// }

// function AppFlow() {
//   return (
//     <AppStack.Navigator
//       screenOptions={{
//         headerStyle: { backgroundColor: '#0f172a' },
//         headerTintColor: '#f8fafc',
//         headerTitleStyle: { fontWeight: 'bold' },
//       }}
//     >
//       <AppStack.Screen name="Products" component={ProductsScreen} options={{ title: 'MotoShop' }} />
//       <AppStack.Screen
//         name="ProductDetail"
//         component={ProductDetailScreen}
//         options={({ route }) => ({ title: route.params.name })}
//       />
//       <AppStack.Screen name="Favorites" component={FavoritesScreen} options={{ title: 'Meus Favoritos' }} />
//       <AppStack.Screen name="Cart" component={CartScreen} options={{ title: 'Carrinho' }} />
//       <AppStack.Screen name="Checkout" component={CheckoutScreen} options={{ title: 'Checkout' }} />
//       <AppStack.Screen name="Order" component={OrderScreen} options={{ title: 'Detalhes do Pedido' }} />
//       <AppStack.Screen name="Orders" component={OrdersScreen} options={{ title: 'Meus Pedidos' }} />
//     </AppStack.Navigator>
//   );
// }

// function RootNavigator() {
//   const session = useSession();

//   // Tratamento de segurança caso o context retorne undefined antes do carregamento
//   if (session?.isLoading) {
//     return <Loading label="Carregando sessão..." />;
//   }

//   return session?.isLoggedIn ? <AppFlow /> : <AuthFlow />;
// }

// export default function App() {
//   return (
//     <SafeAreaProvider>
//       <QueryClientProvider client={queryClient}>
//         <SessionProvider>
//           <NavigationContainer>
//             <RootNavigator />
//           </NavigationContainer>
//           <StatusBar style="light" />
//         </SessionProvider>
//       </QueryClientProvider>
//     </SafeAreaProvider>
//   );
// }

import { StyleSheet, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClientProvider } from '@tanstack/react-query';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { queryClient } from '@/lib/queryClient';
import { SessionProvider, useSession } from '@/session/session';
import { Loading } from '@/components/ui';
import { LogoIcon } from '@/components/LogoIcon';

import { SignInScreen } from '@/screens/SignInScreen';
import { SignUpScreen } from '@/screens/SignUpScreen';
import { ForgotPasswordScreen } from '@/screens/ForgotPasswordScreen';

import { ProductsScreen } from '@/screens/ProductsScreen';
import { ProductDetailScreen } from '@/screens/ProductDetailScreen';
import { FavoritesScreen } from '@/screens/FavoritesScreen';
import { CartScreen } from '@/screens/CartScreen';
import { CheckoutScreen } from '@/screens/CheckoutScreen';
import { OrderScreen } from '@/screens/OrderScreen';
import { OrdersScreen } from '@/screens/OrdersScreen';

import type { AuthStackParamList, RootStackParamList } from '@/navigation';

const AuthStack = createNativeStackNavigator<AuthStackParamList>();
const AppStack = createNativeStackNavigator<RootStackParamList>();

function HeaderTitle() {
  return (
    <View style={styles.headerContainer}>
      <LogoIcon size={26} color="#38bdf8" />
      <Text style={styles.headerText}>MotoShop</Text>
    </View>
  );
}

function AuthFlow() {
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      <AuthStack.Screen name="SignIn" component={SignInScreen} />
      <AuthStack.Screen name="SignUp" component={SignUpScreen} />
      <AuthStack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
    </AuthStack.Navigator>
  );
}

function AppFlow() {
  return (
    <AppStack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#0f172a' },
        headerTintColor: '#f8fafc',
        headerTitleStyle: { fontWeight: 'bold' },
      }}
    >
      <AppStack.Screen
        name="Products"
        component={ProductsScreen}
        options={{ headerTitle: () => <HeaderTitle /> }}
      />
      <AppStack.Screen
        name="ProductDetail"
        component={ProductDetailScreen}
        options={({ route }) => ({ title: route.params.name })}
      />
      <AppStack.Screen name="Favorites" component={FavoritesScreen} options={{ title: 'Meus Favoritos' }} />
      <AppStack.Screen name="Cart" component={CartScreen} options={{ title: 'Carrinho' }} />
      <AppStack.Screen name="Checkout" component={CheckoutScreen} options={{ title: 'Checkout' }} />
      <AppStack.Screen name="Order" component={OrderScreen} options={{ title: 'Detalhes do Pedido' }} />
      <AppStack.Screen name="Orders" component={OrdersScreen} options={{ title: 'Meus Pedidos' }} />
    </AppStack.Navigator>
  );
}

function RootNavigator() {
  const session = useSession();

  if (session?.isLoading) {
    return <Loading label="Carregando sessão..." />;
  }

  return session?.isLoggedIn ? <AppFlow /> : <AuthFlow />;
}

export default function App() {
  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <SessionProvider>
          <NavigationContainer>
            <RootNavigator />
          </NavigationContainer>
          <StatusBar style="light" />
        </SessionProvider>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerText: {
    color: '#f8fafc',
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
});