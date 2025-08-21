"use client";

function getSel(): string[] {
  try {
    const m = document.cookie.match(/(?:^|; )adminSel=([^;]+)/);
    if (!m) return [];
    return JSON.parse(decodeURIComponent(m[1])) as string[];
  } catch {
    return [];
  }
}

function setSel(arr: string[]) {
  const v = encodeURIComponent(JSON.stringify(Array.from(new Set(arr))));
  document.cookie = `adminSel=${v}; path=/`;
}

export function SelectedIndicator() {
  const [count, setCount] = require('react').useState(0);
  require('react').useEffect(() => {
    function update() {
      setCount(getSel().length);
    }
    update();
    const iv = setInterval(update, 500);
    return () => clearInterval(iv);
  }, []);
  if (count <= 0) return null;
  return <span style={{ marginLeft: 8, color: '#555' }}>Đã chọn: {count}</span>;
}

export default function RowSelect(props: { slug: string; name?: string }) {
  const React = require('react');
  const [checked, setChecked] = React.useState(false);
  React.useEffect(() => {
    setChecked(getSel().includes(props.slug));
  }, [props.slug]);
  return (
    <input
      type="checkbox"
      name={props.name ?? 'slugs'}
      value={props.slug}
      checked={checked}
      onChange={(e) => {
        const cur = getSel();
        if (e.target.checked) setSel([...cur, props.slug]);
        else setSel(cur.filter((s) => s !== props.slug));
        setChecked(e.target.checked);
      }}
    />
  );
}

