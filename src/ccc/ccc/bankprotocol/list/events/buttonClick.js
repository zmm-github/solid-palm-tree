//Hm9gUKDDwtNjV7Mk8onAzoiJvgJ2z9dxt1mjNpcJT+TWFvpEHQelV9yrvEYPZI9r
import { ajax, toast, cardCache, promptBox } from "nc-lightapp-front";
import { BusinessHeadOperator } from "./BusinessOperator";
import { getGroupCondition } from "./searchBtnClick";
import {
  searchKey,
  searchSpace,
  dataSource,
  ACTION_URL,
  cardPageId
} from "../../constant/constant.js";
import { printClick, linkNtbClick, linkApprClick } from "../../action";
import {
  getBillPks,
  checkSelectedData,
  checkSelectedOne
} from "../../Util/index.js";
let { setDefData, getDefData } = cardCache;

export default function buttonClick(props, id) {
  let selectData = props.table.getCheckedRows(this.tableId);
  if (
    !["add", "refresh", "links", "assist"].includes(id) &&
    !selectData.length
  ) {
    //非新增刷新按钮时要判断是否已勾选数据
    toast({
      color: "warning",
      content: this.state.json["36610CC-000038"]
    }); /* 国际化处理： 请勾选数据!*/
    return;
  }
  this.operarea = "head";
  switch (id) {
    case "add": //新增
      addBill.call(this, props);
      break;
    case "copy": //复制
      copyBill.call(this, props, selectData);
      break;
    case "delete": //删除
      delBill.call(this, props, selectData, id);
      break;
    case "submit": //提交
      BusinessHeadOperator.call(
        this,
        this.state.json["36610CC-000040"],
        id,
        props,
        ACTION_URL.SUBMIT,
        this.state.json["36610CC-000002"]
      ); /* 国际化处理： 提交：,提交成功！*/
      break;
    case "withdraw": //收回
      BusinessHeadOperator.call(
        this,
        this.state.json["36610CC-000041"],
        id,
        props,
        ACTION_URL.WITHDRAW,
        this.state.json["36610CC-000006"]
      ); /* 国际化处理： 收回：,收回成功！*/
      break;
    case "frozen": //冻结
      BusinessHeadOperator.call(
        this,
        this.state.json["36610CC-000042"],
        id,
        props,
        ACTION_URL.FRONZEN,
        this.state.json["36610CC-000007"]
      ); /* 国际化处理： 冻结：,冻结成功！*/
      break;
    case "unfrozen": //取消冻结
      BusinessHeadOperator.call(
        this,
        this.state.json["36610CC-000043"],
        id,
        props,
        ACTION_URL.UNFRONZEN,
        this.state.json["36610CC-000008"]
      ); /* 国际化处理： 取消冻结：,取消冻结成功！*/
      break;
    case "terminate": //结束
      BusinessHeadOperator.call(
        this,
        this.state.json["36610CC-000044"],
        id,
        props,
        ACTION_URL.TERMINATE,
        this.state.json["36610CC-000009"]
      ); /* 国际化处理： 结束：,结束成功！*/
      break;
    case "unterminate": //结束
      BusinessHeadOperator.call(
        this,
        this.state.json["36610CC-000045"],
        id,
        props,
        ACTION_URL.UNTERMINATE,
        this.state.json["36610CC-000010"]
      ); /* 国际化处理： 取消结束：,取消结束成功！*/
      break;
    case "print": //打印
    case "printout": //输出
      if (checkSelectedData.call(this, selectData)) {
        printClick.call(this, id, getBillPks.call(this));
      }
      break;
    case "file": //附件管理
      if (checkSelectedOne.call(this, selectData)) {
        fileMgr(this, selectData);
      }
      break;
    case "linkntb": //联查预算
      if (checkSelectedOne.call(this, selectData)) {
        linkNtbClick.call(this, props, "list", selectData);
      }
      break;
    case "refresh": //刷新
      refresh(this, props);
      break;
    case "linkver": //联查版本
      linkVersion.call(this, selectData);
      break;
    case "linkappr": //联查审批详情
      linkApprClick.call(this, props, "list");
      break;
    case "change": //变更
      change(selectData, props);
      this.setStateCache();
      break;
    case "delversion": //删除版本
      deleVision.call(this, props, selectData, id);
      break;
  }
}

/**
 * 联查版本
 */
function linkVersion(selectData) {
  if (checkSelectedOne.call(this, selectData)) {
    let pk = selectData[0].data.values.pk_protocol.value;
    this.props.pushTo("/card", {
      status: "browse",
      pageType: "version",
      id: pk,
      pagecode: cardPageId
    });
  }
}

/**
 * 删除
 */
function delBill(props, selectData, id) {
  let content = selectData.length === 1 ? "36610CC-000022" : "36610CC-000060";
  promptBox({
    color: "warning",
    title: this.state.json["36610CC-000021"] /* 国际化处理： 删除*/,
    content: this.state.json[content],
    beSureBtnClick: () => {
      BusinessHeadOperator.call(
        this,
        this.state.json["36610CC-000039"],
        id,
        props,
        ACTION_URL.DELETE,
        this.state.json["36610CC-000012"]
      ); /* 国际化处理： 删除：,删除成功！*/
    }
  });
}

