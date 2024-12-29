// API配置
const API_CONFIG = {
	BASE_URL: 'http://localhost:9092/api',
	ENDPOINTS: {
		ETC_DATA: '/etc/data'    // 统一使用一个数据接口
	}
};

// 数据处理函数
function processETCData(data) {
	if (!Array.isArray(data) || data.length === 0) {
		console.warn('没有接收到数据或数据格式不正确');
		return null;
	}

	try {
		return {
			// 处理入深车辆
			inbound: data
				.filter(item => item.BZ === '深圳入')
				.map(item => ({
					vehicleNo: item.CP || '未知车牌',
					tollStation: item.SFZRKMC || '未知站点',
					passTime: item.RKSJ || '未知时间'
				})),

			// 处理出深车辆
			outbound: data
				.filter(item => item.BZ === '深圳出')
				.map(item => ({
					vehicleNo: item.CP || '未知车牌',
					tollStation: item.SFZCKMC || '未知站点',
					passTime: item.CKSJ || '未知时间'
				})),

			// 处理车型分布
			vehicleTypes: data.reduce((acc, item) => {
				const type = item.CX || '未知车型';
				acc[type] = (acc[type] || 0) + 1;
				return acc;
			}, {}),

			// 处理收费站流量
			stationFlow: data.reduce((acc, item) => {
				const station = item.SFZRKMC || item.SFZCKMC || '未知站点';
				acc[station] = (acc[station] || 0) + 1;
				return acc;
			}, {})
		};
	} catch (error) {
		console.error('数据处理错误:', error);
		return null;
	}
}

// 更新数据函数
async function updateDashboard() {
	try {
		const response = await fetch(API_CONFIG.BASE_URL + API_CONFIG.ENDPOINTS.ETC_DATA);
		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}
		const data = await response.json();
		
		// 数据处理
		const processedData = processETCData(data);
		if (!processedData) return;

		// 更新入深车辆列表
		if (processedData.inbound.length > 0) {
			updateInboundList(processedData.inbound);
		}

		// 更新出深车辆列表
		if (processedData.outbound.length > 0) {
			updateOutboundList(processedData.outbound);
		}

		// 更新车型分布图表
		if (Object.keys(processedData.vehicleTypes).length > 0) {
			updateVehicleTypeChart(processedData.vehicleTypes);
		}

		// 更新收费站流量图表
		if (Object.keys(processedData.stationFlow).length > 0) {
			updateStationFlowChart(processedData.stationFlow);
		}

	} catch (error) {
		console.error('数据更新错误:', error);
	}
}

// 更新入深车辆列表
function updateInboundList(data) {
	const inboundList = document.querySelector('.w1 .maquee ul');
	if (!inboundList) return;
	
	inboundList.innerHTML = data.slice(0, 6).map(item => `
		<li>
			<div>${item.vehicleNo}</div>
			<div>${item.tollStation}</div>
			<div>${item.passTime}</div>
		</li>
	`).join('');
}

// 更新出深车辆列表
function updateOutboundList(data) {
	const outboundList = document.querySelector('.w2 .maquee ul');
	if (!outboundList) return;
	
	outboundList.innerHTML = data.slice(0, 6).map(item => `
		<li>
			<div>${item.vehicleNo}</div>
			<div>${item.tollStation}</div>
			<div>${item.passTime}</div>
		</li>
	`).join('');
}

// 更新车型分布图表
function updateVehicleTypeChart(data) {
	const chart1 = echarts.init(document.getElementById('main1'));
	if (!chart1) return;

	chart1.setOption({
		tooltip: {
			trigger: 'item',
			formatter: '{a} <br/>{b}: {c} ({d}%)'
		},
		series: [{
			name: '车辆类型',
			type: 'pie',
			radius: ['50%', '70%'],
			data: Object.entries(data).map(([name, value]) => ({
				name,
				value
			}))
		}]
	});
}

// 更新收费站流量图表
function updateStationFlowChart(data) {
	const chart3 = echarts.init(document.getElementById('main3'));
	if (!chart3) return;

	chart3.setOption({
		xAxis: {
			type: 'category',
			data: Object.keys(data)
		},
		yAxis: {
			type: 'value'
		},
		series: [{
			data: Object.values(data),
			type: 'bar'
		}]
	});
}

// 定时更新数据
let updateInterval = setInterval(updateDashboard, 5000);

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
	updateDashboard();
});

// 页面隐藏时停止更新
document.addEventListener('visibilitychange', () => {
	if (document.hidden) {
		clearInterval(updateInterval);
	} else {
		updateInterval = setInterval(updateDashboard, 5000);
		updateDashboard();
	}
});

// 保留原有的滚动效果
function autoScroll(obj){  
	$(obj).find("ul").animate({  
		marginTop : "-39px"  
	},500,function(){  
		$(this).css({marginTop : "0px"}).find("li:first").appendTo(this);  
	})  
}  

$(function(){  
	setInterval('autoScroll(".maquee")',2000);
}) 

