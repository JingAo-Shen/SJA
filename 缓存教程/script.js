// 缓存演示主脚本

// 初始化函数
function initCacheDemo() {
    // 获取演示容器
    const diagram = document.getElementById('cache-diagram');
    
    // 创建基本缓存演示元素
    diagram.innerHTML = `
        <div class="cache-demo">
            <div class="database">数据库</div>
            <div class="application">应用服务器</div>
            <div class="cache">缓存</div>
            <div class="arrows"></div>
        </div>
    `;
    
    // 添加演示控制按钮
    const controls = document.createElement('div');
    controls.className = 'controls';
    controls.innerHTML = `
        <button id="cache-hit-btn">演示缓存命中</button>
        <button id="cache-miss-btn">演示缓存未命中</button>
        <button id="cache-update-btn">演示缓存更新</button>
    `;
    diagram.parentNode.insertBefore(controls, diagram.nextSibling);
    
    // 绑定按钮事件
    document.getElementById('cache-hit-btn').addEventListener('click', demoCacheHit);
    document.getElementById('cache-miss-btn').addEventListener('click', demoCacheMiss);
    document.getElementById('cache-update-btn').addEventListener('click', demoCacheUpdate);
}

// 缓存命中演示
function demoCacheHit() {
    // 实现缓存命中动画效果
    console.log('演示缓存命中');
}

// 缓存未命中演示
function demoCacheMiss() {
    // 实现缓存未命中动画效果
    console.log('演示缓存未命中');
}

// 缓存更新演示
function demoCacheUpdate() {
    // 实现缓存更新动画效果
    console.log('演示缓存更新');
}

// 页面加载完成后初始化
window.addEventListener('DOMContentLoaded', initCacheDemo);