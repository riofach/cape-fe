// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
	apiKey: 'AIzaSyAussPfvga1P9CSgMogUSrhmGfFBYdUzbw',
	authDomain: 'cape-c2f48.firebaseapp.com',
	projectId: 'cape-c2f48',
	storageBucket: 'cape-c2f48.firebasestorage.app',
	messagingSenderId: '919018248321',
	appId: '1:919018248321:web:4b36e56c6efcc640669580',
	measurementId: 'G-ZS9HH8JVKV',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
