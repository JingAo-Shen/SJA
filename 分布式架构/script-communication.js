// 同步通信演示
async function initSyncCommDemo(diagram) {
    clearDiagram(diagram);
    
    // 创建日志容器
    const logContainer = createLogContainer();
    diagram.appendChild(logContainer);
    addLog(logContainer, '初始化同步通信演示');
    
    // 创建节点
    const client = createNode('client', '客户端');
    const service = createNode('service', '服务');
    const database = createNode('database', '数据库');
    
    // 添加节点到图表
    [client, service, database].forEach(node => {
        diagram.appendChild(node);
    });
    
    // 布局节点
    const centerX = diagram.offsetWidth / 2;
    const centerY = diagram.offsetHeight / 2;
    
    client.style.left = `${centerX - 50}px`;
    client.style.top = '50px';
    
    service.style.left = `${centerX - 50}px`;
    service.style.top = `${centerY}px`;
    
    database.style.left = `${centerX - 50}px`;
    database.style.top = `${centerY + 150}px`;
    
    // 等待DOM更新，确保节点位置已生效
    await sleep(100);
    
    // 创建连接线
    const clientPos = getNodePosition(client);
    const servicePos = getNodePosition(service);
    const dbPos = getNodePosition(database);
    
    const clientToService = drawLine(
        clientPos.x,
        clientPos.y,
        servicePos.x,
        servicePos.y
    );
    diagram.appendChild(clientToService);
    
    const serviceToDb = drawLine(
        servicePos.x,
        servicePos.y,
        dbPos.x,
        dbPos.y
    );
    diagram.appendChild(serviceToDb);
    
    // 演示同步请求-响应流程
    for (let i = 0; i < 2; i++) {
        // 客户端请求
        await activateNode(client);
        addLog(logContainer, '客户端发送请求并等待响应');
        
        const requestMessage = createMessage('同步请求');
        diagram.appendChild(requestMessage);
        await animateMessage(requestMessage, client, service);
        await activateNode(service);
        addLog(logContainer, '服务接收请求');
        
        // 查询数据库
        const dbQueryMessage = createMessage('查询数据');
        diagram.appendChild(dbQueryMessage);
        await animateMessage(dbQueryMessage, service, database);
        await activateNode(database);
        addLog(logContainer, '数据库处理查询');
        await sleep(500);
        
        // 返回数据
        const dbResponseMessage = createMessage('返回数据');
        diagram.appendChild(dbResponseMessage);
        await animateMessage(dbResponseMessage, database, service);
        await activateNode(service);
        addLog(logContainer, '服务处理数据');
        
        // 响应客户端
        const responseMessage = createMessage('同步响应');
        diagram.appendChild(responseMessage);
        await animateMessage(responseMessage, service, client);
        await activateNode(client);
        addLog(logContainer, '客户端收到响应，请求完成');
        
        await sleep(1000);
    }
    
    // 添加同步通信特性表格
    const features = [
        { feature: '实时性', description: '客户端实时获取响应' },
        { feature: '简单性', description: '编程模型简单，易于理解' },
        { feature: '阻塞性', description: '客户端在等待响应时被阻塞' },
        { feature: '资源消耗', description: '长时间操作会占用连接资源' }
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
    
    addLog(logContainer, '显示同步通信特性');
}

// 异步通信演示
async function initAsyncCommDemo(diagram) {
    clearDiagram(diagram);
    
    // 创建日志容器
    const logContainer = createLogContainer();
    diagram.appendChild(logContainer);
    addLog(logContainer, '初始化异步通信演示');
    
    // 创建节点
    const client = createNode('client', '客户端');
    const service = createNode('service', '服务');
    const worker = createNode('worker', '后台工作器');
    const database = createNode('database', '数据库');
    
    // 添加节点到图表
    [client, service, worker, database].forEach(node => {
        diagram.appendChild(node);
    });
    
    // 布局节点
    const centerX = diagram.offsetWidth / 2;
    const centerY = diagram.offsetHeight / 2;
    
    client.style.left = `${centerX - 150}px`;
    client.style.top = '50px';
    
    service.style.left = `${centerX - 50}px`;
    service.style.top = `${centerY - 50}px`;
    
    worker.style.left = `${centerX + 100}px`;
    worker.style.top = `${centerY - 50}px`;
    
    database.style.left = `${centerX - 50}px`;
    database.style.top = `${centerY + 100}px`;
    
    // 等待DOM更新，确保节点位置已生效
    await sleep(100);
    
    // 创建连接线
    const clientPos = getNodePosition(client);
    const servicePos = getNodePosition(service);
    const workerPos = getNodePosition(worker);
    const dbPos = getNodePosition(database);
    
    const clientToService = drawLine(
        clientPos.x,
        clientPos.y,
        servicePos.x,
        servicePos.y
    );
    diagram.appendChild(clientToService);
    
    const serviceToWorker = drawLine(
        servicePos.x,
        servicePos.y,
        workerPos.x,
        workerPos.y
    );
    diagram.appendChild(serviceToWorker);
    
    const workerToDb = drawLine(
        workerPos.x,
        workerPos.y,
        dbPos.x,
        dbPos.y
    );
    diagram.appendChild(workerToDb);
    
    const serviceToDb = drawLine(
        servicePos.x,
        servicePos.y,
        dbPos.x,
        dbPos.y
    );
    diagram.appendChild(serviceToDb);
    
    // 演示异步通信流程
    for (let i = 0; i < 2; i++) {
        // 客户端请求
        await activateNode(client);
        addLog(logContainer, '客户端发送异步请求');
        
        const requestMessage = createMessage('异步请求');
        diagram.appendChild(requestMessage);
        await animateMessage(requestMessage, client, service);
        await activateNode(service);
        addLog(logContainer, '服务接收请求并立即响应');
        
        // 立即响应客户端，表示请求已接收
        const ackMessage = createMessage('确认接收');
        diagram.appendChild(ackMessage);
        await animateMessage(ackMessage, service, client);
        await activateNode(client);
        addLog(logContainer, '客户端收到确认，可以继续其他任务');
        
        // 后台异步处理
        const taskMessage = createMessage('异步任务');
        diagram.appendChild(taskMessage);
        await animateMessage(taskMessage, service, worker);
        await activateNode(worker);
        addLog(logContainer, '将请求转交给后台工作器处理');
        
        // 查询数据库
        const dbQueryMessage = createMessage('处理数据');
        diagram.appendChild(dbQueryMessage);
        await animateMessage(dbQueryMessage, worker, database);
        await activateNode(database);
        addLog(logContainer, '访问数据库进行处理');
        await sleep(500);
        
        // 完成任务
        const completionMessage = createMessage('处理完成');
        diagram.appendChild(completionMessage);
        await animateMessage(completionMessage, database, worker);
        await activateNode(worker);
        addLog(logContainer, '后台处理完成');
        
        // 通知客户端（可选，视业务需求）
        if (i === 1) {
            const notifyMessage = createMessage('处理结果');
            diagram.appendChild(notifyMessage);
            await animateMessage(notifyMessage, worker, service);
            await activateNode(service);
            
            const resultMessage = createMessage('通知结果');
            diagram.appendChild(resultMessage);
            await animateMessage(resultMessage, service, client);
            await activateNode(client);
            addLog(logContainer, '通知客户端处理结果');
        }
        
        await sleep(1000);
    }
    
    // 添加异步通信特性表格
    const features = [
        { feature: '非阻塞', description: '客户端发送请求后可以继续执行' },
        { feature: '高吞吐量', description: '能够处理更多并发请求' },
        { feature: '响应延迟', description: '最终结果可能需要稍后获取' },
        { feature: '复杂性', description: '编程模型相对复杂' }
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
    
    addLog(logContainer, '显示异步通信特性');
}

// 消息队列演示
async function initMessageQueueDemo(diagram) {
    clearDiagram(diagram);
    
    // 创建日志容器
    const logContainer = createLogContainer();
    diagram.appendChild(logContainer);
    addLog(logContainer, '初始化消息队列演示');
    
    // 创建节点
    const producers = [
        createNode('producer1', '生产者 1'),
        createNode('producer2', '生产者 2')
    ];
    const queue = createNode('queue', '消息队列', 'queue');
    const consumers = [
        createNode('consumer1', '消费者 1'),
        createNode('consumer2', '消费者 2'),
        createNode('consumer3', '消费者 3')
    ];
    
    // 添加节点到图表
    [...producers, queue, ...consumers].forEach(node => {
        diagram.appendChild(node);
    });
    
    // 布局节点
    const centerX = diagram.offsetWidth / 2;
    const centerY = diagram.offsetHeight / 2;
    
    // 队列居中
    queue.style.left = `${centerX - 75}px`;
    queue.style.top = `${centerY - 25}px`;
    queue.style.width = '150px';
    queue.style.height = '50px';
    queue.style.borderRadius = '5px';
    
    // 布局生产者 - 上方
    const producerSpacing = 160;
    for (let i = 0; i < producers.length; i++) {
        producers[i].style.left = `${centerX - producerSpacing/2 + i * producerSpacing - 50}px`;
        producers[i].style.top = `${centerY - 130}px`;
    }
    
    // 布局消费者 - 下方半圆形
    for (let i = 0; i < consumers.length; i++) {
        const angle = Math.PI * (0.25 + 0.5 * i / (consumers.length - 1));
        const radius = 180;
        const x = centerX + radius * Math.cos(angle) - 50;
        const y = centerY + 80 + radius * Math.sin(angle) - 25;
        consumers[i].style.left = `${x}px`;
        consumers[i].style.top = `${y}px`;
    }
    
    // 等待DOM更新，确保节点位置已生效
    await sleep(100);
    
    // 创建连接线
    const queuePos = getNodePosition(queue);
    
    // 生产者到队列的连接
    producers.forEach(producer => {
        const producerPos = getNodePosition(producer);
        const line = drawLine(
            producerPos.x,
            producerPos.y,
            queuePos.x,
            queuePos.y
        );
        diagram.appendChild(line);
    });
    
    // 队列到消费者的连接
    consumers.forEach(consumer => {
        const consumerPos = getNodePosition(consumer);
        const line = drawLine(
            queuePos.x,
            queuePos.y,
            consumerPos.x,
            consumerPos.y
        );
        diagram.appendChild(line);
    });
    
    // 添加消息队列模拟内容
    const messagesInQueue = [];
    const maxQueueDisplay = 5;
    
    function updateQueueDisplay() {
        // 清除旧的消息显示
        const oldMessages = queue.querySelectorAll('.queue-message');
        oldMessages.forEach(el => el.remove());
        
        // 显示队列中的消息（最多显示maxQueueDisplay条）
        const displayCount = Math.min(messagesInQueue.length, maxQueueDisplay);
        for (let i = 0; i < displayCount; i++) {
            const messageEl = createElement('div', 'queue-message', `M${messagesInQueue[i]}`);
            messageEl.style.position = 'absolute';
            messageEl.style.top = '15px';
            messageEl.style.left = `${20 + i * 25}px`;
            messageEl.style.fontSize = '10px';
            messageEl.style.padding = '2px 4px';
            messageEl.style.backgroundColor = '#f1c40f';
            messageEl.style.borderRadius = '3px';
            messageEl.style.color = '#000';
            queue.appendChild(messageEl);
        }
        
        // 如果有更多消息，显示"..."
        if (messagesInQueue.length > maxQueueDisplay) {
            const moreIndicator = createElement('div', 'queue-message', '...');
            moreIndicator.style.position = 'absolute';
            moreIndicator.style.top = '15px';
            moreIndicator.style.left = `${20 + displayCount * 25}px`;
            moreIndicator.style.fontSize = '10px';
            moreIndicator.style.padding = '2px 4px';
            queue.appendChild(moreIndicator);
        }
    }
    
    // 添加消息队列特性表格
    const features = [
        { feature: '松耦合', description: '生产者和消费者互不依赖' },
        { feature: '异步处理', description: '消息生产和消费可以异步进行' },
        { feature: '削峰填谷', description: '缓冲消息流量，应对流量峰值' },
        { feature: '可靠性', description: '支持消息持久化和确认机制' },
        { feature: '扩展性', description: '可以动态增减消费者节点' }
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
    
    // 演示消息队列流程
    let messageCounter = 1;
    
    // 第一批：生产者发送消息
    for (let i = 0; i < 4; i++) {
        // 生产者发布消息
        const producer = producers[i % producers.length];
        await activateNode(producer);
        addLog(logContainer, `生产者 ${(i % producers.length) + 1} 发布消息 ${messageCounter}`);
        
        const publishMessage = createMessage(`消息 ${messageCounter}`);
        diagram.appendChild(publishMessage);
        await animateMessage(publishMessage, producer, queue, 800);
        await activateNode(queue);
        
        // 添加到队列并更新显示
        messagesInQueue.push(messageCounter++);
        updateQueueDisplay();
        addLog(logContainer, '消息进入队列等待处理');
        
        await sleep(500);
    }
    
    // 第二批：消费者消费消息
    for (let i = 0; i < 6; i++) {
        if (messagesInQueue.length === 0) break;
        
        // 消费者消费消息
        const consumer = consumers[i % consumers.length];
        const messageId = messagesInQueue.shift();
        updateQueueDisplay();
        
        const consumeMessage = createMessage(`消息 ${messageId}`);
        diagram.appendChild(consumeMessage);
        await animateMessage(consumeMessage, queue, consumer, 800);
        await activateNode(consumer);
        addLog(logContainer, `消费者 ${(i % consumers.length) + 1} 处理消息 ${messageId}`);
        
        await sleep(500);
        
        // 在消费的同时，有时也产生新消息
        if (i % 2 === 0 && i < 4) {
            const producer = producers[(i/2) % producers.length];
            await activateNode(producer);
            addLog(logContainer, `生产者 ${((i/2) % producers.length) + 1} 发布消息 ${messageCounter}`);
            
            const newMessage = createMessage(`消息 ${messageCounter}`);
            diagram.appendChild(newMessage);
            await animateMessage(newMessage, producer, queue, 800);
            await activateNode(queue);
            
            // 添加到队列并更新显示
            messagesInQueue.push(messageCounter++);
            updateQueueDisplay();
            addLog(logContainer, '新消息进入队列等待处理');
        }
    }
    
    addLog(logContainer, '演示完成：消息队列支持生产者和消费者异步解耦');
} 