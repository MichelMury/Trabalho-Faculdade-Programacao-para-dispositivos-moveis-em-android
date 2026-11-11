import { Platform } from 'react-native';

export const colors = {
  background: '#FFF9F6',
  paper: '#FFFFFF',
  ink: '#503D49',
  muted: '#82717C',
  pink: '#C78499',
  pinkDark: '#99556C',
  pinkLight: '#F5E4E8',
  lilac: '#B48AB7',
  mint: '#7CBDB9',
  peach: '#E8BC96',
  line: '#EBDDE1',
  error: '#A1384C',
};

export const serif = Platform.select({ ios: 'Georgia', android: 'serif', default: 'Georgia' });
