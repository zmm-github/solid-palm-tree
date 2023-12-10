//cmiYx0pAPEwnseRzxuPOzqlz4vt6nQ5aaOkz2AhAV2+m8oh5yl965lbtYUvsduv5
import { ajax, toast } from "nc-lightapp-front";
/**
 * 列表头部按钮业务操作
 * @param {*} opername 操作名称
 * @param {*} opercode 操作编码
 * @param {*} props 页面内置对象
 * @param {*} pageCode 页面编码
 * @param {*} tableCode 表格编码
 * @param {*} pkName 主键字段名
 * @param {*} url 请求地址
 * @param {*} successMess 成功提示语
 * @param {*} datasource 区域缓存标识
 * @param {*} showTBB 是否提示预算信息
 * @param {*} extParam 拓展参数
 * @param {*} callback 回调
 **/
export const BusinessHeadOperator = function (
  opername,
  opercode,
  props,
  url,
  successMess,
  datasource,
  showTBB,
  extParam,
  callback,
  submitdata
) {
  let pageCode = this.pageId;
  let tableCode = this.tableId;
  let selectDatas = props.table.getCheckedRows(tableCode);
  let pkName = "pk_protocol";
  let pkMapTs = new Map();
  let pkMapRowIndex = new Map();
  let pk, ts, isinherit, data;
  if (!extParam) {
    extParam = {};
  }
  if (this.operarea === "head") {
    selectDatas.map((item) => {
      pk = item.data && item.data.values && item.data.values[pkName].value;
      ts = item.data && item.data.values && item.data.values.ts.value;
      pkMapRowIndex.set(pk, item.index);
      isinherit =
        item.data && item.data.values && item.data.values.isinherit.value;
      if (pk && ts) {
        pkMapTs.set(pk, ts);
      }
      if (opercode === "unterminate") {
        if (isinherit) {
          toast({
            color: "warning",
            content: this.state.json["36610CC-000005"],
          }); /* 国际化处理： 该协议有子授信协议，不能取消结束！*/
          return;
        }
      }
    });
    data = {
      pkMapTs,
      pageCode,
      extParam,
      actionArea: "head",
    };
  } else if (this.operarea !== "head") {
    pkMapTs.set(this.submitpk, this.innerTs);
    data = {
      pkMapTs,
      pageCode,
      extParam,
    };
  }

  if (opercode == "submit") {
    if (pk == undefined) {
      pk = this.submitpk;
    }
    if (submitdata) {
      let usedata = {
        pageCode: pageCode,
        pks: [pk],
        pkMapTs,
      };
      usedata.userObj = submitdata;
      data = usedata;
    }
  }
  ajax({
    url,
    data,
    success: (res) => {
      let result;
      let deleteRowIndexArr = [];
      let deleteRowPksArr = [];
      if (res.data && res.data.billCards && res.data.billCards) {
        result = res.data.billCards;
      }
      if (opercode == "submit") {
        if (
          res.data.returnMsg &&
          res.data.returnMsg.workflow &&
          (res.data.returnMsg.workflow == "approveflow" ||
            res.data.returnMsg.workflow == "workflow")
        ) {
          this.setState({
            compositedata: res.data.returnMsg,
            compositedisplay: true,
          });
        } else {
          this.setState({
            compositedata: null,
            compositedisplay: false,
          });
          if (res.data.status == "0" || res.data.status == "2") {
            if (result) {
              result.forEach((vale) => {
                let pk = vale.head[tableCode].rows[0].values.pk_protocol.value;
                let tbbmessage =
                  vale.head[tableCode].rows[0].values.tbbmessage.value;
                if (tbbmessage && tbbmessage !== null) {
                  toast({
                    color: "warning",
                    content: tbbmessage,
                  });
                }
                let index = pkMapRowIndex.get(pk);
                if (index == undefined) {
                  index = this.submitindex;
                }
                let updateDataArr = [
                  {
                    index: index,
                    data: {
                      values: vale.head[tableCode].rows[0].values,
                    },
                  },
                ];
                props.table.updateDataByIndexs(tableCode, updateDataArr);
              });
            }
          }
        }
      } else if (opercode == "delete") {
        if (res.data.status == "0") {
          //全部成功
          for (let key of pkMapRowIndex.keys()) {
            deleteRowPksArr.push(key);
            let tbbmessage =
              res.data.billCards[0].head[tableCode].rows[0].values.tbbmessage
                .value;
            if (tbbmessage && tbbmessage !== null) {
              toast({ color: "warning", content: tbbmessage });
            }
          }
          for (let value of pkMapRowIndex.values()) {
            deleteRowIndexArr.push(value);
          }
        } else if (res.data.status == "2") {
          //部分失败
          if (result) {
            result.forEach((vale) => {
              let pk = vale.head[tableCode].rows[0].values.pk_protocol.value;
              let tbbmessage =
                vale.head[tableCode].rows[0].values.tbbmessage.value;
              if (tbbmessage && tbbmessage !== null) {
                toast({
                  color: "warning",
                  content: tbbmessage,
                });
              }
              deleteRowPksArr.push(pk);
              let index = pkMapRowIndex.get(pk);
              deleteRowIndexArr.push(index);
            });
          }
        }
        props.table.deleteCacheId(tableCode, deleteRowPksArr);
        props.table.deleteTableRowsByIndex(tableCode, deleteRowIndexArr);
      } else if (opercode == "withdraw") {
        if (res.data.status == "0" || res.data.status == "2") {
          if (result) {
            result.forEach((vale) => {
              let pk = vale.head[tableCode].rows[0].values.pk_protocol.value;
              let tbbmessage =
                vale.head[tableCode].rows[0].values.tbbmessage.value;
              if (tbbmessage && tbbmessage !== null) {
                toast({
                  color: "warning",
                  content: tbbmessage,
                });
              }
              let index = pkMapRowIndex.get(pk);
              if (index == undefined) {
                index = this.submitindex;
              }
              let updateDataArr = [
                {
                  index: index,
                  data: {
                    values: vale.head[tableCode].rows[0].values,
                  },
                },
              ];
              props.table.updateDataByIndexs(tableCode, updateDataArr);
            });
          }
        }
      } else {
        if (res.data.status == "0" || res.data.status == "2") {
          if (result) {
            result.forEach((vale) => {
              let pk = vale.head[tableCode].rows[0].values.pk_protocol.value;
              let tbbmessage =
                vale.head[tableCode].rows[0].values.tbbmessage.value;
              if (tbbmessage && tbbmessage !== null) {
                toast({
                  color: "warning",
                  content: tbbmessage,
                });
              }
              let updateDataArr = [
                {
                  index: pkMapRowIndex.get(pk),
                  data: {
                    values: vale.head[tableCode].rows[0].values,
                  },
                },
              ];
              props.table.updateDataByIndexs(tableCode, updateDataArr);
            });
          }
        }
      }
      PromptMessage.call(this, res, opername);
    },
  });
};

