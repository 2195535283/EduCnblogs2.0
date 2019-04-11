import Config from '../config';
import api from '../api/api.js';
import {authData} from '../config'
import * as Service from '../request/request.js'
import MyAdapter from './MyAdapter.js';
import HeaderNoBackComponent from './HeaderNoBackComponent.js';
import React, { Component} from 'react';
import {err_info} from '../config';
import {Button, Content} from 'native-base';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    Image,
	ToastAndroid,
    TouchableHighlight,
    TextInput,
    FlatList,
    TouchableOpacity,
    Dimensions,
    PixelRatio,
    ScrollView
} from 'react-native';
import {
    StackNavigator,
} from 'react-navigation';
const screenWidth= MyAdapter.screenWidth;
const screenHeight= MyAdapter.screenHeight;
const titleFontSize= MyAdapter.titleFontSize;
const abstractFontSize= MyAdapter.abstractFontSize;
const informationFontSize= MyAdapter.informationFontSize;
const btnFontSize= MyAdapter.btnFontSize;

export default class ClassHome extends Component{
    constructor(props){
        super(props);
        this.state = {
            classname: '', // 班级名称
            universityname: '', // 大学名称
            iconurl: 'https://i.loli.net/2017/10/30/59f7235c222ae.png', // 图标地址
            bulletinCount: 0, // 公告数目
        }
    }

    _isMounted;
     componentWillMount = ()=>{
        this._isMounted = true;
        let classId = this.props.navigation.state.params.classId;
        //let url = 'https://api.cnblogs.com/api/edu/schoolclass/'+classId;
		let url = Config.ClassInfo + classId;
        Service.Get(url).then((jsonData)=>{
            if(this._isMounted){
                this.setState({
                    classname: jsonData.nameCn,
                    universityname: jsonData.universityNameCn,
                    iconurl: jsonData.icon,
                    bulletinCount: jsonData.bulletinCount,
                })
            }
        }).catch((error) => {
            ToastAndroid.show(err_info.NO_INTERNET,ToastAndroid.SHORT);
        });
    }
    componentWillUnmount=()=>{
        this._isMounted = false;
    }
    render() {
    let classId = this.props.navigation.state.params.classId;
    return (
        <View
        style= {{
            flexDirection: 'column',
            backgroundColor: 'white',
            flex: 1,
        }}
        >
        <ScrollView>
            <View style= {{
                flexDirection: 'row',
                justifyContent:'center',
                alignItems: 'center',
                marginTop:0.05*screenHeight,
                flex: 1
            }}
            >
                <Image
                    style= {{
                        width: 0.3*screenHeight,
                        height: 0.3*screenHeight
                    }}
                    source={{uri: this.state.iconurl}}
                />
            </View>
            <View style= {{
                flexDirection: 'column',
                justifyContent:'center',
                alignItems: 'center',
                marginTop:0.04*screenHeight,
                marginBottom:0.025*screenHeight,
                flex: 1,
            }}
            >
                <Text style= {{
	            	alignSelf:'center',
                    fontSize: titleFontSize+10,
                    fontWeight: 'bold',
	                color: 'rgb(51,51,51)',
                    textAlign: 'center',
                    marginBottom: 0.03*screenHeight,
                }}>
                    {this.state.universityname}
                </Text>
                <Text style= {{
	            	alignSelf:'center',
	                fontSize: titleFontSize,
	                color: 'rgb(51,51,51)',
                    textAlign: 'center',
                    marginLeft: 0.15*screenWidth,
                    marginRight: 0.15*screenWidth,
                    marginBottom: 0.02*screenHeight
                }}>
                    {this.state.classname}
                </Text>
            </View>
            <View style= {{
                flexDirection: 'column',
                justifyContent:'center',
                alignItems: 'center',
                flex: 1
            }}>
            <Content>
                <Button primary 
                    onPress={()=>this.props.navigation.navigate('HomeworkLists',{classId:classId})}
                    style = {styles.button}
                >
	                <Text style = {{fontSize: 20, color: 'white'}}>所有作业</Text>
                </Button>
                <Button primary 
                    onPress={()=>this.props.navigation.navigate('ClassMember',{classId:classId})}
                    style = {styles.button}
                >
	                <Text style = {{fontSize: 20, color: 'white'}}>班级成员</Text>
                </Button>
            </Content>
            </View>
        </ScrollView>
        </View>
    );
  }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
    },
    button: {
        height: 0.2*0.618*screenWidth,
        width: 0.618*screenWidth,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8,
        marginBottom: 20,
    }
});