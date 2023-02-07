/* eslint-disable */
import React from 'react'
import Enzyme, { shallow, render, mount } from 'enzyme';
import { Provider } from 'react-redux';
import Adapter from 'enzyme-adapter-react-15';

// React 15 Enzyme adapter
Enzyme.configure({ adapter: new Adapter() });

/**
 * global functions
 */
global.requestAnimationFrame = (callback) => { setTimeout(callback); };
// redux wrapper
global.shallowWithStore = (component, store) => shallow(component, { context: { store } });  
global.mountWithStore = (component, store) => mount(component, { context: { store } });
// localStorage
global.localStorage = (() => {
  let store = {};
  return {
    getItem(key) {
      return store[key];
    },
    setItem(key, value) {
      store[key] = value.toString();
    },
    removeItem(key) {
      delete store[key];
    },
    clear() {
      store = {};
    }
  };
})();

/**
 * global variables
 */
global.window.env = 'dev';
global.shallow = shallow;
global.render = render;
global.mount = mount;
// global.__DEV__ = true;