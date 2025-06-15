// 缓存性能监控演示

// 性能指标监控演示
async function initPerformanceMetricsDemo() {
    const container = document.getElementById('performance-metrics-diagram');
    const logContainer = document.createElement('div');
    logContainer.className = 'demo-logs';
    container.parentElement.appendChild(logContainer);
    
    container.innerHTML = '';
    logContainer.innerHTML = '';
    
    // 创建图表容器
    const chartContainer = document.createElement('div');
    chartContainer.className = 'metrics-chart';
    chartContainer.style.width = '600px';
    chartContainer.style.height = '300px';
    container.appendChild(chartContainer);
    
    // 创建指标面板
    const metricsPanel = document.createElement('div');
    metricsPanel.className = 'metrics-panel';
    container.appendChild(metricsPanel);
    
    // 初始化指标数据
    const metrics = {
        hitRate: 85,
        qps: 1000,
        latency: 5,
        memory: 60
    };
    
    // 更新指标面板
    function updateMetricsPanel() {
        metricsPanel.innerHTML = `
            <div class="metric">
                <div class="metric-title">命中率</div>
                <div class="metric-value">${metrics.hitRate}%</div>
            </div>
            <div class="metric">
                <div class="metric-title">QPS</div>
                <div class="metric-value">${metrics.qps}</div>
            </div>
            <div class="metric">
                <div class="metric-title">延迟</div>
                <div class="metric-value">${metrics.latency}ms</div>
            </div>
            <div class="metric">
                <div class="metric-title">内存使用</div>
                <div class="metric-value">${metrics.memory}%</div>
            </div>
        `;
    }
    
    // 模拟指标变化
    async function simulateMetricsChange() {
        addLog(logContainer, '开始监控缓存性能指标', 'info');
        
        for (let i = 0; i < 10; i++) {
            // 随机更新指标
            metrics.hitRate = Math.max(60, Math.min(95, metrics.hitRate + (Math.random() - 0.5) * 10));
            metrics.qps = Math.max(500, Math.min(2000, metrics.qps + (Math.random() - 0.5) * 200));
            metrics.latency = Math.max(1, Math.min(20, metrics.latency + (Math.random() - 0.5) * 3));
            metrics.memory = Math.max(20, Math.min(90, metrics.memory + (Math.random() - 0.5) * 10));
            
            // 更新显示
            updateMetricsPanel();
            
            // 添加日志
            if (metrics.hitRate < 70) {
                addLog(logContainer, `警告：命中率降至 ${metrics.hitRate.toFixed(1)}%`, 'warning');
            }
            if (metrics.latency > 15) {
                addLog(logContainer, `警告：延迟升至 ${metrics.latency.toFixed(1)}ms`, 'warning');
            }
            if (metrics.memory > 80) {
                addLog(logContainer, `警告：内存使用率达到 ${metrics.memory.toFixed(1)}%`, 'warning');
            }
            
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
        
        addLog(logContainer, '性能指标监控结束', 'info');
    }
    
    // 添加演示控制按钮
    const controls = container.parentElement.querySelector('.controls');
    const demoBtn = createElement('button', '', '开始监控');
    
    demoBtn.addEventListener('click', simulateMetricsChange);
    controls.appendChild(demoBtn);
    
    // 初始显示
    updateMetricsPanel();
}

// 热点数据分析演示
async function initHotspotAnalysisDemo() {
    const container = document.getElementById('hotspot-analysis-diagram');
    const logContainer = document.createElement('div');
    logContainer.className = 'demo-logs';
    container.parentElement.appendChild(logContainer);
    
    container.innerHTML = '';
    logContainer.innerHTML = '';
    
    // 创建热力图容器
    const heatmapContainer = document.createElement('div');
    heatmapContainer.className = 'heatmap-container';
    heatmapContainer.style.width = '600px';
    heatmapContainer.style.height = '300px';
    container.appendChild(heatmapContainer);
    
    // 创建热点数据列表
    const hotspotList = document.createElement('div');
    hotspotList.className = 'hotspot-list';
    container.appendChild(hotspotList);
    
    // 初始化热点数据
    const hotspots = [
        { key: 'user:1001', hits: 1000 },
        { key: 'product:2001', hits: 800 },
        { key: 'order:3001', hits: 600 },
        { key: 'cart:4001', hits: 400 },
        { key: 'config:5001', hits: 200 }
    ];
    
    // 更新热点列表
    function updateHotspotList() {
        hotspotList.innerHTML = `
            <div class="hotspot-header">热点数据 TOP 5</div>
            ${hotspots.map((item, index) => `
                <div class="hotspot-item">
                    <div class="hotspot-rank">#${index + 1}</div>
                    <div class="hotspot-key">${item.key}</div>
                    <div class="hotspot-hits">${item.hits} hits</div>
                </div>
            `).join('')}
        `;
    }
    
    // 模拟热点数据变化
    async function simulateHotspotChange() {
        addLog(logContainer, '开始分析缓存热点数据', 'info');
        
        for (let i = 0; i < 10; i++) {
            // 随机更新热点数据
            hotspots.forEach(item => {
                item.hits = Math.max(100, Math.min(2000, item.hits + (Math.random() - 0.5) * 200));
            });
            
            // 排序
            hotspots.sort((a, b) => b.hits - a.hits);
            
            // 更新显示
            updateHotspotList();
            
            // 添加日志
            if (hotspots[0].hits > 1500) {
                addLog(logContainer, `警告：键 ${hotspots[0].key} 访问频率过高`, 'warning');
            }
            
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
        
        addLog(logContainer, '热点数据分析结束', 'info');
    }
    
    // 添加演示控制按钮
    const controls = container.parentElement.querySelector('.controls');
    const demoBtn = createElement('button', '', '开始分析');
    
    demoBtn.addEventListener('click', simulateHotspotChange);
    controls.appendChild(demoBtn);
    
    // 初始显示
    updateHotspotList();
}

// 容量规划演示
async function initCapacityPlanningDemo() {
    const container = document.getElementById('capacity-planning-diagram');
    const logContainer = document.createElement('div');
    logContainer.className = 'demo-logs';
    container.parentElement.appendChild(logContainer);
    
    container.innerHTML = '';
    logContainer.innerHTML = '';
    
    // 创建容量图表容器
    const chartContainer = document.createElement('div');
    chartContainer.className = 'capacity-chart';
    chartContainer.style.width = '600px';
    chartContainer.style.height = '300px';
    container.appendChild(chartContainer);
    
    // 创建容量面板
    const capacityPanel = document.createElement('div');
    capacityPanel.className = 'capacity-panel';
    container.appendChild(capacityPanel);
    
    // 初始化容量数据
    const capacity = {
        totalMemory: 8192,  // MB
        usedMemory: 4096,   // MB
        keyCount: 1000000,
        avgKeySize: 100,    // Bytes
        growthRate: 10      // % per day
    };
    
    // 更新容量面板
    function updateCapacityPanel() {
        capacityPanel.innerHTML = `
            <div class="capacity-item">
                <div class="capacity-title">总内存</div>
                <div class="capacity-value">${(capacity.totalMemory / 1024).toFixed(1)} GB</div>
            </div>
            <div class="capacity-item">
                <div class="capacity-title">已用内存</div>
                <div class="capacity-value">${(capacity.usedMemory / 1024).toFixed(1)} GB</div>
            </div>
            <div class="capacity-item">
                <div class="capacity-title">键数量</div>
                <div class="capacity-value">${(capacity.keyCount / 1000).toFixed(1)}K</div>
            </div>
            <div class="capacity-item">
                <div class="capacity-title">平均键大小</div>
                <div class="capacity-value">${capacity.avgKeySize} Bytes</div>
            </div>
            <div class="capacity-item">
                <div class="capacity-title">增长率</div>
                <div class="capacity-value">${capacity.growthRate}%/天</div>
            </div>
        `;
    }
    
    // 模拟容量变化
    async function simulateCapacityChange() {
        addLog(logContainer, '开始监控缓存容量', 'info');
        
        for (let i = 0; i < 10; i++) {
            // 模拟容量变化
            capacity.usedMemory = Math.min(capacity.totalMemory,
                capacity.usedMemory * (1 + capacity.growthRate / 100));
            capacity.keyCount *= (1 + capacity.growthRate / 100);
            capacity.avgKeySize += (Math.random() - 0.5) * 10;
            
            // 更新显示
            updateCapacityPanel();
            
            // 添加日志
            const usagePercent = (capacity.usedMemory / capacity.totalMemory) * 100;
            if (usagePercent > 80) {
                addLog(logContainer, `警告：内存使用率达到 ${usagePercent.toFixed(1)}%`, 'warning');
            }
            if (capacity.keyCount > 1500000) {
                addLog(logContainer, `警告：键数量超过 ${(capacity.keyCount/1000).toFixed(1)}K`, 'warning');
            }
            
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
        
        // 预测未来容量
        const daysToFull = Math.log(capacity.totalMemory / capacity.usedMemory) / 
            Math.log(1 + capacity.growthRate / 100);
        
        addLog(logContainer, `预计 ${daysToFull.toFixed(1)} 天后需要扩容`, 'info');
        addLog(logContainer, '容量监控结束', 'info');
    }
    
    // 添加演示控制按钮
    const controls = container.parentElement.querySelector('.controls');
    const demoBtn = createElement('button', '', '开始监控');
    
    demoBtn.addEventListener('click', simulateCapacityChange);
    controls.appendChild(demoBtn);
    
    // 初始显示
    updateCapacityPanel();
}

// 初始化所有监控演示
document.addEventListener('DOMContentLoaded', function() {
    initPerformanceMetricsDemo();
    initHotspotAnalysisDemo();
    initCapacityPlanningDemo();
}); 