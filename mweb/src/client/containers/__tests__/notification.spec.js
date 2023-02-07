/* eslint-disable */
import React from 'react';
import configureStore from 'redux-mock-store';
import { shallow } from 'enzyme';
import NotificationList from 'src/client/containers/mNotification';
import notificationMockStore from "../__mocks__/notificationMockStore";

describe('component / notification', () => {
    let Loading, Error, End;
    beforeEach(() => {
        Loading = () => (
            <div styleName="loading" className="loading-box">
                <div className="loading-animate gray">
                <i></i><i></i><i></i>
                </div>
                <span>載入中</span>
            </div>
        );
        Error = () => (
            <div styleName="error">
              Oops～載入資料發生錯誤！<a href={history.currentUrl}>點我重整</a>
            </div>
        );
        End = () => (
            <div styleName="end">
                沒資料了！<a href="/m">回首頁</a>
            </div>
        );
    });
    it('should render expect structure', () => {
        const list = shallowWithStore(<NotificationList />, notificationMockStore('init'));
        expect(list).toMatchSnapshot();
    });
    it('進入列表，所有通知少於 20 筆，應該顯示全部通知', () => {
        const list = mountWithStore(<NotificationList />, notificationMockStore(12, { total: 12 }));
        console.log('test', list.find('dd'));
        expect(list.find('dd').length).toBe(12);
    });
    it('進入列表，所有通知超過 20 筆，應該顯示 20 筆通知', () => {
        const list = shallowWithStore(<NotificationList />, notificationMockStore(20, { total: 35 }));
        expect(list.find('dd').length).toBe(20);
    });
    it('進入列表並讀取中，應該顯示 loading 圖示', () => {
        const list = shallowWithStore(<NotificationList />, notificationMockStore('init', { isLoading: true, }));
        expect(list.contains(<Loading />)).toEqual(true);
    });
    it('進入列表並讀取失敗，應該顯示 error 訊息', () => {
        const list = shallowWithStore(<NotificationList />, notificationMockStore('init', { error: true, }));
        expect(list.contains(<Error />)).toEqual(true);
    });
    it('讀取更多後尚未到底，應該顯示 10n 筆通知', () => {
        const list = shallowWithStore(<NotificationList />, notificationMockStore(30));
        expect(list.find('dd').length).toBe(30);
    });
    it('讀取更多後到底，應該顯示非 10n 筆通知', () => {
        const list = shallowWithStore(<NotificationList />, notificationMockStore(36, { total: 36 }));
        expect(list.find('dd').length).toBe(36);
    });
})