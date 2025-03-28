// 基础架构演示
async function initBasicStructureDemo(diagram) {
    clearDiagram(diagram);
    
    // 创建日志容器
    const logContainer = createLogContainer();
    diagram.appendChild(logContainer);
    
    // 创建节点
    const client = createNode('client', '客户端');
    const api = createNode('api', 'API服务');
    const cache = createNode('cache', '缓存层');
    const db = createNode('db', '数据库');
    
    // 添加节点到图表
    [client, api, cache, db].forEach(node => {
        diagram.appendChild(node);
    });
    
    // 布局节点
    const centerX = diagram.offsetWidth / 2;
    const centerY = diagram.offsetHeight / 2;
    
    client.style.left = `${centerX - 150}px`;
    client.style.top = '50px';
    
    api.style.left = `${centerX - 50}px`;
    api.style.top = `${centerY - 50}px`;
    
    cache.style.left = `${centerX + 100}px`;
    cache.style.top = `${centerY - 50}px`;
    
    db.style.left = `${centerX + 50}px`;
    db.style.top = `${centerY + 100}px`;
    
    // 创建连接线
    const connections = [
        [client, api],
        [api, cache],
        [api, db],
        [cache, db]
    ];
    
    connections.forEach(([from, to]) => {
        const line = drawLine(
            getNodePosition(from).x,
            getNodePosition(from).y,
            getNodePosition(to).x,
            getNodePosition(to).y
        );
        diagram.appendChild(line);
    });
    
    addLog(logContainer, '初始化排行榜基础架构演示');
    
    // 演示基本流程
    await sleep(500);
    
    // 查询排行榜
    await activateNode(client);
    const queryMessage = createMessage('查询排行榜');
    diagram.appendChild(queryMessage);
    await animateMessage(queryMessage, client, api);
    addLog(logContainer, '客户端请求排行榜数据');
    
    // 检查缓存
    await activateNode(api);
    const cacheCheckMessage = createMessage('检查缓存');
    diagram.appendChild(cacheCheckMessage);
    await animateMessage(cacheCheckMessage, api, cache);
    await activateNode(cache);
    addLog(logContainer, '检查缓存中的排行榜数据');
    
    // 缓存未命中，查询数据库
    const dbQueryMessage = createMessage('查询数据库');
    diagram.appendChild(dbQueryMessage);
    await animateMessage(dbQueryMessage, api, db);
    await activateNode(db);
    addLog(logContainer, '从数据库获取排行榜数据');
    
    // 更新缓存
    const updateCacheMessage = createMessage('更新缓存');
    diagram.appendChild(updateCacheMessage);
    await animateMessage(updateCacheMessage, api, cache);
    await activateNode(cache);
    addLog(logContainer, '将排行榜数据更新到缓存');
    
    // 返回结果
    const responseMessage = createMessage('返回数据');
    diagram.appendChild(responseMessage);
    await animateMessage(responseMessage, api, client);
    await activateNode(client);
    addLog(logContainer, '向客户端返回排行榜数据');
}

