// Mobile detection
const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

// Create raindrops with improved performance
function createRaindrops() {
    const container = document.querySelector('.rain-container');
    const dropCount = isMobile ? 30 : 50;
    
    container.innerHTML = '';
    
    for (let i = 0; i < dropCount; i++) {
        const drop = document.createElement('div');
        drop.className = 'raindrop';
        drop.style.left = `${Math.random() * 100}%`;
        drop.style.top = `${Math.random() * -100}%`;
        drop.style.animationDelay = `${Math.random() * -1}s`;
        container.appendChild(drop);
    }
}

// Initialize controls
function initControls(video) {
    const controls = document.querySelector('.controls');
    const volumeControl = document.querySelector('.volume-control');
    const volumeIcon = volumeControl.querySelector('i');
    const volumeSlider = document.querySelector('.volume-slider input');
    const playControl = document.querySelector('.play-control');
    const playIcon = playControl.querySelector('i');

    // Fade in controls
    setTimeout(() => {
        controls.classList.add('visible');
    }, 500);

    let lastVolume = 1;
    
    // Handle volume control
    volumeControl.addEventListener('click', (e) => {
        if (!e.target.closest('.volume-slider')) {
            if (video.volume > 0) {
                lastVolume = video.volume;
                video.volume = 0;
                volumeControl.classList.add('muted');
                volumeIcon.className = 'fas fa-volume-mute';
                volumeSlider.value = 0;
            } else {
                video.volume = lastVolume;
                volumeControl.classList.remove('muted');
                volumeIcon.className = 'fas fa-volume-up';
                volumeSlider.value = lastVolume * 100;
            }
        }
    });

    // Mobile volume control
    if (isMobile) {
        volumeControl.addEventListener('click', () => {
            volumeControl.classList.toggle('active');
        });
        
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.volume-control')) {
                volumeControl.classList.remove('active');
            }
        });
    }

    // Volume slider
    volumeSlider.addEventListener('input', (e) => {
        const value = e.target.value / 100;
        video.volume = value;
        lastVolume = value;
        
        if (value === 0) {
            volumeControl.classList.add('muted');
            volumeIcon.className = 'fas fa-volume-mute';
        } else {
            volumeControl.classList.remove('muted');
            volumeIcon.className = value < 0.5 ? 'fas fa-volume-down' : 'fas fa-volume-up';
        }
    });

    // Play/Pause control
    playControl.addEventListener('click', () => {
        if (video.paused) {
            video.play();
            playControl.classList.remove('paused');
            playIcon.className = 'fas fa-pause';
        } else {
            video.pause();
            playControl.classList.add('paused');
            playIcon.className = 'fas fa-play';
        }
    });

    // Update play button state on video events
    video.addEventListener('play', () => {
        playControl.classList.remove('paused');
        playIcon.className = 'fas fa-pause';
    });

    video.addEventListener('pause', () => {
        playControl.classList.add('paused');
        playIcon.className = 'fas fa-play';
    });
}

// Magnetic effect for the card
function initMagneticEffect() {
    if (isMobile) return;
    
    const card = document.querySelector('.card');
    const wrapper = document.querySelector('.card-wrapper');
    const strength = 25;

    wrapper.addEventListener('mousemove', (e) => {
        const rect = wrapper.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const deltaX = (x - centerX) / centerX;
        const deltaY = (y - centerY) / centerY;

        const scale = 1.05;
        
        card.style.transform = `
            perspective(1000px) 
            rotateY(${deltaX * strength}deg) 
            rotateX(${-deltaY * strength}deg) 
            translateZ(10px)
            scale3d(${scale}, ${scale}, ${scale})
        `;
    });

    wrapper.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateY(0deg) rotateX(0deg) translateZ(0) scale3d(1, 1, 1)';
    });
}

// Handle entrance screen with smooth transitions
document.addEventListener('DOMContentLoaded', () => {
    const entranceScreen = document.querySelector('.entrance-screen');
    const mainContent = document.querySelector('.main-content');
    const video = document.getElementById('rainVideo');
    
    video.load();
    createRaindrops();
    
    entranceScreen.addEventListener('click', () => {
        if (!isMobile) {
            const elem = document.documentElement;
            if (elem.requestFullscreen) {
                elem.requestFullscreen();
            } else if (elem.webkitRequestFullscreen) {
                elem.webkitRequestFullscreen();
            } else if (elem.msRequestFullscreen) {
                elem.msRequestFullscreen();
            }
        }

        entranceScreen.classList.add('fade-out');
        entranceScreen.style.opacity = '0';
        
        setTimeout(() => {
            entranceScreen.style.display = 'none';
            mainContent.classList.remove('hidden');
            
            requestAnimationFrame(() => {
                mainContent.classList.add('visible');
                createRaindrops();
                initControls(video);
            });
            
            video.play().then(() => {
                video.muted = false;
            }).catch(console.error);
            
            initMagneticEffect();
        }, 300);
    });
});
