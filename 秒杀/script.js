document.addEventListener('DOMContentLoaded', function() {
    // 初始化架构图
    initArchitectureGraph();
    
    // 初始化流程演示
    initFlowDemo();
    
    // 初始化性能对比图表
    initPerformanceChart();
    
    // 绑定按钮事件
    document.getElementById('start-flow').addEventListener('click', startArchitectureFlow);
    document.getElementById('reset-flow').addEventListener('click', resetArchitectureFlow);
    document.getElementById('next-stage').addEventListener('click', nextFlowStage);
    document.getElementById('reset-stages').addEventListener('click', resetFlowStages);
});

// 架构图相关变量和常量
let svg, nodes, links, simulation;
let activeNodeIndex = -1;
let isFlowRunning = false;
let requestParticles = [];
let animationFrameId;

// 架构组件数据
const architectureComponents = [
    { id: 'users', name: '用户', x: 100, y: 50, type: 'source' },
    { id: 'cdn', name: 'CDN', x: 250, y: 50, type: 'service' },
    { id: 'gateway', name: 'API网关', x: 400, y: 50, type: 'service' },
    { id: 'web', name: 'Web服务', x: 550, y: 50, type: 'service' },
    { id: 'cache', name: 'Redis缓存', x: 400, y: 150, type: 'storage' },
    { id: 'queue', name: '消息队列', x: 550, y: 150, type: 'queue' },
    { id: 'order', name: '订单服务', x: 700, y: 150, type: 'service' },
    { id: 'inventory', name: '库存服务', x: 550, y: 250, type: 'service' },
    { id: 'database', name: '数据库', x: 700, y: 250, type: 'storage' }
];

// 架构连接数据
const architectureLinks = [
    { source: 'users', target: 'cdn' },
    { source: 'cdn', target: 'gateway' },
    { source: 'gateway', target: 'web' },
    { source: 'web', target: 'cache' },
    { source: 'web', target: 'queue' },
    { source: 'queue', target: 'order' },
    { source: 'queue', target: 'inventory' },
    { source: 'order', target: 'database' },
    { source: 'inventory', target: 'database' },
    { source: 'cache', target: 'inventory' }
];

// 初始化架构图
function initArchitectureGraph() {
    const container = document.getElementById('architecture-container');
    const width = container.clientWidth;
    const height = container.clientHeight;
    
    svg = d3.select('#architecture-container')
        .append('svg')
        .attr('width', width)
        .attr('height', height);
    
    // 创建箭头标记
    svg.append('defs').append('marker')
        .attr('id', 'arrowhead')
        .attr('viewBox', '0 -5 10 10')
        .attr('refX', 20)
        .attr('refY', 0)
        .attr('orient', 'auto')
        .attr('markerWidth', 6)
        .attr('markerHeight', 6)
        .append('path')
        .attr('d', 'M0,-5L10,0L0,5')
        .attr('fill', '#9fa8da');
    
    // 创建连接线
    links = svg.selectAll('.node-link')
        .data(architectureLinks)
        .enter()
        .append('path')
        .attr('class', 'node-link')
        .attr('marker-end', 'url(#arrowhead)');
    
    // 创建节点
    const nodeElements = svg.selectAll('.system-node')
        .data(architectureComponents)
        .enter()
        .append('g')
        .attr('transform', d => `translate(${d.x}, ${d.y})`);
    
    nodes = nodeElements.append('circle')
        .attr('class', 'system-node')
        .attr('r', 30)
        .attr('id', d => d.id);
    
    // 添加节点文本
    nodeElements.append('text')
        .attr('class', 'node-text')
        .attr('dy', 5)
        .text(d => d.name);
    
    // 更新连接线的路径
    updateLinkPaths();
}

// 更新连接线路径
function updateLinkPaths() {
    links.attr('d', function(d) {
        const source = architectureComponents.find(node => node.id === d.source);
        const target = architectureComponents.find(node => node.id === d.target);
        
        return `M${source.x},${source.y} L${target.x},${target.y}`;
    });
}

