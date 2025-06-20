// 缓存模式演示

// Cache Aside模式演示
async function initCacheAsideDemo() {
    const container = document.getElementById('cache-aside-diagram');
    const logContainer = document.createElement('div');
    logContainer.className = 'demo-logs';
    container.parentElement.appendChild(logContainer);
    
    container.innerHTML = '';
    logContainer.innerHTML = '';
    
    // 创建节点
    const app = createNode('aside-app', 'Application', 1);
    const cache = createNode('aside-cache', 'Cache', 2);
    const db = createNode('aside-db', 'Database', 3);
    
    // 添加节点到容器
    container.appendChild(app);
    container.appendChild(cache);
    container.appendChild(db);
    
    // 定位节点
    app.style.left = '50px';
    app.style.top = '125px';
    cache.style.left = '250px';
    cache.style.top = '50px';
    db.style.left = '250px';
    db.style.top = '200px';
    
    // 添加连接线
    const lines = [
        drawLine(170, 155, 250, 80),  // app -> cache
        drawLine(170, 155, 250, 230)  // app -> db
    ];
    
    lines.forEach(line => container.appendChild(line));
    
    // 演示读取流程
    async function demonstrateRead() {
        addLog(logContainer, '开始读取数据', 'info');
        
        // 1. 查询缓存
        const cacheQuery = createMessage('Get data');
        cacheQuery.style.left = '180px';
        cacheQuery.style.top = '80px';
        container.appendChild(cacheQuery);
        
        await new Promise(resolve => setTimeout(resolve, 1000));
        addLog(logContainer, '1. 查询缓存', 'info');
        
        // 2. 缓存未命中
        cacheQuery.textContent = 'Cache Miss';
        addLog(logContainer, '2. 缓存未命中', 'warning');
        
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // 3. 查询数据库
        const dbQuery = createMessage('Select data');
        dbQuery.style.left = '180px';
        dbQuery.style.top = '180px';
        container.appendChild(dbQuery);
        
        addLog(logContainer, '3. 查询数据库', 'info');
        
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // 4. 写入缓存
        const cacheWrite = createMessage('Set data');
        cacheWrite.style.left = '180px';
        cacheWrite.style.top = '80px';
        container.appendChild(cacheWrite);
        
        addLog(logContainer, '4. 将数据写入缓存', 'success');
        
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // 清理消息
        [cacheQuery, dbQuery, cacheWrite].forEach(msg => msg.remove());
    }
    
    // 演示写入流程
    async function demonstrateWrite() {
        addLog(logContainer, '开始写入数据', 'info');
        
        // 1. 删除缓存
        const cacheDelete = createMessage('Delete cache');
        cacheDelete.style.left = '180px';
        cacheDelete.style.top = '80px';
        container.appendChild(cacheDelete);
        
        await new Promise(resolve => setTimeout(resolve, 1000));
        addLog(logContainer, '1. 删除缓存', 'info');
        
        // 2. 更新数据库
        const dbUpdate = createMessage('Update data');
        dbUpdate.style.left = '180px';
        dbUpdate.style.top = '180px';
        container.appendChild(dbUpdate);
        
        await new Promise(resolve => setTimeout(resolve, 1000));
        addLog(logContainer, '2. 更新数据库', 'success');
        
        // 清理消息
        [cacheDelete, dbUpdate].forEach(msg => msg.remove());
    }
    
    // 添加演示控制按钮
    const controls = container.parentElement.querySelector('.controls');
    const readBtn = createElement('button', '', '演示读取');
    const writeBtn = createElement('button', '', '演示写入');
    
    readBtn.addEventListener('click', demonstrateRead);
    writeBtn.addEventListener('click', demonstrateWrite);
    
    controls.appendChild(readBtn);
    controls.appendChild(writeBtn);
}

