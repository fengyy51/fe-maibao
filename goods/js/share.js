//微信分享接口
$(function(){
    var urlVoteParam="/vote/get-vote-param";
    var request_url = urlServer+"/common/js-sdk-config?url="+encodeURIComponent(location.href);

    var countff=getCookie("countff");//投票次数
    var countprize=getCookie("countprize");//抽奖次数
    var shareflagvote=getCookie("shareflagvote");//投票分享次数
    var shareflagprize=getCookie("shareflagprize");//抽奖分享次数

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

    var actId=getQueryString("id");
    var countsharecircle=0,countsharefriend=0;//初始化分享朋友圈，分享朋友次数
    if(getCookie("countsharecircle")==null||getCookie("countsharecircle")=="null"){
        setCookie_29("countsharecircle",0);
    }
    if(getCookie("countsharefriend")==null||getCookie("countsharefriend")=="null"){
        setCookie_29("countsharefriend",0);
    }
    voteParamContact();
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
                    //初始化投票抽奖次数，初始均为voteNum，，
                    if(shareflagprize==null||shareflagprize=="null"){
                        var shareflagprize=0;
                        setCookie_timedetail("shareflagprize",shareflagprize,'24:00:00');
                    }
                    if(shareflagvote==null||shareflagvote=="null"){
                        setCookie_timedetail("shareflagvote",voteNum,'24:00:00');
                    }
                    if(countprize==null||countprize=="null"){
                        var countprize=0;
                        setCookie_timedetail("countprize",countprize,'24:00:00');
                    }
                    if (countff==null||countff=="null") {
                        setCookie_timedetail("countff",voteNum,'24:00:00');
                    }
                }
            },
            error:function (error) {
                console.log(error);
                weui.alert("获取投票设置失败");
            }
        })
    }
    $.getJSON(
        request_url,
        function(data){
            var list=data.data;
            var AppID=list.appId;
            var nonceStr = list.nonceStr;
            var timestamp = list.timestamp;
            var signature = list.signature;
            // console.log(list);
            wx.config({
                debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                appId: AppID, // 必填，公众号的唯一标识,binwang
                timestamp: timestamp, // 必填，生成签名的时间戳
                nonceStr: nonceStr, // 必填，生成签名的随机串
                signature: signature,// 必填，签名，见附录1
                jsApiList: [// 必填，需要使用的JS接口列表
                    'onMenuShareTimeline',
                    'onMenuShareAppMessage'
                ]
            });
            wx.ready(function(){
                wx.onMenuShareTimeline({//分享到朋友圈
                    // title:$('#title').html(),
                    title: $('.left').text(), // 分享标题
                    // title: '寻找造物主，投票赢大奖', // 分享标题
                    link: window.location.href, // 分享链接
                    // imgUrl: 'http://binwang.oss-cn-hangzhou.aliyuncs.com/fimg/1.jpg', // 分享图标
                    imgUrl:'http://scratch2-wechat.oss-cn-hangzhou.aliyuncs.com/logo.png',//地址需要短，不能有中文 http协议
                    // imgUrl:'https://scratch-upload.oss-cn-hangzhou.aliyuncs.com/img/7f855cd0cc52438786d616e352296ee2---28_页面_1.jpg',
                    // imgUrl:'https://scratch-upload.oss-cn-hangzhou.aliyuncs.com/img/1978042d7b5546f9b3cfcfc6651024c4---分享图片.png',
                    success: function () {
                        // 用户确认分享后执行的回调函数
                        weui.alert('分享成功');
                        var prizeflag=getCookie("prizeflag");
                        var shareflagvote=getCookie("shareflagvote");
                        var shareflagprize=getCookie("shareflagprize");
                        var countff=getCookie("countff");
                        var countprize=getCookie("countprize");
                        if(shareNum==true||shareNum=='true'){
                            if(shareflagvote<voteMaxNum){
                                countff++;
                                shareflagvote++;
                            }
                        }
                        //增加分享朋友圈次数
                        countsharecircle=getCookie("countsharecircle");//记录分享朋友圈的次数
                        if(countsharecircle!=null||countsharecircle!="null"){
                            ++countsharecircle;
                            setCookie_timedetail("countsharecircle",countsharecircle,"24:00:00");
                        }

                        // if(shareflagprize<3&&countprize<3){
                        //     countprize++;
                        //     shareflagprize++;
                        // }
                        // if(shareflagvote<3&&countff<voteNum){
                        //     countff++;
                        //     shareflagvote++;
                        // }
                        setCookie_timedetail("countprize",countprize,'24:00:00');
                        setCookie_timedetail("shareflagvote",shareflagvote,'24:00:00'); 
                        setCookie_timedetail("shareflagprize",shareflagprize,'24:00:00');  
                        setCookie_timedetail("countff",countff,'24:00:00');
                    },
                    cancel: function () {
                        // 用户取消分享后执行的回调函数
                    }
                });
                wx.onMenuShareAppMessage({//分享给朋友
                    title: $('.left').text(), // 分享标题
                    // title: '寻找造物主，投票赢大奖', // 分享标题
                    // desc: '描述测试', // 分享描述
                    // desc: '义乌市“望道杯”青少年电脑作品制作大赛十佳作品评选开始啦!邀请您和您的朋友赶快来参与投票吧！', // 分享描述
                    link: window.location.href, // 分享链接
                    // imgUrl: 'http://binwang.oss-cn-hangzhou.aliyuncs.com/fimg/1.jpg', // 分享图标
                    imgUrl:'http://scratch2-wechat.oss-cn-hangzhou.aliyuncs.com/logo.png',
                    // imgUrl:'https://scratch-upload.oss-cn-hangzhou.aliyuncs.com/img/7f855cd0cc52438786d616e352296ee2---28_页面_1.jpg',
                    // imgUrl:'https://scratch-upload.oss-cn-hangzhou.aliyuncs.com/img/1978042d7b5546f9b3cfcfc6651024c4---分享图片.png',
                    type: 'link', // 分享类型,music、video或link，不填默认为link
                    dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
                    success: function () {
                        // 用户确认分享后执行的回调函数

                        weui.alert('分享成功');
                        var prizeflag=getCookie("prizeflag");
                        var shareflagvote=getCookie("shareflagvote");
                        var shareflagprize=getCookie("shareflagprize");
                        var countff=getCookie("countff");
                        var countprize=getCookie("countprize");
                        console.log(shareNum);
                        if(shareNum==true||shareNum=='true'){
                            if(shareflagvote<=voteMaxNum){
                                countff++;
                                shareflagvote++;
                            }
                        }
                        //增加分享朋友圈次数
                        countsharefriend=getCookie("countsharefriend");//记录分享朋友的次数
                        if(countsharefriend!=null||countsharefriend!="null"){
                            ++countsharefriend;
                            setCookie_timedetail("countsharefriend",countsharefriend,"24:00:00");
                        }
                        setCookie_timedetail("countprize",countprize,'24:00:00');
                        setCookie_timedetail("shareflagvote",shareflagvote,'24:00:00');
                        setCookie_timedetail("shareflagprize",shareflagprize,'24:00:00');
                        setCookie_timedetail("countff",countff,'24:00:00');

                        // var voteflag=getCookie("voteflag");
                        // shareflagvote=getCookie("shareflagvote");
                        // countff=getCookie("countff");
                        // if(voteflag==null&&countff<3){
                        //     countff++;
                        //     shareflagvote++;
                        // } 
                        // setCookie_time("shareflagvote",shareflagvote,24*60*60);   
                        // setCookie_time("countff",countff,24*60*60);
                        // if(shareflagvote==3){
                        //     setCookie_time("voteflag",true,24*60*60);
                        // }
                    },
                    cancel: function () {
                        // 用户取消分享后执行的回调函数
                    }

                });
            });
            wx.error(function(){});
        }
    );


})