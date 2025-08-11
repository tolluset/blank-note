'use client';

import GoogleLoginButton from '../components/GoogleLoginButton';
import { authAPI } from '../api';
import { useAuth } from '../contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useLanguage } from '../contexts/LanguageContext';

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const { t } = useLanguage();

  const handleGoogleLoginSuccess = async (credential: string) => {
    try {
      const response = await authAPI.googleLogin(credential);
      localStorage.setItem('auth_token', response.token);
      
      // 사용자 정보를 Context에 설정
      const userData = await authAPI.getMe();
      login(userData);
      
      router.push('/');
    } catch (error) {
      console.error('Login failed:', error);
      alert(t('loginFailed'));
    }
  };

  const handleGoogleLoginError = () => {
    console.error('Google login error');
    alert(t('googleLoginFailed'));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Blank Note</h2>
          <p className="text-gray-600">{t('loginToStart')}</p>
        </div>
        
        <div className="mt-8">
          <GoogleLoginButton
            onSuccess={handleGoogleLoginSuccess}
            onError={handleGoogleLoginError}
          />
        </div>
      </div>
    </div>
  );
}