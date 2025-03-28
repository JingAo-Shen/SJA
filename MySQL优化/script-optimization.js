// 索引优化演示
async function initIndexOptimizationDemo() {
    const container = document.getElementById('index-optimization-diagram');
    const logContainer = document.createElement('div');
    logContainer.className = 'demo-logs';
    container.parentElement.appendChild(logContainer);
    
    container.innerHTML = '';
    logContainer.innerHTML = '';
    
    // 创建表结构
    const tableData = {
        columns: ['ID', '用户名', '年龄', '城市', '注册时间'],
        rows: [
            ['1', 'user1', '25', '北京', '2024-01-01'],
            ['2', 'user2', '30', '上海', '2024-01-02'],
            ['3', 'user3', '35', '广州', '2024-01-03'],
            ['4', 'user4', '40', '深圳', '2024-01-04']
        ]
    };
    
    const table = createTable(tableData.columns, tableData.rows);
    table.style.position = 'absolute';
    table.style.left = '50px';
    table.style.top = '50px';
    container.appendChild(table);
    
    // 创建执行计划面板
    const planPanel = createElement('div', 'execution-plan-panel');
    planPanel.style.position = 'absolute';
    planPanel.style.left = '400px';
    planPanel.style.top = '50px';
    planPanel.style.width = '300px';
    container.appendChild(planPanel);
    
    // 演示无索引查询
    async function demonstrateNoIndex() {
        addLog(logContainer, '开始演示无索引查询', 'info');
        
        const sql = 'SELECT * FROM users WHERE city = "北京"';
        const executionPlan = {
            type: 'TABLE SCAN',
            details: {
                table: 'users',
                rows_examined: tableData.rows.length,
                filtered: '25%'
            }
        };
        
        // 显示SQL
        const sqlMsg = createMessage(sql);
        sqlMsg.style.left = '50px';
        sqlMsg.style.top = '200px';
        container.appendChild(sqlMsg);
        
        await new Promise(resolve => setTimeout(resolve, 1000));
        addLog(logContainer, '执行全表扫描...', 'warning');
        
        // 显示扫描过程
        for (let i = 0; i < tableData.rows.length; i++) {
            const row = table.querySelector(`tr:nth-child(${i + 2})`);
            row.style.backgroundColor = '#ffeb3b';
            await new Promise(resolve => setTimeout(resolve, 500));
            row.style.backgroundColor = '';
        }
        
        // 显示执行计划
        planPanel.innerHTML = '';
        planPanel.appendChild(createExecutionPlan(executionPlan));
        
        await new Promise(resolve => setTimeout(resolve, 1000));
        addLog(logContainer, '全表扫描完成，检查了所有行', 'error');
        
        sqlMsg.remove();
    }
    
    // 演示索引查询
    async function demonstrateWithIndex() {
        addLog(logContainer, '开始演示索引查询', 'info');
        
        // 创建索引
        addLog(logContainer, '创建城市字段索引', 'info');
        const indexData = [
            { key: '北京', rowid: 1 },
            { key: '上海', rowid: 2 },
            { key: '广州', rowid: 3 },
            { key: '深圳', rowid: 4 }
        ];
        
        const indexTable = createTable(
            ['索引键', '行ID'],
            indexData.map(item => [item.key, item.rowid])
        );
        indexTable.style.position = 'absolute';
        indexTable.style.left = '400px';
        indexTable.style.top = '200px';
        container.appendChild(indexTable);
        
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const sql = 'SELECT * FROM users WHERE city = "北京" /* Using index */';
        const executionPlan = {
            type: 'INDEX LOOKUP',
            details: {
                table: 'users',
                possible_keys: 'idx_city',
                key: 'idx_city',
                rows_examined: 1,
                filtered: '100%'
            }
        };
        
        // 显示SQL
        const sqlMsg = createMessage(sql);
        sqlMsg.style.left = '50px';
        sqlMsg.style.top = '200px';
        container.appendChild(sqlMsg);
        
        await new Promise(resolve => setTimeout(resolve, 1000));
        addLog(logContainer, '使用索引查找...', 'info');
        
        // 显示索引查找过程
        const targetIndex = indexTable.querySelector('tr:nth-child(2)');
        targetIndex.style.backgroundColor = '#4caf50';
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // 显示数据查找过程
        const targetRow = table.querySelector('tr:nth-child(2)');
        targetRow.style.backgroundColor = '#4caf50';
        
        // 显示执行计划
        planPanel.innerHTML = '';
        planPanel.appendChild(createExecutionPlan(executionPlan));
        
        await new Promise(resolve => setTimeout(resolve, 1000));
        addLog(logContainer, '索引查找完成，只检查了匹配的行', 'success');
        
        await new Promise(resolve => setTimeout(resolve, 1000));
        targetIndex.style.backgroundColor = '';
        targetRow.style.backgroundColor = '';
        sqlMsg.remove();
    }
    
    // 添加演示控制按钮
    const controls = container.parentElement.querySelector('.controls');
    const noIndexBtn = createElement('button', '', '演示无索引查询');
    const withIndexBtn = createElement('button', '', '演示索引查询');
    
    noIndexBtn.addEventListener('click', demonstrateNoIndex);
    withIndexBtn.addEventListener('click', demonstrateWithIndex);
    
    controls.appendChild(noIndexBtn);
    controls.appendChild(withIndexBtn);
}

