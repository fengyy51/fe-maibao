/**
 * Created by yy on 2017/12/13.
 */
$(document).ready(function() {
    var urlProductInfo="/vote/get-vote-product-info";
    var actId=getQueryString("actId");
    var id=getQueryString("id");
    productInfoContact();
    // var j=location.search.replace(/[^\d]/g, "");
    var i;
    var wwidth=window.screen.width;
    function productInfoContact() {
        $.ajax({
            url: urlServer+urlProductInfo,
            data:{
                actId:actId
            },
            success: function(data) {
                var list = data.data;
                // makeList(list);//利用报名数据生成的投票详情页
                makeyiwuList(list);//利用系统中的信息采集生成的投票详情页
            },
            error: function(error) {
                alert('获取作品信息出错');
                console.log(error);
            }
        });
    }
    function makeyiwuList(list) {
        var obj={};
        for(var i=0;i<list.length;i++){
            if(list[i].id==id){
                obj=list[i];
                break;
            }
        }
        if(obj.id){
            var str1='<div class="content"><div id='+obj.id+'><b>编号</b>:<span class="content-span id">'+obj.id+'</div>';
            var content=obj.content;
            console.log(content);
            if(content.trim()!="") {
                // alert("s");
                var item = content.split("&&&");
                for (var j = 0; j < item.length; j++) {
                    var seperator = content.indexOf(":") > 0 ? ":" : "：";
                    var detail = item[j].split(seperator);
                    str1 += '<div id="' + detail[0] + '"><b>' + detail[0] + '</b>:' + '<span class="content-span">' + detail[1] + '</span></div>';
                }
            }
            var img=obj.imgUrl.slice(1,obj.imgUrl.length-1);
            console.log(img);
            var str2='<div class="swiper-slide"><img src='+img+'/></div> ';
            $('.swiper-wrapper').html(str2);
            $('.infor').html(str1);
            $('.swiper-wrapper img').height(wwidth*3/4);
        }

    }
    // function makeList(list) {
    //     var strHtml='';
    //     for(i=0;i<list.length;i++) {
    //         if (list[i].id == id) {
    //             break;
    //         }
    //     }
    //     var regItemlist=list[i].productInfo.split(";");
    //
    //         var strHtml2='<div class="content"><div id='+list[i].id+'><b>编号</b>:<span class="content-span id">'+list[i].id+'</div>';
    //         for(var j=0;j<regItemlist.length;j++){
    //             var title=regItemlist[j].split("?")[0];
    //             var val=regItemlist[j].split("?")[1];
    //             if(val.indexOf('http:')>=0){
    //                 var imglist=val.split("&");
    //                 var k=0;
    //                 for(;k<imglist.length;k++) {
    //                     var strHtml1='';
    //                     if(k<imglist.length-1) {
    //                         strHtml1 = '<div class="swiper-slide"><img src="'+imglist[k]+'"/></div> ';
    //                     }else {
    //                         strHtml1 = '<div class="swiper-slide"><img src="' + imglist[k] + '"/></div>';
    //                     }
    //
    //                     strHtml = strHtml + strHtml1;
    //                 }
    //                 if(k!=1){
    //                     strHtml=strHtml+ '<script>' +
    //                         "var swiper = new Swiper('.swiper-container', {" +
    //                         "pagination: '.swiper-pagination'," +
    //                         'paginationClickable: true' +
    //                         '});' +
    //                         '</script>';
    //                 }
    //                 $('.swiper-wrapper').html(strHtml);
    //
    //             }
    //             if(val.indexOf('http:')<0){
    //                 strHtml2+='<div id="'+title+'"><b>'+title+'</b>:'+'<span class="content-span">'+val+'</span></div>';
    //             }
    //         }
    //         strHtml2=strHtml2+'</div></div>';
    //
    //         $('.infor').html(strHtml2);
    //
    //     // }
    //     // for (i=0;i<list.length;i++){
    //     //     if (list[i].id==id){
    //     //         break;
    //     //     }
    //     // }
    //     // var strHtml = "";
    //     // var result=list[i].productImgUrls.split("@@@");
    //     // var length=result.length;
    //     // // console.log(length);
    //     // if(result[length-1]==""){
    //     //     length=length-1;
    //     //     // console.log(length);
    //     // }
    //     // var k=0;
    //     // for(;k<length;k++) {
    //     //     var strHtml1 = '<div class="swiper-slide"><img src="'+result[k]+'"/></div> ';
    //     //     strHtml = strHtml + strHtml1;
    //     // }
    //     // if(k!=1){
    //     //      strHtml=strHtml+ '<script>' +
    //     //         "var swiper = new Swiper('.swiper-container', {" +
    //     //         "pagination: '.swiper-pagination'," +
    //     //         'paginationClickable: true' +
    //     //         '});' +
    //     //         '</script>';
    //     // }
    //     // $('.swiper-wrapper').html(strHtml);
    //     // var strHtml2 = '<div class="content"><div class="id"><b>作品编号</b><span class="no1">' + list[i].id + '</span></div>' +
    //     //     '<div class="brandName"><b>作品名称</b><span class="name1">' + list[i].brandName+'</span></div>' +
    //     //     '<div class="name"><b>作品作者</b><span class="pname1">' + list[i].name+'</span></div>' +
    //     //     '<div class="intro"><b>作品简介</b><span class="intro1">' + list[i].intro + '</span></div></div>';
    //     // $('.infor').html(strHtml2);
    //     $('.swiper-wrapper img').height(wwidth*3/4);
    // }
})











