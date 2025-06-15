// 微服务架构演示
async function initMicroservicesDemo(diagram) {
    clearDiagram(diagram);
    
    // 创建日志容器
    const logContainer = createLogContainer();
    diagram.appendChild(logContainer);
    addLog(logContainer, '初始化微服务架构演示');
    
    // 创建节点
    const gateway = createNode('gateway', 'API网关');
    const userService = createNode('user-service', '用户服务');
    const orderService = createNode('order-service', '订单服务');
    const productService = createNode('product-service', '商品服务');
    const paymentService = createNode('payment-service', '支付服务');
    
    // 添加节点到图表
    [gateway, userService, orderService, productService, paymentService].forEach(node => {
        diagram.appendChild(node);
    });
    
    // 布局节点
    const centerX = diagram.offsetWidth / 2;
    const centerY = diagram.offsetHeight / 2;
    
    gateway.style.left = `${centerX - 50}px`;
    gateway.style.top = '50px';
    
    // 等待DOM更新
    await sleep(100);
    
    await arrangeNodesInCircle(
        [userService, orderService, productService, paymentService],
        centerX,
        centerY + 80,
        150
    );
    
    // 等待DOM更新，确保节点位置已生效
    await sleep(100);
    
    // 创建连接线
    const services = [userService, orderService, productService, paymentService];
    services.forEach(service => {
        const gatewayPos = getNodePosition(gateway);
        const servicePos = getNodePosition(service);
        const line = drawLine(
            gatewayPos.x,
            gatewayPos.y,
            servicePos.x,
            servicePos.y
        );
        diagram.appendChild(line);
    });
    
    // 演示服务间通信
    for (let i = 0; i < 2; i++) {
        // 模拟用户请求流程
        await activateNode(gateway);
        addLog(logContainer, '接收到用户请求');
        
        // 用户服务认证
        const authMessage = createMessage('认证请求');
        diagram.appendChild(authMessage);
        await animateMessage(authMessage, gateway, userService);
        await activateNode(userService);
        addLog(logContainer, '用户服务进行认证');
        
        // 商品服务查询
        const productMessage = createMessage('查询商品');
        diagram.appendChild(productMessage);
        await animateMessage(productMessage, gateway, productService);
        await activateNode(productService);
        addLog(logContainer, '商品服务返回商品信息');
        
        // 创建订单
        const orderMessage = createMessage('创建订单');
        diagram.appendChild(orderMessage);
        await animateMessage(orderMessage, gateway, orderService);
        await activateNode(orderService);
        addLog(logContainer, '订单服务创建新订单');
        
        // 支付处理
        const paymentMessage = createMessage('处理支付');
        diagram.appendChild(paymentMessage);
        await animateMessage(paymentMessage, orderService, paymentService);
        await activateNode(paymentService);
        addLog(logContainer, '支付服务处理付款');
        
        await sleep(1000);
    }
}

// SOA架构演示
async function initSoaDemo(diagram) {
    clearDiagram(diagram);
    
    // 创建日志容器
    const logContainer = createLogContainer();
    diagram.appendChild(logContainer);
    addLog(logContainer, '初始化SOA架构演示');
    
    // 创建节点
    const esb = createNode('esb', 'ESB');
    const crm = createNode('crm', 'CRM系统');
    const erp = createNode('erp', 'ERP系统');
    const billing = createNode('billing', '计费系统');
    const legacy = createNode('legacy', '遗留系统');
    
    // 添加节点到图表
    [esb, crm, erp, billing, legacy].forEach(node => {
        diagram.appendChild(node);
    });
    
    // 布局节点
    const centerX = diagram.offsetWidth / 2;
    const centerY = diagram.offsetHeight / 2;
    
    esb.style.left = `${centerX - 50}px`;
    esb.style.top = `${centerY - 50}px`;
    
    // 等待DOM更新
    await sleep(100);
    
    await arrangeNodesInCircle(
        [crm, erp, billing, legacy],
        centerX,
        centerY,
        150
    );
    
    // 等待DOM更新，确保节点位置已生效
    await sleep(100);
    
    // 创建连接线
    const systems = [crm, erp, billing, legacy];
    systems.forEach(system => {
        const esbPos = getNodePosition(esb);
        const systemPos = getNodePosition(system);
        const line = drawLine(
            esbPos.x,
            esbPos.y,
            systemPos.x,
            systemPos.y
        );
        diagram.appendChild(line);
    });
    
    // 演示服务集成流程
    for (let i = 0; i < 2; i++) {
        // 客户信息更新场景
        await activateNode(crm);
        addLog(logContainer, 'CRM系统发起客户信息更新');
        
        const updateMessage = createMessage('客户信息更新');
        diagram.appendChild(updateMessage);
        await animateMessage(updateMessage, crm, esb);
        await activateNode(esb);
        
        // 同步到ERP
        const erpMessage = createMessage('同步客户数据');
        diagram.appendChild(erpMessage);
        await animateMessage(erpMessage, esb, erp);
        await activateNode(erp);
        addLog(logContainer, 'ERP系统更新客户信息');
        
        // 更新计费信息
        const billingMessage = createMessage('更新计费信息');
        diagram.appendChild(billingMessage);
        await animateMessage(billingMessage, esb, billing);
        await activateNode(billing);
        addLog(logContainer, '计费系统更新客户配置');
        
        // 同步到遗留系统
        const legacyMessage = createMessage('同步遗留系统');
        diagram.appendChild(legacyMessage);
        await animateMessage(legacyMessage, esb, legacy);
        await activateNode(legacy);
        addLog(logContainer, '遗留系统数据同步完成');
        
        await sleep(1000);
    }
}