// Read Through模式演示
async function initReadThroughDemo() {
    const container = document.getElementById('read-through-diagram');
    const logContainer = document.createElement('div');
    logContainer.className = 'demo-logs';
    container.parentElement.appendChild(logContainer);
    
    container.innerHTML = '';
    logContainer.innerHTML = '';
    
    // 创建节点
    const app = createNode('rt-app', 'Application', 1);
    const cache = createNode('rt-cache', 'Cache', 2);
    const db = createNode('rt-db', 'Database', 3);
    
    // 添加节点到容器
    container.appendChild(app);
    container.appendChild(cache);
    container.appendChild(db);
    
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
    
    // 演示读取流程
    async function demonstrateRead() {
        addLog(logContainer, '开始读取数据', 'info');
        
        // 1. 应用程序请求数据
        const appRequest = createMessage('Get data');
        appRequest.style.left = '180px';
        appRequest.style.top = '100px';
        container.appendChild(appRequest);
        
        await new Promise(resolve => setTimeout(resolve, 1000));
        addLog(logContainer, '1. 应用程序请求数据', 'info');
        
        // 2. 缓存未命中，从数据库加载
        const dbRequest = createMessage('Load data');
        dbRequest.style.left = '380px';
        dbRequest.style.top = '100px';
        container.appendChild(dbRequest);
        
        await new Promise(resolve => setTimeout(resolve, 1000));
        addLog(logContainer, '2. 缓存未命中，从数据库加载', 'info');
        
        // 3. 数据库返回数据
        const dbResponse = createMessage('Return data');
        dbResponse.style.left = '380px';
        dbResponse.style.top = '180px';
        container.appendChild(dbResponse);
        
        await new Promise(resolve => setTimeout(resolve, 1000));
        addLog(logContainer, '3. 数据库返回数据', 'success');
        
        // 4. 缓存返回数据给应用
        const cacheResponse = createMessage('Return data');
        cacheResponse.style.left = '180px';
        cacheResponse.style.top = '180px';
        container.appendChild(cacheResponse);
        
        await new Promise(resolve => setTimeout(resolve, 1000));
        addLog(logContainer, '4. 缓存返回数据给应用', 'success');
        
        // 清理消息
        [appRequest, dbRequest, dbResponse, cacheResponse].forEach(msg => msg.remove());
    }
    
    // 添加演示控制按钮
    const controls = container.parentElement.querySelector('.controls');
    const demoBtn = createElement('button', '', '演示读取流程');
    
    demoBtn.addEventListener('click', demonstrateRead);
    controls.appendChild(demoBtn);
}

// Write Through模式演示
async function initWriteThroughDemo() {
    const container = document.getElementById('write-through-diagram');
    const logContainer = document.createElement('div');
    logContainer.className = 'demo-logs';
    container.parentElement.appendChild(logContainer);
    
    container.innerHTML = '';
    logContainer.innerHTML = '';
    
    // 创建节点
    const app = createNode('wt-app', 'Application', 1);
    const cache = createNode('wt-cache', 'Cache', 2);
    const db = createNode('wt-db', 'Database', 3);
    
    // 添加节点到容器
    container.appendChild(app);
    container.appendChild(cache);
    container.appendChild(db);
    
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
    
    // 演示写入流程
    async function demonstrateWrite() {
        addLog(logContainer, '开始写入数据', 'info');
        
        // 1. 应用程序写入数据
        const appWrite = createMessage('Write data');
        appWrite.style.left = '180px';
        appWrite.style.top = '100px';
        container.appendChild(appWrite);
        
        await new Promise(resolve => setTimeout(resolve, 1000));
        addLog(logContainer, '1. 应用程序发送写入请求', 'info');
        
        // 2. 缓存更新数据
        const cacheUpdate = createMessage('Update cache');
        cacheUpdate.style.left = '250px';
        cacheUpdate.style.top = '80px';
        container.appendChild(cacheUpdate);
        
        await new Promise(resolve => setTimeout(resolve, 1000));
        addLog(logContainer, '2. 更新缓存数据', 'info');
        
        // 3. 同步写入数据库
        const dbWrite = createMessage('Write to DB');
        dbWrite.style.left = '380px';
        dbWrite.style.top = '100px';
        container.appendChild(dbWrite);
        
        await new Promise(resolve => setTimeout(resolve, 1000));
        addLog(logContainer, '3. 同步写入数据库', 'success');
        
        // 4. 返回写入成功
        const response = createMessage('Success');
        response.style.left = '180px';
        response.style.top = '180px';
        container.appendChild(response);
        
        await new Promise(resolve => setTimeout(resolve, 1000));
        addLog(logContainer, '4. 返回写入成功', 'success');
        
        // 清理消息
        [appWrite, cacheUpdate, dbWrite, response].forEach(msg => msg.remove());
    }
    
    // 添加演示控制按钮
    const controls = container.parentElement.querySelector('.controls');
    const demoBtn = createElement('button', '', '演示写入流程');
    
    demoBtn.addEventListener('click', demonstrateWrite);
    controls.appendChild(demoBtn);
}

