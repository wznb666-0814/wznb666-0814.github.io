/**
 * 文章详情页逻辑
 */

document.addEventListener('DOMContentLoaded', async () => {
    const titleElement = document.getElementById('post-title');
    const dateElement = document.getElementById('post-date');
    const tagsElement = document.getElementById('post-tags');
    const bodyElement = document.getElementById('post-body');
    const themeToggle = document.getElementById('theme-toggle');

    // --- 主题切换 (同步首页逻辑) ---
    const currentTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', currentTheme);
    
    if (themeToggle) {
        updateThemeIcon(currentTheme);
        themeToggle.addEventListener('click', () => {
        const targetTheme = document.documentElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', targetTheme);
        localStorage.setItem('theme', targetTheme);
        updateThemeIcon(targetTheme);
        // 切换主题时重新应用色相
        const currentHue = localStorage.getItem('user-hue') || '200';
        applyHue(currentHue);
    });
    }

    function updateThemeIcon(theme) {
        const icon = themeToggle.querySelector('i');
        if (icon) icon.className = theme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
    }

    // --- 加载文章内容 ---
    const urlParams = new URLSearchParams(window.location.search);
    const postFileName = urlParams.get('post');

    if (postFileName) {
        const postData = await MarkdownParser.fetchPost(`${postFileName}.md`);
        
        if (postData) {
            // 更新页面内容
            titleElement.textContent = postData.meta.title || '无标题';
            titleElement.classList.remove('loading-placeholder');
            
            dateElement.innerHTML = `<i class="far fa-calendar-alt"></i> ${postData.meta.date || '未知日期'}`;
            
            const tags = Array.isArray(postData.meta.tags) ? postData.meta.tags.join(', ') : (postData.meta.tags || '无标签');
            tagsElement.innerHTML = `<i class="fas fa-tags"></i> ${tags}`;
            
            bodyElement.innerHTML = postData.html;

            // 代码高亮与复制按钮
            if (window.hljs) {
                bodyElement.querySelectorAll('pre').forEach((pre) => {
                    const code = pre.querySelector('code');
                    if (code) {
                        hljs.highlightElement(code);
                        
                        // 添加复制按钮
                        const copyBtn = document.createElement('button');
                        copyBtn.className = 'copy-code-btn';
                        copyBtn.innerHTML = '<i class="far fa-copy"></i>';
                        pre.appendChild(copyBtn);

                        copyBtn.addEventListener('click', () => {
                            navigator.clipboard.writeText(code.innerText).then(() => {
                                copyBtn.innerHTML = '<i class="fas fa-check"></i>';
                                setTimeout(() => {
                                    copyBtn.innerHTML = '<i class="far fa-copy"></i>';
                                }, 2000);
                            });
                        });
                    }
                });
            }

            // 更新浏览器标题
            document.title = `${postData.meta.title} | RyuChan's Blog`;
        } else {
            renderError('文章未找到或加载失败。');
        }
    } else {
        renderError('未指定要查看的文章。');
    }

    function renderError(message) {
        titleElement.textContent = 'Oops!';
        bodyElement.innerHTML = `<div class="error-message"><p>${message}</p><a href="index.html">返回首页</a></div>`;
    }

    // --- 回到顶部按钮 ---
    const backToTopBtn = document.getElementById('back-to-top');
    if (backToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                backToTopBtn.classList.add('show');
            } else {
                backToTopBtn.classList.remove('show');
            }
        });

        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // --- 移动端菜单逻辑 ---
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const mobileSidebar = document.querySelector('.mobile-sidebar');
    const sidebarOverlay = document.querySelector('.sidebar-overlay');

    if (mobileMenuToggle && mobileSidebar && sidebarOverlay) {
        mobileMenuToggle.addEventListener('click', () => {
            mobileSidebar.classList.toggle('active');
            sidebarOverlay.classList.toggle('active');
        });

        sidebarOverlay.addEventListener('click', () => {
            mobileSidebar.classList.remove('active');
            sidebarOverlay.classList.remove('active');
        });
    }

    // --- 调色盘逻辑 ---
    const colorPickerBtn = document.getElementById('color-picker-btn');
    const colorSliderWrapper = document.querySelector('.color-slider-wrapper');
    const hueSlider = document.getElementById('hue-slider');

    // 初始化颜色
    const savedHue = localStorage.getItem('user-hue') || '200';
    if (savedHue !== '200') {
        applyHue(savedHue);
        if (hueSlider) hueSlider.value = savedHue;
    }

    if (colorPickerBtn && colorSliderWrapper) {
        colorPickerBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            colorSliderWrapper.classList.toggle('active');
        });

        document.addEventListener('click', () => {
            colorSliderWrapper.classList.remove('active');
        });

        colorSliderWrapper.addEventListener('click', (e) => {
            e.stopPropagation();
        });
    }

    if (hueSlider) {
        hueSlider.addEventListener('input', (e) => {
            const hue = e.target.value;
            applyHue(hue);
            localStorage.setItem('user-hue', hue);
        });
    }

    function applyHue(hue) {
        const root = document.documentElement;
        const isDark = root.getAttribute('data-theme') === 'dark';
        
        // 基于色相生成主色、背景色和柔和色
        // 主色保持较高的饱和度
        root.style.setProperty('--accent-color', `hsl(${hue}, 70%, 60%)`);
        
        if (isDark) {
            // 深色模式下的配色
            root.style.setProperty('--bg-color', `hsl(${hue}, 15%, 12%)`);
            root.style.setProperty('--card-bg', `hsl(${hue}, 12%, 18%)`);
            root.style.setProperty('--text-primary', `hsl(${hue}, 20%, 85%)`);
            root.style.setProperty('--text-secondary', `hsl(${hue}, 15%, 65%)`);
            root.style.setProperty('--accent-soft', `hsl(${hue}, 30%, 25%)`);
            root.style.setProperty('--border-color', `hsl(${hue}, 15%, 25%)`);
            root.style.setProperty('--header-bg', `hsla(${hue}, 15%, 12%, 0.8)`);
        } else {
            // 浅色模式下的配色
            root.style.setProperty('--bg-color', `hsl(${hue}, 20%, 96%)`);
            root.style.setProperty('--card-bg', '#ffffff');
            root.style.setProperty('--text-primary', `hsl(${hue}, 35%, 25%)`);
            root.style.setProperty('--text-secondary', `hsl(${hue}, 25%, 45%)`);
            root.style.setProperty('--accent-soft', `hsl(${hue}, 80%, 93%)`);
            root.style.setProperty('--border-color', `hsl(${hue}, 15%, 85%)`);
            root.style.setProperty('--header-bg', `hsla(0, 0%, 100%, 0.7)`);
        }
    }
});
