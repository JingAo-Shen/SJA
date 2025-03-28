// 缓存优化策略演示

// 过期策略演示
async function initExpirationDemo() {
    const container = document.getElementById('expiration-diagram');
    const logContainer = document.createElement('div');
    logContainer.className = 'demo-logs';
    container.parentElement.appendChild(logContainer);
    
    container.innerHTML = '';
    logContainer.innerHTML = '';
    
    // 创建缓存项列表
    const cacheList = document.createElement('div');
    cacheList.className = 'cache-list';
    container.appendChild(cacheList);
    
    // 初始化缓存数据
    const cacheItems = [
        { key: 'user:1001', ttl: 300, accessed: Date.now() },
        { key: 'product:2001', ttl: 600, accessed: Date.now() - 200000 },
        { key: 'order:3001', ttl: 60, accessed: Date.now() - 50000 },
        { key: 'cart:4001', ttl: 1800, accessed: Date.now() - 1500000 },
        { key: 'config:5001', ttl: 3600, accessed: Date.now() - 3000000 }
    ];
    
    // 更新缓存列表
    function updateCacheList() {
        const now = Date.now();
        cacheList.innerHTML = `
            <div class="cache-header">缓存项状态</div>
            ${cacheItems.map(item => {
                const remainingTime = item.ttl - Math.floor((now - item.accessed) / 1000);
                const status = remainingTime <= 0 ? 'expired' : 
                             remainingTime < 60 ? 'warning' : 'active';
                return `
                    <div class="cache-item ${status}">
                        <div class="cache-key">${item.key}</div>
                        <div class="cache-ttl">TTL: ${item.ttl}s</div>
                        <div class="cache-remaining">
                            剩余: ${Math.max(0, remainingTime)}s
                        </div>
                    </div>
                `;
            }).join('')}
        `;
    }
    
    // 演示过期策略
    async function demonstrateExpiration() {
        addLog(logContainer, '开始演示缓存过期策略', 'info');
        
        for (let i = 0; i < 10; i++) {
            const now = Date.now();
            
            // 检查过期项
            cacheItems.forEach(item => {
                const remainingTime = item.ttl - Math.floor((now - item.accessed) / 1000);
                if (remainingTime <= 0) {
                    addLog(logContainer, `缓存项 ${item.key} 已过期`, 'warning');
                    // 模拟随机重置
                    if (Math.random() > 0.5) {
                        item.accessed = now;
                        addLog(logContainer, `重新加载缓存项 ${item.key}`, 'info');
                    }
                }
            });
            
            // 更新显示
            updateCacheList();
            
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
        
        addLog(logContainer, '过期策略演示结束', 'info');
    }
    
    // 添加演示控制按钮
    const controls = container.parentElement.querySelector('.controls');
    const demoBtn = createElement('button', '', '演示过期策略');
    
    demoBtn.addEventListener('click', demonstrateExpiration);
    controls.appendChild(demoBtn);
    
    // 初始显示
    updateCacheList();
}

// 淘汰策略演示
async function initEvictionDemo() {
    const container = document.getElementById('eviction-diagram');
    const logContainer = document.createElement('div');
    logContainer.className = 'demo-logs';
    container.parentElement.appendChild(logContainer);
    
    container.innerHTML = '';
    logContainer.innerHTML = '';
    
    // 创建内存使用图表
    const memoryChart = document.createElement('div');
    memoryChart.className = 'memory-chart';
    container.appendChild(memoryChart);
    
    // 创建缓存项列表
    const cacheList = document.createElement('div');
    cacheList.className = 'cache-list';
    container.appendChild(cacheList);
    
    // 初始化缓存数据
    const cacheItems = [
        { key: 'user:1001', size: 1024, lastAccessed: Date.now(), accessCount: 100 },
        { key: 'product:2001', size: 2048, lastAccessed: Date.now() - 5000, accessCount: 80 },
        { key: 'order:3001', size: 512, lastAccessed: Date.now() - 10000, accessCount: 50 },
        { key: 'cart:4001', size: 256, lastAccessed: Date.now() - 15000, accessCount: 30 },
        { key: 'config:5001', size: 128, lastAccessed: Date.now() - 20000, accessCount: 10 }
    ];
    
    // 更新缓存列表
    function updateCacheList() {
        const totalSize = cacheItems.reduce((sum, item) => sum + item.size, 0);
        const maxSize = 5120; // 5MB
        
        memoryChart.innerHTML = `
            <div class="memory-usage">
                <div class="memory-bar" style="width: ${(totalSize / maxSize) * 100}%"></div>
                <div class="memory-text">内存使用: ${(totalSize / 1024).toFixed(1)}MB / ${maxSize / 1024}MB</div>
            </div>
        `;
        
        cacheList.innerHTML = `
            <div class="cache-header">缓存项状态</div>
            ${cacheItems.map(item => `
                <div class="cache-item">
                    <div class="cache-key">${item.key}</div>
                    <div class="cache-size">大小: ${(item.size / 1024).toFixed(1)}KB</div>
                    <div class="cache-stats">
                        访问次数: ${item.accessCount}
                        最后访问: ${Math.floor((Date.now() - item.lastAccessed) / 1000)}s前
                    </div>
                </div>
            `).join('')}
        `;
    }
    
    // 演示淘汰策略
    async function demonstrateEviction() {
        addLog(logContainer, '开始演示缓存淘汰策略', 'info');
        
        for (let i = 0; i < 5; i++) {
            // 模拟新增缓存项
            const newItem = {
                key: `new:${Date.now()}`,
                size: 1024 + Math.floor(Math.random() * 1024),
                lastAccessed: Date.now(),
                accessCount: 1
            };
            
            addLog(logContainer, `添加新缓存项 ${newItem.key}`, 'info');
            
            // 检查是否需要淘汰
            const totalSize = [...cacheItems, newItem].reduce((sum, item) => sum + item.size, 0);
            if (totalSize > 5120) {
                // LRU策略：淘汰最久未访问的项
                const lruItem = cacheItems.reduce((prev, curr) => 
                    prev.lastAccessed < curr.lastAccessed ? prev : curr
                );
                const lruIndex = cacheItems.indexOf(lruItem);
                cacheItems.splice(lruIndex, 1);
                addLog(logContainer, `LRU策略淘汰 ${lruItem.key}`, 'warning');
            }
            
            cacheItems.push(newItem);
            
            // 随机访问现有项
            for (let j = 0; j < 3; j++) {
                const randomItem = cacheItems[Math.floor(Math.random() * cacheItems.length)];
                randomItem.lastAccessed = Date.now();
                randomItem.accessCount++;
                addLog(logContainer, `访问缓存项 ${randomItem.key}`, 'info');
            }
            
            // 更新显示
            updateCacheList();
            
            await new Promise(resolve => setTimeout(resolve, 2000));
        }
        
        addLog(logContainer, '淘汰策略演示结束', 'info');
    }
    
    // 添加演示控制按钮
    const controls = container.parentElement.querySelector('.controls');
    const demoBtn = createElement('button', '', '演示淘汰策略');
    
    demoBtn.addEventListener('click', demonstrateEviction);
    controls.appendChild(demoBtn);
    
    // 初始显示
    updateCacheList();
}

// 预加载策略演示
async function initPreloadingDemo() {
    const container = document.getElementById('preloading-diagram');
    const logContainer = document.createElement('div');
    logContainer.className = 'demo-logs';
    container.parentElement.appendChild(logContainer);
    
    container.innerHTML = '';
    logContainer.innerHTML = '';
    
    // 创建节点
    const app = createNode('pre-app', 'Application', 1);
    const cache = createNode('pre-cache', 'Cache', 2);
    const db = createNode('pre-db', 'Database', 3);
    
    // 添加节点到容器
    [app, cache, db].forEach(node => container.appendChild(node));
    
    // 定位节点
    app.style.left = '50px';
    app.style.top = '125px';
    cache.style.left = '250px';
    cache.style.top = '125px';
    db.style.left = '450px';
    db.style.top = '125px';
    
    // 添加连接线
    const lines = [
        drawLine(170, 155, 250, 155),  // app -> cache
        drawLine(370, 155, 450, 155)   // cache -> db
    ];
    
    lines.forEach(line => container.appendChild(line));
    
    // 创建预加载列表
    const preloadList = document.createElement('div');
    preloadList.className = 'preload-list';
    container.appendChild(preloadList);
    
    // 初始化预加载数据
    const preloadItems = [
        { key: 'category:1', status: 'pending' },
        { key: 'category:2', status: 'pending' },
        { key: 'hot-products', status: 'pending' },
        { key: 'user-preferences', status: 'pending' },
        { key: 'system-config', status: 'pending' }
    ];
    
    // 更新预加载列表
    function updatePreloadList() {
        preloadList.innerHTML = `
            <div class="preload-header">预加载状态</div>
            ${preloadItems.map(item => `
                <div class="preload-item ${item.status}">
                    <div class="preload-key">${item.key}</div>
                    <div class="preload-status">${item.status}</div>
                </div>
            `).join('')}
        `;
    }
    
    // 演示预加载策略
    async function demonstratePreloading() {
        addLog(logContainer, '开始演示缓存预加载策略', 'info');
        
        // 1. 启动预加载
        addLog(logContainer, '系统启动，开始预加载数据', 'info');
        
        for (const item of preloadItems) {
            // 从数据库加载
            const dbLoad = createMessage('Load data');
            dbLoad.style.left = '380px';
            dbLoad.style.top = '100px';
            container.appendChild(dbLoad);
            
            await new Promise(resolve => setTimeout(resolve, 500));
            
            // 写入缓存
            const cacheWrite = createMessage('Write cache');
            cacheWrite.style.left = '250px';
            cacheWrite.style.top = '80px';
            container.appendChild(cacheWrite);
            
            item.status = 'loading';
            updatePreloadList();
            
            await new Promise(resolve => setTimeout(resolve, 500));
            
            // 完成加载
            item.status = 'loaded';
            updatePreloadList();
            addLog(logContainer, `预加载 ${item.key} 完成`, 'success');
            
            [dbLoad, cacheWrite].forEach(msg => msg.remove());
        }
        
        // 2. 模拟访问预加载数据
        for (let i = 0; i < 3; i++) {
            const randomItem = preloadItems[Math.floor(Math.random() * preloadItems.length)];
            
            const readCache = createMessage('Read cache');
            readCache.style.left = '180px';
            readCache.style.top = '100px';
            container.appendChild(readCache);
            
            await new Promise(resolve => setTimeout(resolve, 1000));
            addLog(logContainer, `快速访问预加载数据 ${randomItem.key}`, 'info');
            
            readCache.remove();
        }
        
        addLog(logContainer, '预加载策略演示结束', 'info');
    }
    
    // 添加演示控制按钮
    const controls = container.parentElement.querySelector('.controls');
    const demoBtn = createElement('button', '', '演示预加载策略');
    
    demoBtn.addEventListener('click', demonstratePreloading);
    controls.appendChild(demoBtn);
    
    // 初始显示
    updatePreloadList();
}

// 初始化所有优化策略演示
document.addEventListener('DOMContentLoaded', function() {
    initExpirationDemo();
    initEvictionDemo();
    initPreloadingDemo();
}); 