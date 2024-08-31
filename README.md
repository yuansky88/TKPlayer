# TKPlayer

*V 1.0.0 Alpha 测试版*

[[中文文档](https://api.cnsoft.top/tkplayer/doc)]   [[项目演示](https://api.cnsoft.top/tkplayer/demo/)]

## 简介

这是一个可以为你的博客、前端静态项目添加的音乐播放器，并且使用方法极其简单，不到一分钟就可以完成添加，就和Jquery组件一样添加到项目即可。其主要是为了Typecho博客主题写的一个组件，但是想到其他静态项目也可以像这样添加并且使用，互联网上的H5播放器又太复杂，而且不照顾我们这些~~不使用Vue和npm包管理器~~ ( 不会使用 ) 的，因此开源出来，供大家使用。

⚠️暂时只适配了电脑端，手机端的后面有需求也将会适配。



## 功能

**显示歌曲信息**

直接写一个 `<audio>` 标签不会显示歌曲信息，而TKPlayer会显示歌曲信息，例如歌曲名称、作曲家。

**暂停/播放**

这个也是常用的功能，没有一个播放器不能做的功能。

**上一曲/下一曲**

这也是相对于`<audio>`标签没有的功能，当你配置多个歌曲时，你可以使用上一曲/下一曲切歌。

**显示播放时长**

提供进度条和数字显示的方式，你可以很轻松的知道播放时长，和当前播放的位置。

**调整播放进度**

你可以将鼠标放到进度条上，当进度条变宽，你可以点击你想播放的位置，随意调整播放进度。

**双击封面关闭**

当我们不想播放音乐了，想关闭播放器，双击封面图片即可关闭。



## 安装

#### 通过本地项目安装

你需要将css文件引入到 `<link>` 标签，并且在`<head>` 标签内，为了避免样式覆盖，请将 `<link>` 标签放在最下方，其次就是将`TKPlayer.js` 引入到`<script>` 标签，并且在`<body>` 标签内。你大致的格式如下: 

```HTML
<html>
	<head>
    	...其他的link标签...
        <link rel="stylesheet" href="./TKPlayer.css">
	</head>
    <body>
        ...上方的dom元素以及一些script标签...
        <script src="./TKPlayer.js"></script>
    </body>
</html>
```



#### 通过CDN安装

通过CDN安装的方法几乎和上面一样，你只需要把这个文件地址更换为CDN地址就行。

```HTML
<!-- 引入css -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/yuansky88/TKPlayer@1.0.0-alpha/dist/css/tkplayer.min.css">

<!-- 引入js -->
<script src="https://cdn.jsdelivr.net/gh/yuansky88/TKPlayer@1.0.0-alpha/dist/js/tkplayer.min.js"></script>
```



## 启动

安装好本项目后，需要手动启动播放器，我们需要在引入文件的`script` 标签下边新建一个script标签来进行配置启动信息。

```html
<script src="./TKPlayer.js"></script>
<script>
    // 在这里填写配置信息
    TKPlayer.source_list([
        {
            name: "Once Upon a Time", // 歌曲名称
            author: "Max Oazo/Moonessa", // 歌曲作者
            cover: "./res/cover/03.jpg", // 歌曲封面
            src: "./res/audio/03.mp3" // 歌曲文件链接
        }
    ]);
    // 音乐源配置完成后，启动播放器
    TKPlayer.start(false); // 填入参数为false代表为主动源启动，而上面我们主动提供了
</script>
```

**更多启动方法说明:**

如果你像上面一样，为播放器主动提供了播放源，你可以使用如下启动方式来进行主动源启动: 

```js
 TKPlayer.start(false);
```

如果你只有一首歌曲需要播放，就无需配置`source_list` ，直接在start函数内配置播放信息即可:

```js
TKPlayer.start({
    name: "Once Upon a Time", // 歌曲名称
    author: "Max Oazo/Moonessa", // 歌曲作者
    cover: "./res/cover/03.jpg", // 歌曲封面
    src: "./res/audio/03.mp3" // 歌曲文件链接
});
```

实在没辙了，这里你可以不用配置任何信息，这里将会为你推荐一首歌曲:

```js
 TKPlayer.start();
```

推荐服务器也是我写的一个项目，但是不到多久会挂掉，建议自己写配置信息，不过你也可以修改源代码，修改为你的推荐服务器。
