"use client";

import { useAuth } from "../contexts/AuthContext";
import { authAPI } from "../api";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import GoogleLoginButton from "./GoogleLoginButton";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const { login } = useAuth();

  const handleGoogleLogin = async (credential: string) => {
    try {
      const response = await authAPI.googleLogin(credential);
      localStorage.setItem("auth_token", response.token);

      // 사용자 정보를 Context에 설정
      const userData = await authAPI.getMe();
      login(userData);

      onClose();
      window.location.reload();
    } catch (error) {
      console.error("로그인 실패:", error);
      alert("로그인에 실패했습니다.");
    }
  };

  const handleGoogleLoginError = () => {
    console.error("Google login error");
    alert("구글 로그인에 실패했습니다.");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="sm:max-w-md"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>로그인</DialogTitle>
          <DialogDescription>Google 계정으로 로그인하세요.</DialogDescription>
        </DialogHeader>
        <div className="mt-8">
          <GoogleLoginButton
            onSuccess={handleGoogleLogin}
            onError={handleGoogleLoginError}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
