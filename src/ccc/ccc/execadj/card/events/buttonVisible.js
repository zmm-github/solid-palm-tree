//2+0Qf+roUlDHXBeA/o9JMHCmHYPPIljwQTuE6X8IwL3ojpKC0SsX3NC0yzAY0Vis
import { orgVersionView } from "../../../../../tmpub/pub/util/version/index";

/**
 * 新增
 * @param {*} props  页面内置对象
 */
export function buttonVisible(props) {
  if (props.getUrlParam("scene") === "approvesce") return;
  let status = props.getUrlParam("status");
  let id = props.getUrlParam("id");
  let isBrowse = ["browse", "changeRecord"].includes(status);
  let buttons = handleBtnData(props.button.getButtons());
  let busistatus =
    this.props.form.getFormItemsValue(this.formId, "vbillstatus") &&
    this.props.form.getFormItemsValue(this.formId, "vbillstatus").value;
  let btnObj = {};
  let showBtn = [];
  if (status && !isBrowse) {
    //编辑态
    showBtn = ["Save", "SaveAdd", "SaveCommit", "Cancel"];
    props.cardPagination.setCardPaginationVisible("cardPaginationBtn", false);
  } else {
    //浏览态
    if (!id) {
      //新增浏览态
      showBtn = ["Add"];
    } else {
      //单据浏览态
      switch (busistatus) {
        case "-1": //自由态
          showBtn = ["Add", "Edit", "Delete", "Commit"];
          break;
        case "3": //提交态
          showBtn = ["Add", "UnCommit"];
          break;
        case "2": //审批中态
          showBtn = [
            "Add",
            "UnCommit",
            "UnionQuery",
            "ApproveDetail",
            "Protocol",
          ];
          break;
        case "1": //审批通过态
          showBtn = [
            "Add",
            "UnCommit",
            "UnionQuery",
            "ApproveDetail",
            "Protocol",
          ];
          break;
        default:
          break;
      }
      showBtn.push("Print", "OutPut", "Attachment", "Refresh");
    }
    props.cardPagination.setCardPaginationVisible("cardPaginationBtn", true);
  }
  for (let key of buttons) {
    btnObj[key] = showBtn.includes(key);
  }
  props.button.setButtonVisible(btnObj);
  // 提交按钮是否为应为主要按钮
  let isCommitBtnMain = showBtn.includes("Commit");
  // 设置按钮为主要或次要
  props.button.setMainButton({
    Commit: isCommitBtnMain,
    Add: !isCommitBtnMain,
  });
  props.form.setFormStatus(this.formId, !isBrowse ? "edit" : "browse");
  if (status === "add") {
    props.form.setFormStatus(this.formId, "edit");
    orgVersionView(props, "form_execadj");
    this.props.form.setFormItemsDisabled(this.formId, { pk_org: false }); //财务组织
  }
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