import {url} from 'url'
import Config from './Source/config';
import api from './Source/api/api.js';
import {authData,err_info} from './Source/config'
import {StorageKey} from './Source/config'
import {UI} from './Source/config'
import * as Service from './Source/request/request.js'
import * as storage from './Source/Storage/storage.js'
import fetch from 'react-native-fetch-polyfill'
import React, { Component,} from 'react';
import CookieManager from 'react-native-cookies'
import { Icon } from 'native-base';
import * as umengAnalysis from './Source/umeng/umengAnalysis'
import {
    Platform,
    StyleSheet,
    Text,
    View,
    ToastAndroid,
    AppRegistry,
    TouchableOpacity,
    Image,
    TextInput,
    Dimensions,
    WebView,
    AsyncStorage,
    Alert,
    BackHandler,
    DeviceEventEmitter,
} from 'react-native';
import {
    StackNavigator,
    TabNavigator,
    NavigationActions
} from 'react-navigation';

import ClassFunction from './Source/screens/ClassFunction'
import HomeworkDetail from './Source/screens/HomeworkDetail'
import HomeworkLists from './Source/screens/HomeworkLists'
import PersonalBlog from './Source/screens/PersonalBlog'
import ClassLists from './Source/screens/ClassLists'
import UserInformation from './Source/screens/UserInformation'
import ClassListsNew from './Source/screens/ClassListsNew'
import ClassHome from './Source/screens/ClassHome'
import HomeworkPost from './Source/screens/HomeworkPost'
import HomeworkEdition from './Source/screens/HomeworkEdition'
import BlogDetail from './Source/screens/BlogDetail'
import BlogComment from './Source/screens/BlogComment'
import BlogBookmarks from './Source/screens/BlogBookmarks'
import BookmarksList from './Source/screens/BookmarksList'
import BookmarksEdit from './Source/screens/BookmarksEdit'
import ClassMember from './Source/screens/ClassMember'
import ClassMemberAdd from './Source/screens/ClassMemberAdd'
import MemberBlog from './Source/screens/MemberBlog'
import CommentAdd from './Source/screens/CommentAdd'
import AppInformation from './Source/screens/AppInformation'
import ScheduleReminding from './Source/screens/ScheduleReminding'
import ContactPage from './Source/screens/ContactPage'
import Submitted from './Source/screens/Submitted'
import HomeworkSubmit from './Source/screens/HomeworkSubmit'
import UnfinishedHomeworkList from './Source/screens/UnfinishedHomeworkList'
import BlogEdition from './Source/screens/BlogEdition'
import Bulletin from './Source/screens/Bulletin'
import BulletinAdd from './Source/screens/BulletinAdd'
import BulletinEdition from './Source/screens/BulletinEdition'
import HistoryList from './Source/screens/HistoryList'
import ClassSelect from './Source/screens/ClassSelect'
import VoteList from './Source/screens/VoteList'
import Settings from './Source/screens/Settings'
import VoteDetail from './Source/screens/VoteDetail'
import VoteAdd from './Source/screens/VoteAdd'
import VoteMemberList from './Source/screens/VoteMemberList'
import VoteMemberCommit from './Source/screens/VoteMemberCommit'
const { height, width } = Dimensions.get('window');

const CODE_URL = [
  'https://oauth.cnblogs.com/connect/authorize',
  '?client_id=' + authData.clientId,
  '&scope=openid profile CnBlogsApi',
  '&response_type=code id_token',
  '&redirect_uri=' + Config.CallBack,
  '&state=abc',
  '&nonce=xyz'
].join('');

//首先使用上次的token来获取用户信息，如果失败那么重新登陆
//用户退出之后一定要清空token
class App extends Component {
    render() {
        //这里一定要测试一下，如果是刚刚下载的软件，一开始打开是不是会显示登陆界面
        const {navigate} = this.props.navigation;
        //推送开关变量
        
        return (
            <View style={styles.container}>
                <Welcome/>
            </View>
        );
    }
}

