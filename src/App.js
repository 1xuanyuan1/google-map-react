import React, { Component } from 'react';
import './App.css';
import api from './service/index'
import ls from 'store2'
import { dateFormat } from './utils/index'
const uluru = {lat: 31.2290321101789, lng: 121.47705713623051};

class App extends Component {
  state = {
    list: [],
    sortData: [],
    keyword: ''
  }

  showPop = ({infowindow, map, marker} = {}) => {
    return function () {
      infowindow.open(map, marker)
    }
  }

  closePop = (infowindow) => {
    return function () {
      infowindow.close()
    }
  }
  componentDidMount() {
    let map;
    if (window.google) {
      map = new window.google.maps.Map(document.getElementById('map'), {
        zoom: 15,
        center: uluru
      });
    }

    let param = {
      client_id: 'QIB3D1FKYSJMA0WBL0KUSDDGWXD32H1UJOD3CFW5S5BLO1Z3',
      client_secret: '5F5FBMPPEOL0QZYF5HNP4XXE2CN2DFTQQETM5MC00BNYK5UX',
      ll: `${uluru.lat},${uluru.lng}`,
      v: dateFormat('yyyyMMdd'),
      radius: 1000,
      limit: 100
    }
    // venues/search
    // venues/explore
    api.get('search/recommendations', param).then(res => {
      let list = res.response.group.results
      ls.set('list', list)
      if (window.google) {
        list.map(item => {
          let {lat, lng} = item.venue.location
            const marker = new window.google.maps.Marker({
              position: new window.google.maps.LatLng(lat, lng),
              map: map
            });
            const infowindow = new window.google.maps.InfoWindow({
              content: `<div class="pop">
                          ${item.photo?`
                          <div class="pop-left">
                            <img class="pop-img" src="${item.photo.prefix}48x48${item.photo.suffix}" />
                          </div>`:''}
                          <div class="pop-right">
                            <div class="pop-name">${item.venue.name}</div>
                            <div class="pop-address">${item.venue.location.address}${item.venue.location.crossStreet?`(${item.venue.location.crossStreet})`:''},${item.venue.location.state}</div>
                            ${item.venue.categories?`
                            <div class="pop-categorie">${item.venue.categories[0].name}</div>`:''}
                          </div>
                        </div>
                  `
            });
            item.showPop = this.showPop({infowindow, map, marker})
            item.closePop = this.closePop(infowindow)
            marker.addListener('mouseover', item.showPop);
            marker.addListener('mouseout', item.closePop);
          return item
        });
      }
      this.setState({
        list,
        sortData: list
      })
    }).catch(e => {
      let list = ls.get('list') || []
      console.log('error')
      this.setState({
        list,
        sortData: list
      })
    })
  }
  changeKeyword = (keyword) => {
    this.setState((state) => {
      let sortData = state.list.filter(item => item.venue.name.toLocaleUpperCase().indexOf(keyword.toLocaleUpperCase()) > -1)
      return {
        sortData
      }
    })
  }
  /**
   * 搜索按钮其实已经失去了应有的意义 (~_~)
   */
  toSearch = () => {
    console.log(this.state.keyword)
  }
  render() {
    return (
      <div className="App">
        <div className="left">
          <div className="input-box">
            <input placeholder="请输入你要筛选的字" defaultValue={this.state.keyword} onChange={(e) => this.changeKeyword(e.target.value)}/>
            <button onClick={this.toSearch}>搜索</button>
          </div>
          <div className="list">
            <ul>
              {this.state.sortData.map((item, index) => (
                <li 
                  key={item.id} 
                  onMouseEnter={item.showPop} 
                  onMouseLeave={item.closePop}>
                  <div className="num">{index + 1}.</div>
                  <div className="content">
                    <h2 className="title">{item.venue.name}</h2>
                    <h3 className="address">{item.venue.location.address}{item.venue.location.crossStreet?`(${item.venue.location.crossStreet})`:''},{item.venue.location.state}</h3>
                    {
                      item.venue.categories?
                      <h3 className="categorie">
                        <img className="categorie-icon" alt="" src={`${item.venue.categories[0].icon.prefix}32${item.venue.categories[0].icon.suffix}`}/>
                        {item.venue.categories[0].name}
                      </h3>
                      :''
                    }
                  </div>
                  { item.photo ?
                    <img className="image" src={`${item.photo.prefix}300x300${item.photo.suffix}`} alt={item.venue.name}/> : ''
                  }
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="right">
          <div id="map" role="application"></div>
        </div>
      </div>
    );
  }
}

export default App;
