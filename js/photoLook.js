fileArray = [];
//当前img索引
var currentImgIndex = 0;
//当前图片索引
var rotationIndex = 0;
var imgs = document.images;
var dragArea = document.getElementById('drag-border'),
	dragText = document.getElementById('drag-text'),
	pic = document.getElementById('pic'),
	trash = document.getElementById('trash'),
	display = document.getElementById('display'),
	left = document.getElementById('left'),
	right = document.getElementById('right'),
	numpic = document.getElementById('numpic'),
	totallpic = document.getElementById('totallpic'),
	filesList = document.getElementById('drag-file');

//获得图片原始大小
function initWH() {
	imgs[currentImgIndex].style.width = 'auto';
	imgs[currentImgIndex].style.height = 'auto';
	initHeight = imgs[currentImgIndex].offsetHeight;
	initWidth = imgs[currentImgIndex].offsetWidth;
}


//适应图片大小
function picHeight() {
	picNum();
	display.style.height = (window.innerHeight - 60) + 'px';
	imgs[currentImgIndex].style.height = 'auto';
	imgs[currentImgIndex].style.width = 'auto';
	//如果过长
	if (imgs[currentImgIndex].offsetHeight >= window.innerHeight - 60) {
		var clientHeight = window.innerHeight - 60;
		imgs[currentImgIndex].style.height = clientHeight + 'px';
	} else {
		imgs[currentImgIndex].style.height = imgs[currentImgIndex].offsetHeight;
	}
	//如果过宽
	if (imgs[currentImgIndex].offsetWidth >= window.innerWidth) {
		var clientWidth = window.innerWidth;
		imgs[currentImgIndex].style.width = clientWidth + 'px';
		imgs[currentImgIndex].style.height = 'auto';
	} else {
		imgs[currentImgIndex].style.width = imgs[currentImgIndex].offsetWidth;
	}
	if (pic.style.margin = '0 auto') {
		pic.style.margin = 'auto';
	}
	//保存当前图片大小
	currentWidth = imgs[currentImgIndex].offsetWidth;
	currentHeight = imgs[currentImgIndex].offsetHeight;
	currentLeft = imgs[currentImgIndex].offsetLeft;
	currentTop = imgs[currentImgIndex].offsetTop;
}

//添加resize事件动态调整图片大小
window.onresize = function() {
	picHeight();
}


var EventUtil = {
    addHandler: function(element, type, handler){
        if (element.addEventListener){
            element.addEventListener(type, handler, false);
        } else if (element.attachEvent){
            element.attachEvent("on" + type, handler);
        } else {
            element["on" + type] = handler;
        }
    },
    removeHandler: function(element, type, handler){
        if (element.removeEventListener){
            element.removeEventListener(type, handler, false);
        } else if (element.detachEvent){
            element.detachEvent("on" + type, handler);
        } else {
            element["on" + type] = null;
        }
    },
    getEvent: function(event){
        return event ? event : window.event;
    },
    getTarget: function(event){
        return event.target || event.srcElement;
    }
};

/********************************************************************************
 ***********************************upload file**********************************
*********************************************************************************/
EventUtil.addHandler(filesList, 'change', function(event) {
	event = EventUtil.getEvent(event);
	var target = EventUtil.getTarget(event);
	var files = target.files,
	type = 'default';
	console.log(files);
	reader(Array.prototype.slice.call(files));
});
//FileReader加载图片
function reader(file) {
	//本地图标拖拽
	if (file instanceof Array) {
		for (var fileIndex = 0; fileIndex < file.length; fileIndex++) {
			// setTimeout(localdrag(file, fileIndex), 0);
			localdrag(file, fileIndex);
		}
	}
}

function localdrag(file, fileIndex) {
	var reader = new FileReader();
	if (/image/.test(file[fileIndex].type)) {
		reader.readAsDataURL(file[fileIndex]);
		type = 'image';
	} else {
		dragText.innerHTML = '请拖拽图片格式';
	}
	if (fileIndex == file.length - 1) {
		fina = 'finally';
	} else {
		fina = 'continue';
	}
	reader.onload = function() {
		switch (type) {
			case 'image':
				fileArray.unshift(reader.result);
				if (fina == 'finally') {
					btnLoad(0);
				}
				break;
		}
	};
}

/********************************************************************************
 ***********************************拖拽事件*************************************
*********************************************************************************/
EventUtil.addHandler(document, 'dragstart', preventRedirect);
EventUtil.addHandler(document, 'dragenter', preventRedirect);
EventUtil.addHandler(document, 'dragover', preventRedirect);
EventUtil.addHandler(document, 'drop', dropHandler);
EventUtil.addHandler(document, 'dragend', preventRedirect);

function preventRedirect(event) {
	event = EventUtil.getEvent(event);
	if (event && event.preventDefault) {
		event.preventDefault();
	} else {
		window.event.returnValue = false;
	}
}

