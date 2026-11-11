import Svg, { Path, Circle, Rect } from 'react-native-svg';
import { colors } from '../theme';

type Name = 'mail' | 'lock' | 'eye' | 'eye-off' | 'arrow' | 'heart' | 'close' | 'user';
export function Icon({ name, size = 20, color = colors.muted }: { name: Name; size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" accessible={false}>
      {name === 'mail' && <><Rect x="3" y="5" width="18" height="14" rx="3" /><Path d="m4 7 8 6 8-6" /></>}
      {name === 'user' && <><Circle cx="12" cy="8" r="4" /><Path d="M4 22v-3a8 8 0 0 1 16 0v3" /></>}
      {name === 'lock' && <><Rect x="5" y="10" width="14" height="11" rx="3" /><Path d="M8 10V7a4 4 0 0 1 8 0v3M12 15v2" /></>}
      {(name === 'eye' || name === 'eye-off') && <><Path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z" /><Circle cx="12" cy="12" r="2.5" />{name === 'eye-off' && <Path d="m3 3 18 18" />}</>}
      {name === 'arrow' && <Path d="M4 12h16m-6-6 6 6-6 6" />}
      {name === 'heart' && <Path d="M20.8 5.6a5.2 5.2 0 0 0-7.4 0L12 7l-1.4-1.4a5.2 5.2 0 0 0-7.4 7.4L12 22l8.8-9a5.2 5.2 0 0 0 0-7.4Z" />}
      {name === 'close' && <Path d="m6 6 12 12M6 18 18 6" />}
    </Svg>
  );
}
