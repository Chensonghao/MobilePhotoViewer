(function() {
    //所有的数据
    var photos = [{
        height: 950,
        width: 800,
        src: "imgs/1.jpg"
    }, {
        height: 1187,
        width: 900,
        src: "imgs/2.jpg"
    }, {
        height: 766,
        width: 980,
        src: "imgs/3.jpg"
    }, {
        height: 754,
        width: 980,
        src: "imgs/4.jpg"
    }, {
        height: 493,
        src: "imgs/5.jpg",
        width: 750
    }, {
        height: 500,
        src: "imgs/6.jpg",
        width: 750
    }, {
        height: 600,
        src: "imgs/7.jpg",
        width: 400
    }];

    function PhotoGallery(opts) {
        //容器元素
        this.container = opts.container;
        //照片集合
        this.photos = opts.photos;
        //窗口宽度
        this.pageWidth = window.innerWidth;
        //窗口高度
        this.pageHeight = window.innerHeight;
        //窗口分辨率
        this.resolution = this.pageHeight / this.pageWidth;
        //当前照片的索引
        this.idx = 0;
        if (this.photos && this.photos.length > 0) {
            this.ul = document.createElement('ul');
            this.container.appendChild(this.ul);
            this._render(0);
            this._bind();
        }
    }
    // 根据数据渲染DOM
    PhotoGallery.prototype._render = function(lislen) {
        var idx = this.idx,
            start = lislen,
            end = lislen;
        if (idx === 0) {
            start = 0;
            end = 1;
        }
        for (var i = start; i <= end; i++) {
            var photo = this.photos[i];
            if (photo) {
                var li = document.createElement('li');
                li.style.webkitTransform = 'translate3d(' + (i * this.pageWidth) + 'px,0,0)';
                var resolution = photo.height / photo.width;
                if (resolution > this.resolution) {
                    li.innerHTML = '<img src="' + photo.src + '" height="' + this.pageHeight + '"/>';
                } else {
                    li.innerHTML = '<img src="' + photo.src + '" width="' + this.pageWidth + '"/>';
                }
                this.ul.appendChild(li);
            }
        }
    };
    //绑定dom事件
    PhotoGallery.prototype._bind = function() {
        var $this = this,
            ul = this.ul;
        var touchstart = function(evt) {
            //开始按下的时间点
            $this.startTime = new Date() * 1;
            //开始按下的x坐标
            $this.startX = evt.touches[0].pageX;
        };
        var touchmove = function(evt) {
            //阻止浏览器默认行为
            evt.preventDefault();
            //计算手指一动偏移量
            $this.offsetX = evt.targetTouches[0].pageX - $this.startX;

            var lis = ul.getElementsByTagName('li');
            var start = $this.idx - 1,
                end = $this.idx + 1;
            for (var i = start; i <= end; i++) {
                lis[i] && (lis[i].style.webkitTransition = '-webkit-transform 0s ease-out');
                lis[i] && (lis[i].style.webkitTransform = 'translate3d(' + ((i - $this.idx) * $this.pageWidth + $this.offsetX) + 'px, 0, 0)');
            }
        };
        var touchend = function(evt) {
            //手指松开的时间点
            var endTime = new Date() * 1;
            if (endTime - $this.startTime > 300) {
                var refWidth = $this.pageWidth / 6;
                if ($this.offsetX >= refWidth) {
                    $this._go(-1)
                } else if ($this.offsetX <= -refWidth) {
                    $this._go(1)
                } else {
                    $this._go(0)
                }
            } else {
                if ($this.offsetX > 50) {
                    $this._go(-1)
                } else if ($this.offsetX < -50) {
                    $this._go(1)
                } else {
                    $this._go(0)
                }
            }
        };
        ul.addEventListener('touchstart', touchstart);
        ul.addEventListener('touchmove', touchmove);
        ul.addEventListener('touchend', touchend);

    };
    PhotoGallery.prototype._go = function(n) {
        var oldIdx = this.idx;
        var newIdx = this.idx + n,
            max = this.photos.length - 1;
        if (newIdx < 0) {
            newIdx = 0;
        }
        if (newIdx > max) {
            newIdx = max;
        }
        this.idx = newIdx;

        var lis = this.ul.getElementsByTagName('li');
        var start = this.idx - 1,
            end = this.idx + 1;
        for (var i = start; i <= end; i++) {
            lis[i] && (lis[i].style.webkitTransition = '-webkit-transform 0.2s ease-out');
            lis[i] && (lis[i].style.webkitTransform = 'translate3d(' + ((i - this.idx) * this.pageWidth) + 'px, 0, 0)');
        }
        if (newIdx > oldIdx) {
            this._render(lis.length);
        }
    };
    new PhotoGallery({
        container: document.getElementById('imgContainer'),
        photos: photos
    });
})()
