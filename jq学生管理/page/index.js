
(function ($) {

    function TurnPage(options) {
        this.wrap = options.wrap;
        this.allPageSize = options.allPageSize;
        this.curPage = options.curPage;
        this.pageSize = options.pageSize;
        this.changePageCb = options.changePageCb;
        this.allPage = Math.ceil(this.allPageSize / this.pageSize);
        this.init = function () {
            this.renderDom();
            this.bindEvent();
        }
    }

    TurnPage.prototype.renderDom = function () {
        $(this.wrap).empty();
        var oUl = $('<ul class="turn-page"></ul>');
        if (this.curPage > 1) {
            $('<li class="prev-page">上一页</li>').appendTo(oUl);
        }
       
        if (this.curPage - 2 > 1) {
            $('<li class="num">1</li>').appendTo(oUl);
        }
      
        if (this.curPage > 4) {
            $('<span>...</span>').appendTo(oUl);
        }
      
        for (var i = this.curPage - 2; i <= this.curPage + 2; i++) {
            if (i == this.curPage) {
                $('<li class="num cur-page">' + i + '</li>').appendTo(oUl);
            } else if (i > 0 && i <= this.allPage){
                 $('<li class="num">' + i + '</li>').appendTo(oUl);
            }
        }
       
        if (this.curPage + 2 < this.allPage - 1) {
            $('<span>...</span>').appendTo(oUl);
        }
       
        if(this.curPage + 2 < this.allPage) {
            $('<li class="num">' + this.allPage + '</li>').appendTo(oUl);
        }
       
        if(this.curPage < this.allPage) {
            $('<li class="next-page">下一页</li>').appendTo(oUl);
        }

        $(this.wrap).append(oUl);

    }

    TurnPage.prototype.bindEvent = function () {
        var self = this;
        $(this.wrap).on('click', '.prev-page', function (e) {
            if (self.curPage > 1) {
                self.curPage -- ;
                self.changePage();
            }
        })
        $(this.wrap).on('click', '.num', function (e) {
            var page = parseInt($(this).text());
            self.curPage = page;
            self.changePage();
        });
        $(this.wrap).on('click', '.next-page', function (e) {
            if (self.curPage < self.allPage) {
                self.curPage ++ ;
                self.changePage();
            }
        });
    }
    TurnPage.prototype.changePage = function () {
        this.renderDom();
        this.changePageCb && this.changePageCb(this.curPage);
    }

    // $.prototype..extend
    $.fn.extend({
        turnPage: function (options) {
            options.wrap = this;
            var pageObj =  new TurnPage(options);
            pageObj.init();
        }
    })

} (jQuery))