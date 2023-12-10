//Hm9gUKDDwtNjV7Mk8onAzoiJvgJ2z9dxt1mjNpcJT+TWFvpEHQelV9yrvEYPZI9r
import { toast, print, cardCache, promptBox } from "nc-lightapp-front";
import {
  searchKey,
  searchSpace,
  card,
  baseReqUrl,
  javaUrl
} from "../../cons/constant.js";
import { searchBtnClick } from "./search";
import { BusinessHeadOperator } from "./BusinessOperator";
let { getDefData } = cardCache;
/**
 * 按钮交互
 * @param {*} props        页面内置对象
 * @param {*} id           注册按钮编码
 */
export default function buttonClick(props, id) {
  let selectDatas = props.table.getCheckedRows(this.tableId); //获取已勾选数据
  if (!["Add", "Refresh", "UnionQuery"].includes(id) && !selectDatas.length) {
    //非新增刷新按钮时要判断是否已勾选数据
    toast({
      color: "warning",
      content: this.state.json["36610CCA-000029"]
    }); /* 国际化处理： 请勾选数据!*/
    return;
  }
  let pks =
    selectDatas &&
    selectDatas.map(
      item =>
        item.data.values &&
        selectDatas[0].data.values[this.primaryId] &&
        selectDatas[0].data.values[this.primaryId].value
    );
  switch (id) {
    //头部 新增
    case "Add":
      props.pushTo("/card", {
        status: "add",
        pagecode: card.pageCode
      });
      break;
    //头部 删除
    case "Delete":
      delBills.call(this, props, selectDatas, id);
      break;
    //头部 复制
    case "copy":
      props.pushTo("/card", {
        status: "copy",
        id: pks[0],
        pagecode: card.pageCode
      });
      break;
    //头部 提交
    case "Commit":
      BusinessHeadOperator(
        this,
        this.state.json["36610CCA-000031"],
        id,
        this.props,
        this.pageId,
        this.tableId,
        this.primaryId,
        baseReqUrl + javaUrl.commit,
        this.state.json["36610CCA-000017"]
      ); /* 国际化处理： 提交：,提交成功！*/
      break;
    //头部 收回
    case "UnCommit":
      BusinessHeadOperator(
        this,
        this.state.json["36610CCA-000032"],
        id,
        props,
        this.pageId,
        this.tableId,
        this.primaryId,
        baseReqUrl + javaUrl.uncommit,
        this.state.json["36610CCA-000018"]
      ); /* 国际化处理： 收回：,收回成功！*/
      break;
    //头部 刷新
    case "Refresh":
      refresh.call(this, props);
      break;
    case "ApproveDetail": //联查审批详情
      linkApproveMessage(this, props);
      break;
    case "Protocol": //联查授信协议
      linkProtocol(this, props);
      break;
    case "Print": //打印
      if (checkSelectedData(selectDatas)) {
        printClick(this, id);
      }
      break;
    case "OutPut": //输出
      if (checkSelectedData(selectDatas)) {
        printClick(this, id);
      }
      break;
    case "Attachment": //附件
      fileMgr(this, selectDatas);
      break;
    default:
      break;
  }
}

/**
 * 删除
 * @param {*} props
 * @param {*} selectData
 * @param {*} oper
 */
function delBills(props, selectData, oper) {
  let content = selectData.length === 1 ? "36610CCA-000009" : "36610CCA-000042";
  promptBox({
    color: "warning",
    title: this.state.json["36610CCA-000008"] /* 国际化处理： 删除*/,
    content: this.state.json[
      content
    ] /* 国际化处理： 确定要删除/删除全部数据吗*/,
    beSureBtnClick: () => {
      BusinessHeadOperator(
        this,
        this.state.json["36610CCA-000030"],
        oper,
        props,
        this.pageId,
        this.tableId,
        this.primaryId,
        baseReqUrl + javaUrl.delete,
        this.state.json["36610CCA-000016"]
      ); /* 国际化处理： 删除：,删除成功！*/
    }
  });
}

/**
 * 判断是否选择数据
 * @param {*} selectData
 */
function checkSelectedData(selectData) {
  if (selectData.length == 0) {
    toast({
      content: this.state.json["36610CCA-000033"],
      color: "warning"
    }); /* 国际化处理： 请选择数据！*/
    return false;
  } else {
    return true;
  }
}

/**
 * 根据缓存中的查询条件，刷新
 * @param {*} that
 * @param {*} props
 * @param {*} searchVal
 */
function refresh(props) {
  let searchData = getDefData(searchKey, searchSpace);
  searchBtnClick.call(this, props, searchData, true,undefined, true);
}

/**
 * 联查审批详情
 * @param {*} that
 * @param {*} props
 */
function linkApproveMessage(that, props) {
  let selectData = that.props.table.getCheckedRows(that.tableId);
  if (selectData.length > 1) {
    toast({
      content: this.state.json["36610CCA-000034"],
      color: "warning"
    }); /* 国际化处理： 请选择一条数据！*/
    return;
  }
  let pk_link = selectData[0].data.values.pk_execadj.value;
  that.setState(
    {
      billid: pk_link, //单据pk
      billtype: "36X2"
    },
    () => {
      that.setState({
        showAppr: true
      });
    }
  );
}

