//bLkXFuKw3KUaZeb8Dj31ZaBen3AhHupyk38WaLTweA8=
import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { SimpleReport } from 'nc-report'
import { ajax, toast,cacheTools } from 'nc-lightapp-front';
import { drillToBill } from '../../../../tmpub/report/query/DrillUtil';


export default class Test extends Component {
  constructor (props) {
    super(props)
    this.state = {}
  }

  disposeSearch (meta, props) {
    //开户组织跨集团
    // meta['light_report'].items.find((e) => e.attrcode == 'pk_ownerorg').isShowUnit =true;
    // meta['light_report'].items.find((e) => e.attrcode == 'pk_org').refName ='资金组织';
    // 参照过滤
    
  }
  /**
   * 
   * @param  items: 查询区查询数据，如需拓展查询区参数，请返回与items相同格式的查询数据
   */
  expandSearchVal (items) {
    // 变量赋值拓展
    console.log(items)
    if (items.length > 0) {
      items.forEach(item => {
        if (item.field == 'user_name') { // 需要进行拓展的变量
          if (item.value.firstvalue == '11') {
            let obj = {  //obj对象内oprtype为between时firstvalue,secondvalue都有值，其他情况只有firstvalue有值
              field: 'user_other',
              oprtype: 'like',
              value: {firstvalue: '111', secondvalue: '222'}
            }
            items.push(obj)
          }
        }
      })
    }
    return items
  }

   

  render () {
    return (
      <div className='table'>
        <SimpleReport showAdvBtn={true} 
        expandSearchVal={this.expandSearchVal.bind(this)} 
        disposeSearch={this.disposeSearch.bind(this)} 
        setConnectionSearch={this.setConnectionSearch.bind(this)} 
        />
      </div>
    )
  }

  setConnectionSearch(transSaveObject, obj, data, props, url, urlParams, sessonKey) {
    if (obj.key == 'linkbill') {
      drillToBill(props, data, 'pk_sourcebill','billtype');
    }
  }

}

ReactDOM.render(<Test/>,document.getElementById('app'))


//bLkXFuKw3KUaZeb8Dj31ZaBen3AhHupyk38WaLTweA8=