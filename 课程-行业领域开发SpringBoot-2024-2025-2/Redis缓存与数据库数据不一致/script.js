document.addEventListener('DOMContentLoaded', function() {
    // 初始化各个演示模块
    initProblemDemo();
    initCacheAsideDemo();
    initWriteThroughDemo();
    initWriteBehindDemo();
    initRefreshAheadDemo();
    initDoubleDeletionDemo();
    initMQDemo();
    initTTLDemo();
    initFullSimulation();
});

// 工具函数
function createEntity(container, type, position, label) {
    const entity = document.createElement('div');
    entity.className = type + '-entity';
    entity.textContent = label;
    entity.style.left = position.x + 'px';
    if (position.y) entity.style.top = position.y + 'px';
    container.appendChild(entity);
    return entity;
}

function createDataFlow(container, start, end, id) {
    const flow = document.createElement('div');
    flow.className = 'data-flow';
    flow.id = id;
    
    // 计算起点和终点
    const startX = start.x + 60; // 实体宽度的一半
    const startY = start.y + 30; // 实体高度的一半
    const endX = end.x + 60;
    const endY = end.y + 30;
    
    // 计算角度和长度
    const angle = Math.atan2(endY - startY, endX - startX);
    const length = Math.sqrt(Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2));
    
    // 设置位置和尺寸
    flow.style.width = '0px';
    flow.style.maxWidth = length + 'px';
    flow.style.left = startX + 'px';
    flow.style.top = startY + 'px';
    flow.style.transform = `rotate(${angle}rad)`;
    flow.style.transformOrigin = '0 0';
    
    container.appendChild(flow);
    return flow;
}

function animateDataFlow(flow, length, duration, callback) {
    flow.style.transition = `width ${duration}ms linear`;
    setTimeout(() => {
        flow.style.width = length + 'px';
    }, 50);
    
    setTimeout(() => {
        if (callback) callback();
    }, duration + 50);
}

function createDataValue(container, value, position) {
    const dataValue = document.createElement('div');
    dataValue.className = 'data-value';
    dataValue.textContent = value;
    dataValue.style.left = position.x + 'px';
    dataValue.style.top = position.y + 'px';
    container.appendChild(dataValue);
    return dataValue;
}

function moveElement(element, newPosition, duration, callback) {
    element.style.transition = `left ${duration}ms linear, top ${duration}ms linear`;
    element.style.left = newPosition.x + 'px';
    if (newPosition.y) element.style.top = newPosition.y + 'px';
    
    setTimeout(() => {
        if (callback) callback();
    }, duration);
}

function addLogMessage(logContainer, message) {
    const logEntry = document.createElement('div');
    logEntry.textContent = `[${new Date().toLocaleTimeString()}] ${message}`;
    logContainer.appendChild(logEntry);
    logContainer.scrollTop = logContainer.scrollHeight;
}

// 演示问题发生
function initProblemDemo() {
    const diagram = document.getElementById('problem-diagram');
    const button = document.getElementById('problem-demo-btn');
    
    if (!diagram || !button) return;
    
    button.addEventListener('click', function() {
        // 清空容器
        diagram.innerHTML = '';
        
        // 创建实体
        const cache = createEntity(diagram, 'cache', {x: 50, y: 30}, 'Redis缓存');
        const db = createEntity(diagram, 'db', {x: 300, y: 30}, '数据库');
        
        // 初始数据
        const cacheData = createDataValue(diagram, 'value=A', {x: 80, y: 100});
        const dbData = createDataValue(diagram, 'value=A', {x: 330, y: 100});
        
        // 演示步骤
        let step = 0;
        const steps = [
            // 步骤1: 用户1读取数据
            function() {
                const user1 = createDataValue(diagram, '用户1', {x: 20, y: 150});
                const readFlow = createDataFlow(diagram, {x: 20, y: 150}, {x: 50, y: 30}, 'read-flow');
                animateDataFlow(readFlow, 100, 500, steps[++step]);
                diagram.appendChild(createDataValue(diagram, '读取A', {x: 40, y: 130}));
            },
            // 步骤2: 用户2更新数据库
            function() {
                const user2 = createDataValue(diagram, '用户2', {x: 400, y: 150});
                const updateFlow = createDataFlow(diagram, {x: 400, y: 150}, {x: 300, y: 30}, 'update-flow');
                animateDataFlow(updateFlow, 100, 500, function() {
                    dbData.textContent = 'value=B';
                    steps[++step]();
                });
                diagram.appendChild(createDataValue(diagram, '更新为B', {x: 350, y: 130}));
            },
            // 步骤3: 数据不一致状态
            function() {
                diagram.appendChild(createDataValue(diagram, '数据不一致!', {x: 180, y: 170}));
                cacheData.style.backgroundColor = '#ffcccc';
                dbData.style.backgroundColor = '#ccffcc';
            }
        ];
        
        // 开始演示
        steps[step]();
    });
}

