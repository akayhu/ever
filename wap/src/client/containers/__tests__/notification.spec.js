/* eslint-disable */
import { shallow } from 'enzyme';
import NotificationList from 'src/client/containers/notification';
import ListItem from 'src/client/component_notification/listItem';
import Loading from "src/client/component_notification/loading";
import Error from 'src/client/component_notification/error';
import notificationMockStore from "../__mocks__/store";

describe('component / notification', () => {
    beforeEach(() => {
        // redux wrapper
        const shallowWithStore = (component, store) => shallow(component, { store });
        const initState = {
            dataList: [],
            cursor: null,
            hasNext: false,
            total: 0,
            isLoading: false,
            error: false,
        };
    });
    it('should render expect structure', () => {
        expect(NotificationList).toMatchSnapshot();
    });
    it('進入列表，所有通知少於 20 筆，應該顯示全部通知', () => {
        const list = shallowWithStore(<NotificationList />, notificationMockStore(12, { total: 12 }));
        expect(list.find(<ListItem />)).to.have.length(12);
    });
    it('進入列表，所有通知超過 20 筆，應該顯示 20 筆通知', () => {
        const list = shallowWithStore(<NotificationList />, notificationMockStore(20, { total: 35 }));
        expect(list.find(<ListItem />)).to.have.length(20);
    });
    it('進入列表並讀取中，應該顯示 loading 圖示', () => {
        const state = {
            ...initState,
            isLoading: true,
        };
        const list = shallowWithStore(<NotificationList />, state);
        expect(list.contain(<Loading />)).to.equal(true);
    });
    it('進入列表並讀取失敗，應該顯示 error 訊息', () => {
        const state = {
            ...initState,
            error: true,
        };
        const list = shallowWithStore(<NotificationList />, state);
        expect(list.contain(<Error />)).to.equal(true);
    });
    it('讀取更多後尚未到底，應該顯示 10n 筆通知', () => {
        const list = shallowWithStore(<NotificationList />, notificationMockStore(30));
        expect(list.find(<ListItem />)).to.have.length(30);
    });
    it('讀取更多後到底，應該顯示非 10n 筆通知', () => {
        const list = shallowWithStore(<NotificationList />, notificationMockStore(36, { total: 36 }));
        expect(list.find(<ListItem />)).to.have.length(36);
    });
})