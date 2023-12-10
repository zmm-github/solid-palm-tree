//bLkXFuKw3KUaZeb8Dj31ZaBen3AhHupyk38WaLTweA8=
/**
 * 银行授信协议卡片页
 * @author dongyue7
 */
import React, { Component } from "react";
import { createPage, base } from "nc-lightapp-front";
let { NCDiv, NCAffix } = base;
import {
  buttonClick,
  afterEvent,
  beforeEvent,
  pageInfoClick,
  tableButtonClick,
} from "./events";
import { high } from "nc-lightapp-front";
import { tabs, dataSource, TEMPLATE, moduleId } from "../constant/constant.js";
import "./index.less";
import { formBeforeEvent } from "./events/formBeforeEvent";
import {
  handleClick,
  getTableHead,
  initVersionTree,
  onTreeSelect,
  onTreeMouseEnter,
  getAssginUsedr,
  compositeTurnOff,
  afterGetLang,
} from "./events/page";
const {
  NCUploader,
  PrintOutput,
  ApproveDetail,
  Inspection,
  ApprovalTrans,
} = high;

class Card extends Component {
  constructor(props) {
    super(props);
    this.formId = TEMPLATE.FORM_ID;
    this.tableId1 = TEMPLATE.TABLE_DETAIL;
    this.tableId2 = TEMPLATE.TABLE_GUARANTEE;
    this.pageId = TEMPLATE.CARD_PAGE_ID;
    this.tabCreCode = tabs.tabCreCode;
    this.tabCode = tabs.tabCode; //tab区域code
    this.tabOrder = tabs.tabOrder; //tab区域code排序
    this.currTableId = "";
    this.billPK = "pk_protocol";
    this.billNO = "protocolcode";
    this.protocolcode = "";
    this.treeId = "versionTree";
    this.dataSource = dataSource;
    this.billno = "";
    this.billID = ""; //版本树id
    this.moduleId = moduleId;
    this.orgCurrtype = {
      pk_currtype: "",
      olcrate: "",
    };
    this.state = {
      oldorg: "",
      oldorgDis: "",
      pasteflag: false,
      showUploader: false, //控制附件弹出框
      showNCbackBtn: false, //返回箭头
      showNtbDetail: false, //联查计划预算
      ntbdata: null, //预算计划数据
      checkedRows: [], //tabs处当前选中行的index集合
      billid: "", //单据Id
      billtype: "36X1",
      showAppr: false,
      isVersion: false, //显示版本信息
      showPagination: true, //显示分页箭头
      outputData: {
        oids: [],
        outputType: "output",
      },
      compositedata: null, //指派信息
      compositedisplay: false, //是否显示指派
      isPaste: false, //tabs处是否粘贴
      isshowCheck: true, // 子表是否显示复选框
    };
  }

