import {
  v1 as uuidv1
} from 'uuid';
import { message } from 'antd';

export const uploadQiniu = async (dispatch, file ,callback) => {
    let formData = new FormData();

    await new Promise(resolve => (
      // 获取签名
      dispatch({
        type: 'qiniuyun/getQiniuToken',
        callback: res => {
          formData.append('file', file)
          formData.append('token', res.data.uploadToken)
          formData.append('key', uuidv1()); // 自定义上传图片的名字，即上传成功后七牛返回给我们的图片名字
          resolve();
        }
      })
    ))

    await new Promise(resolve => (
      dispatch({
        type: 'qiniuyun/uploadQiniu',
        payload: formData,
        callBack: re => {
          if (re && re.key) {
            callback('http://cdn.zjutshideshan.cn/' + re.key)
            resolve()
          } else {
            message.error('上传七牛云出错！');
            return
          }
        }
      })
    ))
};
