import firebase  from 'firebase'

// Initialize Firebase
const firebaseConfig = {
	apiKey: "AIzaSyB3Dx-so_MRgX_IkamyiWo0fMRyoq_SeLA",
	authDomain: "grapepharm.firebaseapp.com",
	databaseURL: "https://grapepharm.firebaseio.com",
	projectId: "grapepharm",
	storageBucket: "grapepharm.appspot.com",
	messagingSenderId: "273507072258",
	appId: "1:273507072258:web:c45ad46f01d88217ed2a1b",
	measurementId: "G-WXD6EQGN38"
};

const firebaseApp = firebase.initializeApp(firebaseConfig)

export default firebaseApp
