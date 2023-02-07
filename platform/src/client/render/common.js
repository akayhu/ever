"use strict";

import React from "react";
import i18next from "i18next";
import { I18nextProvider } from "react-i18next";
import { Provider } from "react-redux";

const render = (store, i18n, content) => {
	return (
		<Provider store={store}>
			<I18nextProvider i18n={i18n}>
				{content}
			</I18nextProvider>
		</Provider>	
	);
}

export default render;