import { strict as assert } from 'assert';
import { removeVietnameseTones, slugify } from '../src/common/utils/slug';

describe('slug utils', () => {
  it('removeVietnameseTones strips accents', () => {
    assert.equal(removeVietnameseTones('Âm thanh Karaoke Đỉnh Cao'), 'Am thanh Karaoke Dinh Cao');
    assert.equal(removeVietnameseTones('Tài Lộc'), 'Tai Loc');
  });

  it('slugify generates SEO-friendly slugs', () => {
    assert.equal(slugify('Dàn Karaoke Gia Đình CAF VIP 2'), 'dan-karaoke-gia-dinh-caf-vip-2');
    assert.equal(slugify('  Loa Sub  CAF CA-218S  '), 'loa-sub-caf-ca-218s');
  });
});

