document.addEventListener('DOMContentLoaded', () => {
    // 基础 UI 元素
    const themeToggle = document.getElementById('theme-toggle');
    const colorPickerBtn = document.getElementById('color-picker-btn');
    const hueSlider = document.getElementById('hue-slider');
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const mobileSidebar = document.querySelector('.mobile-sidebar');
    const sidebarOverlay = document.querySelector('.sidebar-overlay');
    const backToTop = document.getElementById('back-to-top');

    // 音乐播放器相关
    const musicPlayer = document.getElementById('music-player');
    const musicToggle = document.getElementById('music-toggle');
    const bgMusic = document.getElementById('bg-music');
    const musicName = document.getElementById('music-name');

    // 1. 初始化主题
    const currentTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', currentTheme);
    updateThemeIcon(currentTheme);

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const targetTheme = document.documentElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
            document.documentElement.setAttribute('data-theme', targetTheme);
            localStorage.setItem('theme', targetTheme);
            updateThemeIcon(targetTheme);
            applyHue(localStorage.getItem('user-hue') || '200');
        });
    }

    // 2. 初始化调色盘
    const savedHue = localStorage.getItem('user-hue') || '200';
    applyHue(savedHue);
    if (hueSlider) hueSlider.value = savedHue;

    if (colorPickerBtn && hueSlider) {
        colorPickerBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            hueSlider.parentElement.classList.toggle('active');
        });

        hueSlider.addEventListener('input', (e) => {
            const hue = e.target.value;
            applyHue(hue);
            localStorage.setItem('user-hue', hue);
        });

        document.addEventListener('click', () => {
            hueSlider.parentElement.classList.remove('active');
        });
        hueSlider.parentElement.addEventListener('click', (e) => e.stopPropagation());
    }

    // 3. 移动端菜单逻辑
    if (mobileMenuToggle && mobileSidebar && sidebarOverlay) {
        mobileMenuToggle.addEventListener('click', () => {
            mobileSidebar.classList.toggle('active');
            sidebarOverlay.classList.toggle('active');
        });

        sidebarOverlay.addEventListener('click', () => {
            mobileSidebar.classList.remove('active');
            sidebarOverlay.classList.remove('active');
        });

        // 移动端点击链接后关闭菜单
        mobileSidebar.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mobileSidebar.classList.remove('active');
                sidebarOverlay.classList.remove('active');
            });
        });
    }

    // 4. 回到顶部逻辑
    if (backToTop) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                backToTop.classList.add('active');
            } else {
                backToTop.classList.remove('active');
            }
        });

        backToTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // 5. 音乐播放器逻辑
    const musicArtist = document.getElementById('music-artist');
    const musicCover = document.getElementById('music-cover');
    const musicCoverImg = document.getElementById('music-cover-img');
    const musicProgress = document.getElementById('music-progress');
    const musicProgressContainer = document.getElementById('music-progress-container');
    const musicPrev = document.getElementById('music-prev');
    const musicNext = document.getElementById('music-next');

    const playlist = [
        { file: "稻香 - 周杰伦.flac", cover: "Image/1.webp" },
        { file: "蒲公英的约定 - 周杰伦.flac", cover: "Image/2.webp" },
        { file: "把回忆拼好给你 - 王贰浪.flac", cover: "Image/3.webp" }
    ];
    let currentTrack = 0;

    if (musicPlayer && musicToggle && bgMusic) {
        // 初始化播放器
        loadTrack(currentTrack);

        // 播放/暂停
        musicToggle.addEventListener('click', togglePlay);

        // 上一首/下一首
        musicPrev.addEventListener('click', () => changeTrack(-1));
        musicNext.addEventListener('click', () => changeTrack(1));

        // 进度条更新
        bgMusic.addEventListener('timeupdate', () => {
            const percent = (bgMusic.currentTime / bgMusic.duration) * 100;
            musicProgress.style.width = `${percent}%`;
        });

        // 点击进度条跳转
        musicProgressContainer.addEventListener('click', (e) => {
            const width = musicProgressContainer.clientWidth;
            const clickX = e.offsetX;
            const duration = bgMusic.duration;
            bgMusic.currentTime = (clickX / width) * duration;
        });

        // 自动播放下一首
        bgMusic.addEventListener('ended', () => changeTrack(1));
    }

    function loadTrack(index) {
        const track = playlist[index];
        const [name, artist] = track.file.replace(/\.(flac|mp3|wav)$/, '').split(' - ');
        
        bgMusic.src = `Music/${encodeURIComponent(track.file)}`;
        musicName.innerText = name;
        musicArtist.innerText = artist || '未知艺术家';
        musicCoverImg.src = track.cover || 'Image/1.webp';
        
        if (!bgMusic.paused) {
            bgMusic.play();
        }
    }

    function togglePlay() {
        if (bgMusic.paused) {
            bgMusic.play().catch(err => console.log("播放被拦截:", err));
            musicToggle.innerHTML = '<i class="fas fa-pause"></i>';
            musicCover.classList.add('playing');
        } else {
            bgMusic.pause();
            musicToggle.innerHTML = '<i class="fas fa-play"></i>';
            musicCover.classList.remove('playing');
        }
    }

    function changeTrack(direction) {
        currentTrack = (currentTrack + direction + playlist.length) % playlist.length;
        loadTrack(currentTrack);
        bgMusic.play().then(() => {
            musicToggle.innerHTML = '<i class="fas fa-pause"></i>';
            musicCover.classList.add('playing');
        }).catch(err => console.log("播放失败:", err));
    }

    // 6. 每日一句逻辑
    async function updateDailyQuote() {
        const quoteText = document.getElementById('quote-text');
        const quoteAuthor = document.getElementById('quote-author');
        if (!quoteText) return;

        try {
            const response = await fetch('https://v1.hitokoto.cn/?c=i&c=k');
            const data = await response.json();
            quoteText.innerText = data.hitokoto;
            quoteAuthor.innerText = `—— ${data.from_who || data.from || '未知'}`;
        } catch (error) {
            console.error('获取每日一句失败:', error);
            quoteText.innerText = '温柔地对待世界，世界也会温柔待你。';
            quoteAuthor.innerText = '—— Repea';
        }
    }
    updateDailyQuote();

    // 7. SPA 路由逻辑
    function handleRoute() {
        const fullHash = window.location.hash || '#home';
        // 解析 hash 和参数，例如 #post?file=xxx
        const [hash, queryString] = fullHash.split('?');
        const targetId = hash.substring(1);
        const targetPage = document.getElementById(targetId);

        if (targetPage) {
            // 更新导航激活状态
            updateActiveLinks(hash);
            
            // 执行切换动画
            const currentPage = document.querySelector('.page-view.active');
            if (currentPage && currentPage !== targetPage) {
                currentPage.classList.remove('active');
                currentPage.classList.add('leaving');
                
                setTimeout(() => {
                    currentPage.classList.remove('leaving');
                }, 500);
            }
            
            targetPage.classList.add('active');
            window.scrollTo({ top: 0, behavior: 'smooth' });

            // 如果是文章详情页，加载内容
            if (targetId === 'post') {
                const params = new URLSearchParams(queryString);
                const fileName = params.get('file');
                const directory = params.get('dir') || 'Page';
                if (fileName) {
                    loadPostDetail(fileName, directory);
                }
            }
        }
    }

    async function loadPostDetail(fileName, directory = 'Page') {
        const postTitle = document.getElementById('post-title');
        const postDate = document.getElementById('post-date');
        const postCategory = document.getElementById('post-category');
        const postContent = document.getElementById('post-content');
        const postBanner = document.getElementById('post-banner');

        // 状态重置
        postTitle.innerText = '正在加载...';
        postContent.innerHTML = '<div class="loading"><div class="spinner"></div></div>';

        try {
            const postData = await MarkdownParser.fetchPost(fileName, directory);
            if (postData) {
                const { meta, html } = postData;
                postTitle.innerText = meta.title || '无标题文章';
                postDate.innerHTML = `<i class="far fa-calendar-alt"></i> ${meta.date || '未知日期'}`;
                postCategory.innerHTML = `<i class="fas fa-folder"></i> ${meta.category || '随笔'}`;
                postContent.innerHTML = html;

                // 更新 Banner 背景图
                if (meta.image) {
                    postBanner.style.backgroundImage = `url('${meta.image}')`;
                } else {
                    postBanner.style.backgroundImage = "url('Image/1.webp')";
                }

                // 处理代码高亮
                if (window.hljs) {
                    postContent.querySelectorAll('pre code').forEach((block) => {
                        hljs.highlightElement(block);
                        addCopyButton(block);
                    });
                }

                // 添加图片点击放大功能
                addImgZoom(postContent);

                // 生成目录 (TOC)
                generateTOC(postContent);
            } else {
                postTitle.innerText = '文章加载失败';
                postContent.innerHTML = '<p>抱歉，无法找到该文章的内容。</p>';
            }
        } catch (error) {
            console.error('加载文章详情失败:', error);
            postTitle.innerText = '文章加载失败';
            postContent.innerHTML = '<p>加载过程中出现错误，请稍后再试。</p>';
        }
    }

    function addCopyButton(block) {
        const pre = block.parentElement;
        if (pre.querySelector('.copy-btn')) return;

        const button = document.createElement('button');
        button.className = 'copy-btn';
        button.innerHTML = '<i class="far fa-copy"></i>';
        button.title = '复制代码';

        button.addEventListener('click', () => {
            const code = block.innerText;
            navigator.clipboard.writeText(code).then(() => {
                button.innerHTML = '<i class="fas fa-check"></i>';
                button.classList.add('success');
                setTimeout(() => {
                    button.innerHTML = '<i class="far fa-copy"></i>';
                    button.classList.remove('success');
                }, 2000);
            });
        });

        pre.appendChild(button);
    }

    function addImgZoom(container) {
        const imgs = container.querySelectorAll('img');
        imgs.forEach(img => {
            img.style.cursor = 'zoom-in';
            img.addEventListener('click', () => {
                const overlay = document.createElement('div');
                overlay.className = 'img-overlay';
                overlay.innerHTML = `
                    <div class="img-zoom-container">
                        <img src="${img.src}" alt="${img.alt}">
                    </div>
                `;
                document.body.appendChild(overlay);
                setTimeout(() => overlay.classList.add('active'), 10);

                overlay.addEventListener('click', () => {
                    overlay.classList.remove('active');
                    setTimeout(() => overlay.remove(), 300);
                });
            });
        });
    }

    function generateTOC(container) {
        const headings = container.querySelectorAll('h1, h2, h3');
        if (headings.length < 2) return;

        const tocContainer = document.createElement('div');
        tocContainer.className = 'post-toc animate-slide-up';
        const tocTitle = document.createElement('h4');
        tocTitle.innerText = '目录';
        tocContainer.appendChild(tocTitle);

        const tocList = document.createElement('ul');
        headings.forEach((heading, index) => {
            const id = `heading-${index}`;
            heading.id = id;
            
            const li = document.createElement('li');
            li.className = `toc-item toc-${heading.tagName.toLowerCase()}`;
            li.innerHTML = `<a href="#${id}">${heading.innerText}</a>`;
            
            li.querySelector('a').addEventListener('click', (e) => {
                e.preventDefault();
                heading.scrollIntoView({ behavior: 'smooth', block: 'start' });
            });

            tocList.appendChild(li);
        });

        tocContainer.appendChild(tocList);
        
        // 插入到内容之前或侧边 (根据布局决定)
        const article = container.parentElement;
        article.insertBefore(tocContainer, container);
    }

    function updateActiveLinks(hash) {
        document.querySelectorAll('.nav-links a, .mobile-nav-links a').forEach(link => {
            const href = link.getAttribute('href');
            if (href === hash || (hash === '#home' && href === '#')) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }

    // 监听 hash 变化
    window.addEventListener('hashchange', handleRoute);
    
    // 初始路由处理
    if (window.location.hash) {
        handleRoute();
    } else {
        // 默认显示主页
        const homePage = document.getElementById('home');
        if (homePage) homePage.classList.add('active');
    }
});

function updateThemeIcon(theme) {
    const icon = document.querySelector('#theme-toggle i');
    if (icon) {
        icon.className = theme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
    }
}

function applyHue(hue) {
    const root = document.documentElement;
    const isDark = root.getAttribute('data-theme') === 'dark';
    
    // 基于色相生成主色、背景色和柔和色
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
