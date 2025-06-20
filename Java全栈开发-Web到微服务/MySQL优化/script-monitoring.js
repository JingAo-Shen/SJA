// 查询执行计划分析演示
async function initExplainAnalysisDemo() {
    const container = document.getElementById('query-view');
    const logContainer = document.getElementById('query-logs');
    
    container.innerHTML = '';
    logContainer.innerHTML = '';
    
    // 创建查询和执行计划显示区域
    const queryPanel = createElement('div', 'query-panel');
    queryPanel.style.position = 'absolute';
    queryPanel.style.left = '50px';
    queryPanel.style.top = '50px';
    queryPanel.style.width = '600px';
    container.appendChild(queryPanel);
    
    // 演示复杂查询的执行计划分析
    async function analyzeComplexQuery() {
        addLog(logContainer, '开始分析复杂查询的执行计划', 'info');
        
        const complexQuery = `
SELECT 
    c.customer_name,
    COUNT(o.order_id) as order_count,
    SUM(o.total_amount) as total_spent
FROM 
    customers c
    LEFT JOIN orders o ON c.customer_id = o.customer_id
    LEFT JOIN order_items oi ON o.order_id = oi.order_id
WHERE 
    o.order_date >= '2024-01-01'
    AND o.status = 'completed'
GROUP BY 
    c.customer_id
HAVING 
    total_spent > 1000
ORDER BY 
    total_spent DESC
LIMIT 10
        `.trim();
        
        // 显示原始查询
        queryPanel.innerHTML = `
            <div class="query-block">
                <h4>复杂查询SQL</h4>
                <pre><code>${complexQuery}</code></pre>
            </div>
        `;
        
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // 显示执行计划
        const executionPlan = {
            type: 'LIMIT',
            details: { rows: 10 },
            children: [{
                type: 'SORT',
                details: { sort_key: 'total_spent', direction: 'DESC' },
                children: [{
                    type: 'HAVING',
                    details: { condition: 'total_spent > 1000' },
                    children: [{
                        type: 'GROUP BY',
                        details: { group_key: 'c.customer_id' },
                        children: [{
                            type: 'FILTER',
                            details: { 
                                condition: "o.order_date >= '2024-01-01' AND o.status = 'completed'"
                            },
                            children: [{
                                type: 'HASH JOIN',
                                details: {
                                    join_type: 'LEFT OUTER',
                                    join_condition: 'o.order_id = oi.order_id'
                                },
                                children: [{
                                    type: 'HASH JOIN',
                                    details: {
                                        join_type: 'LEFT OUTER',
                                        join_condition: 'c.customer_id = o.customer_id'
                                    },
                                    children: [{
                                        type: 'TABLE ACCESS',
                                        details: {
                                            table: 'customers',
                                            access_type: 'FULL'
                                        }
                                    }, {
                                        type: 'TABLE ACCESS',
                                        details: {
                                            table: 'orders',
                                            access_type: 'INDEX',
                                            index: 'idx_order_date'
                                        }
                                    }]
                                }, {
                                    type: 'TABLE ACCESS',
                                    details: {
                                        table: 'order_items',
                                        access_type: 'INDEX',
                                        index: 'idx_order_id'
                                    }
                                }]
                            }]
                        }]
                    }]
                }]
            }]
        };
        
        addLog(logContainer, '生成查询执行计划', 'info');
        queryPanel.innerHTML += `
            <div class="execution-plan-block">
                <h4>执行计划分析</h4>
                ${createExecutionPlan(executionPlan).outerHTML}
            </div>
        `;
        
        // 添加优化建议
        await new Promise(resolve => setTimeout(resolve, 1000));
        addLog(logContainer, '分析执行计划并生成优化建议', 'info');
        
        queryPanel.innerHTML += `
            <div class="optimization-suggestions">
                <h4>优化建议</h4>
                <ul>
                    <li>为customers表的customer_id创建索引，避免全表扫描</li>
                    <li>考虑将LEFT JOIN改为INNER JOIN，如果不需要包含没有订单的客户</li>
                    <li>可以考虑在orders表上创建复合索引(customer_id, order_date, status)</li>
                    <li>如果total_spent筛选条件过滤掉大量数据，考虑在订单金额上建立索引</li>
                </ul>
            </div>
        `;
        
        addLog(logContainer, '执行计划分析完成', 'success');
    }
    
    // 添加演示控制按钮
    const controls = container.parentElement.querySelector('.simulation-controls');
    const analyzeBtn = controls.querySelector('#start-query');
    const resetBtn = controls.querySelector('#reset-query');
    
    analyzeBtn.addEventListener('click', analyzeComplexQuery);
    resetBtn.addEventListener('click', () => {
        container.innerHTML = '';
        logContainer.innerHTML = '';
    });
}

