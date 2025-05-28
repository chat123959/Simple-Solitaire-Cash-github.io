// AdMob simulation functions
function showAd() {
    console.log("Banner ad displayed");
    // In a real app: admob.banner.show()
}

function showRewardedAd() {
    console.log("Showing rewarded ad...");
    
    // Create ad modal
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
        </div>
    `;
    document.body.appendChild(adModal);
    
    // Simulate ad progress
    const progress = adModal.querySelector('.ad-progress');
    let width = 0;
    const interval = setInterval(() => {
        width += 5;
        progress.style.width = `${width}%`;
        if (width >= 100) {
            clearInterval(interval);
            coins += 25;
            updateCoins();
            adModal.remove();
            alert("+25 coins added to your balance!");
        }
    }, 250);
    
    // Close button
    adModal.querySelector('.close-ad').addEventListener('click', () => {
        clearInterval(interval);
        adModal.remove();
    });
    
    // Add styles
    const adStyle = document.createElement('style');
    adStyle.textContent = `
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
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
    }
    `;
    document.head.appendChild(adStyle);
}

// Initialize AdMob (simulated)
function initAdMob() {
    console.log("AdMob initialized");
    // In a real app: admob.initialize()
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initAdMob);