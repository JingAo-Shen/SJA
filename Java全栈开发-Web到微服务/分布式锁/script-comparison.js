// 策略比较功能
document.addEventListener('DOMContentLoaded', function() {
    // 初始化比较表格
    initComparisonTable();
    
    // 添加交互功能
    addTableInteractions();
});

function initComparisonTable() {
    // 获取比较表格
    const table = document.querySelector('.comparison-table');
    
    // 如果表格已经存在内容，不再初始化
    if (table.rows.length > 1) return;
    
    // 定义比较数据
    const comparisons = [
        {
            method: 'Redis (SETNX)',
            reliability: '中等',
            performance: '高',
            complexity: '低',
            advantages: [
                '实现简单，API易用',
                '性能高，毫秒级延迟',
                '使用广泛，有完备的客户端库'
            ],
            disadvantages: [
                '单点故障风险',
                '死锁风险（客户端崩溃时）',
                '需要设置适当的过期时间',
                '主从切换时可能丢失锁'
            ]
        },
        {
            method: 'Redis (Redlock)',
            reliability: '高',
            performance: '中高',
            complexity: '中',
            advantages: [
                '多节点冗余，容错性强',
                '性能较高',
                '基于Redis生态',
                '解决了单点故障问题'
            ],
            disadvantages: [
                '需要多个独立Redis节点',
                '实现相对复杂',
                '分布式时钟漂移问题',
                '运维成本较高'
            ]
        },
        {
            method: 'ZooKeeper',
            reliability: '高',
            performance: '中',
            complexity: '中高',
            advantages: [
                '强一致性保证',
                '自动处理节点故障',
                '临时节点可避免死锁',
                '支持锁重入'
            ],
            disadvantages: [
                '性能低于Redis',
                '需要维护ZooKeeper集群',
                '实现复杂度较高',
                'API相对复杂'
            ]
        },
        {
            method: '数据库（行锁/唯一索引）',
            reliability: '中高',
            performance: '低',
            complexity: '低',
            advantages: [
                '与业务事务可以结合',
                '实现简单，利用数据库现有功能',
                '不需要额外组件',
                '支持事务ACID特性'
            ],
            disadvantages: [
                '性能较差',
                '数据库连接数限制',
                '长时间锁定影响数据库性能',
                '扩展性受限'
            ]
        }
    ];
    
    // 创建表头
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    
    ['实现方式', '可靠性', '性能', '复杂度', '优点', '缺点'].forEach(text => {
        const th = document.createElement('th');
        th.textContent = text;
        headerRow.appendChild(th);
    });
    
    thead.appendChild(headerRow);
    table.appendChild(thead);
    
    // 创建表格内容
    const tbody = document.createElement('tbody');
    
    comparisons.forEach(item => {
        const row = document.createElement('tr');
        
        // 实现方式
        const methodCell = document.createElement('td');
        methodCell.textContent = item.method;
        row.appendChild(methodCell);
        
        // 可靠性
        const reliabilityCell = document.createElement('td');
        reliabilityCell.textContent = item.reliability;
        row.appendChild(reliabilityCell);
        
        // 性能
        const performanceCell = document.createElement('td');
        performanceCell.textContent = item.performance;
        row.appendChild(performanceCell);
        
        // 复杂度
        const complexityCell = document.createElement('td');
        complexityCell.textContent = item.complexity;
        row.appendChild(complexityCell);
        
        // 优点
        const advantagesCell = document.createElement('td');
        const advantagesList = document.createElement('ul');
        item.advantages.forEach(advantage => {
            const li = document.createElement('li');
            li.textContent = advantage;
            advantagesList.appendChild(li);
        });
        advantagesCell.appendChild(advantagesList);
        row.appendChild(advantagesCell);
        
        // 缺点
        const disadvantagesCell = document.createElement('td');
        const disadvantagesList = document.createElement('ul');
        item.disadvantages.forEach(disadvantage => {
            const li = document.createElement('li');
            li.textContent = disadvantage;
            disadvantagesList.appendChild(li);
        });
        disadvantagesCell.appendChild(disadvantagesList);
        row.appendChild(disadvantagesCell);
        
        tbody.appendChild(row);
    });
    
    table.appendChild(tbody);
}

function addTableInteractions() {
    // 获取表格和所有行
    const table = document.querySelector('.comparison-table');
    const rows = table.querySelectorAll('tbody tr');
    
    // 为每一行添加点击事件
    rows.forEach(row => {
        row.addEventListener('click', function() {
            // 获取当前行的实现方式
            const method = this.cells[0].textContent;
            
            // 高亮当前行
            rows.forEach(r => r.classList.remove('selected-row'));
            this.classList.add('selected-row');
            
            // 显示详细信息
            showDetailedComparison(method);
        });
    });
}

