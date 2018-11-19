import { MinStrLengthPipe } from './min-str-length.pipe';

describe('MinStrLengthPipe', () => {
  it('create an instance', () => {
    const pipe = new MinStrLengthPipe();
    expect(pipe).toBeTruthy();
  });
});
