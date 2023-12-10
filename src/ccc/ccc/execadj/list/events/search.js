//mlt3+9DCdcvMDNyLBUmZUdhYF/+QaDxqVTC3TmFhuzaFLn495LounW9FXixysRmC
import { ajax, cardCache, toast } from "nc-lightapp-front";
import { list, baseReqUrl, javaUrl } from "../../cons/constant.js";
import { searchKey, searchSpace, dataSource } from "../../cons/constant.js";
import { buttonDisabled } from "./index.js";
let { setDefData } = cardCache;

/**
 * 点击查询，获取查询区数据
 * @param {*} props           页面内置对象
 * @param {*} condition       大家查一下文档，没细看
 * @param {*} isToast        是否弹出toast
 * @param {*} isRefresh      是否刷新操作
 */
export function searchBtnClick(
  props,
  condition,
  isToast = true,
  querycondition,
  isRefresh = false
) {
  //查询区域查询条件
  if (!condition) {
    condition = props.search.getAllSearchData(this.searchId);
    if (!condition) {
      return;
    }
  }
  if (!condition.conditions || condition.conditions.length == 0) {
    return;
  }
  setDefData(searchKey, searchSpace, condition);
  let groupCondition = getGroupCondition.call(this);
  let pageInfo = props.table.getTablePageInfo(this.tableId);
  let searchdata = {
    querycondition: condition,
    custcondition: {
      logic: "and", //逻辑操作符，and、or
      conditions: [groupCondition]
    },
    pageInfo: pageInfo,
    pageCode: list.pageCode,
    queryAreaCode: this.searchId, //查询区编码
    oid: list.searchOid, //查询模板id，手工添加在界面模板json中，放在查询区，后期会修改
    querytype: "tree"
  };
  getListData.call(this, javaUrl.list, searchdata, isToast, isRefresh);
}

/**
 * 获取分组查询条件
 */
const getGroupCondition = function() {
  let groupCondition;
  // 获取当前选中页签编码
  switch (this.state.selectedGroup) {
    //待提交
    case list.DTJ:
      groupCondition = {
        field: "execadjstatus",
        value: {
          firstvalue: "NOSUB",
          secondvalue: null
        },
        oprtype: "="
      };
      break;
    //待审批
    case list.SPWC:
      groupCondition = {
        field: "execadjstatus",
        value: {
          firstvalue: "APPROCOM",
          secondvalue: null
        },
        oprtype: "="
      };
      break;
    //审批中
    case list.SPZ:
      groupCondition = {
        field: "execadjstatus",
        value: {
          firstvalue: "APPRO",
          secondvalue: null
        },
        oprtype: "="
      };
      break;
    //全部
    case list.ALL:
      groupCondition = {};
      break;
    //默认作为全部处理
    default:
      groupCondition = {
        field: "execadjstatus",
        value: {
          firstvalue: "NOSUB",
          secondvalue: null
        },
        oprtype: "="
      };
      break;
  }
  return groupCondition;
};

/**
 * 点击分页、改变每页条数
 * @param {*} props           页面内置对象
 * @param {*} config          大家查一下文档，没细看，貌似没用上
 * @param {*} pks             拿到当前页的所有pks
 */
export function pageInfoClick(props, config, pks) {
  let data = {
    pks,
    pageCode: this.pageId
  };
  getListData.call(this, javaUrl.pks, data, false);
}

/**
 * 请求列表接口
 * @param {*} path       接口地址
 * @param {*} data       数据
 * @param {*} isToast        是否弹出toast
 * @param {*} isRefresh      是否刷新操作
 */
function getListData(path, data, isToast, isRefresh) {
  ajax({
    url: `${baseReqUrl}${path}.do`,
    data,
    success: res => {
      listRender.call(this, res, isToast, isRefresh);
    },
    error: () => {
      listRender.call(this, { success: false });
      toast({ color: "warning", content: res.message });
    }
  });
}
/**
 * 拿到返回的数据，对列表进行渲染
 * @param {*} res            后台返回的res
 * @param {*} isToast        是否弹出toast
 * @param {*} isRefresh      是否刷新操作
 */
function listRender(res, isToast, isRefresh) {
  let { success, data } = res;
  let { grid, groupData } = data;
  if (success && data && grid && grid[this.tableId]) {
    if (grid && grid.table.rows && grid.table.rows.length > 0) {
      this.props.table.setAllTableData(this.tableId, grid[this.tableId]);
    } else {
      this.props.table.setAllTableData(this.tableId, { rows: [] });
    }
    let flag = false;
    for (let key in groupData) {
      if (groupData[key] !== "0") {
        flag = true;
      }
    }
    if (isToast) {
      if (flag) {
        toast({
          color: "success",
          content: isRefresh
            ? this.state.json["36610CCA-000043"]
            : this.state.json["36610CCA-000044"]
        }); /* 国际化处理： 刷新成功！*/ /* 国际化处理： 查询成功！*/
      } else {
        toast({
          color: "warning",
          content: this.state.json["36610CCA-000037"]
        }); /* 国际化处理： 未查询出符合条件的数据!*/
      }
    }
    let { DTJ, SPZ, ALL } = groupData;
    this.setState({
      numvalues: groupData,
      DTJ: DTJ == null ? "(0)" : "(" + DTJ + ")",
      SPZ: SPZ == null ? "(0)" : "(" + SPZ + ")",
      ALL: ALL == null ? "(0)" : "(" + ALL + ")"
    });
    setDefData(dataSource, "numvalues", groupData);
    buttonDisabled.call(this);
  }
}

//mlt3+9DCdcvMDNyLBUmZUdhYF/+QaDxqVTC3TmFhuzaFLn495LounW9FXixysRmC