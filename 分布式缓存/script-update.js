// 缓存更新策略演示

// 同步双写策略演示
async function initSyncWriteDemo() {
    const container = document.getElementById('sync-write-diagram');
    const logContainer = document.createElement('div');
    logContainer.className = 'demo-logs';
    container.parentElement.appendChild(logContainer);
    
    container.innerHTML = '';
    logContainer.innerHTML = '';
    
    // 创建节点
    const app = createNode('sync-app', 'Application', 1);
    const cache = createNode('sync-cache', 'Cache', 2);
    const db = createNode('sync-db', 'Database', 3);
    
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
    
    // 演示同步双写
    async function demonstrateSyncWrite() {
        addLog(logContainer, '开始演示同步双写策略', 'info');
        
        // 1. 应用程序发起更新
        const updateMsg = createMessage('Update data');
        updateMsg.style.left = '180px';
        updateMsg.style.top = '100px';
        container.appendChild(updateMsg);
        
        await new Promise(resolve => setTimeout(resolve, 1000));
        addLog(logContainer, '1. 应用程序发起数据更新', 'info');
        
        // 2. 更新缓存
        const cacheUpdate = createMessage('Update cache');
        cacheUpdate.style.left = '250px';
        cacheUpdate.style.top = '80px';
        container.appendChild(cacheUpdate);
        
        await new Promise(resolve => setTimeout(resolve, 1000));
        addLog(logContainer, '2. 更新缓存数据', 'info');
        
        // 3. 更新数据库
        const dbUpdate = createMessage('Update DB');
        dbUpdate.style.left = '380px';
        dbUpdate.style.top = '100px';
        container.appendChild(dbUpdate);
        
        await new Promise(resolve => setTimeout(resolve, 1000));
        addLog(logContainer, '3. 更新数据库', 'info');
        
        // 4. 返回结果
        const response = createMessage('Success');
        response.style.left = '180px';
        response.style.top = '180px';
        container.appendChild(response);
        
        await new Promise(resolve => setTimeout(resolve, 1000));
        addLog(logContainer, '4. 更新完成，返回成功', 'success');
        
        // 清理消息
        [updateMsg, cacheUpdate, dbUpdate, response].forEach(msg => msg.remove());
    }
    
    // 添加演示控制按钮
    const controls = container.parentElement.querySelector('.controls');
    const demoBtn = createElement('button', '', '演示同步双写');
    
    demoBtn.addEventListener('click', demonstrateSyncWrite);
    controls.appendChild(demoBtn);
}

// 异步更新策略演示
async function initAsyncUpdateDemo() {
    const container = document.getElementById('async-update-diagram');
    const logContainer = document.createElement('div');
    logContainer.className = 'demo-logs';
    container.parentElement.appendChild(logContainer);
    
    container.innerHTML = '';
    logContainer.innerHTML = '';
    
    // 创建节点
    const app = createNode('async-app', 'Application', 1);
    const cache = createNode('async-cache', 'Cache', 2);
    const db = createNode('async-db', 'Database', 3);
    const queue = createNode('async-queue', 'Message Queue', 4);
    
    // 添加节点到容器
    [app, cache, db, queue].forEach(node => container.appendChild(node));
    
    // 定位节点
    app.style.left = '50px';
    app.style.top = '125px';
    cache.style.left = '250px';
    cache.style.top = '50px';
    queue.style.left = '250px';
    queue.style.top = '200px';
    db.style.left = '450px';
    db.style.top = '125px';
    
    // 添加连接线
    const lines = [
        drawLine(170, 155, 250, 80),   // app -> cache
        drawLine(170, 155, 250, 230),  // app -> queue
        drawLine(370, 230, 450, 155)   // queue -> db
    ];
    
    lines.forEach(line => container.appendChild(line));
    
    // 演示异步更新
    async function demonstrateAsyncUpdate() {
        addLog(logContainer, '开始演示异步更新策略', 'info');
        
        // 1. 更新缓存
        const cacheUpdate = createMessage('Update cache');
        cacheUpdate.style.left = '180px';
        cacheUpdate.style.top = '80px';
        container.appendChild(cacheUpdate);
        
        await new Promise(resolve => setTimeout(resolve, 1000));
        addLog(logContainer, '1. 立即更新缓存', 'info');
        
        // 2. 发送消息到队列
        const queueMsg = createMessage('Send message');
        queueMsg.style.left = '180px';
        queueMsg.style.top = '180px';
        container.appendChild(queueMsg);
        
        await new Promise(resolve => setTimeout(resolve, 1000));
        addLog(logContainer, '2. 发送更新消息到队列', 'info');
        
        // 3. 返回成功
        const response = createMessage('Success');
        response.style.left = '120px';
        response.style.top = '100px';
        container.appendChild(response);
        
        await new Promise(resolve => setTimeout(resolve, 1000));
        addLog(logContainer, '3. 立即返回成功', 'success');
        
        // 4. 异步更新数据库
        const dbUpdate = createMessage('Async update');
        dbUpdate.style.left = '380px';
        dbUpdate.style.top = '180px';
        container.appendChild(dbUpdate);
        
        await new Promise(resolve => setTimeout(resolve, 2000));
        addLog(logContainer, '4. 异步更新数据库', 'info');
        
        // 清理消息
        [cacheUpdate, queueMsg, response, dbUpdate].forEach(msg => msg.remove());
    }
    
    // 添加演示控制按钮
    const controls = container.parentElement.querySelector('.controls');
    const demoBtn = createElement('button', '', '演示异步更新');
    
    demoBtn.addEventListener('click', demonstrateAsyncUpdate);
    controls.appendChild(demoBtn);
}

