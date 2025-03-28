// 缓存一致性演示

// 缓存击穿演示
async function initCachePenetrationDemo() {
    const container = document.getElementById('cache-penetration-diagram');
    const logContainer = document.createElement('div');
    logContainer.className = 'demo-logs';
    container.parentElement.appendChild(logContainer);
    
    container.innerHTML = '';
    logContainer.innerHTML = '';
    
    // 创建节点
    const app1 = createNode('pen-app1', 'Application 1', 1);
    const app2 = createNode('pen-app2', 'Application 2', 1);
    const app3 = createNode('pen-app3', 'Application 3', 1);
    const cache = createNode('pen-cache', 'Cache', 2);
    const db = createNode('pen-db', 'Database', 3);
    
    // 添加节点到容器
    [app1, app2, app3, cache, db].forEach(node => container.appendChild(node));
    
    // 定位节点
    app1.style.left = '50px';
    app1.style.top = '50px';
    app2.style.left = '50px';
    app2.style.top = '150px';
    app3.style.left = '50px';
    app3.style.top = '250px';
    cache.style.left = '250px';
    cache.style.top = '150px';
    db.style.left = '450px';
    db.style.top = '150px';
    
    // 添加连接线
    const lines = [
        drawLine(170, 80, 250, 150),   // app1 -> cache
        drawLine(170, 180, 250, 150),  // app2 -> cache
        drawLine(170, 280, 250, 150),  // app3 -> cache
        drawLine(370, 150, 450, 150)   // cache -> db
    ];
    
    lines.forEach(line => container.appendChild(line));
    
    // 演示缓存击穿
    async function demonstratePenetration() {
        addLog(logContainer, '开始演示缓存击穿', 'info');
        
        // 1. 热点数据过期
        const expireMsg = createMessage('Key Expired');
        expireMsg.style.left = '250px';
        expireMsg.style.top = '100px';
        container.appendChild(expireMsg);
        
        await new Promise(resolve => setTimeout(resolve, 1000));
        addLog(logContainer, '1. 热点数据在缓存中过期', 'warning');
        
        // 2. 并发请求涌入
        const requests = [];
        for (let i = 0; i < 3; i++) {
            const request = createMessage('Get data');
            request.style.left = '170px';
            request.style.top = (80 + i * 100) + 'px';
            container.appendChild(request);
            requests.push(request);
        }
        
        await new Promise(resolve => setTimeout(resolve, 1000));
        addLog(logContainer, '2. 大量并发请求同时涌入', 'warning');
        
        // 3. 缓存未命中，请求穿透到数据库
        const dbQueries = [];
        for (let i = 0; i < 3; i++) {
            const query = createMessage('DB Query');
            query.style.left = '380px';
            query.style.top = '150px';
            container.appendChild(query);
            dbQueries.push(query);
            
            await new Promise(resolve => setTimeout(resolve, 500));
        }
        
        await new Promise(resolve => setTimeout(resolve, 1000));
        addLog(logContainer, '3. 缓存未命中，请求穿透到数据库', 'error');
        
        // 4. 数据库压力激增
        const dbLoad = createMessage('High Load!');
        dbLoad.style.left = '450px';
        dbLoad.style.top = '100px';
        container.appendChild(dbLoad);
        
        await new Promise(resolve => setTimeout(resolve, 1000));
        addLog(logContainer, '4. 数据库负载激增', 'error');
        
        // 清理消息
        [expireMsg, ...requests, ...dbQueries, dbLoad].forEach(msg => msg.remove());
    }
    
    // 添加演示控制按钮
    const controls = container.parentElement.querySelector('.controls');
    const demoBtn = createElement('button', '', '演示缓存击穿');
    
    demoBtn.addEventListener('click', demonstratePenetration);
    controls.appendChild(demoBtn);
}

