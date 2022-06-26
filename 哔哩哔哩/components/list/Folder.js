const resource_list = require("../API/resource_list");

module.exports = {
    type: 'list',
    async fetch({args, page}) {
        this.searchRoute = $route('search/search_folders', args)
        page = page || 1;
        var list = await resource_list(page, args.id, "", order, cookie);
        var data = []
        if (list && list.medias!=null) {
            list.medias.forEach(m => {
                data.push({
                    style: 'live',
                    author: {
                        name: m.upper.name,
                        avatar: m.upper.face
                    },
                    label: formateTimeStamp(m.fav_time*1000),
                    title: m.title,
                    image: m.cover,
                    viewerCount: m.cnt_info.play,
                    route: $route(`bilibili://video/${m.bvid}`),
                    onLongClick: async () => {
                        let selected = await $input.select({
                            title: 'UP视频排列顺序',
                            options: [
                                {value: 'pubdate', title: '最新发布: pubdate'},
                                {value: 'click', title: '最多播放: click'},
                                {value: 'stow', title: '最多收藏: stow'}
                            ]
                        })
                        if (selected != null) {
                            $router.to($route('list/space_video', {
                                mid: m.upper.mid, order: selected.value
                            }))
                        }
                    }
                })
            })
            if (list.has_more) {
                return {
                    nextPage: page + 1,
                    items: data
                }
            } else {
                return data;
            }
        } else {
            return [{
                style: 'article',
                title: '警告',
                summary: `当前收藏夹没有任何内容（或 加载失败）`
            }]
        }
    },
    beforeCreate() {
        getCookie();
    }
}