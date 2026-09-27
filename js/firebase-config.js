/**
 * MODULE KẾT NỐI GOOGLE FIREBASE - ĐẶC SẢN ĐỒNG NAI
 * Hỗ trợ:
 * 1. Cloud Firestore: Lưu trữ đơn hàng trực tiếp lên đám mây 24/7.
 * 2. Firebase Authentication: Quản lý đăng ký / đăng nhập người dùng thật.
 * 3. Chế độ linh hoạt: Nếu chưa dán API Key thì tự động dùng LocalStorage (không sợ lỗi web).
 */

// 1. Cấu hình Firebase của bạn
// 👉 Lấy thông tin này tại: https://console.firebase.google.com -> Project Settings -> General -> Your apps
const firebaseConfig = {
  apiKey: "YOUR_API_KEY_HERE",
  authDomain: "dac-san-dong-nai.firebaseapp.com",
  projectId: "dac-san-dong-nai",
  storageBucket: "dac-san-dong-nai.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef123456"
};

// 2. Kiểm tra xem người dùng đã điền API Key thật chưa
let isFirebaseReady = false;
let fbAuth = null;
let fbDb = null;

try {
  if (typeof firebase !== 'undefined' && firebaseConfig.apiKey && firebaseConfig.apiKey !== "YOUR_API_KEY_HERE") {
    firebase.initializeApp(firebaseConfig);
    fbAuth = firebase.auth();
    fbDb = firebase.firestore();
    isFirebaseReady = true;
    console.log("🔥 Đã kết nối thành công với Google Firebase Cloud!");
  } else {
    console.warn("⚠️ Firebase chưa có API Key hợp lệ. Website đang chạy chế độ Local Storage dự phòng an toàn.");
  }
} catch (error) {
  console.error("Lỗi khởi tạo Firebase:", error);
}

// 3. Hàm lưu đơn hàng lên Cloud Firestore
async function saveOrderToCloud(order) {
  if (isFirebaseReady && fbDb) {
    try {
      // Lưu vào collection 'orders' trên Firestore
      const docRef = await fbDb.collection("orders").add({
        ...order,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      });
      console.log("🔥 Đã lưu đơn hàng lên Cloud Firestore với ID:", docRef.id);
      return docRef.id;
    } catch (e) {
      console.error("Lỗi khi đẩy đơn lên Firebase:", e);
    }
  }
  return null;
}

// 4. Hàm lấy danh sách đơn hàng từ Cloud
async function getOrdersFromCloud(userPhone = null) {
  if (isFirebaseReady && fbDb) {
    try {
      let query = fbDb.collection("orders").orderBy("createdAt", "desc").limit(20);
      if (userPhone) {
        query = fbDb.collection("orders").where("phone", "==", userPhone).limit(20);
      }
      const snapshot = await query.get();
      const cloudOrders = [];
      snapshot.forEach(doc => {
        cloudOrders.push({ id: doc.id, ...doc.data() });
      });
      return cloudOrders;
    } catch (e) {
      console.error("Lỗi khi tải đơn từ Firebase:", e);
    }
  }
  return null;
}

// 5. Hàm đăng ký tài khoản thật với Firebase Auth
async function registerUserWithFirebase(email, password, displayName, role) {
  if (isFirebaseReady && fbAuth && fbDb) {
    try {
      const userCredential = await fbAuth.createUserWithEmailAndPassword(email, password);
      const user = userCredential.user;

      // Cập nhật tên hiển thị
      await user.updateProfile({ displayName: displayName });

      // Lưu thông tin người dùng vào collection 'users'
      await fbDb.collection("users").doc(user.uid).set({
        name: displayName,
        email: email,
        role: role || "customer",
        points: 50,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      });

      return { success: true, user: user };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }
  return { success: false, fallback: true };
}

// 6. Hàm đăng nhập với Firebase Auth
async function loginUserWithFirebase(email, password) {
  if (isFirebaseReady && fbAuth && fbDb) {
    try {
      const userCredential = await fbAuth.signInWithEmailAndPassword(email, password);
      const user = userCredential.user;

      // Lấy thông tin role và điểm từ Firestore
      const userDoc = await fbDb.collection("users").doc(user.uid).get();
      const userData = userDoc.exists ? userDoc.data() : {};

      return {
        success: true,
        user: {
          uid: user.uid,
          name: user.displayName || userData.name || email.split('@')[0],
          email: user.email,
          role: userData.role || "Hội viên Nông Sản",
          points: userData.points || 50
        }
      };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }
  return { success: false, fallback: true };
}
