var nowPage = 1;
var pageSize = 10;
var allPageSize = 0;
var tableData = [];
var timer = null;
// 绑定事件
function bindEvent() {
    $('#menu').on('click', 'dd', function () {
        console.log(this);
        $(this).addClass('active').siblings().removeClass('active');
        var id = $(this).data('id');
        if (id == 'student-list') {
            getTableData();
        }
        $('#' + id).fadeIn().siblings().fadeOut();

    });
    $('#add-submit').click(function (e) {
        e.preventDefault();
        var data = $('#add-student-form').serializeArray();
        data = format(data);
        transferData('/api/student/addStudent', data,function (res) {
            var turnPage = confirm('添加成功，是否跳转页面？');
            $('#add-student-form')[0].reset();
            if (turnPage) {
                $('dd[data-id=student-list]').trigger('click');
            }
        });
    });
    $('#student-body').on('click', '.edit',function (e) {
        var index = $(this).data('id');
        var data = tableData[index];
        renderEditForm(data);

        $('#modal').slideDown();
    });
    $('.mask').click(function () {
        $('#modal').slideUp();
    });
    $('#edit-submit').click(function (e) {
        e.preventDefault();
        var data = $('#edit-student-form').serializeArray();
        data = format(data);
        transferData('/api/student/updateStudent', data,function (res) {
            alert('修改成功');
            $('#modal').slideUp();
            $('#edit-student-form')[0].reset();
            getTableData();
        });
    });
    $('#student-body').on('click', '.del',function (e) {
        var index = $(this).data('id');
        var data = tableData[index];
        var isDel = confirm('确认删除');
        if (!isDel) {
            return false;
        }
        transferData('/api/student/delBySno', {
            sNo: data.sNo
        }, function (res) {
            alert('删除成功');
            getTableData();
        });
    });
    $('#search-submit').click(function () {
        var value = $('#search-word').val();
        nowPage = 1;
        if (value) {
            transferData('/api/student/searchStudent', {
                search: value,
                page: nowPage,
                size: pageSize,
                sex: -1,
            }, function(res) {
                console.log(res);
                allPageSize = res.data.cont;
                tableData = res.data.searchList;
                renderTable(res.data.searchList);
            });
        } else {
            getTableData();
        }
    })

}

// 数据转化成对象
function format(arr) {
    var obj = {};
    for (var i = 0; i < arr.length; i ++) {
        obj[arr[i].name] = arr[i].value;
    }
    return obj;
}
// 获取表格数据
function getTableData() {
    // if (nowPage > allPage) {
    //     nowPage = allPage;
    // }
    transferData('/api/student/findByPage', {
        page: nowPage,
        size: pageSize,
    }, function (res) {
        allPageSize = res.data.cont;
        tableData = res.data.findByPage;
        var allPage = Math.ceil(allPageSize / pageSize);
        if (nowPage > allPage) {
            nowPage = allPage;
            getTableData();
        }
        renderTable(tableData);
    })
}
// 交互数据函数
function transferData(url, data, successCb) {
    $.ajax({
        type: 'get',
        url: 'http://api.duyiedu.com' + url,
        data: $.extend(data, {
            appkey: 'dongmeiqi_1551761333531'
        }),
        dataType: 'json',
        success: function (res) {
            if (res.status == 'success') {
                successCb(res);
            } else {
                alert(res.msg);
            }
        }
    })
}
// 渲染表格数据
function renderTable(data) {
    var str = '';
    data.forEach(function (item ,index) {
        str += `<tr>
                    <td>${item.sNo}</td>
                    <td>${item.name} </td>
                    <td>${item.sex ? '女' : '男'}</td>
                    <td>${item.email}</td>
                    <td>
                        ${new Date().getFullYear() - item.birth}
                    </td>
                    <td> ${item.phone}</td>
                    <td> ${item.address}</td>
                    <td>
                        <button class="btn edit" data-id=${index}>编辑</button>
                        <button class="btn del" data-id=${index}>删除</button>
                    </td>
                </tr>`
    });
    $('#student-body').html(str);
    $('#turn-page').turnPage({
        allPageSize: allPageSize,
        pageSize: pageSize,
        curPage: nowPage,
        changePageCb: function (page) {
            nowPage = page;
            clearTimeout(timer);
            timer = setTimeout(function () {
                if ($('#search-word').val()) {
                    transferData('/api/student/searchStudent', {
                        search: $('#search-word').val(),
                        page: nowPage,
                        size: pageSize,
                        sex: -1,
                    }, function(res) {
                        console.log(res);
                        allPageSize = res.data.cont;
                        tableData = res.data.searchList;
                        renderTable(res.data.searchList);
                    });
                } else {
                    getTableData();
                }
            }, 500);
        }
    })
}
function renderEditForm(data) {
    var form = $('#edit-student-form')[0];
    for (var prop in data) {
        if (form[prop]) {
            form[prop].value = data[prop];
        }
    }
}
function init() {
    bindEvent();
    $('dd[data-id=student-list]').trigger('click');
}
init();
