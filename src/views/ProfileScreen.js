import React, {useState, useEffect} from 'react';
import {generatePath} from 'react-router';
import axios from 'axios';

import {
  View,
  Image,
  ScrollView,
  Linking
} from 'react-native';

import {Container, Button, Text} from 'native-base';

import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {
  faLink,
  faUserFriends,
  faStar
} from '@fortawesome/free-solid-svg-icons';
import ScrollTopics from '../components/ScrollTopics';
import Navbar from '../components/Navbar';

import globalStyles from '../styles/global';

const ProfileScreen = ({route, navigation}) => {
  const [scrollTopic, setScrollTopic] = useState('Overview');
  const [secret, setSecret] = useState();
  const [errorSecret, setErrorSecret] = useState(false);

  const {
    userInfo: {avatar_url, login, name, bio, blog, followers, following},
    userRepos,
    repoStarred,
    follow,
    followMe,
    loader,
  } = route.params;

console.log(userRepos, 'repos')
  const scrollViewCarac = [
    'Overview',
    `Repositories ${userRepos.length}`,
    'Projects',
    'Packages',
  ];

  const secretReadme = async () => {
    try {
      const response = await axios.get(
        generatePath('https://api.github.com/repos/:username/:username', {
          username: login,
        }),
      );
     
      setSecret(response.data);
    } catch (err) {
      const {config, status} = err.response;
      if (
        config.url === `https://api.github.com/repos/${login}/${login}` &&
        status === 404
      ) {
        setErrorSecret("I think it's time to make your secret Readme...");
      }
    }
  };

  const getCommits = async () => {
    try {
    // const response = await userRepos.map(data =>  axios.get(generatePath("https://api.github.com/repos/:fullName", {fullName: data.full_name})))
  
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    secretReadme();
    getCommits();
    loader(false);
  }, []);

  return (
    <>
      <Container>
        <Navbar />

        <ScrollView>
          <View style={globalStyles.userInfo}>
            <Image
              style={{width: 45, height: 45, borderRadius: 100, marginLeft: 20}}
              source={{uri: avatar_url}}
            />

            <View style={globalStyles.nameUser}>
              <Text style={{fontWeight: 'bold', fontSize: 20}}>{name}</Text>
              <Text style={{fontWeight: '100', fontSize: 15}}>{login}</Text>
            </View>
          </View>
          <View style={globalStyles.bioProfile}>
            <View style={{width: '90%'}}>
              <Text style={{fontSize: 14, lineHeight: 25}}>{bio}</Text>
            </View>
            <View
              style={{
                width: '90%',
                flexDirection: 'row',
                marginTop: 20,
                alignItems: 'center',
              }}>
              <FontAwesomeIcon icon={faLink} style={{marginRight: 10}} />
              <Text onPress={() => Linking.openURL(blog)}>{blog}</Text>
            </View>
            <View
              style={{
                width: '90%',
                marginTop: 10,
                marginBottom: 20,
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <FontAwesomeIcon icon={faUserFriends} style={{marginRight: 10}} />
              <Text onPress={() => setScrollTopic('followers')}>
                {followers} followers ·
              </Text>
              <Text onPress={() => setScrollTopic('following')}>
                {following} following ·
              </Text>

              <FontAwesomeIcon icon={faStar} style={{marginLeft: 5}} />
              <Text
                style={{position: 'relative', left: 5}}
                onPress={() => setScrollTopic('starred')}>
                {repoStarred.length}
              </Text>
            </View>
          </View>
          <View style={globalStyles.scrollViewContainer}>
            <ScrollView horizontal={true}>
              {scrollViewCarac.map((data, key) => {
                return (
                  <Button
                    transparent
                    light
                    key={key}
                    style={{marginLeft: 10, marginRight: 10, height: 30}}
                    onPress={() => setScrollTopic(data)}>
                    <Text>{data}</Text>
                  </Button>
                );
              })}
            </ScrollView>
          </View>
          <View style={globalStyles.scrollDetailed}>
            <View style={{width: '90%'}}>
              <ScrollTopics
                topic={scrollTopic}
                message={secret ? secret : errorSecret}
                userRepos={userRepos}
                followers={follow}
                following={followMe}
                repoStarred={repoStarred}
              />
            </View>
          </View>
        </ScrollView>
      </Container>
    </>
  );
};

export default ProfileScreen;
