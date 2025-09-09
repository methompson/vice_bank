import LuxonAdapter from '@date-io/luxon';
import '@mdi/font/css/materialdesignicons.css';

import 'vuetify/lib/styles/main.sass';
import { createVuetify, type ThemeDefinition } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';

import { VPullToRefresh } from 'vuetify/labs/VPullToRefresh';

const lightTheme: ThemeDefinition = {
  colors: {
    background: '#F9FFF2',
    surface: '#FBFFF8',
    'surface-light': '#FFFFFF',
    'surface-dark': '#E5FCC2',
    primary: '#9DE0AD',
    secondary: '#6DC5C0',
    tertiary: '#547890',
    // 'primary-darken-1': '#0277BD',
    error: '#FF1744',
  },
};

const darkTheme: ThemeDefinition = {
  colors: {
    background: '#263640',
    surface: '#2E414D',
    'surface-light': '#435E70',
    'surface-dark': '#131B20',
    primary: '#257539',
    secondary: '#2C6D6A',
    tertiary: '#547890',
    // 'primary-darken-1': '#01579B',
    // 'surface-light': '#01579B',
    // 'surface-dark': '#003561',
    error: '#FF1744',
  },
};
// const lightTheme: ThemeDefinition = {
//   colors: {
//     primary: '#03A9F4',
//     'primary-darken-1': '#0277BD',
//     'surface-light': '#E1F5FE',
//     'surface-dark': '#B3E5FC',
//     error: '#FF1744',
//   },
// };

// const darkTheme: ThemeDefinition = {
//   colors: {
//     primary: '#0277BD',
//     'primary-darken-1': '#01579B',
//     'surface-light': '#01579B',
//     'surface-dark': '#003561',
//     error: '#FF1744',
//   },
// };

export function getVuetify() {
  const vuetify = createVuetify({
    theme: {
      themes: {
        light: lightTheme,
        dark: darkTheme,
      },
    },
    components: {
      ...components,
      VPullToRefresh,
    },
    directives,
    icons: {
      defaultSet: 'mdi',
    },
    date: {
      adapter: LuxonAdapter,
    },
  });

  return vuetify;
}
