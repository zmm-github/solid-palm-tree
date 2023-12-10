//2+0Qf+roUlDHXBeA/o9JMHCmHYPPIljwQTuE6X8IwL3ojpKC0SsX3NC0yzAY0Vis
import { CONST_CARD } from "../../constant/constant";
export default function buttonVisible(props) {
  let scene = props.getUrlParam("scene");
  let ntbparadimvo = props.getUrlParam("ntbparadimvo");
  let status = props.getUrlParam("status");
  let id = props.getUrlParam("id");
  let buttons = handleBtnData(props.button.getButtons());
  //增加卡片页面错误信息标志
  let saga_status =
    props.form.getFormItemsValue(this.formId, "saga_status") &&
    props.form.getFormItemsValue(this.formId, "saga_status").value;
  if (status === "browse" && saga_status === "1") {
    props.button.toggleErrorStatus(CONST_CARD.head_btn_code, { isError: true });
  } else {
    props.button.toggleErrorStatus(CONST_CARD.head_btn_code, {
      isError: false,
    });
  }
  if ( scene === "linksce" || ntbparadimvo) return;
  // 审批状态
  let vbillstatus = props.form.getFormItemsValue(this.formId, "vbillstatus");
  // 协议状态
  let protocolstatus = props.form.getFormItemsValue(
    this.formId,
    "protocolstatus"
  );
  // 是否为浏览态
  let isBrowse = status === "browse";
  // 提交按钮是否为应为主要按钮
  let btnObj = {};
  let showBtn = [];

  if (status && !isBrowse) {
    // 编辑态
    if (status === "add" || status === "edit" || status === "copy") {
      this.setState({ isshowCheck: true });
      showBtn = [
        "addrow",
        "deleterow",
        "save",
        "saveadd",
        "savesubmit",
        "cancel",
        "deleterow",
        "addrow",
      ];
      props.cardPagination.setCardPaginationVisible("cardPaginationBtn", false);
    }
  } else {
    // 浏览态
    if (!id) {
      showBtn = ["add"];
    }
    this.setState({ isshowCheck: false });
    if (
      protocolstatus &&
      protocolstatus.value &&
      vbillstatus &&
      vbillstatus.value
    ) {
      let billstatus = protocolstatus.value;
      switch (billstatus) {
        case "NOCOMMIT": //待提交
          showBtn = [
            "add",
            "edit",
            "delete",
            "copy",
            "submit",
            "links",
            "linkver",
            "fold",
            "unfold"
          ];
          break;
        case "NOAUDIT": //待审批
          showBtn = [
            "add",
            "copy",
            "withdraw",
            "links",
            "linkntb",
            "refersh",
            "linkaprv",
            "linkver",
            "fold",
            "unfold",
            "approveEdit"
          ];
          break;
        case "NOEXECUTE": //未执行
          showBtn = [
            "add",
            "copy",
            "withdraw",
            "terminate",
            "links",
            "linkver",
            "linkaprv",
            "fold",
            "unfold",
          ];
          break;
        case "EXECUTING": //在执行
          if (vbillstatus.value == "-1") {
            //自由
            showBtn = [
              "add",
              "edit",
              "copy",
              "submit",
              "links",
              "assists",
              "linkver",
              "delversion",
              "fold",
              "unfold"
            ];
          } else if (vbillstatus.value == "3") {
            //提交
            showBtn = [
              "add",
              "copy",
              "withdraw",
              "links",
              "linkntb",
              "refersh",
              "assists",
              "linkver",
              "fold",
              "unfold",
              "approveEdit"
            ];
          } else if (vbillstatus.value == "1") {
            //审批通过
            showBtn = [
              "add",
              "copy",
              "withdraw",
              "links",
              "linkntb",
              "linkaprv",
              "assists",
              "frozen",
              "terminate",
              "change",
              "linkver",
              "linkaprv",
              "fold",
              "unfold",
              "delversion"
            ];
          } else {
            showBtn = [
              "add",
              "copy",
              "assists",
              "frozen",
              "terminate",
              "change",
              "links",
              "linkaprv",
              "linkntb",
              "linkver",
              "fold",
              "unfold"
            ];
          }
          break;
        case "FINISHED": //已结束
          showBtn = [
            "add",
            "copy",
            "unterminate",
            "links",
            "linkaprv",
            "linkntb",
            "linkver",
          ];
          break;
        case "FROZEN": //已冻结
          showBtn = ["add", "copy", "unfrozen", "links", "linkver"];
      }

      // 只有审核通过才显示“传送GMS”按钮
      if (vbillstatus.value == "1") {
        showBtn.push("transmitGMS");
      }
      
      showBtn.push("print", "printout", "file", "refresh", "More", "Receipt", "ReceiptCheck", "ReceiptScan");
      props.cardPagination.setCardPaginationVisible("cardPaginationBtn", true);
    }
  }

  let isCommitBtnMain = showBtn.includes("submit");
  // 设置按钮为主要或次要
  props.button.setMainButton({
    submit: isCommitBtnMain,
    add: !isCommitBtnMain,
  });

  for (let key of buttons) {
    btnObj[key] = showBtn.includes(key);
  }
  props.form.setFormStatus(this.formId, !isBrowse ? "edit" : "browse");
  props.button.setButtonVisible(btnObj);
}

/**
 * 按钮整理不包含按钮组
 * @param {*} buttons 全部按钮集合
 */
const handleBtnData = (buttons) => {
  let btnsArray = [];
  const handleFunc = (btns) => {
    btns.map((item) => {
      if (item.type != "buttongroup") {
        btnsArray.push(item.key);
      }
      if (item.children && item.children.length > 0) {
        handleFunc(item.children);
      }
    });
  };
  handleFunc(buttons);
  return btnsArray;
};

//2+0Qf+roUlDHXBeA/o9JMHCmHYPPIljwQTuE6X8IwL3ojpKC0SsX3NC0yzAY0Vis