//rvMaxP4BMzESXminCdtHHIKcs3epO/mtVk0NFT1NwrVryy8ZqojfTzT/vzKWgmCl
import { ajax } from "nc-lightapp-front";
import { getData } from "../card/events/page";
import { ACTION_URL,cardPageId } from "../constant/constant";
/**
 * 联查版本
 *
 * @param {*} props
 * @param {*} key
 */
export default function versionClick(key) {
  if (key == "card") {
    this.props.setUrlParam({
      pageType: "version",
      backType: "card"
    });
    initVersionTree.call(this);
  } else if (key == "list") {
    let selectData = props.table.getCheckedRows(this.tableId);
    let pk = selectData[0].data.values.pk_protocol.value;
    this.props.pushTo("/card", {
      status: "browse",
      pageType: "version",
      id: pk,
      pagecode: this.pageId
    });
  }
}

function initVersionTree() {
  const treeRoot = {
    isleaf: false,
    pid: "__root__",
    refname: this.state.json["36610CC-000003"] /* 国际化处理： 版本号*/,
    refpk: "-1"
  };
  ajax({
    url: ACTION_URL.LISTVERSION,
    data: {
      queryAreaCode: "search",
      querytype: "tree",
      querycondition: {},
      pageCode: this.pageId,
      pageInfo: {
        pageIndex: 0,
        pageSize: "100"
      },
      def1: this.props.getUrlParam("id") //主键
    },
    success: res => {
      let { success, data } = res;
      if (success) {
        let treeData = this.props.syncTree.createTreeData(data.data.rows);
        let newestVersion,
          maxVer = 0;
        for (let i = 0; i < treeData.length; i++) {
          if (maxVer < treeData[i].versionno) {
            maxVer = treeData[i].versionno;
            newestVersion = treeData[i].refpk;
          }
        }
        this.setState(
          {
            newestVersion: newestVersion,
            isVersion: true
          },
          () => {
            this.props.syncTree.setSyncTreeData(this.treeId, [
              Object.assign(treeRoot, {
                children: treeData
              })
            ]);
            this.props.syncTree.setNodeSelected(this.treeId, newestVersion);
            getData.call(this);
          }
        );
      }
    }
  });
}

//rvMaxP4BMzESXminCdtHHIKcs3epO/mtVk0NFT1NwrVryy8ZqojfTzT/vzKWgmCl