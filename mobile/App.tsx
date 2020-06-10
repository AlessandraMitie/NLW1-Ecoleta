import React from 'react';
import { AppLoading } from 'expo';
//serve para mostrar o sinal de carregamento
import { StatusBar } from 'react-native';

import { Roboto_400Regular, Roboto_500Medium } from '@expo-google-fonts/roboto';
import { Ubuntu_700Bold, useFonts } from '@expo-google-fonts/ubuntu';
//importar useFonts uma vez, independente de quantas fontes importou

//import Home from '.src/pages/routes';
import Routes from './src/routes';

export default function App() {
  const [fontsLoaded] = useFonts({
  //vai dizer quando que a fonte terminou de ser carregada
    Roboto_400Regular,
    Roboto_500Medium,
    Ubuntu_700Bold
  });

  if (!fontsLoaded) {
    return <AppLoading />
  }
  //enquanto as fontes não forem carregadas, 
  
  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      <Routes />
    </>
  );
}