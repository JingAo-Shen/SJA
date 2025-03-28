// 工具函数
function createElement(type, className, text) {
    const element = document.createElement(type);
    if (className) {
        element.className = className;
    }
    if (text) {
        element.textContent = text;
    }
    return element;
}

function createNode(id, text, type = '') {
    const node = createElement('div', `node ${type}`, text);
    node.id = id;
    return node;
}

function createMessage(text, type = '') {
    const message = createElement('div', `message ${type}`, text);
    return message;
}

function drawLine(x1, y1, x2, y2, id = '', type = '') {
    const length = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
    const angle = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;
    
    const line = createElement('div', `line ${type}`);
    line.style.width = `${length}px`;
    line.style.left = `${x1}px`;
    line.style.top = `${y1}px`;
    line.style.transform = `rotate(${angle}deg)`;
    
    if (id) {
        line.id = id;
    }
    
    return line;
}

function addLog(logContainer, message, type = 'info') {
    if (!logContainer) {
        console.warn('日志容器不存在', message);
        return;
    }
    const logEntry = createElement('div', `log-entry ${type}`, message);
    logContainer.appendChild(logEntry);
    logContainer.scrollTop = logContainer.scrollHeight;
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function getNodePosition(node) {
    const rect = node.getBoundingClientRect();
    const containerRect = node.parentElement.getBoundingClientRect();
    return {
        x: rect.left - containerRect.left + rect.width / 2,
        y: rect.top - containerRect.top + rect.height / 2
    };
}

function clearDiagram(diagram) {
    while (diagram.firstChild) {
        diagram.removeChild(diagram.firstChild);
    }
}

function createLogContainer() {
    return createElement('div', 'log-container');
}

// 动画效果
async function animateMessage(message, startNode, endNode, duration = 1000) {
    const start = getNodePosition(startNode);
    const end = getNodePosition(endNode);
    
    message.style.left = `${start.x}px`;
    message.style.top = `${start.y}px`;
    
    await sleep(100); // 等待DOM更新
    
    message.style.transition = `all ${duration}ms ease`;
    message.style.left = `${end.x}px`;
    message.style.top = `${end.y}px`;
    
    await sleep(duration);
    message.remove();
}

async function activateNode(node, duration = 500) {
    node.classList.add('active');
    await sleep(duration);
    node.classList.remove('active');
}

async function activateLine(line, duration = 500) {
    line.classList.add('active');
    await sleep(duration);
    line.classList.remove('active');
}

// 布局函数
function arrangeNodesInCircle(nodes, centerX, centerY, radius) {
    const angleStep = (2 * Math.PI) / nodes.length;
    nodes.forEach((node, index) => {
        const angle = angleStep * index;
        const x = centerX + radius * Math.cos(angle) - node.offsetWidth / 2;
        const y = centerY + radius * Math.sin(angle) - node.offsetHeight / 2;
        node.style.left = `${x}px`;
        node.style.top = `${y}px`;
    });
    
    // 给DOM一点时间更新位置
    return new Promise(resolve => setTimeout(resolve, 50));
}

function arrangeNodesInGrid(nodes, containerWidth, containerHeight, rows, cols) {
    const cellWidth = containerWidth / cols;
    const cellHeight = containerHeight / rows;
    
    nodes.forEach((node, index) => {
        const row = Math.floor(index / cols);
        const col = index % cols;
        const x = col * cellWidth + (cellWidth - node.offsetWidth) / 2;
        const y = row * cellHeight + (cellHeight - node.offsetHeight) / 2;
        node.style.left = `${x}px`;
        node.style.top = `${y}px`;
    });
    
    // 给DOM一点时间更新位置
    return new Promise(resolve => setTimeout(resolve, 50));
}

// 基本架构演示
async function initBasicArchitectureDemo(diagram) {
    clearDiagram(diagram);
    
    // 创建日志容器
    const logContainer = createLogContainer();
    diagram.appendChild(logContainer);
    addLog(logContainer, '初始化基本分布式架构演示');
    
    // 创建节点
    const client = createNode('client', '客户端');
    const loadBalancer = createNode('load-balancer', '负载均衡');
    const server1 = createNode('server1', '服务器 1');
    const server2 = createNode('server2', '服务器 2');
    const database = createNode('database', '数据库');
    
    // 添加节点到图表
    [client, loadBalancer, server1, server2, database].forEach(node => {
        diagram.appendChild(node);
    });
    
    // 布局节点
    const centerX = diagram.offsetWidth / 2;
    const centerY = diagram.offsetHeight / 2;
    
    client.style.left = `${centerX - 50}px`;
    client.style.top = '50px';
    
    loadBalancer.style.left = `${centerX - 50}px`;
    loadBalancer.style.top = `${centerY - 80}px`;
    
    server1.style.left = `${centerX - 120}px`;
    server1.style.top = `${centerY}px`;
    
    server2.style.left = `${centerX + 20}px`;
    server2.style.top = `${centerY}px`;
    
    database.style.left = `${centerX - 50}px`;
    database.style.top = `${centerY + 100}px`;
    
    // 等待DOM更新，确保节点位置已生效
    await sleep(100);
    
    // 创建连接线
    const clientPos = getNodePosition(client);
    const lbPos = getNodePosition(loadBalancer);
    const server1Pos = getNodePosition(server1);
    const server2Pos = getNodePosition(server2);
    const dbPos = getNodePosition(database);
    
    // 客户端到负载均衡
    const clientToLB = drawLine(
        clientPos.x,
        clientPos.y,
        lbPos.x,
        lbPos.y
    );
    diagram.appendChild(clientToLB);
    
    // 负载均衡到服务器1
    const lbToServer1 = drawLine(
        lbPos.x,
        lbPos.y,
        server1Pos.x,
        server1Pos.y
    );
    diagram.appendChild(lbToServer1);
    
    // 负载均衡到服务器2
    const lbToServer2 = drawLine(
        lbPos.x,
        lbPos.y,
        server2Pos.x,
        server2Pos.y
    );
    diagram.appendChild(lbToServer2);
    
    // 服务器1到数据库
    const server1ToDb = drawLine(
        server1Pos.x,
        server1Pos.y,
        dbPos.x,
        dbPos.y
    );
    diagram.appendChild(server1ToDb);
    
    // 服务器2到数据库
    const server2ToDb = drawLine(
        server2Pos.x,
        server2Pos.y,
        dbPos.x,
        dbPos.y
    );
    diagram.appendChild(server2ToDb);
    
    // 创建基本架构说明表格
    const features = [
        { feature: '负载均衡', description: '分发流量到多个后端服务器' },
        { feature: '服务节点', description: '处理业务逻辑的多个服务器' },
        { feature: '共享存储', description: '提供统一的数据存储层' },
        { feature: '水平扩展', description: '能够通过增加节点提高处理能力' }
    ];
    
    const table = createElement('table', 'feature-table');
    const thead = createElement('thead');
    const headerRow = createElement('tr');
    ['组件', '功能'].forEach(text => {
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
    
    // 设置表格样式，使其不遮挡动态图像
    table.style.position = 'absolute';
    table.style.right = '10px';
    table.style.top = '10px';
    table.style.width = '300px';
    table.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
    table.style.zIndex = '5';
    
    // 演示请求流程
    addLog(logContainer, '演示分布式系统中的请求流程');
    await activateNode(client);
    
    for (let i = 0; i < 3; i++) {
        // 客户端发送请求
        const requestMessage = createMessage('请求');
        diagram.appendChild(requestMessage);
        await animateMessage(requestMessage, client, loadBalancer, 800);
        await activateNode(loadBalancer);
        addLog(logContainer, '负载均衡器接收客户端请求');
        
        // 确定要路由的服务器
        const targetServer = i % 2 === 0 ? server1 : server2;
        const targetServerPos = i % 2 === 0 ? server1Pos : server2Pos;
        const targetLine = i % 2 === 0 ? lbToServer1 : lbToServer2;
        
        addLog(logContainer, `负载均衡器将请求路由到${targetServer.textContent}`);
        await activateLine(targetLine, 500);
        
        const routeMessage = createMessage('路由请求');
        diagram.appendChild(routeMessage);
        await animateMessage(routeMessage, loadBalancer, targetServer, 800);
        await activateNode(targetServer);
        addLog(logContainer, `${targetServer.textContent}处理请求`);
        
        // 数据库查询
        const dbLine = i % 2 === 0 ? server1ToDb : server2ToDb;
        const dbQueryMessage = createMessage('查询数据');
        diagram.appendChild(dbQueryMessage);
        await animateMessage(dbQueryMessage, targetServer, database, 800);
        await activateNode(database);
        addLog(logContainer, '数据库处理查询');
        
        const dbResponseMessage = createMessage('返回数据');
        diagram.appendChild(dbResponseMessage);
        await animateMessage(dbResponseMessage, database, targetServer, 800);
        await activateNode(targetServer);
        
        // 返回响应给客户端
        const serviceResponse = createMessage('响应');
        diagram.appendChild(serviceResponse);
        await animateMessage(serviceResponse, targetServer, loadBalancer, 800);
        await activateNode(loadBalancer);
        
        const clientResponse = createMessage('响应');
        diagram.appendChild(clientResponse);
        await animateMessage(clientResponse, loadBalancer, client, 800);
        await activateNode(client);
        addLog(logContainer, '客户端接收响应');
        
        await sleep(800);
    }
    
    addLog(logContainer, '基本分布式架构演示完成');
}

// 可扩展性演示
async function initScalabilityDemo(diagram) {
    clearDiagram(diagram);
    
    // 创建日志容器
    const logContainer = createLogContainer();
    diagram.appendChild(logContainer);
    addLog(logContainer, '初始化可扩展性演示');
    
    // 创建节点
    const loadBalancer = createNode('load-balancer', '负载均衡');
    const servers = [
        createNode('server1', '服务器 1'),
        createNode('server2', '服务器 2')
    ];
    const clients = [
        createNode('client1', '客户端 1'),
        createNode('client2', '客户端 2')
    ];
    
    // 添加节点到图表
    [loadBalancer, ...servers, ...clients].forEach(node => {
        diagram.appendChild(node);
    });
    
    // 布局节点
    const centerX = diagram.offsetWidth / 2;
    const centerY = diagram.offsetHeight / 2;
    
    loadBalancer.style.left = `${centerX - 50}px`;
    loadBalancer.style.top = `${centerY}px`;
    
    // 布局服务器
    for (let i = 0; i < servers.length; i++) {
        servers[i].style.left = `${centerX - 100 + i * 150}px`;
        servers[i].style.top = `${centerY + 120}px`;
    }
    
    // 布局客户端
    for (let i = 0; i < clients.length; i++) {
        clients[i].style.left = `${centerX - 100 + i * 200}px`;
        clients[i].style.top = `${centerY - 120}px`;
    }
    
    // 等待DOM更新，确保节点位置已生效
    await sleep(100);
    
    // 创建连接线
    const loadBalancerPos = getNodePosition(loadBalancer);
    
    // 客户端到负载均衡器的连接
    clients.forEach(client => {
        const clientPos = getNodePosition(client);
        const line = drawLine(
            clientPos.x,
            clientPos.y,
            loadBalancerPos.x,
            loadBalancerPos.y
        );
        diagram.appendChild(line);
    });
    
    // 负载均衡器到服务器的连接
    servers.forEach(server => {
        const serverPos = getNodePosition(server);
        const line = drawLine(
            loadBalancerPos.x,
            loadBalancerPos.y,
            serverPos.x,
            serverPos.y
        );
        diagram.appendChild(line);
    });
    
    // 演示初始负载
    for (let i = 0; i < 3; i++) {
        const client = clients[i % clients.length];
        await activateNode(client);
        addLog(logContainer, `客户端 ${i % clients.length + 1} 发送请求`);
        
        const requestMessage = createMessage('请求');
        diagram.appendChild(requestMessage);
        await animateMessage(requestMessage, client, loadBalancer);
        await activateNode(loadBalancer);
        
        // 路由到服务器
        const serverIndex = i % servers.length;
        const server = servers[serverIndex];
        addLog(logContainer, `负载均衡器将请求分发到服务器 ${serverIndex + 1}`);
        
        const routeMessage = createMessage('路由请求');
        diagram.appendChild(routeMessage);
        await animateMessage(routeMessage, loadBalancer, server);
        await activateNode(server);
        addLog(logContainer, `服务器 ${serverIndex + 1} 处理请求`);
        
        await sleep(300);
    }
    
    // 添加新服务器（水平扩展）
    addLog(logContainer, '负载增加，需要水平扩展');
    const newServer = createNode('server3', '服务器 3');
    diagram.appendChild(newServer);
    newServer.style.left = `${centerX + 50}px`;
    newServer.style.top = `${centerY + 120}px`;
    servers.push(newServer);
    
    await sleep(100);
    
    // 连接新服务器
    const newServerPos = getNodePosition(newServer);
    const newLine = drawLine(
        loadBalancerPos.x,
        loadBalancerPos.y,
        newServerPos.x,
        newServerPos.y
    );
    diagram.appendChild(newLine);
    addLog(logContainer, '新增服务器加入集群');
    
    // 继续演示负载均衡
    for (let i = 0; i < 3; i++) {
        const client = clients[i % clients.length];
        await activateNode(client);
        addLog(logContainer, `客户端 ${i % clients.length + 1} 发送请求`);
        
        const requestMessage = createMessage('请求');
        diagram.appendChild(requestMessage);
        await animateMessage(requestMessage, client, loadBalancer);
        await activateNode(loadBalancer);
        
        // 路由到服务器，包括新服务器
        const serverIndex = i % servers.length;
        const server = servers[serverIndex];
        addLog(logContainer, `负载均衡器将请求分发到服务器 ${serverIndex + 1}`);
        
        const routeMessage = createMessage('路由请求');
        diagram.appendChild(routeMessage);
        await animateMessage(routeMessage, loadBalancer, server);
        await activateNode(server);
        addLog(logContainer, `服务器 ${serverIndex + 1} 处理请求`);
        
        await sleep(300);
    }
    
    // 显示可扩展性特性
    const features = [
        { feature: '水平扩展', description: '增加更多节点以提高系统容量' },
        { feature: '垂直扩展', description: '提升单个节点的硬件性能' },
        { feature: '自动伸缩', description: '根据负载自动调整资源' },
        { feature: '无状态设计', description: '便于系统扩展的关键设计原则' }
    ];
    
    const table = createElement('table', 'feature-table');
    const thead = createElement('thead');
    const headerRow = createElement('tr');
    ['扩展类型', '说明'].forEach(text => {
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
    addLog(logContainer, '展示可扩展性特性');
}

// 可靠性演示
async function initReliabilityDemo(diagram) {
    clearDiagram(diagram);
    
    // 创建日志容器
    const logContainer = createLogContainer();
    diagram.appendChild(logContainer);
    addLog(logContainer, '初始化可靠性演示');
    
    // 创建节点
    const client = createNode('client', '客户端');
    const loadBalancer = createNode('load-balancer', '负载均衡');
    const servers = [
        createNode('server1', '主服务器'),
        createNode('server2', '备份服务器')
    ];
    const database = createNode('database', '数据库');
    
    // 添加节点到图表
    [client, loadBalancer, ...servers, database].forEach(node => {
        diagram.appendChild(node);
    });
    
    // 布局节点
    const centerX = diagram.offsetWidth / 2;
    const centerY = diagram.offsetHeight / 2;
    
    client.style.left = `${centerX - 50}px`;
    client.style.top = '50px';
    
    loadBalancer.style.left = `${centerX - 50}px`;
    loadBalancer.style.top = `${centerY - 80}px`;
    
    // 布局服务器
    servers[0].style.left = `${centerX - 120}px`;
    servers[0].style.top = `${centerY}px`;
    
    servers[1].style.left = `${centerX + 20}px`;
    servers[1].style.top = `${centerY}px`;
    
    database.style.left = `${centerX - 50}px`;
    database.style.top = `${centerY + 100}px`;
    
    // 等待DOM更新，确保节点位置已生效
    await sleep(100);
    
    // 创建连接线
    const clientPos = getNodePosition(client);
    const lbPos = getNodePosition(loadBalancer);
    const server1Pos = getNodePosition(servers[0]);
    const server2Pos = getNodePosition(servers[1]);
    const dbPos = getNodePosition(database);
    
    // 客户端到负载均衡
    const clientToLB = drawLine(
        clientPos.x,
        clientPos.y,
        lbPos.x,
        lbPos.y
    );
    diagram.appendChild(clientToLB);
    
    // 负载均衡到服务器
    servers.forEach(server => {
        const serverPos = getNodePosition(server);
        const line = drawLine(
            lbPos.x,
            lbPos.y,
            serverPos.x,
            serverPos.y
        );
        diagram.appendChild(line);
    });
    
    // 服务器到数据库
    servers.forEach(server => {
        const serverPos = getNodePosition(server);
        const line = drawLine(
            serverPos.x,
            serverPos.y,
            dbPos.x,
            dbPos.y
        );
        diagram.appendChild(line);
    });
    
    // 演示正常操作
    await activateNode(client);
    addLog(logContainer, '客户端发送请求');
    
    const requestMessage = createMessage('请求');
    diagram.appendChild(requestMessage);
    await animateMessage(requestMessage, client, loadBalancer);
    await activateNode(loadBalancer);
    addLog(logContainer, '负载均衡接收请求');
    
    // 路由到主服务器
    const routeMessage = createMessage('路由请求');
    diagram.appendChild(routeMessage);
    await animateMessage(routeMessage, loadBalancer, servers[0]);
    await activateNode(servers[0]);
    addLog(logContainer, '请求路由到主服务器');
    
    // 数据库操作
    const dbQuery = createMessage('数据操作');
    diagram.appendChild(dbQuery);
    await animateMessage(dbQuery, servers[0], database);
    await activateNode(database);
    addLog(logContainer, '主服务器访问数据库');
    
    const dbResponse = createMessage('数据结果');
    diagram.appendChild(dbResponse);
    await animateMessage(dbResponse, database, servers[0]);
    await activateNode(servers[0]);
    
    // 响应
    const response = createMessage('响应');
    diagram.appendChild(response);
    await animateMessage(response, servers[0], loadBalancer);
    await activateNode(loadBalancer);
    
    const clientResponse = createMessage('响应');
    diagram.appendChild(clientResponse);
    await animateMessage(clientResponse, loadBalancer, client);
    await activateNode(client);
    addLog(logContainer, '请求成功完成');
    
    await sleep(1000);
    
    // 模拟主服务器故障
    addLog(logContainer, '模拟主服务器故障');
    servers[0].classList.add('error');
    await sleep(1000);
    
    // 故障检测
    addLog(logContainer, '负载均衡器检测到服务器故障');
    const checkMessage = createMessage('健康检查失败');
    diagram.appendChild(checkMessage);
    await animateMessage(checkMessage, loadBalancer, servers[0]);
    
    // 故障转移
    addLog(logContainer, '触发故障转移机制');
    await sleep(500);
    
    // 新请求到备份服务器
    await activateNode(client);
    addLog(logContainer, '客户端发送新请求');
    
    const newRequest = createMessage('请求');
    diagram.appendChild(newRequest);
    await animateMessage(newRequest, client, loadBalancer);
    await activateNode(loadBalancer);
    
    // 路由到备份服务器
    const failoverRoute = createMessage('故障转移');
    diagram.appendChild(failoverRoute);
    await animateMessage(failoverRoute, loadBalancer, servers[1]);
    await activateNode(servers[1]);
    addLog(logContainer, '请求路由到备份服务器');
    
    // 备份服务器处理
    const backupDbQuery = createMessage('数据操作');
    diagram.appendChild(backupDbQuery);
    await animateMessage(backupDbQuery, servers[1], database);
    await activateNode(database);
    addLog(logContainer, '备份服务器访问数据库');
    
    const backupDbResponse = createMessage('数据结果');
    diagram.appendChild(backupDbResponse);
    await animateMessage(backupDbResponse, database, servers[1]);
    await activateNode(servers[1]);
    
    // 响应
    const backupResponse = createMessage('响应');
    diagram.appendChild(backupResponse);
    await animateMessage(backupResponse, servers[1], loadBalancer);
    await activateNode(loadBalancer);
    
    const newClientResponse = createMessage('响应');
    diagram.appendChild(newClientResponse);
    await animateMessage(newClientResponse, loadBalancer, client);
    await activateNode(client);
    addLog(logContainer, '请求成功完成，系统保持可用');
    
    // 显示可靠性特性
    const features = [
        { feature: '冗余设计', description: '关键组件有备份，避免单点故障' },
        { feature: '故障检测', description: '实时监控系统组件状态' },
        { feature: '故障转移', description: '在故障发生时自动切换到备份组件' },
        { feature: '数据备份', description: '确保数据不会丢失' }
    ];
    
    const table = createElement('table', 'feature-table');
    const thead = createElement('thead');
    const headerRow = createElement('tr');
    ['可靠性机制', '说明'].forEach(text => {
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
    addLog(logContainer, '展示可靠性特性');
}

// 一致性演示
async function initConsistencyDemo(diagram) {
    clearDiagram(diagram);
    
    // 创建日志容器
    const logContainer = createLogContainer();
    diagram.appendChild(logContainer);
    addLog(logContainer, '初始化一致性演示');
    
    // 创建节点
    const client = createNode('client', '客户端');
    const coordinator = createNode('coordinator', '协调者');
    const replicas = [];
    for (let i = 0; i < 5; i++) {
        replicas.push(createNode(`replica${i}`, `副本 ${i+1}`));
        
        // 添加状态指示器
        const stateIndicator = createElement('div', 'state-indicator');
        stateIndicator.style.position = 'absolute';
        stateIndicator.style.width = '12px';
        stateIndicator.style.height = '12px';
        stateIndicator.style.borderRadius = '50%';
        stateIndicator.style.backgroundColor = '#95a5a6';
        stateIndicator.style.bottom = '5px';
        stateIndicator.style.right = '5px';
        replicas[i].appendChild(stateIndicator);
    }
    
    // 添加节点到图表
    [client, coordinator, ...replicas].forEach(node => {
        diagram.appendChild(node);
    });
    
    // 布局节点
    const centerX = diagram.offsetWidth / 2;
    const centerY = diagram.offsetHeight / 2;
    
    client.style.left = `${centerX - 50}px`;
    client.style.top = '60px';
    
    coordinator.style.left = `${centerX - 50}px`;
    coordinator.style.top = `${centerY - 50}px`;
    
    // 副本节点使用半圆形布局
    for (let i = 0; i < replicas.length; i++) {
        const angle = Math.PI * (0.75 + 0.5 * i / (replicas.length - 1));
        const radius = 180;
        const x = centerX + radius * Math.cos(angle) - 50;
        const y = centerY + 70 + radius * Math.sin(angle) - 25;
        replicas[i].style.left = `${x}px`;
        replicas[i].style.top = `${y}px`;
    }
    
    // 等待DOM更新，确保节点位置已生效
    await sleep(100);
    
    // 创建连接线
    const clientPos = getNodePosition(client);
    const coordinatorPos = getNodePosition(coordinator);
    
    // 客户端到协调者
    const clientToCoordinator = drawLine(
        clientPos.x,
        clientPos.y,
        coordinatorPos.x,
        coordinatorPos.y
    );
    diagram.appendChild(clientToCoordinator);
    
    // 协调者到副本
    const lines = [];
    for (const replica of replicas) {
        const replicaPos = getNodePosition(replica);
        const line = drawLine(
            coordinatorPos.x,
            coordinatorPos.y,
            replicaPos.x,
            replicaPos.y
        );
        diagram.appendChild(line);
        lines.push(line);
    }
    
    // 添加一致性模型表格
    const models = [
        { model: '强一致性', description: '所有副本在任意时刻的数据都完全一致' },
        { model: '最终一致性', description: '副本在一段时间后最终达到一致状态' },
        { model: '因果一致性', description: '有因果关系的操作保持顺序一致' },
        { model: 'CAP定理', description: '一致性、可用性、分区容忍性不可兼得' }
    ];
    
    const table = createElement('table', 'model-table');
    const thead = createElement('thead');
    const headerRow = createElement('tr');
    ['一致性模型', '说明'].forEach(text => {
        const th = createElement('th', '', text);
        headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    table.appendChild(thead);
    
    const tbody = createElement('tbody');
    models.forEach(({ model, description }) => {
        const tr = createElement('tr');
        tr.appendChild(createElement('td', 'model', model));
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
    
    // 设置状态颜色
    function setReplicaState(index, state) {
        let color;
        switch (state) {
            case 'preparing': color = '#f39c12'; break; // 黄色
            case 'ready': color = '#3498db'; break;     // 蓝色
            case 'committed': color = '#2ecc71'; break; // 绿色
            case 'error': color = '#e74c3c'; break;     // 红色
            default: color = '#95a5a6';                 // 灰色
        }
        const stateIndicator = replicas[index].querySelector('.state-indicator');
        stateIndicator.style.backgroundColor = color;
    }
    
    // 演示写入操作（强一致性）
    addLog(logContainer, '演示强一致性写入 (使用两阶段提交协议)');
    await activateNode(client);
    
    const writeMessage = createMessage('写入请求');
    diagram.appendChild(writeMessage);
    await animateMessage(writeMessage, client, coordinator, 800);
    await activateNode(coordinator);
    addLog(logContainer, '协调节点收到写入请求，开始两阶段提交');
    await sleep(300);
    
    // 准备阶段
    addLog(logContainer, '第一阶段：准备阶段');
    const prepareMessages = [];
    
    for (let i = 0; i < replicas.length; i++) {
        const replica = replicas[i];
        
        const prepareMessage = createMessage('准备写入');
        diagram.appendChild(prepareMessage);
        await animateMessage(prepareMessage, coordinator, replica, 800);
        await activateNode(replica);
        
        setReplicaState(i, 'preparing');
        addLog(logContainer, `数据副本 ${i + 1} 准备写入`);
        
        // 模拟副本的准备工作
        await sleep(300);
        
        setReplicaState(i, 'ready');
        const ackMessage = createMessage('已就绪');
        diagram.appendChild(ackMessage);
        await animateMessage(ackMessage, replica, coordinator, 800);
        
        await sleep(200);
    }
    
    await activateNode(coordinator);
    addLog(logContainer, '所有副本已准备就绪，进入提交阶段');
    await sleep(500);
    
    // 提交阶段
    addLog(logContainer, '第二阶段：提交阶段');
    
    for (let i = 0; i < replicas.length; i++) {
        const replica = replicas[i];
        
        const commitMessage = createMessage('提交写入');
        diagram.appendChild(commitMessage);
        await animateMessage(commitMessage, coordinator, replica, 800);
        await activateNode(replica);
        
        setReplicaState(i, 'committed');
        addLog(logContainer, `数据副本 ${i + 1} 提交完成`);
        
        await sleep(300);
    }
    
    // 确认写入完成
    const confirmMessage = createMessage('写入成功');
    diagram.appendChild(confirmMessage);
    await animateMessage(confirmMessage, coordinator, client, 800);
    await activateNode(client);
    addLog(logContainer, '客户端收到写入成功确认，所有副本数据一致');
    
    await sleep(1000);
    
    // 模拟读取操作
    addLog(logContainer, '模拟强一致性读取操作');
    
    const readMessage = createMessage('读取请求');
    diagram.appendChild(readMessage);
    await animateMessage(readMessage, client, coordinator, 800);
    await activateNode(coordinator);
    
    // 随机选择一个副本读取
    const readIndex = Math.floor(Math.random() * replicas.length);
    const selectedReplica = replicas[readIndex];
    
    const routeReadMessage = createMessage('路由读取');
    diagram.appendChild(routeReadMessage);
    await animateMessage(routeReadMessage, coordinator, selectedReplica, 800);
    await activateNode(selectedReplica);
    addLog(logContainer, `从数据副本 ${readIndex + 1} 读取数据`);
    
    const dataMessage = createMessage('返回数据');
    diagram.appendChild(dataMessage);
    await animateMessage(dataMessage, selectedReplica, coordinator, 800);
    await activateNode(coordinator);
    
    const responseMessage = createMessage('读取结果');
    diagram.appendChild(responseMessage);
    await animateMessage(responseMessage, coordinator, client, 800);
    await activateNode(client);
    addLog(logContainer, '客户端收到读取结果，保证读到最新数据');
    
    addLog(logContainer, '演示完成: 强一致性保证所有副本数据一致，但需要额外的协调开销');
}

// 初始化代码
document.addEventListener('DOMContentLoaded', () => {
    // 平滑滚动
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // 初始化各个演示
    const demoButtons = document.querySelectorAll('.demo-button');
    demoButtons.forEach(button => {
        button.addEventListener('click', async () => {
            const demoType = button.getAttribute('data-demo');
            const diagram = button.closest('.animation-container').querySelector('.diagram');
            
            // 禁用按钮，防止重复点击
            button.disabled = true;
            
            try {
                // 根据演示类型调用相应的初始化函数
                switch (demoType) {
                    case 'basic-architecture':
                        await initBasicArchitectureDemo(diagram);
                        break;
                    case 'scalability':
                        await initScalabilityDemo(diagram);
                        break;
                    case 'reliability':
                        await initReliabilityDemo(diagram);
                        break;
                    case 'consistency':
                        await initConsistencyDemo(diagram);
                        break;
                    case 'microservices':
                        await initMicroservicesDemo(diagram);
                        break;
                    case 'soa':
                        await initSoaDemo(diagram);
                        break;
                    case 'event-driven':
                        await initEventDrivenDemo(diagram);
                        break;
                    case 'load-balancer':
                        await initLoadBalancerDemo(diagram);
                        break;
                    case 'service-registry':
                        await initServiceRegistryDemo(diagram);
                        break;
                    case 'api-gateway':
                        await initApiGatewayDemo(diagram);
                        break;
                    case 'sync-comm':
                        await initSyncCommDemo(diagram);
                        break;
                    case 'async-comm':
                        await initAsyncCommDemo(diagram);
                        break;
                    case 'message-queue':
                        await initMessageQueueDemo(diagram);
                        break;
                }
            } catch (error) {
                console.error('演示出错:', error);
                addLog(diagram.querySelector('.log-container'), 
                    `演示出错: ${error.message}`, 'error');
            } finally {
                // 重新启用按钮
                button.disabled = false;
            }
        });
    });
}); 