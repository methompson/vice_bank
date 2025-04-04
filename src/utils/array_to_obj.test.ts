import { arrayToObject } from './array_to_obj';

describe('arrayToObject', () => {
  test('converts number arrays to objects', () => {
    const numInput = [1, 2, 3, 4];

    const map = arrayToObject(numInput, (num) => num);

    expect(map[1]).toBe(1);
    expect(map[2]).toBe(2);
    expect(map[3]).toBe(3);
    expect(map[4]).toBe(4);
  });

  test('converts string arrays to objects', () => {
    const strInput = ['1', '2', '3', '4'];

    const map = arrayToObject(strInput, (str) => str);

    expect(map['1']).toBe('1');
    expect(map['2']).toBe('2');
    expect(map['3']).toBe('3');
    expect(map['4']).toBe('4');
  });

  test('complex data structures can also be used with any value', () => {
    class MyTestClass {
      id: string;

      constructor(public name: string) {
        this.id = `${Math.random()}`;
      }
    }

    const tc1 = new MyTestClass('name 1');
    const tc2 = new MyTestClass('name 2');
    const tc3 = new MyTestClass('name 3');
    const tc4 = new MyTestClass('name 4');

    const map1 = arrayToObject([tc1, tc2, tc3, tc4], (c) => c.id);

    expect(map1[tc1.id]).toBe(tc1);
    expect(map1[tc2.id]).toBe(tc2);
    expect(map1[tc3.id]).toBe(tc3);
    expect(map1[tc4.id]).toBe(tc4);

    const map2 = arrayToObject([tc1, tc2, tc3, tc4], (c) => c.name);

    expect(map2[tc1.name]).toBe(tc1);
    expect(map2[tc2.name]).toBe(tc2);
    expect(map2[tc3.name]).toBe(tc3);
    expect(map2[tc4.name]).toBe(tc4);
  });
});
