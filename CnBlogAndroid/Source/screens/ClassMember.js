import Config from '../config';
import api from '../api/api.js';
import {authData} from '../config'
import * as Service from '../request/request.js'
import MyAdapter from './MyAdapter.js';
import React, { Component} from 'react';
import {StorageKey} from '../config'
import {err_info} from '../config'
import { Container, Header, Fab, Button, Icon } from 'native-base';
import {flatStyles} from '../styles/styles';

import {
    StyleSheet,
    Text,
    View,
    ToastAndroid,
    TouchableOpacity,
    Image,
    TextInput,
    Dimensions,
    FlatList,
    TouchableHighlight,
} from 'react-native';
import {
    StackNavigator,
    TabNavigator,
} from 'react-navigation';
import { getHeaderStyle } from '../styles/theme-context';
const screenWidth= MyAdapter.screenWidth;
const screenHeight= MyAdapter.screenHeight;
const titleFontSize= MyAdapter.titleFontSize;
const abstractFontSize= MyAdapter.abstractFontSize;
const informationFontSize= MyAdapter.informationFontSize;
const btnFontSize= MyAdapter.btnFontSize;   
const ItemHandler = require('../DataHandler/ClassMember/ItemHandler')

export default class ClassMember extends Component{

    static navigationOptions = ({ navigation }) => ({
        /* 使用global.theme的地方需要单独在页面写static navigationOptions,
            以便切换主题时及时更新。*/
        headerStyle: getHeaderStyle(),
        headerTintColor: global.theme.headerTintColor,
    })

    constructor(props){
        super(props);
        this.state = {
            members: [],
            membership: 1,
            isRequestSuccess: false,//初始认为请求未成功，不进行渲染，以防App崩溃
        }
    }
    _isMounted;

    componentWillMount = ()=>{
        this._isMounted=true;
        let url = Config.MemberList + this.props.navigation.state.params.classId;
        Service.Get(url).then((jsonData)=>{
            if(jsonData!=='rejected')
            {
                this.setState({
                    isRequestSuccess: true,
                })
                if(this._isMounted){
                    this.setState({
                        members: jsonData,
                    })
                }
            }
        })
        .then(()=>{
            global.storage.save({key:StorageKey.CLASS_MEMBER , data:this.state.members});
        })
        .catch((error) => {
            ToastAndroid.show(err_info.NO_INTERNET,ToastAndroid.SHORT);
            global.storage.load({key:StorageKey.CLASS_MEMBER})
            .then((ret)=>{
                this.setState({
                    members : ret,
                })
            }).catch((err)=>{
                ToastAndroid.show(err_info.TIME_OUT,ToastAndroid.SHORT);
                this.props.navigation.navigate('Loginer');
            })
        });
		
        let url1 = Config.apiDomain + api.user.info;
        Service.Get(url1).then((jsonData)=>{
            let url2= Config.apiDomain+"api/edu/member/"+jsonData.BlogId+"/"+this.props.navigation.state.params.classId;
            Service.Get(url2).then((jsonData)=>{
                if(this._isMounted){
                    this.setState({
                        membership: jsonData.membership,
                    })
                }
            })
        }).catch((error) => {
            ToastAndroid.show(err_info.NO_INTERNET,ToastAndroid.SHORT);
        });
    }
    UpdateData = ()=>{
        this.setState({
            isRequestSuccess: false,
        })
        this.componentWillMount();
    }
    componentWillUnmount=()=>{
        this._isMounted=false;
    }
    _renderItem = (item)=>{
        let item1 = item;
        let {blogUrl,displayName,avatarUrl,membership,realName,blogId} = item1.item;
        return(
            <View style={flatStyles.cell}>
                <TouchableOpacity
                    onPress = {()=>this.props.navigation.navigate('MemberBlog',{blogId:blogId,blogUrl: blogUrl})}
                    style = {[styles.listcontainer, {backgroundColor:global.theme.backgroundColor}]}
                >
                    <View style = {{flex:1}}>
                        <Image source = {avatarUrl?{uri:avatarUrl}:require('../images/defaultface.png')} style = {[styles.avatarstyle, {opacity: global.theme.imageOpacity}]}/>
                    </View>
                    <View style = {[styles.textcontainer, {backgroundColor:global.theme.backgroundColor}]}>
                        <Text style = {{fontSize: 20,color: global.theme.textColor,flex:2}}>{displayName+ ItemHandler(realName)}</Text>
                        <Text style = {{fontSize: 15,color: global.theme.grayTextColor,flex:3}}>{membership===1?'学生':membership===2?'老师':'助教'}</Text>
                    </View>
                </TouchableOpacity>
            </View>
        )
    }

