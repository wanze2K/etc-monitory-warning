function exportToExcel() {
    // 获取表格数据
    const table = document.querySelector('table');
    const rows = table.querySelectorAll('tr');
    let csvContent = [];
    
    // 获取表头
    const headers = [
        "序号", "车牌", "车型", "入口时间", 
        "收费站入口名称", "出口时间", "收费站出口名称", 
        "备注"
    ];
    csvContent.push(headers);
    
    // 获取数据行
    for (let i = 1; i < rows.length; i++) {
        const row = rows[i];
        const cells = row.querySelectorAll('td');
        const rowData = [];
        cells.forEach(cell => {
            rowData.push(cell.innerText);
        });
        if (rowData.length > 0) {
            csvContent.push(rowData);
        }
    }
    
    // 转换为Excel格式
    let excelContent = '';
    csvContent.forEach(row => {
        excelContent += row.join('\t') + '\n';
    });
    
    // 创建Blob对象
    const blob = new Blob(["\ufeff" + excelContent], {
        type: 'application/vnd.ms-excel;charset=utf-8'
    });
    
    // 创建下载链接
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    
    // 获取当前时间作为文件名
    const now = new Date();
    const fileName = `数据查询结果_${now.getFullYear()}${(now.getMonth()+1).toString().padStart(2,'0')}${now.getDate().toString().padStart(2,'0')}_${now.getHours().toString().padStart(2,'0')}${now.getMinutes().toString().padStart(2,'0')}${now.getSeconds().toString().padStart(2,'0')}.xls`;
    
    link.download = fileName;
    
    // 触发下载
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// 添加导出按钮点击事件
document.addEventListener('DOMContentLoaded', function() {
    const exportBtn = document.querySelector('.export-btn');
    if (exportBtn) {
        exportBtn.addEventListener('click', exportToExcel);
    }
}); 