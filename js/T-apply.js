/**
 * Created by Administrator on 2017/3/8.
 */
$(function(){
    $(".more .p1").click(function(){
        $(".Tog").toggleClass("hide");
        if($(".Tog").hasClass("hide")){
            $(".more .p1 img").prop("src","../imgs/T/T-more.png")
        }else{
            $(".more .p1 img").prop("src","../imgs/T/T-less.png")
        }

    })
})