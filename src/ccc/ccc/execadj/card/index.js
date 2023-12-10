//bLkXFuKw3KUaZeb8Dj31ZaBen3AhHupyk38WaLTweA8=
//主子表卡片
import {
  ajax,
  base,
  cardCache,
  createPage,
  high,
  toast,
} from "nc-lightapp-front";
import React, { Component } from "react";
import NCCCCBalance from "../../../public/Balance/list/index.js";
import {
  baseReqUrl,
  card,
  dataSource,
  javaUrl,
  moduleId,
  list,
} from "../cons/constant.js";
import {
  afterEvent,
  buttonClick,
  buttonVisible,
  clearAll,
  getCardData,
  getCopyCardData,
  initTemplate,
  initTemplate1,
  pageClick,
  setEditStatus,
} from "./events";
import { formBeforeEvent } from "./events/beforeEvent";
import { getCopyData } from "./events/page";
const { NCDiv, NCAffix } = base;
let { updateCache, getNextId, deleteCacheById } = cardCache;
const { NCUploader, PrintOutput, ApproveDetail, ApprovalTrans } = high;

class Card extends Component {
  constructor(props) {
    super(props);
    this.formId = card.headCode; //主表区域
    this.moduleId = moduleId; //多语使用
    this.pageId = card.pageCode; //card页面code
    this.cache = card.cardCache; //缓存key
    this.dataSource = dataSource; //调用列表界面缓存pks
    this.primaryId = card.primaryId;
    this.billPK = "pk_execadj";
    this.billNO = "vbillno";
    this.billno = "";
    this.state = {
      showCCC: false,
      showCCCBalance: {}, //联查授信协议
      pasteflag: false,
      showUploader: false, //控制附件弹出框
      billID: "", //单据主键
      billNO: "", //单据编码
      billid: "36X2", //单据Id
      showAppr: false,
      compositedisplay: false, //是否显示指派
      compositedata: null, //指派信息
    };
  }

  componentWillMount() {
    let callback = (json, status, inlt) => {
      if (status) {
        this.setState({ json, inlt }, () => {
          this.afterGetLang(this.props, json);
        });
      } else {
        console.log("未加载到多语资源");
      }
    };
    this.props.MultiInit.getMultiLang({
      moduleId: this.moduleId,
      domainName: "ccc",
      callback,
    });
  }

  afterGetLang(props) {
    if (props.getUrlParam("scene") == "approvesce") {
      initTemplate1.call(this, props, () => {
        let id = props.getUrlParam("id");
        this.setState({ billID: id });
        getCardData.call(this, id);
        props.BillHeadInfo.setBillHeadInfoVisible({
          showBackBtn: false, //控制显示返回按钮: true为显示,false为隐藏 ---非必传
        });
      });
    } else {
      initTemplate.call(this, props, () => {
        // let status = props.getUrlParam("status");
        // if (status === "add") {
        //     props.initMetaByPkorg();
        // }
      });
    }
    let id = props.getUrlParam("id");
    this.setState({ billID: id });
    let status = props.getUrlParam("status");
    if (status === "add") {
      //新增的时候置空数据
      clearAll.call(this, props);
    }
  }

  componentDidMount() {
    let id = this.props.getUrlParam("id");
    let copyId = this.props.getUrlParam("copyId");
    let status = this.props.getUrlParam("status");
    if (id) {
      if (status === "copy") {
        getCopyCardData.call(this, id, false, false);
      } else {
        getCardData.call(this, id, true);
      }
      this.props.form.setFormItemsDisabled(this.formId, {
        pk_org: true,
        vbillno: true,
        protocoltype: true,
        billmaker: true,
        billmakedate: true,
        approver: true,
        approvedate: true,
      });
    } else if (!copyId) {
      //billhead配置
      this.props.BillHeadInfo.setBillHeadInfoVisible({
        showBackBtn: false,
        showBillCode: false,
        billCode: "",
      });
    } else {
      getCopyData.call(this, copyId);
    }
  }

