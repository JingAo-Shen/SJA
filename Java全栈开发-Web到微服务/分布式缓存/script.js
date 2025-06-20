// 通用工具函数
function createElement(type, className, text) {
    const element = document.createElement(type);
    if (className) element.className = className;
    if (text) element.textContent = text;
    return element;
}

function createNode(id, text, type = 1) {
    const node = createElement('div', `node node-${type}`);
    node.id = id;
    node.textContent = text;
    return node;
}

function createMessage(text) {
    const message = createElement('div', 'message');
    message.textContent = text;
    return message;
}

function drawLine(x1, y1, x2, y2) {
    const length = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
    const angle = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;
    
    const line = createElement('div', 'connection-line');
    line.style.width = `${length}px`;
    line.style.left = `${x1}px`;
    line.style.top = `${y1}px`;
    line.style.transform = `rotate(${angle}deg)`;
    
    return line;
}

function addLog(logContainer, message, status = '') {
    const logEntry = document.createElement('div');
    
    if (status) {
        const indicator = createElement('span', `status-indicator status-${status}`);
        logEntry.appendChild(indicator);
    }
    
    logEntry.appendChild(document.createTextNode(message));
    logContainer.appendChild(logEntry);
    logContainer.scrollTop = logContainer.scrollHeight;
}

// 基本架构演示
async function initArchitectureDemo() {
    const container = document.getElementById('distributed-cache-diagram');
    container.innerHTML = '';
    
    // 创建节点
    const app1 = createNode('app1', 'Application 1', 1);
    const app2 = createNode('app2', 'Application 2', 1);
    const cache1 = createNode('cache1', 'Cache Node 1', 2);
    const cache2 = createNode('cache2', 'Cache Node 2', 2);
    const db = createNode('db', 'Database', 3);
    
    // 添加节点到容器
    container.appendChild(app1);
    container.appendChild(app2);
    container.appendChild(cache1);
    container.appendChild(cache2);
    container.appendChild(db);
    
    // 定位节点
    app1.style.left = '50px';
    app1.style.top = '50px';
    app2.style.left = '50px';
    app2.style.top = '200px';
    cache1.style.left = '250px';
    cache1.style.top = '50px';
    cache2.style.left = '250px';
    cache2.style.top = '200px';
    db.style.left = '450px';
    db.style.top = '125px';
    
    // 添加连接线
    const lines = [
        drawLine(170, 80, 250, 80),  // app1 -> cache1
        drawLine(170, 230, 250, 230), // app2 -> cache2
        drawLine(370, 80, 450, 155),  // cache1 -> db
        drawLine(370, 230, 450, 155)  // cache2 -> db
    ];
    
    lines.forEach(line => container.appendChild(line));
    
    // 添加动画效果
    [app1, app2, cache1, cache2, db].forEach(node => {
        node.classList.add('fade-in');
    });
}

// 缓存拓扑演示
async function initTopologyDemo() {
    const container = document.getElementById('topology-diagram');
    container.innerHTML = '';
    
    // 创建客户端分布式节点
    const clientApp1 = createNode('client-app1', 'App + Cache', 1);
    const clientApp2 = createNode('client-app2', 'App + Cache', 1);
    const clientDb = createNode('client-db', 'Database', 3);
    
    // 添加节点到容器
    container.appendChild(clientApp1);
    container.appendChild(clientApp2);
    container.appendChild(clientDb);
    
    // 定位节点
    clientApp1.style.left = '100px';
    clientApp1.style.top = '50px';
    clientApp2.style.left = '100px';
    clientApp2.style.top = '200px';
    clientDb.style.left = '300px';
    clientDb.style.top = '125px';
    
    // 添加连接线
    const lines = [
        drawLine(220, 80, 300, 155),  // app1 -> db
        drawLine(220, 230, 300, 155)  // app2 -> db
    ];
    
    lines.forEach(line => container.appendChild(line));
}

// 一致性策略演示
async function initConsistencyDemo() {
    const container = document.getElementById('consistency-diagram');
    container.innerHTML = '';
    
    // 创建节点
    const app = createNode('cons-app', 'Application', 1);
    const cache = createNode('cons-cache', 'Cache', 2);
    const db = createNode('cons-db', 'Database', 3);
    
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
    
    // 添加消息
    const message = createMessage('Write');
    message.style.left = '180px';
    message.style.top = '100px';
    container.appendChild(message);
}

// 分布策略演示
async function initDistributionDemo() {
    const container = document.getElementById('distribution-diagram');
    container.innerHTML = '';
    
    // 创建节点
    const nodes = [];
    for (let i = 0; i < 4; i++) {
        const node = createNode(`dist-node-${i}`, `Cache Node ${i+1}`, 2);
        nodes.push(node);
        container.appendChild(node);
    }
    
    // 布局节点成环形
    const centerX = 200;
    const centerY = 150;
    const radius = 100;
    
    nodes.forEach((node, i) => {
        const angle = (i / nodes.length) * 2 * Math.PI;
        const x = centerX + radius * Math.cos(angle);
        const y = centerY + radius * Math.sin(angle);
        node.style.left = `${x}px`;
        node.style.top = `${y}px`;
    });
    
    // 添加连接线形成环
    for (let i = 0; i < nodes.length; i++) {
        const next = (i + 1) % nodes.length;
        const line = drawLine(
            parseInt(nodes[i].style.left) + 60,
            parseInt(nodes[i].style.top) + 30,
            parseInt(nodes[next].style.left) + 60,
            parseInt(nodes[next].style.top) + 30
        );
        container.appendChild(line);
    }
}

// 初始化页面
document.addEventListener('DOMContentLoaded', function() {
    // 初始化各个演示
    initArchitectureDemo();
    initTopologyDemo();
    initConsistencyDemo();
    initDistributionDemo();
    
    // 添加按钮事件监听器
    document.getElementById('architecture-demo-btn')?.addEventListener('click', initArchitectureDemo);
    document.getElementById('topology-demo-btn')?.addEventListener('click', initTopologyDemo);
    document.getElementById('consistency-demo-btn')?.addEventListener('click', initConsistencyDemo);
    document.getElementById('distribution-demo-btn')?.addEventListener('click', initDistributionDemo);
    
    // 平滑滚动处理
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
}); 