// 开始架构流程演示
function startArchitectureFlow() {
    if (isFlowRunning) return;
    isFlowRunning = true;
    activeNodeIndex = 0;
    
    // 重置所有节点和连接的状态
    resetArchitectureFlow(false);
    
    // 启动动画
    animateArchitectureFlow();
}

// 重置架构流程演示
function resetArchitectureFlow(resetRunningState = true) {
    if (resetRunningState) {
        isFlowRunning = false;
        activeNodeIndex = -1;
        if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
        }
    }
    
    // 重置节点样式
    svg.selectAll('.system-node').classed('active', false);
    
    // 重置连接线样式
    svg.selectAll('.node-link').classed('active', false);
    
    // 移除所有请求粒子
    svg.selectAll('.request-particle').remove();
    requestParticles = [];
}

// 动画架构流程
function animateArchitectureFlow() {
    const flowPath = [
        { nodeId: 'users', linkTarget: 'cdn', delay: 500 },
        { nodeId: 'cdn', linkTarget: 'gateway', delay: 1000 },
        { nodeId: 'gateway', linkTarget: 'web', delay: 800 },
        { nodeId: 'web', linkTarget: 'cache', delay: 800 },
        { nodeId: 'cache', linkTarget: 'inventory', delay: 1000 },
        { nodeId: 'inventory', linkTarget: 'database', delay: 1200 },
        { nodeId: 'database', linkTarget: null, delay: 1000 },
        { nodeId: 'inventory', linkTarget: 'queue', delay: 800 },
        { nodeId: 'queue', linkTarget: 'order', delay: 1000 },
        { nodeId: 'order', linkTarget: 'database', delay: 1200 },
        { nodeId: 'database', linkTarget: null, delay: 1000 }
    ];
    
    let currentStep = 0;
    
    function animateStep() {
        if (!isFlowRunning || currentStep >= flowPath.length) {
            isFlowRunning = false;
            return;
        }
        
        const step = flowPath[currentStep];
        
        // 激活当前节点
        svg.select(`#${step.nodeId}`).classed('active', true);
        
        // 如果有目标连接，激活连接并创建粒子
        if (step.linkTarget) {
            const link = architectureLinks.findIndex(
                l => l.source === step.nodeId && l.target === step.linkTarget
            );
            
            if (link !== -1) {
                const linkElement = svg.selectAll('.node-link').nodes()[link];
                d3.select(linkElement).classed('active', true);
                
                createRequestParticle(step.nodeId, step.linkTarget);
            }
        }
        
        currentStep++;
        
        // 安排下一步
        setTimeout(animateStep, step.delay);
    }
    
    // 开始动画
    animateStep();
}

// 创建请求粒子
function createRequestParticle(sourceId, targetId) {
    const source = architectureComponents.find(node => node.id === sourceId);
    const target = architectureComponents.find(node => node.id === targetId);
    
    // 创建粒子
    const particle = svg.append('circle')
        .attr('class', 'request-particle')
        .attr('cx', source.x)
        .attr('cy', source.y);
    
    // 动画移动粒子
    particle.transition()
        .duration(800)
        .attr('cx', target.x)
        .attr('cy', target.y)
        .remove();
}

// 流程演示变量
let currentStage = 0;
const totalStages = 5;

// 初始化流程演示
function initFlowDemo() {
    updateFlowStageDisplay();
    
    // 绘制初始流程图
    const container = document.getElementById('flow-container');
    const flowSvg = d3.select('#flow-container')
        .append('svg')
        .attr('width', container.clientWidth)
        .attr('height', container.clientHeight);
        
    // 绘制初始状态
    drawFlowStage(flowSvg, 0);
}

// 更新流程阶段显示
function updateFlowStageDisplay() {
    document.querySelectorAll('.stage').forEach((el, idx) => {
        if (idx === currentStage) {
            el.classList.add('active');
        } else {
            el.classList.remove('active');
        }
    });
}

