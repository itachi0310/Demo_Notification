/*
 * Clear Systems Asia
 * Hien Phung
 * Email: hienphung@clearsystems.asia
 */

// import FCM, {
// 	FCMEvent, NotificationType, RemoteNotificationResult,
// 	WillPresentNotificationResult
// } from 'react-native-fcm';

import type {Notification, NotificationOpen, RemoteMessage} from 'react-native-firebase';
import firebase from 'react-native-firebase';
import {Platform,Alert} from 'react-native';


export default NotificationManager = {
	init() {
		//Init FCM Token
		firebase.messaging().getToken().then(fcmToken => {
			if (fcmToken) {
				
			} else {
				
			}
		});
		
		firebase.messaging().hasPermission().then(enabled => {
			if (enabled) {
				// user has permissions
				
				// this.listen();
				
				this.createAndroidChannel();
				
			} else {
				// user doesn't have permission
				
				//Request permission
				firebase.messaging().requestPermission().then(() => {
					// User has authorised
					
					// this.listen();
					this.createAndroidChannel();
				}).catch(error => {
					// User has rejected permissions
					
				});
			}
		});
		
	},
	
	createAndroidChannel() {
		// Build a channel
		const channel = new firebase.notifications.Android.Channel(
			'demo-notification', 'Demo Notification',
			firebase.notifications.Android.Importance.Max).setDescription(
			'Default Demo Notification notification channel');
		// Create the channel
		firebase.notifications().android.createChannel(channel).then(() => {
			//LogUtils.log('Created android channel')
		})
	},
	
	onTokenRefreshListener: firebase.messaging().onTokenRefresh(fcmToken => {
	
	}),
	
	messageListener: firebase.messaging().
		onMessage((message: RemoteMessage) => {
			// Process your message as required
			Alert.alert(JSON.stringify(message));
		}),
	
	handleRemoteMessage: async (message: RemoteMessage) => {
		// handle your message
		
		return Promise.resolve();
	},
	
	notificationDisplayedListener: firebase.notifications().
		onNotificationDisplayed((notification: Notification) => {
			// Process your notification as required
			// ANDROID: Remote notifications do not contain the channel ID. You will have to specify this manually if you'd like to re-display the notification.
			
		}),
	
	notificationListener: firebase.notifications().
		onNotification(notification => {
			this.watchID = navigator.geolocation.getCurrentPosition((position) => {
				// Create the object to update this.state.mapRegion through the onRegionChange function
				let region = {
					latitude:       position.coords.latitude,
					longitude:      position.coords.longitude,
					latitudeDelta:  0.00922*1.5,
					longitudeDelta: 0.00421*1.5
				}
				console.log('Your location : latitude : ' + region.latitude + ' longitude: ' + region.longitude);
				Alert.alert('Your location : latitude : ' + region.latitude + ' longitude: ' + region.longitude);
				
			}, (error)=>  Alert.alert('Your location do not enable'));
			
			
			notification.setSound('default');
			if (Platform.OS === 'android') {
				notification.android.setPriority(
					firebase.notifications.Android.Priority.High);
				notification.android.setVibrate(500);
				notification.android.setChannelId('demo-notification');
				notification.android.setLargeIcon('ic_notification');
				notification.android.setSmallIcon('ic_notification');
				notification.android.setColor('red');
				notification.android.setAutoCancel(true);
				if (notification.data && notification.data.picture) {
					notification.android.setBigPicture(
						notification.data.picture, 'ic_notification',
						notification.title, notification.body);
				}
			}
			firebase.notifications().displayNotification(notification);
			
		}),
	notificationOpenedListener: firebase.notifications().
		onNotificationOpened((notificationOpen: NotificationOpen) => {
			// Get the action triggered by the notification being opened
			const action = notificationOpen.action;
			// Get information about the notification that was opened
			const notification: Notification = notificationOpen.notification;
			
		}),
	backgroundNotificationOpenedListener() {
		firebase.notifications().
			getInitialNotification().
			then((notificationOpen: NotificationOpen) => {
				if (notificationOpen) {
					// App was opened by a notification
					// Get the action triggered by the notification being opened
					const action = notificationOpen.action;
					// Get information about the notification that was opened
					const notification: Notification = notificationOpen.notification;
				}
			});
	},
	
	listen() {
		//Data only message listener
		this.onTokenRefreshListener();
		this.messageListener();
		
		//Notification listener:
		this.notificationDisplayedListener();
		this.notificationListener();
		this.notificationOpenedListener();
		this.backgroundNotificationOpenedListener();
	},
	
	setBadge(number) {
		firebase.notifications().setBadge(number);
	},
	
	onRegionChange(region, lastLat, lastLong) {
		this.setState({
			mapRegion: region,
			// If there are no new values set the current ones
			lastLat: lastLat || this.state.lastLat,
			lastLong: lastLong || this.state.lastLong
		});
	}
	
}




