const admin = require('firebase-admin');

// Initialize Firebase Admin
const initializeFirebase = () => {
  try {
    const serviceAccount = {
      projectId: process.env.FIREBASE_PROJECT_ID,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL
    };

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });

    console.log('✅ Firebase Admin initialized');
  } catch (error) {
    console.error('❌ Firebase initialization failed:', error.message);
  }
};

/**
 * Send push notification to a device
 * @param {string} deviceToken - FCM device token
 * @param {object} notification - Notification data
 * @returns {Promise<object>} - Send result
 */
const sendPushNotification = async (deviceToken, notification) => {
  try {
    const message = {
      notification: {
        title: notification.title,
        body: notification.body,
        imageUrl: notification.image
      },
      data: notification.data || {},
      token: deviceToken,
      android: {
        priority: 'high',
        notification: {
          sound: 'default',
          channelId: 'default'
        }
      },
      apns: {
        payload: {
          aps: {
            sound: 'default',
            badge: 1
          }
        }
      }
    };

    const response = await admin.messaging().send(message);
    return response;
  } catch (error) {
    console.error('Push notification error:', error.message);
    throw error;
  }
};

/**
 * Send push notification to multiple devices
 * @param {Array<string>} deviceTokens - Array of FCM device tokens
 * @param {object} notification - Notification data
 * @returns {Promise<object>} - Send result
 */
const sendMulticastNotification = async (deviceTokens, notification) => {
  try {
    const message = {
      notification: {
        title: notification.title,
        body: notification.body,
        imageUrl: notification.image
      },
      data: notification.data || {},
      tokens: deviceTokens,
      android: {
        priority: 'high'
      }
    };

    const response = await admin.messaging().sendMulticast(message);
    return response;
  } catch (error) {
    console.error('Multicast notification error:', error.message);
    throw error;
  }
};

module.exports = {
  initializeFirebase,
  sendPushNotification,
  sendMulticastNotification
};
