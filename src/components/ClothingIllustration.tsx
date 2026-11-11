import Svg, { Circle, Ellipse, G, Path, Rect } from 'react-native-svg';

/** Ilustração original vetorial: apenas roupas infantis, sem bebês ou bonecas. */
export function ClothingIllustration() {
  return (
    <Svg width="100%" height="182" viewBox="0 0 360 210" accessibilityRole="image" accessibilityLabel="Roupinhas infantis: um body rosa, um casaquinho e meias">
      <Ellipse cx="180" cy="200" rx="118" ry="6" fill="#F1E5E2" />
      <Path d="M64 191V93a116 116 0 0 1 232 0v98Z" fill="#F8ECE8" />
      <Path d="M84 191V94a96 96 0 0 1 192 0v97" fill="none" stroke="#FFF9F6" strokeWidth="2" />
      <Path d="M42 50q135 35 276-8" fill="none" stroke="#C6B2A3" strokeWidth="2" />
      <G transform="translate(59 58) rotate(-10 40 50)">
        <Path d="M37 3c-5-12 15-12 11-2-2 4-7 3-7 9L12 25q-3 4 3 4h55q6 0 2-4L41 10" fill="none" stroke="#C5A58D" strokeWidth="2.5" />
        <Path d="m24 22-22 15 11 24 14-7-5 59h51l-5-59 14 7 11-24-24-15-10 7H34Z" fill="#D0E5E0" stroke="#A2C6BE" strokeWidth="1.5" />
        <Path d="m34 23 11 16 14-16M45 39v74M23 99h50" stroke="#A2C6BE" strokeWidth="1.5" fill="none" />
        <Circle cx="50" cy="53" r="2" fill="#94B6AE" /><Circle cx="50" cy="69" r="2" fill="#94B6AE" /><Circle cx="50" cy="85" r="2" fill="#94B6AE" />
      </G>
      <G transform="translate(139 43) rotate(7 53 70)">
        <Path d="M49 5c-5-13 16-13 11-2-2 4-8 3-8 10L20 31q-4 5 3 5h61q5 0 1-5L52 13" fill="none" stroke="#C5A58D" strokeWidth="2.5" />
        <Path d="m30 28-26 17 14 25 17-10-4 48q1 14 15 26h20q14-12 15-26l-4-48 17 10 14-25-27-17-13 9H43Z" fill="#E9B5C5" stroke="#D59AAF" strokeWidth="1.5" />
        <Path d="M42 30q12 27 27 0M31 102q14-6 18 30m32-30q-15-6-18 30" stroke="#D59AAF" strokeWidth="2" fill="none" />
        <Path d="M49 68c-8-10-19 3 6 18 25-15 14-28 6-18l-3 3Z" fill="#FFF5F3" />
        <Circle cx="51" cy="128" r="2" fill="#BD8399" /><Circle cx="61" cy="128" r="2" fill="#BD8399" />
      </G>
      <G transform="translate(260 93) rotate(12)">
        <Path d="M0 0h23v32l-8 15q-5 10-16 6-11-4-4-15l5-9Z" fill="#D8C8E6" stroke="#BBA6CC" strokeWidth="1.5" />
        <Path d="M28 3h23v32l-8 15q-5 10-16 6-11-4-4-15l5-9Z" fill="#E1D3EC" stroke="#BBA6CC" strokeWidth="1.5" />
        <Path d="M0 9h23M28 12h23" stroke="#BBA6CC" strokeWidth="2" />
      </G>
      <Rect x="92" y="62" width="5" height="17" rx="2" fill="#D5BBA1" transform="rotate(-7 92 62)" />
      <Rect x="188" y="59" width="5" height="16" rx="2" fill="#D5BBA1" />
      <Path d="m43 121 2-6 2 6 6 2-6 2-2 6-2-6-6-2Zm262 49 2-6 2 6 6 2-6 2-2 6-2-6-6-2Z" fill="#D8B77F" />
      <Circle cx="296" cy="79" r="3" fill="#CBB9D6" /><Circle cx="67" cy="174" r="2.5" fill="#CFB69A" />
    </Svg>
  );
}
