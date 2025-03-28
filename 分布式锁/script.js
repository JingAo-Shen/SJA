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

function createResource(id, text) {
    const resource = createElement('div', 'resource');
    resource.id = id;
    resource.textContent = text;
    return resource;
}

function createLockIcon() {
    const lock = createElement('div', 'lock-icon');
    lock.innerHTML = '🔒';
    return lock;
}

function moveElement(element, x, y, duration = 300) {
    element.style.transition = `transform ${duration}ms ease`;
    element.style.transform = `translate(${x}px, ${y}px)`;
    return new Promise(resolve => setTimeout(resolve, duration));
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

// Redis分布式锁演示
async function initRedisLockDemo() {
    const container = document.getElementById('redis-lock-demo');
    const diagram = container.querySelector('.diagram');
    const logContainer = container.querySelector('.demo-logs');
    diagram.innerHTML = '';
    logContainer.innerHTML = '';
    
    // 创建节点
    const app1 = createNode('app1', 'Application 1', 1);
    const app2 = createNode('app2', 'Application 2', 2);
    const redis = createNode('redis', 'Redis', 3);
    const resource = createResource('shared-resource', 'Shared Resource');
    
    // 放置节点
    diagram.appendChild(app1);
    diagram.appendChild(app2);
    diagram.appendChild(redis);
    diagram.appendChild(resource);
    
    // 定位节点
    app1.style.left = '50px';
    app1.style.top = '50px';
    app2.style.left = '50px';
    app2.style.top = '150px';
    redis.style.left = '250px';
    redis.style.top = '100px';
    resource.style.left = '450px';
    resource.style.top = '100px';
    
    addLog(logContainer, '分布式锁演示已初始化');
    
    // 添加控制按钮的事件处理
    container.querySelector('.start-demo').addEventListener('click', () => simulateRedisLock(diagram, logContainer));
}

async function simulateRedisLock(diagram, logContainer) {
    const app1 = document.getElementById('app1');
    const app2 = document.getElementById('app2');
    const redis = document.getElementById('redis');
    const resource = document.getElementById('shared-resource');
    
    addLog(logContainer, '开始演示Redis分布式锁 (SETNX + EXPIRE)', 'success');
    
    // 创建请求锁的消息
    const message1 = createMessage('SETNX lock:resource 锁ID, EXPIRE lock:resource 30');
    diagram.appendChild(message1);
    message1.style.left = '80px';
    message1.style.top = '30px';
    message1.style.opacity = '0';
    
    // 添加锁图标
    const lockIcon = createLockIcon();
    diagram.appendChild(lockIcon);
    lockIcon.style.left = '270px';
    lockIcon.style.top = '80px';
    lockIcon.style.opacity = '0';
    
    // App1获取锁
    message1.style.opacity = '1';
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    addLog(logContainer, 'Application 1 尝试获取锁');
    await new Promise(resolve => setTimeout(resolve, 500));
    
    addLog(logContainer, 'Redis执行SETNX, 返回1 (成功)');
    lockIcon.style.opacity = '1';
    
    // 显示锁已被App1获取
    addLog(logContainer, 'Application 1 成功获取锁', 'success');
    
    // App1访问资源
    const line1 = drawLine(
        parseInt(app1.style.left) + 120,
        parseInt(app1.style.top) + 30,
        parseInt(resource.style.left),
        parseInt(resource.style.top) + 30
    );
    diagram.appendChild(line1);
    
    addLog(logContainer, 'Application 1 正在访问共享资源');
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // App2尝试获取锁
    const message2 = createMessage('SETNX lock:resource 锁ID, EXPIRE lock:resource 30');
    diagram.appendChild(message2);
    message2.style.left = '80px';
    message2.style.top = '180px';
    message2.style.opacity = '0';
    
    message2.style.opacity = '1';
    addLog(logContainer, 'Application 2 尝试获取锁');
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    addLog(logContainer, 'Redis执行SETNX, 返回0 (失败)', 'error');
    addLog(logContainer, 'Application 2 获取锁失败, 稍后重试', 'pending');
    
    // App1释放锁
    const message3 = createMessage('DEL lock:resource');
    diagram.appendChild(message3);
    message3.style.left = '80px';
    message3.style.top = '75px';
    message3.style.opacity = '0';
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    line1.remove();
    message3.style.opacity = '1';
    
    addLog(logContainer, 'Application 1 完成操作, 释放锁');
    await new Promise(resolve => setTimeout(resolve, 800));
    
    lockIcon.classList.add('unlocked');
    lockIcon.innerHTML = '🔓';
    addLog(logContainer, 'Redis执行DEL, 锁已释放', 'success');
    
    await new Promise(resolve => setTimeout(resolve, 500));
    message3.style.opacity = '0';
    
    // App2再次尝试获取锁
    message2.style.opacity = '0';
    await new Promise(resolve => setTimeout(resolve, 300));
    message2.style.opacity = '1';
    
    addLog(logContainer, 'Application 2 再次尝试获取锁');
    await new Promise(resolve => setTimeout(resolve, 800));
    
    lockIcon.classList.remove('unlocked');
    lockIcon.innerHTML = '🔒';
    addLog(logContainer, 'Redis执行SETNX, 返回1 (成功)');
    addLog(logContainer, 'Application 2 成功获取锁', 'success');
    
    // App2访问资源
    const line2 = drawLine(
        parseInt(app2.style.left) + 120,
        parseInt(app2.style.top) + 30,
        parseInt(resource.style.left),
        parseInt(resource.style.top) + 30
    );
    diagram.appendChild(line2);
    
    addLog(logContainer, 'Application 2 正在访问共享资源');
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // App2释放锁
    const message4 = createMessage('DEL lock:resource');
    diagram.appendChild(message4);
    message4.style.left = '80px';
    message4.style.top = '175px';
    message4.style.opacity = '0';
    
    line2.remove();
    message4.style.opacity = '1';
    
    addLog(logContainer, 'Application 2 完成操作, 释放锁');
    await new Promise(resolve => setTimeout(resolve, 800));
    
    lockIcon.classList.add('unlocked');
    lockIcon.innerHTML = '🔓';
    addLog(logContainer, 'Redis执行DEL, 锁已释放', 'success');
    
    addLog(logContainer, '演示完成', 'success');
}

// ZooKeeper分布式锁演示
async function initZookeeperLockDemo() {
    const container = document.getElementById('zookeeper-lock-demo');
    const diagram = container.querySelector('.diagram');
    const logContainer = container.querySelector('.demo-logs');
    diagram.innerHTML = '';
    logContainer.innerHTML = '';
    
    // 创建节点
    const app1 = createNode('zk-app1', 'Application 1', 1);
    const app2 = createNode('zk-app2', 'Application 2', 2);
    const zookeeper = createNode('zookeeper', 'ZooKeeper', 3);
    const resource = createResource('zk-resource', 'Shared Resource');
    
    // 放置节点
    diagram.appendChild(app1);
    diagram.appendChild(app2);
    diagram.appendChild(zookeeper);
    diagram.appendChild(resource);
    
    // 定位节点
    app1.style.left = '50px';
    app1.style.top = '50px';
    app2.style.left = '50px';
    app2.style.top = '150px';
    zookeeper.style.left = '250px';
    zookeeper.style.top = '100px';
    resource.style.left = '450px';
    resource.style.top = '100px';
    
    addLog(logContainer, 'ZooKeeper分布式锁演示已初始化');
    
    // 添加控制按钮的事件处理
    container.querySelector('.start-demo').addEventListener('click', () => simulateZookeeperLock(diagram, logContainer));
}

async function simulateZookeeperLock(diagram, logContainer) {
    // ZooKeeper锁的演示实现
    const app1 = document.getElementById('zk-app1');
    const app2 = document.getElementById('zk-app2');
    const zookeeper = document.getElementById('zookeeper');
    const resource = document.getElementById('zk-resource');
    
    addLog(logContainer, '开始演示ZooKeeper分布式锁', 'success');
    
    // 创建临时顺序节点的消息
    const message1 = createMessage('create -e -s /locks/lock_');
    diagram.appendChild(message1);
    message1.style.left = '80px';
    message1.style.top = '30px';
    message1.style.opacity = '0';
    
    // 添加锁图标
    const lockIcon = createLockIcon();
    diagram.appendChild(lockIcon);
    lockIcon.style.left = '270px';
    lockIcon.style.top = '80px';
    lockIcon.style.opacity = '0';
    
    // App1创建节点
    message1.style.opacity = '1';
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    addLog(logContainer, 'Application 1 创建临时顺序节点');
    await new Promise(resolve => setTimeout(resolve, 500));
    
    addLog(logContainer, 'ZooKeeper创建节点: /locks/lock_0000000001');
    
    // App1检查是否最小节点
    const message1b = createMessage('getChildren /locks');
    diagram.appendChild(message1b);
    message1b.style.left = '80px';
    message1b.style.top = '45px';
    message1b.style.opacity = '0';
    
    message1.style.opacity = '0';
    await new Promise(resolve => setTimeout(resolve, 300));
    message1b.style.opacity = '1';
    
    addLog(logContainer, 'Application 1 获取所有子节点');
    await new Promise(resolve => setTimeout(resolve, 500));
    
    addLog(logContainer, '子节点列表: [lock_0000000001]');
    addLog(logContainer, 'Application 1 发现自己是最小节点', 'success');
    
    // 显示锁已被App1获取
    lockIcon.style.opacity = '1';
    addLog(logContainer, 'Application 1 成功获取锁', 'success');
    
    // App1访问资源
    const line1 = drawLine(
        parseInt(app1.style.left) + 120,
        parseInt(app1.style.top) + 30,
        parseInt(resource.style.left),
        parseInt(resource.style.top) + 30
    );
    diagram.appendChild(line1);
    
    addLog(logContainer, 'Application 1 正在访问共享资源');
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // App2创建节点
    const message2 = createMessage('create -e -s /locks/lock_');
    diagram.appendChild(message2);
    message2.style.left = '80px';
    message2.style.top = '180px';
    message2.style.opacity = '0';
    
    message2.style.opacity = '1';
    addLog(logContainer, 'Application 2 创建临时顺序节点');
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    addLog(logContainer, 'ZooKeeper创建节点: /locks/lock_0000000002');
    
    // App2检查是否最小节点
    const message2b = createMessage('getChildren /locks');
    diagram.appendChild(message2b);
    message2b.style.left = '80px';
    message2b.style.top = '195px';
    message2b.style.opacity = '0';
    
    message2.style.opacity = '0';
    await new Promise(resolve => setTimeout(resolve, 300));
    message2b.style.opacity = '1';
    
    addLog(logContainer, 'Application 2 获取所有子节点');
    await new Promise(resolve => setTimeout(resolve, 500));
    
    addLog(logContainer, '子节点列表: [lock_0000000001, lock_0000000002]');
    addLog(logContainer, 'Application 2 发现自己不是最小节点', 'pending');
    
    // App2监视前一个节点
    const message2c = createMessage('exists /locks/lock_0000000001 watch');
    diagram.appendChild(message2c);
    message2c.style.left = '80px';
    message2c.style.top = '210px';
    message2c.style.opacity = '0';
    
    message2b.style.opacity = '0';
    await new Promise(resolve => setTimeout(resolve, 300));
    message2c.style.opacity = '1';
    
    addLog(logContainer, 'Application 2 监视前一个节点');
    await new Promise(resolve => setTimeout(resolve, 500));
    
    addLog(logContainer, 'Application 2 等待通知', 'pending');
    
    // App1释放锁
    await new Promise(resolve => setTimeout(resolve, 1500));
    line1.remove();
    
    addLog(logContainer, 'Application 1 完成操作, 删除节点');
    await new Promise(resolve => setTimeout(resolve, 800));
    
    lockIcon.classList.add('unlocked');
    lockIcon.innerHTML = '🔓';
    addLog(logContainer, 'ZooKeeper节点/locks/lock_0000000001已删除', 'success');
    
    // App2收到通知
    addLog(logContainer, 'Application 2 收到节点删除通知', 'success');
    message2c.style.opacity = '0';
    
    // App2再次检查是否最小节点
    const message2d = createMessage('getChildren /locks');
    diagram.appendChild(message2d);
    message2d.style.left = '80px';
    message2d.style.top = '195px';
    message2d.style.opacity = '0';
    
    await new Promise(resolve => setTimeout(resolve, 300));
    message2d.style.opacity = '1';
    
    addLog(logContainer, 'Application 2 再次获取所有子节点');
    await new Promise(resolve => setTimeout(resolve, 500));
    
    addLog(logContainer, '子节点列表: [lock_0000000002]');
    addLog(logContainer, 'Application 2 发现自己是最小节点', 'success');
    
    lockIcon.classList.remove('unlocked');
    lockIcon.innerHTML = '🔒';
    addLog(logContainer, 'Application 2 成功获取锁', 'success');
    
    // App2访问资源
    const line2 = drawLine(
        parseInt(app2.style.left) + 120,
        parseInt(app2.style.top) + 30,
        parseInt(resource.style.left),
        parseInt(resource.style.top) + 30
    );
    diagram.appendChild(line2);
    
    addLog(logContainer, 'Application 2 正在访问共享资源');
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // App2释放锁
    line2.remove();
    addLog(logContainer, 'Application 2 完成操作, 删除节点');
    await new Promise(resolve => setTimeout(resolve, 800));
    
    lockIcon.classList.add('unlocked');
    lockIcon.innerHTML = '🔓';
    addLog(logContainer, 'ZooKeeper节点/locks/lock_0000000002已删除', 'success');
    
    addLog(logContainer, '演示完成', 'success');
}

// 数据库分布式锁演示
async function initDatabaseLockDemo() {
    const container = document.getElementById('database-lock-demo');
    const diagram = container.querySelector('.diagram');
    const logContainer = container.querySelector('.demo-logs');
    diagram.innerHTML = '';
    logContainer.innerHTML = '';
    
    // 创建节点
    const app1 = createNode('db-app1', 'Application 1', 1);
    const app2 = createNode('db-app2', 'Application 2', 2);
    const database = createNode('database', 'Database', 3);
    const resource = createResource('db-resource', 'Shared Resource');
    
    // 放置节点
    diagram.appendChild(app1);
    diagram.appendChild(app2);
    diagram.appendChild(database);
    diagram.appendChild(resource);
    
    // 定位节点
    app1.style.left = '50px';
    app1.style.top = '50px';
    app2.style.left = '50px';
    app2.style.top = '150px';
    database.style.left = '250px';
    database.style.top = '100px';
    resource.style.left = '450px';
    resource.style.top = '100px';
    
    addLog(logContainer, '数据库分布式锁演示已初始化');
    
    // 添加控制按钮的事件处理
    container.querySelector('.start-demo').addEventListener('click', () => simulateDatabaseLock(diagram, logContainer));
}

async function simulateDatabaseLock(diagram, logContainer) {
    // 数据库锁的演示实现
    const app1 = document.getElementById('db-app1');
    const app2 = document.getElementById('db-app2');
    const database = document.getElementById('database');
    const resource = document.getElementById('db-resource');
    
    addLog(logContainer, '开始演示数据库分布式锁', 'success');
    
    // 创建INSERT语句的消息
    const message1 = createMessage('INSERT INTO locks VALUES ("resource_id", "lock_id", now())');
    diagram.appendChild(message1);
    message1.style.left = '80px';
    message1.style.top = '30px';
    message1.style.opacity = '0';
    
    // 添加锁图标
    const lockIcon = createLockIcon();
    diagram.appendChild(lockIcon);
    lockIcon.style.left = '270px';
    lockIcon.style.top = '80px';
    lockIcon.style.opacity = '0';
    
    // App1获取锁
    message1.style.opacity = '1';
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    addLog(logContainer, 'Application 1 尝试获取锁 (INSERT唯一索引)');
    await new Promise(resolve => setTimeout(resolve, 500));
    
    addLog(logContainer, '数据库执行INSERT, 成功插入记录');
    lockIcon.style.opacity = '1';
    
    // 显示锁已被App1获取
    addLog(logContainer, 'Application 1 成功获取锁', 'success');
    
    // App1访问资源
    const line1 = drawLine(
        parseInt(app1.style.left) + 120,
        parseInt(app1.style.top) + 30,
        parseInt(resource.style.left),
        parseInt(resource.style.top) + 30
    );
    diagram.appendChild(line1);
    
    addLog(logContainer, 'Application 1 正在访问共享资源');
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // App2尝试获取锁
    const message2 = createMessage('INSERT INTO locks VALUES ("resource_id", "lock_id", now())');
    diagram.appendChild(message2);
    message2.style.left = '80px';
    message2.style.top = '180px';
    message2.style.opacity = '0';
    
    message2.style.opacity = '1';
    addLog(logContainer, 'Application 2 尝试获取锁 (INSERT唯一索引)');
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    addLog(logContainer, '数据库执行INSERT, 违反唯一性约束', 'error');
    addLog(logContainer, 'Application 2 获取锁失败, 稍后重试', 'pending');
    
    // App1释放锁
    const message3 = createMessage('DELETE FROM locks WHERE resource_name = "resource_id"');
    diagram.appendChild(message3);
    message3.style.left = '80px';
    message3.style.top = '75px';
    message3.style.opacity = '0';
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    line1.remove();
    message3.style.opacity = '1';
    
    addLog(logContainer, 'Application 1 完成操作, 释放锁');
    await new Promise(resolve => setTimeout(resolve, 800));
    
    lockIcon.classList.add('unlocked');
    lockIcon.innerHTML = '🔓';
    addLog(logContainer, '数据库执行DELETE, 锁记录已删除', 'success');
    
    await new Promise(resolve => setTimeout(resolve, 500));
    message3.style.opacity = '0';
    
    // App2再次尝试获取锁
    message2.style.opacity = '0';
    await new Promise(resolve => setTimeout(resolve, 300));
    message2.style.opacity = '1';
    
    addLog(logContainer, 'Application 2 再次尝试获取锁');
    await new Promise(resolve => setTimeout(resolve, 800));
    
    lockIcon.classList.remove('unlocked');
    lockIcon.innerHTML = '🔒';
    addLog(logContainer, '数据库执行INSERT, 成功插入记录');
    addLog(logContainer, 'Application 2 成功获取锁', 'success');
    
    // App2访问资源
    const line2 = drawLine(
        parseInt(app2.style.left) + 120,
        parseInt(app2.style.top) + 30,
        parseInt(resource.style.left),
        parseInt(resource.style.top) + 30
    );
    diagram.appendChild(line2);
    
    addLog(logContainer, 'Application 2 正在访问共享资源');
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // App2释放锁
    const message4 = createMessage('DELETE FROM locks WHERE resource_name = "resource_id"');
    diagram.appendChild(message4);
    message4.style.left = '80px';
    message4.style.top = '175px';
    message4.style.opacity = '0';
    
    line2.remove();
    message4.style.opacity = '1';
    
    addLog(logContainer, 'Application 2 完成操作, 释放锁');
    await new Promise(resolve => setTimeout(resolve, 800));
    
    lockIcon.classList.add('unlocked');
    lockIcon.innerHTML = '🔓';
    addLog(logContainer, '数据库执行DELETE, 锁记录已删除', 'success');
    
    addLog(logContainer, '演示完成', 'success');
}

// 初始化页面
document.addEventListener('DOMContentLoaded', function() {
    // 初始化各种演示
    initRedisLockDemo();
    initZookeeperLockDemo();
    initDatabaseLockDemo();
    
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