// 在App中调用的登录界面组件
class Welcome extends Component{
    render(){
        return (
            <View style = {styles.container}>
                <Image style = {{width: width, height: height, resizeMode: 'stretch'}}
                source = {require('./Source/images/start.jpg')}/>
            </View>
        )
    }

    toPersonalBlog()
    {
        this.reset();
        this.props.navigation.navigate('PersonalBlog');
    }

    toHome()
    {
        this.props.navigation.navigate('Loginer');
    }
    reset = ()=>{
        // 重置路由：使得无法返回登录界面
        const resetAction = NavigationActions.reset({
            index: 0,
            actions: [
                NavigationActions.navigate({ routeName: 'AfterloginTab'}),
            ]
        });
        this.props.navigation.dispatch(resetAction);
    }

    async setPush(){
        var receivePush = await storage.getItem(StorageKey.RECEIVE_PUSH);
        if(receivePush === null){
            storage.setItem(StorageKey.RECEIVE_PUSH,'true');
        }
    }

    componentWillUnmount(){
        // DeviceEventEmitter.removeListener('notification',this.notification);
    }

    notification = (params) =>{
        console.log(params);
    }

    componentDidMount(){
        DeviceEventEmitter.addListener('notification',this.notification);
        this.subscription = DeviceEventEmitter.addListener('xxxName', Function);//监听通知
        this.timer = setTimeout(
            ()=>{
                this.setPush().then(
                    storage.getItem(StorageKey.USER_TOKEN).then((token)=>{
                        if(token === null)
                        {
                            this.toHome();
                        }
                        else{
                            if(token.access_token !== 'undefined')
                            {
                                let url = Config.apiDomain+'api/users/';
                                Service.GetInfo(url,token.access_token)
                                .then((jsonData)=>{
                                    if(jsonData !== "rejected")
                                    {
                                        this.toPersonalBlog();
                                    }
                                    else
                                    {
                                        storage.removeItem(StorageKey.USER_TOKEN).then((res)=>{
                                            CookieManager.clearAll()
                                            .then((res)=>{
                                                this.props.navigation.navigate('Loginer')
                                            })
                                        })
                                    }
                                })
                                .catch((error) => {
                                    this.toPersonalBlog();
                                });
                            }
                            else
                            {
                                this.toHome();
                            }
                        }
                    })
                )
            }
            ,1000)
    }
}

class Loginer extends Component{
    mylogin = () => {
        this.props.navigation.navigate('LoginPage')
    };
    render(){
        return(
            <View style = {styles.container}>
                <Image source = {require('./Source/images/logo.png')} style = {styles.image}/>
                <View style = {{height: 40}}></View>
                <TouchableOpacity style={styles.loginbutton} onPress = {this.mylogin}>
                    <Text style={styles.btText} accessibilityLabel = 'App_signin'>登   录</Text>
                </TouchableOpacity>
            </View>
        );
    }
    componentWillMount() {
      if (Platform.OS === 'android') {
        BackHandler.addEventListener('hardwareBackPress', this.onBackAndroid);
      }
    }
    componentWillUnmount() {
      if (Platform.OS === 'android') {
        BackHandler.removeEventListener('hardwareBackPress', this.onBackAndroid);
      }
    }


    onBackAndroid = () => {
      if (this.lastBackPressed && this.lastBackPressed + 2000 >= Date.now()) {
        BackHandler.exitApp();
        return false;
      }
      this.lastBackPressed = Date.now();
      ToastAndroid.show('再按一次退出应用',1000);

      return true;
    };
}

class UrlLogin extends Component{
    constructor(props){
        super(props);
        this.state = {
            code : '',
        };
    }

