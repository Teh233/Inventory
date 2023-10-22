// importScripts("https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js");
// importScripts(
//   "https://www.gstatic.com/firebasejs/8.10.1/firebase-messaging.js"
// );

// firebase.initializeApp({
//   apiKey: "AIzaSyBiT6XOMqMOSU6Y1HoeDvNg6NTOFrHZdzE",
//   authDomain: "seller-backendnotification.firebaseapp.com",
//   projectId: "seller-backendnotification",
//   storageBucket: "seller-backendnotification.appspot.com",
//   messagingSenderId: "841442645050",
//   appId: "1:841442645050:web:1a13d8eba2ec0f52749103",
//   measurementId: "G-Z2BRRDN56Y",
// });

// const messaging = firebase.messaging();

// messaging.onBackgroundMessage((payload) => {
//   console.log("[firebase-messaging-sw.js] Received background message", payload);

//   // Extract URL from notification payload
//   const notificationUrl = payload.notification.fcmOptions.link;

//   // Open the URL when the notification is clicked
//   self.registration.showNotification(payload.notification.title, {
//     body: payload.notification.body,
//     icon: "/firebase-logo.png",
//     data: { url: notificationUrl }, // Pass the URL as data
//   });
// });

// self.addEventListener("notificationclick", (event) => {
//   event.notification.close(); // Close the notification

//   // Retrieve the URL from notification data
//   const notificationUrl = event.notification.data.url;

//   // Open the URL in the client
//   event.waitUntil(clients.openWindow(notificationUrl));
// });
