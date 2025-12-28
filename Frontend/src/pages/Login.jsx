import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Input from '../components/Input';
import Button from '../components/Button';
import { LogIn } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(email, password);

    if (result.success) {
      // AuthContext will update user state, we just need to redirect
      // We can check the role from the result if we returned it, or wait for state update
      // But for simplicity, let's assume successful login updates state quickly enough or we redirect to a common area
      // Actually, let's check the local storage or just redirect to home/admin based on logic in component
      // Better yet, let's just navigate to root and let the router handle or check role here
      // Since we don't have the user object immediately updated in this scope without waiting, 
      // we can rely on the fact that login was successful.
      
      // A safe bet is to redirect to home, and if admin, they can go to admin panel.
      // Or we can try to peek at the response if we modified login to return user.
      // Let's just go to / for now, or /admin/dashboard if we know it's admin.
      // Ideally, login should return the user object.
      navigate('/');
    } else {
      setError(result.message);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 border border-slate-100 dark:border-slate-700">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Giriş Yap</h1>
          <p className="text-slate-600 dark:text-slate-400">Hesabınıza erişmek için giriş yapın</p>
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 p-4 rounded-lg mb-6 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="Email Adresi"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="ornek@email.com"
          />

          <Input
            label="Şifre"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="••••••••"
          />

          <Button type="submit" className="w-full" isLoading={loading}>
            <LogIn size={20} className="mr-2" /> Giriş Yap
          </Button>
        </form>

        <div className="mt-6 text-center text-sm text-slate-600 dark:text-slate-400">
          Hesabınız yok mu?{' '}
          <Link to="/register" className="text-blue-600 dark:text-blue-400 font-semibold hover:underline">
            Kayıt Ol
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