// Write Behind模式演示
async function initWriteBehindDemo() {
    const container = document.getElementById('write-behind-diagram');
    const logContainer = document.createElement('div');
    logContainer.className = 'demo-logs';
    container.parentElement.appendChild(logContainer);
    
    container.innerHTML = '';
    logContainer.innerHTML = '';
    
    // 创建节点
    const app = createNode('wb-app', 'Application', 1);
    const cache = createNode('wb-cache', 'Cache', 2);
    const db = createNode('wb-db', 'Database', 3);
    
    // 添加节点到容器
    container.appendChild(app);
    container.appendChild(cache);
    container.appendChild(db);
    
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
    
    // 演示写入流程
    async function demonstrateWrite() {
        addLog(logContainer, '开始写入数据', 'info');
        
        // 1. 应用程序写入数据
        const appWrite = createMessage('Write data');
        appWrite.style.left = '180px';
        appWrite.style.top = '100px';
        container.appendChild(appWrite);
        
        await new Promise(resolve => setTimeout(resolve, 1000));
        addLog(logContainer, '1. 应用程序发送写入请求', 'info');
        
        // 2. 更新缓存
        const cacheUpdate = createMessage('Update cache');
        cacheUpdate.style.left = '250px';
        cacheUpdate.style.top = '80px';
        container.appendChild(cacheUpdate);
        
        await new Promise(resolve => setTimeout(resolve, 1000));
        addLog(logContainer, '2. 立即更新缓存', 'success');
        
        // 3. 返回成功
        const response = createMessage('Success');
        response.style.left = '180px';
        response.style.top = '180px';
        container.appendChild(response);
        
        await new Promise(resolve => setTimeout(resolve, 1000));
        addLog(logContainer, '3. 立即返回成功', 'success');
        
        // 4. 异步写入数据库
        const dbWrite = createMessage('Async write');
        dbWrite.style.left = '380px';
        dbWrite.style.top = '100px';
        container.appendChild(dbWrite);
        
        await new Promise(resolve => setTimeout(resolve, 2000));
        addLog(logContainer, '4. 异步批量写入数据库', 'info');
        
        // 清理消息
        [appWrite, cacheUpdate, response, dbWrite].forEach(msg => msg.remove());
    }
    
    // 添加演示控制按钮
    const controls = container.parentElement.querySelector('.controls');
    const demoBtn = createElement('button', '', '演示写入流程');
    
    demoBtn.addEventListener('click', demonstrateWrite);
    controls.appendChild(demoBtn);
}

// 初始化所有缓存模式演示
document.addEventListener('DOMContentLoaded', function() {
    initCacheAsideDemo();
    initReadThroughDemo();
    initWriteThroughDemo();
    initWriteBehindDemo();
}); 