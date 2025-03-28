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

// 创建表格结构
function createTable(columns, rows) {
    const table = createElement('table', 'data-table');
    
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
    rows.forEach(row => {
        const tr = createElement('tr');
        row.forEach(cell => {
            const td = createElement('td', '', cell);
            tr.appendChild(td);
        });
        tbody.appendChild(tr);
    });
    table.appendChild(tbody);
    
    return table;
}

// 创建执行计划可视化
function createExecutionPlan(plan) {
    const container = createElement('div', 'execution-plan');
    
    function renderNode(node, level = 0) {
        const nodeElement = createElement('div', 'plan-node');
        nodeElement.style.marginLeft = `${level * 20}px`;
        
        const content = createElement('div', 'plan-content');
        content.innerHTML = `
            <div class="plan-type">${node.type}</div>
            <div class="plan-details">
                ${Object.entries(node.details || {}).map(([key, value]) => 
                    `<div><span>${key}:</span> ${value}</div>`
                ).join('')}
            </div>
        `;
        
        nodeElement.appendChild(content);
        
        if (node.children) {
            node.children.forEach(child => {
                nodeElement.appendChild(renderNode(child, level + 1));
            });
        }
        
        return nodeElement;
    }
    
    container.appendChild(renderNode(plan));
    return container;
}

// 创建性能指标图表
function createPerformanceChart(data) {
    const container = createElement('div', 'performance-chart');
    
    // 这里可以使用Canvas或SVG绘制图表
    // 为了简单演示，我们使用div模拟
    const chart = createElement('div', 'chart');
    
    data.forEach(item => {
        const bar = createElement('div', 'chart-bar');
        bar.style.height = `${item.value}%`;
        bar.title = `${item.label}: ${item.value}`;
        chart.appendChild(bar);
    });
    
    container.appendChild(chart);
    return container;
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    // 添加平滑滚动
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
    
    // 初始化代码高亮
    document.querySelectorAll('pre code').forEach(block => {
        block.innerHTML = block.innerHTML
            .replace(/SELECT/g, '<span class="keyword">SELECT</span>')
            .replace(/FROM/g, '<span class="keyword">FROM</span>')
            .replace(/WHERE/g, '<span class="keyword">WHERE</span>')
            .replace(/JOIN/g, '<span class="keyword">JOIN</span>')
            .replace(/GROUP BY/g, '<span class="keyword">GROUP BY</span>')
            .replace(/ORDER BY/g, '<span class="keyword">ORDER BY</span>')
            .replace(/LIMIT/g, '<span class="keyword">LIMIT</span>');
    });
}); 