function showDetailedComparison(method) {
    // 获取详细信息区域
    const detailArea = document.getElementById('comparison-details');
    if (!detailArea) return;
    
    // 清空详细信息区域
    detailArea.innerHTML = '';
    
    // 定义详细内容
    let detailContent = '';
    switch (method) {
        case 'Redis (SETNX)':
            detailContent = `
                <h3>Redis SETNX 分布式锁详解</h3>
                <div class="code-container">
                    <pre><code># 获取锁
SET resource_name my_random_value NX PX 30000

# 释放锁 (使用Lua脚本确保原子性)
if redis.call("get", KEYS[1]) == ARGV[1] then
    return redis.call("del", KEYS[1])
else
    return 0
end</code></pre>
                </div>
                <p>Redis分布式锁使用SETNX命令（SET if Not eXists）实现互斥控制。NX选项确保键不存在时才设置成功，PX设置毫秒级过期时间防止死锁。</p>
                <p>使用随机值（锁ID）作为锁的值，确保锁只能被持有者释放，避免误删除其他客户端的锁。</p>
                <h4>实现注意事项:</h4>
                <ul>
                    <li>使用随机值或UUID作为锁标识</li>
                    <li>释放锁时必须验证值是否一致</li>
                    <li>设置合理的锁过期时间</li>
                    <li>考虑使用锁续期机制（看门狗）</li>
                </ul>
                <h4>适用场景:</h4>
                <ul>
                    <li>并发量适中的分布式系统</li>
                    <li>需要高性能的场景</li>
                    <li>短时间的互斥操作</li>
                </ul>
            `;
            break;
            
        case 'Redis (Redlock)':
            detailContent = `
                <h3>Redis Redlock 算法详解</h3>
                <p>Redlock算法是Redis官方推荐的分布式锁算法，通过多个独立Redis节点实现更高可靠性。基本流程如下：</p>
                <ol>
                    <li>获取当前时间（毫秒）</li>
                    <li>在N个独立Redis节点上依次获取锁，使用相同的键名和随机值</li>
                    <li>计算获取锁消耗的时间，如果获取锁的时间超过锁的有效时间，则释放锁并返回失败</li>
                    <li>如果在多数节点（N/2+1）上获取了锁，则认为获取锁成功</li>
                    <li>锁的有效时间需减去获取锁消耗的时间</li>
                </ol>
                <div class="code-container">
                    <pre><code>// 伪代码
function acquireLock(lockName, lockValue, expiryTime):
    successCount = 0
    startTime = currentTimeMillis()
    
    for each redis node:
        try:
            if SET lockName lockValue NX PX expiryTime == OK:
                successCount++
        catch:
            continue
    
    elapsedTime = currentTimeMillis() - startTime
    remainingTime = expiryTime - elapsedTime
    
    if successCount >= majority and remainingTime > 0:
        return true, remainingTime
    else:
        releaseAllLocks()
        return false</code></pre>
                </div>
                <p>Redlock解决了单节点Redis的可靠性问题，但实现更复杂，且需要考虑时钟漂移、网络分区等问题。</p>
                <h4>适用场景:</h4>
                <ul>
                    <li>对锁的可靠性要求较高的场景</li>
                    <li>可以接受稍低性能的系统</li>
                    <li>有能力部署和维护多个独立的Redis节点</li>
                </ul>
            `;
            break;
            
        case 'ZooKeeper':
            detailContent = `
                <h3>ZooKeeper 分布式锁详解</h3>
                <p>ZooKeeper分布式锁利用ZooKeeper的临时顺序节点（Ephemeral Sequential Nodes）和Watch机制实现。基本流程如下：</p>
                <ol>
                    <li>创建一个锁根节点（如/locks）</li>
                    <li>客户端创建临时顺序子节点（如/locks/lock_0000000001）</li>
                    <li>获取/locks下所有子节点，按序号排序</li>
                    <li>如果自己创建的节点是最小的，则获取锁成功</li>
                    <li>否则，监视（Watch）比自己序号小的前一个节点</li>
                    <li>当前一个节点被删除时，再次判断自己是否是最小的节点</li>
                </ol>
                <div class="code-container">
                    <pre><code>// 伪代码
function acquireLock(lockPath):
    // 创建临时顺序节点
    myPath = zk.create(lockPath + "/lock-", data, EPHEMERAL | SEQUENTIAL)
    myNode = myPath.substring(myPath.lastIndexOf("/") + 1)
    
    while true:
        // 获取所有子节点
        children = zk.getChildren(lockPath, false)
        sortChildren(children)
        
        // 如果自己是最小的节点，获取锁成功
        if myNode equals children[0]:
            return true
        
        // 监视前一个节点
        index = children.indexOf(myNode)
        watchPath = lockPath + "/" + children[index - 1]
        
        // 等待前一个节点释放
        exists = zk.exists(watchPath, true)
        if exists:
            wait(exists-notification)
        else:
            // 前一个节点不存在，重新检查
            continue</code></pre>
                </div>
                <p>ZooKeeper锁具有更强的一致性保证，且客户端崩溃时锁会自动释放（临时节点特性）。</p>
                <h4>适用场景:</h4>
                <ul>
                    <li>需要高可靠性的分布式锁场景</li>
                    <li>对性能要求不是极高的系统</li>
                    <li>已有ZooKeeper集群的环境</li>
                    <li>需要锁监视和顺序控制的复杂场景</li>
                </ul>
            `;
            break;
            
        case '数据库（行锁/唯一索引）':
            detailContent = `
                <h3>数据库分布式锁详解</h3>
                <p>数据库分布式锁利用数据库的行锁或唯一索引特性实现互斥。常见的实现方式有：</p>
                
                <h4>1. 唯一索引方式</h4>
                <div class="code-container">
                    <pre><code>-- 创建锁表
CREATE TABLE distributed_locks (
    resource_name VARCHAR(64) PRIMARY KEY,
    lock_id VARCHAR(64) NOT NULL,
    created_at TIMESTAMP NOT NULL
);

-- 获取锁 (通过INSERT唯一键冲突检测)
INSERT INTO distributed_locks (resource_name, lock_id, created_at)
VALUES ('resource_1', 'client_uuid', NOW());

-- 释放锁
DELETE FROM distributed_locks
WHERE resource_name = 'resource_1' AND lock_id = 'client_uuid';</code></pre>
                </div>
                
                <h4>2. 行锁方式 (SELECT FOR UPDATE)</h4>
                <div class="code-container">
                    <pre><code>-- 在事务中执行
BEGIN;
-- 获取锁
SELECT * FROM distributed_locks 
WHERE resource_name = 'resource_1' FOR UPDATE;

-- 执行受保护的操作
...

-- 提交事务释放锁
COMMIT;</code></pre>
                </div>
                
                <p>数据库锁的优势是与业务数据在同一事务中，实现简单，但性能较差且受数据库连接数限制。</p>
                
                <h4>适用场景:</h4>
                <ul>
                    <li>与数据库操作强关联的场景</li>
                    <li>需要事务保证的锁场景</li>
                    <li>并发量较低的系统</li>
                    <li>没有额外中间件的简单系统</li>
                </ul>
            `;
            break;
    }
    
    detailArea.innerHTML = detailContent;
}

