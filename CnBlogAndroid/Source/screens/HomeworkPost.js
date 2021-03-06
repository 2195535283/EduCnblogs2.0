import Config from '../config';
import api from '../api/api.js';
import { authData, err_info } from '../config'
import * as Service from '../request/request.js'
import MyAdapter from './MyAdapter.js';
import { Calendar, CalendarList, Agenda } from 'react-native-calendars';
import {
    Stepper,
    Wheel,
    Toast
} from 'teaset';
import React, { Component } from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    Image,
    TouchableHighlight,
    TextInput,
    Picker,
    ToastAndroid,
    Modal,
    ScrollView,
    TouchableOpacity,
} from 'react-native';
import { getHeaderStyle } from '../styles/theme-context';
import { RichTextEditor, RichTextToolbar } from 'react-native-zss-rich-text-editor';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import RadioModal from 'react-native-radio-master';
const screenWidth = MyAdapter.screenWidth;
const screenHeight = MyAdapter.screenHeight;
const titleFontSize = MyAdapter.titleFontSize;
const abstractFontSize = MyAdapter.abstractFontSize;
const informationFontSize = MyAdapter.informationFontSize;
const btnFontSize = 16;
const marginHorizontalNum = 16;
export default class App extends Component {

    static navigationOptions = ({ navigation }) => ({
        /* 使用global.theme的地方需要单独在页面写static navigationOptions,
            以便切换主题时及时更新。*/
        headerStyle: getHeaderStyle(),
        headerTintColor: global.theme.headerTintColor,
    })

