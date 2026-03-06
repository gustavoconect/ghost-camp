import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

async function createAdmin() {
    try {
        const userCredential = await createUserWithEmailAndPassword(
            auth,
            "admin@ghostcamp.com.br",
            "Trilhas123!"
        );
        console.log("Admin criado com sucesso!", userCredential.user.email);
        process.exit(0);
    } catch (error) {
        if (error.code === 'auth/email-already-in-use') {
            console.log("Admin já existe.");
            process.exit(0);
        }
        console.error("Erro:", error.message);
        process.exit(1);
    }
}

createAdmin();
