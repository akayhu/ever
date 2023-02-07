"use strict";

import accessRecord from './accessRecord';
import account from './account';
import accountPrivacy from './accountPrivacy';
import accuse from './accuse';
import activity from './activity';
import advertising from './advertising';
import autoComplete from './autoComplete';
import bcCommunication from './bcCommunication';
import channel from './channel';
import connection from './connection';
import documents from './document';
import group from './group';
import integration from './integration';
import message from './message';
import notification from './notification';
import personalConfig from './personalConfig';
import profile from './profile';
import profileAppraise from './profileAppraise';
import profileChronology from './profileChronology';
import profileColleague from './profileColleague';
import profileEndorse from './profileEndorse';
import profileGallery from './profileGallery';
import profileNameCard from './profileNameCard';
import profilePersonal from './profilePersonal';
import search from './search';
import topic from './topic';
import test from './test';
import response from './response';
import pusher from './pusher';

const routesMap = {
	...accessRecord,
	...account,
	...accountPrivacy,
	...accuse,
	...activity,
	...advertising,
	...autoComplete,
	...bcCommunication,
	...channel,
	...connection,
	...documents,
	...group,
	...integration,
	...message,
	...notification,
	...personalConfig,
	...profile,
	...profileAppraise,
	...profileChronology,
	...profileColleague,
	...profileEndorse,
	...profileGallery,
	...profileNameCard,
	...profilePersonal,
	...search,
	...topic,
	...test,
	...response,
	...pusher
};

export default routesMap;