function dropHandler(event) {
	event = EventUtil.getEvent(event);
	var target = EventUtil.getTarget(event);
	preventRedirect(event);
	if (target.id == 'drag-file') {
		//本地图片拖拽
		if (event.dataTransfer.files && event.dataTransfer.files[0] && /image/.test(event.dataTransfer.files[0].type)) {
			var files = event.dataTransfer.files;
			reader(Array.prototype.slice.call(files));
			return;
		}
		//外部图片拖拽
		var text = event.dataTransfer.getData && event.dataTransfer.getData('text/html');
		text = text.match(/src\=\"(http.*?)\"/i);
		text = text && text[1];
		if (!text) {
			dragText.innerHTML = '链接不是图片';
			return false;
		}
		if (text && !/^http/i.test(text)) {
			alert('图片地址必须http打头');
			return false;
		}
		fileArray.unshift(text);
		btnLoad(0);
	}
}

/********************************************************************************
 ********************************基础功能开始************************************
*********************************************************************************/
//显示图片总数和当前
function picNum() {
	numpic.innerHTML = fileArray.length - rotationIndex;
	totallpic.innerHTML = fileArray.length;
}

//垃圾桶点击
EventUtil.addHandler(trash, 'click', addAnimation);

function addAnimation() {
	this.classList.add('animation');
	setTimeout(function() {
		trash.classList.remove('animation');
	}, 250);
	var length = fileArray.length;
	if (length == 1) {
		alert('只有一张图片，不能删除');
		return;
	} else {
		fileArray.splice(rotationIndex, 1);
		if (rotationIndex == 1) {
			rotationIndex = 0;
		}
		btnLoad(rotationIndex);
	}
}

//control控制器 
var plus = document.getElementById('plus'),
	minus = document.getElementById('minus'),
	actually = document.getElementById('actually'),
	adjust = document.getElementById('adjust');

EventUtil.addHandler(plus, 'click', amply);
EventUtil.addHandler(minus, 'click', reduce);
EventUtil.addHandler(actually, 'click', actual);
EventUtil.addHandler(adjust, 'click', picHeight);
EventUtil.addHandler(left, 'click', pre);
EventUtil.addHandler(right, 'click', next);

//鼠标滚轮事件
EventUtil.addHandler(document, 'mousewheel', judg);
EventUtil.addHandler(document, 'DOMMouseScroll', judg);

//键盘左右切换事件
EventUtil.addHandler(document, 'keyup', keyboardEvent);


function keyboardEvent(event) {
	event = EventUtil.getEvent(event);
	if(event.keyCode == 37) {
		pre();
	}else if(event.keyCode == 39) {
		next();
	}
}

function judg(event) {
	event = EventUtil.getEvent(event);
	if (event.wheelDelta > 0 || event.detail < 0) {
		amply(event);
	} else {
		reduce(event);
	}
}

//放大图像
function amply(event) {
	event = EventUtil.getEvent(event);
	event.preventDefault();
	if (imgs[currentImgIndex].offsetTop <= '0') {
		pic.style.margin = '0 auto';
	}
	imgs[currentImgIndex].style.width = imgs[currentImgIndex].offsetWidth * 1.2 + 'px';
	if (imgs[currentImgIndex].style.height !== 'auto') {
		imgs[currentImgIndex].style.height = imgs[currentImgIndex].offsetHeight * 1.2 + 'px';
	}
}
//缩小图像
function reduce(event) {
	event = EventUtil.getEvent(event);
	event.preventDefault();
	if (imgs[currentImgIndex].offsetWidth > imgs[currentImgIndex].offsetHeight) {
		if (pic.style.margin = '0 auto') {
			pic.style.margin = 'auto';
		}
	}
	//当图片大小为最小时，不能再缩小
	if (imgs[currentImgIndex].offsetHeight <= currentHeight || imgs[currentImgIndex].offsetWidth <= currentWidth) {
		return;
	} else {
		imgs[currentImgIndex].style.width = imgs[currentImgIndex].offsetWidth / 1.2 + 'px';
		if (imgs[currentImgIndex].style.height !== 'auto') {
			imgs[currentImgIndex].style.height = imgs[currentImgIndex].offsetHeight / 1.2 + 'px';
		}
	}
}
	//显示图片实际大小
function actual() {
	if (initHeight > currentHeight) {
		pic.style.margin = '0 auto';
	}
	imgs[currentImgIndex].style.width = initWidth + 'px';
	imgs[currentImgIndex].style.height = initHeight + 'px';

}

//前一张加载的图片
function pre() {
	if (rotationIndex < fileArray.length - 1) {
		rotationIndex++;
		btnLoad(rotationIndex);
	} else {
		rotationIndex = 0;
		btnLoad(rotationIndex);
	}
}

//后一张加载的图片
function next() {
	if (rotationIndex > 0) {
		rotationIndex--;
		btnLoad(rotationIndex);
	} else {
		rotationIndex = fileArray.length - 1;
		btnLoad(rotationIndex);
	}
}

//按钮加载图片公用
function btnLoad(index) {
	imgs[currentImgIndex].src = fileArray[index];
	initWH();
	console.log(index);
	picHeight();
	if (!!window.ActiveXObject || '-ms-scroll-limit' in document.documentElement.style) {
		setTimeout(picHeight, 10);
	}
}

/********************************************************************************
 **********************************图片拖动**************************************
*********************************************************************************/
function moveMouse(event) {
	event = EventUtil.getEvent(event);
	if (isdrag) {
		//图片外层的div移动
		display.scrollTop = currTop + (y - event.clientY);
		display.scrollLeft = currLeft + (x - event.clientX);
		return false;
	}
}

function initDrag(event) {
	event = EventUtil.getEvent(event);
	var target = EventUtil.getTarget(event);
	if (target.className.indexOf('draggable') > -1) {
		isdrag = true;
		currTop = display.scrollTop;
		y = event.clientY;
		currLeft = display.scrollLeft;
		x = event.clientX;
		document.onmousemove = moveMouse;
		return false;
	}
}
document.onmousedown = initDrag;
document.onmouseup = function() {
	isdrag = false;
};