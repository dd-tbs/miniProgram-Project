/**
 * 
 * 1 点击 + 触发tap事件
 *   1 调用小程序内置的 选择图片的api
 *   2 获取到图片的路径 数组格式
 *   3 把图片路径 存到 data的变量中
 *   4 页面就可以根据 图片数组 进行循环显示 自定义组件
 *   
 *  2 点击自定义图片组件
 *   1 获取被点击的元素的索引
 *   2 获取 data 中的图片数组
 *   3 根据索引 数组中删除对应的元素
 *   4 把数组重新设置回data中
 * 
 *  3 点击 提交
 *    1 获取文本域的内容
 *      1data中定义变量 表示输入框的内容
 *      2文本域绑定输入事件,事件触发的时候 把输入框的值 存入到变量中
 *    2 对内容进行检测 不合法弹窗提示
 *    3 验证通过则把用户选择的图 片 上传到专门的图片服务器 ,返回图片外网的链接
 *      1遍历图片数组
 *      2挨个上传
 *      3自己再维护图片数组,存放图片上传后的外网链接
 *    4 文本域 和 外网的图片路径一起提交到服务器 (模拟)
 *    5 清空当前页面
 *    6 返回上一页
 */


Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs:[
      {
        id:0,
        value:"体验问题",
        isActive:true
      },
      {
        id:1,
        value:"商品/商家投诉",
        isActive:false
      }
    ],
    //被选中的图片路径 数组
    chooseImgs:[],
    //文本域的内容
    textVal:""
  },

  //外网的图片的路径数组
  UpLoadImgs:[],

  handleTabsItemChange(e){
    // console.log(e)
    //获取被点击的标题的索引
    const {index} = e.detail
    //修改原数组
    let {tabs} = this.data
    tabs.forEach((v,i) => i===index?v.isActive=true:v.isActive=false)
    //赋值到data中
    this.setData({
      tabs
    })
  },

  //点击 + 选择图片
  handleChooseImg(){
    // 调用小程序内置的选中图片api
    wx.chooseImage({
      count: 9, //同时选中图片的数量
      sizeType: ['original','compressed'], //图片的格式 原图/压缩过得
      sourceType: ['album','camera'],//图片的来源 相册/照相机
      success: (result)=>{
        // console.log(result)
        this.setData({
          //让用户可以反复选择图片 把图片数组进行拼接
          chooseImgs:[...this.data.chooseImgs,...result.tempFilePaths]
        })
      },
      fail: ()=>{},
      complete: ()=>{}
    });
  },

  //点击自定义图片组件
  handleRemoveImg(e){
    // 获取被点击的组件索引
    const {index}=e.currentTarget.dataset
    // console.log(index)
    //获取data中的图片数组
    let {chooseImgs}=this.data
    //根据index删除元素
    chooseImgs.splice(index,1)
    this.setData({
      chooseImgs
    })
  },


  // 文本域的输入事件
  handleTextInput(e){
    this.setData({
      textVal:e.detail.value
    })
  },

  //提交 按钮的点击
  handleFormSubmit(){
    //1获取文本域的内容 和 图片数组
    const {textVal,chooseImgs}=this.data
    //2验证 内容是否为空
    if(!textVal.trim()){
      // 为空,不合法
      wx.showToast({
        title: '输入不合法',
        icon: 'none',
        mask: true,
      })
      return
    }
    //3准备上传图片到专门的服务器
    //上传文件的api不支持 多个文件同时上传 要遍历数组挨个上传
    //显示一个正在等待的图标
    wx.showLoading({
      title: "正在上传中",
      mask: true
    });

    //判断有没有需要上传的图片数组
    if(chooseImgs != 0){
      chooseImgs.forEach((v,i)=>{
        wx.uploadFile({
          url: 'img.coolcr.cn/index/api.html', //图片要上传到哪里
          filePath: v, //被上传的文件路径
          name: "image", //上传的文件名称 目的是给后台获取文件
          formData: {}, //顺带的文本信息
          success: (result)=>{
          //  console.log(result)
           let url=Json.parsr(result.data).url
           this.uploadFile.push(url) 
           
  
           //所有的图片都上传完毕才触发
           if(i===chooseImgs.length-1){
            //关闭等待的弹出 
            wx.hideLoading();
  
             console.log("把文本内容和外网图片数组提交到后台")
             //提交成功 重置页面
             this.setData({
               textVal:"",
               chooseImgs:[]
             })
             //返回上一个页面
             wx.navigateBack({
               delta: 1
             })
           }
          }
        })
      })
    }else{
      wx.hideLoading();
      console.log("文本提交了")
      wx.navigateBack({
        delta: 1
      });
    }
    
   
  }
})