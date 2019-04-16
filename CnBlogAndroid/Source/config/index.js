import Storage from 'react-native-storage';
import {AsyncStorage} from 'react-native';

export default{
	apiDomain : 'https://api.cnblogs.com/',
	AccessToken : 'https://oauth.cnblogs.com/connect/token',
	AuthCode : 'https://oauth.cnblogs.com/connect/authorize',
	CallBack : 'https://oauth.cnblogs.com/auth/callback',
	ClassList : 'https://api.cnblogs.com/api/edu/member/schoolclasses',
	MemberList : 'https://api.cnblogs.com/api/edu/schoolclass/members/',
	ClassInfo : 'https://api.cnblogs.com/api/edu/schoolclass/',
	BlogComment : 'https://api.cnblogs.com/api/blogs/',                  //博客评论
	BlogDetail : 'https://api.cnblogs.com/api/blogposts/',              //博客内容
	AddMember : 'https://api.cnblogs.com/api/edu/member/register/displayName',
	HomeWorkDetail : 'https://api.cnblogs.com/api/edu/homework/',
	HomeWorkPublish : 'https://api.cnblogs.com/api/edu/homework/publish',
	HomeWorkEdit : 'https://api.cnblogs.com/api/edu/homework/edit/',//https://api.cnblogs.com/api/edu/homework/edit/{homeworkId}
	HomeWorkClose : 'https://api.cnblogs.com/api/edu/homework/close/',//关闭作业https://api.cnblogs.com/api/edu/homework/close/{schoolClassId}/{homeworkId}
	HomeWorkRemove : 'https://api.cnblogs.com/api/edu/homework/remove/',
	HomeWorkAnswer : 'https://api.cnblogs.com/api/edu/homework/answers/',
	BlogInClassId: 'https://api.cnblogs.com/api/edu/member/',
	SubmitJudge: 'https://api.cnblogs.com/api/edu/answer/iscommitted/',
	BulletinList: 'https://api.cnblogs.com/api/edu/schoolclass/bulletins/',
	BulletinPublish: 'https://api.cnblogs.com/api/edu/bulletin/publish/',
    BulletinEdit: 'https://api.cnblogs.com/api/edu/bulletin/modify/',
    BulletinDel: 'https://api.cnblogs.com/api/edu/bulletin/remove/',
	Bookmarks: 'https://api.cnblogs.com/api/Bookmarks',
	VoteList : 'https://api.cnblogs.com/api/edu/schoolclass/votes', //分页获取投票信息
	VoteDetail :'https://api.cnblogs.com/api/edu/vote/{voteId}'
}

export const authData = {
	clientId : "273d136d-9df0-42ad-bcbd-cb1f9824f363",
	clientSecret : "C6FH4OmZ0AV2Gp7FtK2lITL5TAsctNZpII7SkzVDOdXcXVJ3s6KYKoNJp5TuCqUv3LJpqzkyYNCyZBYT"
}

export const StorageKey = {
	USER_TOKEN : "USER_TOKEN",
	USER_INFO : "USERINFO",
	PERSON_BLOG : "PERSONALBLOG",
	CLASS_LIST : "CLASSES",
	CLASS_LIST_IMG : "CLASSIMG",
	CLASS_EMPTY	: "CLASSEMPTY",
	CLASS_MEMBER : "CLASSMEM",
	CLASS_HOMEWORK : "CLASSHOMEWORK",
	HOMEWORK_COUNT : "HOMEWORKCOUNT",
	MEMBER_SHIP : "MEMBERSHIP",
	BLOG_TITLE : "BLOGTITLE",
	DISPLAYNAME : "DISPLAYNAME",
	FACEURL : "FACEURL",
	BLOGAPP : "BLOGAPP",
	SENIORITY : "SENIORITY",
	BLOGDETAIL : "BLOGDETAIL",
	HOMEWORKDETAIL : "HOMEWORKDETAIL"
}

export const ActionType = {
	GET : "GET",
	POST : "POST",
	DELETE: "DELETE",
	PATCH : "PATCH"
}
export const UI = {
	TOP_COLOR : '#303f9f',
	BOTTOM_COLOR : '#3f51b5'
}
export const err_info = {
	NO_INTERNET : "网络请求失败，请稍后再试！",
	TIME_OUT : "身份信息过期，请重新登录."
}

//这里是一个全局变量，存放的是用户的信息，调用的时候不用写是哪个模块里的，直接用global.user_infomation.**就行
global.user_information = {
	userId : '',
	SpaceUserId : -1,
	BlogId : -1,
	DisplayName : '',
	face : '',
	Seniority : '',  //园龄
	BlogApp : ''	 // 博客名
}

var storage = new Storage({
	size : 1000,
	storageBackend : AsyncStorage,
	defaultExpires : 1000*3600*24,
	enableCache : true
})

global.storage = storage;
global.internet = true;

global.unsummitted = [];
global.timeTouch = null;

/**全局的设置选项，可用于个性化定制 */
global.settings = {
	showSettings: false,
	displayDetailTime: true,
};
