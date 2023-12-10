//sQld1OaD34tZblwSuoZXp+Xcd1rdaL9z/xmWCum54US2EBG0/K3QNJl+53D27VYK
import { tabs, btnLimit } from '../../constant/constant.js';
import tableButtonClick from './tableButtonClick';

export default function(props, callback) {
	let that = this;
	props.createUIDom(
		{
			pagecode: '36610CCAP_C01'
		},
		function(data) {
			if (data) {
				if (data.template) {
					let meta = data.template;
					meta = modifierMeta.call(that, meta, props);
					props.meta.renderTabs(
						meta,
						[ 'table_detail', 'table_guarantee' ],
						[ 'table_detail', 'table_guarantee' ],
						() => {
							callback && callback();
						}
					);
				}
				if (data.button) {
					let button = data.button;
					props.button.setButtons(button);
				}
			}
		}
	);
}

function modifierMeta(meta, props) {
	for (let item of Object.keys(meta.gridrelation)) {
		meta[item].items.push({
			attrcode: 'opr',
			label: '操作',
			itemtype: 'customer',
			fixed: 'right',
			className: 'table-opr',
			visible: true,
			width: '210px',
			render: (text, record, index) => {
				let { isPaste } = this.state;
				let status = props.getUrlParam('status');
				let buttonAry = [];
				if ([ 'add', 'edit', 'change' ].includes(status)) {
					//编辑态
					buttonAry = isPaste ? [ 'copyThisRow' ] : [ 'cela', 'copy', 'insert', 'delete' ];
				} else {
					//浏览态
					buttonAry = [ record.expandRowStatus ? 'fold' : 'unfold' ];
				}

				return this.props.button.createOprationButton(buttonAry, {
					area: tabs.bodyCode,
					buttonLimit: btnLimit,
					onButtonClick: (props, key) => tableButtonClick.call(this, props, key, text, record, index)
				});
			}
		});
	}
	return meta;
}

//sQld1OaD34tZblwSuoZXp+Xcd1rdaL9z/xmWCum54US2EBG0/K3QNJl+53D27VYK