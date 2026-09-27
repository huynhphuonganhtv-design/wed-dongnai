/**
 * MODULE KẾT NỐI GOOGLE FIREBASE - ĐẶC SẢN ĐỒNG NAI
 * Dự án thật: weddongnai
 * Hỗ trợ:
 * 1. Cloud Firestore: Lưu trữ đơn hàng & hồ sơ người dùng trên đám mây 24/7.
 * 2. Firebase Authentication: Quản lý đăng ký / đăng nhập người dùng thật (Email/Password).
 * 3. Chế độ linh hoạt: Nếu chưa dán API Key thì tự động dùng LocalStorage (không sợ lỗi web).
 *
 * LƯU Ý: Trang web dùng thư viện Firebase bản "compat" (nạp qua thẻ <script> thường,
 * không dùng import ES module), nên các hàm gọi ra là firebase.initializeApp(),
 * firebase.auth(), firebase.firestore() — đúng kiểu cũ, khớp với 3 dòng <script>
 * firebase-app-compat.js / firebase-auth-compat.js / firebase-firestore-compat.js
 * đã được thêm vào đầu file index.html.
 */

// 1. Cấu hình Firebase dự án thật "weddongnai"
const firebaseConfig = {
  apiKey: "AIzaSyBDrnoKGNbKHgDWuX_y77u67viywxgWKMI",
  authDomain: "weddongnai.firebaseapp.com",
  projectId: "weddongnai",
  storageBucket: "weddongnai.firebasestorage.app",
  messagingSenderId: "273705439741",
  appId: "1:273705439741:web:009d28d29592a19be9c994"
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
    console.log("🔥 Đã kết nối thành công với Google Firebase Cloud (dự án weddongnai)!");
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
// email: có thể là email thật, hoặc "email giả" được tạo từ số điện thoại
//        (xem hàm toFirebaseEmail() trong index.html)
async function registerUserWithFirebase(email, password, displayName, role) {
  if (isFirebaseReady && fbAuth && fbDb) {
    try {
      const userCredential = await fbAuth.createUserWithEmailAndPassword(email, password);
      const user = userCredential.user;

      await user.updateProfile({ displayName: displayName });

      await fbDb.collection("users").doc(user.uid).set({
        name: displayName,
        email: email,
        role: role || "customer",
        points: 50,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      });

      return { success: true, user: { uid: user.uid, name: displayName, email: email } };
    } catch (error) {
      return { success: false, message: error.code || error.message };
    }
  }
  return { success: false, fallback: true, message: 'firebase-not-ready' };
}

// 6. Hàm đăng nhập với Firebase Auth
async function loginUserWithFirebase(email, password) {
  if (isFirebaseReady && fbAuth && fbDb) {
    try {
      const userCredential = await fbAuth.signInWithEmailAndPassword(email, password);
      const user = userCredential.user;

      const userDoc = await fbDb.collection("users").doc(user.uid).get();
      const userData = userDoc.exists ? userDoc.data() : {};

      return {
        success: true,
        user: {
          uid: user.uid,
          name: user.displayName || userData.name || email.split('@')[0],
          email: user.email,
          role: userData.role === 'farmer' ? 'Xã viên / Chủ Vườn' : (userData.role || "Hội viên Nông Sản"),
          points: userData.points || 50
        }
      };
    } catch (error) {
      return { success: false, message: error.code || error.message };
    }
  }
  return { success: false, fallback: true, message: 'firebase-not-ready' };
}