// 实时排行榜演示
async function initRealTimeDemo(diagram) {
    clearDiagram(diagram);
    
    // 创建日志容器
    const logContainer = createLogContainer();
    diagram.appendChild(logContainer);
    
    // 创建节点
    const client = createNode('client', '客户端');
    const api = createNode('api', 'API服务');
    const redis = createNode('redis', 'Redis');
    const consumer = createNode('consumer', '消费者');
    const db = createNode('db', '数据库');
    
    // 添加节点到图表
    [client, api, redis, consumer, db].forEach(node => {
        diagram.appendChild(node);
    });
    
    // 布局节点
    const centerX = diagram.offsetWidth / 2;
    const centerY = diagram.offsetHeight / 2;
    
    arrangeNodesInCircle([client, api, redis, consumer, db], centerX, centerY, 150);
    
    // 创建连接线
    const nodes = [client, api, redis, consumer, db];
    for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
            const line = drawLine(
                getNodePosition(nodes[i]).x,
                getNodePosition(nodes[i]).y,
                getNodePosition(nodes[j]).x,
                getNodePosition(nodes[j]).y
            );
            diagram.appendChild(line);
        }
    }
    
    addLog(logContainer, '初始化实时排行榜演示');
    
    // 演示实时更新流程
    for (let i = 0; i < 2; i++) {
        // 提交新分数
        await activateNode(client);
        const scoreMessage = createMessage('提交新分数');
        diagram.appendChild(scoreMessage);
        await animateMessage(scoreMessage, client, api);
        addLog(logContainer, '用户提交新的分数');
        
        // 更新Redis
        await activateNode(api);
        const redisMessage = createMessage('更新分数');
        diagram.appendChild(redisMessage);
        await animateMessage(redisMessage, api, redis);
        await activateNode(redis);
        addLog(logContainer, '更新Redis中的排行榜数据');
        
        // 异步持久化
        const persistMessage = createMessage('异步持久化');
        diagram.appendChild(persistMessage);
        await animateMessage(persistMessage, redis, consumer);
        await activateNode(consumer);
        addLog(logContainer, '触发异步持久化操作');
        
        // 保存到数据库
        const saveMessage = createMessage('保存数据');
        diagram.appendChild(saveMessage);
        await animateMessage(saveMessage, consumer, db);
        await activateNode(db);
        addLog(logContainer, '将数据保存到数据库');
        
        // 实时推送更新
        const updateMessage = createMessage('实时更新');
        diagram.appendChild(updateMessage);
        await animateMessage(updateMessage, redis, client);
        await activateNode(client);
        addLog(logContainer, '向客户端推送更新的排行榜数据');
        
        await sleep(1000);
    }
}

// 周期性排行榜演示
async function initPeriodicDemo(diagram) {
    clearDiagram(diagram);
    
    // 创建日志容器
    const logContainer = createLogContainer();
    diagram.appendChild(logContainer);
    
    // 创建节点
    const scheduler = createNode('scheduler', '调度器');
    const calculator = createNode('calculator', '计算服务');
    const redis = createNode('redis', 'Redis');
    const db = createNode('db', '数据库');
    const client = createNode('client', '客户端');
    
    // 添加节点到图表
    [scheduler, calculator, redis, db, client].forEach(node => {
        diagram.appendChild(node);
    });
    
    // 布局节点
    const centerX = diagram.offsetWidth / 2;
    const centerY = diagram.offsetHeight / 2;
    
    scheduler.style.left = `${centerX - 50}px`;
    scheduler.style.top = '50px';
    
    calculator.style.left = `${centerX - 150}px`;
    calculator.style.top = `${centerY}px`;
    
    redis.style.left = `${centerX + 50}px`;
    redis.style.top = `${centerY}px`;
    
    db.style.left = `${centerX - 50}px`;
    db.style.top = `${centerY + 100}px`;
    
    client.style.left = `${centerX + 150}px`;
    client.style.top = `${centerY - 100}px`;
    
    // 创建连接线
    const connections = [
        [scheduler, calculator],
        [calculator, db],
        [calculator, redis],
        [redis, client]
    ];
    
    connections.forEach(([from, to]) => {
        const line = drawLine(
            getNodePosition(from).x,
            getNodePosition(from).y,
            getNodePosition(to).x,
            getNodePosition(to).y
        );
        diagram.appendChild(line);
    });
    
    addLog(logContainer, '初始化周期性排行榜演示');
    
    // 演示周期性更新流程
    for (let i = 0; i < 2; i++) {
        // 触发定时任务
        await activateNode(scheduler);
        const triggerMessage = createMessage('触发计算');
        diagram.appendChild(triggerMessage);
        await animateMessage(triggerMessage, scheduler, calculator);
        addLog(logContainer, '调度器触发排行榜计算任务');
        
        // 查询数据
        await activateNode(calculator);
        const queryMessage = createMessage('查询数据');
        diagram.appendChild(queryMessage);
        await animateMessage(queryMessage, calculator, db);
        await activateNode(db);
        addLog(logContainer, '从数据库获取统计数据');
        
        // 计算排行榜
        await sleep(500);
        await activateNode(calculator);
        addLog(logContainer, '计算新的排行榜数据');
        
        // 更新缓存
        const updateMessage = createMessage('更新排行榜');
        diagram.appendChild(updateMessage);
        await animateMessage(updateMessage, calculator, redis);
        await activateNode(redis);
        addLog(logContainer, '将新的排行榜数据更新到Redis');
        
        // 客户端查询
        const clientMessage = createMessage('查询排行榜');
        diagram.appendChild(clientMessage);
        await animateMessage(clientMessage, client, redis);
        await activateNode(redis);
        
        const responseMessage = createMessage('返回数据');
        diagram.appendChild(responseMessage);
        await animateMessage(responseMessage, redis, client);
        await activateNode(client);
        addLog(logContainer, '客户端获取更新后的排行榜数据');
        
        await sleep(1000);
    }
}

