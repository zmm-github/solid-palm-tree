//LIrQHD0E7YfrpqrP0180quyA1f3B+UZ7YE6pzxTs8Zg=
import { ajax, cardCache } from "nc-lightapp-front";
import {
  ACTION_URL,
  cardPageId,
  searchKey,
  searchSpace
} from "../../constant/constant";
import { BusinessHeadOperator } from "./BusinessOperator";
import initTemplate from "./initTemplate";
import initTemplate1 from "./initTemplate1";
import pageInfoClick1 from "./pageInfoClick1";
const { setDefData, getDefData } = cardCache;

/**
 * 银行授信协议列表页页面相关事件
 * @author dongyue7
 * @status 持续重构中
 */

// 取到多语资源后事件
export function afterGetLang(props, json) {
  let pk_ntbparadimvo = props.getUrlParam("pk_ntbparadimvo");
  let showntbparadimvo = props.getUrlParam("showntbparadimvo");
  //被联查交互
  if (props.getUrlParam("scene") == "linksce" && !showntbparadimvo) {
    let id = props.getUrlParam("id").split(",");
    if (id.length == 1) {
      props.pushTo("/card", {
        status: "browse",
        scene: props.getUrlParam("scene"),
        appcode: props.getUrlParam("appcode"),
        pagecode: props.getUrlParam("pagecode"),
        id: props.getUrlParam("id")
      });
    } else if (id.length > 1) {
      this.showLinksce = false;
      initTemplate1.call(this, props, () => {
        pageInfoClick1(props, id);
      });
    }
  } else if (pk_ntbparadimvo || showntbparadimvo) {
    //预算反联查单据
    if (showntbparadimvo) {
      initTemplate1.call(this, props, () => {});
      this.ntbparadimvo = true;
      this.showPk_ntbparadimvo = false;
      return;
    }
    this.ntbparadimvo = true;
    this.showPk_ntbparadimvo = false;
    listInitData1(props);
  } else {
    initTemplate.call(this, props, json);
  }
}

//查询后判断是多条跳列表还是单条跳卡片
export function listInitData1(props) {
  let pk_ntbparadimvo = props.getUrlParam("pk_ntbparadimvo");
  if (!pk_ntbparadimvo) return;
  let extParam = { pk_ntbparadimvo };
  let data = { pageCode: "36610CCL_Link", extParam };
  ajaxReq.call(this, ACTION_URL.NTBLINK, data).then(data => {
    if (data) {
      let { grid } = data;
      if (grid && grid["table"].rows.length > 1) {
        initTemplate1.call(this, props, () => {
          listInitData(props);
        });
      } else if (grid && grid["table"].rows.length == 1) {
        let pk = grid["table"].rows[0].values.pk_protocol.value;
        props.pushTo("/card", {
          status: "browse",
          id: pk,
          scene: "linksce",
          pagecode: cardPageId
        });
      } else {
        initTemplate1.call(this, props);
      }
    } else {
      initTemplate1.call(this, props);
    }
  });
}

//查询多条数据
function listInitData(props) {
  let pk_ntbparadimvo = props.getUrlParam("pk_ntbparadimvo");
  if (!pk_ntbparadimvo) return;
  let pageInfo = JSON.stringify(props.table.getTablePageInfo(this.tableId));
  let extParam = { pk_ntbparadimvo, pageInfo };
  let data = { pageCode: "36610CCL_Link", extParam };
  ajaxReq.call(this, ACTION_URL.NTBLINK, data).then(data => {
    let { grid } = data;
    //更新列表数据
    if (grid && grid["table"].rows.length > 1) {
      props.table.setAllTableData("table", grid["table"]);
    } else {
      props.table.setAllTableData("table", { rows: [] });
    }
  });
}

// 还原列表页页签数字数据
export function restStateData() {
  //获取页签数据
  let cachestate = getDefData(this.key, this.dataSource);
  if (cachestate) {
    let keys = Object.keys(cachestate);
    for (let i = 0, l = keys.length; i < l; i++) {
      let key = keys[i];
      this.state[key] = cachestate[key];
    }
  }
}