// JOIN优化演示
async function initJoinOptimizationDemo() {
    const container = document.getElementById('query-view');
    const logContainer = document.getElementById('query-logs');
    
    container.innerHTML = '';
    logContainer.innerHTML = '';
    
    // 创建查询优化显示区域
    const optimizationPanel = createElement('div', 'optimization-panel');
    optimizationPanel.style.position = 'absolute';
    optimizationPanel.style.left = '50px';
    optimizationPanel.style.top = '50px';
    optimizationPanel.style.width = '600px';
    container.appendChild(optimizationPanel);
    
    // 演示JOIN优化过程
    async function demonstrateJoinOptimization() {
        addLog(logContainer, '开始JOIN查询优化分析', 'info');
        
        // 1. 显示原始JOIN查询
        const originalQuery = `
SELECT 
    p.product_name,
    c.category_name,
    s.supplier_name,
    i.inventory_count
FROM 
    products p
    LEFT JOIN categories c ON p.category_id = c.id
    LEFT JOIN suppliers s ON p.supplier_id = s.id
    LEFT JOIN inventory i ON p.product_id = i.product_id
WHERE 
    p.price > 100
        `.trim();
        
        optimizationPanel.innerHTML = `
            <div class="query-block">
                <h4>原始JOIN查询</h4>
                <pre><code>${originalQuery}</code></pre>
                <div class="performance-metrics">
                    <p>预估性能指标：</p>
                    <ul>
                        <li>扫描行数: ~10000</li>
                        <li>临时表大小: 2MB</li>
                        <li>预估执行时间: 1.5s</li>
                    </ul>
                </div>
            </div>
        `;
        
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // 2. 显示优化后的查询
        const optimizedQuery = `
SELECT 
    p.product_name,
    c.category_name,
    s.supplier_name,
    i.inventory_count
FROM 
    (SELECT product_id, product_name, category_id, supplier_id 
     FROM products 
     WHERE price > 100) p
    INNER JOIN categories c ON p.category_id = c.id
    INNER JOIN suppliers s ON p.supplier_id = s.id
    INNER JOIN inventory i ON p.product_id = i.product_id
        `.trim();
        
        optimizationPanel.innerHTML += `
            <div class="query-block">
                <h4>优化后的JOIN查询</h4>
                <pre><code>${optimizedQuery}</code></pre>
                <div class="performance-metrics">
                    <p>优化后性能指标：</p>
                    <ul>
                        <li>扫描行数: ~2000</li>
                        <li>临时表大小: 500KB</li>
                        <li>预估执行时间: 0.3s</li>
                    </ul>
                </div>
            </div>
        `;
        
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // 3. 添加优化说明
        optimizationPanel.innerHTML += `
            <div class="optimization-notes">
                <h4>优化说明</h4>
                <ul>
                    <li>将LEFT JOIN改为INNER JOIN，减少NULL值处理</li>
                    <li>使用子查询先过滤products表，减少参与JOIN的行数</li>
                    <li>建议在products表的price字段上创建索引</li>
                    <li>确保所有JOIN字段上都有适当的索引</li>
                </ul>
            </div>
        `;
        
        addLog(logContainer, 'JOIN查询优化完成', 'success');
    }
    
    // 添加演示控制按钮
    const controls = container.parentElement.querySelector('.simulation-controls');
    const analyzeBtn = controls.querySelector('#start-query');
    const resetBtn = controls.querySelector('#reset-query');
    
    analyzeBtn.addEventListener('click', demonstrateJoinOptimization);
    resetBtn.addEventListener('click', () => {
        container.innerHTML = '';
        logContainer.innerHTML = '';
    });
}

