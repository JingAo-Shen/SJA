// Redis ZSet方案演示
async function initRedisZSetDemo(diagram) {
    clearDiagram(diagram);
    
    // 创建日志容器
    const logContainer = createLogContainer();
    diagram.appendChild(logContainer);
    
    // 创建节点
    const client = createNode('client', '客户端');
    const api = createNode('api', 'API服务');
    const redis = createNode('redis', 'Redis ZSet');
    
    // 添加节点到图表
    [client, api, redis].forEach(node => {
        diagram.appendChild(node);
    });
    
    // 布局节点
    const centerX = diagram.offsetWidth / 2;
    const centerY = diagram.offsetHeight / 2;
    
    client.style.left = `${centerX - 150}px`;
    client.style.top = '50px';
    
    api.style.left = `${centerX - 50}px`;
    api.style.top = `${centerY}px`;
    
    redis.style.left = `${centerX + 100}px`;
    redis.style.top = `${centerY}px`;
    
    // 创建连接线
    const connections = [
        [client, api],
        [api, redis]
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
    
    addLog(logContainer, '初始化Redis ZSet排行榜演示');
    
    // 演示ZSet操作
    // 添加分数
    await activateNode(client);
    const scoreMessage = createMessage('ZADD score 100 user1');
    diagram.appendChild(scoreMessage);
    await animateMessage(scoreMessage, client, api);
    addLog(logContainer, '添加用户分数');
    
    await activateNode(api);
    const zaddMessage = createMessage('ZADD');
    diagram.appendChild(zaddMessage);
    await animateMessage(zaddMessage, api, redis);
    await activateNode(redis);
    addLog(logContainer, 'Redis执行ZADD命令');
    
    // 查询排名
    await sleep(500);
    const rankMessage = createMessage('ZREVRANK');
    diagram.appendChild(rankMessage);
    await animateMessage(rankMessage, api, redis);
    await activateNode(redis);
    addLog(logContainer, '查询用户排名');
    
    // 返回结果
    const responseMessage = createMessage('排名: 1');
    diagram.appendChild(responseMessage);
    await animateMessage(responseMessage, api, client);
    await activateNode(client);
    addLog(logContainer, '返回用户排名信息');
    
    // 展示ZSet命令
    const commands = [
        { command: 'ZADD leaderboard 100 user1', description: '添加分数' },
        { command: 'ZINCRBY leaderboard 10 user1', description: '增加分数' },
        { command: 'ZREVRANK leaderboard user1', description: '查询排名' },
        { command: 'ZREVRANGE leaderboard 0 9', description: '获取前10名' },
        { command: 'ZREVRANGEBYSCORE leaderboard +inf -inf', description: '按分数范围查询' }
    ];
    
    const table = createElement('table', 'command-table');
    const thead = createElement('thead');
    const headerRow = createElement('tr');
    ['命令', '说明'].forEach(text => {
        const th = createElement('th', '', text);
        headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    table.appendChild(thead);
    
    const tbody = createElement('tbody');
    commands.forEach(({ command, description }) => {
        const tr = createElement('tr');
        tr.appendChild(createElement('td', 'command', command));
        tr.appendChild(createElement('td', '', description));
        tbody.appendChild(tr);
    });
    table.appendChild(tbody);
    
    diagram.appendChild(table);
    addLog(logContainer, '显示Redis ZSet常用命令');
}

// MySQL方案演示
async function initMySQLDemo(diagram) {
    clearDiagram(diagram);
    
    // 创建日志容器
    const logContainer = createLogContainer();
    diagram.appendChild(logContainer);
    
    // 创建节点
    const client = createNode('client', '客户端');
    const api = createNode('api', 'API服务');
    const mysql = createNode('mysql', 'MySQL');
    const cache = createNode('cache', '查询缓存');
    
    // 添加节点到图表
    [client, api, mysql, cache].forEach(node => {
        diagram.appendChild(node);
    });
    
    // 布局节点
    const centerX = diagram.offsetWidth / 2;
    const centerY = diagram.offsetHeight / 2;
    
    client.style.left = `${centerX - 150}px`;
    client.style.top = '50px';
    
    api.style.left = `${centerX - 50}px`;
    api.style.top = `${centerY - 50}px`;
    
    mysql.style.left = `${centerX + 100}px`;
    mysql.style.top = `${centerY - 50}px`;
    
    cache.style.left = `${centerX + 50}px`;
    cache.style.top = `${centerY + 100}px`;
    
    // 创建连接线
    const connections = [
        [client, api],
        [api, mysql],
        [api, cache],
        [mysql, cache]
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
    
    addLog(logContainer, '初始化MySQL排行榜演示');
    
    // 演示MySQL操作
    // 更新分数
    await activateNode(client);
    const updateMessage = createMessage('更新分数');
    diagram.appendChild(updateMessage);
    await animateMessage(updateMessage, client, api);
    addLog(logContainer, '请求更新用户分数');
    
    // 执行SQL更新
    await activateNode(api);
    const sqlMessage = createMessage('UPDATE scores');
    diagram.appendChild(sqlMessage);
    await animateMessage(sqlMessage, api, mysql);
    await activateNode(mysql);
    addLog(logContainer, '执行分数更新SQL');
    
    // 清除缓存
    const invalidateMessage = createMessage('清除缓存');
    diagram.appendChild(invalidateMessage);
    await animateMessage(invalidateMessage, api, cache);
    await activateNode(cache);
    addLog(logContainer, '清除相关排行榜缓存');
    
    // 查询新排名
    await sleep(500);
    const rankMessage = createMessage('SELECT排名');
    diagram.appendChild(rankMessage);
    await animateMessage(rankMessage, api, mysql);
    await activateNode(mysql);
    addLog(logContainer, '查询最新排名');
    
    // 更新缓存
    const cacheMessage = createMessage('更新缓存');
    diagram.appendChild(cacheMessage);
    await animateMessage(cacheMessage, api, cache);
    await activateNode(cache);
    addLog(logContainer, '更新排行榜缓存');
    
    // 返回结果
    const responseMessage = createMessage('返回排名');
    diagram.appendChild(responseMessage);
    await animateMessage(responseMessage, api, client);
    await activateNode(client);
    addLog(logContainer, '返回最新排名信息');
    
    // 展示SQL语句
    const sqlStatements = [
        { sql: 'CREATE TABLE scores (user_id INT, score INT, updated_at TIMESTAMP)', description: '创建分数表' },
        { sql: 'UPDATE scores SET score = score + 10 WHERE user_id = ?', description: '更新分数' },
        { sql: 'SELECT *, RANK() OVER (ORDER BY score DESC) as rank FROM scores', description: '计算排名' },
        { sql: 'SELECT * FROM scores ORDER BY score DESC LIMIT 10', description: '获取前10名' },
        { sql: 'CREATE INDEX idx_score ON scores (score DESC)', description: '优化索引' }
    ];
    
    const table = createElement('table', 'sql-table');
    const thead = createElement('thead');
    const headerRow = createElement('tr');
    ['SQL语句', '说明'].forEach(text => {
        const th = createElement('th', '', text);
        headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    table.appendChild(thead);
    
    const tbody = createElement('tbody');
    sqlStatements.forEach(({ sql, description }) => {
        const tr = createElement('tr');
        tr.appendChild(createElement('td', 'sql', sql));
        tr.appendChild(createElement('td', '', description));
        tbody.appendChild(tr);
    });
    table.appendChild(tbody);
    
    diagram.appendChild(table);
    addLog(logContainer, '显示MySQL排行榜相关SQL');
}

// 混合存储方案演示
async function initHybridDemo(diagram) {
    clearDiagram(diagram);
    
    // 创建日志容器
    const logContainer = createLogContainer();
    diagram.appendChild(logContainer);
    
    // 创建节点
    const client = createNode('client', '客户端');
    const api = createNode('api', 'API服务');
    const redis = createNode('redis', 'Redis');
    const mysql = createNode('mysql', 'MySQL');
    const sync = createNode('sync', '同步服务');
    
    // 添加节点到图表
    [client, api, redis, mysql, sync].forEach(node => {
        diagram.appendChild(node);
    });
    
    // 布局节点
    const centerX = diagram.offsetWidth / 2;
    const centerY = diagram.offsetHeight / 2;
    
    arrangeNodesInCircle([client, api, redis, mysql, sync], centerX, centerY, 150);
    
    // 创建连接线
    const nodes = [client, api, redis, mysql, sync];
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
    
    addLog(logContainer, '初始化混合存储方案演示');
    
    // 演示混合存储流程
    // 写入流程
    await activateNode(client);
    const scoreMessage = createMessage('提交分数');
    diagram.appendChild(scoreMessage);
    await animateMessage(scoreMessage, client, api);
    addLog(logContainer, '用户提交新的分数');
    
    // 更新Redis
    await activateNode(api);
    const redisMessage = createMessage('更新Redis');
    diagram.appendChild(redisMessage);
    await animateMessage(redisMessage, api, redis);
    await activateNode(redis);
    addLog(logContainer, '实时更新Redis排行榜');
    
    // 异步同步到MySQL
    const syncMessage = createMessage('同步数据');
    diagram.appendChild(syncMessage);
    await animateMessage(syncMessage, redis, sync);
    await activateNode(sync);
    addLog(logContainer, '触发数据同步');
    
    const mysqlMessage = createMessage('持久化');
    diagram.appendChild(mysqlMessage);
    await animateMessage(mysqlMessage, sync, mysql);
    await activateNode(mysql);
    addLog(logContainer, '将数据持久化到MySQL');
    
    // 读取流程
    await sleep(500);
    const queryMessage = createMessage('查询排行榜');
    diagram.appendChild(queryMessage);
    await animateMessage(queryMessage, client, api);
    addLog(logContainer, '客户端查询排行榜');
    
    // 从Redis读取
    const readMessage = createMessage('读取数据');
    diagram.appendChild(readMessage);
    await animateMessage(readMessage, api, redis);
    await activateNode(redis);
    addLog(logContainer, '从Redis读取排行榜数据');
    
    // 返回结果
    const responseMessage = createMessage('返回数据');
    diagram.appendChild(responseMessage);
    await animateMessage(responseMessage, api, client);
    await activateNode(client);
    addLog(logContainer, '返回排行榜数据到客户端');
    
    // 展示架构特点
    const features = [
        { feature: '实时性', description: '使用Redis保证实时更新和查询' },
        { feature: '持久性', description: 'MySQL提供可靠的数据持久化' },
        { feature: '一致性', description: '通过同步服务确保数据一致' },
        { feature: '性能', description: '读写分离，优化访问性能' },
        { feature: '可靠性', description: '双重存储，互为备份' }
    ];
    
    const table = createElement('table', 'feature-table');
    const thead = createElement('thead');
    const headerRow = createElement('tr');
    ['特点', '说明'].forEach(text => {
        const th = createElement('th', '', text);
        headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    table.appendChild(thead);
    
    const tbody = createElement('tbody');
    features.forEach(({ feature, description }) => {
        const tr = createElement('tr');
        tr.appendChild(createElement('td', 'feature', feature));
        tr.appendChild(createElement('td', '', description));
        tbody.appendChild(tr);
    });
    table.appendChild(tbody);
    
    diagram.appendChild(table);
    addLog(logContainer, '显示混合存储方案特点');
} 