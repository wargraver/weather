$(document).ready(function(){function e(){var e,t,a,o={},r=(navigator.appVersion,navigator.userAgent),n=navigator.appName,i=""+parseFloat(navigator.appVersion),s=parseInt(navigator.appVersion,10);-1!=(t=r.indexOf("Opera"))?(n="Opera",i=r.substring(t+6),-1!=(t=r.indexOf("Version"))&&(i=r.substring(t+8))):-1!=(t=r.indexOf("MSIE"))?(n="Microsoft Internet Explorer",i=r.substring(t+5)):-1!=(t=r.indexOf("Chrome"))?(n="Chrome",i=r.substring(t+7)):-1!=(t=r.indexOf("Safari"))?(n="Safari",i=r.substring(t+7),-1!=(t=r.indexOf("Version"))&&(i=r.substring(t+8))):-1!=(t=r.indexOf("Firefox"))?(n="Firefox",i=r.substring(t+8)):(e=r.lastIndexOf(" ")+1)<(t=r.lastIndexOf("/"))&&(n=r.substring(e,t),i=r.substring(t+1),n.toLowerCase()==n.toUpperCase()&&(n=navigator.appName)),-1!=(a=i.indexOf(";"))&&(i=i.substring(0,a)),-1!=(a=i.indexOf(" "))&&(i=i.substring(0,a)),s=parseInt(""+i,10),isNaN(s)&&(i=""+parseFloat(navigator.appVersion),s=parseInt(navigator.appVersion,10));var c="Browser name  : "+n+"<br>Full version  : "+i+"<br>Major version : "+s+"<br>navigator.appName : "+navigator.appName+"<br>navigator.userAgent : "+navigator.userAgent+"<br>",l="Unknown OS";return-1!=navigator.appVersion.indexOf("Win")&&(l="Windows"),-1!=navigator.appVersion.indexOf("Mac")&&(l="MacOS"),-1!=navigator.appVersion.indexOf("X11")&&(l="UNIX"),-1!=navigator.appVersion.indexOf("Linux")&&(l="Linux"),c+="OS: "+l+"<br>",o.browserName=n,o.fullVersion=i,o.majorVersion=s,o.appName=navigator.appName,o.userAgent=navigator.userAgent,o.osName=l,o.allDetails=c,o}$(window).scroll(function(){$(this).scrollTop()>200?$(".header--scrollTop__btn").stop().fadeIn():$(".header--scrollTop__btn").stop().fadeOut()}),$(".header--scrollTop__btn").click(function(){return $("html, body").animate({scrollTop:0},600),!1}),$(".header--profile__dropdown").click(function(){$(".header--dropdown__profile").toggleClass("header--dropdown__profile-open")}),$("body").click(function(e){$(e.target).hasClass("header--dropdown__profile")||$(e.target).parents(".header--dropdown__profile").length||$(e.target).parents(".header--profile__dropdown").length||$(".header--dropdown__profile").removeClass("header--dropdown__profile-open"),$(e.target).hasClass("header--dropdown__trackmenu")||$(e.target).parents(".header--dropdown__trackmenu").length||$(e.target).hasClass("header--tracks__dropdown")||$(".header--dropdown__trackmenu").hide(),$(e.target).hasClass("header--batches__button")||$(e.target).parents(".header--batches__content").length||$(e.target).hasClass(".header--batches__content")||($(".header--batches__button").removeClass("header--batches__button-move"),$(".header--batches__content").removeClass("header--batches__content-move")),$(e.target).parents(".header--notification__trigger").length||$(e.target).parents(".header--notification__content").length||$(e.target).hasClass(".header--notification__content")||$(".header--notification__content").hide()}),$(".header--search__trigger").click(function(){$(".header--search").addClass("header--search__visible"),$("#header--search__input").focus()}),$(".header--icon_close").click(function(e){e.preventDefault(),$(".header--search").removeClass("header--search__visible"),$("#header--search__input").val(""),$(".gsc-results-close-btn").click()}),$("#header--search__input").keyup(function(){var e=$.Event("keyup");$("#gsc-i-id1").val($(this).val()).focus().trigger(e)}),$("body").keyup(function(e){$("#header--search__input").val($("#gsc-i-id1").val())}),$(".gsc-search-button").keydown(function(e){$("#header--search__input").val($("#gsc-i-id1").val())}),$("body").on("click",".gsc-results-close-btn",function(){$(".header--search").hasClass("header--search__visible")&&$(".header--icon_close").click()}),$(".header--batches__button").click(function(){$(this).toggleClass("header--batches__button-move"),$(".header--batches__content").toggleClass("header--batches__content-move"),$(".header--batches__content").html('<center><div class="header--loader"></div></center>'),$.ajax({type:"POST",url:"/ajax/fetchUserBatchDetails.php",data:{},success:function(e){var t=JSON.parse(e);1==t.status&&$(".header--batches__content").html(t.batchEnrolled)},error:function(e){$(".header--batches__content").html("Some error occurred")}})}),$(".header--nav__items--left .header--nav__item").each(function(){var e=$(this).children("a").attr("href");-1!=window.location.href.indexOf(e)&&($(this).addClass("active"),$(this).children("a").addClass("active"))}),$(window).width()<769&&($("#sidr").html($("nav:eq(0)").find(".header--sidebar").clone()),$("#header--menu__icon").sidr({name:"sidr",speed:200,side:"left",source:null,renaming:!0,body:"body"}),$("body").on("click",".login-modal-btn",function(){$("body").hasClass("sidr-open")&&$("#header--menu__icon").trigger("click")})),$(".header--tracks__dropdown").click(function(){$(".header--dropdown__trackmenu").toggle()}),$("#reportIssueHeaderMail").click(function(){if(""==$("#issueDescription").val())return alert("Please describe your issue."),!1;$.ajax({type:"POST",url:"/ajax/testCasesMail.php",data:{requestType:"reportIssueHeader",issue:$("#issueDescription").val(),requestUrl:window.location.href},success:function(e){$("#commentModalHeader .modal-body p").text(e),$("#commentModalHeader").modal("show")}})}),$.ajax({type:"POST",url:"/ajax/fetchUserDetails.php",data:{},success:function(e){var t=JSON.parse(e);1==t.status&&($(".header--user__avatar").attr("src",t.userProfieImage),$(".header--username").html(t.userHandle),$(".header--profile__link").attr("href","https://auth.geeksforgeeks.org/user/"+t.userHandle+"/practice/"))}}),$(".header--notification__trigger").click(function(){$(".header--notification__content").is(":visible")||($(".header--notification__badge").hide(),$.ajax({type:"GET",url:"/ajax/fetchUserNotification.php",data:{requestType:"fetchHeaderNotification"},success:function(e){var t=JSON.parse(e);$(".header--notification__list").html(t.response)},error:function(e){$(".header--notification__list").html("Some error occurred")}})),$(".header--notification__content").toggle()}),$("body").on("click",".notification--archive",function(e){$.ajax({type:"POST",url:"/ajax/fetchUserNotification.php",data:{requestType:"archiveAllNotification"},success:function(e){"success"==JSON.parse(e).status&&($(".notification--archive").hide(),$(".notify_item").each(function(e){$(this).removeClass("notify_unread")}),$(".header--notification__badge").hide(),$(".header--notification__list").html("</br><center>You have no new notifications</center>"))}})}),$("body").on("click",".notify_item",function(e){$.ajax({type:"POST",url:"/ajax/fetchUserNotification.php",context:this,data:{requestType:"archiveNotification",notificationId:$(this).attr("data-id")},success:function(e){"success"==JSON.parse(e).status&&($(this).removeClass("notify_unread"),window.location.href=""+$(this).attr("data-url"))}})}),$("#reportIssueMail").click(function(t){$(this);if(""==$.trim($("#reportIssueDescription").val()))return alert("Please describe your issue."),!1;var a=!1;$("#reportIssueMail[data-extraInfo]").length&&(a=$("#reportIssueMail").attr("data-extraInfo")),$.ajax({type:"POST",url:"/ajax/testCasesMail.php",data:{requestType:"reportIssue",issue:$("#reportIssueDescription").val(),requestUrl:window.location.href,pageTitle:$("title:first").text(),utoken:$("#reportIssueBtn").attr("utoken"),extraInfo:a,browserDetails:e().allDetails},success:function(e){$("#commentModal .modal-body p").html(e),e.length>3&&$("#commentModal").modal("show")}})}),$(document).on("keydown",function(e){27===e.keyCode&&$(".header--search").hasClass("header--search__visible")&&(e.preventDefault(),$(".header--icon_close").click())})}),$(document).ready(function(){if($(window).scroll(function(){$(this).scrollTop()>200?$("#scrollTopBtn").stop().fadeIn():$("#scrollTopBtn").stop().fadeOut()}),$("#scrollTopBtn").click(function(){return $("html, body").animate({scrollTop:0},600),!1}),$("body").on("click",".fullScrollBtn",function(){$("html,body").animate({scrollTop:$(".fullProblemTable").offset().top-35},"slow")}),$("body").on("click",".functionScrollBtn",function(){$("html,body").animate({scrollTop:$(".functionProblemTable").offset().top-35},"slow")}),$("body").on("click",".subjectiveScrollBtn",function(){$("html,body").animate({scrollTop:$(".subjectiveProblemTable").offset().top-35},"slow")}),$("body").on("click",".contestsScrollBtn",function(){$("html,body").animate({scrollTop:$(".contestsProblemTable").offset().top},"slow")}),$("body").on("click",".toggleTree",function(){$(this).closest(".branch").find("i").toggleClass("glyphicon-plus-sign glyphicon-minus-sign"),$(this).closest(".branch").find(".treeElements").stop().toggle(800)}),$(window).width()<768){$(".branch").find("i").toggleClass("glyphicon-plus-sign glyphicon-minus-sign"),$(".treeElements").hide();var e=$(".leftTreeDiv").clone();$(".leftTreeDiv").remove(),e.insertBefore("#col_sidebar"),e.insertBefore($("#sidebar").parent())}$(function(){0!=$('[data-toggle="tooltip"]').length&&$('[data-toggle="tooltip"]').tooltip()}),$("body").tooltip({selector:"[data-toggle=tooltip]"}),$("body").on("click",".rulesModalTriggerBtn",function(){$("#rulesModal").modal("show")})});