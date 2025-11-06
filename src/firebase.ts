import { initializeApp, getApp, getApps } from 'firebase/app';
import { getAuth, signInWithCustomToken, signInAnonymously, onAuthStateChanged, User } from 'firebase/auth';
import { 
    getFirestore, 
    doc, 
    getDoc, 
    setDoc, 
    updateDoc, 
    deleteDoc, 
    onSnapshot, 
    collection, 
    query, 
    where, 
    arrayUnion, 
    arrayRemove, 
    writeBatch 
} from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBRH7EJlAYNzjfiJjN1_SswNGj9rG5kXdI",
  authDomain: "rnclifb.firebaseapp.com",
  projectId: "rnclifb",
  storageBucket: "rnclifb.firebasestorage.app",
  messagingSenderId: "14442351121",
  appId: "1:14442351121:web:53e614656c9aebab81bfb0",
  measurementId: "G-Y3W262D9JZ"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

// (Biến appId và initialAuthToken có thể không cần thiết nữa nếu 
// bạn không dùng logic đó, nhưng chúng ta có thể giữ lại appId từ config)
const appId = firebaseConfig.appId;

/**
 * Hàm xác thực Firebase
 */
const authenticate = async (): Promise<User> => {
    return new Promise((resolve, reject) => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                unsubscribe();
                resolve(user);
            }
        }, reject);

        if (auth.currentUser) {
            unsubscribe();
            resolve(auth.currentUser);
            return;
        }

        // Tạm thời chỉ dùng đăng nhập ẩn danh (Anonymously)
        signInAnonymously(auth).catch(reject);
    });
};

// Xuất các hằng số và hàm cần thiết
export { 
    db, 
    auth, 
    appId, 
    authenticate,
    doc, 
    getDoc, 
    setDoc, 
    updateDoc, 
    deleteDoc, 
    onSnapshot, 
    collection, 
    query, 
    where, 
    arrayUnion, 
    arrayRemove,
    writeBatch
};