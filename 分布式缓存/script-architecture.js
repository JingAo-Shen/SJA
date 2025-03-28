// 缓存分布式架构演示

// 主从复制架构演示
async function initMasterSlaveDemo() {
    const container = document.getElementById('master-slave-diagram');
    const logContainer = document.createElement('div');
    logContainer.className = 'demo-logs';
    container.parentElement.appendChild(logContainer);
    
    container.innerHTML = '';
    logContainer.innerHTML = '';
    
    // 创建节点
    const app = createNode('ms-app', 'Application', 1);
    const master = createNode('ms-master', 'Master Cache', 2);
    const slave1 = createNode('ms-slave1', 'Slave Cache 1', 2);
    const slave2 = createNode('ms-slave2', 'Slave Cache 2', 2);
    const db = createNode('ms-db', 'Database', 3);
    
    // 添加节点到容器
    [app, master, slave1, slave2, db].forEach(node => container.appendChild(node));
    
    // 定位节点
    app.style.left = '50px';
    app.style.top = '125px';
    master.style.left = '250px';
    master.style.top = '125px';
    slave1.style.left = '450px';
    slave1.style.top = '50px';
    slave2.style.left = '450px';
    slave2.style.top = '200px';
    db.style.left = '650px';
    db.style.top = '125px';
    
    // 添加连接线
    const lines = [
        drawLine(170, 155, 250, 155),  // app -> master
        drawLine(370, 155, 450, 80),   // master -> slave1
        drawLine(370, 155, 450, 230),  // master -> slave2
        drawLine(570, 155, 650, 155)   // master -> db
    ];
    
    lines.forEach(line => container.appendChild(line));
    
    // 演示主从复制
    async function demonstrateMasterSlave() {
        addLog(logContainer, '开始演示主从复制架构', 'info');
        
        // 1. 写入主节点
        const writeMsg = createMessage('Write data');
        writeMsg.style.left = '180px';
        writeMsg.style.top = '100px';
        container.appendChild(writeMsg);
        
        await new Promise(resolve => setTimeout(resolve, 1000));
        addLog(logContainer, '1. 写操作发送到主节点', 'info');
        
        // 2. 主节点同步到从节点
        const sync1 = createMessage('Sync');
        sync1.style.left = '380px';
        sync1.style.top = '80px';
        container.appendChild(sync1);
        
        const sync2 = createMessage('Sync');
        sync2.style.left = '380px';
        sync2.style.top = '180px';
        container.appendChild(sync2);
        
        await new Promise(resolve => setTimeout(resolve, 1000));
        addLog(logContainer, '2. 主节点同步数据到从节点', 'info');
        
        // 3. 从节点确认
        const ack1 = createMessage('ACK');
        ack1.style.left = '380px';
        ack1.style.top = '100px';
        container.appendChild(ack1);
        
        const ack2 = createMessage('ACK');
        ack2.style.left = '380px';
        ack2.style.top = '200px';
        container.appendChild(ack2);
        
        await new Promise(resolve => setTimeout(resolve, 1000));
        addLog(logContainer, '3. 从节点确认同步完成', 'success');
        
        // 4. 读取负载均衡
        const read1 = createMessage('Read');
        read1.style.left = '180px';
        read1.style.top = '80px';
        container.appendChild(read1);
        
        const read2 = createMessage('Read');
        read2.style.left = '180px';
        read2.style.top = '180px';
        container.appendChild(read2);
        
        await new Promise(resolve => setTimeout(resolve, 1000));
        addLog(logContainer, '4. 读操作负载均衡到从节点', 'info');
        
        // 清理消息
        [writeMsg, sync1, sync2, ack1, ack2, read1, read2].forEach(msg => msg.remove());
    }
    
    // 添加演示控制按钮
    const controls = container.parentElement.querySelector('.controls');
    const demoBtn = createElement('button', '', '演示主从复制');
    
    demoBtn.addEventListener('click', demonstrateMasterSlave);
    controls.appendChild(demoBtn);
}