// SQL优化演示
async function initSQLOptimizationDemo() {
    const container = document.getElementById('sql-optimization-diagram');
    const logContainer = document.createElement('div');
    logContainer.className = 'demo-logs';
    container.parentElement.appendChild(logContainer);
    
    container.innerHTML = '';
    logContainer.innerHTML = '';
    
    // 创建原始SQL和优化后SQL的显示区域
    const sqlPanel = createElement('div', 'sql-panel');
    sqlPanel.style.position = 'absolute';
    sqlPanel.style.left = '50px';
    sqlPanel.style.top = '50px';
    sqlPanel.style.width = '600px';
    container.appendChild(sqlPanel);
    
    // 演示JOIN优化
    async function demonstrateJoinOptimization() {
        addLog(logContainer, '开始演示JOIN优化', 'info');
        
        const originalSQL = `
SELECT *
FROM orders o
LEFT JOIN users u ON o.user_id = u.id
LEFT JOIN products p ON o.product_id = p.id
WHERE o.status = 'completed'
        `.trim();
        
        const optimizedSQL = `
SELECT o.id, o.order_date, u.name, p.title
FROM orders o
INNER JOIN users u ON o.user_id = u.id
INNER JOIN products p ON o.product_id = p.id
WHERE o.status = 'completed'
        `.trim();
        
        // 显示原始SQL
        sqlPanel.innerHTML = `
            <div class="sql-block">
                <h4>原始SQL</h4>
                <pre><code>${originalSQL}</code></pre>
                <div class="sql-analysis">
                    <p>问题：</p>
                    <ul>
                        <li>使用SELECT *返回不必要的列</li>
                        <li>使用LEFT JOIN可能返回不需要的NULL行</li>
                    </ul>
                </div>
            </div>
        `;
        
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // 显示优化后SQL
        sqlPanel.innerHTML += `
            <div class="sql-block">
                <h4>优化后SQL</h4>
                <pre><code>${optimizedSQL}</code></pre>
                <div class="sql-analysis">
                    <p>优化：</p>
                    <ul>
                        <li>只选择需要的列</li>
                        <li>使用INNER JOIN减少数据量</li>
                    </ul>
                </div>
            </div>
        `;
        
        addLog(logContainer, 'JOIN语句优化完成', 'success');
    }
    
    // 演示子查询优化
    async function demonstrateSubqueryOptimization() {
        sqlPanel.innerHTML = '';
        logContainer.innerHTML = '';
        addLog(logContainer, '开始演示子查询优化', 'info');
        
        const originalSQL = `
SELECT *
FROM users
WHERE id IN (
    SELECT user_id
    FROM orders
    WHERE total_amount > 1000
)
        `.trim();
        
        const optimizedSQL = `
SELECT DISTINCT u.*
FROM users u
INNER JOIN orders o ON u.id = o.user_id
WHERE o.total_amount > 1000
        `.trim();
        
        // 显示原始SQL
        sqlPanel.innerHTML = `
            <div class="sql-block">
                <h4>原始SQL（使用子查询）</h4>
                <pre><code>${originalSQL}</code></pre>
                <div class="sql-analysis">
                    <p>问题：</p>
                    <ul>
                        <li>子查询可能导致性能问题</li>
                        <li>每个外部查询行都要执行一次子查询</li>
                    </ul>
                </div>
            </div>
        `;
        
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // 显示优化后SQL
        sqlPanel.innerHTML += `
            <div class="sql-block">
                <h4>优化后SQL（使用JOIN）</h4>
                <pre><code>${optimizedSQL}</code></pre>
                <div class="sql-analysis">
                    <p>优化：</p>
                    <ul>
                        <li>使用JOIN替代子查询</li>
                        <li>添加DISTINCT避免重复</li>
                    </ul>
                </div>
            </div>
        `;
        
        addLog(logContainer, '子查询优化完成', 'success');
    }
    
    // 添加演示控制按钮
    const controls = container.parentElement.querySelector('.controls');
    const joinBtn = createElement('button', '', '演示JOIN优化');
    const subqueryBtn = createElement('button', '', '演示子查询优化');
    
    joinBtn.addEventListener('click', demonstrateJoinOptimization);
    subqueryBtn.addEventListener('click', demonstrateSubqueryOptimization);
    
    controls.appendChild(joinBtn);
    controls.appendChild(subqueryBtn);
}

