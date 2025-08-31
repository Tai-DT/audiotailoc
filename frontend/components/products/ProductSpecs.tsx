'use client';

type Specs = Record<string, string | number | boolean | null | undefined>;

export default function ProductSpecs({
  type,
  specs,
}: {
  type: 'dan-karaoke' | 'dau-karaoke' | 'loa' | 'micro' | 'mixer-vang-so' | 'man-hinh' | 'thanh-ly' | string;
  specs: Specs;
}) {
  const sections: { title: string; fields: Array<{ key: string; label: string }> }[] = (() => {
    switch (type) {
      case 'dan-karaoke':
        return [
          { title: 'Cấu hình hệ thống', fields: [
            { key: 'powerTotal', label: 'Tổng công suất (W)' },
            { key: 'rooms', label: 'Phòng phù hợp (m²)' },
            { key: 'speakerCount', label: 'Số loa' },
          ]},
          { title: 'Kết nối', fields: [
            { key: 'inputs', label: 'Ngõ vào' },
            { key: 'outputs', label: 'Ngõ ra' },
            { key: 'wireless', label: 'Không dây' },
          ]},
        ];
      case 'dau-karaoke':
        return [
          { title: 'Bộ xử lý', fields: [
            { key: 'storage', label: 'Lưu trữ' },
            { key: 'format', label: 'Định dạng hỗ trợ' },
            { key: 'network', label: 'Mạng' },
          ]},
        ];
      case 'loa':
        return [
          { title: 'Thông số loa', fields: [
            { key: 'driver', label: 'Driver' },
            { key: 'frequency', label: 'Dải tần (Hz)' },
            { key: 'sensitivity', label: 'Độ nhạy (dB)' },
            { key: 'impedance', label: 'Trở kháng (Ω)' },
            { key: 'power', label: 'Công suất (W)' },
          ]},
          { title: 'Kích thước & Khối lượng', fields: [
            { key: 'dimensions', label: 'Kích thước (mm)' },
            { key: 'weight', label: 'Khối lượng (kg)' },
          ]},
        ];
      case 'micro':
        return [
          { title: 'Thông số micro', fields: [
            { key: 'pattern', label: 'Hướng thu' },
            { key: 'frequency', label: 'Dải tần (Hz)' },
            { key: 'sensitivity', label: 'Độ nhạy (mV/Pa)' },
            { key: 'wireless', label: 'Không dây' },
          ]},
        ];
      case 'mixer-vang-so':
        return [
          { title: 'Kênh & Xử lý', fields: [
            { key: 'channels', label: 'Số kênh' },
            { key: 'effects', label: 'Hiệu ứng' },
            { key: 'eq', label: 'EQ' },
          ]},
          { title: 'Kết nối', fields: [
            { key: 'inputs', label: 'Ngõ vào' },
            { key: 'outputs', label: 'Ngõ ra' },
            { key: 'usb', label: 'USB/PC' },
          ]},
        ];
      case 'man-hinh':
        return [
          { title: 'Màn hình', fields: [
            { key: 'size', label: 'Kích thước (inch)' },
            { key: 'resolution', label: 'Độ phân giải' },
            { key: 'touch', label: 'Cảm ứng' },
          ]},
        ];
      default:
        return [
          { title: 'Thông số chung', fields: [
            { key: 'brand', label: 'Thương hiệu' },
            { key: 'model', label: 'Model' },
            { key: 'warranty', label: 'Bảo hành' },
          ]},
        ];
    }
  })();

  const formatValue = (value: any) => {
    if (value === true) return 'Có';
    if (value === false) return 'Không';
    return value ?? '-';
  };

  return (
    <div className="space-y-6">
      {sections.map((section) => (
        <div key={section.title} className="border rounded-lg bg-white">
          <div className="px-4 py-3 font-semibold border-b">{section.title}</div>
          <div className="divide-y">
            {section.fields.map((f) => (
              <div key={f.key} className="grid grid-cols-2 gap-4 px-4 py-3 text-sm">
                <div className="text-gray-600">{f.label}</div>
                <div className="text-gray-900">{formatValue((specs as any)[f.key])}</div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

