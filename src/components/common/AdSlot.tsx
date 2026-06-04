import { useEffect, useRef } from 'react';
import { loadAtOptionsAd, loadNativeBanner } from '@/services/ads';

interface AdSlotProps {
  position: 'top' | 'between' | 'detail' | 'browse';
}

export default function AdSlot({ position }: AdSlotProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const cleanupRef = useRef<(() => void) | undefined>(undefined);

  useEffect(() => {
    if (position === 'top') {
      cleanupRef.current = loadAtOptionsAd('0e9cea3c1172c7c9da0e0937e8d5b85a');
    } else if (position === 'between') {
      cleanupRef.current = loadAtOptionsAd('55fdfd2d23e124fb20cf43f6839f2502');
    } else if (position === 'detail') {
      cleanupRef.current = loadAtOptionsAd('1b08b5473ba6c9c59748851619f364bc');
    } else if (position === 'browse') {
      const c = loadAtOptionsAd('91ee9d1b8eb9b04d9e0f14b0840524ea');
      const n = loadNativeBanner();
      cleanupRef.current = () => { c(); n(); };
    }

    return () => {
      if (cleanupRef.current) cleanupRef.current();
    };
  }, [position]);

  return (
    <div className={`ad-slot ad-${position}`} ref={containerRef}>
      <style>{`
        .ad-slot {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 1px;
          padding: 0.5rem 0;
          overflow: hidden;
        }

        .ad-slot iframe {
          max-width: 100%;
        }

        .ad-top {
          min-height: 100px;
        }

        .ad-between {
          min-height: 70px;
        }

        .ad-detail {
          min-height: 610px;
          justify-content: flex-start;
        }

        .ad-browse {
          min-height: 60px;
          flex-direction: column;
          gap: 0.5rem;
        }
      `}</style>
    </div>
  );
}