//页签筛选
export function navChangeFun(groupKey, className, e) {
  //查询
  this.setState({ selectedGroup: groupKey }, () => {
    setDefData(this.dataSource, "selectedGroup", groupKey);
    let groupCondition;
    switch (groupKey) {
      //待提交
      case "0":
        this.setState({ defaultSelectGrup: "0" });
        groupCondition = {
          field: "protocolstatus",
          value: {
            firstvalue: "NOCOMMIT",
            secondvalue: null
          },
          oprtype: "="
        };
        getPaginationData.call(this, groupCondition);
        break;
      //审批中
      case "1":
        this.setState({ defaultSelectGrup: "1" });
        groupCondition = {
          field: "protocolstatus",
          value: {
            firstvalue: "NOAUDIT",
            secondvalue: null
          },
          oprtype: "="
        };
        getPaginationData.call(this, groupCondition);
        break;
      //未执行
      case "2":
        this.setState({ defaultSelectGrup: "2" });
        groupCondition = {
          field: "protocolstatus",
          value: {
            firstvalue: "NOEXECUTE",
            secondvalue: null
          },
          oprtype: "="
        };
        getPaginationData.call(this, groupCondition);
        break;
      //在执行
      case "3":
        this.setState({ defaultSelectGrup: "3" });
        groupCondition = {
          field: "protocolstatus",
          value: {
            firstvalue: "EXECUTING",
            secondvalue: null
          },
          oprtype: "="
        };
        getPaginationData.call(this, groupCondition);
        break;
      //全部
      case "4":
        this.setState({ defaultSelectGrup: "4" });
        groupCondition = {};
        getPaginationData.call(this, groupCondition);
        break;
      //默认作为全部处理
      default:
        this.setState({ defaultSelectGrup: "0" });
        groupCondition = {
          field: "protocolstatus",
          value: {
            firstvalue: "NOCOMMIT",
            secondvalue: null
          },
          oprtype: "="
        };
        getPaginationData.call(this);
        break;
    }
  });
}

// 获取页签数据
function getPaginationData(groupCondition) {
  let searchVal = getDefData(searchKey, searchSpace);
  if (!searchVal) {
    return;
  }
  let pageInfo = this.props.table.getTablePageInfo(this.tableId);
  let searchData = {
    querycondition: searchVal,
    custcondition: {
      logic: "and", //逻辑操作符，and、or
      conditions: [groupCondition]
    },
    pageInfo: pageInfo,
    oid: "1001Z61000000000QBJC",
    pageCode: this.pageId,
    queryAreaCode: "search", //查询区编码
    querytype: "tree"
  };
  ajaxReq.call(this, ACTION_URL.QUERY, searchData).then(data => {
    if (data.grid) {
      this.props.table.setAllTableData(this.tableId, data.grid[this.tableId]);
    } else {
      this.props.table.setAllTableData(this.tableId, { rows: [] });
    }
    if (data.groupData) {
      this.setState({
        numvalues: data.groupData,
        DTJ:
          data.groupData.DTJ == null ? "(0)" : "(" + data.groupData.DTJ + ")",
        SPZ:
          data.groupData.SPZ == null ? "(0)" : "(" + data.groupData.SPZ + ")",
        WZX:
          data.groupData.WZX == null ? "(0)" : "(" + data.groupData.WZX + ")",
        ZZX: data.groupData.ZZX == null ? "(0)" : "(" + data.groupData.ZZX + ")"
      });
      setDefData(this.dataSource, "numvalues", data.groupData);
    }
  });
}

//【提交指派】确认
export function getAssginUsedr(value) {
  BusinessHeadOperator.call(
    this,
    this.state.json["36610CC-000040"],
    "submit",
    this.props,
    ACTION_URL.SUBMIT,
    this.state.json["36610CC-000002"],
    null,
    null,
    null,
    null,
    value
  ); /* 国际化处理： 提交：,提交成功！*/
}

//【提交即指】派取消
export function compositeTurnOff(value) {
  this.setState({
    compositedata: null,
    compositedisplay: false
  });
}

//【双击某条数据】进入卡片
export function onRowDoubleClick(record) {
  this.props.pushTo("/card", {
    status: "browse",
    id: record.pk_protocol.value,
    ntbparadimvo: this.ntbparadimvo, //双击时判断是否是联查
    showBackBtn: true,
		pk_ntbparadimvo: this.props.getUrlParam("pk_ntbparadimvo"),
		pagecode: cardPageId
  });
}

//请求ajax
function ajaxReq(url, data) {
  return new Promise(resolve => {
    ajax({
      url,
      data,
      success: res => {
        if (res.success) {
          resolve(res.data);
        }
      }
    });
  });
}

//LIrQHD0E7YfrpqrP0180quyA1f3B+UZ7YE6pzxTs8Zg=