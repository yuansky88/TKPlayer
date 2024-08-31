const TKPlayer = {
	elm: null,
	audio_elm: null,
	panel_elm_name: null,
	panel_elm_author: null,
	panel_elm_cover: null,
	play_button: null,
	progress_selector: null,
	progress_bar: null,
	progress_base: null,
	time_bar: null,
	recommend_source: "https://api.cnsoft.top/tkplayer/",
	music_info: {
		name: null,
		author: null,
		src: null,
		cover: null,
	},
	max_song: null,
	now_song: null,
	is_single: false,
	music_list: null,

	// 初始化信息状态
	init() {
		this.audio_elm.addEventListener("timeupdate", this.sync_progress_bar.bind(this));
		this.audio_elm.addEventListener("loadedmetadata", this.output_time_text.bind(this));
		this.progress_base.addEventListener("click", (event) => this.compute_progress(event));
		this.panel_elm_cover.addEventListener("dblclick", this.close_player.bind(this));
	},

	// 获取播放状态
	is_paused() {
		return !this.audio_elm.paused;
	},

	// 动态加载启动
	start(args) {
		if (typeof args == "object" && !Array.isArray(args)) {
			this.is_single = true;
			this.inject_info(args);
			// 信息注入完成后，启动音乐播放器
			this.startMusicPlayer();
		} else if (Array.isArray(args)) {
			this.is_single = false;
			this.source_list(args);
			// 信息注入完成后，启动音乐播放器
			this.startMusicPlayer();
		} else if (args == false) {
			console.log("你选择了主动源启动，请注意是否提前准确地提供了资源列表~");
			// 信息注入完成后，启动音乐播放器
			this.startMusicPlayer();
		} else {
			console.log("你启动播放器尚未提供任何参数，这里为你主动推荐一首歌曲~");
			// 异步请求这里就使用异步函数
			this.is_single = true;
			this.get_recommend_data()
				.then((info) => {
					this.inject_info(info);
					this.startMusicPlayer(); // 在这里启动播放器
				})
				.catch((error) => {
					console.error("获取推荐数据出错");
					alert("推荐源可能失效！");
				});
		}
	},

	// 播放和暂停音乐
	play() {
		this.change_play_icon();
		if (!this.is_paused()) {
			this.audio_elm.play().catch((error) => {
				alert("媒体解析失效，你提供的资源列表有问题！");
			});
		} else {
			this.audio_elm.pause();
		}
	},

	// 下一曲
	next() {
		if (this.is_single) {
			this.change_music();
			this.play();
		} else {
			if (this.now_song == this.max_song - 1) {
				this.now_song = 0;
				this.inject_info(this.music_list[this.now_song]);
				this.change_music();
				this.play();
			} else {
				this.now_song++;
				this.inject_info(this.music_list[this.now_song]);
				this.change_music();
				this.play();
			}
		}
	},

	// 上一曲
	prev() {
		if (this.is_single) {
			this.change_music();
			this.play();
		} else {
			if (this.now_song <= 0) {
				this.now_song = this.max_song - 1;
				this.inject_info(this.music_list[this.now_song]);
				this.change_music();
				this.play();
			} else {
				this.now_song--;
				this.inject_info(this.music_list[this.now_song]);
				this.change_music();
				this.play();
			}
		}
	},

	// 获取歌曲时长
	get_allTime() {
		return this.audio_elm.duration;
	},

	// 获取当前时长
	get_currentTime() {
		return this.audio_elm.currentTime;
	},

	// 时长转换分秒
	translate_time(time) {
		let time_single = Math.ceil(time);
		let minute = Math.floor(time_single / 60);
		let secend = time_single % 60;
		return (minute < 10 ? "0" + minute : minute) + ":" + (secend < 10 ? "0" + secend : secend);
	},

	// 输出文本时间进度
	output_time_text() {
		this.time_bar.innerText = this.translate_time(this.get_currentTime()) + "/" + this.translate_time(this.get_allTime());
	},

	// 改变播放按钮图标
	change_play_icon() {
		this.play_button.setAttribute("class", this.is_paused() ? "icon-play" : "icon-pause");
	},

	// 同步进度条长度
	sync_progress_bar() {
		this.progress_bar.style.width = (this.get_currentTime() / this.get_allTime()) * 100 + "%";
		this.output_time_text();
		if (this.get_allTime() == this.get_currentTime()) {
			this.play_button.setAttribute("class", "icon-play");
		}
	},

	// 计算转换进度条进度
	compute_progress(event) {
		let all_Width = this.progress_base.offsetWidth;
		let offset = event.offsetX;
		let percent = offset / all_Width;
		if (isNaN(this.get_allTime())) {
			console.log("歌曲文件损坏，无法获取总时长！");
			return false;
		} else {
			newTime = this.get_allTime() * percent;
			this.change_duration(newTime);
		}
	},

	// 手动修改进度
	change_duration(newTime) {
		this.audio_elm.currentTime = newTime;
	},

	// 切换音乐
	change_music() {
		this.change_duration(0);
		this.sync_progress_bar();
		this.audio_elm.paused = false;
		this.play_button.setAttribute("class", "icon-play");
		this.panel_elm_name.innerText = this.music_info.name;
		this.panel_elm_author.innerText = this.music_info.author;
		this.panel_elm_cover.setAttribute("src", this.music_info.cover);
		this.audio_elm.setAttribute("src", this.music_info.src);
	},

	// 启动音乐播放器
	startMusicPlayer() {
		// 将模板写入到DOM中
		if (!document.getElementById("player")) {
			document.querySelector("body").innerHTML += `
      <div class="player" id="player">
        <div class="panel">
          <div class="media-info">
            <div class="title">${this.music_info.name}</div>
            <div class="author">${this.music_info.author}</div>
            <div class="controller">
              <span class="icon-backward" title="上一曲" onclick="TKPlayer.prev()"></span>
              <span class="icon-play" id="play-button" onclick="TKPlayer.play()" title="播放/暂停"></span>
              <span class="icon-forward" title="下一曲" onclick="TKPlayer.next()"></span>
            </div>
          </div>
          <div class="progress">
            <div class="duration">00:00/**:**</div>
            <div class="progress-bar" id="progress-bar"></div>
          </div>
        </div>
        <div class="cover">
          <img src="${this.music_info.cover}" alt="cover">
        </div>
        <audio src="${this.music_info.src}" id="audio"></audio>
      </div>
  	`;
		} else {
			alert("你已经创建播放器啦，无需再次创建哦！");
		}

		// 初始化元素
		TKPlayer.elm = document.querySelector("#player");
		TKPlayer.audio_elm = document.querySelector("#player #audio");
		TKPlayer.play_button = document.querySelector("#player #play-button");
		TKPlayer.progress_selector = document.querySelector("#player .progress");
		TKPlayer.progress_bar = document.querySelector("#player #progress-bar");
		TKPlayer.progress_base = document.querySelector("#player .progress");
		TKPlayer.time_bar = document.querySelector("#player .progress .duration");
		TKPlayer.panel_elm_name = document.querySelector("#player .title");
		TKPlayer.panel_elm_author = document.querySelector("#player .author");
		TKPlayer.panel_elm_cover = document.querySelector("#player .cover img");

		// 初始化Player
		TKPlayer.init();
	},

	// 注入信息
	inject_info(info) {
		if (info.cover && info.src) {
			this.music_info = {
				name: info.name || "未命名歌曲",
				author: info.author || "未命名作者",
				cover: info.cover,
				src: info.src,
			};
		} else {
			console.log("歌曲信息失效！");
		}
	},

	// 处理资源列表
	source_list(info) {
		console.log("正在注入灵魂中~");
		this.is_single = false;
		this.music_list = info;
		this.max_song = info.length;
		this.now_song = 0;
		this.music_info = info[this.now_song];
	},

	// 关闭播放器
	close_player() {
		let app = this.elm;
		let parent = app.parentNode;
		parent.removeChild(app);
	},

	// 获取推荐数据(异步)
	get_recommend_data() {
		let recommend_source = this.recommend_source;
		return new Promise((resolve, reject) => {
			const xhr = new XMLHttpRequest();
			xhr.open("GET", recommend_source, true);
			xhr.onerror = () => reject(new Error("请求出现错误"));
			xhr.onload = () => {
				if (xhr.status === 200) {
					resolve(JSON.parse(xhr.responseText));
				} else {
					reject(new Error("请求失败: " + xhr.status));
				}
			};
			xhr.send();
		});
	},
};
