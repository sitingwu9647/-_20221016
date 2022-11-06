$(function(){
	// 1.鼠标移入显示，移出隐藏
	//      目标：手机京东，客户服务，网站导航，我的京东，去购物车结算，全部商品
		$('[name=show_hide]').hover(function(){//显示
			var id = this.id+'_items'
			$('#'+id).show()
		},function(){//隐藏
			var id = this.id+'_items'
			$('#'+id).hide()
		})
		// 2.鼠标移动切换二级导航菜单的切换显示和隐藏
		$('#category_items>div').hover(function(){
			$(this).children(':last').show() //当前发生事件元素的子元素,用原生很麻烦
		},function(){
			$(this).children(':last').hide()
		})

		// 3.输入搜索关键字，列表显示匹配的结果
		//显示:获得焦点(focus)且发生键盘按键抬起(keyup)时显示
		//隐藏:失去焦点(blur)
		
/* 		$('#txtSearch').focus()
		$('#txtSearch').blur() */
		//on一次可加多个监听
		$('#txtSearch')
		.on('keyup focus',function(){
			//显示:获得焦点(focus)且发生键盘按键抬起(keyup)时显示
			if(this.value.trim()){
				$('#search_helper').show()
			}
		})
		.blur(function(){
			//隐藏:失去焦点(blur)
			$('#search_helper').hide()
		})
		
		// 4.点击显示或者隐藏更多的分享图标
		var isOpen = false   //初始为关闭
		var $shareMore = $('#shareMore');
		var $parent = $shareMore.parent()
		var $as = $shareMore.prevAll('a:lt(2)')  //从下往上找  //lt 小于 [0] [1]
		var $b = $shareMore.children()
		
		$shareMore.click(function(){
			if(isOpen){//去关闭
				$parent.css('width',155)
				$as.hide()
				$b.removeClass('backword')
			}else{//去打开
				$parent.css('width',200)
				$as.show()
				$b.addClass('backword')
			}
			isOpen = !isOpen
		})
		
		// 5.鼠标移入移出切换地址的显示隐藏
		var $select = $('#store_select')
		$select.hover(function(){
			$select.children(':gt(0)').show()   //:gt() 选择器选取 index 值大于指定数字的元素。
		},function(){
			$select.children(':gt(0)').hide()
		})
		.children(':last')
		.click(function(){
			$select.children(':gt(0)').hide()
		})
		
		// 6.点击切换地址tab
		var $stl = $('#store_tabs>li')
		$stl.click(function(){
			$stl.removeClass('hover')    /* 把所有li标签的hover属性值移除  法1 */
			/* $stl.attr('class')         读写合一,移除class整体  法2 */
			this.className = 'hover'    /* 当前click的li赋予hover属性值 */
		})
		
		// 7.鼠标移入移出切换显示迷你购物车
		$('#minicart').hover(function(){
			this.className='minicart'
			$(this).children(':last').show()
		},function(){
			this.className=''
			$(this).children(':last').hide()
		})
		// 8.点击切换产品选项（商品详情等显示出来）
		var $lis = $('#product_detail>ul>li')
		/* var $contents = $('#product_detail>div:not(:first)') */
		var $contents = $('#product_detail>div:gt(0)')
		$lis.click(function(){
			$lis.removeClass('current')
			this.className='current'
			//隐藏所有div
			$contents.hide()
			//显示对应div
			var index = $(this).index()
			$contents.eq(index).show()
		})
		// 9.点击向右/左，移动当前展示商品的小图片
		var $as = $('#preview>h1>a')
		var $backward = $as.first()
		var $forward = $as.last()
		var $ul = $('#icon_list');
		var showCount = 5
		var imgCount = $ul.children('li').length
		var moveCount = 0 /* (点击向右为正) 一次移动宽度为li的宽度 62*/
		var liWidth = $ul.children(':first').width()   //62
		//初始化更新
		if(imgCount>showCount){
			$forward.attr('class','forward')
		}
		//向右按钮绑监听
		$forward.click(function(){
			//判断是否可以移动,不需要直接结束
			if(moveCount === imgCount-showCount){
				return
			}
			moveCount++
			//更新向左的按钮
			$backward.attr('class','backward')
			//更新向右的按钮
			if(moveCount === imgCount-showCount){
				$forward.attr('class','forward_disabled')
			}
			//移动ul
			$ul.css({
				left: -moveCount*liWidth
			})
		})
		
		//向左按钮绑监听
		$backward.click(function(){
			//判断是否可以移动,不需要直接结束
			if(moveCount === 0){
				return
			}
			moveCount--
			//更新向右的按钮
			$forward.attr('class','forward')
			//更新向左的按钮
			if(moveCount === 0){
				$backward.attr('class','backward_disabled')
			}
			//移动ul
			$ul.css({
				left: -moveCount*liWidth
			})
		})
		
		// 10.当鼠标层停在某个小图上，在上方是示对应的中图
		$('#icon_list>li').hover(function(){
			$(this).children().addClass('hoveredThumb')  //出红框
			//显示对应的中图
			var src = $(this).children().attr('src').replace('.jpg','-m.jpg')
			$('#mediumImg').attr('src', src);
			
		},function(){
			$(this).children().removeClass('hoveredThumb')  //移出红框
		})
		
		// 11.当鼠标在中图上移动时，显示对应大图的附近部分区域
		var $maskTop = $('#maskTop')
		var $mask = $('#mask')   //小黄块
		var $largeImgContainer = $('#largeImgContainer')
		var $largeImg = $('#largeImg')
		var $mediumImg = $('#mediumImg')
		var $loading = $('#loading')
		var maskWidth = $mask.width()
		var maskHeight = $mask.height()
		var maskTopWidth= $maskTop.width()
		var maskTopHeight= $maskTop.height()
		
		$maskTop.hover(function(){
			$mask.show() //显示小黄块
			//动态加载对应的大图
			var src= $mediumImg.attr('src').replace('-m.','-l.')
			$largeImg.attr('src',src)
			$largeImgContainer.show()
			$largeImg.on('load',function(){//大图加载完成
			/* 得到大图的尺寸 */
			var largeWidth = $largeImg.width()
			var largeHeight = $largeImg.height()
			$largeImgContainer.css({
				width: largeWidth/2,
				height: largeHeight/2
			})
				
			$largeImg.show()  //显示大图
			$loading.hide()  //隐藏加载进度条
			
			/* console.log($largeImg.width(),$largeImg.height()) */
				$maskTop.mousemove(function(event){
					/* 1.移动小黄块 */

						var left =0 
						var top =0 
						var eventLeft = event.offsetX
						var eventTop = event.offsetY
						left = eventLeft - maskHeight/2
						top = eventTop - maskHeight/2
						//left在0到maskTopWidth-maskWidth
						//top在0到maskTopHeight-maskHeight
						if(left<0){
							left =0 
						}else if(left>maskTopWidth-maskWidth){
							left=maskTopWidth-maskWidth
						}
						
						if(top<0){
							top =0
						}else if(top>maskTopHeight-maskHeight){
							top=maskTopHeight-maskHeight
						}
						
						//给$mask重新定位
						$mask.css({
							left: left,
							top: top
						})
						
						/* 2.移动大图 */

						left = -left * largeWidth / maskTopWidth
						top = -top * largeHeight / maskTopHeight
						//设置大图的坐标
						$largeImg.css({
							left: left,
							top: top
						})
					})	
				
			})
			
			//绑定mouseMove监听
			},function(){
			$mask.hide()
			$largeImgContainer.hide()
			$largeImg.hide()
		})
})