// 延迟双删策略演示
async function initDelayDoubleDeleteDemo() {
    const container = document.getElementById('delay-double-delete-diagram');
    const logContainer = document.createElement('div');
    logContainer.className = 'demo-logs';
    container.parentElement.appendChild(logContainer);
    
    container.innerHTML = '';
    logContainer.innerHTML = '';
    
    // 创建节点
    const app = createNode('ddd-app', 'Application', 1);
    const cache = createNode('ddd-cache', 'Cache', 2);
    const db = createNode('ddd-db', 'Database', 3);
    
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
    
    // 演示延迟双删
    async function demonstrateDelayDoubleDelete() {
        addLog(logContainer, '开始演示延迟双删策略', 'info');
        
        // 1. 删除缓存
        const cacheDelete1 = createMessage('Delete cache');
        cacheDelete1.style.left = '180px';
        cacheDelete1.style.top = '100px';
        container.appendChild(cacheDelete1);
        
        await new Promise(resolve => setTimeout(resolve, 1000));
        addLog(logContainer, '1. 第一次删除缓存', 'info');
        
        // 2. 更新数据库
        const dbUpdate = createMessage('Update DB');
        dbUpdate.style.left = '380px';
        dbUpdate.style.top = '100px';
        container.appendChild(dbUpdate);
        
        await new Promise(resolve => setTimeout(resolve, 1000));
        addLog(logContainer, '2. 更新数据库', 'info');
        
        // 3. 等待一段时间
        const waiting = createMessage('Waiting...');
        waiting.style.left = '250px';
        waiting.style.top = '80px';
        container.appendChild(waiting);
        
        await new Promise(resolve => setTimeout(resolve, 2000));
        addLog(logContainer, '3. 等待一段时间（延迟）', 'info');
        
        // 4. 再次删除缓存
        const cacheDelete2 = createMessage('Delete cache again');
        cacheDelete2.style.left = '180px';
        cacheDelete2.style.top = '100px';
        container.appendChild(cacheDelete2);
        
        await new Promise(resolve => setTimeout(resolve, 1000));
        addLog(logContainer, '4. 第二次删除缓存', 'success');
        
        // 清理消息
        [cacheDelete1, dbUpdate, waiting, cacheDelete2].forEach(msg => msg.remove());
    }
    
    // 添加演示控制按钮
    const controls = container.parentElement.querySelector('.controls');
    const demoBtn = createElement('button', '', '演示延迟双删');
    
    demoBtn.addEventListener('click', demonstrateDelayDoubleDelete);
    controls.appendChild(demoBtn);
}

// 初始化所有更新策略演示
document.addEventListener('DOMContentLoaded', function() {
    initSyncWriteDemo();
    initAsyncUpdateDemo();
    initDelayDoubleDeleteDemo();
}); 