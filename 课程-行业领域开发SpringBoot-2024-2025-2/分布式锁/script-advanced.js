// 死锁问题演示
async function initDeadlockDemo() {
    const container = document.getElementById('deadlock-demo');
    const diagram = container.querySelector('.diagram');
    const logContainer = container.querySelector('.demo-logs');
    diagram.innerHTML = '';
    logContainer.innerHTML = '';
    
    // 创建节点
    const app1 = createNode('deadlock-app1', 'Application 1', 1);
    const redis = createNode('deadlock-redis', 'Redis', 3);
    const resource = createResource('deadlock-resource', 'Shared Resource');
    
    // 放置节点
    diagram.appendChild(app1);
    diagram.appendChild(redis);
    diagram.appendChild(resource);
    
    // 定位节点
    app1.style.left = '50px';
    app1.style.top = '100px';
    redis.style.left = '250px';
    redis.style.top = '100px';
    resource.style.left = '450px';
    resource.style.top = '100px';
    
    // 添加锁图标
    const lockIcon = createLockIcon();
    diagram.appendChild(lockIcon);
    lockIcon.style.left = '270px';
    lockIcon.style.top = '80px';
    lockIcon.style.opacity = '0';
    
    addLog(logContainer, '死锁问题演示已初始化');
    
    // 添加控制按钮的事件处理
    container.querySelector('.start-demo').addEventListener('click', () => simulateDeadlock(diagram, logContainer, lockIcon));
}

async function simulateDeadlock(diagram, logContainer, lockIcon) {
    const app1 = document.getElementById('deadlock-app1');
    const redis = document.getElementById('deadlock-redis');
    const resource = document.getElementById('deadlock-resource');
    
    addLog(logContainer, '开始演示分布式锁的死锁问题', 'success');
    
    // 创建获取锁的消息
    const message1 = createMessage('SETNX lock:resource 锁ID, EXPIRE lock:resource 30');
    diagram.appendChild(message1);
    message1.style.left = '80px';
    message1.style.top = '70px';
    message1.style.opacity = '0';
    
    // App1获取锁
    message1.style.opacity = '1';
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    addLog(logContainer, 'Application 1 获取锁, 设置30秒过期时间');
    await new Promise(resolve => setTimeout(resolve, 500));
    
    addLog(logContainer, 'Redis执行SETNX, 返回1 (成功)');
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
    
    addLog(logContainer, 'Application 1 开始执行长时间操作...');
    
    // 添加计时器
    const timer = createElement('div', 'timer');
    timer.id = 'lock-timer';
    timer.textContent = '30s';
    diagram.appendChild(timer);
    timer.style.left = '250px';
    timer.style.top = '50px';
    
    // 模拟倒计时
    for (let i = 30; i >= 0; i--) {
        if (i === 0) {
            timer.textContent = '锁已过期!';
            timer.style.backgroundColor = '#f8d7da';
            timer.style.borderColor = '#f5c6cb';
            addLog(logContainer, '锁已过期，但应用程序仍在执行操作', 'error');
            
            // 锁图标变为解锁状态
            lockIcon.classList.add('unlocked');
            lockIcon.innerHTML = '🔓';
        } else {
            timer.textContent = `${i}s`;
            if (i <= 5) {
                timer.style.backgroundColor = '#fff3cd';
                timer.style.borderColor = '#ffeeba';
            }
        }
        await new Promise(resolve => setTimeout(resolve, 200)); // 加速模拟
    }
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // 模拟其他应用获取锁
    const message2 = createMessage('SETNX lock:resource 锁ID2');
    diagram.appendChild(message2);
    message2.style.left = '80px';
    message2.style.top = '130px';
    message2.style.opacity = '1';
    
    addLog(logContainer, '此时另一个应用程序获取了锁');
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // 锁图标恢复锁定状态
    lockIcon.classList.remove('unlocked');
    lockIcon.innerHTML = '🔒';
    
    addLog(logContainer, '另一个应用程序成功获取锁并开始操作', 'success');
    
    // 添加警告图标表示数据不一致
    const warningIcon = createElement('div', 'lock-icon');
    warningIcon.innerHTML = '⚠️';
    warningIcon.style.backgroundColor = '#ffc107';
    diagram.appendChild(warningIcon);
    warningIcon.style.left = '470px';
    warningIcon.style.top = '80px';
    warningIcon.style.opacity = '0';
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    warningIcon.style.opacity = '1';
    
    addLog(logContainer, 'Application 1 尝试完成操作并写入数据', 'error');
    addLog(logContainer, '数据出现不一致风险!', 'error');
    
    // 完成演示
    await new Promise(resolve => setTimeout(resolve, 2000));
    addLog(logContainer, '演示完成 - 分布式锁的死锁问题', 'success');
    addLog(logContainer, '解决方案: 锁续期、锁ID检查等机制', 'success');
}

