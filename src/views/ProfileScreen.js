import React, {useState, useEffect} from 'react';
import {generatePath} from 'react-router';
import axios from 'axios';

import {
  View,
  Image,
  ScrollView,
  Linking,
  TouchableHighlight,
} from 'react-native';

import * as Animatable from 'react-native-animatable';

import {Container, Button, Text, Accordion, Header, Content} from 'native-base';

import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {
  faBars,
  faLink,
  faUserFriends,
  faStar,
} from '@fortawesome/free-solid-svg-icons';
import ScrollTopics from '../components/ScrollTopics';

import globalStyles from '../styles/global';

const ProfileScreen = ({route, navigation}) => {
  const [scrollTopic, setScrollTopic] = useState('Overview');
  const [secret, setSecret] = useState();
  const [errorSecret, setErrorSecret] = useState(false);
  const [menu, setMenu] = useState(true);

  const {
    userInfo: {avatar_url, login, name, bio, blog, followers, following},
    userRepos,
    repoStarred,
    follow,
    followMe,
    loader,
  } = route.params;
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

  useEffect(() => {
    secretReadme();
    loader(false);
  }, []);
  const dataArray = [
    {title: 'First Element', content: 'Lorem ipsum dolor sit amet'},
    {title: 'Second Element', content: 'Lorem ipsum dolor sit amet'},
    {title: 'Third Element', content: 'Lorem ipsum dolor sit amet'},
  ];
  return (
    <>
      <Container>
        <View style={globalStyles.headerNav}>
          <TouchableHighlight onPress={() => navigation.goBack()}>
            <Image
              style={globalStyles.githubIcon}
              source={require('../assets/github_monster.png')}
            />
          </TouchableHighlight>
          <FontAwesomeIcon
            style={{position: 'relative', right: 20, color: '#FFF'}}
            icon={faBars}
            onPress={() => setMenu(!menu)}
          />
        </View>
        {menu && <View style={globalStyles.navbar}><Text>aqui va el menu</Text></View>}
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