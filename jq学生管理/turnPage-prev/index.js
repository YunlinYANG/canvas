
(function () {

    function TurnPage(options) {
        this.wrap = options.wrap;
        this.curPage = options.curPage || 1;
        this.allPage = options.allPage || 1;
        this.changePage = options.changePage || function () {};

        if (this.curPage > this.allPage) {
            alert('请输入正确页码');
            return false;
        }
        this.fillHTML();
        this.bindEvent();
    }
    TurnPage.prototype.fillHTML = function () {
        $(this.wrap).empty();
       
        if (this.curPage > 1) {
            $(this.wrap).append($('<li class="prev-page">上一页</li>'));
        } else {
            $(this.wrap).remove('.prev-page');
        }

       
       
        if (this.curPage != 1 && this.curPage - 2 > 1) {
            $(this.wrap).append($('<li class="tab-number">1</li>'));
        }

        if (this.curPage - 2 > 2) {
            $(this.wrap).append($('<span>...</span>'));
        }

       
        for (var i = this.curPage - 2; i <= this.curPage + 2; i++) {
         
            if(i > 0 && i <= this.allPage) {
                var oLi = $('<li class="tab-number">' + i + '</li>');
                if (i == this.curPage) {
                    oLi.addClass('cur-page')
                }
                $(this.wrap).append(oLi);
            }
        }
        
        if (this.allPage - this.curPage > 3) {
            $(this.wrap).append($('<span>...</span>'));
        }
        
        if (this.curPage + 2 < this.allPage) {
            $('<li class="tab-number">' + this.allPage + '</li>').appendTo($(this.wrap));
        }

        
        if (this.curPage < this.allPage) {
            $(this.wrap).append($('<li class="next-page">下一页</li>'));
        } else {
            $(this.wrap).remove('.next-page');
        }


    }

    TurnPage.prototype.bindEvent = function () {
        var self = this;
        $('.prev-page', this.wrap).click(function (e) {
            self.curPage --;
            self.change();
        });
        $('.next-page', this.wrap).click(function () {
            self.curPage ++;
            self.change();
        });
        $('.tab-number', this.wrap).click(function () {
            var curPage = parseInt($(this).text());
            self.curPage = curPage;
            self.change();
        });
    }
    TurnPage.prototype.change = function () {
        this.fillHTML();
        this.bindEvent();
        this.changePage(this.curPage);
    }





    $.fn.extend({
        turnPage: function (options) {
            options.wrap = this;
            new TurnPage(options);
            return this;
        }
    })
}())