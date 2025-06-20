// 双删策略演示
function initDoubleDeletionDemo() {
    const diagram = document.getElementById('double-deletion-diagram');
    const button = document.getElementById('double-deletion-demo-btn');
    
    if (!diagram || !button) return;
    
    button.addEventListener('click', function() {
        // 清空容器
        diagram.innerHTML = '';
        
        // 创建实体
        const app = createEntity(diagram, 'cache', {x: 180, y: 10}, '应用');
        const cache = createEntity(diagram, 'cache', {x: 50, y: 100}, 'Redis缓存');
        const db = createEntity(diagram, 'db', {x: 300, y: 100}, '数据库');
        
        // 演示步骤
        let step = 0;
        const steps = [
            // 步骤1: 先删除缓存
            function() {
                const deleteFlow = createDataFlow(diagram, {x: 180, y: 10}, {x: 50, y: 100}, 'delete-flow');
                diagram.appendChild(createDataValue(diagram, '1. 先删除缓存', {x: 100, y: 40}));
                animateDataFlow(deleteFlow, 150, 500, steps[++step]);
            },
            // 步骤2: 更新数据库
            function() {
                const updateFlow = createDataFlow(diagram, {x: 180, y: 10}, {x: 300, y: 100}, 'update-flow');
                diagram.appendChild(createDataValue(diagram, '2. 更新数据库', {x: 230, y: 40}));
                animateDataFlow(updateFlow, 150, 500, steps[++step]);
            },
            // 步骤3: 延时再次删除缓存
            function() {
                // 显示等待
                const waitingMsg = createDataValue(diagram, '等待一段时间...', {x: 170, y: 150});
                
                setTimeout(function() {
                    waitingMsg.remove();
                    const deleteAgainFlow = createDataFlow(diagram, {x: 180, y: 10}, {x: 50, y: 100}, 'delete-again-flow');
                    diagram.appendChild(createDataValue(diagram, '3. 延时再次删除缓存', {x: 80, y: 70}));
                    animateDataFlow(deleteAgainFlow, 150, 500, null);
                }, 1500);
            }
        ];
        
        // 开始演示
        steps[step]();
    });
}

// 消息队列策略演示
function initMQDemo() {
    const diagram = document.getElementById('mq-diagram');
    const button = document.getElementById('mq-demo-btn');
    
    if (!diagram || !button) return;
    
    button.addEventListener('click', function() {
        // 清空容器
        diagram.innerHTML = '';
        
        // 创建实体
        const app = createEntity(diagram, 'cache', {x: 180, y: 10}, '应用');
        const cache = createEntity(diagram, 'cache', {x: 50, y: 100}, 'Redis缓存');
        const mq = createEntity(diagram, 'cache', {x: 180, y: 100}, '消息队列');
        const db = createEntity(diagram, 'db', {x: 300, y: 100}, '数据库');
        
        // 演示步骤
        let step = 0;
        const steps = [
            // 步骤1: 更新数据库
            function() {
                const updateFlow = createDataFlow(diagram, {x: 180, y: 10}, {x: 300, y: 100}, 'update-flow');
                diagram.appendChild(createDataValue(diagram, '1. 更新数据库', {x: 230, y: 40}));
                animateDataFlow(updateFlow, 150, 500, steps[++step]);
            },
            // 步骤2: 发送消息到队列
            function() {
                const sendMsgFlow = createDataFlow(diagram, {x: 180, y: 10}, {x: 180, y: 100}, 'send-msg-flow');
                diagram.appendChild(createDataValue(diagram, '2. 发送缓存失效消息', {x: 190, y: 40}));
                animateDataFlow(sendMsgFlow, 80, 500, steps[++step]);
            },
            // 步骤3: 消费消息并删除缓存
            function() {
                const consumeFlow = createDataFlow(diagram, {x: 180, y: 100}, {x: 50, y: 100}, 'consume-flow');
                diagram.appendChild(createDataValue(diagram, '3. 消费消息并删除缓存', {x: 100, y: 130}));
                animateDataFlow(consumeFlow, 130, 1000, null);
            }
        ];
        
        // 开始演示
        steps[step]();
    });
}

// TTL策略演示
function initTTLDemo() {
    const diagram = document.getElementById('ttl-diagram');
    const button = document.getElementById('ttl-demo-btn');
    
    if (!diagram || !button) return;
    
    button.addEventListener('click', function() {
        // 清空容器
        diagram.innerHTML = '';
        
        // 创建实体
        const app = createEntity(diagram, 'cache', {x: 180, y: 10}, '应用');
        const cache = createEntity(diagram, 'cache', {x: 50, y: 100}, 'Redis缓存(TTL=5分钟)');
        const db = createEntity(diagram, 'db', {x: 300, y: 100}, '数据库');
        
        // 演示步骤
        let step = 0;
        const steps = [
            // 步骤1: 更新数据库，不更新缓存
            function() {
                const updateFlow = createDataFlow(diagram, {x: 180, y: 10}, {x: 300, y: 100}, 'update-flow');
                diagram.appendChild(createDataValue(diagram, '1. 只更新数据库', {x: 230, y: 40}));
                animateDataFlow(updateFlow, 150, 500, steps[++step]);
            },
            // 步骤2: 等待缓存过期
            function() {
                const ttlMsg = createDataValue(diagram, '2. 等待缓存自动过期...', {x: 90, y: 150});
                
                // 模拟TTL倒计时
                const ttl = createDataValue(diagram, 'TTL: 5分钟', {x: 50, y: 170});
                let time = 5;
                
                const interval = setInterval(function() {
                    time--;
                    ttl.textContent = `TTL: ${time}分钟`;
                    
                    if (time <= 0) {
                        clearInterval(interval);
                        ttl.textContent = 'TTL: 已过期';
                        ttl.style.backgroundColor = '#ffcccc';
                        setTimeout(steps[++step], 500);
                    }
                }, 600);
            },
            // 步骤3: 再次访问时从数据库重新加载
            function() {
                const readCacheFlow = createDataFlow(diagram, {x: 180, y: 10}, {x: 50, y: 100}, 'read-cache-flow');
                diagram.appendChild(createDataValue(diagram, '3. 再次访问，缓存未命中', {x: 75, y: 40}));
                animateDataFlow(readCacheFlow, 150, 500, steps[++step]);
            },
            // 步骤4: 从数据库获取最新数据
            function() {
                const readDBFlow = createDataFlow(diagram, {x: 180, y: 10}, {x: 300, y: 100}, 'read-db-flow');
                diagram.appendChild(createDataValue(diagram, '4. 从数据库读取新数据', {x: 230, y: 60}));
                animateDataFlow(readDBFlow, 150, 500, steps[++step]);
            },
            // 步骤5: 更新缓存
            function() {
                const updateCacheFlow = createDataFlow(diagram, {x: 180, y: 10}, {x: 50, y: 100}, 'update-cache-flow');
                diagram.appendChild(createDataValue(diagram, '5. 更新缓存并设置新TTL', {x: 90, y: 70}));
                animateDataFlow(updateCacheFlow, 150, 500, null);
            }
        ];
        
        // 开始演示
        steps[step]();
    });
} 