// 添加性能比较图表功能
function initPerformanceChart() {
    // 这里可以使用Chart.js等图表库
    // 简化版本使用DOM操作创建简单可视化
    const chartContainer = document.getElementById('performance-chart');
    if (!chartContainer) return;
    
    // 清空容器
    chartContainer.innerHTML = '';
    
    // 定义性能数据
    const performanceData = [
        { name: 'Redis (SETNX)', qps: 90, latency: 5 },
        { name: 'Redis (Redlock)', qps: 70, latency: 15 },
        { name: 'ZooKeeper', qps: 50, latency: 30 },
        { name: 'Database', qps: 20, latency: 80 }
    ];
    
    // 创建图表
    const chart = document.createElement('div');
    chart.className = 'perf-chart';
    
    // 添加bars
    performanceData.forEach(item => {
        const bar = document.createElement('div');
        bar.className = 'perf-bar';
        
        const barLabel = document.createElement('div');
        barLabel.className = 'bar-label';
        barLabel.textContent = item.name;
        
        const qpsBar = document.createElement('div');
        qpsBar.className = 'qps-bar';
        qpsBar.style.width = `${item.qps}%`;
        qpsBar.setAttribute('title', `QPS: ${item.qps}% (相对值)`);
        
        const latencyLabel = document.createElement('div');
        latencyLabel.className = 'latency-label';
        latencyLabel.textContent = `延迟: ${item.latency}ms`;
        
        bar.appendChild(barLabel);
        bar.appendChild(qpsBar);
        bar.appendChild(latencyLabel);
        
        chart.appendChild(bar);
    });
    
    chartContainer.appendChild(chart);
} 