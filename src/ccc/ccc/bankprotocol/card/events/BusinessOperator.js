//cmiYx0pAPEwnseRzxuPOzqlz4vt6nQ5aaOkz2AhAV2+m8oh5yl965lbtYUvsduv5
import { toast, ajax, cardCache } from "nc-lightapp-front";
import { toggleShow, getData } from "./page";
let { updateCache, getNextId, deleteCacheById } = cardCache;

/**
 * 卡片页按钮事件处理
 * @param {*} props        页面内置对象
 * @param {*} opercode     操作
 * @param {*} url          请求url
 * @param {*} successMess  成功提示语
 * @param {*} assValue     指派数据
 * @author dongyue7
 * @status 持续重构中
 */
export const BusinessOperator = function(
  props,
  opercode,
  url,
  successMess,
  assValue
) {
  let Id =
    props.getUrlParam("id") ||
    props.form.getFormItemsValue(this.formId, "pk_protocol").value;
  if (Id == undefined) return;
  let data = getSendData.call(this, props, Id, assValue);
  operateAjax.call(this, url, data).then(res => {
    // 提示
    let tbbmessage =
      res.data.billCards &&
      res.data.billCards[0].head[this.formId].rows[0].values.tbbmessage.value;
    if (tbbmessage && tbbmessage !== null) {
      toast({ color: "warning", content: tbbmessage });
    }

    if (opercode === "submit") {
      // 提交
      submitSucc.call(this, res, Id);
    } else if (opercode === "delete") {
      // 删除
      delSucc.call(this, Id);
    } else {
      // 其他（冻结、取消冻结、终止、取消终止等）
      elseSucc.call(this, res);
    }
    if (
      res.data.returnMsg &&
      res.data.returnMsg.workflow &&
      (res.data.returnMsg.workflow == "approveflow" ||
        res.data.returnMsg.workflow == "workflow")
    ) {
      // 如果是提交即指派
      return;
    } else {
      let color = !res.data.billCards ? "warning" : "success";
      let content = !res.data.billCards
        ? res.data.errormessages[0]
        : successMess;
      toast({ color, content });
      getData.call(this);
      toggleShow.call(this);
    }
  });
};

// 提交成功回调
function submitSucc(res, Id) {
  if (
    res.data.returnMsg &&
    res.data.returnMsg.workflow &&
    (res.data.returnMsg.workflow == "approveflow" ||
      res.data.returnMsg.workflow == "workflow")
  ) {
    this.setState({
      compositedata: res.data.returnMsg,
      compositedisplay: true
    });
  } else {
    this.setState({
      compositedata: null,
      compositedisplay: false
    });
    //更新缓存
    updateCache(
      this.billPK,
      res.data.billCards &&
        res.data.billCards[0].head[this.formId].rows[0].values.pk_protocol
          .value,
      res.data.billCards[0],
      this.formId,
      this.dataSource,
      res.data.billCards[0].head[this.formId].rows[0].values
    );
    this.props.setUrlParam({ status: "browse", id: Id });
  }
}

// 删除成功回调
function delSucc(Id) {
  let nextId = getNextId(Id, this.dataSource);
  //删除缓存pk
  deleteCacheById(this.billPK, Id, this.dataSource);
  if (nextId != null) {
    this.props.setUrlParam({ status: "browse", id: nextId });
    getData.call(this);
  } else {
    //跳转到空白页面
    this.props.form.EmptyAllFormValue(this.formId);
    this.props.BillHeadInfo.setBillHeadInfoVisible({
      showBillCode: false
    });
    this.props.cardTable.setAllTabsData(null, this.tabOrder);
    this.props.setUrlParam({ status: "browse", id: null });
  }
}

// 其他成功回调
function elseSucc(res) {
  //更新缓存
  updateCache(
    this.billPK,
    res.data.billCards &&
      res.data.billCards[0].head[this.formId].rows[0].values.pk_protocol.value,
    res.data.billCards && res.data.billCards[0],
    this.formId,
    this.dataSource,
    res.data.billCards && res.data.billCards[0].head[this.formId].rows[0].values
  );
}

// 请求Promise
function operateAjax(url, data) {
  return new Promise(resolve => {
    ajax({
      url,
      data,
      success: res => {
        resolve(res);
      }
    });
  });
}

// 获取请求数据
function getSendData(props, Id, assValue) {
  let pkMapTs = {};
  pkMapTs[Id] =
    props.form.getFormItemsValue(this.formId, "ts") &&
    props.form.getFormItemsValue(this.formId, "ts").value;
  return {
    pkMapTs,
    pageCode: this.pageId,
    pk: Id,
    actionArea: "head",
    userObj: assValue ? assValue : null
  };
}

//cmiYx0pAPEwnseRzxuPOzqlz4vt6nQ5aaOkz2AhAV2+m8oh5yl965lbtYUvsduv5