  /**
   * 按钮操作
   * @param {*} path       接口地址
   * @param {*} content    toast弹框显示内容
   */
  btnOperation = (path, content, submitdata) => {
    let pk_execadj = this.props.form.getFormItemsValue(
      this.formId,
      this.primaryId
    ).value;
    let pageCode = card.pageCode;
    let ts = this.props.form.getFormItemsValue(this.formId, "ts").value;
    let pkMapTs = new Map();
    pkMapTs.set(pk_execadj, ts);
    if (!pk_execadj) {
      pk_execadj = this.state.pk;
    }
    let data = {
      pkMapTs,
      pageCode: pageCode,
      pks: [pk_execadj],
    };

    //如果有指派数据，存到userObj
    if (path == "submit.do") {
      if (submitdata) {
        let usedata = {
          pkMapTs,
          pageCode: pageCode,
          pks: [pk_execadj],
        };
        usedata.userObj = submitdata;
        data = usedata;
      }
    }
    ajax({
      url: `${baseReqUrl}${path}`,
      data: data,
      success: (res) => {
        if (res.success) {
          if (path == javaUrl.commit) {
            //提交即指派
            if (
              res.data.returnMsg &&
              res.data.returnMsg.workflow &&
              (res.data.returnMsg.workflow == "approveflow" ||
                res.data.returnMsg.workflow == "workflow")
            ) {
              this.setState({
                compositedata: res.data.returnMsg,
                compositedisplay: true,
                pk: pk_execadj,
              });
            } else {
              this.setState({
                compositedata: null,
                compositedisplay: false,
              });
              updateCache(
                this.billPK,
                pk_execadj,
                res.data.billCards[0],
                this.formId,
                this.dataSource,
                res.data.billCards[0].head[this.formId].rows[0].values
              );
              // 后端要求重新查数据，不用返的数据
              // this.props.form.setAllFormValue({
              // 	[this.formId]: res.data.billCards[0].head[this.formId]
              // });
              getCardData.call(this, this.props.getUrlParam("id"), true, true);
              toast({ color: "success", content });
              if (
                res.data.billCards[0].head[this.formId] &&
                res.data.billCards[0].head[this.formId].rows[0] &&
                res.data.billCards[0].head[this.formId].rows[0].values[
                  "interactfield"
                ].value
              ) {
                let interactfield =
                  res.data.billCards[0].head[this.formId].rows[0].values[
                    "interactfield"
                  ].value;
                let arr = interactfield.split("。");
                toast({
                  color: "warning",
                  content: arr[arr.length - 2],
                });
              }
              buttonVisible.call(this, this.props);
            }
          } else if (path === javaUrl.delete) {
            toast({ color: "success", content });
            // 获取下一条数据的id
            let nextId = getNextId(pk_execadj, this.dataSource);
            //删除缓存
            deleteCacheById(this.primaryId, pk_execadj, this.dataSource);
            if (nextId) {
              getCardData.call(this, nextId);
            } else {
              // 删除的是最后一个的操作
              this.props.setUrlParam("");
              setEditStatus.call(this, "browse");
              clearAll.call(this, this.props);
            }
          } else if (res.data) {
            if (path === javaUrl.uncommit) {
              updateCache(
                this.billPK,
                pk_execadj,
                res.data,
                this.formId,
                this.dataSource,
                res.data.head[this.formId].rows[0].values
              );
              getCardData.call(this, this.props.getUrlParam("id"), true, true);
              // 后端要求重新查数据
              // this.props.form.setAllFormValue({
              // 	[this.formId]: res.data.head[this.formId]
              // });
            } else {
              updateCache(
                this.billPK,
                pk_execadj,
                res.data,
                this.formId,
                this.dataSource,
                res.data.head[this.formId].rows[0].values
              );
              this.props.form.setAllFormValue({
                [this.formId]: res.data.billCards[0].head[this.formId],
              });
            }
            toast({ color: "success", content });
            buttonVisible.call(this, this.props);
          }
        }
      },
    });
  };

  closeApprove = () => {
    this.setState({
      showAppr: false,
    });
  };

  //提交即指派确认，重新调commit接口
  getAssginUsedr = (value) => {
    this.btnOperation(
      javaUrl.commit,
      this.state.json["36610CCA-000006"],
      value
    ); /* 国际化处理： 提交成功*/
  };

  //提交即指派取消
  compositeTurnOff = (value) => {
    this.setState({
      compositedata: null,
      compositedisplay: false,
    });
  };

  //卡片返回按钮
  handleClick = () => {
    //先跳转列表
    this.props.pushTo("/list", { pagecode: list.pageCode, status: "browse" });
  };

