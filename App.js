import  React, {useState, useEffect, useRef} from 'react';
import { Animated } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import styled from 'styled-components/native';
import Rating from './componentes/Rating';
import Genre from './componentes/Genre';
import {getMovies} from './api';
import * as CONSTANTS from './constants/constants'



export default function App() {
  const [movies, setMovies] = useState([])
  const scrollX = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const fetchData = async () => {
      const data = await getMovies()
      setMovies([{ key: 'left-spacer'}, ...data, {key: 'right-spacer'}])
      
    }
    fetchData()
  }, [])

  let [fontLoaded] = useFonts({
    'Syne-Mono': require('./assets/fonts/SyneMono-Regular.ttf'),
  });

  
  return (
    <Container>
      <StatusBar/>
      <Animated.FlatList 
        showsHorizontalScrollIndicator={false}
        data={movies}
        keyExtractor={item => item.key}
        horizontal
        snapToInterval={CONSTANTS.ITEM_SIZE}
        decelerationRate={0}
        onScroll={Animated.event(
          [ { nativeEvent: { contentOffset: {x: scrollX}}}],
          {useNativeDriver: true}
        )}
        scrollEventThrottle={16}
        contentContainerStyle={{
          alignItems: 'center'
        }}
        renderItem={({item, index}) => {

          const inputRange = [
            (index -2) * CONSTANTS.ITEM_SIZE,
            (index - 1) * CONSTANTS.ITEM_SIZE,
            index * CONSTANTS.ITEM_SIZE
          ]

          const translateY = scrollX.interpolate({
            inputRange,
            outputRange: [0, -50, 0]
          })

          if(!item.originalTitle) {
            return <DummyContainer/>
          }

          return(
            <PosterContainer>
              <Poster as={Animated.View} style={{transform: [{translateY}]}}>
                <PosterImage source ={{ uri: item.posterPath}} />
                <PosterTitle numberOfLines={1}>{item.description}</PosterTitle>
                <Rating rating={item.voteAverage} />
                <Genre genres={item.genres}/>
                <PosterDescription numberOfLines={5}>{item.description}</PosterDescription>
              </Poster>
            </PosterContainer>
          )
        }}
        />
    </Container>
   
  );
}

const Container = styled.View`
  flex: 1;
`
const PosterContainer = styled.View`
  width: ${CONSTANTS.ITEM_SIZE}px;
`
const Poster = styled.View`
  margin-horizontal: ${CONSTANTS.SPACING}px;
  padding: ${CONSTANTS.SPACING * 3}px;
  align-items: center;
  background-color: #FFFFFF;
  border-radius: 10px;
`
const PosterImage = styled.Image`
  width: 100%;
  height: ${CONSTANTS.ITEM_SIZE * 1.2}px;
  resize-mode: cover;
  border-radius: 10px;
  margin: 0 0 10px 0;
`
const PosterTitle = styled.Text`
  font-family: Syne-Mono;
  font-size: 18px;
`
const PosterDescription = styled.Text`
  font-family: Syne-Mono;
  font-size: 12px;
`

const DummyContainer = styled.View`
  width: ${CONSTANTS.SPACER_ITEM_SIZE}px;
`