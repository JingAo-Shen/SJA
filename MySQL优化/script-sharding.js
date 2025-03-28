// 垂直拆分演示
async function initVerticalShardingDemo() {
    const container = document.getElementById('vertical-sharding-diagram');
    const logContainer = document.createElement('div');
    logContainer.className = 'demo-logs';
    container.parentElement.appendChild(logContainer);
    
    container.innerHTML = '';
    logContainer.innerHTML = '';
    
    // 创建原始表结构
    const originalTable = createTable(
        ['用户ID', '用户名', '密码', '地址', '订单历史', '收藏商品'],
        [
            ['1001', 'user1', '****', '北京市...', '订单1,订单2', '商品1,商品2'],
            ['1002', 'user2', '****', '上海市...', '订单3,订单4', '商品3,商品4']
        ]
    );
    originalTable.style.position = 'absolute';
    originalTable.style.left = '50px';
    originalTable.style.top = '50px';
    container.appendChild(originalTable);
    
    // 演示垂直拆分
    async function demonstrateVerticalSplit() {
        addLog(logContainer, '开始演示垂直拆分', 'info');
        
        // 1. 显示原始表
        await new Promise(resolve => setTimeout(resolve, 1000));
        addLog(logContainer, '1. 原始用户表包含多种不同类型的数据', 'info');
        
        // 2. 拆分用户基础信息表
        const userBaseTable = createTable(
            ['用户ID', '用户名', '密码'],
            [
                ['1001', 'user1', '****'],
                ['1002', 'user2', '****']
            ]
        );
        userBaseTable.style.position = 'absolute';
        userBaseTable.style.left = '300px';
        userBaseTable.style.top = '50px';
        container.appendChild(userBaseTable);
        
        await new Promise(resolve => setTimeout(resolve, 1000));
        addLog(logContainer, '2. 拆分出用户基础信息表', 'success');
        
        // 3. 拆分用户地址表
        const userAddressTable = createTable(
            ['用户ID', '地址'],
            [
                ['1001', '北京市...'],
                ['1002', '上海市...']
            ]
        );
        userAddressTable.style.position = 'absolute';
        userAddressTable.style.left = '300px';
        userAddressTable.style.top = '150px';
        container.appendChild(userAddressTable);
        
        await new Promise(resolve => setTimeout(resolve, 1000));
        addLog(logContainer, '3. 拆分出用户地址表', 'success');
        
        // 4. 拆分订单历史表
        const orderHistoryTable = createTable(
            ['用户ID', '订单历史'],
            [
                ['1001', '订单1,订单2'],
                ['1002', '订单3,订单4']
            ]
        );
        orderHistoryTable.style.position = 'absolute';
        orderHistoryTable.style.left = '550px';
        orderHistoryTable.style.top = '50px';
        container.appendChild(orderHistoryTable);
        
        await new Promise(resolve => setTimeout(resolve, 1000));
        addLog(logContainer, '4. 拆分出订单历史表', 'success');
        
        // 5. 拆分收藏商品表
        const favoriteTable = createTable(
            ['用户ID', '收藏商品'],
            [
                ['1001', '商品1,商品2'],
                ['1002', '商品3,商品4']
            ]
        );
        favoriteTable.style.position = 'absolute';
        favoriteTable.style.left = '550px';
        favoriteTable.style.top = '150px';
        container.appendChild(favoriteTable);
        
        await new Promise(resolve => setTimeout(resolve, 1000));
        addLog(logContainer, '5. 拆分出收藏商品表', 'success');
        
        // 添加连接线
        const lines = [
            drawLine(200, 100, 300, 100),  // 原表到用户基础信息表
            drawLine(200, 100, 300, 200),  // 原表到用户地址表
            drawLine(200, 100, 550, 100),  // 原表到订单历史表
            drawLine(200, 100, 550, 200)   // 原表到收藏商品表
        ];
        
        lines.forEach(line => container.appendChild(line));
        
        addLog(logContainer, '垂直拆分完成，每个表都包含特定类型的数据', 'success');
    }
    
    // 添加演示控制按钮
    const controls = container.parentElement.querySelector('.controls');
    const demoBtn = createElement('button', '', '演示垂直拆分');
    
    demoBtn.addEventListener('click', demonstrateVerticalSplit);
    controls.appendChild(demoBtn);
}