// 表结构优化演示
async function initTableOptimizationDemo() {
    const container = document.getElementById('table-optimization-diagram');
    const logContainer = document.createElement('div');
    logContainer.className = 'demo-logs';
    container.parentElement.appendChild(logContainer);
    
    container.innerHTML = '';
    logContainer.innerHTML = '';
    
    // 创建原始表结构
    const originalTable = {
        name: 'products',
        columns: [
            { name: 'id', type: 'INT', length: 11, nullable: false, key: 'PRI' },
            { name: 'name', type: 'VARCHAR', length: 255, nullable: false },
            { name: 'description', type: 'TEXT', nullable: true },
            { name: 'created_time', type: 'DATETIME', nullable: false },
            { name: 'modified_time', type: 'DATETIME', nullable: false },
            { name: 'status', type: 'TINYINT', length: 1, nullable: false },
            { name: 'category', type: 'VARCHAR', length: 50, nullable: false }
        ]
    };
    
    // 创建表结构显示
    function createTableStructure(table) {
        const structure = createElement('div', 'table-structure');
        structure.innerHTML = `
            <h4>${table.name}</h4>
            <table>
                <thead>
                    <tr>
                        <th>列名</th>
                        <th>类型</th>
                        <th>长度</th>
                        <th>允许NULL</th>
                        <th>键</th>
                    </tr>
                </thead>
                <tbody>
                    ${table.columns.map(col => `
                        <tr>
                            <td>${col.name}</td>
                            <td>${col.type}</td>
                            <td>${col.length || '-'}</td>
                            <td>${col.nullable ? 'YES' : 'NO'}</td>
                            <td>${col.key || ''}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
        return structure;
    }
    
    // 显示原始表结构
    const originalStructure = createTableStructure(originalTable);
    originalStructure.style.position = 'absolute';
    originalStructure.style.left = '50px';
    originalStructure.style.top = '50px';
    container.appendChild(originalStructure);
    
    // 演示表结构优化
    async function demonstrateTableOptimization() {
        addLog(logContainer, '开始演示表结构优化', 'info');
        
        // 1. 优化字段类型
        await new Promise(resolve => setTimeout(resolve, 1000));
        addLog(logContainer, '1. 优化字段类型', 'info');
        
        const optimizedTable = {
            name: 'products',
            columns: [
                { name: 'id', type: 'INT', length: 11, nullable: false, key: 'PRI' },
                { name: 'name', type: 'VARCHAR', length: 100, nullable: false },
                { name: 'description', type: 'VARCHAR', length: 500, nullable: true },
                { name: 'created_at', type: 'TIMESTAMP', nullable: false },
                { name: 'updated_at', type: 'TIMESTAMP', nullable: false },
                { name: 'status', type: 'TINYINT', length: 1, nullable: false },
                { name: 'category_id', type: 'SMALLINT', length: 6, nullable: false, key: 'MUL' }
            ]
        };
        
        const optimizedStructure = createTableStructure(optimizedTable);
        optimizedStructure.style.position = 'absolute';
        optimizedStructure.style.left = '450px';
        optimizedStructure.style.top = '50px';
        container.appendChild(optimizedStructure);
        
        // 2. 添加优化说明
        const optimizationNotes = createElement('div', 'optimization-notes');
        optimizationNotes.style.position = 'absolute';
        optimizationNotes.style.left = '50px';
        optimizationNotes.style.top = '300px';
        optimizationNotes.innerHTML = `
            <h4>优化说明：</h4>
            <ul>
                <li>name字段长度从255减少到100，节省空间</li>
                <li>description改用VARCHAR(500)替代TEXT，支持前缀索引</li>
                <li>时间字段使用TIMESTAMP替代DATETIME，节省空间</li>
                <li>category改为category_id，使用SMALLINT，并建立索引</li>
            </ul>
        `;
        container.appendChild(optimizationNotes);
        
        addLog(logContainer, '表结构优化完成', 'success');
    }
    
    // 添加演示控制按钮
    const controls = container.parentElement.querySelector('.controls');
    const demoBtn = createElement('button', '', '演示表结构优化');
    
    demoBtn.addEventListener('click', demonstrateTableOptimization);
    controls.appendChild(demoBtn);
}

// 初始化所有优化演示
document.addEventListener('DOMContentLoaded', function() {
    initIndexOptimizationDemo();
    initSQLOptimizationDemo();
    initTableOptimizationDemo();
}); 