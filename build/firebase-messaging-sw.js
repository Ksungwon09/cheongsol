// Scripts for firebase and firebase messaging
importScripts('https://www.gstatic.com/firebasejs/9.22.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.22.1/firebase-messaging-compat.js');

const firebaseConfig = {
  apiKey: "AIzaSyBOzG0vqxxzrLgmpFxdxBRAPLqhMR33Ogg",
  authDomain: "che0ngsolsitedb.firebaseapp.com",
  projectId: "che0ngsolsitedb",
  storageBucket: "che0ngsolsitedb.firebasestorage.app",
  messagingSenderId: "733909168020",
  appId: "1:733909168020:web:9f55df72e43eacd988e981",
  measurementId: "G-61GZ1Q99YB"
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  // Customize notification here
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/logo192.png'
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