    constructor(props) {
        super(props);
        this.state = {
            formatType: 1,//1: TintMce 2: Markdown
            title: '',
            content: '',
            isShowInHome: false,// true or false

            startModalVisible: false,
            endModalVisible: false,
            startDate: "",
            endDate: "",
            startHour: "00",
            startMinute: "00",
            endHour: "00",
            endMinute: "00"
        };
    }
    // dateString : xxxx-xx-xx a:b
    StringtoDate = (dateString) => {
        let date1 = dateString.split(' ')[0];
        let date2 = dateString.split(' ')[1];
        let yeartoday = date1.split('-');
        let hourtominute = date2.split(':');
        //let result  = new Date();
        return new Date(Number(yeartoday[0]), Number(yeartoday[1]), Number(yeartoday[2]), Number(hourtominute[0]), Number(hourtominute[1]), 0);
        //return result;
    }
    _onPress = () => {
        this.getHTML().then((result) => {
            let homeworkBody = result;
            if (homeworkBody.title != '' && homeworkBody.content != '') {
                //let url = 'https://api.cnblogs.com/api/edu/homework/publish';
                let url = Config.HomeWorkPublish;
                let classId = Number(this.props.navigation.state.params.classId);
                let postBody = {
                    blogId: this.props.navigation.state.params.blogId,
                    schoolClassId: classId,
                    title: homeworkBody.title,
                    startTime: this.state.startDate + " " + this.state.startHour + ":" + this.state.startMinute,
                    deadline: this.state.endDate + " " + this.state.endHour + ":" + this.state.endMinute,
                    content: homeworkBody.content,
                    formatType: Number(this.state.formatType),
                    isShowInHome: this.state.isShowInHome,
                }
                let st = this.StringtoDate(postBody.startTime);
                let ed = this.StringtoDate(postBody.deadline);

                if (st >= ed) {
                    ToastAndroid.show("截止日期必须在开始日期之后！", ToastAndroid.SHORT);
                }
                else {
                    let body = JSON.stringify(postBody);
                    Service.UserAction(url, body, 'POST').then((response) => {
                        console.log(response);
                        if (response.status !== 200) {
                            return null;
                        }
                        else {
                            return response.json();
                        }
                    }).then((jsonData) => {
                        if (jsonData === null) {
                            ToastAndroid.show('请求失败！', ToastAndroid.SHORT);
                        }
                        else if (jsonData.isSuccess) {
                            ToastAndroid.show('添加成功，请刷新查看！', ToastAndroid.SHORT);
                            this.props.navigation.state.params.callback();
                            this.props.navigation.goBack();
                        }
                        else if (jsonData.isWarning) {
                            ToastAndroid.show(jsonData.message, ToastAndroid.SHORT);
                        }
                        else {
                            ToastAndroid.show('发生错误，请稍后重试！', ToastAndroid.SHORT);
                        }
                    }).catch((error) => { ToastAndroid.show(err_info.NO_INTERNET, ToastAndroid.SHORT) })
                }
            }
            else {
                ToastAndroid.show("标题或内容不能为空！", ToastAndroid.SHORT);
            }
        }).catch((error) => { ToastAndroid.show('请求失败...', ToastAndroid.SHORT) })
    }
    setStartModalVisible(visible) {
        this.setState({ startModalVisible: visible });
    }
    setEndModalVisible(visible) {
        this.setState({ endModalVisible: visible });
    }
    render() {
        return (
            <View
                style={{
                    flexDirection: 'column',
                    flex: 1,
                    backgroundColor: global.theme.backgroundColor,
                }}
            >
                <KeyboardAwareScrollView>
                    <Modal
                        animationType={"slide"}
                        transparent={false}
                        visible={this.state.startModalVisible}
                        onRequestClose={() => { ToastAndroid.show("请选择一个日期", ToastAndroid.SHORT); }}
                    >
                        <View style={{
                            flex: 1,
                            marginTop: 22,
                            backgroundColor : global.theme.backgroundColor,
                        
                        }}>
                            <View
                                style={{
                                    flex: 1,
                                    backgroundColor : global.theme.backgroundColor,
                                }}
                            >
                                <Calendar
                                    onDayPress={(day) => {
                                        this.setState({ startDate: day.dateString });
                                        this.setStartModalVisible(!this.state.startModalVisible);
                                    }}
                                    theme={{
                                        calendarBackground : global.theme.backgroundColor,
                                        backgroundColor:global.theme.backgroundColor,
                                        selectedDayBackgroundColor: global.theme.headerTintColor,
                                        selectedDayTextColor: global.theme.backgroundColor,
                                        todayTextColor: 'red',
                                        dayTextColor:global.theme.textColor,
                                        arrowColor : global.theme.headerTintColor,
                                        monthTextColor : global.theme.textColor,
                                        textDisabledColor : global.theme.calendarDisableColor,
                                      }}     
                                />
                            </View>
                        </View>
                    </Modal>
                    <Modal
                        animationType={"slide"}
                        transparent={false}
                        visible={this.state.endModalVisible}
                        onRequestClose={() => { ToastAndroid.show("请选择一个日期", ToastAndroid.SHORT); }}
                    >
                        <View style={{
                            flex: 1,
                            marginTop: 22,
                            backgroundColor : global.theme.backgroundColor,
                        }}>
                            <View
                                style={{
                                    flex: 1,
                                    backgroundColor : global.theme.backgroundColor,
                                }}
                            >
                                <Calendar
                                    onDayPress={(day) => {
                                        this.setState({ endDate: day.dateString });
                                        this.setEndModalVisible(!this.state.endModalVisible);
                                    }}
                                    theme={{
                                        calendarBackground : global.theme.backgroundColor,
                                        backgroundColor:global.theme.backgroundColor,
                                        selectedDayBackgroundColor: global.theme.headerTintColor,
                                        selectedDayTextColor: global.theme.backgroundColor,
                                        todayTextColor: 'red',
                                        dayTextColor:global.theme.textColor,
                                        arrowColor : global.theme.headerTintColor,
                                        monthTextColor : global.theme.textColor,
                                        textDisabledColor : global.theme.calendarDisableColor,
                                      }}     
                                />
                            </View>
                        </View>
                    </Modal>

                    <View style={[styles.container, { backgroundColor: global.theme.backgroundColor }]}
                    >

                    </View>

                    <MyBar
                        title="起始时间"
                        onPress={() => { this.setStartModalVisible(true); }}
                        placeholder={this.state.startDate}
                        myThis={this}
                        myPrefix="start"
                    />
                    <MyBar
                        title="截止时间"
                        onPress={() => { this.setEndModalVisible(true); }}
                        placeholder={this.state.endDate}
                        myThis={this}
                        myPrefix="end"
                    />
                    {/* <View style= {styles.container}
                >
                    <Text
                        style= {styles.text}
                    >
                        格式类型
                    </Text>
                    <View
                        style= {styles.textInput}
                    >
                        <Picker
                            style= {styles.picker}
                            mode= 'dropdown'
                            selectedValue={this.state.formatType === 1 ? '1' : '2'}
                            onValueChange={(type) => this.setState({formatType: type === '1' ? 1 : 2})}>
                            <Picker.Item label="TinyMce" value="1" />
                            <Picker.Item label="Markdown" value="2" />
                        </Picker>
                    </View>
                </View> */}
                    <View style={[styles.container, { backgroundColor: global.theme.backgroundColor }]}
                    >
                        <Text
                            style={[styles.text, { color: global.theme.textColor }]}
                        >
                            首页显示
                    </Text>
                        {/* <View
                            style={styles.textInput}
                        >
                            <Picker
                                style={[styles.picker, { color: global.theme.textColor }, { backgroundColor: global.theme.backgroundColor }]}
                                mode='dropdown'
                                itemStyle={[{ color: global.theme.textColor }, { backgroundColor: global.theme.backgroundColor }]}
                                selectedValue={this.state.isShowInHome ? 'true' : 'false'}
                                onValueChange={(type) => { this.setState({ isShowInHome: type === 'true' }) }}>
                                <Picker.Item label="是" value="true" />
                                <Picker.Item label="否" value="false" />
                            </Picker>
                        </View> */}
                        <RadioModal
                            txtColor={global.theme.textColor}
                            selectedValue={this.state.isShowInHome ? 'true' : 'false'}
                            onValueChange={(value) => this.setState({ isShowInHome: value })}
                            style={{
                                flexDirection: 'row',
                                alignItems: 'space-around',
                                flex: 1,
                                backgroundColor: global.theme.backgroundColor
                            }}
                        >
                            <Text value={"true"}>是</Text>
                            <Text value={"false"}>否</Text>
                        </RadioModal>
                    </View>
                    <View style={[styles.tichTextContainer, { backgroundColor: global.theme.backgroundColor }]}
                    >
                        <RichTextEditor
                            ref={(r) => this.richtext = r}
                            style={[styles.richText]}
                            titlePlaceholder={'请在此输入作业标题...'}
                            //placeholderTextColor = {global.theme.textColor}
                            contentPlaceholder={'请在此输入作业内容...'}
                            editorInitializedCallback={() => this.onEditorInitialized()}
                        />
                        <RichTextToolbar
                            getEditor={() => this.richtext}
                        />
                        {Platform.OS === 'ios' && <KeyboardSpacer />}
                    </View>
                    <View style={{
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center',
                        alignSelf: 'stretch',
                        marginVertical: 16,
                        marginHorizontal: marginHorizontalNum
                    }}
                    >
                        <TouchableOpacity
                            style={[styles.submitButton, { backgroundColor: global.theme.buttonColor }, { borderColor: global.theme.buttonBorderColor }]}
                            onPress={() => { this._onPress() }}
                        >
                            <Text style={[styles.submitText, { color: global.theme.buttonTextColor }]}>
                                发布
                            </Text>
                        </TouchableOpacity>


                    </View>
                </KeyboardAwareScrollView>
            </View>
        );
    }

