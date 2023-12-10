//Hm9gUKDDwtNjV7Mk8onAzoiJvgJ2z9dxt1mjNpcJT+TWFvpEHQelV9yrvEYPZI9r
import { ajax, toast, cardCache, print } from "nc-lightapp-front";
import { baseReqUrl, javaUrl } from "../../cons/constant.js";
import initTemplate from "./initTemplate";
import { buttonVisible } from "./buttonVisible";
import { getCardData, getCopyCardData } from "./page";
let { getCurrentLastId, updateCache, addCache } = cardCache;
import { orgVersionView } from "../../../../../tmpub/pub/util/version/index";

/**
 * 新增
 * @param {*} props    页面内置对象
 * @param {*} id       注册按钮编码
 */
export function buttonClick(props, id) {
  let pk = props.form.getFormItemsValue(this.formId, this.billPK).value;
  let billno = props.form.getFormItemsValue(this.formId, this.billNO).value;
  switch (id) {
    // 新增
    case "Add":
      add.call(this, props);
      break;
    case "SaveAdd": //保存新增
      saveAction.call(this, props, true);
      break;
    // 修改
    case "Edit":
      edit.call(this, props);
      break;
    // 复制
    case "copy":
      copy.call(this, props);
      break;
    // 保存
    case "Save":
      saveBill.call(this, props, true);
      break;
    // 提交
    case "Commit":
      this.btnOperation(
        javaUrl.commit,
        this.state.json["36610CCA-000003"]
      ); /* 国际化处理： 提交成功!*/
      break;
    // 保存提交
    case "SaveCommit":
      saveBill.call(this, props);
      break;
    // 删除
    case "Delete":
      props.modal.show("deleteModal");
      break;
    // 取消
    case "Cancel":
      cancel.call(this, props, pk);
      break;
    // 收回
    case "UnCommit":
      this.btnOperation(
        javaUrl.uncommit,
        this.state.json["36610CCA-000004"]
      ); /* 国际化处理： 收回成功!*/
      break;
    // 刷新
    case "Refresh":
      getCardData.call(this, this.props.getUrlParam("id"), true, true, () => {
        toast({
          color: "success",
          content: this.state.json["36610CCA-000043"] /* 国际化处理 刷新成功 */
        });
      });
      break;
    case "Print": //打印
      printClick(this, id);
      break;
    case "OutPut": //输出
      printClick(this, id);
      break;
    case "Protocol": //联查授信协议
      linkProtocol(this, props);
      break;
    case "Attachment": //附件管理
      this.setState({
        billID: pk,
        billNO: billno,
        showUploader: !this.state.showUploader
      });
      break;
    case "ApproveDetail": //联查审批详情
      linkApproveMessage(this, props);
      break;
    default:
      break;
  }
}
/**
 * 联查审批详情
 * @param {*} that
 * @param {*} props
 */