/**
 * 列表内部按钮业务操作
 * @param {*} opername 操作名称
 * @param {*} opercode 操作编码
 * @param {*} props 页面内置对象
 * @param {*} pageCode 页面编码
 * @param {*} tableCode 表格编码
 * @param {*} pkName 主键字段名
 * @param {*} url 请求地址
 * @param {*} successMess 成功提示语
 * @param {*} datasource 区域缓存标识
 *
 */
export const BusinessInnerOperator = function (
  opername,
  opercode,
  props,
  record,
  index,
  tableCode,
  pageCode,
  url,
  successMess,
  datasource
) {
  let pk = record.pk_protocol.value;
  let ts = record.ts.value;
  let pkMapTs = new Map();
  let result;
  pkMapTs.set(pk, ts);
  this.submitpk = pk;
  this.operarea = "inner";
  if (opercode == "unterminateI") {
    let isinherit = record.isinherit.value;
    if (isinherit) {
      toast({
        color: "warning",
        content: this.state.json["36610CC-000005"],
      }); /* 国际化处理： 该协议有子授信协议，不能取消结束！*/
      return;
    }
  }
  ajax({
    url,
    data: {
      pkMapTs,
      pk,
      pageCode,
      actionArea: "inner",
    },
    success: (res) => {
      if (opercode == "submitI") {
        if (res.data && res.data.billCards && res.data.billCards) {
          result = res.data.billCards;
        }
        if (
          res.data.returnMsg &&
          res.data.returnMsg.workflow &&
          (res.data.returnMsg.workflow == "approveflow" ||
            res.data.returnMsg.workflow == "workflow")
        ) {
          this.setState({
            compositedata: res.data.returnMsg,
            compositedisplay: true,
          });
        } else {
          this.setState({
            compositedata: null,
            compositedisplay: false,
          });
          if (res.data.status == "0" || res.data.status == "2") {
            if (result) {
              result.forEach((vale) => {
                let pk = vale.head[tableCode].rows[0].values.pk_protocol.value;
                let tbbmessage =
                  vale.head[tableCode].rows[0].values.tbbmessage.value;
                if (tbbmessage && tbbmessage !== null) {
                  toast({
                    color: "warning",
                    content: tbbmessage,
                  });
                }
                let updateDataArr = [
                  {
                    index: index,
                    data: {
                      values: vale.head[tableCode].rows[0].values,
                    },
                  },
                ];
                props.table.updateDataByIndexs(tableCode, updateDataArr);
              });
            }
          }
        }
      } else if (opercode == "deleteI") {
        let tbbmessage =
          res.data.billCards[0].head[tableCode].rows[0].values.tbbmessage.value;
        if (tbbmessage && tbbmessage !== null) {
          toast({ color: "warning", content: tbbmessage });
        }
        //删除时，删除前台数据
        if (res.data.status == "0") {
          props.table.deleteCacheId(tableCode, pk);
          props.table.deleteTableRowsByIndex(tableCode, index);
        }
      } else {
        if (
          res.data.billCards &&
          res.data.billCards[0] &&
          res.data.billCards[0].head.table.rows[0]
        ) {
          let tbbmessage =
            res.data.billCards[0].head.table.rows[0].values.tbbmessage.value;
          if (tbbmessage && tbbmessage !== null) {
            toast({ color: "warning", content: tbbmessage });
          }
          let updateDataArr = [
            {
              index: index,
              data: {
                values: res.data.billCards[0].head.table.rows[0].values,
              },
            },
          ];
          props.table.updateDataByIndexs(tableCode, updateDataArr);
        }
        if (!res.data.billCards) {
          toast({
            color: "warning",
            content: res.data.errormessages[0],
          });
        }
      }
      PromptMessage.call(this, res, opername, false);
    },
  });
};
/**
 * 操作消息弹框
 * @param {Object} res - 响应数据
 * @param {Object} opername - 操作名称
 * @param {Object} isMulti - 是否为多条操作
 */