    toPerson()
    {
        // 这里重置路由，阻止用户返回登录界面
        const resetAction = NavigationActions.reset({
            index: 0,
            actions: [
                NavigationActions.navigate({ routeName: 'AfterloginTab'}),
            ]
        });
        this.props.navigation.dispatch(resetAction);
        this.props.navigation.navigate('PersonalBlog');
    }
    getTokenFromApi(Code)
    {
        fetch(Config.AccessToken,{
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: 'client_id=' + authData.clientId + '&client_secret=' + authData.clientSecret + '&grant_type=authorization_code' + '&code=' + Code + '&redirect_uri=' + Config.CallBack,
            timeout: 5*1000
        })
        .then((response)=>response.json())//还没有对返回状态进行判断，所以还不完整
        .then((responseJson)=>{
            storage.setItem(StorageKey.USER_TOKEN,responseJson);
        }).then(()=>{
            this.toPerson();
            umengAnalysis.onEvent(umengAnalysis.umengEventId.logInEvent);
        })
        .catch((error)=>{
            ToastAndroid.show(err_info.NO_INTERNET,ToastAndroid.SHORT);
        })
    }
    render()
    {
        return (
            <View style={styles.container}>
                <WebView
                    onNavigationStateChange = {(event)=>{
                    var first_sta = event.url.indexOf('#');
                    if(event.url.substring(0,first_sta) === Config.CallBack)
                    {
                        var sta = event.url.indexOf('=');
                        var end = event.url.indexOf('&');
                        this.setState({
                            code : event.url.substring(sta+1,end)
                        })
                        if(this.state.code != '')
                        {
                            this.getTokenFromApi(this.state.code);
                        }
                    }
                }}
                source={{uri: CODE_URL}}
                style={{height: height-40, width: width}}
                startInLoadingState={true}
                domStorageEnabled={true}
                javaScriptEnabled={true}
                onError = {()=>Alert.alert('网络异常，请稍后再试！')}
                />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
    },
    item: {
        padding: 2,
        fontSize: 18,
        height: 30,
    },
    input: {
        width: 200,
        height: 40,
        color: 'white',
    },
    inputBox: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width: 280,
        height: 50,
        borderRadius: 8,
        backgroundColor: 'rgb(51,153,255)',
        marginBottom: 8,
    },
    loginbutton: {
        height: 50,
        width: 250,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8,
        backgroundColor: 'rgb(51,153,255)',
        marginTop: height/10,
    },
    btText: {
        color: '#fff',
        fontSize: 25,
    },
    image: {
        height: height/7,
        width: width/1.5,
        resizeMode: 'stretch',
    }
});

const HomeTab = TabNavigator({
    PersonalBlog: {
        screen: PersonalBlog,
        navigationOptions: {
            tabBarLabel: '我的博客',
            tabBarIcon: ({ tintColor, focused }) => (
                <Image
                    resizeMode='contain'
                    source={require('./Source/images/nav_blog.png')}
                    style={{height: 20}}
                ></Image>
            )
        }
    },
    ClassListsNew: {
        screen: ClassListsNew,
        navigationOptions: {
            tabBarLabel: '我的班级',
            tabBarIcon: ({ tintColor, focused }) => (
                <Image
                    resizeMode='contain'
                    source={require('./Source/images/nav_class.png')}
                    style={{height: 20}}
                ></Image>
            )
        }
    },
    UserInformation: {
        screen: UserInformation,
        navigationOptions: {
            tabBarLabel: '我',
            tabBarIcon: ({ tintColor, focused }) => (
                <Image
                    resizeMode='contain'
                    source={require('./Source/images/nav_i.png')}
                    style={{height: 20}}
                ></Image>
            )
        }
    },
},{
    tabBarPosition: 'bottom',
    initialRouteName: 'PersonalBlog',
    swipeEnabled: true,
    animationEnabled: true,
    tabBarOptions: {
        showIcon: true,
        showLabel: true,
        style: {
//            height: 30,

        },
        labelStyle: {
            marginTop: 0,
            fontSize: 8
        },
        iconStyle: {
            marginTop: 10,
        },
        tabStyle: {
            backgroundColor: UI.BOTTOM_COLOR,
            height: height/13,
        },
    },
})