// 绘制流程阶段
function drawFlowStage(svg, stage) {
    svg.selectAll('*').remove();
    
    const width = svg.attr('width');
    const height = svg.attr('height');
    const centerX = width / 2;
    const centerY = height / 2;
    
    switch(stage) {
        case 0: // 商品预热
            svg.append('text')
                .attr('x', centerX)
                .attr('y', 50)
                .attr('text-anchor', 'middle')
                .attr('font-size', '18px')
                .attr('font-weight', 'bold')
                .text('商品预热阶段');
                
            // 绘制Redis缓存图示
            svg.append('rect')
                .attr('x', centerX - 150)
                .attr('y', centerY - 75)
                .attr('width', 300)
                .attr('height', 150)
                .attr('fill', '#e8eaf6')
                .attr('stroke', '#3f51b5')
                .attr('stroke-width', 2)
                .attr('rx', 10);
                
            svg.append('text')
                .attr('x', centerX)
                .attr('y', centerY - 40)
                .attr('text-anchor', 'middle')
                .attr('font-size', '16px')
                .text('Redis缓存');
                
            svg.append('text')
                .attr('x', centerX)
                .attr('y', centerY)
                .attr('text-anchor', 'middle')
                .text('商品信息');
                
            svg.append('text')
                .attr('x', centerX)
                .attr('y', centerY + 30)
                .attr('text-anchor', 'middle')
                .text('库存计数器');
                
            svg.append('text')
                .attr('x', width - 20)
                .attr('y', height - 20)
                .attr('text-anchor', 'end')
                .attr('font-style', 'italic')
                .text('活动开始前将商品数据预加载到缓存');
            break;
            
        case 1: // 用户请求
            svg.append('text')
                .attr('x', centerX)
                .attr('y', 50)
                .attr('text-anchor', 'middle')
                .attr('font-size', '18px')
                .attr('font-weight', 'bold')
                .text('用户请求阶段');
                
            // 绘制用户和网关
            for (let i = 0; i < 10; i++) {
                svg.append('circle')
                    .attr('cx', 50 + Math.random() * 100)
                    .attr('cy', 100 + Math.random() * 200)
                    .attr('r', 10)
                    .attr('fill', '#bbdefb');
            }
            
            // 网关
            svg.append('rect')
                .attr('x', centerX - 100)
                .attr('y', centerY - 50)
                .attr('width', 200)
                .attr('height', 100)
                .attr('fill', '#e8eaf6')
                .attr('stroke', '#3f51b5')
                .attr('stroke-width', 2)
                .attr('rx', 10);
                
            svg.append('text')
                .attr('x', centerX)
                .attr('y', centerY)
                .attr('text-anchor', 'middle')
                .attr('font-size', '16px')
                .text('API网关');
                
            svg.append('text')
                .attr('x', centerX)
                .attr('y', centerY + 20)
                .attr('text-anchor', 'middle')
                .attr('font-size', '14px')
                .text('限流 + 请求去重');
                
            // 箭头
            svg.append('path')
                .attr('d', `M150,${centerY} L${centerX - 110},${centerY}`)
                .attr('stroke', '#3f51b5')
                .attr('stroke-width', 2)
                .attr('fill', 'none')
                .attr('marker-end', 'url(#flow-arrow)');
                
            // 添加箭头标记
            svg.append('defs').append('marker')
                .attr('id', 'flow-arrow')
                .attr('viewBox', '0 -5 10 10')
                .attr('refX', 8)
                .attr('refY', 0)
                .attr('orient', 'auto')
                .attr('markerWidth', 6)
                .attr('markerHeight', 6)
                .append('path')
                .attr('d', 'M0,-5L10,0L0,5')
                .attr('fill', '#3f51b5');
            break;
            
        case 2: // 库存校验
            svg.append('text')
                .attr('x', centerX)
                .attr('y', 50)
                .attr('text-anchor', 'middle')
                .attr('font-size', '18px')
                .attr('font-weight', 'bold')
                .text('库存校验阶段');
                
            // Redis缓存
            svg.append('rect')
                .attr('x', centerX - 200)
                .attr('y', centerY - 75)
                .attr('width', 150)
                .attr('height', 150)
                .attr('fill', '#e8eaf6')
                .attr('stroke', '#3f51b5')
                .attr('stroke-width', 2)
                .attr('rx', 10);
                
            svg.append('text')
                .attr('x', centerX - 125)
                .attr('y', centerY - 40)
                .attr('text-anchor', 'middle')
                .attr('font-size', '16px')
                .text('Redis缓存');
                
            svg.append('text')
                .attr('x', centerX - 125)
                .attr('y', centerY)
                .attr('text-anchor', 'middle')
                .text('DECR 操作');
                
            svg.append('text')
                .attr('x', centerX - 125)
                .attr('y', centerY + 30)
                .attr('text-anchor', 'middle')
                .text('原子性递减');
                
            // 库存服务
            svg.append('rect')
                .attr('x', centerX + 50)
                .attr('y', centerY - 75)
                .attr('width', 150)
                .attr('height', 150)
                .attr('fill', '#e8eaf6')
                .attr('stroke', '#3f51b5')
                .attr('stroke-width', 2)
                .attr('rx', 10);
                
            svg.append('text')
                .attr('x', centerX + 125)
                .attr('y', centerY - 40)
                .attr('text-anchor', 'middle')
                .attr('font-size', '16px')
                .text('库存服务');
                
            svg.append('text')
                .attr('x', centerX + 125)
                .attr('y', centerY)
                .attr('text-anchor', 'middle')
                .text('库存校验');
                
            svg.append('text')
                .attr('x', centerX + 125)
                .attr('y', centerY + 30)
                .attr('text-anchor', 'middle')
                .text('成功/失败返回');
                
            // 连接箭头
            svg.append('path')
                .attr('d', `M${centerX - 50},${centerY} L${centerX + 50},${centerY}`)
                .attr('stroke', '#3f51b5')
                .attr('stroke-width', 2)
                .attr('fill', 'none')
                .attr('marker-end', 'url(#flow-arrow2)');
                
            // 添加箭头标记
            svg.append('defs').append('marker')
                .attr('id', 'flow-arrow2')
                .attr('viewBox', '0 -5 10 10')
                .attr('refX', 8)
                .attr('refY', 0)
                .attr('orient', 'auto')
                .attr('markerWidth', 6)
                .attr('markerHeight', 6)
                .append('path')
                .attr('d', 'M0,-5L10,0L0,5')
                .attr('fill', '#3f51b5');
            break;
            
        case 3: // 订单处理
            svg.append('text')
                .attr('x', centerX)
                .attr('y', 50)
                .attr('text-anchor', 'middle')
                .attr('font-size', '18px')
                .attr('font-weight', 'bold')
                .text('订单处理阶段');
                
            // 消息队列
            svg.append('rect')
                .attr('x', centerX - 200)
                .attr('y', centerY - 75)
                .attr('width', 150)
                .attr('height', 150)
                .attr('fill', '#e8eaf6')
                .attr('stroke', '#3f51b5')
                .attr('stroke-width', 2)
                .attr('rx', 10);
                
            svg.append('text')
                .attr('x', centerX - 125)
                .attr('y', centerY - 40)
                .attr('text-anchor', 'middle')
                .attr('font-size', '16px')
                .text('消息队列');
                
            // 画出队列中的消息
            for (let i = 0; i < 5; i++) {
                svg.append('rect')
                    .attr('x', centerX - 175 + i * 30)
                    .attr('y', centerY - 10)
                    .attr('width', 20)
                    .attr('height', 20)
                    .attr('fill', '#c5cae9')
                    .attr('stroke', '#3f51b5');
            }
                
            // 订单服务
            svg.append('rect')
                .attr('x', centerX + 50)
                .attr('y', centerY - 75)
                .attr('width', 150)
                .attr('height', 150)
                .attr('fill', '#e8eaf6')
                .attr('stroke', '#3f51b5')
                .attr('stroke-width', 2)
                .attr('rx', 10);
                
            svg.append('text')
                .attr('x', centerX + 125)
                .attr('y', centerY - 40)
                .attr('text-anchor', 'middle')
                .attr('font-size', '16px')
                .text('订单服务');
                
            svg.append('text')
                .attr('x', centerX + 125)
                .attr('y', centerY)
                .attr('text-anchor', 'middle')
                .text('异步处理');
                
            svg.append('text')
                .attr('x', centerX + 125)
                .attr('y', centerY + 30)
                .attr('text-anchor', 'middle')
                .text('创建订单');
                
            // 连接箭头
            svg.append('path')
                .attr('d', `M${centerX - 50},${centerY} L${centerX + 50},${centerY}`)
                .attr('stroke', '#3f51b5')
                .attr('stroke-width', 2)
                .attr('fill', 'none')
                .attr('marker-end', 'url(#flow-arrow3)');
                
            // 添加箭头标记
            svg.append('defs').append('marker')
                .attr('id', 'flow-arrow3')
                .attr('viewBox', '0 -5 10 10')
                .attr('refX', 8)
                .attr('refY', 0)
                .attr('orient', 'auto')
                .attr('markerWidth', 6)
                .attr('markerHeight', 6)
                .append('path')
                .attr('d', 'M0,-5L10,0L0,5')
                .attr('fill', '#3f51b5');
            break;
            
        case 4: // 支付确认
            svg.append('text')
                .attr('x', centerX)
                .attr('y', 50)
                .attr('text-anchor', 'middle')
                .attr('font-size', '18px')
                .attr('font-weight', 'bold')
                .text('支付确认阶段');
                
            // 用户
            svg.append('circle')
                .attr('cx', 100)
                .attr('cy', centerY)
                .attr('r', 30)
                .attr('fill', '#bbdefb')
                .attr('stroke', '#3f51b5')
                .attr('stroke-width', 2);
                
            svg.append('text')
                .attr('x', 100)
                .attr('y', centerY + 5)
                .attr('text-anchor', 'middle')
                .text('用户');
                
            // 支付服务
            svg.append('rect')
                .attr('x', centerX - 75)
                .attr('y', centerY - 50)
                .attr('width', 150)
                .attr('height', 100)
                .attr('fill', '#e8eaf6')
                .attr('stroke', '#3f51b5')
                .attr('stroke-width', 2)
                .attr('rx', 10);
                
            svg.append('text')
                .attr('x', centerX)
                .attr('y', centerY - 15)
                .attr('text-anchor', 'middle')
                .attr('font-size', '16px')
                .text('支付服务');
                
            svg.append('text')
                .attr('x', centerX)
                .attr('y', centerY + 15)
                .attr('text-anchor', 'middle')
                .text('超时机制');
                
            // 数据库
            svg.append('rect')
                .attr('x', centerX + 150)
                .attr('y', centerY - 50)
                .attr('width', 150)
                .attr('height', 100)
                .attr('fill', '#e8eaf6')
                .attr('stroke', '#3f51b5')
                .attr('stroke-width', 2)
                .attr('rx', 10);
                
            svg.append('text')
                .attr('x', centerX + 225)
                .attr('y', centerY)
                .attr('text-anchor', 'middle')
                .attr('font-size', '16px')
                .text('数据库');
                
            // 连接箭头
            svg.append('path')
                .attr('d', `M130,${centerY} L${centerX - 75},${centerY}`)
                .attr('stroke', '#3f51b5')
                .attr('stroke-width', 2)
                .attr('fill', 'none')
                .attr('marker-end', 'url(#flow-arrow4-1)');
                
            svg.append('path')
                .attr('d', `M${centerX + 75},${centerY} L${centerX + 150},${centerY}`)
                .attr('stroke', '#3f51b5')
                .attr('stroke-width', 2)
                .attr('fill', 'none')
                .attr('marker-end', 'url(#flow-arrow4-2)');
                
            // 添加箭头标记
            svg.append('defs').append('marker')
                .attr('id', 'flow-arrow4-1')
                .attr('viewBox', '0 -5 10 10')
                .attr('refX', 8)
                .attr('refY', 0)
                .attr('orient', 'auto')
                .attr('markerWidth', 6)
                .attr('markerHeight', 6)
                .append('path')
                .attr('d', 'M0,-5L10,0L0,5')
                .attr('fill', '#3f51b5');
                
            svg.append('defs').append('marker')
                .attr('id', 'flow-arrow4-2')
                .attr('viewBox', '0 -5 10 10')
                .attr('refX', 8)
                .attr('refY', 0)
                .attr('orient', 'auto')
                .attr('markerWidth', 6)
                .attr('markerHeight', 6)
                .append('path')
                .attr('d', 'M0,-5L10,0L0,5')
                .attr('fill', '#3f51b5');
            break;
    }
}

