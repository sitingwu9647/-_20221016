/* 
调用到的app.js文件

 功能说明:
 1. 点击向右(左)的图标, 平滑切换到下(上)一页
 2. 无限循环切换: 第一页的上一页为最后页, 最后一页的下一页是第一页
 3. 每隔3s自动滑动到下一页
 4. 当鼠标进入图片区域时, 自动切换停止, 当鼠标离开后,又开始自动切换
 5. 切换页面时, 下面的圆点也同步更新
 6. 点击圆点图标切换到对应的页

 bug: 快速点击下一页时, 有问题
 */

$(function(){
	
	//注意 : 等号左边和后边要有空格
	var $container = $('#container')
	var $list = $('#list')
	var $points = $('#pointsDiv>span')   //click事件
	var $prev = $('#prev')
	var $next = $('#next')
	var PAGE_WIDTH = 600 //页的宽度
	var TIME = 400 //翻页的持续时间
	var ITEM_TIME = 20 //单元移动的间隔时间
	var imgCount = $points.length  //5  不要写死!!!
	var index = 0  //当前下标
	var moving = false  //bug: 快速点击下一页时, 有问题 标识没在翻页
	
	// 1. 点击向右(左)的图标, 平滑切换到下(上)一页
	$next.click(function(){
		// 平滑切换到下一页
		nextPage(true)
	})
	
	$prev.click(function(){
		// 平滑切换到上一页	
		nextPage(false)
	})
	
	// 3. 每隔1s自动滑动到下一页
	var intervalId = setInterval(function(){
		nextPage(true)		
	},1000)
	
	// 4. 当鼠标进入图片区域时, 自动切换停止, 当鼠标离开后,又开始自动切换
	$container.hover(function(){
		clearInterval(intervalId)
	},function(){
		intervalId = setInterval(function(){
			nextPage(true)
		},1000)
	})
	
	// 6. 点击圆点图标切换到对应的页
	$points.click(function(){
		//step1:计算目标页下标
		var targetIndex =$(this).index()
		if(targetIndex != index){  //他俩相等的话,再点变红没意义
			nextPage(targetIndex)
		}
	})
	
	
	/* 
	  平滑翻页
	  true:下一页
	  false:上一页
	  数值:指定下标页
	 */
	function nextPage (next){
/* 		总的时间:TIME = 400
		单元移动的间隔时间:ITEM_TIME=20
		总的偏移量:offset
		单元移动的偏移量:itemOffset=offset/(TIME/ITEM_TIME)
		
		思路:启动循环定时器不断更新$list的left,到达目标处停止定时器
		*/
	   //如果正在翻页,直接结束
	   if(moving){  //已经翻页中
		   return 
	   }
	   moving = true //标识正在翻页  start
	   
		var offset = 0  //总的偏移量
		
		if(typeof next === 'boolean'){
			offset = next ? -PAGE_WIDTH : PAGE_WIDTH  //计算总的偏移量
		}else{
			offset = -(next-index)*PAGE_WIDTH   //往左是加++++++!!!!
		}
		
		var itemOffset = offset/(TIME/ITEM_TIME)  //计算单元移动的偏移量
		var currLeft = $list.position().left     //当前left值
		var targetLeft = currLeft+offset     //目标处left
		var intervalId = setInterval(function(){ //启动循环定时器不断更新$list的left,到达目标处停止定时器
			currLeft += itemOffset  //计算最新currLeft
			if(currLeft === targetLeft){  //到达目标位置
				//清除定时器
				clearInterval(intervalId)
				
				//标识翻页停止   end
				moving = false
				
				//如果到达了最右边的图片(1.jpg),跳转到最左边的第2张图片(1.jpg)
				if(currLeft===-(imgCount+1) * PAGE_WIDTH){
					currLeft = -PAGE_WIDTH
				}else if(currLeft===0){
					//如果到达了最左边的图片(5.jpg),跳转到最右边的第2张图片(5.jpg)
					currLeft = -imgCount*PAGE_WIDTH
				}
			}
			$list.css('left',currLeft) //设置left
		},ITEM_TIME)
		
		//更新圆点
		updatePoints(next)
		
	}
	
	
	/* 
	更新圆点 
	
	*/
	function updatePoints(next){
		
		//step1 计算目标圆点的下标   targetIndex
		//step2 红色变灰色:移除  class="on" (将当前index的<span>的class移除)
		//step3 给目标圆点添加 class="on"
		//step4 index更新为:targetIndex
		
		//step1 计算目标圆点的下标   targetIndex
		var targetIndex = 0
		
		if(typeof next === 'boolean'){
		if(next){
			targetIndex = index+1   //范围 0 到 imgCount-1(4)
			if(targetIndex === imgCount){    //imgCount是5
				targetIndex = 0       //此时是1.jpg  数组下标:0
			}
		}else{
			targetIndex = index - 1  //往左走
			if(targetIndex === -1){
				targetIndex = imgCount-1  //此时是5.jpg  数组下标:4
			}
		}}else{
			targetIndex = next   //next传的就是目标圆点的下标
		}
		
		//step2 红色变灰色:移除  class="on" (将当前index的<span>的class移除)
		$points.eq(index).removeClass('on')
		// $points[index].className=''  //原生js写法
		//step3 给目标圆点添加 class="on"
		$points.eq(targetIndex).addClass('on')
		// $points[index].className='on'  //原生js写法
		//step4 index更新为:targetIndex
		index = targetIndex
		
		
		
	}
	
})
