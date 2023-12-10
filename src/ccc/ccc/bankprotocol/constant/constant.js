//HsJGgXoCueKidK+JSYUoEgS1FkGUKUwPb0m/3mXGcgkOPeRtyVYGWRwtiwAzin4u
export const cardPageId = '36610CC_C01';

export const ListPageId = '36610CC_L01';

export const formId = 'form_info';

export const tableId1 = 'table_detail';

export const tableId2 = 'table_guarantee';

export const tableId3 = 'table_credit';

export const moduleId = '36610CC';

/**
 * 模板
 */
export const TEMPLATE = {
	CARD_PAGE_ID: '36610CC_C01',
	LIST_PAGE_ID: '36610CC_L01',
	FORM_ID: 'form_info',
	FORM_BASE_ID: 'form_basic',
	TABLE_DETAIL: 'table_detail',
	TABLE_GUARANTEE: 'table_guarantee',
	TABLE_CREDIT: 'table_credit'
};

/**
 * 模块
 */
export const MOUDULEID = '3661';
/**
 * 卡片
 */
export const CONST_CARD = {
	CacheKey: 'ccc.ccc.bankprotocol.CacheKey',
	head_btn_code:'card_head'
};
/**
 * 列表
 */
export const CONST_LIST = {};
/**
 * 
 * 主键
 */
export const PK_CODE = 'pk_protocol';
/**
 * 
 * 主表
 */
export const TABLE_CODE= 'ccc_bankprotocol';

export const dataSource = 'ccc.ccc.bankprotocol.CacheSource';

export const key = 'ccc.ccc.bankprotocol.CacheKey';

/*查询区域缓存Key*/
export const searchKey = 'ccc.ccc.bankprotocol.searchCache';
/*查询区域缓存数据的名称空间*/
export const searchSpace = 'ccc.ccc.bankprotocol.searchSpace';
//按钮平铺显示数量
export const btnLimit = 3;

/**
 * tabs区域参数配置
*/
// 卡片页面tab区域相关编码
export const tabs = {
	tabCode: 'table_detail', //tab区域code编码
	tabCreCode:'table_credit',
	btnCode: 'tabs_head', //tab区域肩部区域按钮code
	bodyCode: 'tabs_body', //tab区域表格区域按钮code
	tabOrder: [ 'table_detail', 'table_guarantee' ], //tab区域排序
	showTab: [ 'table_detail' ], //首次加载的页签数组
	tabId: {
		//tab区域的主键ID
		table_detail: 'pk_detail',
		table_guarantee: 'pk_guarantee'
	}
};

//请求URL
export const URL = {
	SAVE: '/nccloud/ccc/bankprotocol/save.do' //保存
};

//单据信息
export const BILLINFO = {
	PK: 'pk_protocol'
};

//Action URL
export const ACTION_URL = {
	//保存
	SAVE: '/nccloud/ccc/bankprotocol/save.do',
	//删除
	DELETE: '/nccloud/ccc/bankprotocol/delete.do',
	//提交
	SUBMIT: '/nccloud/ccc/bankprotocol/submit.do',
	//收回
	WITHDRAW: '/nccloud/ccc/bankprotocol/withdraw.do',
	//冻结
	FRONZEN: '/nccloud/ccc/bankprotocol/frozen.do',
	//取消冻结
	UNFRONZEN: '/nccloud/ccc/bankprotocol/unfrozen.do',
	//结束
	TERMINATE: '/nccloud/ccc/bankprotocol/terminate.do',
	//取消冻结
	UNTERMINATE: '/nccloud/ccc/bankprotocol/unterminate.do',
	//删除版本
	DELVERSION: '/nccloud/ccc/bankprotocol/delversion.do',
	//联查版本
	LISTVERSION: '/nccloud/ccc/bankprotocol/querylistversion.do',
	//联查版本
	CARDVERSION: '/nccloud/ccc/bankprotocol/querycardversion.do',
	//联查预算
	LINKNTB: '/nccloud/ccc/bankprotocol/linkntb.do',
	//编辑后事件
	AFTEREDIT: '/nccloud/ccc/bankprotocol/afteredit.do',
	//查询(列表)
	QUERY: '/nccloud/ccc/bankprotocol/query.do',
	//查询（卡片）
	QUERY_BY_PK: '/nccloud/ccc/bankprotocol/querybypk.do',
	//分页
	PAGEQUERY: '/nccloud/ccc/bankprotocol/pagequery.do',
	//打印
	PRINT: '/nccloud/ccc/bankprotocol/print.do',
	//初始化
	INIT: '/nccloud/ccc/bankprotocol/init.do',
	//预算联查
	NTBLINK: '/nccloud/ccc/bankprotocol/ntblink.do',
	//复制
	COPY: '/nccloud/ccc/bankprotocol/copy.do',
	//修改校验逻辑
	SAGACHECK:'/nccloud/tmpub/pub/sagacheck.do',
	//传送GMS
	TRANSMITGMS:'/nccloud/ccc/bankprotocol/transmitGMS.do',
	// 影像查看
	RECEIPTCHECK:'/nccloud/pub/pub/pubQueryOrderImage.do'
	// RECEIPTCHECK:'/nccloud/ccc/image/protocolqueryorderimage.do'
};

// 表头变更禁用字段
export const changeHeadDis = [
	'pk_org',
	'pk_org_v',
	'protocolcode',
	'pk_creditbank',
	'pk_currtype',
	'protocoltype',
	'olcrate',
	'usetype',
	'inheritprotocol',
	'summary',
	'periodcount',
	'periodunit',
	'begindate',
	'enddate',
	'pk_fundplan',
	'credittypecontral',
	'creditbankcontral',
	'creditunitcontral'
];

// 表头复制需要赋值的字段
export const copyField = [
	'pk_org',
	'pk_creditbank',
	'pk_currtype',
	'protocoltype',
	'controlmethod',
	'usetype',
	'guaranteetype',
	'begindate',
	'periodcount',
	'periodunit',
	'enddate',
	'credittypecontral',
	'creditbankcontral',
	'olcrate',
	'olccdtlnamt'
];
//HsJGgXoCueKidK+JSYUoEgS1FkGUKUwPb0m/3mXGcgkOPeRtyVYGWRwtiwAzin4u