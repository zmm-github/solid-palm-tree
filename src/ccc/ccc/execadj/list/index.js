//bLkXFuKw3KUaZeb8Dj31ZaBen3AhHupyk38WaLTweA8=
//主子表列表
import { ajax, base, cardCache, createPage, high } from "nc-lightapp-front";
import React, { Component } from "react";
import NCTabs from "../../../../tmpub/pub/util/NCTabs/index";
import NCCCCBalance from "../../../public/Balance/list/index.js";
import {
  baseReqUrl,
  dataSource,
  javaUrl,
  key,
  list,
  moduleId,
  searchKey,
  searchSpace,
  card
} from "../cons/constant.js";
import {
  buttonClick,
  buttonDisabled,
  initTemplate,
  pageInfoClick,
  searchBtnClick
} from "./events";
import { BusinessHeadOperator } from "./events/BusinessOperator";
let { NCAffix, NCDiv } = base;
const { NCUploader, PrintOutput, ApproveDetail, ApprovalTrans } = high;
let { setDefData, getDefData } = cardCache;
const { NCTabPane } = NCTabs;

class List extends Component {
  constructor(props) {
    super(props);
    this.billPK = "pk_execadj"; //
    this.tableId = list.tableCode; //table区域
    this.searchId = list.searchCode; //查询区域
    this.pageId = list.pageCode; //list页面code
    this.primaryId = list.primaryId; //主键ID
    this.dataSource = dataSource; //缓存key
    this.key = key; //缓存相关
    this.moduleId = moduleId; //多语使用
    this.submitpk = ""; //提交使用
    this.submitindex = "";
    this.operarea = "";
    (this.billNO = "vbillno"), //单据编码
      (this.innerTs = "");
    this.moduleId = moduleId;
    this.state = {
      numvalues: {},
      showCCC: false,
      showCCCBalance: {},
      pks: [],
      selectedGroup: "0", //当前选中的分组
      showUploader: false, //是否显示附件框
      defaultSelectGrup: "0", ////默认显示第一个页签
      billID: "", //单据主键
      billNO: "", //单据编码
      outputData: {
        //打印输出
        oids: [],
        outputType: "output"
      },
      showAppr: false,
      compositedisplay: false, //是否显示指派
      compositedata: null //指派信息
    };
  }

  componentWillMount() {
    let callback = (json, status, inlt) => {
      if (status) {
        this.setState({ json, inlt }, () => {
          initTemplate.call(this, json, this.props);
        });
      } else {
        console.log("未加载到多语资源");
      }
    };
    this.props.MultiInit.getMultiLang({
      moduleId: this.moduleId,
      domainName: "ccc",
      callback
    });
  }

  componentDidMount() {
    this.getOIdData(); //加载默认缓存数据
    let numvalues = getDefData(this.dataSource, "numvalues");
    if (numvalues) {
      this.setState({ numvalues: numvalues });
    }
    let selectedGroup = getDefData(this.dataSource, "selectedGroup");
    if (selectedGroup) {
      this.setState({ selectedGroup: selectedGroup });
    }
    buttonDisabled.call(this);
  }

  getOIdData = () => {
    let { hasCacheData } = this.props.table;
    this.restStateData(); //获得缓存中state值
    if (!hasCacheData(this.dataSource)) {
      //自己查询数据
    } else {
      //加载缓存数据-自动加载数据
    }
  };

  // 还原列表页页签数字数据
  restStateData = () => {
    //获取页签数据
    let cachestate = getDefData(this.key, this.dataSource);
    if (cachestate) {
      let keys = Object.keys(cachestate);
      for (let i = 0, l = keys.length; i < l; i++) {
        let key = keys[i];
        this.state[key] = cachestate[key];
      }
    }
  };

  // 设置缓存数据的方法
  setStateCache = () => {
    setDefData(this.key, this.dataSource, this.state);
  };

  //页签筛选
  navChangeFun = (groupKey, className, e) => {
    // searchBtnClick.call(this, this.props, null, groupKey);
    //查询
    this.setState({ selectedGroup: groupKey }, () => {
      setDefData(this.dataSource, "selectedGroup", groupKey);
      let groupCondition;
      switch (groupKey) {
        //待提交
        case list.DTJ:
          this.setState({ defaultSelectGrup: list.DTJ });
          groupCondition = {
            field: "execadjstatus",
            value: {
              firstvalue: "NOSUB",
              secondvalue: null
            },
            oprtype: "="
          };
          this.getPaginationData(groupCondition);
          break;
        //待审批
        case list.SPWC:
          groupCondition = {
            field: "execadjstatus",
            value: {
              firstvalue: "APPROCOM",
              secondvalue: null
            },
            oprtype: "="
          };
          this.getPaginationData(groupCondition);
          break;
        //审批中
        case list.SPZ:
          this.setState({ defaultSelectGrup: list.SPZ });
          groupCondition = {
            field: "execadjstatus",
            value: {
              firstvalue: "APPRO",
              secondvalue: null
            },
            oprtype: "="
          };
          this.getPaginationData(groupCondition);
          break;
        //全部
        case list.ALL:
          this.setState({ defaultSelectGrup: list.ALL });
          groupCondition = {};
          this.getPaginationData(groupCondition);
          break;
        //默认作为全部处理
        default:
          this.setState({ defaultSelectGrup: list.DTJ });
          groupCondition = {};
          this.getPaginationData();
          break;
      }
    });
  };

