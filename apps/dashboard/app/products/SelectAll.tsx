"use client";

export default function SelectAll(props: { name: string }) {
  return (
    <input
      type="checkbox"
      aria-label="Chọn tất cả"
      onChange={(e) => {
        const form = (e.target as HTMLInputElement).closest('form');
        if (!form) return;
        const boxes = Array.from(form.querySelectorAll<HTMLInputElement>(`input[type="checkbox"][name="${props.name}"]`));
        boxes.forEach((b) => {
          b.checked = (e.target as HTMLInputElement).checked;
        });
        try {
          const m = document.cookie.match(/(?:^|; )adminSel=([^;]+)/);
          const current = m ? (JSON.parse(decodeURIComponent(m[1])) as string[]) : [];
          const values = boxes.map((b) => String(b.value));
          const set = new Set(current);
          if ((e.target as HTMLInputElement).checked) values.forEach((v) => set.add(v));
          else values.forEach((v) => set.delete(v));
          document.cookie = `adminSel=${encodeURIComponent(JSON.stringify(Array.from(set)))}; path=/`;
        } catch {
          // ignore
        }
      }}
    />
  );
}