  render() {
    let { form, button, ncmodal, cardPagination, socket } = this.props;
    let { createForm } = form;
    let { createCardPagination } = cardPagination;
    let { createButtonApp } = button;
    let { createModal } = ncmodal;
    let { showUploader, billID, billNO } = this.state;
    const { createBillHeadInfo } = this.props.BillHeadInfo;

    return (
      <div className="nc-bill-card">
        {socket.connectMesg({
          headBtnAreaCode: "card_head", // 表头按钮区域ID
          formAreaCode: this.formId, // 表头Form区域ID
          billtype: "36X2",
          billpkname: this.billPK,
          dataSource: this.dataSource,
        })}
        <NCAffix>
          <NCDiv areaCode={NCDiv.config.HEADER} className="nc-bill-header-area">
            <div className="header-title-search-area">
              {createBillHeadInfo({
                title:
                  this.state.json &&
                  this.state.json[
                    "36610CCA-000007"
                  ] /* 国际化处理： 银行授信执行调整*/,
                billCode: this.billno,
                backBtnClick: () => {
                  this.handleClick();
                },
              })}
            </div>
            <div className="header-button-area">
              {/* 适配 微服务 按钮 开始 */}
              {this.props.button.createErrorFlag({
                headBtnAreaCode: card.btnCode,
              })}
              {/* 适配 微服务 按钮 结束*/}
              {createButtonApp({
                area: card.btnCode,
                onButtonClick: buttonClick.bind(this),
              })}
            </div>
            {this.props.getUrlParam("scene") !== "approvesce" && (
              <div
                className="header-cardPagination-area"
                style={{ float: "right" }}
              >
                {createCardPagination({
                  dataSource: this.dataSource,
                  handlePageInfoChange: pageClick.bind(this),
                })}
              </div>
            )}
          </NCDiv>
        </NCAffix>
        <div className="nc-bill-form-area">
          {createForm(this.formId, {
            onAfterEvent: afterEvent.bind(this),
            onBeforeEvent: formBeforeEvent.bind(this),
          })}
        </div>

        {createModal("deleteModal", {
          title:
            this.state.json &&
            this.state.json["36610CCA-000008"] /* 国际化处理： 删除*/,
          content:
            this.state.json &&
            this.state.json["36610CCA-000009"] /* 国际化处理： 确定要删除么?*/,
          beSureBtnClick: () => {
            this.btnOperation(
              javaUrl.delete,
              this.state.json && this.state.json["36610CCA-000010"]
            ); /* 国际化处理： 删除成功!*/
          },
        })}
        {createModal("cancelModal", {
          title:
            this.state.json &&
            this.state.json["36610CCA-000011"] /* 国际化处理： 确认取消*/,
          content:
            this.state.json &&
            this.state.json["36610CCA-000012"] /* 国际化处理： 是否确认取消*/,
          userControl: false, // 点确定按钮后，是否自动关闭弹出框.true:手动关。false:自动关
          noFooter: false, //是否需要底部按钮,默认true
          rightBtnName:
            this.state.json &&
            this.state.json["36610CCA-000013"] /* 国际化处理： 取消*/,
          leftBtnName:
            this.state.json &&
            this.state.json["36610CCA-000014"] /* 国际化处理： 确认*/,
        })}
        {/** 联查审批详情 **/}
        <div>
          <ApproveDetail
            show={this.state.showAppr}
            close={this.closeApprove}
            billid={this.state.billid}
            billtype={this.state.billtype}
          />
        </div>
        {/** 联查授信协议 **/}
        <div>
          {this.state.showCCC && (
            <NCCCCBalance
              showmodal={this.state.showCCC}
              showCCCBalance={this.state.showCCCBalance} // 点击确定按钮的回调函数
              onSureClick={() => {
                //关闭对话框
                this.setState({
                  showCCC: false,
                });
              }}
              onCloseClick={() => {
                //关闭对话框
                this.setState({
                  showCCC: false,
                });
              }}
            />
          )}
        </div>
        {/** 附件 **/}
        <div className="nc-faith-demo-div2">
          {showUploader && (
            <NCUploader
              billId={billID}
              target={null}
              placement={"bottom"}
              billNo={billNO}
              onHide={() => {
                this.setState({ showUploader: false });
              }}
            />
          )}
        </div>
        {/** 输出 **/}
        <div>
          <PrintOutput
            ref="printOutput"
            url="/nccloud/ccc/execadj/print.do"
            data={this.state.outputData}
            callback={this.onSubmit}
          />
        </div>
        {this.state.compositedisplay ? (
          <ApprovalTrans
            title={
              this.state.json && this.state.json["36610CCA-000015"]
            } /* 国际化处理： 指派*/
            data={this.state.compositedata}
            display={this.state.compositedisplay}
            getResult={this.getAssginUsedr}
            cancel={this.compositeTurnOff}
          />
        ) : (
          ""
        )}
      </div>
    );
  }
}

Card = createPage({
  mutiLangCode: moduleId,
  billinfo: {
    billtype: "extcard",
    pagecode: "36610CCA_C01",
    headcode: "form_execadj",
  },
})(Card);

export default Card;

//bLkXFuKw3KUaZeb8Dj31ZaBen3AhHupyk38WaLTweA8=