const SimpleNavigation = StackNavigator({

    VoteDetail: {
        screen: VoteDetail,
        // navigationOptions放到VoteDetail.js里。
    },

    VoteList:{
        screen: VoteList,
        navigationOptions:{
            headerTintColor : 'white',
            headerTitle: '投票',
            headerStyle: {
                height:40,
                backgroundColor:UI.TOP_COLOR,
            },
            headerTitleStyle: {
                fontSize: 18,
            },
        }
    },

    VoteMemberList: {
        screen: VoteMemberList,
        navigationOptions: {
            headerTintColor: 'white',
            headerTitle: '已投票成员',
            headerStyle: {
                height:40,
                backgroundColor:UI.TOP_COLOR,
            },
            headerTitleStyle: {
                fontSize: 18,
            },
        }
    },

    VoteMemberCommit: {
        screen: VoteMemberCommit,
        navigationOptions: {
            headerTintColor: 'white',
            headerTitle: '投票详情',
            headerStyle: {
                height:40,
                backgroundColor:UI.TOP_COLOR,
            },
            headerTitleStyle: {
                fontSize: 18,
            },
        }
    },

    VoteAdd: {
        screen: VoteAdd,
        navigationOptions: {
            headerTintColor:'white',
            headerTitle: '投票列表',
            headerStyle: {
                height: 40,
                backgroundColor: UI.TOP_COLOR,
            },
            headerTitleStyle: {
                fontSize: 18,
            },
        }
    },

    ClassFunction: {
        screen: ClassFunction,
        navigationOptions: {
            headerTintColor:'white',
            headerTitle: '班级功能',
            headerStyle: {
                height: 40,
                backgroundColor: UI.TOP_COLOR,
            },
            headerTitleStyle: {
                fontSize: 18,
            }
        },
    },

    Welcome: {
        screen: Welcome,
        navigationOptions: {
            header: null,
        },
    },
    Loginer: {
        screen: Loginer,
        navigationOptions: {
            header: null,
        },
    },
    LoginPage: {
        screen: UrlLogin,
        navigationOptions: {
            header: null,
        },
    },
    HomeworkLists: {
        screen: HomeworkLists,
        navigationOptions: {
            //header: null,
            headerTintColor:'white',
            headerTitle: '作业列表',
            headerStyle: {
                height: 40,
                backgroundColor: UI.TOP_COLOR,
            },
            headerTitleStyle: {
                fontSize: 18,
            }
        },
    },
    UnfinishedHomeworkList: {
        screen: UnfinishedHomeworkList,
        navigationOptions: {
            //header: null,
            headerTintColor:'white',
            headerTitle: '未完成作业列表',
            headerStyle: {
                height: 40,
                backgroundColor: UI.TOP_COLOR,
            },
            headerTitleStyle: {
                fontSize: 18,
            }
        },
    },
    HomeworkDetail: {
        screen: HomeworkDetail,
        navigationOptions: {
            headerTintColor:'white',
            headerTitle: '作业详情',
            headerStyle: {
                height: 40,
                backgroundColor: UI.TOP_COLOR,
            },
            headerTitleStyle: {
                fontSize: 18,
            }
        },
    },
    ClassLists: {
        screen: ClassLists,
        navigationOptions: {
            header: null,
        }
    },

    UserInformation: {
        screen: UserInformation,
        navigationOptions: {
            header: null,
        }
    },
    ClassListsNew: {
        screen: ClassListsNew,
        navigationOptions: {
            header: null,
        }
    },
    AfterloginTab: {
        screen: HomeTab,
        navigationOptions: {
            header: null,
        }
    },
    ClassHome: {
        screen: ClassHome,
        navigationOptions: {
            headerTintColor:'white',
            headerTitle: '班级博客',
            headerStyle: {
                height: 40,
                backgroundColor: UI.TOP_COLOR,
            },
            headerTitleStyle: {
                fontSize: 18,
            }
        }
    },
    HomeworkPost: {
        screen: HomeworkPost,
        navigationOptions: {
            headerTintColor:'white',
            headerTitle: '作业发布',
            headerStyle: {
                height: 40,
                backgroundColor: UI.TOP_COLOR,
            },
            headerTitleStyle: {
                fontSize: 18,
            }
        }
    },
    HomeworkEdition: {
        screen: HomeworkEdition,
        navigationOptions: {
            headerTintColor:'white',
            headerTitle: '作业编辑',
            headerStyle: {
                height: 40,
                backgroundColor: UI.TOP_COLOR,
            },
            headerTitleStyle: {
                fontSize: 18,
            }
        }
    },
    ScheduleReminding: {
        screen: ScheduleReminding,
        navigationOptions: {
            headerTintColor:'white',
            headerTitle: '日程提醒',
            headerStyle: {
                height: 40,
                backgroundColor: UI.TOP_COLOR,
            },
            headerTitleStyle: {
                fontSize: 18,
            }
        }
    },
    BlogDetail: {
        screen: BlogDetail,
        navigationOptions: {
            headerTintColor:'white',
            headerTitle: '博文详情',
            headerStyle: {
                height: 40,
                backgroundColor: UI.TOP_COLOR,
            },
            headerTitleStyle: {
                fontSize: 18,
            },
        }
    },
    BookmarksList:{
        screen: BookmarksList,
        navigationOptions: {
            headerTintColor:'white',
            headerTitle: '收藏列表',
            headerStyle: {
                height: 40,
                backgroundColor: UI.TOP_COLOR,
            },
            headerTitleStyle: {
                fontSize: 18,
            },
        }
    },
    BlogEdition: {
        screen: BlogEdition,
        navigationOptions: {
            headerTintColor:'white',
            headerTitle: '编辑博文',
            headerStyle: {
                height: 40,
                backgroundColor: UI.TOP_COLOR,
            },
            headerTitleStyle: {
                fontSize: 18,
            },
        }
    },
    BlogBookmarks: {
        screen: BlogBookmarks,
        navigationOptions: {
            headerTintColor:'white',
            headerTitle: '添加收藏',
            headerStyle: {
                height: 40,
                backgroundColor: UI.TOP_COLOR,
            },
            headerTitleStyle: {
                fontSize: 18,
            },
        }
    },
    BookmarksEdit: {
        screen: BookmarksEdit,
        navigationOptions: {
            headerTintColor:'white',
            headerTitle: '修改收藏',
            headerStyle: {
                height: 40,
                backgroundColor: UI.TOP_COLOR,
            },
            headerTitleStyle: {
                fontSize: 18,
            },
        }
    },
    BlogComment: {
        screen: BlogComment,
        navigationOptions:{
            headerTintColor:'white',
            headerTitle: '评论',
            headerStyle:{
                height: 40,
                backgroundColor: UI.TOP_COLOR,
            },
            headerTitleStyle: {
                fontSize: 18,
            }
        }
    },
    ClassMember: {
        screen: ClassMember,
        navigationOptions:{
            headerTintColor:'white',
            headerTitle: '班级成员',
            headerStyle: {
                height:40,
                backgroundColor: UI.TOP_COLOR,
            },
            headerTitleStyle: {
                fontSize: 18,
            }
        }
    },
    ClassMemberAdd: {
        screen: ClassMemberAdd,
        navigationOptions:{
            headerTintColor:'white',
            headerTitle: '添加班级成员',
            headerStyle: {
                height:40,
                backgroundColor: UI.TOP_COLOR,
            },
            headerTitleStyle: {
                fontSize: 18,
            }
        }
    },
    MemberBlog: {
        screen: MemberBlog,
        navigationOptions:{
            headerTintColor:'white',
            headerTitle: '他的博客',
            headerStyle: {
                height:40,
                backgroundColor: UI.TOP_COLOR,
            },
            headerTitleStyle: {
                fontSize: 18,
            }
        }
    },
    CommentAdd: {
        screen: CommentAdd,
        navigationOptions:{
            headerTintColor:'white',
            headerTitle: '添加评论',
            headerStyle: {
                height:40,
                backgroundColor:UI.TOP_COLOR,
            },
            headerTitleStyle: {
                fontSize: 18,
            }
        }
    },
    AppInformation: {
        screen: AppInformation,
        navigationOptions:{
            headerTintColor:'white',
            headerTitle: '关于app',
            headerStyle: {
                height:40,
                backgroundColor:UI.TOP_COLOR,
            },
            headerTitleStyle: {
                fontSize: 18,
            }
        }

    },
    ContactPage: {
        screen: ContactPage,
        navigationOptions:{
            headerTintColor:'white',
            headerTitle: '联系开发者',
            headerStyle: {
                height:40,
                backgroundColor:UI.TOP_COLOR,
            },
            headerTitleStyle: {
                fontSize: 18,
            }
        }
    },
    Submitted: {
        screen: Submitted,
        navigationOptions:{
            headerTintColor:'white',
            headerTitle: '提交列表',
            headerStyle: {
                height:40,
                backgroundColor:UI.TOP_COLOR,
            },
            headerTitleStyle: {
                fontSize: 18,
            }
        }
    },
    HomeworkSubmit: {
        screen: HomeworkSubmit,
        navigationOptions:{
            headerTintColor : 'white',
            headerTitle: '请选择你要提交的博文',
            headerStyle: {
                height:40,
                backgroundColor:UI.TOP_COLOR,
            },
            headerTitleStyle: {
                fontSize: 18,
            }
        }
    },
    Bulletin: {
        screen: Bulletin,
        navigationOptions:{
            headerTintColor : 'white',
            headerTitle: '公告',
            headerStyle: {
                height:40,
                backgroundColor:UI.TOP_COLOR,
            },
            headerTitleStyle: {
                fontSize: 18,
            }
        }
    },
    HistoryList: {
        screen: HistoryList,
        navigationOptions:{
            headerTintColor : 'white',
            headerTitle: '浏览记录',
            headerStyle: {
                height:40,
                backgroundColor:UI.TOP_COLOR,
            },
            headerTitleStyle: {
                fontSize: 18,
            }
        }
    },
    BulletinAdd: {
        screen: BulletinAdd,
        navigationOptions:{
            headerTintColor : 'white',
            headerTitle: '添加公告',
            headerStyle: {
                height:40,
                backgroundColor:UI.TOP_COLOR,
            },
            headerTitleStyle: {
                fontSize: 18,
            }
        }
    },
    BulletinEdition: {
        screen: BulletinEdition,
        navigationOptions:{
            headerTintColor : 'white',
            headerTitle: '编辑公告',
            headerStyle: {
                height:40,
                backgroundColor:UI.TOP_COLOR,
            },
            headerTitleStyle: {
                fontSize: 18,
            }
        }
    },
    ClassSelect: {
        screen: ClassSelect,
        navigationOptions:{
            headerTintColor : 'white',
            headerTitle: '选择班级',
            headerStyle: {
                height:40,
                backgroundColor:UI.TOP_COLOR,
            },
            headerTitleStyle: {
                fontSize: 18,
            }
        }
    },
    Settings: {
        screen: Settings,
        navigationOptions:{
            headerTintColor : 'white',
            headerTitle: '设置',
            headerStyle: {
                height:40,
                backgroundColor: '#555',
            },
            headerTitleStyle: {
                fontSize: 18,
            }
        }
    },
},{
    initialRouteName: 'Welcome',
});
export default SimpleNavigation;
