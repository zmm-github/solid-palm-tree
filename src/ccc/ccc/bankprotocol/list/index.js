//bLkXFuKw3KUaZeb8Dj31ZaBen3AhHupyk38WaLTweA8=
/**
 * 银行授信协议列表页
 * @author dongyue7
 */
import { ajax, base, cardCache, createPage, high } from "nc-lightapp-front";
import React, { Component } from "react";
import NCTabs from "../../../../tmpub/pub/util/NCTabs/index";
import {
  ACTION_URL,
  dataSource,
  key,
  moduleId,
  searchKey,
  searchSpace,
  cardPageId
} from "../constant/constant.js";
import {
  buttonClick,
  buttonDisable,
  initTemplate,
  initTemplate1,
  pageInfoClick,
  pageInfoClick1,
  searchBtnClick
} from "./events";
import { BusinessHeadOperator } from "./events/BusinessOperator";
import "./index.less";
const { NCTabPane } = NCTabs;
let { NCAffix, NCDiv } = base;
const { setDefData, getDefData } = cardCache;
const { NCUploader, ApproveDetail, PrintOutput, ApprovalTrans } = high;

class List extends Component {
  constructor(props) {
    super(props);
    this.searchId = "search";
    this.tableId = "table";
    this.pageId = "36610CC_L01";
    this.billPK = "pk_protocol";
    this.billNO = "protocolcode";
    this.dataSource = dataSource;
    this.key = key; //缓存相关
    this.submitpk = ""; //提交时，主键
    this.submitindex = ""; //提交时，index
    this.operarea = ""; //提交时，操作区域
    this.innerTs = "";
    this.showLinksce = true; //判断是否是联查
    this.showPk_ntbparadimvo = true; //判断是否是反联查
    this.ntbparadimvo = false; //判断是否是预算反联查
    this.moduleId = moduleId;
    this.state = {
      numvalues: {},
      billID: "", //单据主键
      billNO: "", //单据编码
      billType: "", //单据类型
      showNtbDetail: false, //联查预算
      ntbdata: null, //预算计划数据
      tabDTJ: "(0)",
      tabSPZ: "(0)",
      tabWZX: "(0)",
      tabZZX: "(0)",
      selectedGroup: "0", //是否显示附件框
      showUploader: false, //附件
      defaultSelectGrup: "0", //默认显示全部分组
      outputData: {
        oids: [],
        outputType: "output"
      },
      compositedata: null, //指派信息
      compositedisplay: false, //是否显示指派
      showApprove: false //审批详情
    };
  }