/**
 * 联查授信协议
 * @param {*} that
 * @param {*} props
 */
function linkProtocol(that, props) {
  let selectData = that.props.table.getCheckedRows(that.tableId);
  if (selectData.length > 1) {
    toast({
      content: this.state.json["36610CCA-000034"],
      color: "warning"
    }); /* 国际化处理： 请选择一条数据！*/
    return;
  }
  console.log(selectData[0].data);
  let pk_link = selectData[0].data.values.pk_execadj.value;
  let pk_protocol = selectData[0].data.values.pk_protocol.value;
  let pk_currtype = selectData[0].data.values.pk_cccurrtype.value;
  let pk_org = selectData[0].data.values.pk_org.value;
  let pk_bankdoc = selectData[0].data.values.pk_bankdoc.value; //贷款银行
  let credittype = selectData[0].data.values.pk_cctype.value; //授信类别
  let balanceinfo = {
    pk_protocol: pk_protocol,
    pk_currtype: pk_currtype,
    pk_org: pk_org,
    pk_bankdoc: pk_bankdoc,
    credittype: credittype
  };
  that.setState(
    {
      billid: pk_link, //单据pk
      billtype: "36X2"
    },
    () => {
      that.setState({
        showCCC: true,
        showCCCBalance: balanceinfo
      });
    }
  );
}
/**
 * 打印
 * @param {} that
 * @param {*} key
 */
function printClick(that, key) {
  let selectData = that.props.table.getCheckedRows(that.tableId);
  let pks = [];
  selectData.forEach(val => {
    let pk;
    pk = val.data.values.pk_execadj.value;
    pks.push(pk);
  });
  if (key == "Print") {
    print("pdf", "/nccloud/ccc/execadj/print.do", {
      appcode: "36610CCA",
      nodekey: "execadjcard_new", //模板节点标识
      oids: pks
    });
  }
  //输出
  if (key == "OutPut") {
    that.setState(
      {
        outputData: {
          appcode: "36610CCA",
          nodekey: "execadjcard_new", //模板节点标识
          outputType: "output",
          oids: pks
        }
      },
      () => {
        that.refs.printOutput.open();
      }
    );
  }
}
/**
 * 附件
 * @param {*} props
 */
function fileMgr(that, selectDatas) {
  let billID, billNO;
  selectDatas.forEach(val => {
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
export function buttonDisabled() {
  let selected = this.props.table.getCheckedRows(this.tableId);
  let allStatus = selected.filter(item => {
    if (item.data.values.vbillstatus.value === "-1") {
      return item;
    }
  });
  if (selected.length > 1) {
    let delVisibleFlag = allStatus.length === selected.length ? true : false;
    this.props.button.setButtonDisabled(
      ["Commit", "UnCommit", "Print", "OutPut"],
      false
    );
    this.props.button.setButtonDisabled(
      ["ApproveDetail", "Protocol", "Attachment", "Delete", "copy"],
      true
    );
    if (delVisibleFlag) this.props.button.setButtonDisabled(["Delte"], false);
  } else if (selected.length == 1) {
    let status = selected[0].data.values.vbillstatus.value;
    switch (status) {
      case "-1":
        this.props.button.setButtonDisabled(
          [
            "Delete",
            "Commit",
            "ApproveDetail",
            "Protocol",
            "Print",
            "OutPut",
            "Attachment",
            "copy"
          ],
          false
        );
        this.props.button.setButtonDisabled(["UnCommit"], true);
        break;
      case "1":
        this.props.button.setButtonDisabled(
          [
            "UnCommit",
            "ApproveDetail",
            "Protocol",
            "Print",
            "OutPut",
            "Attachment",
            "copy"
          ],
          false
        );
        this.props.button.setButtonDisabled(["Delete", "Commit"], true);
        break;
      case "2":
        this.props.button.setButtonDisabled(
          [
            "ApproveDetail",
            "Protocol",
            "Print",
            "OutPut",
            "Attachment",
            "copy"
          ],
          false
        );
        this.props.button.setButtonDisabled(
          ["Delete", "Commit", "UnCommit"],
          true
        );
        break;
      case "3":
        this.props.button.setButtonDisabled(
          [
            "UnCommit",
            "ApproveDetail",
            "Protocol",
            "Print",
            "OutPut",
            "Attachment",
            "copy"
          ],
          false
        );
        this.props.button.setButtonDisabled(["Delete", "Commit"], true);
        break;
    }
  } else if (selected.length < 1) {
    this.props.button.setButtonDisabled(
      [
        "Delete",
        "Commit",
        "UnCommit",
        "ApproveDetail",
        "Protocol",
        "Print",
        "OutPut",
        "Attachment",
        "copy"
      ],
      true
    );
  }
}

//Hm9gUKDDwtNjV7Mk8onAzoiJvgJ2z9dxt1mjNpcJT+TWFvpEHQelV9yrvEYPZI9r