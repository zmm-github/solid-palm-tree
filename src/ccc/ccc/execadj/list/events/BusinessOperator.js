//cmiYx0pAPEwnseRzxuPOzqlz4vt6nQ5aaOkz2AhAV2+m8oh5yl965lbtYUvsduv5
import { toast, ajax } from 'nc-lightapp-front';
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
export const BusinessHeadOperator = function(
	that,
	opername,
	opercode,
	props,
	pageCode,
	tableCode,
	pkName,
	url,
	successMess,
	datasource,
	showTBB,
	extParam,
	callback,
	submitdata
) {
	let selectDatas = props.table.getCheckedRows(tableCode);
	let pks = [];
	let pkMapTs = new Map();
	let pkMapRowIndex = new Map();
	let pk, ts;
	if (!extParam) {
		extParam = {};
	}
	let index = 0;
	while (index < selectDatas.length) {
		//获取行主键值
		pk =
			selectDatas[index] &&
			selectDatas[index].data &&
			selectDatas[index].data.values &&
			selectDatas[index].data.values[pkName] &&
			selectDatas[index].data.values[pkName].value;
		//获取行ts时间戳
		ts =
			selectDatas[index] &&
			selectDatas[index].data &&
			selectDatas[index].data.values &&
			selectDatas[index].data.values.ts &&
			selectDatas[index].data.values.ts.value;
		//主键与行号Map
		pkMapRowIndex.set(pk, selectDatas[index].index);
		//主键与tsMap
		if (pk && ts) {
			pkMapTs.set(pk, ts);
		}
		pks.push(pk);
		index++;
	}
	let data;
	if (selectDatas.length == 0) {
		pkMapTs.set(that.submitpk, that.innerTs);
		data = {
			pkMapTs,
			pageCode,
			extParam
		};
	} else {
		data = {
			pks,
			pkMapTs,
			pageCode,
			extParam
		};
	}
	//如果有指派数据，存到userObj
	if (opercode == 'Commit') {
		if (pk == undefined) {
			pk = that.submitpk;
		}
		if (submitdata) {
			let usedata = {
				pkMapTs,
				pageCode: pageCode,
				pks: [ pk ]
			};
			usedata.userObj = submitdata;
			data = usedata;
		}
	}
	ajax({
		url,
		data: data,
		success: (res) => {
			let result;
			let deleteRowIndexArr = [];
			let deleteRowPksArr = [];
			if (res.data && res.data.billCards && res.data.billCards) {
				result = res.data.billCards;
			}
			if (opercode == 'Commit') {
				//提交即指派
				console.log(res.data);
				if (
					res.data.returnMsg &&
					res.data.returnMsg.workflow &&
					(res.data.returnMsg.workflow == 'approveflow' || res.data.returnMsg.workflow == 'workflow')
				) {
					that.setState({
						compositedata: res.data.returnMsg,
						compositedisplay: true,
						pk: pk
					});
				} else {
					that.setState({
						compositedata: null,
						compositedisplay: false
					});
					if (res.data.status == '0' || res.data.status == '2') {
						if (result) {
							result.forEach((vale) => {
								if (vale.head[tableCode]) {
									let pk = vale.head[tableCode].rows[0].values.pk_execadj.value;
									let index = pkMapRowIndex.get(pk);
									if (index == undefined) {
										index = that.submitindex;
									}
									let updateDataArr = [
										{
											index: index,
											data: { values: vale.head[tableCode].rows[0].values }
										}
									];
									props.table.updateDataByIndexs(tableCode, updateDataArr);
								}
							});
						}
					}
				}
			} else if (opercode == 'Delete') {
				if (res.data.status == '0') {
					//全部成功
					for (let key of pkMapRowIndex.keys()) {
						deleteRowPksArr.push(key);
					}
					for (let value of pkMapRowIndex.values()) {
						deleteRowIndexArr.push(value);
					}
				} else if (res.data.status == '2') {
					//部分失败
					if (result) {
						result.forEach((vale) => {
							let pk = vale.head[tableCode].rows[0].values.pk_execadj.value;
							deleteRowPksArr.push(pk);
							let index = pkMapRowIndex.get(pk);
							deleteRowIndexArr.push(index);
						});
					}
				}
				props.table.deleteCacheId(tableCode, deleteRowPksArr);
				props.table.deleteTableRowsByIndex(tableCode, deleteRowIndexArr);
			} else {
				if (res.data.status == '0' || res.data.status == '2') {
					if (result) {
						result.forEach((vale) => {
							let pk = vale.head[tableCode].rows[0].values.pk_execadj.value;
							let updateDataArr = [
								{
									index: pkMapRowIndex.get(pk),
									data: { values: vale.head[tableCode].rows[0].values }
								}
							];
							props.table.updateDataByIndexs(tableCode, updateDataArr);
						});
					}
				}
			}
			PromptMessage.call(that,res, opername);
		}
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
 **/
export const BusinessInnerOperator = function(
	that,
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
	let pk = record.pk_execadj.value;
	let ts = record.ts.value;
	let pkMapTs = new Map();
	pkMapTs.set(pk, ts);
	let pks = [];
	pks.push(pk);
	that.submitpk = pk;
	that.submitindex = index;
	that.operarea = 'inner';
	let pdata = { pkMapTs: pkMapTs, pks: pks, pageCode: pageCode , actionArea: "inner"};
	if (!pk) {
		pk = this.state.pk;
	}
	ajax({
		url,
		data: pdata,
		success: (res) => {
			if (opercode == 'commit') {
				//提交即指派
				if (
					res.data.returnMsg &&
					res.data.returnMsg.workflow &&
					(res.data.returnMsg.workflow == 'approveflow' || res.data.returnMsg.workflow == 'workflow')
				) {
					that.setState({
						compositedata: res.data.returnMsg,
						compositedisplay: true,
						pk: pk
					});
				} else {
					that.setState({
						compositedata: null,
						compositedisplay: false
					});
					console.log(res.data);
					let updateDataArr = [
						{
							index: index,
							data: { values: res.data.billCards[0].head[tableCode].rows[0].values }
						}
					];
					props.table.updateDataByIndexs(tableCode, updateDataArr);
					toast({ color: 'success', content: successMess });
				}
			} else if (opercode == 'delete') {
				//删除时，删除前台数据
				if (res.data.status == '0') {
					props.table.deleteCacheId(tableCode, pk);
					props.table.deleteTableRowsByIndex(tableCode, index);
					toast({ color: 'success', content: successMess });
				}
			} else {
				if (res.data.status == '0' || res.data.status == '2') {
					let updateDataArr = [
						{
							index: index,
							data: { values: res.data.billCards[0].head[tableCode].rows[0].values }
						}
					];
					props.table.updateDataByIndexs(tableCode, updateDataArr);
					toast({ color: 'success', content: successMess });
				} else {
					toast({ color: 'warning', content: res.data.errormessages && res.data.errormessages[0] });
				}
			}
		}
	});
};

function PromptMessage(res, opername) {
	let { status, msg } = res.data;
	let content;
	let total = res.data.total;
	let successNum = res.data.successNum;
	let failNum = res.data.failNum;
	content =
		this.state.json['36610CCA-000020'] + opername + total + this.state.json['36610CCA-000021']; /* 国际化处理： 共,条，*/
	content =
		content +
		this.state.json['36610CCA-000022'] +
		successNum +
		this.state.json['36610CCA-000023']; /* 国际化处理： 成功,条 ,*/
	content =
		content + this.state.json['36610CCA-000024'] + failNum + this.state.json['36610CCA-000025']; /* 国际化处理： 失败,条*/
	let errMsgArr = res.data.errormessages;
	//全部成功
	if (status == 0) {
		toast({
			color: 'success',
			title: opername + msg,
			content: content,
			TextArr: [
				this.state.json['36610CCA-000026'],
				this.state.json['36610CCA-000027'],
				this.state.json['36610CCA-000028']
			] /* 国际化处理： 展开,收起,关闭*/,
			groupOperation: true
		});
	} else if (status == 1) {
		//全部失败
		toast({
			duration: 'infinity',
			color: 'danger',
			title: opername + msg,
			content: content,
			TextArr: [
				this.state.json['36610CCA-000026'],
				this.state.json['36610CCA-000027'],
				this.state.json['36610CCA-000028']
			] /* 国际化处理： 展开,收起,关闭*/,
			groupOperation: true,
			groupOperationMsg: errMsgArr
		});
	} else if (status == 2) {
		//部分成功
		toast({
			duration: 'infinity',
			color: 'danger',
			title: opername + msg,
			content: content,
			TextArr: [
				this.state.json['36610CCA-000026'],
				this.state.json['36610CCA-000027'],
				this.state.json['36610CCA-000028']
			] /* 国际化处理： 展开,收起,关闭*/,
			groupOperation: true,
			groupOperationMsg: errMsgArr
		});
	}
}

//cmiYx0pAPEwnseRzxuPOzqlz4vt6nQ5aaOkz2AhAV2+m8oh5yl965lbtYUvsduv5