  componentWillMount() {
    let callback = (json, status, inlt) => {
      if (status) {
        this.setState({ json, inlt }, () => {
          this.afterGetLang.call(this, this.props, json);
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

  afterGetLang(props, json) {
    let pk_ntbparadimvo = this.props.getUrlParam("pk_ntbparadimvo");
    let showntbparadimvo = this.props.getUrlParam("showntbparadimvo");
    //被联查交互
    if (this.props.getUrlParam("scene") == "linksce" && !showntbparadimvo) {
      let id = this.props.getUrlParam("id").split(",");
      if (id.length == 1) {
        this.props.pushTo("/card", {
          status: "browse",
          scene: this.props.getUrlParam("scene"),
          appcode: this.props.getUrlParam("appcode"),
          pagecode: this.props.getUrlParam("pagecode"),
          id: this.props.getUrlParam("id")
        });
      } else if (id.length > 1) {
        this.showLinksce = false;
        initTemplate1.call(this, props, () => {
          pageInfoClick1(props, id);
        });
      }
    } else if (pk_ntbparadimvo || showntbparadimvo) {
      //预算反联查单据
      if (showntbparadimvo) {
        initTemplate1.call(this, props, () => {});
        this.ntbparadimvo = true;
        this.showPk_ntbparadimvo = false;
        return;
      }
      this.ntbparadimvo = true;
      this.showPk_ntbparadimvo = false;
      this.listInitData1(props);
    } else {
      initTemplate.call(this, props, json);
    }
  }

  componentDidMount() {
    this.getOIdData(); //加载默认缓存数据
    let numvalues = getDefData(dataSource, "numvalues");
    if (numvalues) {
      this.setState({ numvalues: numvalues });
    }
    let selectedGroup = getDefData(dataSource, "selectedGroup");
    if (selectedGroup) {
      this.setState({ selectedGroup: selectedGroup });
    }
  }

  //查询后判断是多条跳列表还是单条跳卡片
  listInitData1 = props => {
    let pk_ntbparadimvo = props.getUrlParam("pk_ntbparadimvo");
    if (!pk_ntbparadimvo) return;
    let extParam = { pk_ntbparadimvo };
    let data = { pageCode: "36610CCL_Link", extParam };
    ajax({
      url: ACTION_URL.NTBLINK,
      data,
      success: res => {
        if (res && res.data) {
          let { grid } = res.data;
          if (grid && grid["table"].rows.length > 1) {
            initTemplate1.call(this, props, () => {
              this.listInitData(props);
            });
          } else if (grid && grid["table"].rows.length == 1) {
            let pk = grid["table"].rows[0].values.pk_protocol.value;
            props.pushTo("/card", {
              status: "browse",
              id: pk,
              scene: "linksce",
              pagecode: cardPageId
            });
          } else {
            initTemplate1.call(this, props);
          }
        } else {
          initTemplate1.call(this, props);
        }
      }
    });
  };

  //查询多条数据
  listInitData = props => {
    let pk_ntbparadimvo = props.getUrlParam("pk_ntbparadimvo");
    if (!pk_ntbparadimvo) return;
    let pageInfo = JSON.stringify(props.table.getTablePageInfo(this.tableId));
    let extParam = { pk_ntbparadimvo, pageInfo };
    let data = { pageCode: "36610CCL_Link", extParam };
    let { selectedGroup } = this.state;
    const that = this;
    ajax({
      url: ACTION_URL.NTBLINK,
      data,
      success: res => {
        if (res && res.data) {
          console.log(res.data);
          this.updateListView(that, props, res, selectedGroup);
        }
      }
    });
  };

  /**
   * 更新列表视图
   * @param {*} props 页面内置对象
   * @param {*} res 返回数据
   * @param {*} groupKey 选中的分组
   */
  updateListView = (that, props, res, groupKey) => {
    let { grid } = res.data;
    //更新列表数据
    if (grid && grid["table"].rows.length > 1) {
      props.table.setAllTableData("table", grid["table"]);
    } else {
      props.table.setAllTableData("table", { rows: [] });
    }
  };

  //加载默认缓存数据
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
    //查询
    this.setState({ selectedGroup: groupKey }, () => {
      setDefData(dataSource, "selectedGroup", groupKey);
      let groupCondition;
      switch (groupKey) {
        //待提交
        case "0":
          this.setState({ defaultSelectGrup: "0" });
          groupCondition = {
            field: "protocolstatus",
            value: {
              firstvalue: "NOCOMMIT",
              secondvalue: null
            },
            oprtype: "="
          };
          this.getPaginationData(groupCondition);
          break;
        //审批中
        case "1":
          this.setState({ defaultSelectGrup: "1" });
          groupCondition = {
            field: "protocolstatus",
            value: {
              firstvalue: "NOAUDIT",
              secondvalue: null
            },
            oprtype: "="
          };
          this.getPaginationData(groupCondition);
          break;
        //未执行
        case "2":
          this.setState({ defaultSelectGrup: "2" });
          groupCondition = {
            field: "protocolstatus",
            value: {
              firstvalue: "NOEXECUTE",
              secondvalue: null
            },
            oprtype: "="
          };
          this.getPaginationData(groupCondition);
          break;
        //在执行
        case "3":
          this.setState({ defaultSelectGrup: "3" });
          groupCondition = {
            field: "protocolstatus",
            value: {
              firstvalue: "EXECUTING",
              secondvalue: null
            },
            oprtype: "="
          };
          this.getPaginationData(groupCondition);
          break;
        //全部
        case "4":
          this.setState({ defaultSelectGrup: "4" });
          groupCondition = {};
          this.getPaginationData(groupCondition);
          break;
        //默认作为全部处理
        default:
          this.setState({ defaultSelectGrup: "0" });
          groupCondition = {
            field: "protocolstatus",
            value: {
              firstvalue: "NOCOMMIT",
              secondvalue: null
            },
            oprtype: "="
          };
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
    let searchData = {
      querycondition: searchVal,
      custcondition: {
        logic: "and", //逻辑操作符，and、or
        conditions: [groupCondition]
      },
      pageInfo: pageInfo,
      oid: "1001Z61000000000QBJC",
      pageCode: this.pageId,
      queryAreaCode: "search", //查询区编码
      querytype: "tree"
    };
    ajax({
      url: ACTION_URL.QUERY,
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
              WZX:
                data.groupData.WZX == null
                  ? "(0)"
                  : "(" + data.groupData.WZX + ")",
              ZZX:
                data.groupData.ZZX == null
                  ? "(0)"
                  : "(" + data.groupData.ZZX + ")"
            });
            setDefData(dataSource, "numvalues", data.groupData);
          }
        }
      }
    });
  };

  //刷新
  refresh = () => {
    let { selectedGroup } = this.state;
    this.navChangeFun(selectedGroup);
  };

  //输入框
  onChange = e => {
    this.setState({ backxjreason: e });
  };

  //【提交指派】确认
  getAssginUsedr = value => {
    BusinessHeadOperator.call(
      this,
      this.state.json["36610CC-000040"],
      "submit",
      this.props,
      ACTION_URL.SUBMIT,
      this.state.json["36610CC-000002"],
      null,
      null,
      null,
      null,
      value
    ); /* 国际化处理： 提交：,提交成功！*/
  };

  //【提交即指】派取消
  compositeTurnOff = value => {
    this.setState({
      compositedata: null,
      compositedisplay: false
    });
  };

  //【双击某条数据】进入卡片
  onRowDoubleClick = (record, index, props, e) => {
    props.pushTo("/card", {
      status: "browse",
      id: record.pk_protocol.value,
      ntbparadimvo: this.ntbparadimvo, //双击时判断是否是联查
      showBackBtn: true,
      pk_ntbparadimvo: this.props.getUrlParam("pk_ntbparadimvo"),
      pagecode: cardPageId
    });
  };

  render() {
    let numvalues = this.state.numvalues;
    let { table, button, search, BillHeadInfo, socket } = this.props;
    let { createSimpleTable } = table;
    let { NCCreateSearch } = search;
    let { createButtonApp } = button;
    let {
      selectedGroup,
      showUploader,
      billID,
      billNO,
      compositedata,
      compositedisplay
    } = this.state;
    const { createBillHeadInfo } = BillHeadInfo;
    return (
      <div className="nc-bill-list">
        {socket.connectMesg({
          tableAreaCode: this.tableId,
          billpkname: this.billPK,
          billtype: '36X1',
          dataSource: this.dataSource
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
                initShowBackBtn: false
              })}
            </div>
            <div className="header-button-area">
              {createButtonApp({
                area: "list_head",
                buttonLimit: 8,
                onButtonClick: buttonClick.bind(this),
                popContainer: document.querySelector(".header-button-area")
              })}
            </div>
          </NCDiv>
        </NCAffix>
        {this.showLinksce && this.showPk_ntbparadimvo ? (
          <div className="nc-bill-search-area">
            {NCCreateSearch(this.searchId, {
              clickSearchBtn: searchBtnClick.bind(this),
              showAdvBtn: true // 显示高级按钮
            })}
          </div>
        ) : null}
        {this.showLinksce && this.showPk_ntbparadimvo ? (
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
                this.state.json["36610CC-000055"] +
                  " (" +
                  ((numvalues && numvalues.DTJ) || 0) +
                  ")" /* 国际化处理： 待提交 */
              }
            />
            <NCTabPane
              key={"1"}
              tab={
                //审批中
                this.state.json &&
                this.state.json["36610CC-000056"] +
                  " (" +
                  ((numvalues && numvalues.SPZ) || 0) +
                  ")" /* 国际化处理： 审批中*/
              }
            />
            <NCTabPane
              key={"2"}
              tab={
                //未执行
                this.state.json &&
                this.state.json["36610CC-000057"] +
                  " (" +
                  ((numvalues && numvalues.WZX) || 0) +
                  ")" /* 国际化处理： 未执行*/
              }
            />
            <NCTabPane
              key={"3"}
              tab={
                //在执行
                this.state.json &&
                this.state.json["36610CC-000058"] +
                  " (" +
                  ((numvalues && numvalues.ZZX) || 0) +
                  ")" /* 国际化处理： 在执行*/
              }
            />
            <NCTabPane
              key={"4"}
              tab={
                //在执行
                this.state.json &&
                this.state.json["36610CC-000059"] /* 国际化处理： 全部*/
              }
            />
          </NCTabs>
        ) : null}
        <div className="nc-bill-table-area">
          {createSimpleTable(this.tableId, {
            dataSource: this.dataSource,
            pkname: this.billPK,
            componentInitFinished: () => {
              buttonDisable.call(this, this.props, this.tableId);
              //缓存数据赋值成功的钩子函数
              //若初始化数据后需要对数据做修改，可以在这里处理
            },
            handlePageInfoChange: pageInfoClick.bind(this),
            onRowDoubleClick: this.onRowDoubleClick.bind(this),
            onSelected: buttonDisable,
            onSelectedAll: buttonDisable,
            showCheck: true,
            showIndex: true
          })}
        </div>

        {/** 附件 **/}
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
        {/* 审批意见 */}
        <ApproveDetail
          show={this.state.showApprove}
          close={() => {
            this.setState({
              showApprove: false
            });
          }}
          billtype={this.state.billType}
          billid={this.state.billID}
        />
        {compositedisplay && (
          <ApprovalTrans
            title={this.state.json["36610CC-000020"]} /* 国际化处理： 指派*/
            data={compositedata}
            display={compositedisplay}
            getResult={this.getAssginUsedr}
            cancel={this.compositeTurnOff}
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

List = createPage({
  billinfo: {
    billtype: "grid",
    pagecode: "",
    bodycode: ""
  },
  mutiLangCode: "36610CC"
})(List);

export default List;

//bLkXFuKw3KUaZeb8Dj31ZaBen3AhHupyk38WaLTweA8=