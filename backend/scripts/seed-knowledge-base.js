const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const knowledgeBaseArticles = [
  {
    kind: 'GUIDE',
    title: 'Hướng dẫn thiết lập hệ thống âm thanh gia đình',
    content: `# Hướng dẫn thiết lập hệ thống âm thanh gia đình

## Giới thiệu
Thiết lập một hệ thống âm thanh gia đình chất lượng cao không chỉ đem lại trải nghiệm nghe nhạc tuyệt vời mà còn tăng cường không gian giải trí cho cả gia đình.

## Các thành phần cơ bản

### 1. Loa chính (Front Speakers)
- Vị trí: Đặt cách nhau 6-8 feet, tạo thành tam giác với vị trí nghe
- Chiều cao: Tweeter ngang tầm tai khi ngồi
- Góc hướng: Nghiêng nhẹ về phía vị trí nghe chính

### 2. Loa trung tâm (Center Speaker)
- Vị trí: Trực tiếp phía trên hoặc dưới TV/màn hình
- Chức năng: Tái tạo đối thoại và hiệu ứng âm thanh trung tâm
- Lưu ý: Cùng dòng sản phẩm với loa chính để đảm bảo tính nhất quán

### 3. Loa surround
- Vị trí: Hai bên và phía sau vị trí nghe
- Chiều cao: 2-3 feet cao hơn vị trí nghe
- Khoảng cách: 1-2 feet phía sau vị trí nghe chính

### 4. Loa siêu trầm (Subwoofer)
- Vị trí: Thử nghiệm nhiều vị trí để tìm âm trầm tốt nhất
- Gợi ý: Góc phòng hoặc giữa loa chính
- Điều chỉnh: Âm lượng và tần số cắt phù hợp với không gian

## Thiết lập và hiệu chỉnh

### Cân bằng âm lượng
1. Đặt tất cả loa ở cùng mức âm lượng ban đầu
2. Sử dụng microphone đo âm thanh
3. Điều chỉnh từng kênh để đạt âm lượng cân bằng tại vị trí nghe

### Điều chỉnh delay
- Đo khoảng cách từ mỗi loa đến vị trí nghe
- Thiết lập delay cho các loa gần hơn
- Đảm bảo âm thanh từ tất cả loa đến tai cùng lúc

### Điều chỉnh EQ
- Sử dụng tính năng room correction nếu có
- Điều chỉnh thủ công dựa trên đặc tính phòng
- Test với nhiều loại nhạc khác nhau

## Lời khuyên chuyên gia

### Vị trí đặt loa
- Tránh đặt loa sát tường hoặc trong góc (trừ subwoofer)
- Sử dụng chân đế cách ly rung động
- Đảm bảo không gian thông thoáng quanh loa

### Cách âm phòng
- Sử dụng thảm, rèm để giảm phản xạ
- Đặt kệ sách hoặc vật dụng để tán xạ âm thanh
- Tránh bề mặt phẳng lớn gây phản xạ

### Kết nối và cáp
- Sử dụng cáp loa chất lượng tốt
- Đảm bảo cực tính đúng (+/-)
- Kết nối chắc chắn, không bị lỏng

## Bảo trì và vệ sinh
- Vệ sinh loa định kỳ bằng khăn mềm
- Kiểm tra các kết nối 6 tháng/lần
- Tránh âm lượng quá cao gây hư hại driver

Audio Tài Lộc khuyên bạn nên đầu tư thời gian để thiết lập đúng cách ngay từ đầu. Một hệ thống được thiết lập tốt sẽ mang lại trải nghiệm âm thanh tuyệt vời trong nhiều năm.`,
    tags: ['âm thanh', 'gia đình', 'thiết lập', 'hướng dẫn', 'loa'],
    isActive: true
  },
  {
    kind: 'GUIDE',
    title: 'Cách chọn loa phù hợp với không gian',
    content: `# Cách chọn loa phù hợp với không gian

## Tầm quan trọng của việc chọn loa đúng

Việc chọn loa phù hợp với không gian sử dụng là yếu tố quyết định 70% chất lượng âm thanh của hệ thống. Một đôi loa tốt trong không gian không phù hợp sẽ không thể phát huy hết tiềm năng.

## Phân loại theo kích thước phòng

### Phòng nhỏ (10-20m²)
**Đặc điểm:**
- Phòng ngủ, phòng làm việc nhỏ
- Khoảng cách nghe 1-3m

**Loa phù hợp:**
- Loa bookshelf 4-5 inch
- Loa monitor studio nhỏ gọn
- Loa bluetooth chất lượng cao

**Thương hiệu đề xuất:**
- KEF LS50
- Monitor Audio Bronze 50
- Audioengine A2+

### Phòng vừa (20-40m²)
**Đặc điểm:**
- Phòng khách căn hộ
- Khoảng cách nghe 3-4m

**Loa phù hợp:**
- Loa bookshelf 6-7 inch
- Loa floor-standing nhỏ
- Hệ thống 2.1 với subwoofer

**Thương hiệu đề xuất:**
- B&W 606 S2
- Klipsch RP-600M
- Polk Audio R200

### Phòng lớn (40m² trở lên)
**Đặc điểm:**
- Phòng khách biệt thự
- Khoảng cách nghe 4m+

**Loa phù hợp:**
- Loa floor-standing lớn
- Hệ thống 5.1 hoặc 7.1
- Loa công suất cao

**Thương hiệu đề xuất:**
- B&W 702 S2
- KEF Q750
- Klipsch RF-7 III

## Yếu tố về vật liệu và hình dạng phòng

### Phòng có nhiều vật liệu mềm
- Thảm, rèm, ghế sofa nhiều
- Âm thanh bị hấp thụ nhiều
- **Giải pháp:** Chọn loa có độ nhạy cao, tweeter sáng

### Phòng có nhiều bề mặt cứng
- Sàn gỗ, tường bê tông, cửa kính
- Âm thanh phản xạ mạnh
- **Giải pháp:** Chọn loa có âm ấm, tránh tweeter quá sắc

### Phòng hình chữ nhật
- Dễ gây hiện tượng sóng đứng
- **Giải pháp:** Đặt loa dọc theo cạnh dài

### Phòng vuông
- Dễ gây cộng hưởng
- **Giải pháp:** Sử dụng vật dụng tán xạ âm thanh

## Mục đích sử dụng

### Nghe nhạc chính
**Ưu tiên:**
- Chất lượng âm thanh
- Dải tần rộng
- Độ phân tích cao

**Đề xuất:**
- Loa monitor studio
- Loa hi-end 2-way hoặc 3-way

### Xem phim
**Ưu tiên:**
- Âm trầm mạnh mẽ
- Khả năng tái tạo hiệu ứng
- Công suất lớn

**Đề xuất:**
- Hệ thống surround
- Loa có tweeter horn
- Subwoofer chuyên dụng

### Đa mục đích
**Ưu tiên:**
- Tính linh hoạt
- Dễ sử dụng
- Thiết kế đẹp

**Đề xuất:**
- Loa active bluetooth
- Soundbar cao cấp
- Hệ thống 2.1 chất lượng

## Ngân sách và lời khuyên

### Ngân sách dưới 5 triệu
- Ưu tiên loa bookshelf
- Tìm hiểu loa cũ chất lượng cao
- Đầu tư vào ampli tốt

### Ngân sách 5-15 triệu
- Cân nhắc loa floor-standing
- Hệ thống 2.1 hoặc 5.1 cơ bản
- Chọn thương hiệu uy tín

### Ngân sách trên 15 triệu
- Hệ thống hoàn chỉnh
- Loa hi-end
- Đầu tư room treatment

## Những sai lầm thường gặp

1. **Chọn loa quá lớn cho phòng nhỏ**
   - Dẫn đến âm trầm quá mức
   - Mất cân bằng tổng thể

2. **Bỏ qua vị trí đặt loa**
   - Đặt loa sát tường
   - Không tính toán khoảng cách nghe

3. **Không cân nhắc tính thẩm mỹ**
   - Loa quá to so với không gian
   - Màu sắc không hợp

## Dịch vụ tư vấn tại Audio Tài Lộc

Đội ngũ kỹ thuật viên của Audio Tài Lộc sẵn sàng đến tận nơi để:
- Khảo sát không gian thực tế
- Đề xuất giải pháp phù hợp ngân sách
- Thiết lập và hiệu chỉnh hệ thống
- Bảo hành và hỗ trợ sau bán hàng

**Liên hệ:** 0909.XXX.XXX để được tư vấn miễn phí.`,
    tags: ['loa', 'không gian', 'tư vấn', 'phòng nghe', 'chọn loa'],
    isActive: true
  },
  {
    kind: 'MAINTENANCE',
    title: 'Bảo trì và vệ sinh thiết bị âm thanh',
    content: `# Bảo trì và vệ sinh thiết bị âm thanh

## Tầm quan trọng của việc bảo trì

Thiết bị âm thanh là khoản đầu tư lớn và cần được chăm sóc đúng cách để:
- Duy trì chất lượng âm thanh tối ưu
- Kéo dài tuổi thọ thiết bị
- Tránh chi phí sửa chữa đắt đỏ
- Đảm bảo an toàn khi sử dụng

## Lịch trình bảo trì định kỳ

### Hàng ngày
- Tắt nguồn khi không sử dụng
- Kiểm tra mức âm lượng hợp lý
- Đảm bảo thông gió tốt

### Hàng tuần
- Vệ sinh bụi bặm bề mặt
- Kiểm tra các kết nối
- Test chức năng cơ bản

### Hàng tháng
- Vệ sinh sâu toàn bộ hệ thống
- Kiểm tra cáp kết nối
- Cập nhật firmware (nếu có)

### 6 tháng/lần
- Bảo trì chuyên sâu
- Thay thế linh kiện tiêu hao
- Hiệu chỉnh lại hệ thống

## Hướng dẫn vệ sinh từng loại thiết bị

### Ampli/Receiver

**Chuẩn bị:**
- Khăn microfiber
- Chổi nhỏ mềm
- Máy hút bụi mini
- Cồn isopropyl 99%

**Quy trình:**
1. **Tắt nguồn và rút phích cắm** (chờ 30 phút để tụ điện xả hết)
2. **Vệ sinh bên ngoài:**
   - Dùng khăn microfiber lau bụi
   - Với vết bẩn cứng đầu: khăn ẩm nhẹ
   - Tránh nước vào các khe thoát nhiệt
3. **Vệ sinh bên trong:**
   - Tháo nắp (chỉ khi có kinh nghiệm)
   - Dùng chổi mềm quét bụi
   - Máy hút bụi hút bụi trong quạt tản nhiệt
4. **Vệ sinh các núm điều chỉnh:**
   - Xoay nhẹ núm khi vệ sinh
   - Dùng tăm bông + cồn cho khe nhỏ

### Loa

**Đối với loa có driver lộ:**
1. **Lưới bảo vệ (grille):**
   - Tháo lưới nhẹ nhàng
   - Rửa bằng nước xà phòng nhẹ
   - Phơi khô hoàn toàn trước khi lắp lại

2. **Driver/Cone loa:**
   - **LƯU Ý:** Tuyệt đối không chạm vào cone
   - Dùng chổi mềm quét bụi từ ngoài vào trong
   - Với tweeter: cực kỳ nhẹ nhàng

3. **Vỏ loa:**
   - Gỗ: dùng dung dịch vệ sinh gỗ chuyên dụng
   - Vinyl/PVC: khăn ẩm nhẹ
   - Kim loại: cồn isopropyl

**Đối với loa powered/active:**
- Thêm bước vệ sinh cổng kết nối
- Kiểm tra LED báo nguồn
- Test remote control (nếu có)

### CD Player/DAC

1. **Bên ngoài:**
   - Khăn microfiber khô
   - Cồn isopropyl cho vết bẩn

2. **Khay đĩa:**
   - Vệ sinh ray trượt bằng cotton swab
   - Kiểm tra độ mượt mà khi đóng/mở

3. **Lens đọc đĩa:**
   - **CHỈ khi cần thiết**
   - Dùng đĩa vệ sinh lens chuyên dụng
   - Hoặc cotton swab + cồn 99%

### Cáp kết nối

1. **Jack/Connector:**
   - Cồn isopropyl + cotton swab
   - Chú ý không để cồn chảy vào bên trong

2. **Dây cáp:**
   - Khăn ẩm nhẹ
   - Kiểm tra vỏ bọc có bị nứt/đứt không

## Những điều TUYỆT ĐỐI tránh

### Chất tẩy rửa không nên dùng
- Nước có chứa khoáng chất
- Cồn dưới 90%
- Acetone, thinner
- Dung dịch tẩy rửa gia dụng
- Nước rửa chén

### Hành động nguy hiểm
- Vệ sinh khi thiết bị đang bật
- Dùng nước trực tiếp
- Lắc mạnh thiết bị
- Tháo rời khi chưa hiểu rõ cấu tạo
- Chạm vào linh kiện điện tử

## Dấu hiệu cần bảo trì chuyên nghiệp

### Ampli/Receiver
- Quạt tản nhiệt ồn bất thường
- Nhiệt độ quá cao
- Âm thanh méo, rè
- LED báo lỗi liên tục

### Loa
- Tiếng tạp âm khi phát nhạc
- Cone loa bị rách hoặc lõm
- Âm bass bị méo
- Mất kênh âm thanh

### CD Player
- Đọc đĩa chậm hoặc không đọc được
- Khay đĩa kẹt
- Âm thanh bị gián đoạn

## Lưu trữ và bảo quản

### Môi trường lý tưởng
- Nhiệt độ: 15-25°C
- Độ ẩm: 40-60%
- Tránh ánh nắng trực tiếp
- Không gian thông thoáng

### Khi không sử dụng lâu
1. Vệ sinh kỹ lưỡng
2. Bao bọc chống bụi
3. Rút phích cắm điện
4. Để nơi khô ráo, thoáng mát
5. Bật máy 1 lần/tháng (15-30 phút)

## Dịch vụ bảo trì tại Audio Tài Lộc

### Gói bảo trì cơ bản
- Vệ sinh toàn bộ hệ thống
- Kiểm tra hiệu năng
- Tư vấn sử dụng
- **Giá:** 200,000đ/lần

### Gói bảo trì chuyên sâu
- Tất cả dịch vụ gói cơ bản
- Hiệu chỉnh âm thanh
- Thay thế linh kiện (nếu cần)
- Bảo hành 3 tháng
- **Giá:** 500,000đ/lần

### Dịch vụ tại nhà
- Kỹ thuật viên đến tận nơi
- Thời gian linh hoạt
- Tư vấn cải thiện âm thanh
- **Phí dịch vụ:** 100,000đ + chi phí bảo trì

**Đặt lịch:** 0909.XXX.XXX
**Website:** audiotailoc.com/bao-tri`,
    tags: ['bảo trì', 'vệ sinh', 'thiết bị', 'âm thanh', 'chăm sóc'],
    isActive: true
  },
  {
    kind: 'TROUBLESHOOTING',
    title: 'Khắc phục sự cố thường gặp với micro',
    content: `# Khắc phục sự cố thường gặp với micro

## Các vấn đề phổ biến và giải pháp

### 1. Micro không có tiếng

**Nguyên nhân có thể:**
- Micro chưa được bật
- Cáp kết nối lỏng hoặc đứt
- Input không được chọn đúng
- Phantom power chưa bật (micro condenser)
- Micro bị hỏng

**Cách khắc phục:**

**Bước 1: Kiểm tra cơ bản**
1. Đảm bảo micro đã được bật
2. Kiểm tra LED báo nguồn (nếu có)
3. Xem cáp kết nối chắc chắn ở cả 2 đầu
4. Thử cáp khác để loại trừ lỗi cáp

**Bước 2: Kiểm tra mixer/interface**
1. Đảm bảo đã chọn đúng input channel
2. Kiểm tra gain/volume không bị set về 0
3. Mute button không được bật
4. Bật phantom power (+48V) cho micro condenser

**Bước 3: Test micro**
1. Thử micro trên thiết bị khác
2. Test với micro khác trên cùng hệ thống
3. Kiểm tra với tai nghe monitor

### 2. Tiếng rè, tạp âm

**Nguyên nhân:**
- Gain quá cao
- Vòng lặp phản hồi (feedback)
- Nhiễu điện từ
- Cáp kém chất lượng
- Grounding không tốt

**Giải pháp:**

**Giảm gain:**
1. Hạ gain từ từ cho đến khi hết rè
2. Tăng output volume thay vì input gain
3. Sử dụng compressor để kiểm soát dynamics

**Loại bỏ feedback:**
1. Di chuyển micro xa loa hơn
2. Thay đổi hướng micro
3. Hạ volume loa monitor
4. Sử dụng in-ear monitor thay vì loa monitor

**Giảm nhiễu:**
1. Giữ cáp micro xa nguồn điện
2. Sử dụng cáp balanced (XLR)
3. Kiểm tra grounding hệ thống
4. Tắt các thiết bị điện tử không cần thiết

### 3. Âm thanh méo, không rõ ràng

**Nguyên nhân:**
- Overload input
- Micro quá gần hoặc quá xa
- EQ không phù hợp
- Hiệu ứng quá mức
- Micro không phù hợp với ứng dụng

**Khắc phục:**

**Điều chỉnh level:**
1. Giảm gain cho đến khi hết clip
2. Giữ khoảng cách 15-30cm với micro
3. Hát/nói thẳng vào micro, không nghiêng

**Điều chỉnh EQ:**
- **Low-cut:** Bật filter 80-100Hz loại bỏ rumble
- **Mid-range:** Boost nhẹ 2-5kHz cho độ rõ ràng
- **High-end:** Boost nhẹ 10kHz+ cho độ sáng

**Kiểm tra hiệu ứng:**
1. Tắt tất cả effect để test âm gốc
2. Thêm từng effect một cách cẩn thận
3. Reverb không quá 20% wet signal

### 4. Micro wireless bị gián đoạn

**Nguyên nhân:**
- Pin yếu
- Nhiễu tần số radio
- Khoảng cách quá xa
- Vật cản ngăn tín hiệu

**Giải pháp:**

**Kiểm tra pin:**
1. Thay pin mới đối với micro AA
2. Sạc đầy pin đối với micro có pin sạc
3. Kiểm tra tiếp xúc pin sạch sẽ

**Tối ưu tần số:**
1. Scan tần số tự động trên receiver
2. Chọn tần số ít nhiễu nhất
3. Tránh tần số WiFi (2.4GHz)

**Cải thiện tín hiệu:**
1. Giữ receiver trong tầm nhìn trực tiếp
2. Đặt receiver cao hơn (trên stand)
3. Sử dụng antenna booster nếu cần

### 5. Micro condenser không hoạt động

**Nguyên nhân đặc biệt:**
- Phantom power không đủ (+48V)
- Humidity cao làm hỏng capsule
- Shock mount không tốt gây rung động

**Khắc phục:**

**Phantom power:**
1. Đảm bảo mixer/interface cung cấp đủ +48V
2. Kiểm tra cáp XLR đầy đủ 3 pins
3. Test với power supply riêng

**Bảo vệ micro:**
1. Sử dụng pop filter
2. Shock mount chất lượng
3. Bảo quản trong case khi không dùng
4. Tránh môi trường ẩm ướt

## Bảo trì định kỳ

### Hàng tuần
- Vệ sinh mesh/grille bằng cồn isopropyl
- Kiểm tra cáp kết nối
- Test chức năng cơ bản

### Hàng tháng
- Kiểm tra pin wireless
- Vệ sinh body micro
- Test với các settings khác nhau

### 6 tháng/lần
- Bảo trì chuyên sâu tại Audio Tài Lộc
- Thay thế windscreen/pop filter
- Hiệu chỉnh lại hệ thống

## Khi nào cần hỗ trợ chuyên nghiệp

### Dấu hiệu cần sửa chữa
- Tiếng rè/crackle không thể khắc phục
- LED báo lỗi liên tục
- Vỏ micro bị nứt/vỡ
- Không nhận được tín hiệu dù đã thử mọi cách

### Dấu hiệu cần thay mới
- Micro quá cũ (>10 năm)
- Chi phí sửa chữa > 50% giá mới
- Không còn phụ tùng thay thế
- Chất lượng âm thanh giảm rõ rệt

## Dịch vụ hỗ trợ tại Audio Tài Lộc

### Hotline hỗ trợ kỹ thuật
- **Điện thoại:** 0909.XXX.XXX
- **Thời gian:** 8h-22h hàng ngày
- **Hỗ trợ qua:** Điện thoại, Zalo, TeamViewer

### Dịch vụ sửa chữa
- **Chẩn đoán miễn phí** (trong 24h)
- **Bảo hành sửa chữa** 6 tháng
- **Linh kiện chính hãng**
- **Nhận-giao tận nơi** (nội thành)

### Gói hỗ trợ VIP
- **Ưu tiên xử lý** trong 4h
- **Cho mượn thiết bị** khi sửa chữa
- **Tư vấn 24/7**
- **Giảm 20%** phí dịch vụ

**Đăng ký gói VIP:** audiotailoc.com/vip-support`,
    tags: ['micro', 'sửa chữa', 'khắc phục', 'sự cố', 'troubleshooting'],
    isActive: true
  },
  {
    kind: 'GUIDE',
    title: 'Chọn ampli phù hợp với hệ thống',
    content: `# Chọn ampli phù hợp với hệ thống

## Hiểu về ampli và vai trò trong hệ thống

Ampli (amplifier) là trái tim của hệ thống âm thanh, có nhiệm vụ khuếch đại tín hiệu âm thanh từ nguồn để đẩy loa hoạt động. Việc chọn ampli phù hợp quyết định 60% chất lượng âm thanh cuối cùng.

## Các loại ampli phổ biến

### 1. Integrated Amplifier
**Đặc điểm:**
- Kết hợp preamp và power amp trong một thiết bị
- Có nhiều input (CD, phono, aux, bluetooth)
- Volume control và tone control

**Ưu điểm:**
- Dễ sử dụng, tính năng đầy đủ
- Tiết kiệm không gian
- Giá thành hợp lý

**Phù hợp với:**
- Hệ thống stereo gia đình
- Người mới bắt đầu
- Ngân sách vừa phải

### 2. Power Amplifier (Ampli công suất)
**Đặc điểm:**
- Chỉ có chức năng khuếch đại công suất
- Cần preamp riêng biệt
- Chất lượng âm thanh cao

**Ưu điểm:**
- Chất lượng âm thanh tốt nhất
- Linh hoạt trong việc nâng cấp
- Ít tạp âm

**Phù hợp với:**
- Hệ thống hi-end
- Người có kinh nghiệm
- Ngân sách cao

### 3. AV Receiver
**Đặc điểm:**
- Hỗ trợ đa kênh (5.1, 7.1, 9.1)
- Tích hợp DAC, DSP, room correction
- Nhiều input HDMI

**Ưu điểm:**
- Tính năng phong phú
- Phù hợp xem phim
- All-in-one solution

**Phù hợp với:**
- Home theater
- Người thích tiện lợi
- Sử dụng đa mục đích

## Thông số kỹ thuật quan trọng

### Công suất (Power Output)
**RMS vs Peak Power:**
- **RMS:** Công suất thực tế, liên tục
- **Peak:** Công suất tối đa trong thời gian ngắn
- **Chọn theo RMS** để đánh giá chính xác

**Cách tính công suất cần thiết:**
\`\`\`
Công suất ampli = Công suất loa x 1.5 đến 2
\`\`\`

**Ví dụ:**
- Loa 100W RMS → Ampli 150-200W RMS
- Loa 50W RMS → Ampli 75-100W RMS

### Trở kháng (Impedance)
**Các giá trị phổ biến:**
- 4Ω, 8Ω, 16Ω

**Quy tắc phối ghép:**
- Ampli phải hỗ trợ trở kháng của loa
- Trở kháng thấp hơn = công suất cao hơn
- Không nối loa có trở kháng thấp hơn spec ampli

### Tỷ lệ tín hiệu/nhiễu (SNR)
**Tiêu chuẩn:**
- **Tốt:** >90dB
- **Rất tốt:** >100dB
- **Xuất sắc:** >110dB

### Độ méo tổng (THD)
**Tiêu chuẩn:**
- **Chấp nhận được:** <1%
- **Tốt:** <0.1%
- **Rất tốt:** <0.01%

## Phối ghép ampli với loa

### Theo công suất
**Nguyên tắc vàng:**
\`\`\`
75% ≤ (Công suất loa / Công suất ampli) ≤ 150%
\`\`\`

**Ví dụ phối ghép tốt:**
- Loa 100W + Ampli 75-150W ✅
- Loa 50W + Ampli 40-75W ✅

**Tránh:**
- Ampli quá yếu → clipping, hỏng tweeter
- Ampli quá mạnh → nguy cơ overload loa

### Theo trở kháng
**An toàn:**
- Loa 8Ω + Ampli hỗ trợ 4-16Ω ✅
- Loa 4Ω + Ampli hỗ trợ 4Ω trở lên ✅

**Nguy hiểm:**
- Loa 4Ω + Ampli chỉ hỗ trợ 8Ω ❌

### Theo đặc tính âm thanh
**Loa sáng (bright):**
- Chọn ampli ấm (tube, class AB)
- Tránh ampli quá sắc nét

**Loa ấm (warm):**
- Chọn ampli trong, chi tiết (class D, class A)
- Ampli có độ phân tích cao

## Phân loại theo công nghệ

### Class A
**Đặc điểm:**
- Chất lượng âm thanh tốt nhất
- Hiệu suất thấp (20-30%)
- Phát nhiệt cao

**Ứng dụng:**
- Hệ thống hi-end
- Nghe nhạc chính
- Phòng có điều hòa tốt

### Class AB
**Đặc điểm:**
- Cân bằng chất lượng và hiệu suất
- Hiệu suất 50-70%
- Phổ biến nhất

**Ứng dụng:**
- Đa mục đích
- Tỷ lệ giá/hiệu suất tốt
- Phù hợp đa số người dùng

### Class D
**Đặc điểm:**
- Hiệu suất cao (>90%)
- Kích thước nhỏ gọn
- Phát nhiệt ít

**Ứng dụng:**
- Subwoofer
- Hệ thống di động
- Tiết kiệm điện năng

## Chọn ampli theo mục đích sử dụng

### Nghe nhạc stereo
**Ưu tiên:**
- Chất lượng âm thanh
- Độ phân tích cao
- Stage âm thanh rộng

**Đề xuất:**
- **Budget:** Denon PMA-600NE
- **Mid-range:** Marantz PM6007
- **High-end:** McIntosh MA252

### Home theater
**Ưu tiên:**
- Đa kênh
- Công suất lớn
- Tính năng phong phú

**Đề xuất:**
- **Budget:** Denon AVR-S660H
- **Mid-range:** Yamaha RX-A1080
- **High-end:** Marantz SR8015

### Căn hộ chung cư
**Yêu cầu:**
- Kiểm soát âm lượng tốt
- Không làm ồn hàng xóm
- Chất lượng ở âm lượng thấp

**Đề xuất:**
- Ampli có night mode
- Class A công suất nhỏ
- Headphone output chất lượng cao

## Ngân sách và lời khuyên

### Dưới 10 triệu
**Chiến lược:**
- Ưu tiên integrated ampli
- Chọn thương hiệu Nhật (Denon, Yamaha)
- Tìm hiểu hàng cũ chất lượng

**Sản phẩm đề xuất:**
- Denon PMA-520AE: 6 triệu
- Yamaha A-S301: 8 triệu
- Cambridge Audio AM10: 9 triệu

### 10-30 triệu
**Chiến lược:**
- Cân nhắc pre/power riêng biệt
- Đầu tư vào thương hiệu châu Âu
- Quan tâm đến build quality

**Sản phẩm đề xuất:**
- Marantz PM6007: 15 triệu
- Cambridge Audio CXA61: 20 triệu
- NAD C 368: 25 triệu

### Trên 30 triệu
**Chiến lược:**
- Hệ thống pre/power cao cấp
- Thương hiệu hi-end
- Tube ampli hoặc pure class A

**Sản phẩm đề xuất:**
- McIntosh MA252: 80 triệu
- Pass Labs INT-25: 120 triệu
- Luxman L-590AXII: 150 triệu

## Những sai lầm thường gặp

1. **Chỉ quan tâm công suất:**
   - Bỏ qua chất lượng âm thanh
   - Không tính toán phù hợp với loa

2. **Mua theo thương hiệu:**
   - Không test nghe thực tế
   - Bỏ qua tính tương thích

3. **Không tính đến nâng cấp:**
   - Mua ampli không có đủ input
   - Không có preamp output

## Dịch vụ tư vấn Audio Tài Lộc

### Test nghe tại showroom
- **Phòng nghe chuẩn** với acoustic treatment
- **Đa dạng loa** để test phối ghép
- **Nguồn nhạc chất lượng cao**
- **Không áp lực bán hàng**

### Tư vấn tận nhà
- Khảo sát không gian thực tế
- Đề xuất phù hợp ngân sách
- Demo thiết bị tại nhà
- Hỗ trợ setup và hiệu chỉnh

### Chính sách hỗ trợ
- **Bảo hành chính hãng** đầy đủ
- **Đổi trả trong 7 ngày** nếu không hài lòng
- **Hỗ trợ kỹ thuật** trọn đời
- **Nâng cấp có ưu đãi** cho khách hàng cũ

**Liên hệ tư vấn:** 0909.XXX.XXX`,
    tags: ['ampli', 'amplifier', 'chọn mua', 'phối ghép', 'hướng dẫn'],
    isActive: true
  }
];

async function seedKnowledgeBase() {
  console.log('🌱 Bắt đầu seed dữ liệu Knowledge Base...');

  try {
    // Xóa dữ liệu cũ
    await prisma.knowledgeBaseEntry.deleteMany({
      where: {
        kind: {
          in: ['GUIDE', 'MAINTENANCE', 'TROUBLESHOOTING']
        }
      }
    });

    console.log('🗑️ Đã xóa dữ liệu Knowledge Base cũ');

    // Thêm dữ liệu mới
    for (const article of knowledgeBaseArticles) {
      await prisma.knowledgeBaseEntry.create({
        data: {
          kind: article.kind,
          title: article.title,
          content: article.content,
          tags: article.tags.join(','),
          isActive: article.isActive
        }
      });
      console.log(`✅ Đã tạo bài viết: ${article.title}`);
    }

    console.log(`🎉 Hoàn thành! Đã tạo ${knowledgeBaseArticles.length} bài viết trong Knowledge Base`);

  } catch (error) {
    console.error('❌ Lỗi khi seed Knowledge Base:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Chạy script
if (require.main === module) {
  seedKnowledgeBase();
}

module.exports = { seedKnowledgeBase };