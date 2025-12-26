// 共享JavaScript功能
// 优化后的樱花飘落特效
function createSakura() {
    const container = document.getElementById('sakura-container');
    if (!container) return;
    
    const sakura = document.createElement('div');
    sakura.className = 'sakura';
    
    // 随机位置和大小
    const startX = Math.random() * window.innerWidth;
    const endX = startX + (Math.random() * 150 - 75); // 减少水平移动距离
    const size = 8 + Math.random() * 15; // 减小樱花大小
    sakura.style.width = `${size}px`;
    sakura.style.height = `${size}px`;
    
    const opacity = 0.3 + Math.random() * 0.5; // 降低透明度范围
    sakura.style.opacity = opacity;
    
    const rotation = Math.random() * 180; // 减少初始旋转角度
    sakura.style.transform = `rotate(${rotation}deg)`;
    
    const duration = 8 + Math.random() * 15; // 缩短动画持续时间
    const delay = Math.random() * 4;
    
    sakura.style.left = `${startX}px`;
    sakura.style.top = `-30px`;
    
    container.appendChild(sakura);
    
    sakura.animate([
        { 
            transform: `translate(0, 0) rotate(${rotation}deg)`,
            opacity: opacity
        },
        { 
            transform: `translate(${endX - startX}px, ${window.innerHeight + 30}px) rotate(${rotation + 180}deg)`,
            opacity: 0
        }
    ], {
        duration: duration * 1000,
        delay: delay * 1000,
        easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
    });
    
    setTimeout(() => {
        if (sakura.parentNode) {
            sakura.parentNode.removeChild(sakura);
        }
    }, (duration + delay) * 1000);
}

// 优化后的樱花拖尾特效
function createSakuraTrail(x, y, isFast) {
    const container = document.getElementById('sakura-container');
    if (!container) return;
    
    // 减少拖尾数量
    const trailCount = isFast ? 1 : 1;
    
    // 进一步减少拖尾生成概率
    if (Math.random() < 0.5) { // 只有50%的概率生成拖尾
        return;
    }
    
    for (let i = 0; i < trailCount; i++) {
        const trail = document.createElement('div');
        trail.className = 'sakura-trail';
        
        const size = 8 + Math.random() * 12;
        trail.style.width = `${size}px`;
        trail.style.height = `${size}px`;
        
        const opacity = 0.4 + Math.random() * 0.4; // 降低透明度
        trail.style.opacity = opacity;
        
        const rotation = Math.random() * 360;
        trail.style.transform = `rotate(${rotation}deg)`;
        
        trail.style.left = `${x}px`;
        trail.style.top = `${y}px`;
        
        container.appendChild(trail);
        
        const offsetX = (Math.random() - 0.5) * (isFast ? 50 : 30); // 减少偏移量
        const offsetY = (Math.random() - 0.5) * (isFast ? 50 : 30);
        const duration = isFast ? 800 : 1500; // 缩短持续时间
        
        trail.animate([
            { 
                transform: `translate(0, 0) rotate(${rotation}deg)`,
                opacity: opacity
            },
            { 
                transform: `translate(${offsetX}px, ${offsetY}px) rotate(${rotation + 180}deg)`,
                opacity: 0
            }
        ], {
            duration: duration,
            easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
        });
        
        setTimeout(() => {
            if (trail.parentNode) {
                trail.parentNode.removeChild(trail);
            }
        }, duration);
    }
}

// 优化后的樱花初始化函数
function initSakura() {
    const container = document.getElementById('sakura-container');
    if (!container) return;
    
    // 减少初始樱花数量
    for (let i = 0; i < 12; i++) {
        setTimeout(() => {
            createSakura();
        }, i * 600);
    }
    
    // 增加生成间隔，减少樱花数量
    setInterval(() => {
        if (Math.random() > 0.5) {
            createSakura();
        }
    }, 1500);
    
    let lastMouseX = 0;
    let lastMouseY = 0;
    let lastTime = 0;
    let lastTrailTime = 0;
    
    document.addEventListener('mousemove', (e) => {
        const currentTime = Date.now();
        const deltaX = e.clientX - lastMouseX;
        const deltaY = e.clientY - lastMouseY;
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        const timeDiff = currentTime - lastTime;
        
        const speed = timeDiff > 0 ? distance / timeDiff : 0;
        
        if (speed > 0.5 && (currentTime - lastTrailTime) > 100) {
            createSakuraTrail(e.clientX, e.clientY, speed > 2);
            lastTrailTime = currentTime;
        }
        
        lastMouseX = e.clientX;
        lastMouseY = e.clientY;
        lastTime = currentTime;
    });
}

// 平滑滚动函数
function smoothScrollTo(targetId) {
    const targetElement = document.querySelector(targetId);
    if (targetElement) {
        targetElement.scrollIntoView({
            behavior: 'smooth'
        });
    }
}

// 初始化共享功能
document.addEventListener('DOMContentLoaded', function() {
    // 初始化樱花特效
    if (document.getElementById('sakura-container')) {
        initSakura();
    }
    
    // 平滑滚动功能（如果有导航链接）
    const navLinks = document.querySelectorAll('nav a[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            smoothScrollTo(targetId);
        });
    });
});