// 事件驱动架构演示
async function initEventDrivenDemo(diagram) {
    clearDiagram(diagram);
    
    // 创建日志容器
    const logContainer = createLogContainer();
    diagram.appendChild(logContainer);
    addLog(logContainer, '初始化事件驱动架构演示');
    
    // 创建节点
    const publisher = createNode('publisher', '发布者');
    const eventBus = createNode('event-bus', '事件总线');
    const subscribers = [
        createNode('subscriber1', '订阅者 1'),
        createNode('subscriber2', '订阅者 2'),
        createNode('subscriber3', '订阅者 3')
    ];
    
    // 添加节点到图表
    [publisher, eventBus, ...subscribers].forEach(node => {
        diagram.appendChild(node);
    });
    
    // 布局节点
    const centerX = diagram.offsetWidth / 2;
    const centerY = diagram.offsetHeight / 2;
    
    publisher.style.left = `${centerX - 50}px`;
    publisher.style.top = '50px';
    
    eventBus.style.left = `${centerX - 50}px`;
    eventBus.style.top = `${centerY - 50}px`;
    
    // 在半圆上布局订阅者节点
    for (let i = 0; i < subscribers.length; i++) {
        const angle = Math.PI * (0.25 + 0.5 * i / (subscribers.length - 1));
        const radius = 180;
        const x = centerX + radius * Math.cos(angle) - 50;
        const y = centerY + 50 + radius * Math.sin(angle) - 25;
        subscribers[i].style.left = `${x}px`;
        subscribers[i].style.top = `${y}px`;
    }
    
    // 等待DOM更新，确保节点位置已生效
    await sleep(100);
    
    // 创建连接线
    const publisherPos = getNodePosition(publisher);
    const eventBusPos = getNodePosition(eventBus);
    
    // 发布者到事件总线
    const publisherToEventBus = drawLine(
        publisherPos.x,
        publisherPos.y,
        eventBusPos.x,
        eventBusPos.y
    );
    diagram.appendChild(publisherToEventBus);
    
    // 事件总线到订阅者
    subscribers.forEach(subscriber => {
        const subscriberPos = getNodePosition(subscriber);
        const eventBusToSubscriber = drawLine(
            eventBusPos.x,
            eventBusPos.y,
            subscriberPos.x,
            subscriberPos.y
        );
        diagram.appendChild(eventBusToSubscriber);
    });
    
    // 展示事件驱动架构特性
    const features = [
        { feature: '松耦合', description: '组件之间通过事件间接交互，降低依赖性' },
        { feature: '可扩展性', description: '可以方便地添加新的发布者和订阅者' },
        { feature: '异步通信', description: '事件发布和处理通常是异步的' },
        { feature: '事件驱动流', description: '系统响应事件而不是请求' }
    ];
    
    const table = createElement('table', 'feature-table');
    const thead = createElement('thead');
    const headerRow = createElement('tr');
    ['特性', '说明'].forEach(text => {
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
    
    // 演示事件发布过程
    addLog(logContainer, '演示事件发布与订阅过程');
    await activateNode(publisher);
    
    // 发布事件
    const eventMessage = createMessage('发布事件');
    diagram.appendChild(eventMessage);
    await animateMessage(eventMessage, publisher, eventBus, 800);
    await activateNode(eventBus);
    addLog(logContainer, '发布者发布事件到事件总线');
    
    // 事件总线分发事件给订阅者
    for (const subscriber of subscribers) {
        const notifyMessage = createMessage('事件通知');
        diagram.appendChild(notifyMessage);
        await animateMessage(notifyMessage, eventBus, subscriber, 800);
        await activateNode(subscriber);
        addLog(logContainer, `${subscriber.textContent} 收到事件并处理`);
        await sleep(500);
    }
    
    addLog(logContainer, '事件驱动架构演示完成');
} 