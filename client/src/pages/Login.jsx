import { useState } from 'react';
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const auth = getAuth();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      // Firebase login
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      // Get ID token
      const idToken = await userCredential.user.getIdToken();

      // Send to backend for verification
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${idToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}), // or any extra data if needed
      });

      const data = await response.json();
      if (response.ok) {
        console.log('Login successful:', data);
        // You can store your backend JWT token here (e.g., in localStorage)
      } else {
        console.error('Backend login error:', data.message);
      }
    } catch (error) {
      console.error('Firebase login error:', error.message);
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" required />
      <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" required />
      <button type="submit">Login</button>
    </form>
  );
}

export default Login;
