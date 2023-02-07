"use strict";

export default {
  path: '/topic',
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      cb(null, require('src/client/containers/topic/index').default )
    }, "topic");
  }
};

export const articleList = {
  path: '/topic/:topic/articleList',
  onEnter: (nextState, replace) => {
    // 判斷是否有無這個類別，若無則導向到hots
    if (!haveArticleTab(nextState.params.topic)) {
      replace('/topic/hots/articleList');
    }
  },
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      cb(null, require('src/client/containers/topic/articleList').default )
    }, "topicArticleList");
  }
};

export const staffList = {
  path: '/topic/:topic/staffList',
  onEnter: (nextState, replace) => {
    const tab = nextState.params.topic;
    if (!haveStaffTab(tab)) {
      // 判斷是否有無這個類別，若無則導向到followed
      replace('/topic/followed/staffList');
    } else if (tab === 'endorse' && nextState.location.state === 'fromTopic') {
      // 判斷是不是從子首頁過來的肯定項
      replace(`/topic/${tab}/staffList`);
    } else if (tab === 'endorse' && nextState.location.state !== 'fromTopic') {
      // 判斷route中含有endorse時 (重整、或直衝)
      replace('/topic/followed/staffList');
    }
  },
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      cb(null, require('src/client/containers/topic/staffList').default )
    }, "topicStaffList");
  }
};

export const staffListSubTopic = {
  path: '/topic/:topic/staffList/:subTopic',
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      cb(null, require('src/client/containers/topic/staffList').default )
    }, "topicStaffListSubTopic");
  }
};

export const content = {
  path: '/topic/:topic',
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      cb(null, require('src/client/containers/topic/index').default )
    }, "topicMain");
  }
};

function haveArticleTab(topic) {
	const allTabs = ['hots', 'new', 'experience', 'profession', 'learn', 'person', 'inspirational', 'book', 'invest', 'health', 'travel', 'life', 'movie'];
	return allTabs.indexOf(topic) !== -1;
}

function haveStaffTab(tab) {
  const allTabs = ['followed', 'gallery', 'honor', 'endorse', 'new', 'all'];
  return allTabs.indexOf(tab) !== -1;
}