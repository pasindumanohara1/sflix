const ADS = {
  nativeBanner: {
    script: 'https://pl29636236.effectivecpmnetwork.com/ebbe82070b639a1b79fe76c88895db60/invoke.js',
    containerId: 'container-ebbe82070b639a1b79fe76c88895db60',
  },
  socialBar: 'https://pl29636235.effectivecpmnetwork.com/94/5f/29/945f2983b6d759ba0968365b0a78f0e7.js',
  skyscraper160x600: '1b08b5473ba6c9c59748851619f364bc',
  leaderboard728x90: '0e9cea3c1172c7c9da0e0937e8d5b85a',
  banner468x60: '55fdfd2d23e124fb20cf43f6839f2502',
  mobile320x50: '91ee9d1b8eb9b04d9e0f14b0840524ea',
} as const;

export function loadAdScript(src: string, containerId?: string): () => void {
  const script = document.createElement('script');
  script.src = src;
  script.async = true;
  if (src.includes('effectivecpmnetwork')) {
    script.setAttribute('data-cfasync', 'false');
  }
  document.body.appendChild(script);
  return () => {
    document.body.removeChild(script);
    if (containerId) {
      const container = document.getElementById(containerId);
      if (container) container.remove();
    }
  };
}

export function loadAtOptionsAd(key: string): () => void {
  const script = document.createElement('script');
  (window as any).atOptions = {
    key,
    format: 'iframe',
    height: getAdHeight(key),
    width: getAdWidth(key),
    params: {},
  };
  script.src = `https://www.highperformanceformat.com/${key}/invoke.js`;
  document.body.appendChild(script);
  return () => {
    document.body.removeChild(script);
  };
}

function getAdHeight(key: string): number {
  switch (key) {
    case ADS.skyscraper160x600: return 600;
    case ADS.leaderboard728x90: return 90;
    case ADS.banner468x60: return 60;
    case ADS.mobile320x50: return 50;
    default: return 90;
  }
}

function getAdWidth(key: string): number {
  switch (key) {
    case ADS.skyscraper160x600: return 160;
    case ADS.leaderboard728x90: return 728;
    case ADS.banner468x60: return 468;
    case ADS.mobile320x50: return 320;
    default: return 728;
  }
}

export function loadSocialBar(): () => void {
  return loadAdScript(ADS.socialBar);
}

export function loadNativeBanner(): () => void {
  const container = document.createElement('div');
  container.id = ADS.nativeBanner.containerId;
  document.body.appendChild(container);
  const cleanup = loadAdScript(ADS.nativeBanner.script, ADS.nativeBanner.containerId);
  return () => {
    cleanup();
    if (container.parentNode) container.parentNode.removeChild(container);
  };
}
