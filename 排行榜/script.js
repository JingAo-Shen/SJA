// 工具函数
function createElement(type, className, text) {
    const element = document.createElement(type);
    if (className) {
        element.className = className;
    }
    if (text) {
        element.textContent = text;
    }
    return element;
}

function createNode(id, text, type = '') {
    const node = createElement('div', `node ${type}`, text);
    node.id = id;
    return node;
}

function createMessage(text, type = '') {
    const message = createElement('div', `message ${type}`, text);
    return message;
}

function drawLine(x1, y1, x2, y2, id = '', type = '') {
    const length = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
    const angle = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;
    
    const line = createElement('div', `line ${type}`);
    line.style.width = `${length}px`;
    line.style.left = `${x1}px`;
    line.style.top = `${y1}px`;
    line.style.transform = `rotate(${angle}deg)`;
    
    if (id) {
        line.id = id;
    }
    
    return line;
}

function addLog(logContainer, message, type = 'info') {
    const logEntry = createElement('div', `log-entry ${type}`, message);
    logContainer.appendChild(logEntry);
    logContainer.scrollTop = logContainer.scrollHeight;
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function getNodePosition(node) {
    const rect = node.getBoundingClientRect();
    const containerRect = node.parentElement.getBoundingClientRect();
    return {
        x: rect.left - containerRect.left + rect.width / 2,
        y: rect.top - containerRect.top + rect.height / 2
    };
}

function clearDiagram(diagram) {
    while (diagram.firstChild) {
        diagram.removeChild(diagram.firstChild);
    }
}

function createLogContainer() {
    return createElement('div', 'log-container');
}

function createLeaderboardTable(data, columns) {
    const table = createElement('table', 'leaderboard-table');
    
    // 创建表头
    const thead = createElement('thead');
    const headerRow = createElement('tr');
    columns.forEach(column => {
        const th = createElement('th', '', column);
        headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    table.appendChild(thead);
    
    // 创建表体
    const tbody = createElement('tbody');
    data.forEach((row, index) => {
        const tr = createElement('tr');
        tr.appendChild(createElement('td', '', `${index + 1}`)); // 排名
        tr.appendChild(createElement('td', '', row.name)); // 名称
        tr.appendChild(createElement('td', '', row.score)); // 分数
        tbody.appendChild(tr);
    });
    table.appendChild(tbody);
    
    return table;
}

// 动画效果
async function animateMessage(message, startNode, endNode, duration = 1000) {
    const start = getNodePosition(startNode);
    const end = getNodePosition(endNode);
    
    message.style.left = `${start.x}px`;
    message.style.top = `${start.y}px`;
    
    await sleep(100); // 等待DOM更新
    
    message.style.transition = `all ${duration}ms ease`;
    message.style.left = `${end.x}px`;
    message.style.top = `${end.y}px`;
    
    await sleep(duration);
    message.remove();
}

async function activateNode(node, duration = 500) {
    node.classList.add('active');
    await sleep(duration);
    node.classList.remove('active');
}

async function activateLine(line, duration = 500) {
    line.classList.add('active');
    await sleep(duration);
    line.classList.remove('active');
}

// 布局函数
function arrangeNodesInCircle(nodes, centerX, centerY, radius) {
    const angleStep = (2 * Math.PI) / nodes.length;
    nodes.forEach((node, index) => {
        const angle = angleStep * index;
        const x = centerX + radius * Math.cos(angle) - node.offsetWidth / 2;
        const y = centerY + radius * Math.sin(angle) - node.offsetHeight / 2;
        node.style.left = `${x}px`;
        node.style.top = `${y}px`;
    });
}

function arrangeNodesInGrid(nodes, containerWidth, containerHeight, rows, cols) {
    const cellWidth = containerWidth / cols;
    const cellHeight = containerHeight / rows;
    
    nodes.forEach((node, index) => {
        const row = Math.floor(index / cols);
        const col = index % cols;
        const x = col * cellWidth + (cellWidth - node.offsetWidth) / 2;
        const y = row * cellHeight + (cellHeight - node.offsetHeight) / 2;
        node.style.left = `${x}px`;
        node.style.top = `${y}px`;
    });
}

// 初始化代码
document.addEventListener('DOMContentLoaded', () => {
    // 平滑滚动
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // 初始化演示按钮
    const demoButtons = document.querySelectorAll('.demo-button');
    demoButtons.forEach(button => {
        button.addEventListener('click', async () => {
            const demoType = button.getAttribute('data-demo');
            const diagram = button.closest('.animation-container').querySelector('.diagram');
            
            // 禁用按钮，防止重复点击
            button.disabled = true;
            
            try {
                // 根据演示类型调用相应的初始化函数
                switch (demoType) {
                    case 'basic-structure':
                        await initBasicStructureDemo(diagram);
                        break;
                    case 'real-time':
                        await initRealTimeDemo(diagram);
                        break;
                    case 'periodic':
                        await initPeriodicDemo(diagram);
                        break;
                    case 'historical':
                        await initHistoricalDemo(diagram);
                        break;
                    case 'redis-zset':
                        await initRedisZSetDemo(diagram);
                        break;
                    case 'mysql':
                        await initMySQLDemo(diagram);
                        break;
                    case 'hybrid':
                        await initHybridDemo(diagram);
                        break;
                    case 'cache':
                        await initCachingDemo(diagram);
                        break;
                    case 'batch':
                        await initBatchUpdateDemo(diagram);
                        break;
                    case 'sharding':
                        await initShardingDemo(diagram);
                        break;
                }
            } catch (error) {
                console.error('演示出错:', error);
                addLog(diagram.querySelector('.log-container'), 
                    `演示出错: ${error.message}`, 'error');
            } finally {
                // 重新启用按钮
                button.disabled = false;
            }
        });
    });
}); 