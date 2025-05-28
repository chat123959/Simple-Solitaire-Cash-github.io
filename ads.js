// ads.js - Real AdMob Implementation (Not Demo Ads)

// Your Ad Unit IDs (Replace with your actual IDs)
const AD_UNITS = {
  BANNER: 'ca-app-pub-3940256099942544/9214589741',
  INTERSTITIAL: 'ca-app-pub-3940256099942544/1033173712',
  REWARDED: 'ca-app-pub-3940256099942544/5224354917',
  NATIVE: 'ca-app-pub-3940256099942544/2247696110',
};

// Initialize AdMob (Must be called first)
function initAdMob() {
  if (typeof adsbygoogle !== 'undefined') {
    adsbygoogle = window.adsbygoogle || [];
    console.log("AdMob initialized successfully");
  } else {
    console.error("AdMob SDK not loaded!");
  }
}

// ========================
// 1. BANNER ADS (Display at Top/Bottom)
// ========================
function loadBannerAd(position = 'bottom') {
  const adContainer = document.createElement('div');
  adContainer.id = 'ad-container';
  adContainer.style.position = 'fixed';
  adContainer.style.width = '100%';
  adContainer.style.height = 'auto';
  adContainer.style[position] = '0';
  adContainer.style.zIndex = '9999';
  adContainer.style.textAlign = 'center';
  adContainer.style.backgroundColor = '#f0f0f0';

  adContainer.innerHTML = `
    <ins class="adsbygoogle"
         style="display:inline-block;width:320px;height:50px"
         data-ad-client="ca-pub-YOUR_PUBLISHER_ID"
         data-ad-slot="${AD_UNITS.BANNER}"></ins>
  `;

  document.body.appendChild(adContainer);
  
  // Load the ad
  (adsbygoogle = window.adsbygoogle || []).push({});
}

// ========================
// 2. INTERSTITIAL ADS (Full-Screen)
// ========================
let interstitialAd = null;

function loadInterstitialAd() {
  if (typeof admob !== 'undefined') {
    interstitialAd = new admob.InterstitialAd({
      adUnitId: AD_UNITS.INTERSTITIAL,
    });
    interstitialAd.load();
    console.log("Interstitial ad loaded");
  } else {
    console.error("AdMob Interstitial not supported in this environment");
  }
}

function showInterstitialAd() {
  if (interstitialAd) {
    interstitialAd.show()
      .then(() => console.log("Interstitial ad shown"))
      .catch(err => console.error("Failed to show interstitial:", err));
  } else {
    console.error("Interstitial ad not loaded yet");
  }
}

// ========================
// 3. REWARDED ADS (For User Rewards)
// ========================
let rewardedAd = null;

function loadRewardedAd() {
  if (typeof admob !== 'undefined') {
    rewardedAd = new admob.RewardedAd({
      adUnitId: AD_UNITS.REWARDED,
    });
    
    rewardedAd.on('reward', (reward) => {
      console.log("User earned reward:", reward);
      alert(`You earned ${reward.amount} ${reward.type}!`);
    });
    
    rewardedAd.load();
    console.log("Rewarded ad loaded");
  } else {
    console.error("AdMob Rewarded not supported in this environment");
  }
}

function showRewardedAd() {
  if (rewardedAd) {
    rewardedAd.show()
      .then(() => console.log("Rewarded ad shown"))
      .catch(err => console.error("Failed to show rewarded ad:", err));
  } else {
    console.error("Rewarded ad not loaded yet");
  }
}

// ========================
// 4. NATIVE ADS (Customizable)
// ========================
function loadNativeAd(containerId = 'native-ad-container') {
  const container = document.getElementById(containerId);
  
  if (container && typeof adsbygoogle !== 'undefined') {
    container.innerHTML = `
      <ins class="adsbygoogle"
           style="display:block"
           data-ad-client="ca-pub-YOUR_PUBLISHER_ID"
           data-ad-slot="${AD_UNITS.NATIVE}"
           data-ad-format="auto"
           data-full-width-responsive="true"></ins>
    `;
    
    (adsbygoogle = window.adsbygoogle || []).push({});
  } else {
    console.error("Native ad container not found or AdMob not loaded");
  }
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
  initAdMob();
  
  // Example: Auto-load ads
  loadBannerAd('bottom');
  loadInterstitialAd();
  loadRewardedAd();
});

// Export for modular use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    initAdMob,
    loadBannerAd,
    loadInterstitialAd,
    showInterstitialAd,
    loadRewardedAd,
    showRewardedAd,
    loadNativeAd,
  };
}
