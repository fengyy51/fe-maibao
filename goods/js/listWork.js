    $(document).ready(function() {
        var urlVoteParam="/vote/get-vote-param";
        var urlGetVoteIndex="/vote/get-vote-index";//获取投票活动真正的序号，而非关联活动的序号
        var urlProductInfo="/vote/get-vote-product-info";//
        var urlWeiXinProduct="http://www.tuopinpin.com/getproductionid/";//微信公众号展示作品
        // var urlWeiXinProduct="http://test.tuopinpin.com/getproductionid/";//微信公众号展示作品
        var urlGetVoteNum='/vote/get-vote-num';
        $('html').width(window.screen.width);
        $('html').css("overflow-x","hidden");
        var countff=getCookie("countff");//投票次数
        var countsharecircle,countsharefriend;


        // 获取用户openid，用户授权
        var openId='yy';
        var id=getQueryString("id");
        if(id){
            setCookie_29("id",id);
        }
        if(getCookie("id")!=null&&getCookie("id")){
           id=getCookie("id");
        }else {
            id=18;
        }
        var options={
            url:urlYuming+"/goods/page/listWork.html?id="+id,
            urlServerauth:urlServer+"/user/do-auth",
            APPID:APPIDall
        }
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


        var voteIndex;//获取的投票活动真正序号
        var contentlen=0;//投票内容项的数量

        //投票规则
        document.querySelector('#fixedlogo').addEventListener('click', function () {
            weui.alert(voteDecoration, function () {
                console.log('ok')
            }, {
                title: actName
            });
        });

        function callbackA(id) {
            openId=id;
            getVoteIndex();
            //利用openid，actid获取后台投票数量，由前端检验是否达到上限，后期可以获取openid后再添加
            voteNumContact();
            voteParamContact();
        }
        //线下
        // getVoteIndex();
        // voteParamContact();

        getWeChatId(options,callbackA);

        $("#submit").bind("click", function () {
            countff=getCookie("countff");

            // alert(countff);
            // alert(voteMaxNum);

            // if($('#submit').html()=='赞<img src="../resource/img/zan.png" style="width: 20px;height: 20px;">一下哟~'){
                //后台限制投票次数
                // if(num>=voteMaxNum){
                //     weui.alert("投票次数已达上限");
                //     $('#submit').attr("disabled",true);
                //     setTimeout(function(){
                //         window.location.href = "../../vote/list.html?actId="+actId;
                //     },1000);
                // }else
                if (countff==0){
                    weui.alert("点赞次数已达上限");
                    $('#submit').attr("disabled",true);
                    setTimeout(function(){
                        window.location.replace("../../vote/list.html?actId="+actId);
                    },1000);
                }
                else{
                    var num = 0;
                    var str = "";
                    var curTime=(new Date()).valueOf();
                    var checkboxArr=document.querySelectorAll('input[type="checkbox"]');
                    for(var k in checkboxArr){
                        if(checkboxArr[k].checked){
                            num++;
                            str+=checkboxArr[k].value+ ",";
                        }
                    }
                    // alert(str);
                    // for (var i =0; i < length; i++) {
                    //     if ($("#product" + i).attr("checked") != null) {
                    //         num++;
                    //         str += $("#product" + i).val() + ",";
                    //     }
                    // }
                    str=str+'@@@'+curTime;
                    //后台限制投票次数
                    console.log(openId);
                    str=str+'@@@'+openId;
                    if(getCookie("countsharecircle")!=null&&getCookie("countsharecircle")!='null'&&getCookie("countsharecircle")){
                        countsharecircle=getCookie("countsharecircle");//获取分享朋友圈的次数
                        console.log("cookie+countsharecirecle"+countsharecircle);
                    }else {
                        countsharecircle=0;
                    }
                    if(getCookie("countsharefriend")!=null&&getCookie("countsharefriend")!='null'&&getCookie("countsharefriend")){
                        countsharefriend=getCookie("countsharefriend");//获取分享朋友的次数
                        console.log("cookie+countsharefriend"+countsharefriend);
                    }else {
                        countsharefriend=0;
                    }
                    console.log(countsharecircle);
                    console.log(countsharefriend);
                    str+='@@@'+countsharefriend+'@@@'+countsharecircle;
                    console.log(str);
                    // alert(num);
                    if (num <= proNum && num>0) {
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
                                    console.log(data);
                                    // alert(data);
                                    if(code==200){
                                        var result = data.data.result;
                                        if (result == true) {
                                            --countff;
                                            console.log(countff);
                                            setCookie_timedetail("countff", countff, '24:00:00');
                                            // setCookie_29("countsharefriend",0);
                                            // setCookie_29("countsharecircle",0);
                                            $('#submit').html("已点赞");
                                            voteflag=true;
                                            setTimeout(function(){
                                                window.location.replace("../../vote/list.html?actId="+actId);
                                            },1000);
                                        } else if (result == false) {
                                            voteflag=false;
                                            var msg=data.data.msg;
                                            if(msg=='已投票'){
                                                $('#submit').html("已点赞");
                                                voteflag=true;
                                                countff--;
                                                setCookie_timedetail("countff",countff,'24:00:00');
                                                setTimeout(function(){
                                                    window.location.replace("../../vote/list.html?actId="+actId);
                                                },1000);
                                            }else {
                                                weui.alert(msg);
                                                $('#submit').html('赞<img src="../resource/img/zan.png" style="width: 20px;height: 20px;">一下哟~');
                                                $('#submit').removeAttr("disabled");
                                            }
                                        }
                                    }else{
                                        weui.alert("点赞失败");
                                        $('#submit').html('赞<img src=\"../resource/img/zan.png\" style=\"width: 20px;height: 20px;\">一下哟~');
                                        $('#submit').removeAttr("disabled");
                                    }

                                },
                                error: function(error) {
                                    console.log(error);
                                    weui.alert(error);
                                    voteflag=false;
                                    $('#submit').removeAttr("disabled");
                                    weui.alert("点赞未成功，再来一次哟！");
                                }
                            });
                        }

                    } else {
                        weui.alert("您已选择"+num+"个，"+"请最多选择"+proNum+"个作品哟！");
                    }

                }
            // }

        });
        //获取活动名称，每天可投票次数等配置,投票时间限制管理
        //fixed在某些机型失效
        var h=$(window).height();
        $(window).resize(function() {
            if($(window).height()<h){
                $('#submit').hide();
            }
            if($(window).height()>=h){
                $('#submit').show();
            }
        });

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
                            var votecount=num-voteMaxNum;
                            $('#submit').html('已达点赞次数上限');
                            $('#submit').attr("disabled",true);
                            // $('.c-join').html('大家一起来点赞（最多选择'+proNum+'个）');
                                //，投票'+votecount+'次）'
                        }
                    }
                },
                error:function (error) {
                    console.log(error);
                    weui.alert("获取当天点赞数失败");
                }
            })
        }
        function getVoteIndex() {
            $.ajax({
                url:urlServer+urlGetVoteIndex,
                data:{
                    "actId":actId
                },
                async:false,
                success:function (data) {
                    if(data.code==200){
                        voteIndex=data.data;
                        getProductWeixin();
                        // productInfoContact(voteIndex);
                    }
                },
                error:function (error) {
                    console.log(error);
                    alert("获取点赞活动真正序号失败");
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
                        //判断投票时间限制
                        var now=Date.parse(new Date());
                        if(now<Date.parse(begin.replace(/-/g, '/'))){
                            $('#submit').html("作品点赞尚未开始");
                            $('#submit').attr("disabled",true);
                        }else if(now>Date.parse(begin.replace(/-/g, '/'))&&now>Date.parse(end.replace(/-/g, '/'))){
                            $('#submit').html("作品点赞已结束");
                            $('#submit').attr("disabled",true);
                        }else if(now>Date.parse(begin.replace(/-/g, '/'))&&now<Date.parse(end.replace(/-/g, '/'))){
                            // $('#submit').html("投票并查看结果");
                            // $('#submit').removeAttr("disabled");
                        }
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
                        setCookie_29("begin",begin);
                        setCookie_29("end",end);
                        if (getCookie("countff") == null || getCookie("countff") == "null") {
                            countff = voteNum;
                            setCookie_timedetail("countff", countff, '24:00:00');
                        }
                        countff = getCookie("countff");
                        // weui.alert("您可投票" + countff + "次");
                        // $('.c-join').html('大家一起来点赞（最多选择'+proNum+'个）');
                    //    ，投票'+countff+'次）

                    }
                },
                error:function (error) {
                    console.log(error);
                    weui.alert("获取点赞设置失败");
                }
            })
        }
        function getProductWeixin() {
            $.ajax({
                url:urlWeiXinProduct,
                success: function(data) {
                    var list = data;
                        length=list.length;
                        makeWeiXinList(list);
                        $(".item div.content").bind("click", function () {
                            var product = $(this).find("input");
                            if (product.attr("checked") == null) {
                                product.attr("checked", "checked");
                            } else {
                                product.removeAttr("checked");
                            }
                        });

                },
                error: function(error) {
                    weui.alert('获取作品列表出错');
                    console.log(error);
                }
            })
        }
        function productInfoContact(voteIndex) {
            $.ajax({
                url: urlServer+urlProductInfo,
                data:{
                    "actId":voteIndex
                },
                success: function(data) {
                    var list = data.data;
                    var code=data.code;
                    if(code==200){
                        length=list.length;
                        makeList(list);
                        $(".item div.content").bind("click", function () {
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
        function makeWeiXinList(list){
            var strHtml = '';
            for (var i = 0; i < length; i++) {
                strHtml+=showWeiXinDetail(list[i],i+1);
            }
            $('#listWork .body').html(strHtml);
            $('.intro1').width(window.screen.width*0.83-120);
            var wwidth=window.screen.width;
            $('#text').width(wwidth*0.46);
            $('#button1 a').width(wwidth*0.16);
            $('#button2 a').width(wwidth*0.16);
            // var size=parseInt($('div.item .content').height()/6);
            var size=wwidth / 30+ 'px';
            console.log(size);
            $('div.item .content').css('line-height',wwidth/30+2+'px');
            $('div.item .content').css('font-size',size+'!important');
            var font=$('div.item .content').css("font-size");
            // var font=window.getComputedStyle(document.getElementsByClassName("content-span")[0]).lineHeight;

            console.log(font);
            var contentheight=font.slice(0,font.length-2)*(contentlen+1)*1.2;

            if(contentheight<wwidth*0.4*0.75){
                $('div.item').height(wwidth*0.4*0.75);
                $('div.item .content').height(wwidth*0.4*0.75);
            }else {
                $('div.item').height(contentheight+"px");
                $('div.item .content').height(contentheight+"px");
                console.log($('div.item .content').height());
            }
            // $('div.item').height(wwidth*0.4*0.75);
            $('div.item .tupian').width(wwidth*0.4);
            $('div.item .tupian').height(wwidth*0.4*0.75);
            $('.tupian img').width(wwidth*0.4);
            $('.tupian img').height(wwidth*0.4*0.75);
            //动态修改content文字大小，行高
            // $('div.item .content').height(wwidth*0.4*0.75);
            // console.log(j);
            // console.log($('div.item .content').height());
            //
        }
//        麦宝修改
        function makeList(list) {
            var strHtml = '';
            for (var i = 0; i < length; i++) {
                strHtml+=showDetail(list[i],i);
            }
            $('#listWork .body').html(strHtml);
            $('.intro1').width(window.screen.width*0.83-120);
            var wwidth=window.screen.width;
            $('#text').width(wwidth*0.46);
            $('#button1 a').width(wwidth*0.16);
            $('#button2 a').width(wwidth*0.16);
             // var size=parseInt($('div.item .content').height()/6);
            var size=wwidth / 30+ 'px';
             console.log(size);
            $('div.item .content').css('line-height',wwidth/30+2+'px');
            $('div.item .content').css('font-size',size+'!important');
            var font=$('div.item .content').css("font-size");
            // var font=window.getComputedStyle(document.getElementsByClassName("content-span")[0]).lineHeight;

            console.log(font);
            var contentheight=font.slice(0,font.length-2)*(contentlen+1)*1.2;

            if(contentheight<wwidth*0.4*0.75){
                $('div.item').height(wwidth*0.4*0.75);
                $('div.item .content').height(wwidth*0.4*0.75);
            }else {
                $('div.item').height(contentheight+"px");
                $('div.item .content').height(contentheight+"px");
                console.log($('div.item .content').height());
            }
            // $('div.item').height(wwidth*0.4*0.75);
            $('div.item .tupian').width(wwidth*0.4);
            $('div.item .tupian').height(wwidth*0.4*0.75);
            $('.tupian img').width(wwidth*0.4);
            $('.tupian img').height(wwidth*0.4*0.75);
            //动态修改content文字大小，行高
            // $('div.item .content').height(wwidth*0.4*0.75);
            // console.log(j);
            // console.log($('div.item .content').height());
            //
        }
        function showWeiXinDetail(item,i) {
            var strHtml='<div class="item">';
            // var id=item.id,
            //     img=item.imgUrl.slice(1,item.imgUrl.length-1);
            // var somestr="";
            // if(item.content.trim()!=""){
            //     content=item.content.split("&&&");
            //     contentlen=Math.max(contentlen,content.length);
            //     for(var i=0;i<content.length;i++){
            //         console.log(content[i]);
            //         if(content[i].trim()!=""){
            //             var keyArr=[];
            //             if(content[i].indexOf(":")>0){
            //                 keyArr=content[i].split(":");
            //             }else  if(content[i].indexOf("：")>0){
            //                 keyArr=content[i].split("：");
            //             }
            //             somestr+='<div class="item_content"><span class="content-span">'+keyArr[0]+'：</span>'+'<span class="content-span">'+keyArr[1]+'</span></div>';
            //
            //         }
            //
            //
            //     }
            // }

            var proId=item.production,
                author=item.author,
                school=item.school,
                img="http://www.tuopinpin.com/files/"+item.image,
                operationInstruction=item['operation_instructions'],
                description=item.description;
            var authorlen=author.length;
            var name=item.image.slice(authorlen+1,-10);
            //
            // var proId=item.proId,
            //     id=item.id,
            //     name=item.name,
            //     author=item.author,
            //     // img="http://www.tuopinpin.com/files/"+item.img,
            //     description=item.description;


            // console.log(somestr);
            // if(description==null||description==''){
            //     description='暂无介绍';
            // }
            if(i<8){
                strHtml+='<div class="tupian"> <img data-original='+img+' src='+img+'></div><div class="content">'+
                    '<div class="check"><input type="checkbox" value="' +i+'"id="product'+id+'" name="product'+'" style="zoom: 180%;"><label ></label></div>'+
                        '<div id="proId" style="display: none;">'+proId+'</div>'+
                    '<div id="'+id+'" class="item_conten id"><span class="content-span">编号:</span><span class="content-span id">'+i+'</span></div>';
            }else {
                strHtml += '<div class="tupian"> <img data-original=' + img + ' src=""></div><div class="content">' +
                    '<div class="check"><input type="checkbox" value="' + i + '"id="product' + id + '" name="product' + '" style="zoom: 180%;"><label ></label></div>' +
                    '<div id="proId" style="display: none;">' + proId + '</div>' +
                    '<div id="' + id + '" class="item_conten id"><span class="content-span">编号:</span><span class="content-span id">' + i + '</span></div>';
            }
            strHtml+= '<div id="name" class="over">名称：'+'<span class="content-span">'+name+'</span></div>'+
            '<div id="school" class="over">学校：'+'<span class="content-span">'+school+'</span></div>'+
            '<div id="author" class="over">作者：'+'<span class="content-span">'+author+'</span></div>'+
            '<div id="description" class="over">介绍：'+'<span class="content-span">'+description+'</span></div>'+
            '<div id="operationInstruction" class="over">详细说明：'+'<span class="content-span">'+operationInstruction+'</span></div>' ;
            // strHtml+='<div id="id" style="display: none;">'+id+'</div>'+
            //     '<div id="proId" style="display: none;">'+proId+'</div>'+
            //     '<div id="name"><b>名称：</b>'+'<span class="content-span">'+name+'</span></div>'+
            //     '<div id="author"><b>作者：</b>'+'<span class="content-span">'+author+'</span></div>'+
            //     '<div id="description"><b>介绍：</b>'+'<span class="content-span">'+description+'</span></div>';
            strHtml+='</div></div></div>';
            return strHtml;
        }
        function showDetail(item,i) {
            var strHtml='<div class="item">';
            var id=item.id,
                img=item.imgUrl.slice(1,item.imgUrl.length-1);
            var somestr="";
            if(item.content.trim()!=""){
                content=item.content.split("&&&");
                contentlen=Math.max(contentlen,content.length);
                for(var i=0;i<content.length;i++){
                    console.log(content[i]);
                    if(content[i].trim()!=""){
                        var keyArr=[];
                        if(content[i].indexOf(":")>0){
                            keyArr=content[i].split(":");
                        }else  if(content[i].indexOf("：")>0){
                            keyArr=content[i].split("：");
                        }
                        somestr+='<div class="item_content"><span class="content-span">'+keyArr[0]+'：</span>'+'<span class="content-span">'+keyArr[1]+'</span></div>';

                    }


                }
            }

            // var proId=item.proId,
            //     id=item.id,
            //     name=item.name,
            //     author=item.author,
            //     // img="http://www.tuopinpin.com/files/"+item.img,
            //     description=item.description;


            console.log(somestr);
            // if(description==null||description==''){
            //     description='暂无介绍';
            // }
            console.log("index为"+i);
            if(i<8){
                strHtml+='<div class="tupian"> <img data-original='+img+' src='+img+'></div><div class="content">'+
                    '<div class="check"><input type="checkbox" value="' +id+'"id="product'+id+'" name="product'+'" style="zoom: 180%;"><label ></label></div>'+
                    '<div id="'+id+'" class="item_conten id"><span class="content-span">编号:</span><span class="content-span id">'+id+'</span></div>';
            }else {
                strHtml+='<div class="tupian"> <img data-original='+img+' src=""></div><div class="content">'+
                    '<div class="check"><input type="checkbox" value="' +id+'"id="product'+id+'" name="product'+'" style="zoom: 180%;"><label ></label></div>'+
                    '<div id="'+id+'" class="item_content id"><span class="content-span">编号:</span><span class="content-span id ">'+id+'</div>';
            }
            strHtml+=somestr;
                // '<div id="name"><b>名称：</b>'+'<span class="content-span">'+name+'</span></div>'+
                // '<div id="author"><b>作者：</b>'+'<span class="content-span">'+author+'</span></div>'+
                // '<div id="description"><b>介绍：</b>'+'<span class="content-span">'+description+'</span></div>';
            // strHtml+='<div id="id" style="display: none;">'+id+'</div>'+
            //     '<div id="proId" style="display: none;">'+proId+'</div>'+
            //     '<div id="name"><b>名称：</b>'+'<span class="content-span">'+name+'</span></div>'+
            //     '<div id="author"><b>作者：</b>'+'<span class="content-span">'+author+'</span></div>'+
            //     '<div id="description"><b>介绍：</b>'+'<span class="content-span">'+description+'</span></div>';
            strHtml+='</div></div></div>';
            return strHtml;
        }


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
//        点击图片时也投票
        $('.body').delegate(".item div.tupian","click",function () {
            countff=getCookie("countff");
            if(countff!=0){
                var num = 0;
                var str = "";
                var curTime=(new Date()).valueOf();
                var selectValue=$(this).parent().find('span.id').text();
                num++;
                str+=selectValue+',';
                console.log(selectValue);
                // var checkboxArr=document.querySelectorAll('input[type="checkbox"]');
                // for(var k in checkboxArr){
                //     if(checkboxArr[k].checked){
                //         num++;
                //         str+=checkboxArr[k].value+ ",";
                //     }
                // }
                // alert(str);
                // for (var i =0; i < length; i++) {
                //     if ($("#product" + i).attr("checked") != null) {
                //         num++;
                //         str += $("#product" + i).val() + ",";
                //     }
                // }
                str=str+'@@@'+curTime;
                //后台限制投票次数
                console.log(openId);
                str=str+'@@@'+openId;
                if(getCookie("countsharecircle")!=null&&getCookie("countsharecircle")!='null'&&getCookie("countsharecircle")){
                    countsharecircle=getCookie("countsharecircle");//获取分享朋友圈的次数
                    console.log("cookie+countsharecirecle"+countsharecircle);
                }else {
                    countsharecircle=0;
                }
                if(getCookie("countsharefriend")!=null&&getCookie("countsharefriend")!='null'&&getCookie("countsharefriend")){
                    countsharefriend=getCookie("countsharefriend");//获取分享朋友的次数
                    console.log("cookie+countsharefriend"+countsharefriend);
                }else {
                    countsharefriend=0;
                }
                console.log(countsharecircle);
                console.log(countsharefriend);
                str+='@@@'+countsharefriend+'@@@'+countsharecircle;
                console.log(str);
                // alert(num);
                if (num <= proNum && num>0) {
                    // str = str.substring(0, str.length - 1);
                    console.log(str);
                    var voteflag=false;
                    // $('#submit').attr("disabled",true);
                    if(voteflag==false){
                        $.ajax({
                            url: urlServer + "/vote/post-vote-number-info",
                            type: "POST",
                            async:false,
                            data: {
                                "str": str,
                                "actId":actId,
                            },
                            success: function(data) {
                                //后台控制投票次数，返回是否可以投票
                                var code=data.code;
                                console.log(data);
                                console.log(code);
                                console.log("cc");
                                // alert(data);
                                if(code==200){
                                    // var result = data.data.result;
                                    // if (result == true) {
                                        --countff;
                                        console.log(countff);
                                        setCookie_timedetail("countff", countff, '24:00:00');
                                        // setCookie_29("countsharefriend",0);
                                        // setCookie_29("countsharecircle",0);
                                        voteflag=true;
                                }
                            },
                            error: function(error) {
                                console.log(error);
                            }
                        });
                    }

                } else {
                    weui.alert("您已选择"+num+"个，"+"请最多选择"+proNum+"个作品哟！");
                }

            }
            // }
        });
        $(".body").delegate(".item div.tupian","click",function() {
            // console.log($(this).parent().find('#proId').text());
            window.location.href = "http://m.tuopinpin.com/#production_detail/"+ $(this).parent().find('#proId').text();
            // +$(this).find('.id').text();
            // window.location.href = "../page/dow.html?id=" + $(this).parent().find('.id span.id').text()+"&actId="+voteIndex;
        });
        // var now=Date.now();

        //点击投票 进行时间、次数判断
        // $("#button2").on("click",function() {
        //     var countff;
        //     countff=getCookie("countff");
        //
        //         // alert(num);
        //         // alert(voteMaxNum);
        //         // if(num>=voteMaxNum){
        //         //     weui.alert("投票次数已达上限");
        //         //     setTimeout(function(){
        //         //         window.location.href = "../../vote/list.html?actId="+actId;
        //         //     },1000);
        //         // }else
        //             if (countff==0){
        //             weui.alert("投票次数已达上限");
        //             setTimeout(function(){
        //                 window.location.href = "../../vote/list.html?actId="+actId;
        //             },1000);
        //         }
        //         else{
        //             window.location.href="../../vote/index.html?actId="+actId;
        //         }
        //     }
        //
        // });
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













