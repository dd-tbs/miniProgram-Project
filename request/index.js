// 同时发送异步代码的次数
let ajaxTimes=0

export const request=(params)=>{
  //判断 url 中是否带有 /my/ 请求的是私有路径,带上header token
  let header={...params.header};
  if(params.url.includes("/my/")){
    header["Authorization"] = wx.getStorageSync("token");
  }
  ajaxTimes++
  // 显示加载中的效果
  wx.showLoading({
    title: '加载中',
    mask:true
  })
  

  //定义公共的url
  // url: 'https://api-hmugo-web.itheima.net/api/public/v1/home/swiperdata',
  const baseUrl = "https://api-hmugo-web.itheima.net/api/public/v1"
  return new Promise((resolve,reject) => {
    wx.request({
     ...params,
     header:header,
     url:baseUrl+params.url,
     success:(result)=>{
       resolve(result.data.message)
     },
     fail:(err)=>{
       reject(err)
     },
    //  不论成功失败都会触发
     complete:()=>{
        ajaxTimes--
        if(ajaxTimes===0){
          //关闭 正在等待的图标
          wx.hideLoading()
        }
     }
    })
  })
}