// 可靠性问题演示
async function initReliabilityDemo() {
    const container = document.getElementById('reliability-demo');
    const diagram = container.querySelector('.diagram');
    const logContainer = container.querySelector('.demo-logs');
    diagram.innerHTML = '';
    logContainer.innerHTML = '';
    
    // 创建节点
    const app1 = createNode('reliability-app1', 'Application 1', 1);
    const redis1 = createNode('reliability-redis1', 'Redis Master', 3);
    const redis2 = createNode('reliability-redis2', 'Redis Replica', 3);
    const resource = createResource('reliability-resource', 'Shared Resource');
    
    // 放置节点
    diagram.appendChild(app1);
    diagram.appendChild(redis1);
    diagram.appendChild(redis2);
    diagram.appendChild(resource);
    
    // 定位节点
    app1.style.left = '50px';
    app1.style.top = '100px';
    redis1.style.left = '250px';
    redis1.style.top = '50px';
    redis2.style.left = '250px';
    redis2.style.top = '150px';
    resource.style.left = '450px';
    resource.style.top = '100px';
    
    // 添加锁图标
    const lockIcon = createLockIcon();
    diagram.appendChild(lockIcon);
    lockIcon.style.left = '270px';
    lockIcon.style.top = '30px';
    lockIcon.style.opacity = '0';
    
    addLog(logContainer, '可靠性问题演示已初始化');
    
    // 添加控制按钮的事件处理
    container.querySelector('.start-demo').addEventListener('click', () => simulateReliabilityIssue(diagram, logContainer, lockIcon));
}

async function simulateReliabilityIssue(diagram, logContainer, lockIcon) {
    const app1 = document.getElementById('reliability-app1');
    const redis1 = document.getElementById('reliability-redis1');
    const redis2 = document.getElementById('reliability-redis2');
    const resource = document.getElementById('reliability-resource');
    
    addLog(logContainer, '开始演示分布式锁的可靠性问题', 'success');
    
    // 创建获取锁的消息
    const message1 = createMessage('SETNX lock:resource 锁ID');
    diagram.appendChild(message1);
    message1.style.left = '80px';
    message1.style.top = '70px';
    message1.style.opacity = '0';
    
    // Redis节点间的复制连接线
    const replicationLine = drawLine(
        parseInt(redis1.style.left) + 60,
        parseInt(redis1.style.top) + 50,
        parseInt(redis2.style.left) + 60,
        parseInt(redis2.style.top)
    );
    diagram.appendChild(replicationLine);
    
    // App1获取锁
    message1.style.opacity = '1';
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    addLog(logContainer, 'Application 1 在Redis Master上获取锁');
    await new Promise(resolve => setTimeout(resolve, 500));
    
    addLog(logContainer, 'Redis Master执行SETNX, 返回1 (成功)');
    lockIcon.style.opacity = '1';
    addLog(logContainer, 'Application 1 成功获取锁', 'success');
    
    // 显示复制延迟
    const replicationMsg = createMessage('异步复制...');
    diagram.appendChild(replicationMsg);
    replicationMsg.style.left = '250px';
    replicationMsg.style.top = '100px';
    replicationMsg.style.opacity = '1';
    
    // App1访问资源
    const line1 = drawLine(
        parseInt(app1.style.left) + 120,
        parseInt(app1.style.top) + 30,
        parseInt(resource.style.left),
        parseInt(resource.style.top) + 30
    );
    diagram.appendChild(line1);
    
    addLog(logContainer, 'Application 1 开始执行操作...');
    
    // 模拟Redis Master故障
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Redis Master变灰表示故障
    redis1.style.opacity = '0.5';
    redis1.style.border = '2px dashed #999';
    redis1.textContent = 'Redis Master (故障)';
    lockIcon.style.opacity = '0.3';
    
    addLog(logContainer, 'Redis Master发生故障!', 'error');
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // 显示提升从节点为主节点
    addLog(logContainer, 'Redis Replica被提升为新的Master', 'pending');
    redis2.textContent = 'Redis New Master';
    
    // 在新的主节点上创建一个新的锁图标表示锁丢失
    const newLockIcon = createLockIcon();
    newLockIcon.classList.add('unlocked');
    newLockIcon.innerHTML = '🔓';
    diagram.appendChild(newLockIcon);
    newLockIcon.style.left = '270px';
    newLockIcon.style.top = '130px';
    newLockIcon.style.opacity = '1';
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // 模拟其他应用获取锁
    const message2 = createMessage('SETNX lock:resource 锁ID2');
    diagram.appendChild(message2);
    message2.style.left = '80px';
    message2.style.top = '130px';
    message2.style.opacity = '1';
    
    addLog(logContainer, '此时另一个应用程序尝试获取锁');
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // 锁图标变为锁定状态
    newLockIcon.classList.remove('unlocked');
    newLockIcon.innerHTML = '🔒';
    
    addLog(logContainer, '另一个应用程序在新Master上成功获取锁', 'success');
    
    // 添加警告图标表示数据不一致
    const warningIcon = createElement('div', 'lock-icon');
    warningIcon.innerHTML = '⚠️';
    warningIcon.style.backgroundColor = '#ffc107';
    diagram.appendChild(warningIcon);
    warningIcon.style.left = '470px';
    warningIcon.style.top = '80px';
    warningIcon.style.opacity = '0';
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    warningIcon.style.opacity = '1';
    
    addLog(logContainer, '现在有两个客户端同时持有锁!', 'error');
    addLog(logContainer, '数据出现不一致风险!', 'error');
    
    // 完成演示
    await new Promise(resolve => setTimeout(resolve, 2000));
    addLog(logContainer, '演示完成 - 分布式锁的可靠性问题', 'success');
    addLog(logContainer, '解决方案: Redlock算法等多节点一致性协议', 'success');
}

