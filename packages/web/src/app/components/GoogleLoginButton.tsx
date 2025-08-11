'use client';

import { useEffect, useRef } from 'react';

declare global {
  interface Window {
    google: {
      accounts: {
        id: {
          initialize: (config: { client_id: string; callback: (response: { credential: string }) => void }) => void;
          renderButton: (element: HTMLElement, config: { theme: string; size: string; width: string }) => void;
        };
      };
    };
  }
}

interface GoogleLoginButtonProps {
  onSuccess: (credential: string) => void;
  onError?: () => void;
}

export default function GoogleLoginButton({ onSuccess, onError }: GoogleLoginButtonProps) {
  const buttonRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.google) {
      window.google.accounts.id.initialize({
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
        callback: (response: { credential: string }) => {
          if (response.credential) {
            onSuccess(response.credential);
          } else {
            onError?.();
          }
        },
      });

      if (buttonRef.current) {
        window.google.accounts.id.renderButton(buttonRef.current, {
          theme: 'outline',
          size: 'large',
          width: '100%',
        });
      }
    }
  }, [onSuccess, onError]);

  return (
    <div>
      <div ref={buttonRef}></div>
    </div>
  );
}