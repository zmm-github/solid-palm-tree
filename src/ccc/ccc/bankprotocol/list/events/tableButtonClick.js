//0GI1xcoeligdpMeXoHBphlvRhYRLv0Y+TeZ3ZFfdzxoj9S008sZrDYayU0N3HXq7
import { BusinessInnerOperator } from "./BusinessOperator";
import {
  ACTION_URL,
  PK_CODE,
  cardPageId,
  TABLE_CODE,
} from "../../constant/constant.js";
import { sagaApi } from "../../Util";
export default function tableButtonClick(props, key, text, record, index) {
  this.operarea = "inner";
  this.innerTs = record.ts.value;
  switch (key) {
    case "deleteI": //删除
      BusinessInnerOperator.call(
        this,
        this.state.json["36610CC-000039"],
        key,
        props,
        record,
        index,
        this.tableId,
        this.pageId,
        ACTION_URL.DELETE,
        this.state.json["36610CC-000012"]
      ); /* 国际化处理： 删除：,删除成功！*/
      break;
    case "editI": //修改
      editAction.call(this, record);
      break;
    case "submitI": //提交
      BusinessInnerOperator.call(
        this,
        this.state.json["36610CC-000040"],
        key,
        props,
        record,
        index,
        this.tableId,
        this.pageId,
        ACTION_URL.SUBMIT,
        this.state.json["36610CC-000002"]
      ); /* 国际化处理： 提交：,提交成功！*/
      break;
    case "withdrawI": //收回
      BusinessInnerOperator.call(
        this,
        this.state.json["36610CC-000041"],
        key,
        props,
        record,
        index,
        this.tableId,
        this.pageId,
        ACTION_URL.WITHDRAW,
        this.state.json["36610CC-000006"]
      ); /* 国际化处理： 收回：,收回成功！*/
      break;
    case "frozenI": //冻结
      BusinessInnerOperator.call(
        this,
        this.state.json["36610CC-000042"],
        key,
        props,
        record,
        index,
        this.tableId,
        this.pageId,
        ACTION_URL.FRONZEN,
        this.state.json["36610CC-000007"]
      ); /* 国际化处理： 冻结：,冻结成功！*/
      break;
    case "unfrozenI": //取消冻结
      BusinessInnerOperator.call(
        this,
        this.state.json["36610CC-000043"],
        key,
        props,
        record,
        index,
        this.tableId,
        this.pageId,
        ACTION_URL.UNFRONZEN,
        this.state.json["36610CC-000008"]
      ); /* 国际化处理： 取消冻结：,取消冻结成功！*/
      break;
    case "terminateI": //结束
      BusinessInnerOperator.call(
        this,
        this.state.json["36610CC-000044"],
        key,
        props,
        record,
        index,
        this.tableId,
        this.pageId,
        ACTION_URL.TERMINATE,
        this.state.json["36610CC-000009"]
      ); /* 国际化处理： 结束：,结束成功！*/
      break;
    case "unterminateI": //取消结束
      BusinessInnerOperator.call(
        this,
        this.state.json["36610CC-000045"],
        key,
        props,
        record,
        index,
        this.tableId,
        this.pageId,
        ACTION_URL.UNTERMINATE,
        this.state.json["36610CC-000010"]
      ); /* 国际化处理： 取消结束：,取消结束成功！*/
      break;
    case "changeI": //变更
      changeAction.call(this, record);
      break;
  }
}
/**
 * 变更
 * @param {*} props
 */
const changeAction = function (record) {
  let data = {
    pk: record.pk_protocol.value,
    fieldPK: PK_CODE,
    tableName: TABLE_CODE,
  };
  sagaApi.call(this, {
    data: data,
    success: (res) => {
      this.props.pushTo("/card", {
        status: "edit",
        operate: "change",
        id: record.pk_protocol.value,
        pagecode: cardPageId,
      });
      this.setStateCache();
    },
  });
};
/**
 * 编辑
 * @param {*} props
 */
const editAction = function (record) {
  let data = {
    pk: record.pk_protocol.value,
    fieldPK: PK_CODE,
    tableName: TABLE_CODE,
  };
  sagaApi.call(this, {
    data: data,
    success: (res) => {
      this.props.pushTo("/card", {
        status: "edit",
        id: record.pk_protocol.value,
      });
      this.setStateCache();
    },
  });
};

//0GI1xcoeligdpMeXoHBphlvRhYRLv0Y+TeZ3ZFfdzxoj9S008sZrDYayU0N3HXq7