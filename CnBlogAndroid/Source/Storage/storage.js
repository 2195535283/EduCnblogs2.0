//对AsyncStorage的封装
//存储方式：键值对
import React,{
	AsyncStorage,
	ToastAndroid
} from 'react-native';

export function setItem(key, value) {
	if (key != null && value != null){	// key或value为null或者undefined时直接返回
		return AsyncStorage.setItem(key, JSON.stringify(value));
	}
}

export function mergeItem(key, value) {
	if (key != null && value != null){
		return AsyncStorage.mergeItem(key, JSON.stringify(value));
	}
}

export function getItem(key) {
	return AsyncStorage.getItem(key)
		.then(function (value) {
			return JSON.parse(value);
		});
}

export function multiGet(keys) {
	return AsyncStorage.multiGet(keys)
		.then(results=> {
			return results.map(item=> {
				return [item[0], JSON.parse(item[1])]
			})
		});
}

export function multiRemove(keys) {
	return AsyncStorage.multiRemove(keys)
}

export const removeItem = AsyncStorage.removeItem;

export const clear = AsyncStorage.clear;