// Cache-Aside模式演示
function initCacheAsideDemo() {
    const diagram = document.getElementById('cache-aside-diagram');
    const button = document.getElementById('cache-aside-demo-btn');
    
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
            // 步骤1: 应用先删除缓存
            function() {
                const deleteFlow = createDataFlow(diagram, {x: 180, y: 10}, {x: 50, y: 100}, 'delete-flow');
                diagram.appendChild(createDataValue(diagram, '1. 删除缓存', {x: 130, y: 40}));
                animateDataFlow(deleteFlow, 150, 500, steps[++step]);
            },
            // 步骤2: 更新数据库
            function() {
                const updateFlow = createDataFlow(diagram, {x: 180, y: 10}, {x: 300, y: 100}, 'update-flow');
                diagram.appendChild(createDataValue(diagram, '2. 更新数据库', {x: 230, y: 40}));
                animateDataFlow(updateFlow, 150, 500, steps[++step]);
            },
            // 步骤3: 再次读取时先查缓存
            function() {
                diagram.appendChild(createDataValue(diagram, '3. 读取时先查缓存', {x: 120, y: 150}));
                const readCacheFlow = createDataFlow(diagram, {x: 180, y: 10}, {x: 50, y: 100}, 'read-cache-flow');
                animateDataFlow(readCacheFlow, 150, 500, steps[++step]);
            },
            // 步骤4: 缓存未命中，从数据库读取
            function() {
                diagram.appendChild(createDataValue(diagram, '4. 缓存未命中，读数据库', {x: 220, y: 150}));
                const readDBFlow = createDataFlow(diagram, {x: 180, y: 10}, {x: 300, y: 100}, 'read-db-flow');
                animateDataFlow(readDBFlow, 150, 500, steps[++step]);
            },
            // 步骤5: 将数据库数据写入缓存
            function() {
                diagram.appendChild(createDataValue(diagram, '5. 写入缓存', {x: 170, y: 70}));
                const writeCacheFlow = createDataFlow(diagram, {x: 180, y: 10}, {x: 50, y: 100}, 'write-cache-flow');
                animateDataFlow(writeCacheFlow, 150, 500, null);
            }
        ];
        
        // 开始演示
        steps[step]();
    });
}

// Write-Through模式演示
function initWriteThroughDemo() {
    const diagram = document.getElementById('write-through-diagram');
    const button = document.getElementById('write-through-demo-btn');
    
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
            // 步骤1: 应用同时更新数据库和缓存
            function() {
                const updateDBFlow = createDataFlow(diagram, {x: 180, y: 10}, {x: 300, y: 100}, 'update-db-flow');
                const updateCacheFlow = createDataFlow(diagram, {x: 180, y: 10}, {x: 50, y: 100}, 'update-cache-flow');
                
                diagram.appendChild(createDataValue(diagram, '1. 同时更新', {x: 180, y: 40}));
                
                animateDataFlow(updateDBFlow, 150, 500, null);
                animateDataFlow(updateCacheFlow, 150, 500, steps[++step]);
            },
            // 步骤2: 读取数据时直接从缓存获取
            function() {
                const readFlow = createDataFlow(diagram, {x: 180, y: 10}, {x: 50, y: 100}, 'read-flow');
                diagram.appendChild(createDataValue(diagram, '2. 直接读缓存', {x: 120, y: 70}));
                animateDataFlow(readFlow, 150, 500, null);
            }
        ];
        
        // 开始演示
        steps[step]();
    });
}

