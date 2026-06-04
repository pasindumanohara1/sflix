import { useEffect, useRef } from 'react';
import { loadSocialBar, loadNativeBanner, loadAdScript } from '@/services/ads';

interface AdInjectorProps {
  socialBar?: boolean;
}

export default function AdInjector({ socialBar = false }: AdInjectorProps) {
  const loaded = useRef(false);

  useEffect(() => {
    if (loaded.current) return;
    loaded.current = true;

    const cleanups: (() => void)[] = [];

    // Native banner (background fill)
    cleanups.push(loadNativeBanner());

    // Social bar (splash + home only)
    if (socialBar) {
      cleanups.push(loadSocialBar());
    }

    return () => {
      cleanups.forEach((fn) => fn());
    };
  }, [socialBar]);

  return null;
}
