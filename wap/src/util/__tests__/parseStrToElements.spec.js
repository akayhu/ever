/* eslint-disable */
import parseStrToElements from '../parseStrToElements';

describe('parseStrToElements', () => {
    it('非字串的輸入, expect null', () => {
        expect(parseStrToElements(['a'])).toBe(null);
        expect(parseStrToElements({ a: 'abc' })).toBe(null);
        expect(parseStrToElements(undefined)).toBe(null);
        expect(parseStrToElements(false)).toBe(null);
        expect(parseStrToElements(null)).toBe(null);
    });
    it('不含 HTML tag 的字串輸入, expect ["文字"]', () => {
        expect(parseStrToElements('testStr')).toEqual(
            expect.arrayContaining(['testStr'])
        );
        expect(parseStrToElements('中文字')).toEqual(
            expect.arrayContaining(['中文字'])
        );
    });
    it('包含 HTML tag 的字串輸入, expect 對應 element', () => {
        expect(parseStrToElements('<p>Test</p>')).toMatchSnapshot();
        expect(parseStrToElements('<div className="c1"><p>Test</p></div>')).toMatchSnapshot();
        expect(parseStrToElements(`<div className="c1"><h1>Test</h1>PureString~~~~</div>`)).toMatchSnapshot();
    });
    it('包含 空白、tab、換行 的字串輸入, expect 跳脫並顯示',  () => {
        expect(parseStrToElements('FirstLine\r\nSecondLine\r\nThirdLine')).toMatchSnapshot();
        expect(parseStrToElements('FirstLine\r\n   SecondLine')).toMatchSnapshot();
        expect(parseStrToElements('FirstLine\r\n\tSecondLine\r\n\tThirdLine')).toMatchSnapshot();
        expect(parseStrToElements(`<p>FirstLine\r\nSecondLine\r\n\tThirdLine\r\nFourthLine</p>`)).toMatchSnapshot();
    });
    it('包含可執行 inline js , expect 被移除',  () => {
        expect(parseStrToElements(`<button onClick="alert('hehehe')">Click Me</button>`)).toMatchSnapshot();
    });
    it('輸入 script 標籤與可執行 js, expect 被移除',  () => {
        expect(parseStrToElements(`<script>alert('hehehe');</script>`)).toMatchSnapshot();
    });
});