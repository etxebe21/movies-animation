import  React, {useState, useEffect, useRef} from 'react';
import { Animated, FlatList,  } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import { LinearGradient } from 'expo-linear-gradient';

import styled from 'styled-components/native';
import Rating from './componentes/Rating';
import Genre from './componentes/Genre';
import {getMovies} from './api';
import * as CONSTANTS from './constants/constants'



export default function App() {
  const [movies, setMovies] = useState([])
  const [selectedMovie, setSelectedMovie] = useState(null);
  const scrollX = useRef(new Animated.Value(0)).current;
  const [containerHeight, setContainerHeight] = useState(CONSTANTS.ITEM_SIZE);

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
    <Backdrop/>
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

          if(!item.name) {
            return <DummyContainer/>
          }

          return(
            <PosterContainer onPress={() => {
              setSelectedMovie(item);
                setContainerHeight(
                  CONSTANTS.ITEM_SIZE +
                    (item.species ? CONSTANTS.ITEM_SIZE * 0.5 : 0) +
                    (item.type ? CONSTANTS.ITEM_SIZE * 0.5 : 0)
                );
              }}
              height={containerHeight}    
>
              <Poster as={Animated.View} style={{ transform: [{ translateY }] }}>
              <PosterImage source={{ uri: item.image }} />
              <GenreContainer>
                <Text>{item.status}</Text>
              </GenreContainer>
              <PosterTitle numberOfLines={3}>{item.name}</PosterTitle>
              {selectedMovie === item && (
                <>
                  <PosterSpecie>{item.species}</PosterSpecie>
                  <PosterDescription>{item.type}</PosterDescription>
            </>
              )}
    </Poster>
  </PosterContainer>
          )
        }}
        />
    </Container> 
  );
}

const Backdrop = ({ movies, scrollX}) => {
  return(
    <ContentContainer>
      <FlatList
        data={movies}
        keyExtractor={item => `${item.key}-back`}
        removeClippedSubviews={false}
        contentContainerStyle={{ width: CONSTANTS.WIDTH, height: CONSTANTS.BACKDROP_HEIGHT}}
        renderItem={({ item, index}) => {
          if(!item.image){
            return null
          }
          const translateX = scrollX.interpolate({
            inputRange: [(index - 1) * CONSTANTS.ITEM_SIZE, index * CONSTANTS.ITEM_SIZE],
            outputRange: [0, CONSTANTS.WIDTH]
          })
          return(
            <BackdropContainer
              as={Animated.View}
              style={{transform:[{ translateX: translateX}]}}
            >
                <BackdropImage source={{uri:item.image}} />
            </BackdropContainer>
          )
        }}
        />
        <LinearGradient
          colors={['rgba(0, 0, 0, 0)', 'grey']}
          style= {{
            height: CONSTANTS.BACKDROP_HEIGHT,
            width: CONSTANTS.WIDTH,
            position: 'absolute',
            bottom: 0,
          }}
        />
    </ContentContainer>
  )
}

const Container = styled.View`
  flex: 1;
  padding-top: 50px;
  background-color: #000;
`
const PosterContainer = styled.TouchableOpacity`
  width: ${CONSTANTS.ITEM_SIZE}px;
  margin-top: ${CONSTANTS.TOP}px;
  height: ${(props) => props.height}px;
`
const Poster = styled.View`
  margin-horizontal: ${CONSTANTS.SPACING}px;
  padding: ${CONSTANTS.SPACING * 2}px;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.1);
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
  color: #FFF;
`
const PosterDescription = styled.Text`
  font-family: Syne-Mono;
  font-size: 12px;
  color: #FFF;
`
const PosterSpecie = styled.Text`
  font-family: Syne-Mono;
  font-size: 12px;
  color: #FFF;
`

const DummyContainer = styled.View`
  width: ${CONSTANTS.SPACER_ITEM_SIZE}px;
`

const ContentContainer = styled.View`
  position: absolute;
  width: ${CONSTANTS.WIDTH}px;
  height: ${CONSTANTS.BACKDROP_HEIGHT}px;
`
const BackdropContainer = styled.View`
  width: ${CONSTANTS.WIDTH}px;
  position: absolute;
  height: ${CONSTANTS.BACKDROP_HEIGHT}px;
  overflow: hidden;
`

const BackdropImage = styled.Image`
  position: absolute;
  width: ${CONSTANTS.WIDTH}px;
  height: ${CONSTANTS.BACKDROP_HEIGHT}px;
`
const GenreContainer = styled.View`
    border: 1px solid #CCCCCC;
    border-radius: 3px;
    margin: 0 2px 2px 0;
    padding: 3px;
`
const Text = styled.Text`
    opacity: 0.8;
    font-size: 10px;
    color: #CCCCCC;
`