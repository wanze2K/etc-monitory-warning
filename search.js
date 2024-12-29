// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    // 初始化标签切换
    initTabs();
    // 初始化查询功能
    initSearch();
    // 初始化分页
    initPagination();
});

// 标签切换功能
function initTabs() {
    const tabs = document.querySelectorAll('.search-tabs .tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            tabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            // 根据不同标签显示不同的查询表单
            updateSearchForm(this.textContent);
        });
    });
}

// 根据标签更新查询表单
function updateSearchForm(tabName) {
    const formContainer = document.querySelector('.search-form');
    switch(tabName) {
        case '车辆查询':
            formContainer.innerHTML = generateVehicleForm();
            break;
        case '收费站查询':
            formContainer.innerHTML = generateTollStationForm();
            break;
        case '统计分析':
            formContainer.innerHTML = generateAnalysisForm();
            break;
    }
}

// 生成车辆查询表单
function generateVehicleForm() {
    return `
        <div class="form-group">
            <label>车牌号码</label>
            <input type="text" placeholder="请输入车牌号码">
        </div>
        <div class="form-group">
            <label>时间范围</label>
            <div class="date-range">
                <input type="datetime-local">
                <span>至</span>
                <input type="datetime-local">
            </div>
        </div>
        <div class="form-group">
            <label>收费站</label>
            <select>
                <option value="">全部</option>
                <option value="1">南头收费站</option>
                <option value="2">福永收费站</option>
                <option value="3">松岗收费站</option>
            </select>
        </div>
        <button class="search-btn" onclick="performSearch()">
            <i class="fas fa-search"></i>
            查询
        </button>
    `;
}

// 生成收费站查询表单
function generateTollStationForm() {
    return `
        <div class="form-group">
            <label>收费站名称</label>
            <select>
                <option value="">请选择收费站</option>
                <option value="1">南��收费站</option>
                <option value="2">福永收费站</option>
                <option value="3">松岗收费站</option>
            </select>
        </div>
        <div class="form-group">
            <label>统计时段</label>
            <div class="date-range">
                <input type="date">
                <span>至</span>
                <input type="date">
            </div>
        </div>
        <div class="form-group">
            <label>车型</label>
            <select>
                <option value="">全部</option>
                <option value="1">客车</option>
                <option value="2">货车</option>
                <option value="3">专用车</option>
            </select>
        </div>
        <button class="search-btn" onclick="performSearch()">
            <i class="fas fa-search"></i>
            查询
        </button>
    `;
}

// 生成统计分析表单
function generateAnalysisForm() {
    return `
        <div class="form-group">
            <label>分析类型</label>
            <select>
                <option value="flow">车流量分析</option>
                <option value="peak">高峰期分析</option>
                <option value="vehicle">车型分布</option>
            </select>
        </div>
        <div class="form-group">
            <label>统计周期</label>
            <select>
                <option value="day">日报表</option>
                <option value="week">周报表</option>
                <option value="month">月报表</option>
            </select>
        </div>
        <div class="form-group">
            <label>时间选择</label>
            <input type="month">
        </div>
        <button class="search-btn" onclick="performAnalysis()">
            <i class="fas fa-chart-bar"></i>
            分析
        </button>
    `;
}

// 执行查询
function performSearch() {
    // 模拟数据
    const mockData = [
        {id: 1, plate: '粤B12345', type: '客车', enterTime: '2024-03-15 08:30', enterStation: '南头收费站', 
         exitTime: '2024-03-15 09:15', exitStation: '福永收费站', note: '正常'},
        {id: 2, plate: '粤B67890', type: '货车', enterTime: '2024-03-15 09:00', enterStation: '松岗收费站',
         exitTime: '2024-03-15 10:00', exitStation: '南头收费站', note: '超时'},
    ];

    updateTable(mockData);
    updatePagination(mockData.length);
}

// 更新表格数据
function updateTable(data) {
    const tbody = document.getElementById('resultBody');
    tbody.innerHTML = data.map(item => `
        <tr>
            <td>${item.id}</td>
            <td>${item.plate}</td>
            <td>${item.type}</td>
            <td>${item.enterTime}</td>
            <td>${item.enterStation}</td>
            <td>${item.exitTime}</td>
            <td>${item.exitStation}</td>
            <td>${item.note}</td>
        </tr>
    `).join('');
}

// 初始化分页
function initPagination() {
    const prevBtn = document.querySelector('.pagination button:first-child');
    const nextBtn = document.querySelector('.pagination button:last-child');
    
    prevBtn.addEventListener('click', () => {
        if (!prevBtn.disabled) {
            // 处理上一页
        }
    });
    
    nextBtn.addEventListener('click', () => {
        if (!nextBtn.disabled) {
            // 处理下一页
        }
    });
}

// 更新分页信息
function updatePagination(total) {
    const pageInfo = document.querySelector('.page-info');
    pageInfo.textContent = `第 1 页 / 共 ${Math.ceil(total / 10)} 页`;
} 