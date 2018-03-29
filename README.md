# 谷歌地图应用

该项目使用create-react-app脚手架初始化的应用。
用到了google地图以及foursquare接口，初始化的时候会默认搜索上海周边的100个推荐的店铺，包含各种类型，
可以根据输入的内容筛选出名字中包含`输入字`的店铺(英文不区分大小写)。


# 备注

## 需要能翻墙

测试在不翻墙的情况下 加载不了谷歌地图的JS文件

## 自适应

主要是通过flex布局来实现, 再通过媒体查询以宽度1024为界限，展现有两种显示效果。

ps.pad 横竖屏两个效果

## foursquare接口

https://api.foursquare.com/v2/search/recommendations

获取推荐的信息

## 异步 API 请求

异步 API 请求本工程使用的是axios，而不是fetch。功能类似，axios功能更强大~~

## Service Worker

本项目中的Service Worker是 create-react-app 脚手架自动生成的。在使用的过程的发现数据是通过foursquare接口获取到的。

在offline环境下，界面基本空白，虽然界面能打开，但是体验并不好。

做了如下优化:
  引入store2，将成功返回的数据缓存起来。在一次成功之后，之后若接口错误，则使用之前缓存的数据。

### store.js

[store.js](https://github.com/marcuswestin/store.js) 是一个实现了浏览器的本地存储的 JavaScript 封装 API,会根据浏览器自动选择使用 localStorage、globalStorage 或者 userData 来实现本地存储功能。本项目使用的是stroe.js的第二个版本。

### 使用条件
Service Worker只能在`process.env.NODE_ENV === 'production'`下使用,需要 build 之后，使用serve起一个本地服务器，才能看到效果。
当然放在https域名下的线上环境也是可以的。

```
yarn global add serve
serve -s build
```