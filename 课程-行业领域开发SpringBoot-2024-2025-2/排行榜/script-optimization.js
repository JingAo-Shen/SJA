// 缓存策略演示
async function initCachingDemo(diagram) {
    clearDiagram(diagram);
    
    // 创建日志容器
    const logContainer = createLogContainer();
    diagram.appendChild(logContainer);
    addLog(logContainer, '初始化缓存策略演示');
    
    // 创建节点
    const client = createNode('client', '客户端');
    const apiService = createNode('api', 'API服务');
    const cacheLayer = createNode('cache', '缓存层');
    const database = createNode('db', '数据库');
    
    // 添加节点到图表
    [client, apiService, cacheLayer, database].forEach(node => {
        diagram.appendChild(node);
    });
    
    // 布局节点
    const centerX = diagram.offsetWidth / 2;
    const centerY = diagram.offsetHeight / 2;
    
    client.style.left = `${centerX - 50}px`;
    client.style.top = '60px';
    
    apiService.style.left = `${centerX - 50}px`;
    apiService.style.top = `${centerY - 100}px`;
    
    cacheLayer.style.left = `${centerX - 150}px`;
    cacheLayer.style.top = `${centerY}px`;
    
    database.style.left = `${centerX + 50}px`;
    database.style.top = `${centerY}px`;
    
    // 等待DOM更新，确保节点位置已生效
    await sleep(100);
    
    // 创建连接线
    const clientPos = getNodePosition(client);
    const apiPos = getNodePosition(apiService);
    const cachePos = getNodePosition(cacheLayer);
    const dbPos = getNodePosition(database);
    
    const clientToApi = drawLine(
        clientPos.x,
        clientPos.y,
        apiPos.x,
        apiPos.y
    );
    diagram.appendChild(clientToApi);
    
    const apiToCache = drawLine(
        apiPos.x,
        apiPos.y,
        cachePos.x,
        cachePos.y
    );
    diagram.appendChild(apiToCache);
    
    const apiToDb = drawLine(
        apiPos.x,
        apiPos.y,
        dbPos.x,
        dbPos.y
    );
    diagram.appendChild(apiToDb);
    
    // 添加缓存策略表格
    const strategies = [
        { strategy: '查询级缓存', benefit: '频繁访问的数据直接返回' },
        { strategy: '分层缓存', benefit: '本地、分布式缓存多层覆盖' },
        { strategy: '缓存预热', benefit: '提前加载热门排行榜数据' },
        { strategy: '缓存失效策略', benefit: '设置适当的TTL和更新策略' }
    ];
    
    const table = createElement('table', 'strategy-table');
    const thead = createElement('thead');
    const headerRow = createElement('tr');
    ['缓存策略', '优势'].forEach(text => {
        const th = createElement('th', '', text);
        headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    table.appendChild(thead);
    
    const tbody = createElement('tbody');
    strategies.forEach(({ strategy, benefit }) => {
        const tr = createElement('tr');
        tr.appendChild(createElement('td', 'strategy', strategy));
        tr.appendChild(createElement('td', '', benefit));
        tbody.appendChild(tr);
    });
    table.appendChild(tbody);
    
    diagram.appendChild(table);
    
    // 设置表格样式，使其不遮挡动态图像
    table.style.position = 'absolute';
    table.style.right = '10px';
    table.style.top = '10px';
    table.style.width = '300px';
    table.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
    table.style.zIndex = '5';
    
    // 缓存命中指示器
    const cacheHitIndicator = createElement('div', 'cache-indicator');
    cacheHitIndicator.textContent = '缓存状态';
    cacheHitIndicator.style.position = 'absolute';
    cacheHitIndicator.style.top = '10px';
    cacheHitIndicator.style.left = '10px';
    cacheHitIndicator.style.padding = '5px 10px';
    cacheHitIndicator.style.backgroundColor = '#95a5a6';
    cacheHitIndicator.style.color = 'white';
    cacheHitIndicator.style.borderRadius = '3px';
    diagram.appendChild(cacheHitIndicator);
    
    // 设置缓存状态
    function setCacheStatus(status) {
        let color, text;
        switch (status) {
            case 'hit':
                color = '#2ecc71';
                text = '缓存命中';
                break;
            case 'miss':
                color = '#e74c3c';
                text = '缓存未命中';
                break;
            case 'updating':
                color = '#f39c12';
                text = '缓存更新中';
                break;
            case 'idle':
                color = '#95a5a6';
                text = '缓存状态';
                break;
            default:
                color = '#95a5a6';
                text = '缓存状态';
        }
        cacheHitIndicator.style.backgroundColor = color;
        cacheHitIndicator.textContent = text;
    }
    
    // 初始化缓存状态
    setCacheStatus('idle');
    
    // 演示流程 - 缓存命中
    addLog(logContainer, '演示缓存命中场景');
    await activateNode(client);
    
    const queryMessage = createMessage('请求排行榜');
    diagram.appendChild(queryMessage);
    await animateMessage(queryMessage, client, apiService, 800);
    await activateNode(apiService);
    addLog(logContainer, 'API服务接收请求');
    
    const checkCacheMessage = createMessage('查询缓存');
    diagram.appendChild(checkCacheMessage);
    await animateMessage(checkCacheMessage, apiService, cacheLayer, 800);
    await activateNode(cacheLayer);
    
    setCacheStatus('hit');
    addLog(logContainer, '缓存命中，直接返回数据');
    await sleep(500);
    
    const cacheDataMessage = createMessage('返回缓存数据');
    diagram.appendChild(cacheDataMessage);
    await animateMessage(cacheDataMessage, cacheLayer, apiService, 800);
    await activateNode(apiService);
    
    const responseMessage = createMessage('返回排行榜');
    diagram.appendChild(responseMessage);
    await animateMessage(responseMessage, apiService, client, 800);
    await activateNode(client);
    addLog(logContainer, '客户端接收缓存的排行榜数据 (响应时间: 10ms)');
    
    // 演示缓存未命中
    await sleep(1000);
    setCacheStatus('idle');
    
    addLog(logContainer, '演示缓存未命中场景');
    await activateNode(client);
    
    const query2Message = createMessage('请求新排行榜');
    diagram.appendChild(query2Message);
    await animateMessage(query2Message, client, apiService, 800);
    await activateNode(apiService);
    addLog(logContainer, 'API服务接收请求');
    
    const checkCache2Message = createMessage('查询缓存');
    diagram.appendChild(checkCache2Message);
    await animateMessage(checkCache2Message, apiService, cacheLayer, 800);
    await activateNode(cacheLayer);
    
    setCacheStatus('miss');
    addLog(logContainer, '缓存未命中，需要查询数据库');
    await sleep(500);
    
    const dbQueryMessage = createMessage('查询数据库');
    diagram.appendChild(dbQueryMessage);
    await animateMessage(dbQueryMessage, apiService, database, 800);
    await activateNode(database);
    addLog(logContainer, '从数据库读取排行榜数据');
    await sleep(800);
    
    const dbResponseMessage = createMessage('返回数据');
    diagram.appendChild(dbResponseMessage);
    await animateMessage(dbResponseMessage, database, apiService, 800);
    await activateNode(apiService);
    
    // 更新缓存
    setCacheStatus('updating');
    const updateCacheMessage = createMessage('更新缓存');
    diagram.appendChild(updateCacheMessage);
    await animateMessage(updateCacheMessage, apiService, cacheLayer, 800);
    await activateNode(cacheLayer);
    addLog(logContainer, '更新缓存数据');
    setCacheStatus('hit');
    
    const response2Message = createMessage('返回排行榜');
    diagram.appendChild(response2Message);
    await animateMessage(response2Message, apiService, client, 800);
    await activateNode(client);
    addLog(logContainer, '客户端接收排行榜数据 (响应时间: 120ms)');
    
    addLog(logContainer, '演示完成: 缓存策略大幅提升排行榜查询性能，减轻数据库负担');
}

// 批量更新演示
async function initBatchUpdateDemo(diagram) {
    clearDiagram(diagram);
    
    // 创建日志容器
    const logContainer = createLogContainer();
    diagram.appendChild(logContainer);
    addLog(logContainer, '初始化批量更新演示');
    
    // 创建节点
    const gamers = [
        createNode('gamer1', '玩家 1'),
        createNode('gamer2', '玩家 2'),
        createNode('gamer3', '玩家 3')
    ];
    
    const batchProcessor = createNode('batch', '批处理器');
    const leaderboardService = createNode('service', '排行榜服务');
    const database = createNode('db', '数据库');
    
    // 添加节点到图表
    [...gamers, batchProcessor, leaderboardService, database].forEach(node => {
        diagram.appendChild(node);
    });
    
    // 布局节点
    const centerX = diagram.offsetWidth / 2;
    const centerY = diagram.offsetHeight / 2;
    
    // 玩家节点布局
    const gamerY = 60;
    for (let i = 0; i < gamers.length; i++) {
        const gamer = gamers[i];
        const offset = (i - (gamers.length - 1) / 2) * 120;
        gamer.style.left = `${centerX + offset}px`;
        gamer.style.top = `${gamerY}px`;
    }
    
    batchProcessor.style.left = `${centerX - 50}px`;
    batchProcessor.style.top = `${centerY - 70}px`;
    
    leaderboardService.style.left = `${centerX - 50}px`;
    leaderboardService.style.top = `${centerY + 30}px`;
    
    database.style.left = `${centerX - 50}px`;
    database.style.top = `${centerY + 130}px`;
    
    // 等待DOM更新，确保节点位置已生效
    await sleep(100);
    
    // 绘制连接线
    const batchPos = getNodePosition(batchProcessor);
    const servicePos = getNodePosition(leaderboardService);
    const dbPos = getNodePosition(database);
    
    // 玩家到批处理器的连接
    for (const gamer of gamers) {
        const gamerPos = getNodePosition(gamer);
        const line = drawLine(
            gamerPos.x,
            gamerPos.y,
            batchPos.x,
            batchPos.y
        );
        diagram.appendChild(line);
    }
    
    // 批处理器到排行榜服务的连接
    const batchToService = drawLine(
        batchPos.x,
        batchPos.y,
        servicePos.x,
        servicePos.y
    );
    diagram.appendChild(batchToService);
    
    // 排行榜服务到数据库的连接
    const serviceToDb = drawLine(
        servicePos.x,
        servicePos.y,
        dbPos.x,
        dbPos.y
    );
    diagram.appendChild(serviceToDb);
    
    // 创建批处理指示器
    const batchIndicator = createElement('div', 'batch-indicator');
    batchIndicator.innerHTML = '待处理: 0';
    batchIndicator.style.position = 'absolute';
    batchIndicator.style.top = '10px';
    batchIndicator.style.left = '10px';
    batchIndicator.style.padding = '5px 10px';
    batchIndicator.style.backgroundColor = '#3498db';
    batchIndicator.style.color = 'white';
    batchIndicator.style.borderRadius = '3px';
    batchIndicator.style.zIndex = '20';
    batchProcessor.appendChild(batchIndicator);
    
    let batchCount = 0;
    function updateBatchCount(delta) {
        batchCount += delta;
        batchIndicator.innerHTML = `待处理: ${batchCount}`;
        if (batchCount > 5) {
            batchIndicator.style.backgroundColor = '#e74c3c';
        } else if (batchCount > 0) {
            batchIndicator.style.backgroundColor = '#3498db';
        } else {
            batchIndicator.style.backgroundColor = '#95a5a6';
        }
    }
    
    // 添加优势表格
    const benefits = [
        { benefit: '减少数据库连接', description: '合并多个更新为一次操作' },
        { benefit: '事务优化', description: '单一事务处理多个更新' },
        { benefit: '网络效率', description: '减少网络往返次数' },
        { benefit: '资源消耗', description: '降低服务器和数据库负载' }
    ];
    
    const table = createElement('table', 'benefits-table');
    const thead = createElement('thead');
    const headerRow = createElement('tr');
    ['批量更新优势', '说明'].forEach(text => {
        const th = createElement('th', '', text);
        headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    table.appendChild(thead);
    
    const tbody = createElement('tbody');
    benefits.forEach(({ benefit, description }) => {
        const tr = createElement('tr');
        tr.appendChild(createElement('td', 'benefit', benefit));
        tr.appendChild(createElement('td', '', description));
        tbody.appendChild(tr);
    });
    table.appendChild(tbody);
    
    diagram.appendChild(table);
    
    // 设置表格样式，使其不遮挡动态图像
    table.style.position = 'absolute';
    table.style.right = '10px';
    table.style.top = '10px';
    table.style.width = '300px';
    table.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
    table.style.zIndex = '5';
    
    // 演示流程
    addLog(logContainer, '演示批量更新流程');
    
    // 玩家提交分数
    for (let i = 0; i < gamers.length; i++) {
        const gamer = gamers[i];
        await activateNode(gamer);
        
        const scoreMessage = createMessage(`得分: ${Math.floor(Math.random() * 1000)}`);
        diagram.appendChild(scoreMessage);
        await animateMessage(scoreMessage, gamer, batchProcessor, 600);
        await activateNode(batchProcessor);
        updateBatchCount(1);
        addLog(logContainer, `玩家 ${i+1} 提交新得分，加入批处理队列`);
        
        await sleep(300);
    }
    
    // 批量处理
    await sleep(800);
    addLog(logContainer, '触发批量处理 (已达到阈值或时间窗口)');
    
    const batchMessage = createMessage('批量更新');
    diagram.appendChild(batchMessage);
    await animateMessage(batchMessage, batchProcessor, leaderboardService, 800);
    updateBatchCount(-batchCount); // 清空批处理队列
    await activateNode(leaderboardService);
    
    addLog(logContainer, '排行榜服务接收批量更新请求');
    
    const dbUpdateMessage = createMessage('执行批量更新');
    diagram.appendChild(dbUpdateMessage);
    await animateMessage(dbUpdateMessage, leaderboardService, database, 800);
    await activateNode(database);
    
    addLog(logContainer, '数据库执行批量更新操作');
    await sleep(800);
    
    const dbResponseMessage = createMessage('更新成功');
    diagram.appendChild(dbResponseMessage);
    await animateMessage(dbResponseMessage, database, leaderboardService, 800);
    await activateNode(leaderboardService);
    
    addLog(logContainer, '排行榜更新完成, 一次更新处理了多个玩家的得分');
    
    // 对比指标
    const comparison = createElement('div', 'comparison');
    comparison.innerHTML = `
        <h3>性能对比</h3>
        <p>单次更新: 300ms × ${gamers.length} = ${300 * gamers.length}ms</p>
        <p>批量更新: 350ms (节省 ${Math.round((300 * gamers.length - 350) / (300 * gamers.length) * 100)}%)</p>
    `;
    comparison.style.position = 'absolute';
    comparison.style.bottom = '20px';
    comparison.style.left = '20px';
    comparison.style.padding = '10px';
    comparison.style.backgroundColor = 'rgba(52, 152, 219, 0.1)';
    comparison.style.border = '1px solid #3498db';
    comparison.style.borderRadius = '5px';
    
    diagram.appendChild(comparison);
    
    addLog(logContainer, '演示完成: 批量更新大幅提高排行榜更新效率，降低系统负载');
}

// 分片演示
async function initShardingDemo(diagram) {
    clearDiagram(diagram);
    
    // 创建日志容器
    const logContainer = createLogContainer();
    diagram.appendChild(logContainer);
    addLog(logContainer, '初始化分片演示');
    
    // 创建节点
    const client = createNode('client', '客户端');
    const router = createNode('router', '分片路由');
    const shards = [
        createNode('shard1', '分片 1 (A-F)'),
        createNode('shard2', '分片 2 (G-M)'),
        createNode('shard3', '分片 3 (N-T)'),
        createNode('shard4', '分片 4 (U-Z)')
    ];
    
    // 添加节点到图表
    [client, router, ...shards].forEach(node => {
        diagram.appendChild(node);
    });
    
    // 布局节点
    const centerX = diagram.offsetWidth / 2;
    const centerY = diagram.offsetHeight / 2;
    
    client.style.left = `${centerX - 50}px`;
    client.style.top = '60px';
    
    router.style.left = `${centerX - 50}px`;
    router.style.top = `${centerY - 70}px`;
    
    // 分片节点布局 - 网格布局
    const shardWidth = 120;
    const shardHeight = 80;
    const cols = 2;
    const spacing = 40;
    
    for (let i = 0; i < shards.length; i++) {
        const row = Math.floor(i / cols);
        const col = i % cols;
        const x = centerX - (shardWidth + spacing) * (cols / 2 - 0.5) + col * (shardWidth + spacing);
        const y = centerY + 20 + row * (shardHeight + spacing);
        
        shards[i].style.left = `${x}px`;
        shards[i].style.top = `${y}px`;
    }
    
    // 等待DOM更新，确保节点位置已生效
    await sleep(100);
    
    // 绘制连接线
    const clientPos = getNodePosition(client);
    const routerPos = getNodePosition(router);
    
    // 客户端到路由的连接
    const clientToRouter = drawLine(
        clientPos.x,
        clientPos.y,
        routerPos.x,
        routerPos.y
    );
    diagram.appendChild(clientToRouter);
    
    // 路由到分片的连接
    for (const shard of shards) {
        const shardPos = getNodePosition(shard);
        const line = drawLine(
            routerPos.x,
            routerPos.y,
            shardPos.x,
            shardPos.y
        );
        diagram.appendChild(line);
    }
    
    // 添加分片策略表格
    const strategies = [
        { strategy: '按玩家ID', description: '基于玩家ID哈希值分配到不同分片' },
        { strategy: '按地区/服务器', description: '不同地区/服务器的排行榜分别存储' },
        { strategy: '按时间周期', description: '不同时间周期(日/周/月)的排行榜分开存储' },
        { strategy: '按首字母', description: '按玩家名称首字母分片(如演示所示)' }
    ];
    
    const table = createElement('table', 'strategy-table');
    const thead = createElement('thead');
    const headerRow = createElement('tr');
    ['分片策略', '说明'].forEach(text => {
        const th = createElement('th', '', text);
        headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    table.appendChild(thead);
    
    const tbody = createElement('tbody');
    strategies.forEach(({ strategy, description }) => {
        const tr = createElement('tr');
        tr.appendChild(createElement('td', 'strategy', strategy));
        tr.appendChild(createElement('td', '', description));
        tbody.appendChild(tr);
    });
    table.appendChild(tbody);
    
    diagram.appendChild(table);
    
    // 设置表格样式，使其不遮挡动态图像
    table.style.position = 'absolute';
    table.style.right = '10px';
    table.style.top = '10px';
    table.style.width = '300px';
    table.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
    table.style.zIndex = '5';
    
    // 创建活跃分片指示器
    function highlightShard(index) {
        shards.forEach((shard, i) => {
            if (index === -1 || i !== index) {
                shard.classList.remove('active-shard');
            } else {
                shard.classList.add('active-shard');
            }
        });
    }
    
    // 初始状态：清除所有高亮
    highlightShard(-1);
    
    // 演示流程
    addLog(logContainer, '演示分片查询流程');
    await activateNode(client);
    
    // 查询示例1 - 玩家 "Alice"
    const query1Message = createMessage('查询: Alice');
    diagram.appendChild(query1Message);
    await animateMessage(query1Message, client, router, 800);
    await activateNode(router);
    addLog(logContainer, '分片路由计算: Alice 首字母 A → 分片1');
    
    const route1Message = createMessage('路由到分片1');
    diagram.appendChild(route1Message);
    await animateMessage(route1Message, router, shards[0], 800);
    highlightShard(0);
    await activateNode(shards[0]);
    addLog(logContainer, '在分片1查询 Alice 的排名');
    await sleep(500);
    
    const response1Message = createMessage('返回排名');
    diagram.appendChild(response1Message);
    await animateMessage(response1Message, shards[0], router, 800);
    await activateNode(router);
    
    const clientResponse1 = createMessage('Alice: 排名 #42');
    diagram.appendChild(clientResponse1);
    await animateMessage(clientResponse1, router, client, 800);
    await activateNode(client);
    addLog(logContainer, '客户端接收 Alice 的排名结果');
    
    await sleep(800);
    highlightShard(-1); // 清除高亮
    
    // 查询示例2 - 玩家 "Zhang"
    const query2Message = createMessage('查询: Zhang');
    diagram.appendChild(query2Message);
    await animateMessage(query2Message, client, router, 800);
    await activateNode(router);
    addLog(logContainer, '分片路由计算: Zhang 首字母 Z → 分片4');
    
    const route2Message = createMessage('路由到分片4');
    diagram.appendChild(route2Message);
    await animateMessage(route2Message, router, shards[3], 800);
    highlightShard(3);
    await activateNode(shards[3]);
    addLog(logContainer, '在分片4查询 Zhang 的排名');
    await sleep(500);
    
    const response2Message = createMessage('返回排名');
    diagram.appendChild(response2Message);
    await animateMessage(response2Message, shards[3], router, 800);
    await activateNode(router);
    
    const clientResponse2 = createMessage('Zhang: 排名 #7');
    diagram.appendChild(clientResponse2);
    await animateMessage(clientResponse2, router, client, 800);
    await activateNode(client);
    addLog(logContainer, '客户端接收 Zhang 的排名结果');
    
    await sleep(800);
    highlightShard(-1); // 清除高亮
    
    // 全球榜单查询
    addLog(logContainer, '演示全球榜单查询 (跨分片)');
    
    const globalQueryMessage = createMessage('查询: 全球榜单');
    diagram.appendChild(globalQueryMessage);
    await animateMessage(globalQueryMessage, client, router, 800);
    await activateNode(router);
    addLog(logContainer, '分片路由识别为全球榜单查询，需要聚合所有分片数据');
    
    // 并行查询所有分片
    const queryPromises = [];
    for (let i = 0; i < shards.length; i++) {
        const shard = shards[i];
        const shardQueryMessage = createMessage('查询分片数据');
        diagram.appendChild(shardQueryMessage);
        queryPromises.push(
            (async () => {
                await animateMessage(shardQueryMessage, router, shard, 600);
                highlightShard(i);
                await activateNode(shard);
                await sleep(300 + Math.random() * 200); // 模拟不同分片的处理时间
                
                const shardResponseMessage = createMessage('返回分片数据');
                diagram.appendChild(shardResponseMessage);
                await animateMessage(shardResponseMessage, shard, router, 600);
            })()
        );
    }
    
    await Promise.all(queryPromises);
    await activateNode(router);
    addLog(logContainer, '分片路由聚合所有分片数据，合并排行榜');
    highlightShard(-1); // 清除高亮
    await sleep(800);
    
    const globalResponseMessage = createMessage('返回全球榜单');
    diagram.appendChild(globalResponseMessage);
    await animateMessage(globalResponseMessage, router, client, 800);
    await activateNode(client);
    addLog(logContainer, '客户端接收全球榜单数据');
    
    // 性能指标
    const metrics = createElement('div', 'metrics');
    metrics.innerHTML = `
        <h3>分片性能优势</h3>
        <p>读取延迟: ↓60%</p>
        <p>写入吞吐量: ↑400%</p>
        <p>数据库负载: 均衡分布</p>
        <p>存储容量: 线性扩展</p>
    `;
    metrics.style.position = 'absolute';
    metrics.style.bottom = '20px';
    metrics.style.right = '20px';
    metrics.style.padding = '10px';
    metrics.style.backgroundColor = 'rgba(46, 204, 113, 0.1)';
    metrics.style.border = '1px solid #2ecc71';
    metrics.style.borderRadius = '5px';
    
    diagram.appendChild(metrics);
    
    addLog(logContainer, '演示完成: 分片策略大幅提高排行榜系统的扩展性和性能');
} 