// 切换到下一个流程阶段
function nextFlowStage() {
    if (currentStage < totalStages - 1) {
        currentStage++;
        updateFlowStageDisplay();
        
        // 更新流程图
        const flowSvg = d3.select('#flow-container svg');
        drawFlowStage(flowSvg, currentStage);
    }
}

// 重置流程阶段
function resetFlowStages() {
    currentStage = 0;
    updateFlowStageDisplay();
    
    // 更新流程图
    const flowSvg = d3.select('#flow-container svg');
    drawFlowStage(flowSvg, currentStage);
}

// 初始化性能对比图表
function initPerformanceChart() {
    const container = document.getElementById('chart-container');
    const width = container.clientWidth;
    const height = 300;
    
    const svg = d3.select('#chart-container')
        .append('svg')
        .attr('width', width)
        .attr('height', height);
    
    // 定义数据
    const data = [
        {label: '传统架构', qps: 1000, responseTime: 500, color: '#90caf9'},
        {label: '读写分离', qps: 5000, responseTime: 200, color: '#42a5f5'},
        {label: '缓存优化', qps: 15000, responseTime: 100, color: '#1e88e5'},
        {label: '完整秒杀架构', qps: 50000, responseTime: 30, color: '#0d47a1'}
    ];
    
    // 定义比例尺
    const xScale = d3.scaleBand()
        .domain(data.map(d => d.label))
        .range([50, width - 50])
        .padding(0.2);
    
    const yScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.qps)])
        .range([height - 50, 30]);
    
    // 绘制坐标轴
    const xAxis = d3.axisBottom(xScale);
    svg.append('g')
        .attr('transform', `translate(0, ${height - 50})`)
        .call(xAxis)
        .selectAll('text')
        .style('text-anchor', 'end')
        .attr('dx', '-.8em')
        .attr('dy', '.15em')
        .attr('transform', 'rotate(-45)');
    
    const yAxis = d3.axisLeft(yScale);
    svg.append('g')
        .attr('transform', 'translate(50, 0)')
        .call(yAxis);
    
    // Y轴标签
    svg.append('text')
        .attr('transform', 'rotate(-90)')
        .attr('y', 15)
        .attr('x', -(height / 2))
        .attr('text-anchor', 'middle')
        .text('每秒查询数 (QPS)');
    
    // 绘制柱状图
    svg.selectAll('.bar')
        .data(data)
        .enter()
        .append('rect')
        .attr('class', 'bar')
        .attr('x', d => xScale(d.label))
        .attr('y', d => yScale(d.qps))
        .attr('width', xScale.bandwidth())
        .attr('height', d => height - 50 - yScale(d.qps))
        .attr('fill', d => d.color);
    
    // 添加数据标签
    svg.selectAll('.label')
        .data(data)
        .enter()
        .append('text')
        .attr('class', 'label')
        .attr('x', d => xScale(d.label) + xScale.bandwidth() / 2)
        .attr('y', d => yScale(d.qps) - 5)
        .attr('text-anchor', 'middle')
        .text(d => d.qps);
    
    // 添加响应时间标签
    svg.selectAll('.response-time')
        .data(data)
        .enter()
        .append('text')
        .attr('class', 'response-time')
        .attr('x', d => xScale(d.label) + xScale.bandwidth() / 2)
        .attr('y', d => yScale(d.qps) + 15)
        .attr('text-anchor', 'middle')
        .text(d => `${d.responseTime}ms`)
        .attr('fill', 'white');
} 