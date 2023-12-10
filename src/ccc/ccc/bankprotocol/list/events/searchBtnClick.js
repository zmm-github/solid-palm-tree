//YuO8szH0cVixePu/Bt+mG9SQ8n9SxFcX57kvtfqQ8Z+14zwssl52Rb8qDC5Ni189
import { ajax, cardCache, toast } from "nc-lightapp-front";
let { setDefData } = cardCache;
import {
  searchKey,
  searchSpace,
  dataSource,
  ACTION_URL
} from "../../constant/constant.js";
export const searchBtnClick = function clickSearchBtn(
  props,
  qryCondition,
  groupKey
) {
  //查询区域查询条件
  if (!qryCondition) {
    qryCondition = props.search.getAllSearchData(this.searchId);
    if (!qryCondition) {
      return;
    }
  }
  if (!qryCondition.conditions || qryCondition.conditions.length == 0) {
    return;
  }
  //将查询条件放入缓存中
  setDefData(searchKey, searchSpace, qryCondition);
  let groupCondition = getGroupCondition.call(this, this.state.selectedGroup);
  let queryInfo = props.search.getQueryInfo(this.searchId);
  let pageInfo = props.table.getTablePageInfo(this.tableId);
  let oid = queryInfo.oid;
  let searchData = {
    querycondition: qryCondition,
    custcondition: {
      logic: "and", //逻辑操作符，and、or
      conditions: [groupCondition]
    },
    pageInfo: pageInfo,
    oid: oid,
    pageCode: this.pageId,
    queryAreaCode: "search", //查询区编码
    querytype: "tree"
  };
  ajax({
    url: ACTION_URL.QUERY,
    data: searchData,
    success: res => {
      let { success, data } = res;
      if (success) {
        let { grid, groupData } = data;
        if (grid && grid.table.rows && grid.table.rows.length > 0) {
          this.props.table.setAllTableData(this.tableId, grid[this.tableId]);
        } else {
          this.props.table.setAllTableData(this.tableId, { rows: [] });
        }
        if (groupData) {
          let nums = 0;
          for (const key in groupData) {
            if (groupData.hasOwnProperty(key)) {
              let itemNum = groupData[key] - 0;
              nums += itemNum;
            }
          }
          if (nums > 0) {
            toast({
              color: "success",
              content: this.state.json[
                "36610CC-000062"
              ] /* 国际化处理： 查询成功！*/
            });
          } else {
            toast({
              color: "warning",
              content: this.state.json[
                "36610CC-000054"
              ] /* 国际化处理： 未查询出符合条件的数据！*/
            });
          }
          this.setState({
            numvalues: groupData,
            DTJ: groupData.DTJ == null ? "(0)" : "(" + groupData.DTJ + ")",
            SPZ: groupData.SPZ == null ? "(0)" : "(" + groupData.SPZ + ")",
            WZX: groupData.WZX == null ? "(0)" : "(" + groupData.WZX + ")",
            ZZX: groupData.ZZX == null ? "(0)" : "(" + groupData.ZZX + ")"
          });
          setDefData(dataSource, "numvalues", groupData);
        }
      }
    }
  });
};

/**
 * 获取分组查询条件
 * @param {*} groupKey 分组键
 */
export const getGroupCondition = function(groupKey) {
  let groupCondition;
  switch (groupKey) {
    //待提交
    case "0":
      groupCondition = {
        field: "protocolstatus",
        value: {
          firstvalue: "NOCOMMIT",
          secondvalue: null
        },
        oprtype: "="
      };
      break;
    //审批中
    case "1":
      groupCondition = {
        field: "protocolstatus",
        value: {
          firstvalue: "NOAUDIT",
          secondvalue: null
        },
        oprtype: "="
      };
      break;
    //未执行
    case "2":
      groupCondition = {
        field: "protocolstatus",
        value: {
          firstvalue: "NOEXECUTE",
          secondvalue: null
        },
        oprtype: "="
      };
      break;
    //在执行
    case "3":
      groupCondition = {
        field: "protocolstatus",
        value: {
          firstvalue: "EXECUTING",
          secondvalue: null
        },
        oprtype: "="
      };
      break;
    //全部
    case "4":
      groupCondition = {};
      break;
    //默认:待提交状态
    default:
      groupCondition = {
        field: "protocolstatus",
        value: {
          firstvalue: "NOCOMMIT",
          secondvalue: null
        },
        oprtype: "="
      };
      break;
  }
  return groupCondition;
};

//YuO8szH0cVixePu/Bt+mG9SQ8n9SxFcX57kvtfqQ8Z+14zwssl52Rb8qDC5Ni189