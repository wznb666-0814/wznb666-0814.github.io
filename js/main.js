/**
 * 首页逻辑
 */

// 文章列表配置 (手动列出文件名)
const POST_FILES = [
    '如何让AI生成的UI界面去除“AI味”.md',
    'HyperOS移植思路.md',
    'HyperOS移植思路——BUG修复与个性化修改篇.md',
    'AI提示词汇总.md',
    'ROM和插件获取.md',
    'hello-world.md',
    'Mizuki-master博客文章编写模板.md',
    'example.md',
    '我的账号 & 密码.md'
];

// “一些真心话”列表配置
const TRUTH_FILES = [
    'first-truth.md',
    'about-dreams.md'
];

// 默认封面图
const DEFAULT_COVER = 'Image/1.webp';

// Banner 轮播图配置 (图片需存放在 Image 文件夹中)
const BANNER_IMAGES = [
    'Image/1.webp',
    'Image/2.webp',
    'Image/3.webp',
    'Image/4.webp',
    'Image/5.webp',
    'Image/6.webp'
];

let allPosts = []; // 存储所有加载的文章数据
let allTruths = []; // 存储所有加载的真心话数据

document.addEventListener('DOMContentLoaded', async () => {
    const postListContainer = document.getElementById('post-list');
    const articlesListContainer = document.getElementById('articles-post-list');
    const wordsListContainer = document.getElementById('words-post-list');
    const themeToggle = document.getElementById('theme-toggle');
    const banner = document.querySelector('.banner');
    const searchInput = document.querySelector('.search-card input');

    // --- Banner 轮播逻辑 ---
    if (banner) {
        let currentImgIndex = 0;
        
        // 预加载图片
        BANNER_IMAGES.forEach(src => {
            const img = new Image();
            img.src = src;
        });

        setInterval(() => {
            currentImgIndex = (currentImgIndex + 1) % BANNER_IMAGES.length;
            banner.style.backgroundImage = `url('${BANNER_IMAGES[currentImgIndex]}')`;
        }, 5000); // 每 5 秒切换一次
    }

    // --- 加载文章列表 ---
    async function loadPosts(fileList, directory = 'Page') {
        const loadPromises = fileList.map(async (fileName) => {
            const postData = await MarkdownParser.fetchPost(fileName, directory);
            if (postData) {
                return { ...postData, fileName, directory };
            }
            return null;
        });

        const results = await Promise.all(loadPromises);
        return results.filter(p => p !== null);
    }

    /**
     * 渲染文章列表
     */
    function renderPosts(posts, container) {
        if (!container) return;
        
        container.innerHTML = '';
        
        if (posts.length === 0) {
            container.innerHTML = '<div class="no-results"><i class="fas fa-search"></i><p>未找到相关内容</p></div>';
            return;
        }

        posts.forEach((post, index) => {
            const { meta, excerpt, fileName, directory } = post;
            const card = document.createElement('div');
            card.className = 'post-card animate-slide-up';
            card.style.animationDelay = `${index * 0.1}s`;
            
            const coverImg = meta.image || DEFAULT_COVER;
            const dirParam = directory === 'Page' ? '' : `&dir=${directory}`;

            card.innerHTML = `
                <div class="post-card-img" style="background-image: url('${coverImg}')"></div>
                <div class="post-card-content">
                    <div class="post-card-meta">
                        <span><i class="far fa-calendar-alt"></i> ${meta.date || '未知日期'}</span>
                        <span><i class="fas fa-tags"></i> ${Array.isArray(meta.tags) ? meta.tags.join(', ') : (meta.tags || '无标签')}</span>
                    </div>
                    <h2 class="post-card-title">
                        <a href="#post?file=${encodeURIComponent(fileName)}${dirParam}">${meta.title || '无标题文章'}</a>
                    </h2>
                    <p class="post-card-excerpt">${excerpt}</p>
                    <a href="#post?file=${encodeURIComponent(fileName)}${dirParam}" class="post-card-more">
                        阅读全文 <i class="fas fa-chevron-right"></i>
                    </a>
                </div>
            `;
            container.appendChild(card);
        });
    }

    // 初始加载
    async function init() {
        // 加载普通文章
        const posts = await loadPosts(POST_FILES, 'Page');
        allPosts = posts;
        
        // 加载真心话文章
        const truths = await loadPosts(TRUTH_FILES, 'Truth');
        allTruths = truths;
        
        // 更新统计数据
        updateStats(posts, truths);
        
        // 渲染“文章”页面的列表
        renderPosts(allPosts, articlesListContainer);
        
        // 渲染“一些真心话”页面的列表
        renderPosts(allTruths, wordsListContainer);

        // 在首页渲染所有文章 (默认显示)
        renderPosts(allPosts, postListContainer);

        // 如果 URL 中有搜索参数，则在首页渲染搜索结果
        const urlParams = new URLSearchParams(window.location.search);
        const query = urlParams.get('q');
        if (query) {
            searchInput.value = query;
            const filtered = filterPosts(allPosts, query);
            renderPosts(filtered, postListContainer);
        }
    }

    // 初始化
    init();

    // 更新统计数据
    function updateStats(posts, truths) {
        const postsCount = document.getElementById('count-posts');
        const truthsCount = document.getElementById('count-truths');

        if (postsCount) postsCount.innerText = posts.length;
        if (truthsCount) truthsCount.innerText = truths.length;
    }

    // 过滤逻辑抽取
    function filterPosts(posts, term) {
        return posts.filter(post => {
            const title = (post.meta.title || '').toLowerCase();
            const excerpt = (post.excerpt || '').toLowerCase();
            const tags = Array.isArray(post.meta.tags) ? post.meta.tags.join(' ').toLowerCase() : (post.meta.tags || '').toLowerCase();
            const category = (post.meta.category || '').toLowerCase();
            return title.includes(term) || excerpt.includes(term) || tags.includes(term) || category.includes(term);
        });
    }

    // 搜索功能
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase().trim();
            
            if (searchTerm === '') {
                // 如果搜索框为空，显示提示文字
                postListContainer.innerHTML = `
                    <div class="loading">
                        <i class="fas fa-search" style="font-size: 2rem; color: var(--accent-color); margin-bottom: 1rem; opacity: 0.5;"></i>
                        <p>请搜索文章...</p>
                    </div>
                `;
                return;
            }

            const filtered = filterPosts(allPosts, searchTerm);
            renderPosts(filtered, postListContainer);
        });
    }
});
