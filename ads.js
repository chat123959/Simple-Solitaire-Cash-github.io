// ads.js - AdMob Ad Implementation and Simulation

/**
 * AdMob Demo Ad Unit IDs
 */
const AD_UNITS = {
  APP_OPEN: 'ca-app-pub-3940256099942544/9257395921',
  ADAPTIVE_BANNER: 'ca-app-pub-3940256099942544/9214589741',
  BANNER: 'ca-app-pub-3940256099942544/6300978111',
  INTERSTITIAL: 'ca-app-pub-3940256099942544/1033173712',
  REWARDED: 'ca-app-pub-3940256099942544/5224354917',
  REWARDED_INTERSTITIAL: 'ca-app-pub-3940256099942544/5354046379',
  NATIVE: 'ca-app-pub-3940256099942544/2247696110',
  NATIVE_VIDEO: 'ca-app-pub-3940256099942544/1044960115'
};

// Global coins variable for reward demonstration
let coins = 0;

/**
 * Initialize AdMob (simulated)
 */
function initAdMob() {
  console.log("AdMob initialized with demo ad units");
  // In a real app: admob.initialize()
  document.dispatchEvent(new Event('admob:initialized'));
}

/**
 * Show Banner Ad
 */
function showBannerAd(position = 'bottom') {
  console.log(`Displaying banner ad at ${position}`);
  
  // Remove existing banner if any
  const existingBanner = document.getElementById('admob-banner');
  if (existingBanner) existingBanner.remove();
  
  // Create banner element
  const banner = document.createElement('div');
  banner.id = 'admob-banner';
  banner.className = `banner-ad ${position}`;
  banner.innerHTML = `
    <div class="banner-content">Advertisement</div>
    <div class="banner-close">×</div>
  `;
  
  document.body.appendChild(banner);
  
  // Add close functionality
  banner.querySelector('.banner-close').addEventListener('click', () => {
    banner.remove();
  });
}

/**
 * Show Interstitial Ad
 */
function showInterstitialAd() {
  console.log("Showing interstitial ad...");
  
  const interstitial = document.createElement('div');
  interstitial.className = 'interstitial-ad';
  interstitial.innerHTML = `
    <div class="interstitial-content">
      <h3>Advertisement</h3>
      <p>This is a simulated interstitial ad</p>
      <div class="ad-progress"></div>
      <button class="close-ad">Close Ad (5s)</button>
    </div>
  `;
  
  document.body.appendChild(interstitial);
  
  // Simulate countdown
  const closeBtn = interstitial.querySelector('.close-ad');
  let seconds = 5;
  closeBtn.textContent = `Close Ad (${seconds}s)`;
  
  const timer = setInterval(() => {
    seconds--;
    closeBtn.textContent = `Close Ad (${seconds}s)`;
    
    if (seconds <= 0) {
      clearInterval(timer);
      closeBtn.textContent = 'Close Ad';
      closeBtn.disabled = false;
    }
  }, 1000);
  
  // Close functionality
  closeBtn.addEventListener('click', () => {
    if (seconds <= 0) {
      clearInterval(timer);
      interstitial.remove();
    }
  });
}

/**
 * Show Rewarded Ad
 */
function showRewardedAd() {
  console.log("Showing rewarded ad...");
  
  const adModal = document.createElement('div');
  adModal.className = 'ad-modal';
  adModal.innerHTML = `
    <div class="ad-content">
      <h3>Earn 25 Coins</h3>
      <p>Watch this short video to earn coins!</p>
      <div class="ad-simulation">
        <div class="ad-progress"></div>
        <p>Advertisement (5s)</p>
      </div>
      <button class="close-ad">X</button>
      <p class="reward-message"></p>
    </div>
  `;
  
  document.body.appendChild(adModal);
  
  // Simulate ad progress
  const progress = adModal.querySelector('.ad-progress');
  const rewardMessage = adModal.querySelector('.reward-message');
  let width = 0;
  
  const interval = setInterval(() => {
    width += 5;
    progress.style.width = `${width}%`;
    
    if (width >= 100) {
      clearInterval(interval);
      coins += 25;
      rewardMessage.textContent = "Reward granted! +25 coins";
      setTimeout(() => {
        adModal.remove();
      }, 2000);
    }
  }, 250);
  
  // Close button
  adModal.querySelector('.close-ad').addEventListener('click', () => {
    clearInterval(interval);
    rewardMessage.textContent = "Ad closed - no reward given";
    setTimeout(() => {
      adModal.remove();
    }, 1500);
  });
}

