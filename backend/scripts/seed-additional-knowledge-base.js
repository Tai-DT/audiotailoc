const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const additionalArticles = [
  {
    kind: 'FAQ',
    title: 'Câu hỏi thường gặp về hệ thống âm thanh',
    content: `# Câu hỏi thường gặp về hệ thống âm thanh

## Về việc chọn mua

### Q: Tôi nên bắt đầu từ đâu khi muốn mua hệ thống âm thanh?
**A:** Hãy xác định:
1. **Ngân sách:** Bao nhiêu tiền bạn muốn đầu tư
2. **Mục đích:** Nghe nhạc, xem phim, hay đa mục đích
3. **Không gian:** Kích thước và đặc điểm phòng
4. **Sở thích:** Thể loại nhạc yêu thích

Audio Tài Lộc khuyên nên đầu tư 40% cho loa, 30% cho ampli, 20% cho nguồn, 10% cho phụ kiện.

### Q: Loa to có nhất định hay hơn loa nhỏ không?
**A:** Không nhất thiết. Loa to có ưu điểm:
- Tái tạo âm trầm tốt hơn
- Xử lý công suất lớn hơn
- Phù hợp phòng rộng

Nhưng loa nhỏ cũng có điểm mạnh:
- Dễ điều chỉnh vị trí
- Phù hợp không gian nhỏ
- Giá thành hợp lý hơn

Quan trọng là **phù hợp với không gian và nhu cầu**.

### Q: Tôi có cần mua cáp đắt tiền không?
**A:** Cáp quan trọng nhưng không cần quá đắt:

**Cáp loa:**
- Dưới 3m: Cáp đồng nguyên chất 12-14 AWG là đủ
- Trên 3m: Nên dùng 10-12 AWG
- Tránh cáp quá mỏng hoặc có nhiều connector

**Cáp tín hiệu:**
- Dùng cáp có shielding tốt
- Balanced (XLR) tốt hơn unbalanced (RCA)
- Độ dài ngắn nhất có thể

## Về setup và sử dụng

### Q: Loa của tôi có tiếng rè, nguyên nhân là gì?
**A:** Các nguyên nhân phổ biến:

1. **Ground loop:** Nhiều thiết bị cùng nguồn điện
   - **Giải pháp:** Dùng power conditioner hoặc ground lift

2. **Nhiễu electromagnetic:** Gần router, điện thoại
   - **Giải pháp:** Di chuyển thiết bị ra xa

3. **Gain quá cao:** Input overload
   - **Giải pháp:** Giảm gain, tăng volume output

4. **Cáp kém chất lượng:** Không có shielding
   - **Giải pháp:** Thay cáp chất lượng tốt

### Q: Tại sao âm thanh của tôi nghe "khô" và thiếu chiều sâu?
**A:** Có thể do:

**Room acoustics:**
- Phòng quá "live" (nhiều bề mặt cứng)
- **Giải pháp:** Thêm thảm, rèm, sofa

**Vị trí loa:**
- Quá gần tường
- **Giải pháp:** Kéo loa ra giữa phòng

**Thiết lập không đúng:**
- Loa không toe-in
- **Giải pháp:** Nghiêng loa về phía vị trí nghe

**Chất lượng nguồn:**
- File nhạc chất lượng thấp
- **Giải pháp:** Dùng FLAC, DSD, hoặc vinyl chất lượng

### Q: Loa passive và active khác nhau như thế nào?
**A:** 

**Loa Passive:**
- Cần ampli riêng
- Linh hoạt trong việc phối ghép
- Dễ nâng cấp từng thành phần
- **Phù hợp:** Hệ thống hi-fi truyền thống

**Loa Active:**
- Có ampli tích hợp
- Plug-and-play
- Tối ưu hóa driver và ampli
- **Phù hợp:** Studio, modern setup

## Về bảo trì

### Q: Tôi cần vệ sinh loa bao lâu một lần?
**A:** 

**Hàng tuần:** Lau bụi bề mặt bằng khăn microfiber

**Hàng tháng:** 
- Vệ sinh kỹ vỏ loa
- Kiểm tra các kết nối
- Quay nhẹ volume để làm sạch potentiometer

**6 tháng/lần:**
- Tháo grille vệ sinh
- Kiểm tra driver có bị lỏng không
- Bảo trì ampli (nếu có)

**LƯU Ý:** Tuyệt đối không chạm vào cone loa và tweeter.

### Q: Thiết bị của tôi bị quá nóng, có sao không?
**A:** Cần chú ý:

**Nhiệt độ bình thường:**
- Ampli class AB: 40-50°C
- Ampli class A: 60-70°C
- Subwoofer: 35-45°C

**Dấu hiệu cảnh báo:**
- Quá nóng để chạm tay
- Quạt chạy liên tục max speed
- Thiết bị tự shutdown

**Giải pháp:**
- Đảm bảo thông gió 15cm mỗi phía
- Không đặt thiết bị chồng lên nhau
- Kiểm tra quạt tản nhiệt
- Vệ sinh bụi bặm

## Về nâng cấp

### Q: Tôi nên nâng cấp thành phần nào trước?
**A:** Thứ tự ưu tiên:

1. **Acoustic treatment phòng** (hiệu quả cao, chi phí thấp)
2. **Loa** (tác động lớn nhất đến âm thanh)
3. **Vị trí đặt loa** (miễn phí nhưng hiệu quả)
4. **Ampli** (nếu không đủ công suất hoặc chất lượng kém)
5. **Nguồn** (DAC, CD player, turntable)
6. **Cáp và phụ kiện** (tác động nhỏ nhất)

### Q: Khi nào thì cần nâng cấp ampli?
**A:** Các dấu hiệu cần nâng cấp:

**Hiệu năng:**
- Âm thanh bị clip ở volume cao
- Không đủ công suất cho loa mới
- Noise floor cao

**Tính năng:**
- Thiếu input cần thiết
- Không có tone control/EQ
- Không có headphone output

**Chất lượng:**
- Ampli quá cũ (>15 năm)
- Linh kiện đã xuống cấp
- Muốn nâng cấp âm thanh

## Về sự cố

### Q: Loa của tôi bỗng nhiên mất tiếng một bên, phải làm sao?
**A:** Troubleshooting từng bước:

1. **Kiểm tra balance:** Xem ampli có bị lệch L/R không
2. **Đổi cáp:** Swap cáp L/R để xem lỗi theo cáp hay ampli
3. **Test nguồn:** Thử nguồn khác (điện thoại, laptop)
4. **Kiểm tra kết nối:** Các jack có chắc chắn không
5. **Test loa:** Đổi vị trí loa L/R

**Nếu vẫn không được:** Liên hệ Audio Tài Lộc để được hỗ trợ chẩn đoán chuyên nghiệp.

### Q: Micro wireless của tôi bị nhiễu, làm sao khắc phục?
**A:** Các bước giải quyết:

**Kiểm tra tần số:**
1. Scan tần số tự động
2. Tránh kênh WiFi (2.4GHz)
3. Thử kênh ít sử dụng

**Cải thiện tín hiệu:**
1. Đặt receiver cao hơn
2. Loại bỏ vật cản
3. Giảm khoảng cách

**Kiểm tra nguồn nhiễu:**
1. Tắt WiFi router tạm thời
2. Di chuyển xa smartphone
3. Tắt thiết bị điện tử không cần thiết

## Liên hệ hỗ trợ

**Hotline:** 0909.XXX.XXX
**Email:** support@audiotailoc.com
**Zalo:** AudioTaiLoc Official
**Địa chỉ:** 123 Đường ABC, Quận XYZ, TP.HCM

**Thời gian hỗ trợ:** 8h-22h hàng ngày
**Hỗ trợ khẩn cấp:** 24/7 cho khách hàng VIP`,
    tags: ['FAQ', 'câu hỏi', 'thường gặp', 'hỗ trợ', 'tư vấn'],
    isActive: true
  },
  {
    kind: 'GUIDE',
    title: 'Hướng dẫn sử dụng Equalizer (EQ) hiệu quả',
    content: `# Hướng dẫn sử dụng Equalizer (EQ) hiệu quả

## Tổng quan về Equalizer

Equalizer (EQ) là công cụ điều chỉnh cân bằng tần số, giúp tối ưu âm thanh phù hợp với không gian nghe, thiết bị và sở thích cá nhân. Việc sử dụng EQ đúng cách có thể cải thiện đáng kể chất lượng âm thanh.

## Hiểu về dải tần số

### Sub-bass (20-60Hz)
**Đặc điểm:**
- Tần số cực thấp, cảm nhận bằng cơ thể
- Tạo độ đầy đặn, sức mạnh

**Khi nào điều chỉnh:**
- **Boost (+2 đến +4dB):** Khi muốn thêm punch cho bass drum, organ
- **Cut (-3 đến -6dB):** Khi bass quá ì, làm đục âm thanh

**Lưu ý:** Phòng nhỏ thường có vấn đề với dải này

### Bass (60-200Hz)
**Đặc điểm:**
- Nền tảng của âm nhạc
- Tạo warmth và thickness

**Cách điều chỉnh:**
- **Rock/Pop:** Boost nhẹ 80-120Hz
- **Jazz/Classical:** Giữ tự nhiên hoặc cut nhẹ
- **Electronic:** Boost 60-80Hz cho kick drum

### Lower Midrange (200-500Hz)
**Đặc điểm:**
- Vùng "muddy" dễ gây đục âm thanh
- Chứa harmonics của bass

**Thường xuyên cut:**
- Cut 2-4dB ở 300-400Hz để làm sạch âm thanh
- Tránh boost vùng này trừ khi cần thiết

### Midrange (500Hz-2kHz)
**Đặc điểm:**
- Vùng quan trọng nhất cho giọng hát
- Tai người nhạy cảm nhất với dải này

**Điều chỉnh cẩn thận:**
- **Giọng nam:** 500Hz-1kHz
- **Giọng nữ:** 1-2kHz
- **Instruments:** Guitar, piano, violin

### Upper Midrange (2-4kHz)
**Đặc điểm:**
- Tạo độ rõ ràng, presence
- Dễ gây harsh nếu quá mức

**Ứng dụng:**
- **Boost nhẹ (+1 đến +3dB):** Tăng clarity cho vocal
- **Cut (-2 đến -4dB):** Giảm harsh, sibilance

### Treble (4-10kHz)
**Đặc điểm:**
- Tạo độ sáng, chi tiết
- Vùng "presence" của instruments

**Cân bằng quan trọng:**
- **Boost:** Thêm sparkle, air
- **Cut:** Giảm fatigue, harshness

### High Treble (10-20kHz)
**Đặc điểm:**
- Tạo "air" và không gian
- Không phải ai cũng nghe được đầy đủ

**Sử dụng tinh tế:**
- Boost nhẹ cho thiết bị "dull"
- Cut nếu quá sắc hoặc có tinnitus

## Các loại EQ và cách sử dụng

### Graphic EQ
**Đặc điểm:**
- Các slider cố định (31-band, 15-band, 10-band)
- Dễ nhìn, trực quan

**Cách sử dụng:**
1. Bắt đầu với tất cả slider ở 0dB
2. Nghe nhạc quen thuộc
3. Điều chỉnh từng dải một cách nhỏ nhặt
4. A/B test với bypass thường xuyên

### Parametric EQ
**Đặc điểm:**
- Điều chỉnh được frequency, Q, gain
- Linh hoạt hơn nhưng phức tạp hơn

**Thông số quan trọng:**
- **Frequency:** Tần số trung tâm
- **Q (Quality factor):** Độ rộng băng tần
- **Gain:** Mức boost/cut

**Q values thường dùng:**
- **Q = 0.7:** Wide, musical
- **Q = 1.0:** Balanced
- **Q = 2.0+:** Narrow, surgical

## Phương pháp EQ hiệu quả

### Nguyên tắc "Cut before Boost"
**Tại sao?**
- Cut ít gây artifact hơn boost
- Tạo headroom cho amplifier
- Âm thanh tự nhiên hơn

**Ví dụ:**
- Thay vì boost treble +3dB
- Hãy cut mid -2dB để tạo contrast

### Technique "Sweep and Destroy"
**Cho việc tìm tần số problem:**
1. Boost một band ~6-10dB
2. Sweep (quét) qua toàn bộ dải tần
3. Khi nghe thấy frequency khó chịu
4. Stop và cut frequency đó 2-4dB

### Room Correction EQ
**Mục đích:** Khắc phục vấn đề acoustic phòng

**Các vấn đề phổ biến:**
- **Standing waves:** Cut các frequency bị boost
- **Null points:** Boost nhẹ frequency bị cut
- **Flutter echo:** Cut upper midrange

**Tools cần thiết:**
- REW (Room EQ Wizard) - miễn phí
- Measurement microphone
- Pink noise generator

## EQ theo thể loại nhạc

### Classical Music
**Đặc điểm:** Dynamic range rộng, instruments tự nhiên

**Gợi ý EQ:**
- Giữ nguyên hoặc điều chỉnh rất nhẹ
- Có thể boost nhẹ sub-bass cho organ
- Cut nhẹ 2-3kHz nếu quá forward

### Jazz
**Đặc điểm:** Acoustic instruments, vocal natural

**Gợi ý EQ:**
- Boost nhẹ 80-120Hz cho upright bass
- Boost nhẹ 3-5kHz cho brass clarity
- Roll-off dưới 40Hz để tránh rumble

### Rock/Pop
**Đặc điểm:** Compressed, punch, energy

**Gợi ý EQ:**
- Boost 60-80Hz cho kick drum
- Cut 200-400Hz để giảm muddiness
- Boost 3-5kHz cho vocal presence
- Boost 8-12kHz cho cymbal sparkle

### Electronic/EDM
**Đặc điểm:** Sub-bass mạnh, synthesized sounds

**Gợi ý EQ:**
- Boost 40-60Hz cho sub-bass
- Cut 300Hz để clean up
- Boost 2-4kHz cho lead clarity
- Boost 10kHz+ cho high-freq effects

### Hip-hop
**Đặc điểm:** Strong bass, vocal forward

**Gợi ý EQ:**
- Boost 50-80Hz cho bass drum
- Cut 400-600Hz
- Boost 1-3kHz cho vocal
- Boost 12kHz+ cho hi-hats

## EQ trong các tình huống đặc biệt

### Nghe đêm (Night Mode)
**Mục đích:** Giảm dynamic range, tránh làm ồn

**Thiết lập:**
- Cut bass dưới 100Hz (-3 đến -6dB)
- Boost midrange (+2 đến +4dB)
- Cut treble trên 8kHz (-2dB)
- Sử dụng compressor nhẹ

### Nghe trong ô tô
**Thách thức:** Noise floor cao, acoustic phức tạp

**Gợi ý:**
- Boost bass để compensate road noise
- Boost upper midrange cho clarity
- Cut 1-2kHz để giảm fatigue
- High-pass filter dưới 80Hz

### Headphone EQ
**Đặc điểm:** Không có crossfeed tự nhiên

**Điều chỉnh thường thấy:**
- Harman curve cho neutral sound
- Oratory1990 measurements
- Boost/cut theo driver characteristics

## Lỗi thường gặp khi dùng EQ

### Over-EQing
**Dấu hiệu:**
- Điều chỉnh quá nhiều bands
- Boost/cut quá mạnh (>6dB)
- Âm thanh không còn tự nhiên

**Giải pháp:**
- Less is more
- Mỗi lần chỉ điều chỉnh 1-2 bands
- Thường xuyên bypass để so sánh

### Không A/B test
**Vấn đề:** Tai quen với EQ setting sai

**Giải pháp:**
- Bypass EQ thường xuyên
- Nghe cả track gốc và EQ
- Nghỉ giải lao giữa sessions

### EQ để "fix" thiết bị kém
**Hiểu lầm:** EQ có thể biến loa rẻ thành loa đắt

**Thực tế:**
- EQ chỉ cải thiện chứ không thay đổi bản chất
- Không thể tạo ra frequency không tồn tại
- Driver quality vẫn là yếu tố quyết định

## Tools và Software khuyến nghị

### Free
- **Equalizer APO** (Windows)
- **eqMac** (macOS)
- **REW** (Room analysis)
- **Peace GUI** (Equalizer APO interface)

### Paid
- **SonarWorks Reference 4**
- **Dirac Live**
- **Audyssey MultEQ**
- **Trinnov Optimizer**

## Kết luận

EQ là công cụ mạnh mẽ nhưng cần sử dụng cẩn thận. Mục tiêu cuối cùng là tạo ra âm thanh phù hợp với sở thích và không gian nghe của bạn, chứ không phải follow một "công thức" cố định.

**Lời khuyên cuối:** Hãy tin vào tai của bạn, và nhớ rằng âm thanh "tốt" là âm thanh mà bạn thích nghe.

Để được tư vấn EQ chuyên sâu cho hệ thống của bạn, liên hệ Audio Tài Lộc: **0909.XXX.XXX**`,
    tags: ['EQ', 'equalizer', 'điều chỉnh', 'âm thanh', 'hướng dẫn'],
    isActive: true
  },
  {
    kind: 'TROUBLESHOOTING',
    title: 'Sửa lỗi kết nối Bluetooth và wireless',
    content: `# Sửa lỗi kết nối Bluetooth và wireless

## Tổng quan về vấn đề kết nối

Kết nối không dây đang ngày càng phổ biến trong thiết bị âm thanh, nhưng cũng đi kèm với nhiều thách thức về độ ổn định và chất lượng. Hướng dẫn này sẽ giúp bạn khắc phục các vấn đề phổ biến.

## Bluetooth Audio

### Vấn đề 1: Không thể kết nối Bluetooth

**Triệu chứng:**
- Thiết bị không hiện trong danh sách
- Kết nối thất bại với thông báo lỗi
- Kết nối rồi lại ngắt ngay

**Nguyên nhân và giải pháp:**

**1. Thiết bị không ở chế độ pairing**
- **Kiểm tra:** LED báo có nhấp nháy không
- **Giải pháp:** Giữ nút Bluetooth 3-5 giây cho đến khi LED nhấp nháy nhanh

**2. Cache Bluetooth bị lỗi**
- **Android:**
  1. Settings → Apps → Bluetooth → Storage → Clear Cache
  2. Restart điện thoại
- **iOS:**
  1. Settings → General → Reset → Reset Network Settings
  2. Nhập lại mật khẩu WiFi

**3. Thiết bị đã kết nối với device khác**
- **Kiểm tra:** Tắt Bluetooth trên tất cả devices khác
- **Giải pháp:** Clear pairing list trên loa/headphone

**4. Phiên bản Bluetooth không tương thích**
- **Kiểm tra:** Bluetooth version của cả 2 thiết bị
- **Giải pháp:** Update firmware nếu có

### Vấn đề 2: Âm thanh bị gián đoạn

**Triệu chứng:**
- Nhạc dừng, chạy, dừng liên tục
- Audio bị lag hoặc stutter
- Kết nối ngắt đột ngột

**Nguyên nhân và giải pháp:**

**1. Khoảng cách quá xa**
- **Kiểm tra:** Thử ở khoảng cách 1-2m
- **Giải pháp:** Bluetooth range thường 5-10m, tránh vật cản

**2. Nhiễu tần số 2.4GHz**
- **Nguyên nhân:** WiFi, microwave, phone không dây
- **Giải pháp:** 
  - Tắt WiFi tạm thời để test
  - Di chuyển xa router WiFi
  - Đổi kênh WiFi sang 5GHz

**3. Codec không phù hợp**
- **SBC:** Chất lượng thấp nhất, universal
- **AAC:** Tốt cho iOS devices
- **aptX/aptX HD:** Tốt cho Android
- **LDAC:** Chất lượng cao nhất (Sony)

**Cách force codec tốt hơn:**
- **Android:** Developer Options → Bluetooth Audio Codec
- **iOS:** Tự động chọn AAC

**4. Buffer size không phù hợp**
- **Triệu chứng:** Audio lag khi xem video
- **Giải pháp:** Adjust audio delay trong app hoặc TV settings

### Vấn đề 3: Chất lượng âm thanh kém

**Triệu chứng:**
- Âm thanh bị nén, mất chi tiết
- Bass yếu, treble harsh
- Stereo imaging kém

**Cải thiện chất lượng:**

**1. Kiểm tra codec đang sử dụng**
- Ưu tiên: LDAC > aptX HD > aptX > AAC > SBC
- Force codec tốt nhất mà cả 2 thiết bị hỗ trợ

**2. Optimzie source quality**
- Sử dụng file lossless (FLAC, ALAC)
- Streaming với bitrate cao nhất
- Tránh double compression

**3. Điều chỉnh EQ**
- Bluetooth thường lose some dynamics
- Boost nhẹ bass và treble
- Cut mid nếu quá forward

## WiFi Audio (AirPlay, Chromecast, DLNA)

### Vấn đề 1: Không tìm thấy device

**Các protocol phổ biến:**
- **AirPlay:** Apple ecosystem
- **Chromecast:** Google ecosystem  
- **DLNA/UPnP:** Universal
- **Spotify Connect:** Spotify ecosystem

**Troubleshooting steps:**

**1. Cùng network**
- Đảm bảo phone và speaker cùng WiFi network
- Tránh guest network hoặc isolated networks
- Kiểm tra subnet settings

**2. Firewall/Router settings**
- Enable UPnP trên router
- Port forwarding nếu cần:
  - AirPlay: 5000, 6000-6001, 7000
  - Chromecast: 8008, 8009
  - DLNA: 1900, 8200

**3. Multicast support**
- Enable IGMP snooping
- Disable AP isolation
- Enable multicast forwarding

### Vấn đề 2: Audio bị delay

**Nguyên nhân:**
- Network latency
- Buffer size lớn
- Processing delay

**Giải pháp:**

**1. Optimize network**
- 5GHz WiFi thay vì 2.4GHz
- Router gần thiết bị phát
- Ethernet cho devices cố định

**2. Adjust buffer settings**
- Giảm buffer size trong app
- Trade-off giữa delay và stability
- Test với audio/video sync

**3. Use wired connection**
- Ethernet cho receiver
- Optical/coax cho audio path
- Bluetooth chỉ cho control

## Wireless Microphone

### Vấn đề 1: Nhiễu và interference

**Các loại nhiễu:**

**1. RF Interference**
- **Nguyên nhân:** TV stations, phones, WiFi
- **Giải pháp:** 
  - Scan frequencies trước event
  - Sử dụng true diversity receiver
  - Antenna placement tối ưu

**2. Intermodulation Distortion**
- **Nguyên nhân:** Nhiều micro cùng frequency range
- **Giải pháp:**
  - Frequency coordination software
  - Giữ khoảng cách frequency đủ lớn
  - Limit số lượng micro đồng thời

**3. Multipath Interference**
- **Nguyên nhân:** Tín hiệu phản xạ từ kim loại
- **Giải pháp:**
  - Di chuyển receiver
  - Sử dụng directional antennas
  - Antenna diversity

### Vấn đề 2: Dropouts và range issues

**Cải thiện range:**

**1. Antenna positioning**
- Receiver antenna cao nhất có thể
- Line of sight với transmitter
- Tránh metal objects

**2. Power management**
- Fresh batteries cho transmitter
- Rechargeable batteries quality
- Power saving modes

**3. Diversity systems**
- True diversity > antenna diversity
- Space diversity antennas tối thiểu 1/4 wavelength
- Polarization diversity

## Tools chẩn đoán

### Software Tools

**1. WiFi Analyzer (Android/iOS)**
- Xem channel congestion
- Signal strength mapping
- Interference detection

**2. Bluetooth Scanner**
- Device discovery
- Signal strength
- Connection diagnostics

**3. Audio Latency Test Apps**
- Measure delay
- Sync testing
- Buffer optimization

### Hardware Tools

**1. RF Scanner**
- Professional frequency analysis
- For wireless microphone setup
- Interference detection

**2. Network Analyzer**
- WiFi network testing
- Bandwidth monitoring
- Packet loss detection

**3. Audio Interface với monitoring**
- Real-time level monitoring
- Latency measurement
- Quality analysis

## Preventive Measures

### Setup Best Practices

**1. Site Survey**
- RF scan trước khi setup
- Network infrastructure check
- Interference sources mapping

**2. Redundancy**
- Backup wireless channels
- Wired alternatives
- Multiple receivers

**3. Documentation**
- Frequency assignments
- Network configurations
- Troubleshooting logs

### Maintenance Schedule

**Hàng ngày (live events):**
- Battery level check
- RF scan
- Connection tests

**Hàng tuần:**
- Firmware updates
- Frequency coordination
- Performance monitoring

**Hàng tháng:**
- Deep RF analysis
- Network optimization
- Equipment calibration

## Khi nào cần hỗ trợ chuyên nghiệp

### Dấu hiệu cần can thiệp chuyên gia:
- Interference không thể khắc phục
- Multiple systems conflict
- Professional event requirements
- Complex network environments

### Dịch vụ Audio Tài Lộc:

**Site Survey Service:**
- RF environment analysis
- Network assessment
- Optimal configuration planning

**Installation & Setup:**
- Professional installation
- Frequency coordination
- System optimization

**24/7 Support:**
- Remote diagnostics
- On-site emergency support
- Live event monitoring

**Training Programs:**
- Staff training
- Best practices workshops
- Certification programs

**Liên hệ:** 0909.XXX.XXX cho tư vấn wireless audio professional.`,
    tags: ['bluetooth', 'wireless', 'kết nối', 'sửa lỗi', 'troubleshooting'],
    isActive: true
  }
];

async function seedAdditionalKnowledgeBase() {
  console.log('🌱 Bắt đầu seed thêm dữ liệu Knowledge Base...');

  try {
    // Thêm dữ liệu mới
    for (const article of additionalArticles) {
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

    console.log(`🎉 Hoàn thành! Đã tạo thêm ${additionalArticles.length} bài viết trong Knowledge Base`);

  } catch (error) {
    console.error('❌ Lỗi khi seed Knowledge Base:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Chạy script
if (require.main === module) {
  seedAdditionalKnowledgeBase();
}

module.exports = { seedAdditionalKnowledgeBase };