// 水平拆分演示
async function initHorizontalShardingDemo() {
    const container = document.getElementById('horizontal-sharding-diagram');
    const logContainer = document.createElement('div');
    logContainer.className = 'demo-logs';
    container.parentElement.appendChild(logContainer);
    
    container.innerHTML = '';
    logContainer.innerHTML = '';
    
    // 创建原始订单表
    const originalTable = createTable(
        ['订单ID', '用户ID', '商品ID', '金额', '时间'],
        [
            ['10001', '1001', 'P001', '100', '2024-01'],
            ['10002', '1002', 'P002', '200', '2024-01'],
            ['10003', '1003', 'P003', '300', '2024-02'],
            ['10004', '1004', 'P004', '400', '2024-02']
        ]
    );
    originalTable.style.position = 'absolute';
    originalTable.style.left = '50px';
    originalTable.style.top = '50px';
    container.appendChild(originalTable);
    
    // 演示水平拆分
    async function demonstrateHorizontalSplit() {
        addLog(logContainer, '开始演示水平拆分', 'info');
        
        // 1. 显示原始表
        await new Promise(resolve => setTimeout(resolve, 1000));
        addLog(logContainer, '1. 原始订单表数据量较大', 'info');
        
        // 2. 按时间拆分表1
        const table1 = createTable(
            ['订单ID', '用户ID', '商品ID', '金额', '时间'],
            [
                ['10001', '1001', 'P001', '100', '2024-01'],
                ['10002', '1002', 'P002', '200', '2024-01']
            ]
        );
        table1.style.position = 'absolute';
        table1.style.left = '400px';
        table1.style.top = '50px';
        container.appendChild(table1);
        
        await new Promise(resolve => setTimeout(resolve, 1000));
        addLog(logContainer, '2. 创建2024年1月订单表', 'success');
        
        // 3. 按时间拆分表2
        const table2 = createTable(
            ['订单ID', '用户ID', '商品ID', '金额', '时间'],
            [
                ['10003', '1003', 'P003', '300', '2024-02'],
                ['10004', '1004', 'P004', '400', '2024-02']
            ]
        );
        table2.style.position = 'absolute';
        table2.style.left = '400px';
        table2.style.top = '150px';
        container.appendChild(table2);
        
        await new Promise(resolve => setTimeout(resolve, 1000));
        addLog(logContainer, '3. 创建2024年2月订单表', 'success');
        
        // 添加连接线和说明
        const lines = [
            drawLine(250, 100, 400, 100),  // 原表到表1
            drawLine(250, 100, 400, 200)   // 原表到表2
        ];
        
        lines.forEach(line => container.appendChild(line));
        
        // 添加路由规则说明
        const routingRule = createMessage('路由规则：按订单时间分表');
        routingRule.style.left = '250px';
        routingRule.style.top = '20px';
        container.appendChild(routingRule);
        
        addLog(logContainer, '水平拆分完成，按时间维度将数据分散到不同表中', 'success');
    }
    
    // 添加演示控制按钮
    const controls = container.parentElement.querySelector('.controls');
    const demoBtn = createElement('button', '', '演示水平拆分');
    
    demoBtn.addEventListener('click', demonstrateHorizontalSplit);
    controls.appendChild(demoBtn);
}

