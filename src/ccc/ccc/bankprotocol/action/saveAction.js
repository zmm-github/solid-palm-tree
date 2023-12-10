//xNgxax5NVhzXPcYD6Yo+XTtoWu1Bpx2TkMoFodGwdD2SBkWFQoMJCp0KhgISwy57
import { ajax, toast } from "nc-lightapp-front";
import {
  TEMPLATE,
  TAB,
  URL,
  BILLINFO,
  dataSource,
  cardPageId
} from "../constant/constant.js";
/**
 * 银行授信协议保存
 */
export default function saveAction(id, callback) {
  let status = props.getUrlParam("status");
  let CardData = props.createTabsCardData(
    this.pageId,
    this.formId,
    this.tabOrder
  );
  if (!props.form.isCheckNow(this.formId)) {
    return;
  }
  if (CardData.bodys[this.tableId1].rows.length > 0) {
    if (!props.cardTable.checkTabRequired(this.tableId1, [this.tableId1])) {
      return;
    }
  }
  if (CardData.bodys[this.tableId2].rows.length > 0) {
    if (!props.cardTable.checkTabRequired(this.tableId2, [this.tableId2])) {
      return;
    }
  }
  let savedata = {
    data: CardData,
    pageCode: TEMPLATE.CARD_PAGE_ID
  };
  let pk_protocol;
  let billno;
  let saveObj = {};
  saveObj[TEMPLATE.TABLE_DETAIL] = "cardTable";
  saveObj[TEMPLATE.TABLE_GUARANTEE] = "cardTable";
  props.validateToSave(
    savedata,
    () => {
      ajax({
        url: URL.SAVE,
        data: CardData,
        success: res => {
          if (res.success) {
            if (res.data) {
              toast({
                color: "success",
                content: this.state.json["36610CC-000001"]
              }); /* 国际化处理： 保存成功*/
              if (res.data.head && res.data.head[TEMPLATE.FORM_ID]) {
                this.props.form.setAllFormValue({
                  [TEMPLATE.FORM_ID]: res.data.head[TEMPLATE.FORM_ID]
                });
                pk_protocol =
                  res.data.head[TEMPLATE.FORM_ID].rows[0].values.pk_protocol
                    .value;
                billno =
                  res.data.head[TEMPLATE.FORM_ID].rows[0].values.protocolcode
                    .value;
              }
              if (res.data.bodys) {
                this.props.cardTable.setAllTabsData(res.data.bodys, TAB.ORDER);
              }
              if (status == "add") {
                //新增缓存
                addCache(
                  pk_protocol,
                  res.data,
                  TEMPLATE.FORM_ID,
                  dataSource,
                  res.data.head[TEMPLATE.FORM_ID].rows[0].values
                );
              } else {
                //更新缓存
                updateCache(
                  BILLINFO.PK,
                  pk_protocol,
                  res.data,
                  TEMPLATE.FORM_ID,
                  dataSource,
                  res.data.head[TEMPLATE.FORM_ID].rows[0].values
                );
              }
              this.props.BillHeadInfo.setBillHeadInfoVisible({
                billCode: billno
              });
              //保存,保存提交
              if (id == "save") {
                this.props.setUrlParam({
                  status: "browse",
                  id: pk_protocol
                });
                this.toggleShow();
              } else if (id == "savesubmit") {
                BusinessOperator(
                  this,
                  props,
                  "submit",
                  TEMPLATE.CARD_PAGE_ID,
                  TEMPLATE.FORM_ID,
                  "/nccloud/ccc/bankprotocol/submit.do",
                  this.state.json["36610CC-000002"]
                ); /* 国际化处理： 提交成功！*/
              } else if (id == "saveadd") {
                //保存新增
                this.props.pushTo("/card", {
                  status: "add",
                  id: null,
                  pagecode: cardPageId
                });
                this.toggleShow();
                this.getData();
              }
            }
          }
        }
      });
    },
    saveObj,
    ""
  );
}

//xNgxax5NVhzXPcYD6Yo+XTtoWu1Bpx2TkMoFodGwdD2SBkWFQoMJCp0KhgISwy57