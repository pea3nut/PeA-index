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
	//成员列表
	jQuery.PeAIndex =function(){
		this.prefix		=new Array();
		this.indexElt	=new Array();
		this.addPrefix	=new Boolean();
		this.tpl		=new Function();
		this.indexHtml	=new String();
		//调用构造方法
		this.__construct.apply(this ,arguments)
	};
	jQuery.PeAIndex.prototype ={
		"varsion"		:"1.0.0",
		"index"			:new Function(),
		"getIndexPrefix":new Function(),
		"getIndexHtml"	:new Function(),
		"defaultPrefix"	:new Array(),
		"letterPrefix"	:new Array(),
		"numberPrefix"	:new Array(),
	};
	//添加标识符
	window.PeA_nut =window.PeA_nut ||[];
	window.PeA_nut.push({"PeA-index":jQuery.PeAIndex["varsion"]});
})();
//PeAIndex对象
jQuery.PeAIndex.prototype['__construct'] =function(){
	//标题前缀
	this.prefix =this.defaultPrefix;
	//要索引的元素集合
	this.indexElt =[
		arguments[0] ?arguments[0] :jQuery('h1'),
		arguments[1] ?arguments[1] :jQuery('h2'),
		arguments[2] ?arguments[2] :jQuery('h3'),
	];
	//是否添加前导数字
	this.addPrefix =false;
	//生成索引的模板
	this.tpl =this.createDefaultIndexHtml;
	//最终生成的索引的HTML
	this.indexHtml ='';
	//运行时变量，请勿修改
	this.indexNum=[0,0,0,0];
};
jQuery.PeAIndex.prototype['defaultPrefix'] =[
	['一、','二、','三、','四、','五、','六、','七、','八、','九、','十、','十一、','十二、','十三、','十四、','十五、','十六、','十七、','十八、','十九、','二十、'],
	['㈠ ','㈡ ','㈢ ','㈣ ','㈤ ','㈥ ','㈦ ','㈧ ','㈨ ','㈩ '],
	function ($No){return $No+1+'.'},
	['① ','② ','③ ','④ ','⑤ ','⑥ ','⑦ ','⑧ ','⑨ ','⑩ ','⑪ ','⑫ ','⑬ ','⑭ ','⑮ ','⑯ ','⑰ ','⑱ ','⑲ ','⑳ '],
];
jQuery.PeAIndex.prototype['letterPrefix'] =[
	function ($No){return $No+1+'.'},
	function ($No){return String.fromCharCode(65+$No)+'.'},
	function ($No){return String.fromCharCode(97+$No)+'.'}
];
jQuery.PeAIndex.prototype['numberPrefix'] =[
	function ($No){return $No+1+'.'},
	function ($No){return '('+($No+1)+') '},
	['① ','② ','③ ','④ ','⑤ ','⑥ ','⑦ ','⑧ ','⑨ ','⑩ ','⑪ ','⑫ ','⑬ ','⑭ ','⑮ ','⑯ ','⑰ ','⑱ ','⑲ ','⑳ '],
];
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
}
jQuery.PeAIndex.prototype['getIndexPrefix']=function($elt){
	//元素标题等级
	var eltLv =$elt.attr("PeA-index");
	//更新所有子标题的索引
	for (var i = +eltLv+1; i < this.indexNum.length; i++) {
		this.indexNum[i] =0;
	}
	//计算前缀
	var thisPrefix ='';
	thisPrefix =this.prefix[eltLv];
	switch(typeof thisPrefix){
		case 'function':
			thisPrefix =thisPrefix(this.indexNum[eltLv]);
			break;
		case 'object':
			thisPrefix =thisPrefix[this.indexNum[eltLv]];
			break;
	};
	//更新索引
	this.indexNum[eltLv]++;
	//返回索引字符
	return thisPrefix;
};
jQuery.PeAIndex.prototype['getIndexHtml']=function($elt){
	return '<div style="margin-left:'+$elt.attr("PeA-index")+'0px">'+$elt.html()+'</div>';
};

$(function(){
	var pea =new jQuery.PeAIndex();
	pea.addPrefix=true;
	pea.prefix =pea.numberPrefix;
	pea.index();
	open().document.write(pea.indexHtml);
});