// Redlock算法演示
async function initRedlockDemo() {
    const container = document.getElementById('redlock-demo');
    const diagram = container.querySelector('.diagram');
    const logContainer = container.querySelector('.demo-logs');
    diagram.innerHTML = '';
    logContainer.innerHTML = '';
    
    // 创建节点
    const app1 = createNode('redlock-app1', 'Application', 1);
    const redis1 = createNode('redlock-redis1', 'Redis 1', 3);
    const redis2 = createNode('redlock-redis2', 'Redis 2', 3);
    const redis3 = createNode('redlock-redis3', 'Redis 3', 3);
    const resource = createResource('redlock-resource', 'Shared Resource');
    
    // 放置节点
    diagram.appendChild(app1);
    diagram.appendChild(redis1);
    diagram.appendChild(redis2);
    diagram.appendChild(redis3);
    diagram.appendChild(resource);
    
    // 定位节点
    app1.style.left = '50px';
    app1.style.top = '100px';
    redis1.style.left = '250px';
    redis1.style.top = '30px';
    redis2.style.left = '250px';
    redis2.style.top = '100px';
    redis3.style.left = '250px';
    redis3.style.top = '170px';
    resource.style.left = '450px';
    resource.style.top = '100px';
    
    // 添加锁图标
    const lockIcon1 = createLockIcon();
    diagram.appendChild(lockIcon1);
    lockIcon1.style.left = '270px';
    lockIcon1.style.top = '10px';
    lockIcon1.style.opacity = '0';
    
    const lockIcon2 = createLockIcon();
    diagram.appendChild(lockIcon2);
    lockIcon2.style.left = '270px';
    lockIcon2.style.top = '80px';
    lockIcon2.style.opacity = '0';
    
    const lockIcon3 = createLockIcon();
    diagram.appendChild(lockIcon3);
    lockIcon3.style.left = '270px';
    lockIcon3.style.top = '150px';
    lockIcon3.style.opacity = '0';
    
    addLog(logContainer, 'Redlock算法演示已初始化');
    
    // 添加控制按钮的事件处理
    container.querySelector('.start-demo').addEventListener('click', () => 
        simulateRedlock(diagram, logContainer, [lockIcon1, lockIcon2, lockIcon3]));
}

