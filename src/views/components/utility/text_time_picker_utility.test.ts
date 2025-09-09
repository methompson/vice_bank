import {
  convert12Hrsto24Hrs,
  convert24HrsTo12Hrs,
} from './text_time_picker_utility';

describe('text_time_picker', () => {
  describe('convert12Hrsto24Hrs', () => {
    it('should convert 12-hour format to 24-hour format', () => {
      expect(convert12Hrsto24Hrs(12, true)).toBe(0);
      expect(convert12Hrsto24Hrs(12, false)).toBe(12);
      expect(convert12Hrsto24Hrs(1, true)).toBe(1);
      expect(convert12Hrsto24Hrs(1, false)).toBe(13);
    });
  });

  describe('convert24HrsTo12Hrs', () => {
    it('should convert 24-hour format to 12-hour format', () => {
      expect(convert24HrsTo12Hrs(0)).toBe(12);
      expect(convert24HrsTo12Hrs(12)).toBe(12);
      expect(convert24HrsTo12Hrs(1)).toBe(1);
      expect(convert24HrsTo12Hrs(13)).toBe(1);
    });
  });
});
