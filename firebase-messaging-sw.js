importScripts('https://www.gstatic.com/firebasejs/8.2.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.2.0/firebase-messaging.js');
// Initialize the Firebase app in the service worker by passing the generated config
var firebaseConfig = {
    apiKey: "AIzaSyBz8OBDiiHmefXc9RvJ1vB1fMlTtpCuwu0",
    authDomain: "notcode-1df8d.firebaseapp.com",
    databaseURL: "https://notcode-1df8d-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "notcode-1df8d",
    storageBucket: "notcode-1df8d.appspot.com",
    messagingSenderId: "472227032173",
    appId: "1:472227032173:web:78303ef446e57409c0a364",
    measurementId: "G-TGV7QKTFJ6"
};

firebase.initializeApp(firebaseConfig);

// Retrieve firebase messaging
const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
console.log('Received background message ', payload);

const notificationTitle = payload.notification.title;
const notificationOptions = {
body: payload.notification.body,
};

self.registration.showNotification(notificationTitle,
notificationOptions);
});`