// 哨兵架构演示
async function initSentinelDemo() {
    const container = document.getElementById('sentinel-diagram');
    const logContainer = document.createElement('div');
    logContainer.className = 'demo-logs';
    container.parentElement.appendChild(logContainer);
    
    container.innerHTML = '';
    logContainer.innerHTML = '';
    
    // 创建节点
    const app = createNode('sen-app', 'Application', 1);
    const sentinel1 = createNode('sen-sentinel1', 'Sentinel 1', 4);
    const sentinel2 = createNode('sen-sentinel2', 'Sentinel 2', 4);
    const sentinel3 = createNode('sen-sentinel3', 'Sentinel 3', 4);
    const master = createNode('sen-master', 'Master Cache', 2);
    const slave = createNode('sen-slave', 'Slave Cache', 2);
    
    // 添加节点到容器
    [app, sentinel1, sentinel2, sentinel3, master, slave].forEach(node => 
        container.appendChild(node));
    
    // 定位节点
    app.style.left = '50px';
    app.style.top = '125px';
    sentinel1.style.left = '250px';
    sentinel1.style.top = '50px';
    sentinel2.style.left = '250px';
    sentinel2.style.top = '125px';
    sentinel3.style.left = '250px';
    sentinel3.style.top = '200px';
    master.style.left = '450px';
    master.style.top = '80px';
    slave.style.left = '450px';
    slave.style.top = '170px';
    
    // 添加连接线
    const lines = [
        drawLine(170, 155, 250, 80),   // app -> sentinel1
        drawLine(170, 155, 250, 155),  // app -> sentinel2
        drawLine(170, 155, 250, 230),  // app -> sentinel3
        drawLine(370, 80, 450, 110),   // sentinel -> master
        drawLine(370, 230, 450, 200)   // sentinel -> slave
    ];
    
    lines.forEach(line => container.appendChild(line));
    
    // 演示故障转移
    async function demonstrateFailover() {
        addLog(logContainer, '开始演示哨兵架构故障转移', 'info');
        
        // 1. 监控主节点
        const ping1 = createMessage('PING');
        ping1.style.left = '380px';
        ping1.style.top = '80px';
        container.appendChild(ping1);
        
        await new Promise(resolve => setTimeout(resolve, 1000));
        addLog(logContainer, '1. 哨兵持续监控主节点', 'info');
        
        // 2. 主节点故障
        const failure = createMessage('Failure!');
        failure.style.left = '450px';
        failure.style.top = '50px';
        container.appendChild(failure);
        master.style.opacity = '0.5';
        
        await new Promise(resolve => setTimeout(resolve, 1000));
        addLog(logContainer, '2. 主节点发生故障', 'error');
        
        // 3. 哨兵投票
        const vote1 = createMessage('Vote');
        vote1.style.left = '250px';
        vote1.style.top = '80px';
        container.appendChild(vote1);
        
        const vote2 = createMessage('Vote');
        vote2.style.left = '250px';
        vote2.style.top = '155px';
        container.appendChild(vote2);
        
        const vote3 = createMessage('Vote');
        vote3.style.left = '250px';
        vote3.style.top = '230px';
        container.appendChild(vote3);
        
        await new Promise(resolve => setTimeout(resolve, 1000));
        addLog(logContainer, '3. 哨兵进行故障转移投票', 'info');
        
        // 4. 提升从节点
        slave.style.top = '80px';
        master.style.top = '170px';
        
        const promote = createMessage('Promote to Master');
        promote.style.left = '380px';
        promote.style.top = '80px';
        container.appendChild(promote);
        
        await new Promise(resolve => setTimeout(resolve, 1000));
        addLog(logContainer, '4. 提升从节点为新主节点', 'success');
        
        // 5. 通知应用程序
        const notify = createMessage('New Master');
        notify.style.left = '180px';
        notify.style.top = '100px';
        container.appendChild(notify);
        
        await new Promise(resolve => setTimeout(resolve, 1000));
        addLog(logContainer, '5. 通知应用程序切换新主节点', 'success');
        
        // 清理消息
        [ping1, failure, vote1, vote2, vote3, promote, notify].forEach(msg => msg.remove());
        
        // 重置节点位置
        await new Promise(resolve => setTimeout(resolve, 2000));
        slave.style.top = '170px';
        master.style.top = '80px';
        master.style.opacity = '1';
    }
    
    // 添加演示控制按钮
    const controls = container.parentElement.querySelector('.controls');
    const demoBtn = createElement('button', '', '演示故障转移');
    
    demoBtn.addEventListener('click', demonstrateFailover);
    controls.appendChild(demoBtn);
}