/**
 * Show Native Ad
 */
function showNativeAd(containerId) {
  console.log("Displaying native ad");
  
  const container = document.getElementById(containerId) || document.body;
  
  const nativeAd = document.createElement('div');
  nativeAd.className = 'native-ad';
  nativeAd.innerHTML = `
    <div class="native-ad-content">
      <img src="https://via.placeholder.com/300x150?text=Ad+Image" class="native-ad-image">
      <div class="native-ad-body">
        <h4>Advertisement</h4>
        <p>This is a simulated native ad that blends with your content</p>
        <button class="native-ad-button">Learn More</button>
      </div>
    </div>
  `;
  
  container.appendChild(nativeAd);
}

/**
 * Add required CSS styles for ads
 */
function injectAdStyles() {
  const style = document.createElement('style');
  style.textContent = `
    /* Banner Ad Styles */
    .banner-ad {
      position: fixed;
      width: 100%;
      height: 50px;
      background: #333;
      color: white;
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 999;
    }
    .banner-ad.top { top: 0; }
    .banner-ad.bottom { bottom: 0; }
    .banner-content {
      text-align: center;
      flex-grow: 1;
    }
    .banner-close {
      padding: 0 15px;
      cursor: pointer;
      font-size: 20px;
    }
    
    /* Interstitial Ad Styles */
    .interstitial-ad {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0,0,0,0.9);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1000;
    }
    .interstitial-content {
      background: white;
      padding: 20px;
      border-radius: 10px;
      text-align: center;
      max-width: 300px;
    }
    .interstitial-content .ad-progress {
      height: 5px;
      background: #ddd;
      margin: 15px 0;
      border-radius: 5px;
      overflow: hidden;
    }
    .interstitial-content .close-ad {
      background: #4285f4;
      color: white;
      border: none;
      padding: 8px 15px;
      border-radius: 4px;
      margin-top: 10px;
      cursor: pointer;
    }
    .interstitial-content .close-ad:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }
    
    /* Rewarded Ad Styles (from your example) */
    .ad-modal {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0,0,0,0.8);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1000;
    }
    .ad-content {
      background: white;
      padding: 20px;
      border-radius: 10px;
      text-align: center;
      max-width: 300px;
      position: relative;
    }
    .ad-simulation {
      background: #eee;
      margin: 15px 0;
      border-radius: 5px;
      overflow: hidden;
    }
    .ad-progress {
      height: 20px;
      background: linear-gradient(to right, #4CAF50, #8BC34A);
      width: 0%;
      transition: width 0.25s;
    }
    .close-ad {
      position: absolute;
      top: 5px;
      right: 5px;
      background: #f44336;
      color: white;
      border: none;
      width: 25px;
      height: 25px;
      border-radius: 50%;
      cursor: pointer;
    }
    .reward-message {
      color: #4CAF50;
      font-weight: bold;
      min-height: 20px;
    }
    
    /* Native Ad Styles */
    .native-ad {
      border: 1px solid #eee;
      border-radius: 8px;
      overflow: hidden;
      margin: 15px 0;
      max-width: 300px;
    }
    .native-ad-image {
      width: 100%;
      height: auto;
    }
    .native-ad-body {
      padding: 10px;
    }
    .native-ad-button {
      background: #4285f4;
      color: white;
      border: none;
      padding: 8px 15px;
      border-radius: 4px;
      margin-top: 10px;
      cursor: pointer;
    }
  `;
  
  document.head.appendChild(style);
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  initAdMob();
  injectAdStyles();
});

// Export functions if using modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    AD_UNITS,
    initAdMob,
    showBannerAd,
    showInterstitialAd,
    showRewardedAd,
    showNativeAd
  };
}