// 分片策略演示
async function initShardingStrategyDemo() {
    const container = document.getElementById('sharding-strategy-diagram');
    const logContainer = document.createElement('div');
    logContainer.className = 'demo-logs';
    container.parentElement.appendChild(logContainer);
    
    container.innerHTML = '';
    logContainer.innerHTML = '';
    
    // 创建分片节点
    const nodes = [];
    for (let i = 0; i < 4; i++) {
        const node = createNode(`shard-${i}`, `分片 ${i}`, 2);
        nodes.push(node);
        container.appendChild(node);
    }
    
    // 布局节点
    const centerX = 300;
    const centerY = 150;
    const radius = 100;
    
    nodes.forEach((node, i) => {
        const angle = (i * Math.PI * 2) / 4;
        node.style.left = (centerX + radius * Math.cos(angle)) + 'px';
        node.style.top = (centerY + radius * Math.sin(angle)) + 'px';
    });
    
    // Hash分片演示
    async function demonstrateHashSharding() {
        addLog(logContainer, '开始演示Hash分片策略', 'info');
        
        // 创建数据节点
        const dataNode = createNode('data', '数据', 1);
        dataNode.style.left = '50px';
        dataNode.style.top = '125px';
        container.appendChild(dataNode);
        
        // 演示多条数据的路由
        const testData = [
            { id: '1001', hash: 1 },
            { id: '1002', hash: 2 },
            { id: '1003', hash: 3 },
            { id: '1004', hash: 0 }
        ];
        
        for (const data of testData) {
            // 显示Hash计算过程
            const hashMsg = createMessage(`ID: ${data.id}\nHash值: ${data.hash}`);
            hashMsg.style.left = '180px';
            hashMsg.style.top = '125px';
            container.appendChild(hashMsg);
            
            await new Promise(resolve => setTimeout(resolve, 1000));
            addLog(logContainer, `对ID ${data.id} 进行Hash计算`, 'info');
            
            // 显示路由到目标分片
            const targetNode = nodes[data.hash];
            const line = drawLine(
                parseInt(dataNode.style.left) + 120,
                parseInt(dataNode.style.top) + 30,
                parseInt(targetNode.style.left) + 60,
                parseInt(targetNode.style.top) + 30
            );
            container.appendChild(line);
            
            await new Promise(resolve => setTimeout(resolve, 1000));
            addLog(logContainer, `数据路由到分片 ${data.hash}`, 'success');
            
            hashMsg.remove();
            await new Promise(resolve => setTimeout(resolve, 500));
        }
        
        addLog(logContainer, 'Hash分片演示完成', 'success');
    }
    
    // Range分片演示
    async function demonstrateRangeSharding() {
        container.innerHTML = '';
        logContainer.innerHTML = '';
        
        addLog(logContainer, '开始演示Range分片策略', 'info');
        
        // 重新创建分片节点
        nodes.forEach((node, i) => {
            const rangeStart = i * 250 + 1;
            const rangeEnd = (i + 1) * 250;
            node.textContent = `分片 ${i}\n(${rangeStart}-${rangeEnd})`;
            container.appendChild(node);
        });
        
        // 创建数据节点
        const dataNode = createNode('data', '数据', 1);
        dataNode.style.left = '50px';
        dataNode.style.top = '125px';
        container.appendChild(dataNode);
        
        // 演示多条数据的路由
        const testData = [
            { id: '100', range: 0 },
            { id: '300', range: 1 },
            { id: '600', range: 2 },
            { id: '900', range: 3 }
        ];
        
        for (const data of testData) {
            // 显示Range判断过程
            const rangeMsg = createMessage(`ID: ${data.id}\n范围判断中...`);
            rangeMsg.style.left = '180px';
            rangeMsg.style.top = '125px';
            container.appendChild(rangeMsg);
            
            await new Promise(resolve => setTimeout(resolve, 1000));
            addLog(logContainer, `判断ID ${data.id} 所属范围`, 'info');
            
            // 显示路由到目标分片
            const targetNode = nodes[data.range];
            const line = drawLine(
                parseInt(dataNode.style.left) + 120,
                parseInt(dataNode.style.top) + 30,
                parseInt(targetNode.style.left) + 60,
                parseInt(targetNode.style.top) + 30
            );
            container.appendChild(line);
            
            await new Promise(resolve => setTimeout(resolve, 1000));
            addLog(logContainer, `数据路由到分片 ${data.range}`, 'success');
            
            rangeMsg.remove();
            await new Promise(resolve => setTimeout(resolve, 500));
        }
        
        addLog(logContainer, 'Range分片演示完成', 'success');
    }
    
    // 添加演示控制按钮
    const controls = container.parentElement.querySelector('.controls');
    const hashBtn = createElement('button', '', '演示Hash分片');
    const rangeBtn = createElement('button', '', '演示Range分片');
    
    hashBtn.addEventListener('click', demonstrateHashSharding);
    rangeBtn.addEventListener('click', demonstrateRangeSharding);
    
    controls.appendChild(hashBtn);
    controls.appendChild(rangeBtn);
}

// 初始化所有分库分表演示
document.addEventListener('DOMContentLoaded', function() {
    initVerticalShardingDemo();
    initHorizontalShardingDemo();
    initShardingStrategyDemo();
}); 