// 集群架构演示
async function initClusterDemo() {
    const container = document.getElementById('cluster-diagram');
    const logContainer = document.createElement('div');
    logContainer.className = 'demo-logs';
    container.parentElement.appendChild(logContainer);
    
    container.innerHTML = '';
    logContainer.innerHTML = '';
    
    // 创建节点
    const app = createNode('cl-app', 'Application', 1);
    const nodes = Array.from({length: 6}, (_, i) => 
        createNode(`cl-node${i+1}`, `Cache Node ${i+1}`, 2));
    
    // 添加节点到容器
    [app, ...nodes].forEach(node => container.appendChild(node));
    
    // 定位节点（环形布局）
    const centerX = 350;
    const centerY = 150;
    const radius = 150;
    
    app.style.left = '50px';
    app.style.top = '125px';
    
    nodes.forEach((node, i) => {
        const angle = (i * Math.PI * 2) / 6;
        node.style.left = (centerX + radius * Math.cos(angle)) + 'px';
        node.style.top = (centerY + radius * Math.sin(angle)) + 'px';
    });
    
    // 添加连接线
    const lines = nodes.map((_, i) => {
        const angle = (i * Math.PI * 2) / 6;
        return drawLine(
            170, 155,
            centerX + radius * Math.cos(angle),
            centerY + radius * Math.sin(angle)
        );
    });
    
    lines.forEach(line => container.appendChild(line));
    
    // 演示数据分片
    async function demonstrateSharding() {
        addLog(logContainer, '开始演示集群分片', 'info');
        
        // 1. 计算哈希值
        const hash = createMessage('Calculate Hash');
        hash.style.left = '180px';
        hash.style.top = '100px';
        container.appendChild(hash);
        
        await new Promise(resolve => setTimeout(resolve, 1000));
        addLog(logContainer, '1. 计算数据的哈希值', 'info');
        
        // 2. 定位分片
        const locate = createMessage('Locate Shard');
        locate.style.left = '180px';
        locate.style.top = '150px';
        container.appendChild(locate);
        
        await new Promise(resolve => setTimeout(resolve, 1000));
        addLog(logContainer, '2. 根据哈希值定位分片', 'info');
        
        // 3. 数据分布
        const distributions = [];
        for (let i = 0; i < 3; i++) {
            const msg = createMessage('Data Chunk ' + (i + 1));
            const angle = (i * Math.PI * 2) / 6;
            msg.style.left = (centerX - 50 + radius * Math.cos(angle)) + 'px';
            msg.style.top = (centerY - 20 + radius * Math.sin(angle)) + 'px';
            container.appendChild(msg);
            distributions.push(msg);
            
            await new Promise(resolve => setTimeout(resolve, 500));
        }
        
        await new Promise(resolve => setTimeout(resolve, 1000));
        addLog(logContainer, '3. 数据分布到不同节点', 'success');
        
        // 4. 数据复制
        const replications = [];
        for (let i = 0; i < 3; i++) {
            const msg = createMessage('Replicate');
            const angle = ((i + 3) * Math.PI * 2) / 6;
            msg.style.left = (centerX - 50 + radius * Math.cos(angle)) + 'px';
            msg.style.top = (centerY - 20 + radius * Math.sin(angle)) + 'px';
            container.appendChild(msg);
            replications.push(msg);
            
            await new Promise(resolve => setTimeout(resolve, 500));
        }
        
        await new Promise(resolve => setTimeout(resolve, 1000));
        addLog(logContainer, '4. 数据在节点间复制', 'success');
        
        // 清理消息
        [hash, locate, ...distributions, ...replications].forEach(msg => msg.remove());
    }
    
    // 添加演示控制按钮
    const controls = container.parentElement.querySelector('.controls');
    const demoBtn = createElement('button', '', '演示数据分片');
    
    demoBtn.addEventListener('click', demonstrateSharding);
    controls.appendChild(demoBtn);
}

// 初始化所有架构演示
document.addEventListener('DOMContentLoaded', function() {
    initMasterSlaveDemo();
    initSentinelDemo();
    initClusterDemo();
}); 