// 缓存雪崩演示
async function initCacheAvalancheDemo() {
    const container = document.getElementById('cache-avalanche-diagram');
    const logContainer = document.createElement('div');
    logContainer.className = 'demo-logs';
    container.parentElement.appendChild(logContainer);
    
    container.innerHTML = '';
    logContainer.innerHTML = '';
    
    // 创建节点
    const apps = Array.from({length: 3}, (_, i) => 
        createNode(`ava-app${i+1}`, `Application ${i+1}`, 1));
    const caches = Array.from({length: 3}, (_, i) => 
        createNode(`ava-cache${i+1}`, `Cache ${i+1}`, 2));
    const db = createNode('ava-db', 'Database', 3);
    
    // 添加节点到容器
    [...apps, ...caches, db].forEach(node => container.appendChild(node));
    
    // 定位节点
    apps.forEach((app, i) => {
        app.style.left = '50px';
        app.style.top = (50 + i * 100) + 'px';
    });
    
    caches.forEach((cache, i) => {
        cache.style.left = '250px';
        cache.style.top = (50 + i * 100) + 'px';
    });
    
    db.style.left = '450px';
    db.style.top = '150px';
    
    // 添加连接线
    const lines = [
        ...apps.map((_, i) => drawLine(170, 80 + i * 100, 250, 80 + i * 100)),  // apps -> caches
        ...caches.map((_, i) => drawLine(370, 80 + i * 100, 450, 150))          // caches -> db
    ];
    
    lines.forEach(line => container.appendChild(line));
    
    // 演示缓存雪崩
    async function demonstrateAvalanche() {
        addLog(logContainer, '开始演示缓存雪崩', 'info');
        
        // 1. 缓存节点同时过期
        const expireMsgs = [];
        for (let i = 0; i < 3; i++) {
            const msg = createMessage('Cache Expired');
            msg.style.left = '250px';
            msg.style.top = (30 + i * 100) + 'px';
            container.appendChild(msg);
            expireMsgs.push(msg);
        }
        
        await new Promise(resolve => setTimeout(resolve, 1000));
        addLog(logContainer, '1. 大量缓存同时过期', 'warning');
        
        // 2. 请求涌入数据库
        const dbQueries = [];
        for (let i = 0; i < 9; i++) {
            const query = createMessage('DB Query');
            query.style.left = '380px';
            query.style.top = '150px';
            container.appendChild(query);
            dbQueries.push(query);
            
            await new Promise(resolve => setTimeout(resolve, 200));
        }
        
        await new Promise(resolve => setTimeout(resolve, 1000));
        addLog(logContainer, '2. 请求全部转发到数据库', 'error');
        
        // 3. 数据库崩溃
        const dbError = createMessage('Database Overload!');
        dbError.style.left = '450px';
        dbError.style.top = '100px';
        container.appendChild(dbError);
        
        await new Promise(resolve => setTimeout(resolve, 1000));
        addLog(logContainer, '3. 数据库负载过高，系统崩溃', 'error');
        
        // 清理消息
        [...expireMsgs, ...dbQueries, dbError].forEach(msg => msg.remove());
    }
    
    // 添加演示控制按钮
    const controls = container.parentElement.querySelector('.controls');
    const demoBtn = createElement('button', '', '演示缓存雪崩');
    
    demoBtn.addEventListener('click', demonstrateAvalanche);
    controls.appendChild(demoBtn);
}

// 缓存穿透演示
async function initCacheBreakdownDemo() {
    const container = document.getElementById('cache-breakdown-diagram');
    const logContainer = document.createElement('div');
    logContainer.className = 'demo-logs';
    container.parentElement.appendChild(logContainer);
    
    container.innerHTML = '';
    logContainer.innerHTML = '';
    
    // 创建节点
    const app = createNode('break-app', 'Application', 1);
    const cache = createNode('break-cache', 'Cache', 2);
    const db = createNode('break-db', 'Database', 3);
    
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
    
    // 演示缓存穿透
    async function demonstrateBreakdown() {
        addLog(logContainer, '开始演示缓存穿透', 'info');
        
        // 1. 恶意请求
        const maliciousRequest = createMessage('Get non-existent key');
        maliciousRequest.style.left = '180px';
        maliciousRequest.style.top = '100px';
        container.appendChild(maliciousRequest);
        
        await new Promise(resolve => setTimeout(resolve, 1000));
        addLog(logContainer, '1. 发起查询不存在的数据的请求', 'warning');
        
        // 2. 缓存未命中
        const cacheMiss = createMessage('Cache Miss');
        cacheMiss.style.left = '250px';
        cacheMiss.style.top = '80px';
        container.appendChild(cacheMiss);
        
        await new Promise(resolve => setTimeout(resolve, 1000));
        addLog(logContainer, '2. 缓存中不存在该数据', 'info');
        
        // 3. 查询数据库
        const dbQuery = createMessage('DB Query');
        dbQuery.style.left = '380px';
        dbQuery.style.top = '100px';
        container.appendChild(dbQuery);
        
        await new Promise(resolve => setTimeout(resolve, 1000));
        addLog(logContainer, '3. 查询转发到数据库', 'info');
        
        // 4. 数据库未命中
        const dbMiss = createMessage('Not Found');
        dbMiss.style.left = '450px';
        dbMiss.style.top = '80px';
        container.appendChild(dbMiss);
        
        await new Promise(resolve => setTimeout(resolve, 1000));
        addLog(logContainer, '4. 数据库中也不存在该数据', 'warning');
        
        // 5. 重复请求
        for (let i = 0; i < 3; i++) {
            const repeat = createMessage('Repeat Query');
            repeat.style.left = '180px';
            repeat.style.top = '100px';
            container.appendChild(repeat);
            
            await new Promise(resolve => setTimeout(resolve, 500));
            repeat.remove();
        }
        
        await new Promise(resolve => setTimeout(resolve, 1000));
        addLog(logContainer, '5. 恶意请求持续发起', 'error');
        
        // 清理消息
        [maliciousRequest, cacheMiss, dbQuery, dbMiss].forEach(msg => msg.remove());
    }
    
    // 添加演示控制按钮
    const controls = container.parentElement.querySelector('.controls');
    const demoBtn = createElement('button', '', '演示缓存穿透');
    
    demoBtn.addEventListener('click', demonstrateBreakdown);
    controls.appendChild(demoBtn);
}

// 初始化所有一致性问题演示
document.addEventListener('DOMContentLoaded', function() {
    initCachePenetrationDemo();
    initCacheAvalancheDemo();
    initCacheBreakdownDemo();
}); 