// Write-Behind模式演示
function initWriteBehindDemo() {
    const diagram = document.getElementById('write-behind-diagram');
    const button = document.getElementById('write-behind-demo-btn');
    
    if (!diagram || !button) return;
    
    button.addEventListener('click', function() {
        // 清空容器
        diagram.innerHTML = '';
        
        // 创建实体
        const app = createEntity(diagram, 'cache', {x: 180, y: 10}, '应用');
        const cache = createEntity(diagram, 'cache', {x: 50, y: 100}, 'Redis缓存');
        const queue = createEntity(diagram, 'cache', {x: 180, y: 100}, '更新队列');
        const db = createEntity(diagram, 'db', {x: 300, y: 100}, '数据库');
        
        // 演示步骤
        let step = 0;
        const steps = [
            // 步骤1: 应用更新缓存
            function() {
                const updateCacheFlow = createDataFlow(diagram, {x: 180, y: 10}, {x: 50, y: 100}, 'update-cache-flow');
                diagram.appendChild(createDataValue(diagram, '1. 更新缓存', {x: 100, y: 40}));
                animateDataFlow(updateCacheFlow, 150, 500, steps[++step]);
            },
            // 步骤2: 将更新操作放入队列
            function() {
                const updateQueueFlow = createDataFlow(diagram, {x: 180, y: 10}, {x: 180, y: 100}, 'update-queue-flow');
                diagram.appendChild(createDataValue(diagram, '2. 放入队列', {x: 190, y: 40}));
                animateDataFlow(updateQueueFlow, 80, 500, steps[++step]);
            },
            // 步骤3: 异步批量更新数据库
            function() {
                const updateDBFlow = createDataFlow(diagram, {x: 180, y: 100}, {x: 300, y: 100}, 'update-db-flow');
                diagram.appendChild(createDataValue(diagram, '3. 异步批量更新', {x: 230, y: 120}));
                animateDataFlow(updateDBFlow, 120, 1000, null);
            }
        ];
        
        // 开始演示
        steps[step]();
    });
}

// Refresh-Ahead模式演示
function initRefreshAheadDemo() {
    const diagram = document.getElementById('refresh-ahead-diagram');
    const button = document.getElementById('refresh-ahead-demo-btn');
    
    if (!diagram || !button) return;
    
    button.addEventListener('click', function() {
        // 清空容器
        diagram.innerHTML = '';
        
        // 创建实体
        const scheduler = createEntity(diagram, 'cache', {x: 180, y: 10}, '定时任务');
        const cache = createEntity(diagram, 'cache', {x: 50, y: 100}, 'Redis缓存');
        const db = createEntity(diagram, 'db', {x: 300, y: 100}, '数据库');
        
        // 演示步骤
        let step = 0;
        const steps = [
            // 步骤1: 检查热点数据过期时间
            function() {
                const checkFlow = createDataFlow(diagram, {x: 180, y: 10}, {x: 50, y: 100}, 'check-flow');
                diagram.appendChild(createDataValue(diagram, '1. 检查热点数据TTL', {x: 80, y: 40}));
                animateDataFlow(checkFlow, 150, 500, steps[++step]);
            },
            // 步骤2: 识别即将过期的数据
            function() {
                diagram.appendChild(createDataValue(diagram, '2. 找到即将过期数据', {x: 70, y: 150}));
                setTimeout(steps[++step], 500);
            },
            // 步骤3: 主动从数据库刷新数据
            function() {
                const refreshFlow1 = createDataFlow(diagram, {x: 180, y: 10}, {x: 300, y: 100}, 'refresh-flow1');
                diagram.appendChild(createDataValue(diagram, '3. 主动读取新数据', {x: 210, y: 40}));
                animateDataFlow(refreshFlow1, 150, 500, steps[++step]);
            },
            // 步骤4: 更新缓存
            function() {
                const refreshFlow2 = createDataFlow(diagram, {x: 180, y: 10}, {x: 50, y: 100}, 'refresh-flow2');
                diagram.appendChild(createDataValue(diagram, '4. 更新缓存', {x: 130, y: 70}));
                animateDataFlow(refreshFlow2, 150, 500, steps[++step]);
            },
            // 步骤5: 用户访问时直接命中新数据
            function() {
                const user = createDataValue(diagram, '用户', {x: 20, y: 20});
                const userReadFlow = createDataFlow(diagram, {x: 20, y: 20}, {x: 50, y: 100}, 'user-read-flow');
                diagram.appendChild(createDataValue(diagram, '5. 命中新数据', {x: 20, y: 50}));
                animateDataFlow(userReadFlow, 50, 300, null);
            }
        ];
        
        // 开始演示
        steps[step]();
    });
}

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