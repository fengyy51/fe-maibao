$(document).ready(function(){
    var id=getQueryString("id");
    var urlGetPrizeNum='/luck/get-prize-num';
    var urlPrizeParam="/luck/get-prize-param";
    var urlPrizeInfo="/luck/get-prize-info";//奖项
    var countprize=getCookie("countprize");//抽奖次数
    var shareflagprize=getCookie("shareflagprize");//抽奖分享次数
    var name;
    var begin;
    var end;
    var prizeNum;
    var shareNum;
    var prizeMaxNum;
    var prizeDecoration;
	var wheight=window.screen.height;
	$('#prizelist img').css('height',wheight*0.3);
    var openId='yy';
    var ratio = [];
    var m;
    var flag;
    //一个奖占一个
    var display =new Array();
    // var list = [4,3,4,1,4,3,4,2];
    var color=['#f5d5ab','#ff587c','#f5d5ab','#ff587c','#f5d5ab','#ff587c','#f5d5ab','#ff587c','#f5d5ab','#ff587c']
    //var color = ['#c71f16','#e88c30','#3080e8','#86c716','#30c9e8','#e8308c','#e88c30','#3080e8','#a866ee','#c71f16','#e88c30','#3080e8','#86c716','#30c9e8','#e8308c','#e88c30','#3080e8','#a866ee'];
    var countprize=getCookie("countprize");
    prizeParamContact();
    prizeNumContact();
    prizeInfoContact();
    function prizeParamContact() {
        $.ajax({
            url:urlServer+urlPrizeParam,
            async:false,
            data:{
                "id":id
            },
            success:function (data) {
                var code=data.code;
                if(code==200){
                    name=data.data.name;
                    begin=data.data.begin;
                    end=data.data.end;
                    prizeNum=data.data.prizeNum;
                    shareNum=data.data.shareNum;
                    prizeMaxNum=data.data.prizeMaxNum;
                    prizeDecoration=data.data.prizeDecoration;
                    if(data.data.topImg!=null){
                        $('#tulip').attr("src",data.data.topImg);
                    }
                    if(data.data.prizelistImg!=null){
                        var str='<img src="'+data.data.prizelistImg+'" style="width:100%;height:100%;display: block;">';
                        $('#prizelist').html(str)
                    }
                    if(data.data.color!=null){
                        $('body').css('background-color',data.data.color);
                    }
                    $('.title').html(name);
                    $('#description').html(prizeDecoration);
                    setCookie_29("name",name);
                    if (getCookie("countprize") == null || getCookie("countprize") == "null") {
                        setCookie_timedetail("countprize", prizeNum, '24:00:00');
                    }
                    countprize = getCookie("countprize");
                    weui.alert("您可抽奖" + countprize + "次");
                }
            },
            error:function (error) {
                console.log(error);
                weui.alert("获取投票设置失败");
            }
        })
    }
    function prizeNumContact() {
        $.ajax({
            url:urlServer+urlGetPrizeNum,
            data:{
                "openId":openId,
                "actId":id
            },
            async:false,
            success:function (data) {
                var code=data.code;
                if(code==200){
                    var num=data.data;
                    console.log(num);
                    console.log(prizeMaxNum);
                    if(num>=prizeMaxNum){
                        weui.alert("已达抽奖次数上限");
                        document.getElementById("btn").style.backgroundColor="#C0C0C0";
                        document.styleSheets[1].insertRule("#btn:before{position:absolute;display:block;content:'';left:24%;top:-45%;border-width:"+0.05*window.screen.width+"px;border-style:solid;border-color:transparent;border-bottom-color:#C0C0C0;}",0);
                        //灰色按钮
                        $('#btn').attr("disabled",true);
                    }
                }
            },
            error:function (error) {
                console.log(error);
                weui.alert("获取当天投票数失败");
            }
        })
    }
    function prizeInfoContact() {
        $.ajax({
            url:urlServer+urlPrizeInfo,
            data:{
                actName:name
            },
            async:false,
            success:function (data) {
                var code=data.code;
                if(code==200){
                    display=data.data;
                    var len=display.length;
                    for(var i=0;i<len;i++){
                        ratio[i]=0;
                    }
                    drawCanvas(display);
                }
            }
        })
    }
    // var options={
    //     url:urlYuming+"/prize/page/test",
    //     urlServerauth:urlServer+"/user/do-auth",
    //     APPID:APPIDall
    // };
    function drawCanvas(display) {
        var canvas = document.getElementById('canvas');
        var con=window.screen.width;
        canvas.width= con*0.9;
        canvas.height=con*0.9;
        var offWidth = con*0.9;
        var btn = document.getElementById('btn');
        document.getElementById("turntable").style.height=con*0.92+"px";
        document.getElementById("turntable").style.display="block";
        document.getElementById("description").style.fontSize=0.04*con+"px";
        document.getElementById("description").style.display="block";
        document.getElementById("btn").style.height=0.2*con+"px";
        document.getElementById("btn").style.width=0.2*con+"px";
        document.getElementById("btn").style.top=0.35*con+"px";
        document.getElementById("btn").style.left=0.4*con+"px";
        document.getElementById("btn").style.fontSize=0.045*con+"px";
        document.getElementById("times").style.fontSize=0.04*con+"px";
        document.getElementById("img").style.height=0.5*window.screen.width+"px";
        document.getElementById("img").style.width=window.screen.width+"px";
        document.getElementById("title").style.fontSize=0.05*con+"px";    //上面的代码为不同屏宽移动端动态设计元素尺寸
        var ctx = canvas.getContext('2d');
        ctx.save();//绘制转盘
        ctx.beginPath();
        ctx.translate(parseInt(offWidth/2), parseInt(offWidth/2));
        ctx.moveTo(0, 0);
        ctx.rotate(i/num*Math.PI);
        ctx.arc(0, 0, parseInt(offWidth/2), 0 , Math.PI*2, false);
        ctx.fillStyle = '#c71f16';
        ctx.fill();
        ctx.restore();
        ctx.save();
        ctx.beginPath();
        ctx.translate(parseInt(offWidth/2), parseInt(offWidth/2));
        ctx.moveTo(0, 0);
        ctx.rotate(i/num*Math.PI);
        ctx.arc(0, 0, parseInt(offWidth/2)*0.965, 0 , Math.PI*2, false);
        ctx.fillStyle = '#eee966';
        ctx.fill();
        ctx.restore();

        var num = display.length;
        for ( var i = 0; i < 2*num; i++) {
            // 保存当前状态
            ctx.save();
            // 开始一条新路径
            ctx.beginPath();
            // 位移到圆心，下面需要围绕圆心旋转,初始扇形是3点钟方向
            ctx.translate(parseInt(offWidth/2), parseInt(offWidth/2));
            // 从(0, 0)坐标开始定义一条新的子路径
            ctx.moveTo(0, 0);
            ctx.rotate(i/num*Math.PI);
            ctx.arc(0, 0, parseInt(offWidth/2)*0.94, -2/180*Math.PI , Math.PI / num, false);//false顺时针
            ctx.fillStyle = color[parseInt(i/2)];
            ctx.fill();
            if(i%2==1){
                ctx.fillStyle = '#5A0000';
                ctx.font=""+parseInt(offWidth/20)+"px sans-serif";
                console.log(display[parseInt(i/2)]);
                ctx.fillText(display[parseInt(i/2)], parseInt(offWidth/4), parseInt(con/70));
            }
            ctx.lineWidth = 0.01;
            ctx.strokeStyle = '#f48d24';
            ctx.stroke();
            // img.src="C:/bw/demo10.jpg"
            // ctx.drawImage(img,200,20,100,100);
            ctx.restore();
            // if(i%2==0){
            //     ctx.rotate(i/num*Math.PI);
            //     ctx.arc(0, 0, parseInt(offWidth/2)*0.94, -2/180*Math.PI , Math.PI / num, false);//false顺时针
            //     ctx.fillStyle = color[parseInt(i/2)];
            //     ctx.fill();
            //     ctx.lineWidth = 0.01;
            //     ctx.strokeStyle = '#f48d24';
            //     ctx.stroke();
            //      // img.src="C:/bw/demo10.jpg"
            //      // ctx.drawImage(img,200,20,100,100);
            //     ctx.restore();
            // }
            // else{
            //     ctx.rotate(i/num*Math.PI);
            //     ctx.arc(0, 0, parseInt(offWidth/2)*0.94, 0 , Math.PI / num, false);
            //     ctx.fillStyle = color[parseInt(i/2)];
            //     ctx.fill();
            //     ctx.fillStyle = '#fff';
            //     ctx.font=""+parseInt(offWidth/20)+"px sans-serif";
            //     ctx.fillText(display[list[parseInt(i/2)]-1], parseInt(offWidth/4), parseInt(con/70));
            //     ctx.restore();
            // }
        }   //绘制盘面
    }

    function callbackA(id) {                
        openId=id; 
        console.log(id);
        $('#btn').on("click",function(){
            isAble(openId);
        });
        //是否关注判断，，注释掉
        // $.ajax({
        //     url:urlServer+'/common/is-subscribe',
        //     type:'POST',
        //     data:{
        //         "openId":openId
        //     },
        //     success:function(data){
        //         var code=data.code;
        //         if(code==200){
        //             var result=data.data.result;
        //             // alert(result);
        //             if(result==true){
        //                 $('#btn').on("click",function(){
        //                     isAble(openId);
        //                 });
        //             }
        //             else if(result==false){
        //                 $('#btn').on("click",function(){
        //                     $('#Dialog').fadeIn(200);
        //                 });
        //             }
        //         }
        //     },
        //     error:function(error){
        //         console.log(error);
        //         alertNew("获取是否关注失败");
        //         alertShow();
        //     }
        // });
        
    }
    $('#btn').on("click",function(){
        var now=Date.now();
        if(now<Date.parse(begin)){
            weui.alert("抽奖尚未开始");
        }else if(now>Date.parse(begin)&&now>Date.parse(end)){
            weui.alert("抽奖已结束");
        }else if(now>Date.parse(begin)&&now<Date.parse(end)){
            if (countprize==0){
                weui.alert("抽奖次数已达上限");
            }
            else{
                isHasDraw(openId);
            }
        }
    })  
    function isHasDraw() {
        $.ajax({
            url:urlServer+"/luck/is-has-draw",
            data:{
                "openId":openId
            },
            type:"get",
            // dataType :"jsonp",
            // jsonpCallback:"fun",
            success:function(response){
                console.log(response);
                if(response.code==200&&response.data.result==true){
                    if(countprize==null){
                        countprize=1;
                        setCookie_timedetail("countprize",countprize,'24:00:00');
                    }
                    if(countprize==0){
                        document.getElementById("btn").style.backgroundColor="#C0C0C0";
                        document.styleSheets[1].insertRule("#btn:before{position:absolute;display:block;content:'';left:24%;top:-45%;border-width:"+0.05*window.screen.width+"px;border-style:solid;border-color:transparent;border-bottom-color:#C0C0C0;}",0);
                        //灰色按钮
                        $('#btn').attr("disabled",true);
                        weui.alert("今日抽奖次数已用完!");
                    }else{
                        getRewardsItems(true);
                    }
                }
                else if(response.code==200&&response.data.result==false){
                    document.getElementById("btn").style.backgroundColor="#C0C0C0";
                    document.styleSheets[1].insertRule("#btn:before{position:absolute;display:block;content:'';left:24%;top:-45%;border-width:"+0.05*window.screen.width+"px;border-style:solid;border-color:transparent;border-bottom-color:#C0C0C0;}",0);
                    //灰色按钮
                    $('#btn').attr("disabled",true);
                    var msg=response.data.msg;
                    weui.alert(msg);
                }
            },
            error:function(error){
                console.log(error)
                weui.alert("抽奖页面出错");
            }
        })
    }
//     getWeChatId(options,callbackA);
    function getRewardsItems(param){
        $.ajax({
            url:urlServer+"/luck/get-win-info",
            data:{
                "actName":name
            },
            type:"get",
            success:function(res){
                console.log(res);
            var obj = res;
            var num = display.length;
            if(obj.code==200){
                flag=param;
                // var count = 0;
                // for(var cou=0;cou<ratio.length;cou++){
                    // if(display[cou]==obj.data.type)
                        // count++;     //计算有几个盘面是该类奖项
                // }
                for(var cou=0;cou<ratio.length;cou++){
                    if(display[cou]==obj.data.type)
                        ratio[cou]=1;
                        //ratio[cou]=1/count;       //修改ratio数组概率
                }
                if(!canvas.getContext){
                    weui.alert('抱歉！浏览器不支持。');
                    return;
                }
                document.styleSheets[1].insertRule("#btn:before{position:absolute;display:block;content:'';left:24%;top:-45%;border-width:"+0.05*window.screen.width+"px;border-style:solid;border-color:transparent;border-bottom-color:red;}",0);
                //红色按钮
                var n = Math.floor(Math.random()*360/num);
                if(360/num-n<4)
                    n=n-4;
                else if(n<4)
                    n=n+4;
                var temp = Math.floor(Math.random()*1000);
                var sum = 0;
                var degr = n + 1800;
                for(j = 1; j <= num; j++){
                    if(sum <= temp && temp < sum + 1000 * ratio[j-1]){
                        m = j-1;
                        if(360/num*j<270)
                            degr = degr + 270 - 360/num*j;
                        else
                            degr = degr + 630 - 360/num*j;
                        break;
                    }
                    else{
                        sum = sum + 1000 * ratio[j-1];
                    }
                }    //控制转盘转动停止位置
                var flag2=0;
                console.log("!");
                // btn.onclick = function(){          //点击按钮转动并调用接口
                if(flag==true){
                    flag=false;
                    canvas.style.transform = 'rotate('+ degr +'deg)';//转动语句
                    function hello(){
                        var postflag=false;
                        if(postflag==false){
                            postflag=true;
                            $.ajax({
                            url:urlServer+"/luck/post-draw",
                            data:{
                                "openId":openId,
                                "prizeId":obj.data.prizeId,
                                "collectId":id,
                                "actName":name,
                            },
                            type:"post",
                            success:function(result){
                                console.log(result);
                                var temper = result;
                                if(temper.code==200){
                                    var id=result.data.id;
                                    console.log(id);
                                    postflag=false;
                                    if(countprize>0){
                                        --countprize;
                                    } 
                                    document.getElementById("btn").style.backgroundColor="#C0C0C0";
                                    document.styleSheets[1].insertRule("#btn:before{position:absolute;display:block;content:'';left:24%;top:-45%;border-width:"+0.05*window.screen.width+"px;border-style:solid;border-color:transparent;border-bottom-color:#C0C0C0;}",0);
                                    //灰色按钮
                                    $('#btn').attr("disabled",true);
                                    setCookie_timedetail("countprize",countprize,'24:00:00');
                                    window.location.href="../../personal/page/prize?id="+id;//页面跳转语句
                                }
                                else if(temper.code==500){
                                    document.getElementById("btn").style.backgroundColor="#C0C0C0";
                                    document.styleSheets[1].insertRule("#btn:before{position:absolute;display:block;content:'';left:24%;top:-45%;border-width:"+0.05*window.screen.width+"px;border-style:solid;border-color:transparent;border-bottom-color:#C0C0C0;}",0);
                                    //灰色按钮
                                    $('#btn').attr("disabled",true);
                                    weui.alert(temper.error.msg);
                                }
                            },
                            error:function(){
                                postflag=false;
                                console.log("发送抽奖信息出错");
                                weui.alert("发送抽奖信息出错");
                            }
                        })
                        }
                        
                    } window.setTimeout(hello,6000);
                }
            // }
        }
            else{
                weui.alert(obj.error.msg+"请刷新页面重试！");
            }
            },
            error:function(){
                weui.alert("获取抽奖信息出错");
            }
        });
    }
})
// function isAble(openId){
//
//     // var votestatus=getCookie("votestatus");
//     // alertNew(votestatus);
//     // console.log(votestatus);
//     // if(votestatus==null||votestatus=="null"){
//     //     document.getElementById("btn").style.backgroundColor="#C0C0C0";
//     //     document.styleSheets[1].insertRule("#btn:before{position:absolute;display:block;content:'';left:24%;top:-45%;border-width:"+0.05*window.screen.width+"px;border-style:solid;border-color:transparent;border-bottom-color:#C0C0C0;}",0);
//     //灰色按钮
//     // btn.onclick = function(){
//     //     alertNew("您尚未投票!");
//     //     alertShow();
//     // }
//     // }
//     // else if(votestatus=="true"||votestatus==true){
//
//     // }
// }
// function isSubscribe() {
//     $.ajax({
//         url:urlServer+'/common/is-subscribe',
//         type:'POST',
//         data:{
//             "openId":openId
//         },
//         success:function(data){
//             var code=data.code;
//             if(code==200){
//                 var result=data.data.result;
//                 // alert(result);
//                 if(result==true){
//                     isAble(openId);
//                 }
//                 else if(result==false){
//                     $('#Dialog').fadeIn(200);
//                 }
//             }
//         },
//         error:function(error){
//             console.log(error);
//             alertNew("获取权限信息失败");
//             alertShow();
//         }
//     });
// }
// $('#click_queding').on("click",function(){
//     var imghtml='<div><img src="../resource/jpg/logo.jpg" style="width:82%"></div><div>长按二维码，了解更多相关信息</div>';
//     $('#alert .weui_dialog_ft a').html('关闭');
//     alertNew(imghtml);
//     alertShow();
//     $('.js_dialog').fadeOut(200);
// });
//
// $('#click_quxiao').on("click",function(){
//     $(this).parents('.js_dialog').fadeOut(200);
// });



