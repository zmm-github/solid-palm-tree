//HsJGgXoCueKidK+JSYUoEgS1FkGUKUwPb0m/3mXGcgkOPeRtyVYGWRwtiwAzin4u
/**
 * 公共配置
 */
//请求后台接口基础路径
export const baseReqUrl = "/nccloud/ccc/execadj/";
//请求页面路由地址基础路径(跳转使用，单页貌似没啥用了?)
export const baseRoutePath = "/ccc/ccc/execadj/";
//按钮平铺显示数量
export const btnLimit = 3;
//appcode
export const appCode = "36610CCA";
//小应用ID(??, 多语使用)
export const moduleId = "36610CCA";
export const key = "ccc.ccc.execadj.cacheKey"; //卡片页面缓存
//打印输出编码
export const printData = {
  funcode: "36610CCA",
  nodekey: "",
  printTemplateID: ""
};
/*查询区域缓存Key*/
export const searchKey = "ccc.ccc.execadj.searchCache";
/*查询区域缓存数据的名称空间*/
export const searchSpace = "ccc.ccc.execadj.searchSpace";
//调用后台相关接口地址
export const dataSource = "ccc.ccc.execadj.CacheSource";
export const javaUrl = {
  list: "querylist", //列表详情
  pks: "querypage", //列表分页pks
  commit: "submit.do", //提交
  savecommit: "savesubmit.do", //保存提交
  uncommit: "unsubmit.do", //收回
  delete: "delete.do", //删除
  print: "print", //打印输出
  card: "querycard", //卡片详情
  save: "save", //卡片修改新增保存
  afterevent: "cardeditafter", //编辑后事件
  copy: "copy" //复制
};

/**
 * 列表
 */
// 列表页面相关编码
export const list = {
  pageCode: "36610CCA_L01", //列表页面code
  btnCode: "list_head", //列表页面按钮区域code
  searchCode: "search", //列表页面查询区域code
  tableCode: "table", //列表页面表格区域code
  bodyCode: "list_inner", //列表页面表格区域按钮code
  searchOid: "1001Z610000000011VFJ", //列表页面查询区域oid
  listCache: "ccc.ccc.execadj.tableData", //列表页面缓存
  primaryId: "pk_execadj", //列表页面主键ID
  DTJ: "0",
  SPWC: "1",
  SPZ: "2",
  ALL: "3"
};

/**
 * 卡片
 */
// 卡片页面相关编码
export const card = {
  cardCache: "ccc.ccc.execadj.cacheKey",
  pageCode: "36610CCA_C01", //卡片页面code
  primaryId: "pk_execadj", //卡片页面主键ID
  headCode: "form_execadj", //卡片页面主表区域code
  btnCode: "card_head", //卡片页面按钮区域code
  key: "ccc.ccc.execadj.cacheKey" //卡片页面缓存
};

export const cardButtons = [
  "Add",
  "Edit",
  "Delete",
  "saveGroup",
  "Cancel",
  "Commit",
  "unionGroup",
  "print",
  "Refresh"
];

export const copyField = [
  "pk_org",
  "pk_protocol",
  "pk_cctype",
  "updatedir",
  "pk_bankdoc",
  "pk_usecompany",
  "pk_currtype",
  "protocoltype"
];

//HsJGgXoCueKidK+JSYUoEgS1FkGUKUwPb0m/3mXGcgkOPeRtyVYGWRwtiwAzin4u