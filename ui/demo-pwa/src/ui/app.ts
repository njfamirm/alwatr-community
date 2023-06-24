// TODO: rename me to index
import {alwatrObserve, html, render} from '@alwatr/fract';
import {router} from '@alwatr/router2';
import {alwatrNavigationBar} from '@alwatr/ui-kit/navigation-bar2/navigation-bar.js';
import {alwatrTopAppBar} from '@alwatr/ui-kit/top-app-bar2/top-app-bar.js';
import {renderState} from '@alwatr/util';

import './app.scss';
import {icons} from '../icons.js';
import {appLogger} from '../share/logger.js';

import type {RouteContext} from '@alwatr/router';

appLogger.logModule?.('app');

export type PageName = 'home' | 'favorites' | 'contact' | 'other';

const renderRecord: Record<PageName | '_default', undefined | PageName | (() => unknown)> = {
  _default: 'home',
  favorites: () => html`favorites...`,
  home: () => html`home...`,
  other: () => html`other...`,
  contact: () => html`call...`,
};

appLogger.logModule?.('app');

const alwatrPwa = (): unknown => html`<div class="alwatr-pwa">
  ${alwatrTopAppBar({headline: 'Alwatr PWA Demo'})}
  ${alwatrObserve(router, (route: RouteContext) => renderState(<PageName>route.sectionList[0], renderRecord))}
  ${alwatrNavigationBar({
    itemList: [
      {icon: icons.home, href: '/home'},
      {icon: icons.star, href: '/favorites'},
      {icon: icons.triangle, href: '/other'},
      {icon: icons.call, href: '/contact'},
    ],
  })}
</div>`;

render(alwatrPwa(), document.body);

document.body.classList.remove('loading');

// TODO: send app rendered signal