function PromptMessage(res, opername, isMulti = true) {
  let { status, msg } = res.data;
  let content;
  let total = res.data.total;
  let successNum = res.data.successNum;
  let failNum = res.data.failNum;
  content =
    this.state.json["36610CC-000029"] +
    opername +
    total +
    this.state.json["36610CC-000030"]; /* 国际化处理： 共,条，*/
  content =
    content +
    this.state.json["36610CC-000031"] +
    successNum +
    this.state.json["36610CC-000032"]; /* 国际化处理： 成功,条 ,*/
  content =
    content +
    this.state.json["36610CC-000033"] +
    failNum +
    this.state.json["36610CC-000034"]; /* 国际化处理： 失败,条*/
  let errMsgArr = res.data.errormessages;
  if (isMulti) {
    //全部成功
    if (status == 0) {
      toast({
        color: "success",
        title: opername + msg,
        content: content,
        TextArr: [
          this.state.json["36610CC-000035"],
          this.state.json["36610CC-000036"],
          this.state.json["36610CC-000037"],
        ] /* 国际化处理： 展开,收起,关闭*/,
        groupOperation: true,
      });
    } else if (status == 1) {
      //全部失败
      toast({
        color: "danger",
        title: opername + msg,
        content: content,
        TextArr: [
          this.state.json["36610CC-000035"],
          this.state.json["36610CC-000036"],
          this.state.json["36610CC-000037"],
        ] /* 国际化处理： 展开,收起,关闭*/,
        groupOperation: true,
        groupOperationMsg: errMsgArr,
      });
    } else if (status == 2) {
      //部分成功
      toast({
        color: "danger",
        title: opername + msg,
        content: content,
        TextArr: [
          this.state.json["36610CC-000035"],
          this.state.json["36610CC-000036"],
          this.state.json["36610CC-000037"],
        ] /* 国际化处理： 展开,收起,关闭*/,
        groupOperation: true,
        groupOperationMsg: errMsgArr,
      });
    }
  } else {
    if (status == 0) {
      // 成功
      toast({
        color: "success",
        content:
          opername.slice(0, opername.length - 1) +
          this.state.json["36610CC-000031"] /* [操作]成功 */,
      });
    } else {
      toast({
        color: "danger",
        content:
          opername.slice(0, opername.length - 1) +
          this.state.json["36610CC-000033"] /* [操作]失败 */,
      });
    }
  }
}

//cmiYx0pAPEwnseRzxuPOzqlz4vt6nQ5aaOkz2AhAV2+m8oh5yl965lbtYUvsduv5