/**
 * 新增
 */
function addBill(props) {
  props.pushTo("/card", {
    status: "add",
    from: "list",
    pagecode: cardPageId
  });
}
function copyBill(props, selectData) {
  if (!selectData.length) {
    toast({
      content: this.state.json["请选择一条数据进行复制!"],
      color: "warning"
    }); /* 请选择一条数据进行复制！*/
    return;
  }
  let pk = selectData[0].data.values.pk_protocol.value;
  props.pushTo("/card", {
    status: "copy",
    from: "list",
    id: pk,
    pagecode: cardPageId
  });
}

/**
 * 变更
 */
function change(selectData, props) {
  if (selectData.length != 1) {
    toast({
      content: this.state.json["36610CC-000051"],
      color: "warning"
    }); /* 国际化处理： 请选择一条数据，进行变更！*/
    return;
  }
  if (selectData[0].data.values.protocolstatus.value != "EXECUTING") {
    toast({
      content: this.state.json["36610CC-000052"],
      color: "warning"
    }); /* 国际化处理： 授信协议状态不正确，不可以进行变更！*/
    return;
  }
  let changePk = selectData[0].data.values.pk_protocol.value;
  props.pushTo("/card", {
    status: "edit",
    operate: "change",
    id: changePk,
    pagecode: cardPageId
  });
}

/**
 * 附件管理
 * @param {*} props
 */
function fileMgr(that, selectData) {
  let billID, billNO;
  selectData.forEach(val => {
    if (
      val.data.values[that.billPK] &&
      val.data.values[that.billPK].value != null
    ) {
      billID = val.data.values[that.billPK].value;
    }
    if (
      val.data.values[that.billNO] &&
      val.data.values[that.billNO].value != null
    ) {
      billNO = val.data.values[that.billNO].value;
    }
  });
  that.setState({
    showUploader: true,
    billID,
    billNO
  });
}

/**
 * 根据缓存中的查询条件，刷新
 * @param {*} that
 * @param {*} props
 * @param {*} searchVal
 */
function refresh(that, props) {
  let searchData = getDefData(searchKey, searchSpace);
  if (!searchData) {
    return;
  }
  let pageInfo = props.table.getTablePageInfo(that.tableId);
  let groupCondition = getGroupCondition(that.state.selectedGroup);
  pageInfo.pageIndex = 0;
  let data = {
    querycondition: searchData,
    custcondition: {
      logic: "and", //逻辑操作符，and、or
      conditions: [groupCondition]
    },
    pageInfo: pageInfo,
    pageCode: that.pageId,
    queryAreaCode: that.searchId, //查询区编码
    oid: "1001Z61000000000QBJC", //查询模板id，手工添加在界面模板json中，放在查询区，后期会修改
    querytype: "tree"
  };
  ajax({
    url: ACTION_URL.QUERY,
    data: data,
    success: res => {
      let { success, data } = res;
      if (success) {
        if (data.grid) {
          props.table.setAllTableData(that.tableId, data.grid[that.tableId]);
          toast({
            color: "success",
            content:
              that.state.json["36610CC-000063"] /* 国际化处理： 刷新成功！*/
          });
        } else {
          props.table.setAllTableData(that.tableId, { rows: [] });
          toast({
            color: "warning",
            content:
              that.state.json[
                "36610CC-000054"
              ] /* 国际化处理： 未查询出符合条件的数据！*/
          });
        }
        if (data.groupData) {
          that.setState({ numvalues: data.groupData });
          setDefData(dataSource, "numvalues", data.groupData);
        }
      }
    }
  });
}

/**
 * 删除版本
 * @param {*} props
 */
function deleVision(props, selectData, id) {
  if (selectData.length != 1) {
    toast({
      content: this.state.json["36610CC-000046"],
      color: "warning"
    }); /* 国际化处理： 请选择一条数据！*/
    return;
  }
  if (selectData[0].data.values.protocolstatus.value != "EXECUTING") {
    toast({
      content: this.state.json["36610CC-000047"],
      color: "warning"
    }); /* 国际化处理： 该单据状态不正确，不可以删除版本！*/
    return;
  }
  if (selectData[0].data.values.versionno.value < 1) {
    toast({
      content: this.state.json["36610CC-000048"],
      color: "warning"
    }); /* 国际化处理： 当前单据只有一个版本，不可以进行删除版本操作！*/
    return;
  }
  if (selectData[0].data.values.vbillstatus.value != "-1") {
    toast({
      content: this.state.json["36610CC-000049"],
      color: "warning"
    }); /* 国际化处理： 只有自由态的单据，可以删除版本！*/
    return;
  }
  BusinessHeadOperator.call(
    this,
    this.state.json["36610CC-000050"],
    id,
    props,
    ACTION_URL.DELVERSION,
    this.state.json["36610CC-000011"]
  ); /* 国际化处理： 删除版本：,删除版本成功！*/
}

//Hm9gUKDDwtNjV7Mk8onAzoiJvgJ2z9dxt1mjNpcJT+TWFvpEHQelV9yrvEYPZI9r