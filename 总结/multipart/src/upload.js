upload_inp.addEventListener('change', async function () {
  let file = upload_inp.files[0],
    BASE64,
    data;
  if (!file) return;
  if (file.size > 2 * 1024 * 1024) {
    alert('上传的文件不能超过2MB~~');
    return;
  }
  upload_button_select.classList.add('loading');
  // 获取Base64
  BASE64 = await changeBASE64(file);
  try {
    data = await instance.post('/upload_single_base64', {
      // encodeURIComponent(BASE64) 防止传输过程中特殊字符乱码，同时后端需要用decodeURIComponent进行解码
      file: encodeURIComponent(BASE64),
      filename: file.name
    }, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
    if (+data.code === 0) {
      alert(`恭喜您，文件上传成功，您可以基于 ${data.servicePath} 地址去访问~~`);
      return;
    }
    throw data.codeText;
  } catch (err) {
    alert('很遗憾，文件上传失败，请您稍后再试~~');
  } finally {
    upload_button_select.classList.remove('loading');
  }
});