// 历史排行榜演示
async function initHistoricalDemo(diagram) {
    clearDiagram(diagram);
    
    // 创建日志容器
    const logContainer = createLogContainer();
    diagram.appendChild(logContainer);
    
    // 创建节点
    const client = createNode('client', '客户端');
    const api = createNode('api', 'API服务');
    const archive = createNode('archive', '归档服务');
    const redis = createNode('redis', 'Redis');
    const db = createNode('db', '数据库');
    
    // 添加节点到图表
    [client, api, archive, redis, db].forEach(node => {
        diagram.appendChild(node);
    });
    
    // 布局节点
    const centerX = diagram.offsetWidth / 2;
    const centerY = diagram.offsetHeight / 2;
    
    client.style.left = `${centerX - 150}px`;
    client.style.top = '50px';
    
    api.style.left = `${centerX - 50}px`;
    api.style.top = `${centerY - 50}px`;
    
    archive.style.left = `${centerX + 100}px`;
    archive.style.top = `${centerY - 50}px`;
    
    redis.style.left = `${centerX - 100}px`;
    redis.style.top = `${centerY + 50}px`;
    
    db.style.left = `${centerX + 50}px`;
    db.style.top = `${centerY + 100}px`;
    
    // 创建连接线
    const connections = [
        [client, api],
        [api, archive],
        [api, redis],
        [archive, db],
        [redis, db]
    ];
    
    connections.forEach(([from, to]) => {
        const line = drawLine(
            getNodePosition(from).x,
            getNodePosition(from).y,
            getNodePosition(to).x,
            getNodePosition(to).y
        );
        diagram.appendChild(line);
    });
    
    addLog(logContainer, '初始化历史排行榜演示');
    
    // 演示历史数据查询流程
    // 查询历史排行榜
    await activateNode(client);
    const queryMessage = createMessage('查询历史排行榜');
    diagram.appendChild(queryMessage);
    await animateMessage(queryMessage, client, api);
    addLog(logContainer, '客户端请求历史排行榜数据');
    
    // 检查Redis缓存
    await activateNode(api);
    const cacheCheckMessage = createMessage('检查缓存');
    diagram.appendChild(cacheCheckMessage);
    await animateMessage(cacheCheckMessage, api, redis);
    await activateNode(redis);
    addLog(logContainer, '检查Redis中是否有缓存的历史数据');
    
    // 缓存未命中，请求归档服务
    const archiveMessage = createMessage('请求历史数据');
    diagram.appendChild(archiveMessage);
    await animateMessage(archiveMessage, api, archive);
    await activateNode(archive);
    addLog(logContainer, '从归档服务获取历史数据');
    
    // 查询数据库
    const dbQueryMessage = createMessage('查询归档数据');
    diagram.appendChild(dbQueryMessage);
    await animateMessage(dbQueryMessage, archive, db);
    await activateNode(db);
    addLog(logContainer, '从数据库读取历史排行榜数据');
    
    // 更新缓存
    const cacheMessage = createMessage('缓存数据');
    diagram.appendChild(cacheMessage);
    await animateMessage(cacheMessage, archive, redis);
    await activateNode(redis);
    addLog(logContainer, '将历史数据缓存到Redis');
    
    // 返回结果
    const responseMessage = createMessage('返回历史数据');
    diagram.appendChild(responseMessage);
    await animateMessage(responseMessage, api, client);
    await activateNode(client);
    addLog(logContainer, '向客户端返回历史排行榜数据');
    
    // 展示历史数据表格
    await sleep(500);
    const historicalData = [
        { name: '用户A', score: 1000 },
        { name: '用户B', score: 850 },
        { name: '用户C', score: 720 },
        { name: '用户D', score: 650 },
        { name: '用户E', score: 500 }
    ];
    
    const table = createLeaderboardTable(historicalData, ['排名', '用户', '历史得分']);
    diagram.appendChild(table);
    addLog(logContainer, '显示历史排行榜数据表格');
} 