async function simulateRedlock(diagram, logContainer, lockIcons) {
    const app1 = document.getElementById('redlock-app1');
    const redis1 = document.getElementById('redlock-redis1');
    const redis2 = document.getElementById('redlock-redis2');
    const redis3 = document.getElementById('redlock-redis3');
    const resource = document.getElementById('redlock-resource');
    
    addLog(logContainer, '开始演示Redlock算法', 'success');
    addLog(logContainer, '使用多个独立Redis节点实现更可靠的分布式锁');
    
    // 创建获取锁的消息
    const message1 = createMessage('SET lock:resource 锁ID NX PX 10000');
    const message2 = createMessage('SET lock:resource 锁ID NX PX 10000');
    const message3 = createMessage('SET lock:resource 锁ID NX PX 10000');
    
    diagram.appendChild(message1);
    diagram.appendChild(message2);
    diagram.appendChild(message3);
    
    message1.style.left = '80px';
    message1.style.top = '40px';
    message1.style.opacity = '0';
    
    message2.style.left = '80px';
    message2.style.top = '90px';
    message2.style.opacity = '0';
    
    message3.style.left = '80px';
    message3.style.top = '140px';
    message3.style.opacity = '0';
    
    // 开始获取锁
    addLog(logContainer, 'Application 尝试在多个Redis节点上获取锁');
    
    // 在Redis 1上获取锁
    message1.style.opacity = '1';
    await new Promise(resolve => setTimeout(resolve, 800));
    
    addLog(logContainer, '尝试在Redis 1上获取锁');
    await new Promise(resolve => setTimeout(resolve, 500));
    
    addLog(logContainer, 'Redis 1返回OK (成功)');
    lockIcons[0].style.opacity = '1';
    message1.style.opacity = '0';
    
    // 在Redis 2上获取锁
    message2.style.opacity = '1';
    await new Promise(resolve => setTimeout(resolve, 800));
    
    addLog(logContainer, '尝试在Redis 2上获取锁');
    await new Promise(resolve => setTimeout(resolve, 500));
    
    addLog(logContainer, 'Redis 2返回OK (成功)');
    lockIcons[1].style.opacity = '1';
    message2.style.opacity = '0';
    
    // 在Redis 3上获取锁
    message3.style.opacity = '1';
    await new Promise(resolve => setTimeout(resolve, 800));
    
    addLog(logContainer, '尝试在Redis 3上获取锁');
    await new Promise(resolve => setTimeout(resolve, 500));
    
    addLog(logContainer, 'Redis 3返回OK (成功)');
    lockIcons[2].style.opacity = '1';
    message3.style.opacity = '0';
    
    // 计算多数
    await new Promise(resolve => setTimeout(resolve, 800));
    addLog(logContainer, '已在3/3个Redis节点上获取锁 (多数)');
    addLog(logContainer, 'Application 成功获取分布式锁', 'success');
    
    // App1访问资源
    const line1 = drawLine(
        parseInt(app1.style.left) + 120,
        parseInt(app1.style.top) + 30,
        parseInt(resource.style.left),
        parseInt(resource.style.top) + 30
    );
    diagram.appendChild(line1);
    
    addLog(logContainer, 'Application 开始执行操作...');
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // 模拟一个Redis节点故障
    redis1.style.opacity = '0.5';
    redis1.style.border = '2px dashed #999';
    redis1.textContent = 'Redis 1 (故障)';
    lockIcons[0].style.opacity = '0.3';
    
    addLog(logContainer, 'Redis 1发生故障!', 'pending');
    await new Promise(resolve => setTimeout(resolve, 800));
    
    addLog(logContainer, '锁仍然有效 (在2/3个节点上)', 'success');
    addLog(logContainer, 'Application 继续安全执行操作');
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    addLog(logContainer, 'Application 完成操作, 释放锁');
    
    // 释放锁
    const releaseMsg2 = createMessage('DEL lock:resource');
    const releaseMsg3 = createMessage('DEL lock:resource');
    
    diagram.appendChild(releaseMsg2);
    diagram.appendChild(releaseMsg3);
    
    releaseMsg2.style.left = '80px';
    releaseMsg2.style.top = '90px';
    releaseMsg2.style.opacity = '1';
    
    releaseMsg3.style.left = '80px';
    releaseMsg3.style.top = '140px';
    releaseMsg3.style.opacity = '1';
    
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // 删除锁图标
    lockIcons[1].classList.add('unlocked');
    lockIcons[1].innerHTML = '🔓';
    lockIcons[2].classList.add('unlocked');
    lockIcons[2].innerHTML = '🔓';
    
    line1.remove();
    releaseMsg2.style.opacity = '0';
    releaseMsg3.style.opacity = '0';
    
    // 完成演示
    await new Promise(resolve => setTimeout(resolve, 1000));
    addLog(logContainer, '演示完成 - Redlock算法', 'success');
    addLog(logContainer, '即使在某个节点故障的情况下, 分布式锁仍然有效', 'success');
}