    _onPress = ()=>{
        if(this.state.membership!=2 && this.state.membership!=3)
        {
            ToastAndroid.show("您没有权限，只有老师和助教才能添加班级成员哦！",ToastAndroid.SHORT);
        }
        else
        {
            this.props.navigation.navigate('ClassMemberAdd',
            {classId: this.props.navigation.state.params.classId})
        }
    }
    generateAddButton(){
        if(this.state.membership == 2 || this.state.membership == 3){
            return(
                <TouchableHighlight 
                    underlayColor="#3b50ce"
                    activeOpacity={0.5}
                    style={{
                        position:'absolute',
                        bottom:20,
                        right:10, 
                        backgroundColor: "#3b50ce",
                        width: 52, 
                        height: 52, 
                        borderRadius: 26,
                        justifyContent: 'center', 
                        alignItems: 'center', 
                        margin: 20}} 
                        onPress={this._onPress} >
                    
                    <Text
                        style= {{
                            fontSize: 30,
                            color: '#ffffff',
                            textAlign: 'center',
                            fontWeight: '100',
                        }}
                    >
                        +
                    </Text>
                    
                </TouchableHighlight>
            );
        }
        else return;
    }
    render(){
        var data = [];
        // 在请求成功的情况下渲染列表
        for(var i in this.state.members)
        {
            data.push({
                key: this.state.members[i].memberId,//成员Id
                blogUrl: this.state.members[i].blogUrl,//博客地址
                displayName: this.state.members[i].displayName,//昵称
                avatarUrl: this.state.members[i].avatarUrl,//头像链接
                membership: this.state.members[i].membership,//1：学生 2：老师 3: 助教
                realName: this.state.members[i].realName,//真实姓名
                blogId: this.state.members[i].blogId,
            })
        }

        return(
            <View style = {[styles.container, {backgroundColor:global.theme.backgroundColor}]}>
				
                <View style={{ height: 1, backgroundColor: global.theme.backgroundColor,  marginTop: 0.005*screenHeight, alignSelf:'stretch'}}/>
                <View
                    style= {{
                        flexDirection: 'row',
                        justifyContent:'flex-start',
                        alignItems: 'flex-start',
                        alignSelf: 'stretch',
                        flex:1,
                    }}
                >
                    <FlatList
                        renderItem={this._renderItem}
                        data={data}
                        onRefresh = {this.UpdateData}
                        refreshing= {false}
                    />
					{this.generateAddButton()}
                </View>
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
    listcontainer: {
        flexDirection: 'row',
        justifyContent:'flex-start',
        alignItems: 'flex-start',
        flex:1,
        backgroundColor: 'white',
        marginLeft: 8,
        marginRight: 12,
        //alignSelf: 'stretch',
    },
    avatarstyle: {
        width: 0.15*screenWidth,
        height: 0.15*screenWidth,
        marginBottom: 5,
        marginTop: 5,
        borderRadius : 40,
        left : 2,
    },
    textcontainer: {
        justifyContent:'flex-start',
        alignItems: 'flex-start',
        flex: 4,
        backgroundColor: 'white',
        //alignSelf: 'stretch',
    }
});