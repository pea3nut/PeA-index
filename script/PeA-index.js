// +----------------------------------------------------------------------
// | PeA-index ( https://github.com/pea3nut/PeA-index )
// +----------------------------------------------------------------------
// | Copyleft (c) 2016 http://pea.nutjs.com All rights reserved.
// +----------------------------------------------------------------------
// | Author: 花生PeA <626954412@qq.com>
// +----------------------------------------------------------------------
// | Data: 2016-3-31
// +----------------------------------------------------------------------

(function(){
    /**
     *
     * @param tierNum
     * @constructor
     */
    jQuery.PeAIndex =function(tierNum){
        this.prefix      =new Function();
        this.indexElt    =new Array();
        this.addPrefix   =new Boolean();
        this.tpl         =new Function();
        this.indexHtml   =new String();
        //调用构造方法
        this.__construct.apply(this ,arguments);
    };
    jQuery.PeAIndex.prototype ={
        "varsion"        :"1.0.0",
        "index"          :new Function(),
        "getIndexPrefix" :new Function(),
        "getIndexHtml"   :new Function(),
        "defaultPrefix"  :new Array(),
        "letterPrefix"   :new Array(),
        "numberPrefix"   :new Array(),
        "prefixTpl"      :{
            "default" :function(){},
            "zhTier"  :function(){}
        }
    };
    //添加标识符
    window.PeA_nut =window.PeA_nut ||[];
    window.PeA_nut.push({"PeA-index":jQuery.PeAIndex["varsion"]});
})();
//PeAIndex对象
jQuery.PeAIndex.prototype['__construct'] =function(tierNum){
    //标题前缀
    this.prefix =this.prefixTpl.default;
    //要索引的元素集合
    this.indexElt =(function(){
        var arr =[];
        for (var i = 0; i < tierNum; i++) {
            arr.push( jQuery('h' +(i+2)) );
        };
        return arr;
    })();
    //是否添加前导数字
    this.addPrefix =false;
    //生成索引的模板
    this.tpl =this.createDefaultIndexHtml;
    //最终生成的索引的HTML
    this.indexHtml ='';
    //运行时变量，请勿修改
    this.indexNum=(function(){
        var arr =new Array(tierNum);
        for (var i = 0; i < tierNum; i++) {
            arr[i] =0;
        };
        return arr;
    })();
};
jQuery.PeAIndex.prototype.prefixTpl.default =function($elt){
    var reMsg =[];
    for (var i = 0; i < 1+ +$elt.attr("PeA-index"); i++) {
        reMsg.push(this.indexNum[i]);
    };
    reMsg[reMsg.length-1]++;
    return reMsg.join(".")+" ";
};
jQuery.PeAIndex.prototype.prefixTpl.zhTier =function($elt){
    var reMsg =this.prefixTpl.default.call(this ,$elt);
    var zh =['一、','二、','三、','四、','五、','六、','七、','八、','九、','十、','十一、','十二、','十三、','十四、','十五、','十六、','十七、','十八、','十九、','二十、'];
    if(parseInt(reMsg) == reMsg){
        return zh[reMsg-1];
    };
    return reMsg;
};
jQuery.PeAIndex.prototype['index']=function(){
    var PeAIndex =this;
    //深度优先遍历文档树，获取排序元素的文档排列顺序
    var tarElt =[];
    $("*").each(function(){
        for(var i=0;i<PeAIndex.indexElt.length;i++){
            if(PeAIndex.indexElt[i].is(this)){
                tarElt.push(jQuery(this).attr("PeA-index",i));
                break;
            };
        };
    });
    //遍历要索引的元素
    for (var i = 0; i < tarElt.length; i++) {
        //若元素没有ID则添加一个ID
        if(!tarElt[i].attr("id")) tarElt[i].attr("id" ,"PeA-index-"+tarElt[i].html());
        //添加前导数字
        if (PeAIndex.addPrefix) {
            //获取前导字符
            var tpPrefix =PeAIndex.getIndexPrefix(tarElt[i]);
            //更新html内容
            tarElt[i].html(
                tpPrefix +
                tarElt[i].html()
            );
        };
        //记录HTML
        PeAIndex.indexHtml +=PeAIndex.getIndexHtml(tarElt[i]);
    };
};
jQuery.PeAIndex.prototype['getIndexPrefix']=function($elt){
    //元素标题等级
    var eltLv =$elt.attr("PeA-index");
    //更新所有子标题的索引
    for (var i = +eltLv+1; i < this.indexNum.length; i++) {
        this.indexNum[i] =0;
    };
    //计算前缀
    var thisPrefix ='';
    thisPrefix =this.prefix.call(this ,$elt);
    //更新索引
    this.indexNum[eltLv]++;
    //返回索引字符
    return thisPrefix;
};
jQuery.PeAIndex.prototype['getIndexHtml']=function($elt){
    var html =$elt.html();
    html =html.replace(/<[^<>]*>/g ,'');
    return '<div style="margin-left:'+$elt.attr("PeA-index")+'0px"><a href="#'+$elt.attr("id")+'">'+html+'</a></div>';
};