// 完整模拟演示
function initSimulation() {
    const container = document.getElementById('full-simulation');
    const view = document.getElementById('simulation-view');
    const logs = document.getElementById('simulation-logs');
    const strategySelect = document.getElementById('lock-strategy');
    const scenarioSelect = document.getElementById('lock-scenario');
    const resetButton = document.getElementById('reset-simulation');
    const startButton = document.getElementById('start-simulation');
    
    // 重置模拟
    resetButton.addEventListener('click', () => {
        view.innerHTML = '';
        logs.innerHTML = '';
        
        addLog(logs, '模拟已重置');
        addLog(logs, `选择的策略: ${strategySelect.value}`);
        addLog(logs, `选择的场景: ${scenarioSelect.value}`);
    });
    
    // 开始模拟
    startButton.addEventListener('click', () => {
        view.innerHTML = '';
        logs.innerHTML = '';
        
        addLog(logs, '开始分布式锁模拟', 'success');
        addLog(logs, `策略: ${strategySelect.value}`);
        addLog(logs, `场景: ${scenarioSelect.value}`);
        
        const strategy = strategySelect.value;
        const scenario = scenarioSelect.value;
        
        switch (strategy) {
            case 'redis-simple':
                if (scenario === 'normal') {
                    simulateRedisLockInView(view, logs);
                } else if (scenario === 'crash') {
                    simulateRedisLockWithCrash(view, logs);
                } else {
                    simulateRedisLockWithHighLoad(view, logs);
                }
                break;
                
            case 'redis-redlock':
                if (scenario === 'normal') {
                    simulateRedlockInView(view, logs);
                } else if (scenario === 'crash') {
                    simulateRedlockWithCrash(view, logs);
                } else {
                    simulateRedlockWithHighLoad(view, logs);
                }
                break;
                
            case 'zookeeper':
                if (scenario === 'normal') {
                    simulateZookeeperLockInView(view, logs);
                } else if (scenario === 'crash') {
                    simulateZookeeperLockWithCrash(view, logs);
                } else {
                    simulateZookeeperLockWithHighLoad(view, logs);
                }
                break;
                
            case 'database':
                if (scenario === 'normal') {
                    simulateDatabaseLockInView(view, logs);
                } else if (scenario === 'crash') {
                    simulateDatabaseLockWithCrash(view, logs);
                } else {
                    simulateDatabaseLockWithHighLoad(view, logs);
                }
                break;
        }
    });
}

// 简化版模拟演示功能 (实际模拟中会更详细实现)
async function simulateRedisLockInView(view, logs) {
    const app = createNode('sim-app', 'Application', 1);
    const redis = createNode('sim-redis', 'Redis', 3);
    const resource = createResource('sim-resource', 'Shared Resource');
    
    // 放置节点
    view.appendChild(app);
    view.appendChild(redis);
    view.appendChild(resource);
    
    // 定位节点
    app.style.left = '100px';
    app.style.top = '120px';
    redis.style.left = '300px';
    redis.style.top = '120px';
    resource.style.left = '500px';
    resource.style.top = '120px';
    
    // 添加锁图标
    const lockIcon = createLockIcon();
    view.appendChild(lockIcon);
    lockIcon.style.left = '320px';
    lockIcon.style.top = '90px';
    lockIcon.style.opacity = '0';
    
    // 执行获取锁和释放锁的演示过程
    await new Promise(resolve => setTimeout(resolve, 500));
    addLog(logs, 'Application 尝试获取锁');
    
    await new Promise(resolve => setTimeout(resolve, 800));
    lockIcon.style.opacity = '1';
    addLog(logs, 'Application 成功获取锁', 'success');
    
    const line = drawLine(
        parseInt(app.style.left) + 120,
        parseInt(app.style.top) + 30,
        parseInt(resource.style.left),
        parseInt(resource.style.top) + 30
    );
    view.appendChild(line);
    
    addLog(logs, 'Application 访问共享资源');
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    addLog(logs, 'Application 完成操作, 释放锁');
    line.remove();
    
    await new Promise(resolve => setTimeout(resolve, 800));
    lockIcon.classList.add('unlocked');
    lockIcon.innerHTML = '🔓';
    
    addLog(logs, '锁已释放', 'success');
    addLog(logs, '模拟完成');
}

// 初始化高级演示
document.addEventListener('DOMContentLoaded', function() {
    // 初始化挑战演示
    initDeadlockDemo();
    initReliabilityDemo();
    initRedlockDemo();
    
    // 初始化全局模拟
    initSimulation();
}); 