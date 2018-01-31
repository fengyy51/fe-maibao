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
        // $('#fixedlogo').on("click",function(){
        //     $('#dialog .weui_dialog_bd').html('1.输入序号，点击“搜索”查找作品，点击作品图片可查看作品详细介绍；<br>'+' 2.点击“投票”可进入投票页面；<br>'+
        //     '3.下拉选择5件心仪作品，确认后点击“投票并查看结果”；<br>'+'4.投票完毕，可参与“宾王158幸运大转盘”活动，丰厚奖品等着您。<br>');
        //     // +'注：转发此页面至朋友圈可增加1次抽奖机会，每人每天限抽3次。','“寻找造物主”优秀作品评选流程');
        //     var $dialog=$('#dialog');
        //     $dialog.show();
        //     $dialog.find('.weui_btn_dialog').on('click', function () {
        //         $dialog.hide();
        //     });
        // })

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
                        if(shareflagprize=="null"||shareflagprize==null){
                            var shareflagprize=0;
                            setCookie_29("shareflagprize",shareflagprize);
                        }
                        if(shareflagvote=="null"||shareflagvote==null){
                            var shareflagvote=voteNum;
                            setCookie_29("shareflagvote",shareflagvote);
                        }
                        if(countprize=="null"||countprize==null){
                            var countprize=0;
                            setCookie_29("countprize",countprize);
                        }
                        if (countff=="null"||countff==null) {
                            console.log(countff);
                            setCookie_29("countff",voteNum);
                        }

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
                        makeList(list,list.length);
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
        function makeList(list,length) {
            var strHtml = '';
            for (var i = 0; i < 20; i++) {
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
                name=item.name,
                author=item.author,
                img=item.img,
                description=item.description;
            if(description==null){
                description='暂无介绍';
            }
            strHtml+='<div class="tupian"> <img src="'+img+'"></div><div class="content"><div id="id"><b>编号:</b><span class="content-span id">'+i+'</div>';
            strHtml+='<div id="proId" style="display: none;">'+proId+'</div>'+
                '<div id="name"><b>名称：</b>'+'<span class="content-span">'+name+'</span></div>'+
                '<div id="author"><b>作者：</b>'+'<span class="content-span">'+author+'</span></div>'+
                '<div id="description"><b>介绍：</b>'+'<span class="content-span">'+description+'</span></div>';
            strHtml+='</div></div></div>';
            return strHtml;
        }

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
        $(".body").delegate(".item","click",function() {
            window.location.href = "http://m.maibaoscratch.com/#production_detail/ff74b19d-f7da-4faf-a5fb-f96b9b11d964";
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













