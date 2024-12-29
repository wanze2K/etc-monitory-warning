// script.js
// 添加分页相关变量
let currentPage = 1;
const pageSize = 20;
let allData = [];

// API配置
const API_BASE_URL = '/api/v1';

// 从后端获取数据的函数
async function fetchData(params = {}) {
    try {
        const queryString = new URLSearchParams({
            page: params.page || 1,
            pageSize: params.pageSize || 20,
            xh: params.xh || '',
            cp: params.cp || '',
            cx: params.cx || '',
            rksj: params.rksj || '',
            sfzrkmc: params.sfzrkmc || '',
            cksj: params.cksj || '',
            sfzckmc: params.sfzckmc || '',
            bz: params.bz || ''
        }).toString();

        const response = await fetch(`${API_BASE_URL}/vehicles?${queryString}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('网络请求失败');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('获取数据失败:', error);
        throw error;
    }
}

// 页面加载时初始化数据
window.onload = async function() {
    try {
        const response = await fetchData();
        allData = response.data;
        document.getElementById('totalRecords').textContent = response.total || allData.length;
        showPage(1);
    } catch (error) {
        document.getElementById('result').textContent = '加载数据失败，请稍后重试';
    }
};

// 搜索功能
document.getElementById('searchButton').addEventListener('click', async function() {
    try {
        const params = {
            xh: document.getElementById('queryXH').value,
            cp: document.getElementById('queryCP').value,
            cx: document.getElementById('queryCX').value,
            rksj: document.getElementById('queryRKSJ').value,
            sfzrkmc: document.getElementById('querySFZRKMC').value,
            cksj: document.getElementById('queryCKSJ').value,
            sfzckmc: document.getElementById('querySFZCKMC').value,
            bz: document.getElementById('queryBZ').value
        };

        const response = await fetchData(params);
        allData = response.data;
        document.getElementById('totalRecords').textContent = response.total || allData.length;
        showPage(1);
    } catch (error) {
        document.getElementById('result').textContent = '查询失败，请稍后重试';
    }
});

// 分页显示功能
function showPage(page) {
    currentPage = page;
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const pageData = allData.slice(start, end);
    
    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = '';
    
    if (pageData.length > 0) {
        pageData.forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${item.XH}</td>
                <td>${item.CP}</td>
                <td>${item.CX}</td>
                <td>${item.RKSJ}</td>
                <td>${item.SFZRKMC}</td>
                <td>${item.CKSJ}</td>
                <td>${item.SFZCKMC}</td>
                <td>${item.BZ}</td>
            `;
            resultDiv.appendChild(row);
        });
    } else {
        resultDiv.innerHTML = '<tr><td colspan="8" class="no-data">未找到匹配的记录</td></tr>';
    }
    
    document.getElementById('currentPage').textContent = currentPage;
}

// 分页按钮事件监听
document.querySelectorAll('.page-btn').forEach(btn => {
    btn.addEventListener('click', async function() {
        const totalPages = Math.ceil(allData.length / pageSize);
        let targetPage = currentPage;

        switch(this.textContent) {
            case '首页':
                targetPage = 1;
                break;
            case '上一页':
                if (currentPage > 1) targetPage = currentPage - 1;
                break;
            case '下一页':
                if (currentPage < totalPages) targetPage = currentPage + 1;
                break;
            case '末页':
                targetPage = totalPages;
                break;
        }

        if (targetPage !== currentPage) {
            try {
                const response = await fetchData({ page: targetPage });
                allData = response.data;
                showPage(targetPage);
            } catch (error) {
                console.error('切换页面失败:', error);
            }
        }
    });
});

// 添加刷新按钮事件处理
document.querySelector('.action-btn').addEventListener('click', async function() {
    try {
        const response = await fetchData();
        allData = response.data;
        document.getElementById('totalRecords').textContent = response.total || allData.length;
        showPage(1);
    } catch (error) {
        document.getElementById('result').textContent = '刷新数据失败，请稍后重试';
    }
});