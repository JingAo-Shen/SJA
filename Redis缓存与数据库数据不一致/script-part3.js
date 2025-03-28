// 完整模拟
function initFullSimulation() {
    const simulationView = document.getElementById('simulation-view');
    const simulationLogs = document.getElementById('simulation-logs');
    const strategySelect = document.getElementById('strategy-select');
    const startButton = document.getElementById('start-simulation');
    const resetButton = document.getElementById('reset-simulation');
    
    if (!simulationView || !simulationLogs || !strategySelect || !startButton || !resetButton) return;
    
    // 重置模拟
    resetButton.addEventListener('click', function() {
        simulationView.innerHTML = '';
        simulationLogs.innerHTML = '';
        
        // 创建基础实体
        createEntity(simulationView, 'cache', {x: 50, y: 30}, 'Redis缓存');
        createEntity(simulationView, 'db', {x: 300, y: 30}, '数据库');
        
        // 初始数据
        createDataValue(simulationView, 'value=A', {x: 80, y: 100});
        createDataValue(simulationView, 'value=A', {x: 330, y: 100});
        
        addLogMessage(simulationLogs, '系统已重置。缓存值=A，数据库值=A');
    });
    
    // 开始模拟
    startButton.addEventListener('click', function() {
        const strategy = strategySelect.value;
        
        // 确保已初始化
        if (simulationView.children.length === 0) {
            resetButton.click();
        }
        
        // 根据选择的策略执行不同的模拟
        switch (strategy) {
            case 'cache-aside':
                simulateCacheAside();
                break;
            case 'write-through':
                simulateWriteThrough();
                break;
            case 'write-behind':
                simulateWriteBehind();
                break;
            case 'double-deletion':
                simulateDoubleDeletion();
                break;
            case 'mq':
                simulateMQ();
                break;
            case 'ttl':
                simulateTTL();
                break;
        }
    });
    
    // 初始化
    resetButton.click();
    
    // 模拟各种策略
    function simulateCacheAside() {
        const client1 = createDataValue(simulationView, '客户端1(更新)', {x: 180, y: 120});
        addLogMessage(simulationLogs, '客户端1准备更新数据 A -> B');
        
        // 1. 删除缓存
        setTimeout(() => {
            addLogMessage(simulationLogs, '客户端1先删除缓存');
            simulationView.querySelector('.data-value').textContent = '';
        }, 1000);
        
        // 2. 更新数据库
        setTimeout(() => {
            addLogMessage(simulationLogs, '客户端1更新数据库 A -> B');
            const dbValue = simulationView.querySelectorAll('.data-value')[1];
            dbValue.textContent = 'value=B';
        }, 2000);
        
        // 3. 客户端2读取
        setTimeout(() => {
            const client2 = createDataValue(simulationView, '客户端2(读取)', {x: 400, y: 120});
            addLogMessage(simulationLogs, '客户端2请求读取数据');
        }, 3000);
        
        // 4. 缓存未命中，从数据库读取
        setTimeout(() => {
            addLogMessage(simulationLogs, '缓存未命中，从数据库读取');
        }, 3500);
        
        // 5. 更新缓存
        setTimeout(() => {
            addLogMessage(simulationLogs, '将数据库值(B)写入缓存');
            simulationView.querySelector('.data-value').textContent = 'value=B';
            addLogMessage(simulationLogs, '客户端2读取到最新值B');
            addLogMessage(simulationLogs, '✅ 缓存和数据库保持一致');
        }, 4000);
    }
    
    function simulateWriteThrough() {
        const client = createDataValue(simulationView, '客户端(更新)', {x: 180, y: 120});
        addLogMessage(simulationLogs, '客户端准备更新数据 A -> B');
        
        // 同时更新缓存和数据库
        setTimeout(() => {
            addLogMessage(simulationLogs, '同时更新缓存和数据库 A -> B');
            
            const cacheValue = simulationView.querySelector('.data-value');
            const dbValue = simulationView.querySelectorAll('.data-value')[1];
            
            cacheValue.textContent = 'value=B';
            dbValue.textContent = 'value=B';
            
            addLogMessage(simulationLogs, '✅ 更新完成，缓存和数据库始终保持一致');
        }, 1000);
    }
    
    function simulateWriteBehind() {
        const client = createDataValue(simulationView, '客户端(更新)', {x: 180, y: 120});
        addLogMessage(simulationLogs, '客户端准备更新数据 A -> B');
        
        // 1. 更新缓存
        setTimeout(() => {
            addLogMessage(simulationLogs, '立即更新缓存 A -> B');
            const cacheValue = simulationView.querySelector('.data-value');
            cacheValue.textContent = 'value=B';
            addLogMessage(simulationLogs, '将更新操作加入队列');
        }, 1000);
        
        // 2. 数据暂时不一致
        setTimeout(() => {
            addLogMessage(simulationLogs, '⚠️ 此时缓存为B，数据库仍为A');
        }, 2000);
        
        // 3. 异步更新数据库
        setTimeout(() => {
            addLogMessage(simulationLogs, '异步批量更新数据库 A -> B');
            const dbValue = simulationView.querySelectorAll('.data-value')[1];
            dbValue.textContent = 'value=B';
            addLogMessage(simulationLogs, '✅ 更新完成，缓存和数据库最终一致');
        }, 3000);
    }
    
    function simulateDoubleDeletion() {
        const client = createDataValue(simulationView, '客户端(更新)', {x: 180, y: 120});
        addLogMessage(simulationLogs, '客户端准备更新数据 A -> B');
        
        // 1. 先删除缓存
        setTimeout(() => {
            addLogMessage(simulationLogs, '1. 先删除缓存');
            simulationView.querySelector('.data-value').textContent = '';
        }, 1000);
        
        // 2. 更新数据库
        setTimeout(() => {
            addLogMessage(simulationLogs, '2. 更新数据库 A -> B');
            const dbValue = simulationView.querySelectorAll('.data-value')[1];
            dbValue.textContent = 'value=B';
        }, 2000);
        
        // 3. 并发读取模拟
        setTimeout(() => {
            const client2 = createDataValue(simulationView, '客户端2(读取)', {x: 400, y: 120});
            addLogMessage(simulationLogs, '同时，客户端2并发读取数据');
            addLogMessage(simulationLogs, '发现缓存不存在，从数据库读取值B');
            addLogMessage(simulationLogs, '客户端2将B写入缓存');
            simulationView.querySelector('.data-value').textContent = 'value=B';
        }, 2500);
        
        // 4. 延时删除
        setTimeout(() => {
            addLogMessage(simulationLogs, '3. 延时再次删除缓存');
            simulationView.querySelector('.data-value').textContent = '';
        }, 3500);
        
        // 5. 后续读取
        setTimeout(() => {
            addLogMessage(simulationLogs, '后续读取操作会从数据库读取最新值B并更新缓存');
            simulationView.querySelector('.data-value').textContent = 'value=B';
            addLogMessage(simulationLogs, '✅ 通过双删策略避免了脏数据');
        }, 4500);
    }
    
    function simulateMQ() {
        const client = createDataValue(simulationView, '客户端(更新)', {x: 180, y: 120});
        addLogMessage(simulationLogs, '客户端准备更新数据 A -> B');
        
        // 1. 更新数据库
        setTimeout(() => {
            addLogMessage(simulationLogs, '1. 更新数据库 A -> B');
            const dbValue = simulationView.querySelectorAll('.data-value')[1];
            dbValue.textContent = 'value=B';
        }, 1000);
        
        // 2. 发送消息到队列
        setTimeout(() => {
            addLogMessage(simulationLogs, '2. 发送缓存失效消息到消息队列');
        }, 2000);
        
        // 3. 数据暂时不一致
        setTimeout(() => {
            addLogMessage(simulationLogs, '⚠️ 此时缓存为A，数据库为B');
        }, 2500);
        
        // 4. 消费消息并删除缓存
        setTimeout(() => {
            addLogMessage(simulationLogs, '3. 消息队列消费者接收到消息');
            addLogMessage(simulationLogs, '4. 删除缓存');
            simulationView.querySelector('.data-value').textContent = '';
        }, 3000);
        
        // 5. 后续读取
        setTimeout(() => {
            addLogMessage(simulationLogs, '后续读取操作会从数据库读取最新值B并更新缓存');
            simulationView.querySelector('.data-value').textContent = 'value=B';
            addLogMessage(simulationLogs, '✅ 通过消息队列实现最终一致性');
        }, 4000);
    }
    
    function simulateTTL() {
        const client = createDataValue(simulationView, '客户端(更新)', {x: 180, y: 120});
        addLogMessage(simulationLogs, '客户端准备更新数据 A -> B，缓存TTL=5分钟');
        
        // 为缓存标注TTL
        const ttlLabel = createDataValue(simulationView, 'TTL: 5分钟', {x: 70, y: 140});
        
        // 1. 只更新数据库
        setTimeout(() => {
            addLogMessage(simulationLogs, '1. 只更新数据库 A -> B，不操作缓存');
            const dbValue = simulationView.querySelectorAll('.data-value')[1];
            dbValue.textContent = 'value=B';
        }, 1000);
        
        // 2. 数据暂时不一致
        setTimeout(() => {
            addLogMessage(simulationLogs, '⚠️ 此时缓存为A，数据库为B，出现不一致');
        }, 2000);
        
        // 3. 模拟TTL递减
        let time = 5;
        const interval = setInterval(() => {
            time--;
            ttlLabel.textContent = `TTL: ${time}分钟`;
            
            if (time <= 0) {
                clearInterval(interval);
                ttlLabel.textContent = 'TTL: 已过期';
                ttlLabel.style.backgroundColor = '#ffcccc';
                
                // 缓存过期
                setTimeout(() => {
                    addLogMessage(simulationLogs, '2. 缓存已过期');
                    simulationView.querySelector('.data-value').textContent = '';
                }, 500);
                
                // 后续读取
                setTimeout(() => {
                    const client2 = createDataValue(simulationView, '客户端2(读取)', {x: 400, y: 120});
                    addLogMessage(simulationLogs, '3. 客户端2读取数据，发现缓存已过期');
                    addLogMessage(simulationLogs, '4. 从数据库读取最新值B');
                    addLogMessage(simulationLogs, '5. 更新缓存并设置新TTL');
                    simulationView.querySelector('.data-value').textContent = 'value=B';
                    ttlLabel.textContent = 'TTL: 5分钟';
                    ttlLabel.style.backgroundColor = 'white';
                    addLogMessage(simulationLogs, '✅ 通过TTL机制实现最终一致性');
                }, 1500);
            }
        }, 800);
    }
} 