// 子查询优化演示
async function initSubqueryOptimizationDemo() {
    const container = document.getElementById('query-view');
    const logContainer = document.getElementById('query-logs');
    
    container.innerHTML = '';
    logContainer.innerHTML = '';
    
    // 创建子查询优化显示区域
    const subqueryPanel = createElement('div', 'subquery-panel');
    subqueryPanel.style.position = 'absolute';
    subqueryPanel.style.left = '50px';
    subqueryPanel.style.top = '50px';
    subqueryPanel.style.width = '600px';
    container.appendChild(subqueryPanel);
    
    // 演示子查询优化
    async function demonstrateSubqueryOptimization() {
        addLog(logContainer, '开始子查询优化分析', 'info');
        
        // 1. 显示原始子查询
        const originalQuery = `
SELECT 
    product_name,
    price,
    (SELECT category_name 
     FROM categories 
     WHERE id = products.category_id) as category,
    (SELECT AVG(price) 
     FROM products p2 
     WHERE p2.category_id = products.category_id) as avg_category_price
FROM 
    products
WHERE 
    price > (
        SELECT AVG(price) * 1.5 
        FROM products
    )
        `.trim();
        
        subqueryPanel.innerHTML = `
            <div class="query-block">
                <h4>原始子查询</h4>
                <pre><code>${originalQuery}</code></pre>
                <div class="performance-analysis">
                    <p>性能问题：</p>
                    <ul>
                        <li>包含多个相关子查询，每行都需要执行</li>
                        <li>重复计算平均价格</li>
                        <li>查询执行效率低下</li>
                    </ul>
                </div>
            </div>
        `;
        
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // 2. 显示优化后的查询
        const optimizedQuery = `
WITH avg_price AS (
    SELECT AVG(price) as overall_avg
    FROM products
),
category_stats AS (
    SELECT 
        category_id,
        AVG(price) as category_avg
    FROM products
    GROUP BY category_id
)
SELECT 
    p.product_name,
    p.price,
    c.category_name,
    cs.category_avg
FROM 
    products p
    JOIN categories c ON p.category_id = c.id
    JOIN category_stats cs ON p.category_id = cs.category_id
    CROSS JOIN avg_price ap
WHERE 
    p.price > ap.overall_avg * 1.5
        `.trim();
        
        subqueryPanel.innerHTML += `
            <div class="query-block">
                <h4>优化后的查询</h4>
                <pre><code>${optimizedQuery}</code></pre>
                <div class="performance-analysis">
                    <p>优化效果：</p>
                    <ul>
                        <li>使用CTE预先计算并重用结果</li>
                        <li>避免相关子查询</li>
                        <li>减少重复计算</li>
                        <li>提高查询可读性</li>
                    </ul>
                </div>
            </div>
        `;
        
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // 3. 添加性能对比
        subqueryPanel.innerHTML += `
            <div class="performance-comparison">
                <h4>性能对比</h4>
                <table>
                    <tr>
                        <th></th>
                        <th>原始查询</th>
                        <th>优化后查询</th>
                    </tr>
                    <tr>
                        <td>执行时间</td>
                        <td>2.5s</td>
                        <td>0.5s</td>
                    </tr>
                    <tr>
                        <td>扫描行数</td>
                        <td>50000+</td>
                        <td>10000</td>
                    </tr>
                    <tr>
                        <td>临时表使用</td>
                        <td>多个</td>
                        <td>2个(CTE)</td>
                    </tr>
                </table>
            </div>
        `;
        
        addLog(logContainer, '子查询优化完成', 'success');
    }
    
    // 添加演示控制按钮
    const controls = container.parentElement.querySelector('.simulation-controls');
    const analyzeBtn = controls.querySelector('#start-query');
    const resetBtn = controls.querySelector('#reset-query');
    
    analyzeBtn.addEventListener('click', demonstrateSubqueryOptimization);
    resetBtn.addEventListener('click', () => {
        container.innerHTML = '';
        logContainer.innerHTML = '';
    });
}

// 根据选择的演示类型初始化相应的演示
function initQueryDemo() {
    const queryType = document.getElementById('query-type').value;
    switch (queryType) {
        case 'explain':
            initExplainAnalysisDemo();
            break;
        case 'join':
            initJoinOptimizationDemo();
            break;
        case 'subquery':
            initSubqueryOptimizationDemo();
            break;
    }
}

// 监听演示类型选择变化
document.addEventListener('DOMContentLoaded', function() {
    const queryTypeSelect = document.getElementById('query-type');
    if (queryTypeSelect) {
        queryTypeSelect.addEventListener('change', initQueryDemo);
        // 初始化默认演示
        initQueryDemo();
    }
}); 