function linkApproveMessage(that, props) {
  let pk_link = props.form.getFormItemsValue(that.formId, "pk_execadj").value; //单据pk
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
  let pk_link = that.props.form.getFormItemsValue(that.formId, "pk_execadj")
    .value; //单据pk
  let pk_protocol = that.props.form.getFormItemsValue(
    that.formId,
    "pk_protocol"
  ).value; //协议pk
  let pk_currtype = that.props.form.getFormItemsValue(
    that.formId,
    "pk_currtype"
  ).value; //币种
  let pk_org = that.props.form.getFormItemsValue(that.formId, "pk_org").value; //组织
  let pk_bankdoc = that.props.form.getFormItemsValue(that.formId, "pk_bankdoc")
    .value; //贷款银行
  let credittype = that.props.form.getFormItemsValue(that.formId, "pk_cctype")
    .value; //授信类别
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
  let pk = that.props.form.getFormItemsValue(that.formId, "pk_execadj").value;
  let pks = [];
  pks.push(pk);
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
 * 保存新增
 * @param {*} props
 * @param {*} type
 */
function saveAction(props, type) {
  let flagForm = this.props.form.isCheckNow(this.formId); //form表单是否校验通过，必输项等
  // 子表校验TODO
  let data = this.props.createExtCardData(this.pageId, this.formId);
  if (!flagForm) {
    return;
  }
  let primaryId = this.primaryId;
  props.validateToSave(
    data,
    () => {
      ajax({
        url: `${baseReqUrl}${type ? javaUrl.save : javaUrl.savecommit}.do`,
        data,
        success: res => {
          if (res.success) {
            if (res.data) {
              let id =
                res.data.head[this.formId].rows[0].values[primaryId].value;
              toast({
                color: "success",
                content: this.state.json["36610CCA-000005"]
              }); /* 国际化处理： 保存成功*/
              props.setUrlParam({
                id,
                status: "edit"
              });
              orgVersionView(props, "form_execadj");
              buttonVisible.call(this, this.props);
              setEditStatus.call(this, "edit");
              props.form.EmptyAllFormValue(this.formId);
              this.props.form.setFormItemsValue(this.formId, {
                updatedir: {
                  display: this.state.json["36610CCA-000000"],
                  value: "USE"
                }
              }); /* 国际化处理： 占用*/
              this.props.form.setFormItemsValue(this.formId, {
                execadjstatus: {
                  display: this.state.json["36610CCA-000001"],
                  value: "NOSUB"
                }
              }); /* 国际化处理： 待提交*/
              this.props.form.setFormItemsDisabled(this.formId, {
                pk_org: false
              });
              this.props.BillHeadInfo.setBillHeadInfoVisible({
                showBackBtn: false,
                showBillCode: false,
                billCode: ""
              });
              initTemplate.call(this, props);
            }
          }
        }
      });
    },
    "",
    ""
  );
}
/**
 * 新增
 * @param {*} props  页面内置对象
 */
function add(props) {
  props.setUrlParam({ status: "add" });
  clearAll.call(this, props);
  initTemplate.call(this, props);
  props.BillHeadInfo.setBillHeadInfoVisible({
    showBackBtn: false,
    showBillCode: false
  });
}

/**
 * 修改
 * @param {*} props  页面内置对象
 */
function edit(props) {
  props.setUrlParam({ status: "edit" });
  orgVersionView(props, "form_execadj");
  buttonVisible.call(this, props);
  setEditStatus.call(this, "edit");
}
/**
 * 复制
 * @param {*} props  页面内置对象
 */
function copy(props) {
  props.setUrlParam({ status: "copy" });
  let id = props.getUrlParam("id");
  getCopyCardData.call(this, id, false, false);
  orgVersionView(props, "form_execadj");
  buttonVisible.call(this, props);
  setEditStatus.call(this, "edit");
}

/**
 * 取消
 * @param {*} props  页面内置对象
 */
function cancel(props, pk) {
  let id = pk;
  props.modal.show("cancelModal", {
    beSureBtnClick: () => {
      let last_pk = getCurrentLastId(this.dataSource);
      orgVersionView(props, "form_execadj");
      props.setUrlParam({ status: "browse" });
      if (id) {
        props.setUrlParam({ id: id });
        getCardData.call(this, id, true);
      } else if (last_pk) {
        props.setUrlParam({ id: last_pk });
        getCardData.call(this, last_pk, true);
      } else {
        props.form.EmptyAllFormValue(this.formId);
        props.BillHeadInfo.setBillHeadInfoVisible({
          showBackBtn: true
        });
        buttonVisible.call(this, props);
        props.form.setFormItemsValue(this.formId, {
          updatedir: { display: "", value: "" }
        }); /* 国际化处理： 占用*/
        initTemplate.call(this, props);
      }
      setEditStatus.call(this, "browse");
    }
  });
}

/**
 * 保存提交
 * @param {*} props  页面内置对象
 * @param {*} type   true保存，false保存提交
 */
function saveBill(props, type) {
  let flagForm = this.props.form.isCheckNow(this.formId); //form表单是否校验通过，必输项等
  // 子表校验TODO
  let data = this.props.createExtCardData(this.pageId, this.formId);
  if (!flagForm) {
    return;
  }
  let isAdd = this.props.getUrlParam("status") === "add";
  let that = this;
  let primaryId = this.primaryId;
  props.validateToSave(
    data,
    () => {
      ajax({
        url: `${baseReqUrl}${javaUrl.save}.do`,
        data,
        success: res => {
          if (res.success) {
            if (res.data) {
              console.log(res.data);
              let id =
                res.data.head[this.formId].rows[0].values[primaryId].value;
              let billno =
                res.data.head[this.formId].rows[0].values["vbillno"].value;
              toast({
                color: "success",
                content: this.state.json["36610CCA-000005"]
              }); /* 国际化处理： 保存成功*/
              if (
                res.data.head[this.formId] &&
                res.data.head[this.formId].rows[0] &&
                res.data.head[this.formId].rows[0].values["interactfield"].value
              ) {
                let interactfield =
                  res.data.head[this.formId].rows[0].values["interactfield"]
                    .value;
                let arr = interactfield.split("。");
                toast({ color: "warning", content: arr[arr.length - 2] });
              }
              props.setUrlParam({
                id,
                status: "browse"
              });
              orgVersionView(props, "form_execadj");
              this.props.form.setAllFormValue({
                [this.formId]: res.data.head[this.formId]
              });
              this.props.BillHeadInfo.setBillHeadInfoVisible({
                showBackBtn: true,
                showBillCode: true,
                billCode: billno
              });
              // 缓存
              if (isAdd) {
                addCache(id, res.data, this.formId, this.dataSource);
              } else {
                updateCache(
                  this.primaryId,
                  id,
                  res.data,
                  this.formId,
                  this.dataSource
                );
              }
              if (type) {
                buttonVisible.call(this, this.props);
                setEditStatus.call(this, "browse");
              } else {
                buttonVisible.call(this, this.props);
                setEditStatus.call(this, "browse");
                this.btnOperation(
                  javaUrl.commit,
                  this.state.json["36610CCA-000003"]
                ); /* 国际化处理： 提交成功!*/
              }
            }
          }
        }
      });
    },
    "",
    ""
  );
}

/**
 * 清空所有的数据
 * @param {*} props  页面内置对象
 */
export function clearAll(props) {
  props.initMetaByPkorg();
  props.form.EmptyAllFormValue(this.formId);
  this.props.BillHeadInfo.setBillHeadInfoVisible({
    billCode: ""
  });
  buttonVisible.call(this, props);
  this.props.form.setFormItemsValue(this.formId, {
    updatedir: { display: this.state.json["36610CCA-000000"], value: "USE" }
  }); /* 国际化处理： 占用*/
  this.props.form.setFormItemsValue(this.formId, {
    execadjstatus: {
      display: this.state.json["36610CCA-000001"],
      value: "NOSUB"
    }
  }); /* 国际化处理： 待提交*/
}

/**
 * 设置编辑性
 * @param {*} status  编辑状态，传入browse或者edit
 */
export function setEditStatus(status) {
  this.props.form.setFormStatus(this.formId, status);
  this.props.form.setFormItemsDisabled(this.formId, {
    pk_org: true,
    vbillno: true,
    protocoltype: true,
    billmaker: true,
    billmakedate: true,
    approver: true,
    approvedate: true
  });
}

//Hm9gUKDDwtNjV7Mk8onAzoiJvgJ2z9dxt1mjNpcJT+TWFvpEHQelV9yrvEYPZI9r