    onEditorInitialized() {
        // this.setFocusHandlers();
        // this.getHTML();
    }

    async getHTML() {
        const contentHtml = await this.richtext.getContentHtml();
        const titleText = await this.richtext.getTitleText();
        return {
            content: contentHtml,
            title: titleText,
        };
    }
}

class MyBar extends Component {
    hours;
    minutes;
    constructor(props) {
        super(props);
        this.hours = [];
        this.minutes = [];
        for (var i = 0; i < 24; i++)
            this.hours.push((i < 10 ? '0' : '') + i);
        for (var i = 0; i < 60; i++)

            this.minutes.push((i < 10 ? '0' : '') + i);

    }
    render() {
        return (
            <View style={[styles.container, {backgroundColor:global.theme.backgroundColor}]}
            >
                <Text
                    style={[styles.text, { color: global.theme.textColor }]}
                >
                    {this.props.title}
                </Text>
                <TextInput
                    onFocus={this.props.onPress}
                    placeholder={this.props.placeholder}
                    placeholderTextColor={global.theme.textColor}
                    style={[styles.textInput, { color: global.theme.textColor }]}
                    underlineColorAndroid="transparent"//设置下划线背景色透明 达到去掉下划线的效果
                />
                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                    alignSelf: 'stretch',
                    marginLeft: 8
                }}>
                    <Wheel
                        style={{ height: 48, width: 30, backgroundColor: global.theme.backgroundColor }}
                        itemStyle={{ textAlign: 'center', color: global.theme.textColor }}
                        items={this.hours}
                        onChange={(index) => {
                            if (this.props.myPrefix === "start") {
                                this.props.myThis.setState({ startHour: (index.length == 1 ? '0' + index : "" + index) });
                            } else if (this.props.myPrefix === "end") {
                                this.props.myThis.setState({ endHour: (index.length == 1 ? '0' + index : "" + index) });
                            }
                        }}
                    />
                    <Text>:</Text>
                    <Wheel
                        style={{ height: 48, width: 30, backgroundColor: global.theme.backgroundColor }}
                        itemStyle={{ textAlign: 'center', color: global.theme.textColor }}
                        items={this.minutes}
                        onChange={(index) => {
                            if (this.props.myPrefix === "start") {
                                this.props.myThis.setState({ startMinute: (index.length == 1 ? '0' + index : "" + index) });
                            } else if (this.props.myPrefix === "end") {
                                this.props.myThis.setState({ endMinute: (index.length == 1 ? '0' + index : "" + index) });
                            }
                        }}
                    />
                </View>
            </View>
        );
    }
}


const buttonWidthRatio = 0.2;
const buttonHeightRatio = 0.1;


const styles = StyleSheet.create({

    submitText: {
        fontSize: 16,
        //color: constButtonTextColor, //待处理，这里不对
    },
    submitButton: {
        //flex: 1,
        height: buttonHeightRatio * screenWidth,
        width: buttonWidthRatio * screenWidth,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 20,
        //marginLeft: (1 - buttonWidthRatio) / 2 * screenWidth, //居中
        //backgroundColor: constButtonBGColor,
        //borderColor: constButtonBorderColor,
        borderWidth: 0.5,
        borderRadius: 4,
    },

    container: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'stretch',
        marginTop: 16,
        marginHorizontal: 16
    },
    text: {
        width: 0.2 * screenWidth,
        fontSize: 16,
        color: 'black',
        textAlign: 'left',
    },
    textInput: {
        flex: 1,
        marginLeft: 8,
        height: screenHeight / 18,
        borderColor: 'gray',
        borderWidth: 1
    },
    picker: {
        flex: 1,
        height: screenHeight / 18,
        color: '#000000',
    },
    richText: {
        height: screenHeight / 2,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'transparent',
    },
    tichTextContainer: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: '#ffffff',
        paddingTop: 40
    },
});