  getPaginationData = groupCondition => {
    let searchVal = getDefData(searchKey, searchSpace);
    if (!searchVal) {
      return;
    }
    let pageInfo = this.props.table.getTablePageInfo(this.tableId);
    let conditions = Array.isArray(groupCondition)
      ? groupCondition
      : [groupCondition];
    let searchData = {
      querycondition: searchVal,
      custcondition: {
        logic: "and", //逻辑操作符，and、or
        conditions: [groupCondition]
      },
      pageInfo: pageInfo,
      oid: list.searchOid,
      pageCode: this.pageId,
      queryAreaCode: list.searchCode, //查询区编码
      querytype: "tree"
    };
    ajax({
      url: "/nccloud/ccc/execadj/querylist.do",
      data: searchData,
      success: res => {
        let { success, data } = res;
        if (success) {
          if (data.grid) {
            this.props.table.setAllTableData(
              this.tableId,
              data.grid[this.tableId]
            );
          } else {
            this.props.table.setAllTableData(this.tableId, {
              rows: []
            });
          }
          if (data.groupData) {
            this.setState({
              numvalues: data.groupData,
              DTJ:
                data.groupData.DTJ == null
                  ? "(0)"
                  : "(" + data.groupData.DTJ + ")",
              SPZ:
                data.groupData.SPZ == null
                  ? "(0)"
                  : "(" + data.groupData.SPZ + ")",
              ALL:
                data.groupData.ALL == null
                  ? "(0)"
                  : "(" + data.groupData.ALL + ")"
            });
            setDefData(dataSource, "numvalues", data.groupData);
          }
          buttonDisabled.call(this);
        }
      }
    });
  };

  //刷新
  refresh = () => {
    let { selectedGroup } = this.state;
    this.navChangeFun(selectedGroup);
  };

  closeApprove = () => {
    this.setState({
      showAppr: false
    });
  };

  onRowDoubleClick = (record, index, props, e) => {
    props.pushTo("/card", {
      status: "browse",
      id: record.pk_execadj.value,
      pagecode: card.pageCode
    });
  };

  //提交即指派确认，重新调commit接口
  getAssginUsedr = value => {
    // this.btnOperation(javaUrl.commit,'提交成功',value);
    BusinessHeadOperator(
      this,
      this.state.json["36610CCA-000031"],
      "Commit",
      this.props,
      this.pageId,
      this.tableId,
      this.primaryId,
      baseReqUrl + javaUrl.commit,
      this.state.json["36610CCA-000017"],
      null,
      null,
      null,
      null,
      value
    ); /* 国际化处理： 提交：,提交成功！*/
  };

  //提交即指派取消
  compositeTurnOff = value => {
    this.setState({
      compositedata: null,
      compositedisplay: false
    });
  };

  render() {
    let numvalues = this.state.numvalues;
    let { table, button, search, ncmodal, BillHeadInfo, socket } = this.props;
    let { createSimpleTable } = table;
    let { NCCreateSearch } = search;
    let { createButtonApp } = button;
    let { createModal } = ncmodal;
    let { selectedGroup, showUploader, billID, billNO } = this.state;
    const { createBillHeadInfo } = BillHeadInfo;
    return (
      <div className="nc-bill-list">
        {socket.connectMesg({
          tableAreaCode: this.tableId,
          billpkname: this.billPK,
          billtype: "36X2",
          dataSource: this.dataSource
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
                initShowBackBtn: false
              })}
            </div>
            <div className="header-button-area">
              {createButtonApp({
                area: list.btnCode,
                onButtonClick: buttonClick.bind(this)
              })}
            </div>
          </NCDiv>
        </NCAffix>
        <div className="nc-bill-search-area">
          {NCCreateSearch(this.searchId, {
            clickSearchBtn: searchBtnClick.bind(this),
            showAdvBtn: true, //  显示高级按钮
            onAfterEvent: "", //编辑后事件
            // searchBtnName: this.state.json && this.state.json['36610CCA-000038'] /* 国际化处理： 查询*/,
            oid: list.searchOid //查询模板的oid，用于查询查询方案
          })}
        </div>
        <NCTabs
          activeKey={selectedGroup}
          onChange={v => {
            this.navChangeFun.call(this, v);
          }}
        >
          <NCTabPane
            key={"0"}
            tab={
              //待提交
              this.state.json &&
              this.state.json["36610CCA-000039"] +
                ((numvalues && numvalues.DTJ) || 0) +
                ")" /* 国际化处理： 待提交  (*/
            }
          />
          <NCTabPane
            key={"2"}
            tab={
              //审批中
              this.state.json &&
              this.state.json["36610CCA-000040"] +
                ((numvalues && numvalues.SPZ) || 0) +
                ")" /* 国际化处理： 审批中  (*/
            }
          />
          <NCTabPane
            key={"3"}
            tab={
              //在执行
              this.state.json &&
              this.state.json["36610CCA-000041"] /* 国际化处理： 全部*/
            }
          />
        </NCTabs>
        <div className="nc-bill-table-area">
          {createSimpleTable(this.tableId, {
            handlePageInfoChange: pageInfoClick.bind(this),
            onRowDoubleClick: this.onRowDoubleClick.bind(this),
            onSelected: buttonDisabled.bind(this),
            onSelectedAll: buttonDisabled.bind(this),
            showCheck: true,
            showIndex: true,
            dataSource: this.dataSource,
            pkname: this.primaryId,
            componentInitFinished: () => {
              buttonDisabled.call(this);
              //缓存数据赋值成功的钩子函数
              //若初始化数据后需要对数据做修改，可以在这里处理
            }
          })}
        </div>
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
                  showCCC: false
                });
              }}
              onCloseClick={() => {
                //关闭对话框
                this.setState({
                  showCCC: false
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

List = createPage({
  mutiLangCode: moduleId
})(List);

export default List;

//bLkXFuKw3KUaZeb8Dj31ZaBen3AhHupyk38WaLTweA8=