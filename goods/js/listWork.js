    $(document).ready(function() {
        var urlVoteParam="/vote/get-vote-param";
        var urlProductInfo="/vote/get-vote-product-info";
        var urlGetVoteNum='/vote/get-vote-num';
        $('html').width(window.screen.width);
        $('html').css("overflow-x","hidden");
        var countff=getCookie("countff");//投票次数
        var openId="yy";
        var shareflagvote=getCookie("shareflagvote");//投票分享次数

        var num;//已抽奖次数后台返回
        var length;//总的作品数
        //抽奖设置
        var actName;
        var begin;
        var end;
        var proNum;
        var voteNum;
        var shareNum;
        var voteMaxNum;
        var voteDecoration;
        var proApproved;//抽奖配置 proNum一次投多少个

        var $searchBar = $('#searchBar'),
            $searchResult = $('#searchResult'),
            $searchText = $('#searchText'),
            $searchInput = $('#searchInput'),
            $searchClear = $('#searchClear'),
            $searchCancel = $('#searchCancel');
        var actId=getQueryString("id");

        //投票规则
        document.querySelector('#fixedlogo').addEventListener('click', function () {
            weui.alert(voteDecoration, function () {
                console.log('ok')
            }, {
                title: actName
            });
        });
        voteParamContact();
        voteNumContact();
        productInfoContact();
        function voteNumContact() {
            $.ajax({
                url:urlServer+urlGetVoteNum,
                async:false,
                data:{
                    "openId":openId,
                    "actId":actId
                },
                success:function (data) {
                    var code=data.code;
                    if(code==200){
                        num=data.data;
                        if(num>=voteMaxNum){
                            $('#submit').html('已达投票上限');
                            $('#submit').attr("disabled",true);
                        }
                    }
                },
                error:function (error) {
                    console.log(error);
                    weui.alert("获取当天投票数失败");
                }
            })
        }

        function voteParamContact() {
            $.ajax({
                url:urlServer+urlVoteParam,
                async:false,
                data:{
                    "actId":actId
                },
                success:function (data) {
                    var code=data.code;
                    if(code==200){
                        actName=data.data.actName;
                        begin=data.data.begin;
                        end=data.data.end;
                        proNum=data.data.proNum;
                        voteNum=data.data.voteNum;
                        shareNum=data.data.shareNum;
                        voteMaxNum=data.data.voteMaxNum;
                        voteDecoration=data.data.voteDecoration;
                        proApproved=data.data.proApproved;
                        $('#title').html(actName);
                        //初始化投票抽奖次数
                        countff=getCookie("countff");//投票次数
                        console.log(countff);
                        countprize=getCookie("countprize");//抽奖次数
                        shareflagvote=getCookie("shareflagvote");//投票分享次数
                        shareflagprize=getCookie("shareflagprize");//抽奖分享次数
                        // if(shareflagprize=="null"||shareflagprize==null){
                        //     var shareflagprize=0;
                        //     setCookie_29("shareflagprize",shareflagprize);
                        // }
                        // if(shareflagvote=="null"||shareflagvote==null){
                        //     var shareflagvote=voteNum;
                        //     setCookie_29("shareflagvote",shareflagvote);
                        // }
                        // if(countprize=="null"||countprize==null){
                        //     var countprize=0;
                        //     setCookie_29("countprize",countprize);
                        // }
                        // if (countff=="null"||countff==null) {
                        //     console.log(countff);
                        //     setCookie_29("countff",voteNum);
                        // }
                        setCookie_29("actName",actName);
                        if (getCookie("countff") == null || getCookie("countff") == "null") {
                            countff = voteNum;
                            setCookie_timedetail("countff", countff, '24:00:00');
                        }
                        countff = getCookie("countff");
                        // weui.alert("您可投票" + countff + "次");
                        $('.c-join').html('请投票（选择'+proNum+'个，投票'+countff+'次）');

                    }
                },
                error:function (error) {
                    console.log(error);
                    weui.alert("获取投票设置失败");
                }
            })
        }
        function productInfoContact() {
            $.ajax({
                url: urlServer+urlProductInfo,
                data:{
                    "actId":actId
                },
                success: function(data) {
                    var list = data.data;
                    var code=data.code;
                    if(code==200){
                        length=list.length;
                        makeList(list);
                        $(".item").bind("click", function () {
                            var product = $(this).find("input");
                            if (product.attr("checked") == null) {
                                product.attr("checked", "checked");
                            } else {
                                product.removeAttr("checked");
                            }
                        });
                    }else{
                        console.log(data);
                    }
                },
                error: function(error) {
                    weui.alert('获取作品列表出错');
                    console.log(error);
                }
            });
        }
//        麦宝修改
        function makeList(list) {
            var strHtml = '';
            for (var i = 0; i < length; i++) {
                strHtml+=showDetail(list[i],i+1);
            }
            $('#listWork .body').html(strHtml);
            $('.intro1').width(window.screen.width*0.83-120);
            var wwidth=window.screen.width;
            $('#text').width(wwidth*0.46);
            $('#button1 a').width(wwidth*0.16);
            $('#button2 a').width(wwidth*0.16);
            $('div.item').height(wwidth*0.4*0.75);
            $('div.item .tupian').width(wwidth*0.4);
            $('div.item .tupian').height(wwidth*0.4*0.75);
            $('.tupian img').width(wwidth*0.4);
            $('.tupian img').height(wwidth*0.4*0.75);
            //动态修改content文字大小，行高
            $('div.item .content').height(wwidth*0.4*0.75);
            // console.log(j);
            // console.log($('div.item .content').height());
            var size=parseInt($('div.item .content').height()/6);
            // console.log(size);
            $('div.item .content div').css('line-height',size+'px');
            $('div.item .content div').css('font-size',(size-5)+'px');
        }
        function showDetail(item,i) {
            var strHtml='<div class="item">';
            var proId=item.proId,
                id=item.id,
                name=item.name,
                author=item.author,
                img=item.img,
                description=item.description;
            if(description==null||description==''){
                description='暂无介绍';
            }
            strHtml+='<div class="tupian"> <img src="'+img+'"></div><div class="content">'+
                '<div class="check"><input type="checkbox" value="' +id+'"id="product'+i+'" name="product'+i+'" style="zoom: 180%;"><label ></label></div>'+
                '<div id="'+id+'"><b>编号:</b><span class="content-span id">'+id+'</div>';
            strHtml+='<div id="id" style="display: none;">'+id+'</div>'+
                '<div id="proId" style="display: none;">'+proId+'</div>'+
                '<div id="name"><b>名称：</b>'+'<span class="content-span">'+name+'</span></div>'+
                '<div id="author"><b>作者：</b>'+'<span class="content-span">'+author+'</span></div>'+
                '<div id="description"><b>介绍：</b>'+'<span class="content-span">'+description+'</span></div>';
            strHtml+='</div></div></div>';
            return strHtml;
        }
        $("#submit").click(function() {
            var countff;
            countff=getCookie("countff");
            var now=Date.now();
            if(now<Date.parse(begin)){
                weui.alert("投票尚未开始");
                $('#submit').attr("disabled",true);
            }else if(now>Date.parse(begin)&&now>Date.parse(end)){
                weui.alert("投票已结束");
                $('#submit').attr("disabled",true);
            }else if(now>Date.parse(begin)&&now<Date.parse(end)){
                // alert(num);
                // alert(voteMaxNum);
                if(num>=voteMaxNum){
                    weui.alert("投票次数已达上限");
                    $('#submit').attr("disabled",true);
                    setTimeout(function(){
                        window.location.href = "../../vote/list.html?actId="+actId;
                    },1000);
                }else if (countff==0){
                    weui.alert("投票次数已达上限");
                    $('#submit').attr("disabled",true);
                    setTimeout(function(){
                        window.location.href = "../../vote/list.html?actId="+actId;
                    },1000);
                }
                else{
                    var num = 0;
                    var str = "";
                    var curTime=(new Date()).valueOf();
                    for (var i = 1; i <= length; i++) {
                        if ($("#product" + i).attr("checked") != null) {
                            num++;
                            str += $("#product" + i).val() + ",";
                        }
                    }
                    console.log(str);
                    str=str+'@@@'+curTime;
                    str=str+'@@@'+openId;
                    console.log(str);
                    if (num == proNum) {
                        // str = str.substring(0, str.length - 1);
                        console.log(str);
                        var voteflag=false;
                        $('#submit').attr("disabled",true);
                        if(voteflag==false){

                            $.ajax({
                                url: urlServer + "/vote/post-vote-number-info",
                                type: "POST",
                                data: {
                                    "str": str,
                                    "actId":actId,
                                },
                                success: function(data) {
                                    //后台控制投票次数，返回是否可以投票
                                    var code=data.code;
                                    if(code==200){
                                        var result = data.data.result;
                                        if (result == true) {
                                            --countff;
                                            console.log(countff);
                                            setCookie_timedetail("countff", countff, '24:00:00');
                                            $('#submit').html("已投票");
                                            voteflag=true;
                                            setTimeout(function(){
                                                location.href = "../../vote/list.html?actId="+actId;
                                            },1000);
                                        } else if (result == false) {
                                            voteflag=false;
                                            var msg=data.data.msg;
                                            weui.alert(msg);
                                            $('#submit').html("投票并查看结果");
                                            $('#submit').removeAttr("disabled");
                                        }
                                    }

                                },
                                error: function(error) {
                                    voteflag=false;
                                    $('#submit').removeAttr("disabled");
                                    weui.alert("投票未成功，再来一次哟！");
                                }
                            });
                        }

                    } else {
                        weui.alert("您已选择"+num+"个，"+"请选择"+proNum+"个作品哟！");
                    }

                }
            }

        });
//麦宝修改
//一
//         function makeList(list) {
//             var strHtml='';
//             for(var i=0;i<list.length;i++){
//                 var strHtm2='<div class="item">';
//                 var regItemlist=list[i].productInfo.split(";");
//                 var strHtm3='';
//                 for(var j=0;j<regItemlist.length;j++){
//                     var title=regItemlist[j].split("?")[0];
//                     var val=regItemlist[j].split("?")[1];
//                     if(i<6){
//                         if(val.indexOf('http:')>=0){
//                             var imgFirst=val.split("&")[0];
//                             strHtm3+='<div class="tupian"> <img src="'+imgFirst+'"></div><div class="content"><div id='+list[i].id+'><b>编号</b>:<span class="content-span id">'+list[i].id+'</div>';
//                         }
//                          if(val.indexOf('http:')<0){
//                             strHtm3+='<div id="'+title+'"><b>'+title+'</b>:'+'<span class="content-span">'+val+'</span></div>';
//                         }
//                     }
//                     else{
//                         if(val.indexOf('http:')>=0){
//                             var imgFirst=val.split("&")[0];
//                             strHtm3+='<div class="tupian"> <img src="" data-original='+imgFirst+'></div><div class="content"><div id='+list[i].id+'><b>编号</b>:<span class="content-span id">'+list[i].id+'</div>';
//                         }
//                         if(val.indexOf('http:')<0){
//                             strHtm3+='<div id="'+title+'"><b>'+title+'</b>:'+'<span class="content-span">'+val+'</span></div>';
//                         }
//                     }
//                 }
//                 strHtm2=strHtm2+strHtm3+'</div></div></div>';
//                 strHtml=strHtml+strHtm2;
//                 $('#listWork .body').html(strHtml);
//                 $('.intro1').width(window.screen.width*0.83-120);
//                 var wwidth=window.screen.width;
//                 $('#text').width(wwidth*0.46);
//                 $('#button1 a').width(wwidth*0.16);
//                 $('#button2 a').width(wwidth*0.16);
//                 $('div.item').height(wwidth*0.4*0.75);
//                 $('div.item .tupian').width(wwidth*0.4);
//                 $('div.item .tupian').height(wwidth*0.4*0.75);
//                 $('.tupian img').width(wwidth*0.4);
//                 $('.tupian img').height(wwidth*0.4*0.75);
//                 //动态修改content文字大小，行高
//                 $('div.item .content').height(wwidth*0.4*0.75);
//                 // console.log(j);
//                 // console.log($('div.item .content').height());
//                 var size=parseInt($('div.item .content').height()/(j+1));
//                 // console.log(size);
//                 $('div.item .content div').css('line-height',size+'px');
//                 $('div.item .content div').css('font-size',(size-5)+'px');
//                 // console.log(regItem);
//             }
//             //
//             // for (var i = 0; i < list.length; i++) {
//             //     if(i<8){
//             //         var strHtm2 = '<div class="item"><div class="tupian"><img data-original="" src=' + list[i].productFirst + '></div>' +
//             //             '<div class="content"><div id="'+list[i].id+'" class="no"><b>作品编号</b>：<span class="no1">' + list[i].id + '</span></div>' +
//             //             '<div class="name"><b>作品名称</b>：<span class="name1">' + list[i].brandName+'</span></div>' +
//             //             '<div class="intro"><div class="intro1"><b>作品简介</b>：' + list[i].intro + '</div></div></div></div>';
//             //     }else{
//             //         var strHtm2 = '<div class="item"><div class="tupian"><img data-original=' + list[i].productFirst + ' src=""></div>' +
//             //             '<div class="content"><div id="'+list[i].id+'" class="no"><b>作品编号</b>：<span class="no1">' + list[i].id + '</span></div>' +
//             //             '<div class="name"><b>作品名称</b>：<span class="name1">' + list[i].brandName+'</span></div>' +
//             //             '<div class="intro"><div class="intro1"><b>作品简介</b>：' + list[i].intro + '</div></div></div></div>';
//             //     }
//             //
//             //     strHtml=strHtml+strHtm2;
//             // }
//
//         }
        $(".body").delegate(".item .tupian","click",function() {
            // console.log($(this).parent().find('#proId').text());
            window.location.href = "http://m.maibaoscratch.com/#production_detail/"+ $(this).parent().find('#proId').text();
            // +$(this).find('.id').text();
            // window.location.href = "../page/dow.html?id=" + $(this).find('.id').text()+"&actId="+actId;
        });
        var now=Date.now();

        //点击投票 进行时间、次数判断
        $("#button2").on("click",function() {
            var countff;
            countff=getCookie("countff");
            var now=Date.now();
            if(now<Date.parse(begin)){
                weui.alert("投票尚未开始");
            }else if(now>Date.parse(begin)&&now>Date.parse(end)){
                weui.alert("投票已结束");
            }else if(now>Date.parse(begin)&&now<Date.parse(end)){
                // alert(num);
                // alert(voteMaxNum);
                if(num>=voteMaxNum){
                    weui.alert("投票次数已达上限");
                    setTimeout(function(){
                        window.location.href = "../../vote/list.html?actId="+actId;
                    },1000);
                }else if (countff==0){
                    weui.alert("投票次数已达上限");
                    setTimeout(function(){
                        window.location.href = "../../vote/list.html?actId="+actId;
                    },1000);
                }
                else{
                    window.location.href="../../vote/index.html?actId="+actId;
                }
            }

        });
        function  imginit() {
            var images = document.images;
            for (var i = 0, len = images.length; i < len; i++) {
                var obj = images[i];
                obj.onload=function () {
                    this.src=src;
                }
            }
        }

        // function init(){
        //     var images=document.images;
        //     for(var i= 0,len=images.length;i<len;i++){
        //         var obj=images[i];
        //         if(obj.getBoundingClientRect().top<document.documentElement.clientHeight&&!obj.isLoad) {
        //             obj.isLoad = true;
        //             if (obj.dataset) {
        //                 imageLoaded(obj, obj.dataset.original);
        //             } else {
        //                 imageLoaded(obj, obj.getAttribute("data-original"));
        //             }
        //         }else{
        //             break;
        //         }
        //     }
        // }
        function imageLoaded(obj,src){
            var img=new Image();
            img.onload=function(){
                obj.src=src;
            };
            img.src=src;
        }
        $('body').scroll(function(){
            lazyload();
        });

        function lazyload() {
            var lazy = 0;
            var images = document.images;
            for (var i = 0, len = images.length; i < len; i++) {
                var obj = images[i];
                if (obj.getBoundingClientRect().top - lazy < document.documentElement.clientHeight && !obj.isLoad) {
                    obj.isLoad = true;
                    if (obj.dataset)
                        imageLoaded(obj, obj.dataset.original);
                    else
                        imageLoaded(obj, obj.getAttribute('data-original'));
                }
            }
        }



        //搜索功能实现开始
        $("#button1").on("click",function() {
            var searchText = $searchInput.val();//获取输入的搜索内容
            if (searchText== "") {
                $('#content_news_list').html("<li>not find</li>")
            }
            else{
                window.location.href = "#" + searchText;
            }
        });
        function hideSearchResult() {
            $searchResult.hide();
            $searchInput.val('');
        }
        function cancelSearch() {
            hideSearchResult();
            $searchBar.removeClass('weui-search-bar_focusing');
            $searchText.show();
        }
        $searchText.on('click', function() {
            $searchBar.addClass('weui-search-bar_focusing');
            $searchInput.focus();
        });
        $searchInput
            .on('blur', function() {
                if(!this.value.length) cancelSearch();
            })
            .on('input', function() {
                if(this.value.length) {
                    $searchResult.show();
                } else {
                    $searchResult.hide();
                }
            });
        $searchClear.on('click', function() {
            hideSearchResult();
            $searchInput.focus();
        });
        $searchCancel.on('click', function() {
            cancelSearch();
            $searchInput.blur();
        });
        //搜索功能实现结束
    })