  componentWillMount() {
    let callback = (json, status, inlt) => {
      if (status) {
        this.setState({ json, inlt }, () => {
          afterGetLang.call(this, this.props);
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

  componentDidMount() {
    //查询单据详情
    let id = this.props.getUrlParam("id");
    let status = this.props.getUrlParam("status");
    this.billID = id;
    let pageType = this.props.getUrlParam("pageType");
    if (pageType === "version") {
      //查看版本
      initVersionTree.call(this);
    }
  }
  onTabChange = (activeKey) => {
    if (activeKey === "table_detail") {
      // 授信明细页签
      // 分授信类别控制
      let credittypecontral = this.props.form.getFormItemsValue(
        this.formId,
        "credittypecontral"
      );
      credittypecontral = credittypecontral && credittypecontral.value;
      // 分贷款银行控制
      let creditbankcontral = this.props.form.getFormItemsValue(
        this.formId,
        "creditbankcontral"
      );
      creditbankcontral = creditbankcontral && creditbankcontral.value;
      // 分授信使用单位控制
      let creditunitcontral = this.props.form.getFormItemsValue(
        this.formId,
        "creditunitcontral"
      );
      creditunitcontral = creditunitcontral && creditunitcontral.value;
      // 都为 false 时，子表按钮才不可用
      let isDisable =
        credittypecontral || creditbankcontral || creditunitcontral;
      // 分授信使用单位控制
      this.props.button.setButtonDisabled(["addrow", "deleterow"], !isDisable);
    } else if (activeKey === "table_guarantee") {
      // 担保合同页签
      this.props.button.setButtonDisabled(["addrow", "deleterow"], false); //增行删行可用
    }
  };
  render() {
    let {
      cardTable,
      form,
      button,
      cardPagination,
      syncTree,
      DragWidthCom,
      socket,
    } = this.props;
    const { createBillHeadInfo } = this.props.BillHeadInfo;
    let { createForm } = form;
    let { createTabsTable } = cardTable;
    let { createCardPagination } = cardPagination;
    let { createButtonApp } = button;
    let { createSyncTree } = syncTree;
    let {
      showUploader,
      isVersion,
      showPagination,
      compositedata,
      compositedisplay,
    } = this.state;
    // 左树区域
    let treeDom = (
      <div className="left-area" style={{ marginLeft: "20px" }}>
        {createSyncTree({
          treeId: this.treeId, // 组件id
          needSearch: false, //是否需要查询框，默认为true,显示。false: 不显示
          onSelectEve: onTreeSelect.bind(this), //选择节点回调方法
          onMouseEnterEve: onTreeMouseEnter.bind(this), //鼠标滑过节点事件
          defaultExpandAll: true, //默认展开所有节点
          disabledSearch: true, //是否显示搜索框
        })}
      </div>
    );
    // 卡片主表区域
    let cardFormDom = (
      <div className="nc-bill-top-area">
        <div className="nc-bill-form-area">
          {createForm(this.formId, {
            expandArr: ["form_basic"],
            onAfterEvent: afterEvent.bind(this),
            onBeforeEvent: formBeforeEvent.bind(this),
          })}
        </div>
      </div>
    );
    // 表单子表区域
    let cardFormTableDom = (
      <div className="nc-bill-bottom-area">
        <div className="nc-bill-table-area">
          {createTabsTable(this.tabCode, {
            cancelCustomRightMenu: true,
            tableHead: getTableHead.bind(this),
            showCheck: this.state.isshowCheck,
            showIndex: true,
            adaptionHeight: true,
            onAfterEvent: afterEvent.bind(this),
            onBeforeEvent: beforeEvent.bind(this),
            modelSave: buttonClick.bind(this, this.props, "save"),
            onTabChange: (key) => {
              this.onTabChange(key);
            },
            modelAddRow: (props, moduleId, index) => {
              tableButtonClick.call(
                this,
                props,
                "addrow",
                "",
                "",
                index,
                "cela"
              );
            },
          })}

          {createTabsTable(this.tabCreCode, {
            cancelCustomRightMenu: true,
            showCheck: this.state.isshowCheck,
            showIndex: true,
            adaptionHeight: true,
            modelSave: buttonClick.bind(this, this.props, "save"),
          })}
        </div>
      </div>
    );

    let rightDom = (
      <div className="nc-bill-card">
        {cardFormDom}
        {cardFormTableDom}
      </div>
    );
    return (
      <div className="nc-bill-card">
        {socket.connectMesg({
          headBtnAreaCode: "card_head", // 表头按钮区域ID
          formAreaCode: this.formId, // 表头Form区域ID
          billtype: "36X1",
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
                    "36610CC-000019"
                  ] /* 国际化处理： 银行授信协议*/,
                billCode: this.billno,
                backBtnClick: () => {
                  handleClick.call(this);
                },
              })}
            </div>
            {!isVersion && (
              <div className="header-button-area">
                {/* 适配 微服务 按钮 开始 */}
                {this.props.button.createErrorFlag({
                  headBtnAreaCode: "card_head",
                })}
                {/* 适配 微服务 按钮 结束*/}
                {createButtonApp({
                  area: "card_head",
                  onButtonClick: buttonClick.bind(this),
                })}
              </div>
            )}
            {showPagination && !isVersion && (
              <div
                className="header-cardPagination-area"
                style={{ float: "right" }}
              >
                {createCardPagination({
                  handlePageInfoChange: pageInfoClick.bind(this),
                  dataSource: this.dataSource,
                })}
              </div>
            )}
          </NCDiv>
        </NCAffix>
        {/* 当单据状态为多版本时加载树卡区域 */}
        {isVersion && (
          <div className="tree-card">
            <DragWidthCom
              leftDom={treeDom} //左侧区域dom
              rightDom={rightDom} //右侧区域dom
              defLeftWid="20%" // 默认左侧区域宽度，px/百分百
            />
          </div>
        )}
        {/* 当单据状态为正常状态时 */}
        {!isVersion && cardFormDom}
        {!isVersion && cardFormTableDom}
        {/** 联查预算 **/}
        <Inspection
          show={this.state.showNtbDetail}
          sourceData={this.state.ntbdata}
          cancel={() => {
            this.setState({ showNtbDetail: false });
          }}
          affirm={() => {
            this.setState({ showNtbDetail: false });
          }}
        />
        {compositedisplay && (
          <ApprovalTrans
            title={
              this.state.json && this.state.json["36610CC-000020"]
            } /* 国际化处理： 指派*/
            data={compositedata}
            display={compositedisplay}
            getResult={getAssginUsedr.bind(this)}
            cancel={compositeTurnOff.bind(this)}
          />
        )}
        {/** 联查审批详情 **/}
        <ApproveDetail
          show={this.state.showAppr}
          close={() => {
            this.setState({
              showAppr: false,
            });
          }}
          billid={this.state.billid}
          billtype={this.state.billtype}
        />
        {/** 附件 **/}
        {showUploader && (
          <NCUploader
            billId={ this.state.billID}
            target={null}
            placement={"bottom"}
            billNo={ this.state.billNO}
            onHide={() => {
              this.setState({ showUploader: false });
            }}
          />
        )}
        {/** 输出 **/}
        <PrintOutput
          ref="printOutput"
          url="/nccloud/ccc/bankprotocol/print.do"
          data={this.state.outputData}
          callback={this.onSubmit}
        />
      </div>
    );
  }
}

Card = createPage({
  billinfo: {
    billtype: "extcard",
    pagecode: TEMPLATE.FORM_ID,
    headcode: TEMPLATE.FORM_ID,
    bodycode: [TEMPLATE.TABLE_DETAIL, TEMPLATE.TABLE_GUARANTEE],
  },
  mutiLangCode: "",
  orderOfHotKey: ["form_info", "table_detail"],
})(Card);

export default Card;

//bLkXFuKw3KUaZeb8Dj31ZaBen3AhHupyk38WaLTweA8=
