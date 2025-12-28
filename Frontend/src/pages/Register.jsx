import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Input from '../components/Input';
import Button from '../components/Button';
import { UserPlus } from 'lucide-react';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await register(name, email, password);

    if (result.success) {
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
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Kayıt Ol</h1>
          <p className="text-slate-600 dark:text-slate-400">Yeni bir hesap oluşturun</p>
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 p-4 rounded-lg mb-6 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="Ad Soyad"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="Adınız Soyadınız"
          />

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
            <UserPlus size={20} className="mr-2" /> Kayıt Ol
          </Button>
        </form>

        <div className="mt-6 text-center text-sm text-slate-600 dark:text-slate-400">
          Zaten hesabınız var mı?{' '}
          <Link to="/login" className="text-blue-600 dark:text-blue-400 font-semibold hover:underline">
            Giriş Yap
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
