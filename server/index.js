const express = require("express")
const multer = require("multer")
const path = require("path")
const app = express()
// Route này trả về cái form upload cho client
app.get("/", (req, res) => {
  res.sendFile('http://127.0.0.1:5500/client/html.html')
})
// Khởi tạo biến cấu hình cho việc lưu trữ file upload
const diskStorage = multer.diskStorage({
  destination: (req, file, callback) => {
    // Định nghĩa nơi file upload sẽ được lưu lại
    callback(null, "uploads")
  },
  filename: (req, file, callback) => {
    // làm bất kỳ điều gì với cái file 
    // chỉ cho phép tải lên các loại ảnh png & jpg
    const math = ["image/png", "image/jpeg"]
    if (math.indexOf(file.mimetype) === -1) {
      const errorMess = `Tệp <strong> $ {file.originalname} </strong> không hợp lệ. Chỉ được phép tải lên hình ảnh jpeg hoặc png.`
      return callback(errorMess, null)
    }
    // Tên của file nối thêm một cái nhãn thời gian để đảm bảo không bị trùng.
    const filename = `${Date.now()}-File-${file.originalname}`
    callback(null, filename)
  }
})
// Khởi tạo middleware uploadFile với cấu hình như ở trên,
// Bên trong hàm .single() truyền vào name của thẻ input, ở đây là "file"
const uploadFile = multer({storage: diskStorage}).single("file")
// Route này Xử lý khi client thực hiện hành động upload file
app.post("/upload", (req, res) => {
  // Thực hiện upload file, truyền vào 2 biến req và res
  uploadFile(req, res, (error) => {
    // Nếu có lỗi thì trả về lỗi cho client.
    // Ví dụ như upload một file không phải file ảnh theo như cấu hình bên trên
    if (error) {
      return res.send(`Lỗi khi cố gắng tải lên: ${error}`)
    }
    // Không có lỗi thì lại render cái file ảnh về cho client.
    // Đồng thời file đã được lưu vào thư mục uploads
    res.sendFile(path.join(`${__dirname}/uploads/${req.file.filename}`))
  })
})
 
app.listen(5000, "localhost", () => {
  console.log(`localhost:5000`)
})