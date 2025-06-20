// 负载均衡演示
async function initLoadBalancerDemo(diagram) {
    clearDiagram(diagram);
    
    // 创建日志容器
    const logContainer = createLogContainer();
    diagram.appendChild(logContainer);
    addLog(logContainer, '初始化负载均衡演示');
    
    // 创建节点
    const loadBalancer = createNode('load-balancer', '负载均衡器');
    const servers = [
        createNode('server1', '服务器 1'),
        createNode('server2', '服务器 2'),
        createNode('server3', '服务器 3')
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
    
    // 等待DOM更新
    await sleep(100);
    
    // 布局服务器
    for (let i = 0; i < servers.length; i++) {
        servers[i].style.left = `${centerX - 150 + i * 150}px`;
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
    
    // 演示负载均衡过程
    for (let i = 0; i < 4; i++) {
        // 随机选择客户端
        const client = clients[i % clients.length];
        await activateNode(client);
        addLog(logContainer, `客户端 ${i % clients.length + 1} 发送请求`);
        
        const requestMessage = createMessage('请求');
        diagram.appendChild(requestMessage);
        await animateMessage(requestMessage, client, loadBalancer);
        await activateNode(loadBalancer);
        
        // 负载均衡，选择服务器
        const serverIndex = i % servers.length;
        const server = servers[serverIndex];
        addLog(logContainer, `负载均衡器将请求分发到服务器 ${serverIndex + 1}`);
        
        const routeMessage = createMessage('路由请求');
        diagram.appendChild(routeMessage);
        await animateMessage(routeMessage, loadBalancer, server);
        await activateNode(server);
        addLog(logContainer, `服务器 ${serverIndex + 1} 处理请求`);
        
        // 响应
        const responseMessage = createMessage('响应');
        diagram.appendChild(responseMessage);
        await animateMessage(responseMessage, server, loadBalancer);
        await activateNode(loadBalancer);
        
        const clientResponseMessage = createMessage('响应');
        diagram.appendChild(clientResponseMessage);
        await animateMessage(clientResponseMessage, loadBalancer, client);
        await activateNode(client);
        addLog(logContainer, `客户端 ${i % clients.length + 1} 收到响应`);
        
        await sleep(500);
    }
}

// 服务注册与发现演示
async function initServiceRegistryDemo(diagram) {
    clearDiagram(diagram);
    
    // 创建日志容器
    const logContainer = createLogContainer();
    diagram.appendChild(logContainer);
    addLog(logContainer, '初始化服务注册与发现演示');
    
    // 创建节点
    const registry = createNode('registry', '服务注册中心');
    const instances = [
        createNode('instance1', '服务实例 1'),
        createNode('instance2', '服务实例 2'),
        createNode('instance3', '服务实例 3')
    ];
    const consumer = createNode('consumer', '服务消费者');
    
    // 添加节点到图表
    [registry, ...instances, consumer].forEach(node => {
        diagram.appendChild(node);
    });
    
    // 布局节点
    const centerX = diagram.offsetWidth / 2;
    const centerY = diagram.offsetHeight / 2;
    
    registry.style.left = `${centerX - 50}px`;
    registry.style.top = `${centerY - 100}px`;
    
    // 在半圆上布局服务实例
    for (let i = 0; i < instances.length; i++) {
        const angle = Math.PI * (0.25 + 0.5 * i / (instances.length - 1));
        const radius = 150;
        const x = centerX + radius * Math.cos(angle) - 50;
        const y = centerY + 50 + radius * Math.sin(angle) - 25;
        instances[i].style.left = `${x}px`;
        instances[i].style.top = `${y}px`;
    }
    
    consumer.style.left = `${centerX - 150}px`;
    consumer.style.top = '60px';
    
    // 等待DOM更新，确保节点位置已生效
    await sleep(100);
    
    // 创建连接线
    const registryPos = getNodePosition(registry);
    const consumerPos = getNodePosition(consumer);
    
    // 消费者到注册中心的连接
    const consumerToRegistry = drawLine(
        consumerPos.x,
        consumerPos.y,
        registryPos.x,
        registryPos.y
    );
    diagram.appendChild(consumerToRegistry);
    
    // 服务实例到注册中心的连接
    const instanceLines = [];
    for (const instance of instances) {
        const instancePos = getNodePosition(instance);
        const line = drawLine(
            instancePos.x,
            instancePos.y,
            registryPos.x,
            registryPos.y
        );
        diagram.appendChild(line);
        instanceLines.push(line);
    }
    
    // 演示服务注册流程
    addLog(logContainer, '演示服务注册流程');
    
    // 服务实例注册
    for (let i = 0; i < instances.length; i++) {
        const instance = instances[i];
        await activateNode(instance);
        
        const registerMessage = createMessage('注册服务');
        diagram.appendChild(registerMessage);
        await animateMessage(registerMessage, instance, registry, 800);
        await activateNode(registry);
        addLog(logContainer, `${instance.textContent}向注册中心注册服务`);
        
        await sleep(300);
    }
    
    // 服务发现流程
    addLog(logContainer, '演示服务发现流程');
    await activateNode(consumer);
    
    const discoveryMessage = createMessage('查询服务');
    diagram.appendChild(discoveryMessage);
    await animateMessage(discoveryMessage, consumer, registry, 800);
    await activateNode(registry);
    addLog(logContainer, '服务消费者向注册中心查询可用服务');
    
    // 随机选择一个服务实例
    const targetInstance = instances[Math.floor(Math.random() * instances.length)];
    const targetInstancePos = getNodePosition(targetInstance);
    
    const infoMessage = createMessage('返回服务信息');
    diagram.appendChild(infoMessage);
    await animateMessage(infoMessage, registry, consumer, 800);
    await activateNode(consumer);
    addLog(logContainer, '注册中心返回可用服务实例信息');
    
    // 创建消费者到目标实例的直接连接
    const directLine = drawLine(
        consumerPos.x,
        consumerPos.y,
        targetInstancePos.x,
        targetInstancePos.y,
        'direct-line',
        'direct'
    );
    directLine.style.strokeDasharray = '5,5';
    directLine.style.zIndex = '2';
    diagram.appendChild(directLine);
    
    // 直接调用服务
    const callMessage = createMessage('直接调用服务');
    diagram.appendChild(callMessage);
    await animateMessage(callMessage, consumer, targetInstance, 800);
    await activateNode(targetInstance);
    addLog(logContainer, `服务消费者直接调用${targetInstance.textContent}`);
    
    const responseMessage = createMessage('服务响应');
    diagram.appendChild(responseMessage);
    await animateMessage(responseMessage, targetInstance, consumer, 800);
    await activateNode(consumer);
    addLog(logContainer, `${targetInstance.textContent}处理请求并返回结果`);
    
    // 心跳检测
    addLog(logContainer, '模拟服务健康检查');
    for (let i = 0; i < instances.length; i++) {
        const instance = instances[i];
        
        const healthMessage = createMessage('健康检查');
        diagram.appendChild(healthMessage);
        await animateMessage(healthMessage, registry, instance, 600);
        await activateNode(instance);
        
        const healthRespMessage = createMessage('正常运行中');
        diagram.appendChild(healthRespMessage);
        await animateMessage(healthRespMessage, instance, registry, 600);
        await sleep(200);
    }
    
    addLog(logContainer, '服务注册与发现演示完成');
}

// API网关演示
async function initApiGatewayDemo(diagram) {
    clearDiagram(diagram);
    
    // 创建日志容器
    const logContainer = createLogContainer();
    diagram.appendChild(logContainer);
    addLog(logContainer, '初始化API网关演示');
    
    // 创建节点
    const client = createNode('client', '客户端');
    const apiGateway = createNode('api-gateway', 'API网关');
    const authService = createNode('auth-service', '认证服务');
    const microservices = [
        createNode('service1', '用户服务'),
        createNode('service2', '订单服务'),
        createNode('service3', '支付服务')
    ];
    
    // 添加节点到图表
    [client, apiGateway, authService, ...microservices].forEach(node => {
        diagram.appendChild(node);
    });
    
    // 布局节点
    const centerX = diagram.offsetWidth / 2;
    const centerY = diagram.offsetHeight / 2;
    
    client.style.left = `${centerX - 50}px`;
    client.style.top = '60px';
    
    apiGateway.style.left = `${centerX - 50}px`;
    apiGateway.style.top = `${centerY - 80}px`;
    
    authService.style.left = `${centerX + 100}px`;
    authService.style.top = `${centerY - 80}px`;
    
    // 在半圆上布局微服务
    for (let i = 0; i < microservices.length; i++) {
        const angle = Math.PI * (0.25 + 0.5 * i / (microservices.length - 1));
        const radius = 150;
        const x = centerX + radius * Math.cos(angle) - 50;
        const y = centerY + 50 + radius * Math.sin(angle) - 25;
        microservices[i].style.left = `${x}px`;
        microservices[i].style.top = `${y}px`;
    }
    
    // 等待DOM更新，确保节点位置已生效
    await sleep(100);
    
    // 创建连接线
    const clientPos = getNodePosition(client);
    const apiGatewayPos = getNodePosition(apiGateway);
    const authPos = getNodePosition(authService);
    
    // 客户端到API网关
    const clientToGateway = drawLine(
        clientPos.x,
        clientPos.y,
        apiGatewayPos.x,
        apiGatewayPos.y
    );
    diagram.appendChild(clientToGateway);
    
    // API网关到认证服务
    const gatewayToAuth = drawLine(
        apiGatewayPos.x,
        apiGatewayPos.y,
        authPos.x,
        authPos.y
    );
    diagram.appendChild(gatewayToAuth);
    
    // API网关到微服务
    microservices.forEach(service => {
        const servicePos = getNodePosition(service);
        const gatewayToService = drawLine(
            apiGatewayPos.x,
            apiGatewayPos.y,
            servicePos.x,
            servicePos.y
        );
        diagram.appendChild(gatewayToService);
    });
    
    // 添加API网关特性表格
    const features = [
        { feature: '请求路由', description: '将请求分发到相应的微服务' },
        { feature: '聚合响应', description: '合并多个微服务的响应返回给客户端' },
        { feature: '认证授权', description: '集中处理身份验证和权限控制' },
        { feature: '限流熔断', description: '提供流量控制和服务保护' },
        { feature: '协议转换', description: '在不同协议间进行转换（如HTTP到gRPC）' }
    ];
    
    const table = createElement('table', 'feature-table');
    const thead = createElement('thead');
    const headerRow = createElement('tr');
    ['功能', '说明'].forEach(text => {
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
    
    // 演示API网关流程
    addLog(logContainer, '演示API网关请求流程');
    await activateNode(client);
    
    // 客户端发送请求
    const requestMessage = createMessage('API请求');
    diagram.appendChild(requestMessage);
    await animateMessage(requestMessage, client, apiGateway, 800);
    await activateNode(apiGateway);
    addLog(logContainer, 'API网关接收客户端请求');
    
    // 身份验证流程
    const authMessage = createMessage('验证请求');
    diagram.appendChild(authMessage);
    await animateMessage(authMessage, apiGateway, authService, 800);
    await activateNode(authService);
    addLog(logContainer, 'API网关委托认证服务验证请求');
    
    const authResponseMessage = createMessage('验证通过');
    diagram.appendChild(authResponseMessage);
    await animateMessage(authResponseMessage, authService, apiGateway, 800);
    await activateNode(apiGateway);
    addLog(logContainer, '认证通过，API网关继续处理请求');
    
    // 随机选择一个服务处理请求
    const targetService = microservices[Math.floor(Math.random() * microservices.length)];
    
    const routeMessage = createMessage('路由请求');
    diagram.appendChild(routeMessage);
    await animateMessage(routeMessage, apiGateway, targetService, 800);
    await activateNode(targetService);
    addLog(logContainer, `API网关将请求路由到${targetService.textContent}`);
    
    const serviceResponseMessage = createMessage('服务响应');
    diagram.appendChild(serviceResponseMessage);
    await animateMessage(serviceResponseMessage, targetService, apiGateway, 800);
    await activateNode(apiGateway);
    addLog(logContainer, `${targetService.textContent}处理请求并返回结果`);
    
    const clientResponseMessage = createMessage('API响应');
    diagram.appendChild(clientResponseMessage);
    await animateMessage(clientResponseMessage, apiGateway, client, 800);
    await activateNode(client);
    addLog(logContainer, 'API网关返回处理结果给客户端');
    
    addLog(logContainer, 'API网关演示完成');
} 